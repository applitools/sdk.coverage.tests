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
  } else if (typeof data === 'object' && data !== null && !(data.constructor && data.constructor.name === 'String')) {
    const properties = Object.entries(data).reduce((data, [key, value]) => {
      return value !== undefined ? data.concat(`${key}: ${serialize(value)}`) : data
    }, [])
    return `{${properties.join(', ')}}`
  } else {
    return JSON.stringify(data)
  }
}

module.exports = function(tracker, test) {
  const {useRef, addSyntax, addCommand, addExpression, addHook, addType, withScope} = tracker

  addSyntax('var', ({constant, name, value}) => `${constant ? 'const' : 'let'} ${name} = ${value}`)
  addSyntax('getter', ({target, key}) => `${target}['${key}']`)
  addSyntax('call', ({target, args}) => `${target}(${js`...${args}`})`)
  addSyntax('return', ({value}) => `return ${value}`)
  addSyntax('cast', ({target, currentType, castType}) => {
    if (castType.name === 'JSON' && currentType && currentType.toJSON) {
      return currentType.toJSON(target, currentType.generic)
    }
    return target
  })

  addType('Record', {
    toJSON: (target, generic) => js`Object.entries(${useRef({deref: target})}).reduce((json, [key, value]) => {
      return Object.assign(json, {[${useRef({deref: 'key', type: generic[0]})}]: ${useRef({deref: 'value', type: generic[1]}).as('JSON')}})
    }, {})`
  })
  addType('Array', {
    toJSON: (target, generic) => js`${useRef({deref: target})}.map((item) => {
      return ${useRef({deref: 'item', type: generic[0]}).as('JSON')}
    })`
  })
  addType('Region', {
    toJSON: (target) => `{left: ${target}.x, top: ${target}.y, width: ${target}.width, height: ${target}.height}`
  })

  addHook('deps', `const path = require('path')`)
  addHook('deps', `const assert = require('assert')`)
  addHook('deps', `const {getTestInfo, getTestDom} = require('@applitools/test-utils')`)

  
  if (process.env.SETUP_EYES) addHook('deps', `const setupEyes = require('${process.env.SETUP_EYES}')`)
  else addHook('deps', `const setupEyes = require('@applitools/test-utils/src/setup-eyes')`)
  
  if (!process.env.NO_DRIVER) {
    if (process.env.SPEC_DRIVER) addHook('deps', `const spec = require('${process.env.SPEC_DRIVER}')`)
    else addHook('deps', `const spec = require(path.resolve('./dist/spec-driver'))`)
  }

  if (!process.env.NO_SDK) addHook('deps', `const sdk = require(process.cwd())`)

  addHook('vars', `let driver, transformedDriver, destroyDriver, eyes`)

  if (!process.env.NO_DRIVER) {
    const env = test.env || {browser: 'chrome'}
    addHook('beforeEach', js`
      let attempt = 0
      while (!driver) {
        try {
          ;[driver, destroyDriver] = await spec.build(${{...env, url: useRef({deref: process.env.APPLITOOLS_TEST_REMOTE === 'ec' && env.browser === 'chrome' && !env.device ? js`await sdk.Eyes.getExecutionCloudUrl()` : undefined})}})
        } catch (err) {
          if (attempt++ > 7) throw err
        }
      }
      transformedDriver = spec.transformDriver ? spec.transformDriver(driver) : driver
    `)
  }
  
  addHook('beforeEach', js`
    eyes = setupEyes(${{vg: test.vg, displayName: test.name, ...test.config, driver: useRef({deref: 'driver'})}})
  `)

  addHook('afterEach', js`
    try {
      if (eyes) await eyes.abort()
    } finally {
      if (destroyDriver) await destroyDriver(driver)
    }
  `)

  const driver = {
    constructor: {
      isStaleElementError(error) {
        return addCommand(js`spec.isStaleElementError(${error})`)
      },
    },
    visit(url) {
      addCommand(js`await spec.visit(transformedDriver, ${url})`)
    },
    getUrl() {
      return addCommand(js`await spec.getUrl(transformedDriver)`)
    },
    executeScript(script, ...args) {
      return addCommand(js`await spec.executeScript(transformedDriver, ${script}, ...${args})`)
    },
    sleep(ms) {
      addCommand(js`await spec.sleep(transformedDriver, ${ms})`)
    },
    switchToFrame(element) {
      addCommand(js`await spec.childContext(transformedDriver, ${element})`)
    },
    switchToParentFrame() {
      addCommand(js`await spec.mainContext(transformedDriver)`)
    },
    findElement(selector, parent) {
      return addExpression(js`await spec.findElement(transformedDriver, spec.transformSelector(${selector}), ${parent})`)
    },
    findElements(selector, parent) {
      return addExpression(js`await spec.findElements(transformedDriver, spec.transformSelector(${selector}), ${parent})`)
    },
    click(element) {
      addCommand(js`await spec.click(transformedDriver, await spec.findElement(transformedDriver, spec.transformSelector(${element})))`)
    },
    type(element, keys) {
      addCommand(js`await spec.setElementText(transformedDriver, spec.transformSelector(${element}), ${keys})`)
    },
    scrollIntoView(element, align) {
      addCommand(js`await spec.scrollIntoView(transformedDriver, spec.transformSelector(${element}), ${align})`)
    },
    hover(element, offset) {
      addCommand(js`await spec.hover(transformedDriver, spec.transformSelector(${element}), ${offset})`)
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
      if (!process.env.NO_DRIVER) {
        return addCommand(
          js`await eyes.open(driver, ${appName}, ${testName || test.config.baselineName}, ${viewportSize})`,
        )
      } else {
        return addCommand(
          js`await eyes.open(${appName}, ${testName || test.config.baselineName}, ${viewportSize})`,
        )
      }
    },
    check({image, dom, ...checkSettings} = {}) {
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
        lazyLoad: checkSettings.lazyLoad,
      }
      if (test.api !== 'classic') {
        return image
          ? addCommand(js`await eyes.check(${{image, dom}}, ${checkSettings})`)
          : addCommand(js`await eyes.check(${checkSettings})`)
      } else if (checkSettings.region) {
        if (image) {
          return addCommand(js`await eyes.checkRegion(${image}, ${checkSettings.region}, ${checkSettings.name})`)
        }
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
      } else if (image) {
        return addCommand(js`await eyes.checkImage(${image}, ${checkSettings.name})`)
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
      return addCommand(js`await eyes.locate(${visualLocatorSettings})`).type('Record<string, Array<Region>>')
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
      addCommand(js`assert.deepStrictEqual(${actual.as('JSON')}, ${expected}, ${message})`)
    },
    notEqual(actual, expected, message) {
      addCommand(js`assert.notDeepStrictEqual(${actual}, ${expected}, ${message})`)
    },
    ok(value, message) {
      addCommand(js`assert.ok(${value}, ${message})`)
    },
    contains(value, search, message) {
      addCommand(js`assert.ok(${value}.includes(${search})), ${message}`)
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
      addCommand(js`await new Promise(done => setTimeout(done, 5000))`)
      return addCommand(js`await getTestInfo(${result}, eyes.configuration && eyes.configuration.apiKey)`)
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
