'use strict'
const {checkSettingsParser, python} = require('./parser')

module.exports = function (tracker, test) {
    const {addSyntax, addCommand, addHook} = tracker



    addHook('deps', `import pytest`)
    addHook('deps', `from selenium import webdriver`)
    addHook('deps', `from selenium.webdriver.common.by import By`)
    addHook('deps', `from applitools.selenium import (Region, BrowserType, Configuration, Eyes, Target, VisualGridRunner, ClassicRunner)`)
    addHook('deps', `from applitools.common import StitchMode`)

    addSyntax('var', ({name, value}) => `${name} = ${value}`)
    addSyntax('getter', ({target, key}) => `${target}${key.startsWith('get') ? `.${key.slice(3).toLowerCase()}` : `["${key}"]`}`)
    addSyntax('call', ({target, args}) => args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}`)

    addHook('beforeEach', python`@pytest.fixture(scope="function")`)
    addHook('beforeEach', python`def eyes_runner_class():`)
    if (test.config.vg) addHook('beforeEach', python`    return VisualGridRunner(10)`)
    else addHook('beforeEach', python`    return ClassicRunner()`)
    addHook('beforeEach', python`\n`)

    if (test.config.stitchMode) {
        addHook('beforeEach', python`@pytest.fixture(scope="function")`)
        addHook('beforeEach', python`def stitch_mode():`)
        if (test.config.stitchMode === 'CSS') addHook('beforeEach', python`    return StitchMode.CSS`)
        else addHook('beforeEach', python`    return StitchMode.Scroll`)
    }

    const driver = {
        constructor: {
            isStaleElementError(error) {
                return addCommand(python`StaleElementError`)
            },
        },
        cleanup() {
            return addCommand(python`driver.quit()`)
        },
        visit(url) {
            return addCommand(python`driver.get(${url})`)
        },
        executeScript(script, ...args) {
            if(args.length > 0) console.log('Need to Implement args for the execute script')
            return addCommand(python`driver.execute_script(${script})`)
        },
        sleep(ms) {
            console.log('Sleep was used Need to Implement')
            // TODO: implement if needed
        },
        switchToFrame(selector) {
            return addCommand(python`driver.switch_to.frame(${selector})`)
        },
        switchToParentFrame() {
            return addCommand(python`driver.switch_to.parent_frame()`)
        },
        findElement(selector) {
            return addCommand(
                python`driver.find_element_by_css_selector(${selector})`,
            )
        },
        findElements(selector) {
            return addCommand(
                python`driver.find_elements_by_css_selector(${selector})`,
            )
        },
        getWindowLocation() {
            // return addCommand(ruby`await specs.getWindowLocation(driver)`)
            // TODO: implement if needed
        },
        setWindowLocation(location) {
            // addCommand(ruby`await specs.setWindowLocation(driver, ${location})`)
            // TODO: implement if needed
        },
        getWindowSize() {
            return addCommand(python`driver.get_window_size()`)
        },
        setWindowSize(size) {
            return addCommand(python`driver.set_window_size(${size}["width"], ${size}["height"])`)
        },
        click(element) {
            return addCommand(python`driver.find_element(By.CSS_SELECTOR, ${element}).click()`)
        },
        type(element, keys) {
            return addCommand(python`${element}.send_keys(${keys})`)
        },
        scrollIntoView(element, align){
            console.log('scroll into view Need to be implemented')
            return addCommand(python`scroll_into_view`)
        },
        hover(element, offset) {
            console.log('hover Need to be implemented')
            return addCommand(python`hover`)
        },
    }

    const eyes = {

        constructor: {
            setViewportSize(viewportSize) {
                return addCommand(python`Eyes.set_viewport_size(driver, ${viewportSize})`)
            }
        },

        getViewportSize(){
          return addCommand(python`eyes.get_viewport_size(driver)`)
        },

        runner: {
            getAllTestResults(throwEx) {
                return addCommand(python`eyes.getRunner().getAllTestResults()`)
            },
        },

        open({appName, viewportSize}) {
            let special_branch = '\n    '
            if ((`${test.config.baselineName}` === 'TestCheckOverflowingRegionByCoordinates_Fluent')
                || (`${test.config.baselineName}` === 'TestCheckOverflowingRegionByCoordinates_Fluent_Scroll')
            )
                special_branch = '\n    eyes.configure.branch_name = \"master_python\"\n    '
            return addCommand(python`conf = eyes.get_configuration()
    conf.app_name = ${appName}
    conf.test_name = ${test.config.baselineName}
    conf.viewport_size = ${viewportSize}
    eyes.set_configuration(conf)` + special_branch +
                `eyes.open(driver)`)
        },
        check(checkSettings) {
            return addCommand(`eyes.check("", ${checkSettingsParser(checkSettings)})`)
        },
        checkWindow(tag, matchTimeout, stitchContent) {
            let Tag = !tag ? `` : `tag="${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `,match_timeout=${matchTimeout}`
            return addCommand(python`eyes.check_window(` + Tag + MatchTimeout + `)`)
        },
        checkFrame(element, matchTimeout, tag) {
            return addCommand(python`eyes.check(
        ${tag},
        Target.frame(${element})
        .timeout(${matchTimeout})
        .fully()
      )`)
        },
        checkElement(element, matchTimeout, tag) {
            return addCommand(python`eyes.check(
        ${tag},
        Target.region(${element})
        .timeout(${matchTimeout})
        .fully()
      )`)
        },
        checkElementBy(selector, matchTimeout, tag) {
            return addCommand(python`eyes.check_region(
        [By.CSS_SELECTOR, ${selector}],
        tag=${tag},
        match_timeout=${matchTimeout},
      )`)
        },
        checkRegion(region, matchTimeout, tag) {
            let args = `region='${region}'` +
                `${tag ? `, tag=${tag}` : ''}` +
                `${matchTimeout ? `, timeout=${matchTimeout}` : ''}`
            return addCommand(python`eyes.check_region(${args})`)
        },
        checkRegionByElement(element, matchTimeout, tag) {
            return addCommand(python`eyes.checkRegionByElement(
        ${element},
        ${tag},
        ${matchTimeout},
      )`)
        },
        checkRegionBy(selector, tag, matchTimeout, stitchContent) {
            return addCommand(python`eyes.checkRegionByElement(
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      )`)
        },
        checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
            return addCommand(python`eyes.check_region_in_frame(
        ${frameReference},
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      )`)
        },
        close(throwEx=true) {
            let isThrow = throwEx.toString()
            return addCommand(python`eyes.close(raise_ex=` + isThrow[0].toUpperCase() + isThrow.slice(1) + `)`)
        },
        abort() {
            return addCommand(python`eyes.abort`)
        },
        locate(visualLocatorSettings){
            return addCommand(python`eyes.locate(${visualLocatorSettings})`)
        },
    }

    const assert = {
        equal(actual, expected, message) {
            return addCommand(python`assert.deepStrictEqual(${actual}, ${expected}, ${message})`)
        },
        notEqual(actual, expected, message) {
            return addCommand(python`assert.notDeepStrictEqual(${actual}, ${expected}, ${message})`)
        },
        ok(value, message) {
            return addCommand(python`assert.ok(${value}, ${message})`)
        },
        instanceOf(object, className, message) {
            return addCommand(python`assert.ok(${object}.constructor.name === ${className}, ${message})`)
        },
        throws(func, check, message) {
            let command
            if (check) {
                command = python`await assert.rejects(
          async () => {${func}},
          error => {error},
          ${message},
        )`
            } else {
                command = python`await assert.rejects(
            async () => {${func}},
            undefined,
            ${message},
          )`
            }
            return addCommand(command)
        },
    }

    const helpers = {
        getTestInfo(result) {
            return addCommand(python`await getTestInfo(${result})`).type('TestInfo')
        },
    }

    return {driver, eyes, assert, helpers}
}

function getVal(val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}


