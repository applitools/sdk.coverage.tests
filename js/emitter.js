function js(chunks, ...values) {
  const commands = []
  let code = ''
  values.forEach((value, index) => {
    if (typeof value === 'function' && !value.isRef) {
      code += chunks[index]
      commands.push(code, value)
      code = ''
    } else {
      code += chunks[index] + serialize(value)
    }
  })
  code += chunks[chunks.length - 1]
  commands.push(code)
  return commands
}

function serialize(data) {
  if (data && data.isRef) {
    return data.ref()
  } else if (Array.isArray(data)) {
    return `[${data.map(serialize).join(', ')}]`
  } else if (typeof data === 'object' && data !== null) {
    const properties = Object.entries(data).reduce((data, [key, value]) => {
      return value !== undefined ? data.concat(`${key}: ${serialize(value)}`) : data
    }, [])
    return `{${properties.join(', ')}}`
  } else {
    return JSON.stringify(data)
  }
}

module.exports = function(tracker, test) {
  const {useRef, addSyntax, addCommand, addExpression, addHook, withScope} = tracker

  addSyntax('var', ({constant, name, value}) => `${constant ? 'const' : 'let'} ${name} = ${value}`)
  addSyntax('getter', ({target, key}) => `${target}['${key}']`)
  addSyntax('call', ({target, args}) => `${target}(${js`...${args}`})`)
  addSyntax('return', ({value}) => `return ${value}`)

  addHook('deps', `const path = require('path')`)
  addHook('deps', `const assert = require('assert')`)
  addHook('deps', `const {getTestInfo, getTestDom} = require('@applitools/test-utils')`)

  if (process.env.SPEC_DRIVER) addHook('deps', `const spec = require('${process.env.SPEC_DRIVER}')`)
  else addHook('deps', `const spec = require(path.resolve('./dist/spec-driver'))`)

  if (process.env.SETUP_EYES) addHook('deps', `const setupEyes = require('${process.env.SETUP_EYES}')`)
  else addHook('deps', `const setupEyes = require('@applitools/test-utils/src/setup-eyes')`)

  if (!process.env.NO_SDK) addHook('deps', `const sdk = require(process.cwd())`)

  addHook('vars', `let driver, destroyDriver, eyes`)

  addHook('beforeEach', js`
    ;[driver, destroyDriver] = await spec.build(${{eg: test.executionGrid, ...(test.env || {browser: 'chrome'})}})
    eyes = setupEyes(${{vg: test.vg, displayName: test.name, ...test.config, driver: useRef({deref: 'driver'})}})
  `)


  addHook('afterEach', js`
    try {
      await eyes.abort()
    } finally {
      await destroyDriver(driver)
    }
  `)

  const driver = {
    constructor: {
      isStaleElementError(error) {
        return addCommand(js`spec.isStaleElementError(${error})`)
      },
    },
    visit(url) {
      addCommand(js`await spec.visit(driver, ${url})`)
    },
    getUrl() {
      return addCommand(js`await spec.getUrl(driver)`)
    },
    executeScript(script, ...args) {
      return addCommand(js`await spec.executeScript(driver, ${script}, ...${args})`)
    },
    sleep(ms) {
      addCommand(js`await spec.sleep(driver, ${ms})`)
    },
    switchToFrame(element) {
      addCommand(js`await spec.childContext(driver, ${element})`)
    },
    switchToParentFrame() {
      addCommand(js`await spec.mainContext(driver)`)
    },
    findElement(selector, parent) {
      return addExpression(js`await spec.findElement(driver, spec.transformSelector(${selector}), ${parent})`)
    },
    findElements(selector, parent) {
      return addExpression(js`await spec.findElements(driver, spec.transformSelector(${selector}), ${parent})`)
    },
    click(element) {
      addCommand(js`await spec.click(driver, spec.transformSelector(${element}))`)
    },
    type(element, keys) {
      addCommand(js`await spec.type(driver, spec.transformSelector(${element}), ${keys})`)
    },
    scrollIntoView(element, align) {
      addCommand(js`await spec.scrollIntoView(driver, spec.transformSelector(${element}), ${align})`)
    },
    hover(element, offset) {
      addCommand(js`await spec.hover(driver, spec.transformSelector(${element}), ${offset})`)
    },
  }

  const eyes = {
    constructor: {
      setViewportSize(viewportSize) {
        addCommand(js`await eyes.constructor.setViewportSize(driver, ${viewportSize})`)
      },
    },
    setConfiguration(config) {
      addCommand(js`await eyes.setConfiguration(new Configuration(${config}))`)
    },
    runner: {
      getAllTestResults(throwEx) {
        return addCommand(js`await eyes.getRunner().getAllTestResults(${throwEx})`)
      },
    },
    open({appName, testName, viewportSize}) {
      return addCommand(
        js`await eyes.open(
            driver,
            ${appName},
            ${testName || test.config.baselineName},
            ${viewportSize},
          )`,
      )
    },
    check(checkSettings = {}) {
      const transformRegion = region => {
        return (!region.isRef && (region.left != null || region.top != null)) ? {x: region.left, y: region.top, width: region.width, height: region.height} : region
      }
      checkSettings = {
        ...checkSettings,
        region: checkSettings.region && transformRegion(checkSettings.region),
        ignoreRegions: checkSettings.ignoreRegions && checkSettings.ignoreRegions.map(transformRegion),
        strictRegions: checkSettings.strictRegions && checkSettings.strictRegions.map(transformRegion),
        contentRegions: checkSettings.contentRegions && checkSettings.contentRegions.map(transformRegion),
        layoutRegions: checkSettings.layoutRegions && checkSettings.layoutRegions.map(transformRegion),
        floatingRegions: checkSettings.floatingRegions && checkSettings.floatingRegions.map(({region, ...other}) => ({region: transformRegion(region), ...other})),
        accessibilityRegions: checkSettings.accessibilityRegions && checkSettings.accessibilityRegions.map(({region, ...other}) => ({region: transformRegion(region), ...other})),
        fully: checkSettings.isFully,
      }
      if (test.api !== 'classic') {
        return addCommand(js`await eyes.check(${checkSettings})`)
      } else if (checkSettings.region) {
        if (checkSettings.frames && checkSettings.frames.length > 0) {
          const [frameReference] = checkSettings.frames
          return addCommand(js`await eyes.checkRegionInFrame(
            ${frameReference.frame || frameReference},
            ${checkSettings.region},
            ${checkSettings.timeout},
            ${checkSettings.name},
            ${checkSettings.fully},
          )`)
        }
        return addCommand(js`await eyes.checkRegionBy(
          ${checkSettings.region},
          ${checkSettings.name},
          ${checkSettings.timeout},
          ${checkSettings.fully},
        )`)
      } else if (checkSettings.frames && checkSettings.frames.length > 0) {
        const [frameReference] = checkSettings.frames
        return addCommand(js`await eyes.checkFrame(
          ${frameReference.frame || frameReference},
          ${checkSettings.timeout},
          ${checkSettings.name},
        )`)
      } else {
        return addCommand(js`await eyes.checkWindow(
          ${checkSettings.name},
          ${checkSettings.timeout},
          ${checkSettings.fully}
        )`)
      }
    },
    close(throwEx) {
      return addCommand(js`await eyes.close(${throwEx})`)
    },
    abort() {
      return addCommand(js`await eyes.abort()`)
    },
    getViewportSize() {
      return addCommand(js`await eyes.getViewportSize()`).type('RectangleSize')
    },
    locate(visualLocatorSettings) {
      return addCommand(js`await eyes.locate(${visualLocatorSettings})`)
    },
    extractText(regions) {
      return addCommand(js`await eyes.extractText(${regions})`)
    },
    extractTextRegions(settings) {
      return addCommand(js`await eyes.extractTextRegions(${settings})`)
    }
  }

  const assert = {
    equal(actual, expected, message) {
      addCommand(js`assert.deepStrictEqual(${actual}, ${expected}, ${message})`)
    },
    notEqual(actual, expected, message) {
      addCommand(js`assert.notDeepStrictEqual(${actual}, ${expected}, ${message})`)
    },
    ok(value, message) {
      addCommand(js`assert.ok(${value}, ${message})`)
    },
    instanceOf(object, typeName, message) {
      addCommand(js`assert.ok(${object} instanceof sdk[${typeName}], ${message})`)
    },
    throws(func, check, message) {
      let command
      if (check) {
        command = js`await assert.rejects(
          async () => {${func}},
          error => {${withScope(check, ['error'])}},
          ${message},
        )`
      } else {
        command = js`await assert.rejects(
          async () => {${func}},
          undefined,
          ${message},
        )`
      }
      addCommand(command)
    },
  }

  const helpers = {
    delay(milliseconds) {
      return addCommand(js`await new Promise(r => setTimeout(r, ${milliseconds}))`)
    },
    getTestInfo(result) {
      return addCommand(js`await getTestInfo(${result})`)
    },
    getDom(result, domId) {
      return addCommand(js`await getTestDom(${result}, ${domId})`).methods({
        getNodesByAttribute: (dom, name) => addExpression(js`${dom}.getNodesByAttribute(${name})`)
      })
    },
    math: {
      round(number) {
        return addExpression(js`(Math.round(${number}) || 0)`)
      },
    }
  }

  return {driver, eyes, assert, helpers}
}
