'use strict'
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const {checkSettingsParser} = require('./parser')

function makeSpecEmitter(options) {
    const tracker = makeEmitTracker()
    function python(chunks, ...values) {
        let code = ''
        values.forEach((value, index) => {
            let stringified = ''
            if (value && value.isRef) {
                stringified = value.resolve()
            } else if (typeof value === 'function') {
                stringified = value.toString()
            } else if (typeof value === 'undefined'){
                stringified = 'None'
            } else {
                stringified = JSON.stringify(value)
            }
            code += chunks[index] + stringified
        })
        return code + chunks[chunks.length - 1]
    }

    tracker.storeHook('deps', `import pytest`)
    tracker.storeHook('deps', `from selenium import webdriver`)
    tracker.storeHook('deps', `from selenium.webdriver.common.by import By`)
    tracker.storeHook('deps', `from applitools.selenium import (Region, BrowserType, Configuration, Eyes, Target, VisualGridRunner, ClassicRunner)`)
    tracker.storeHook('deps', `from applitools.common import StitchMode`)

    tracker.storeHook('beforeEach', python`@pytest.fixture(scope="function")`)
    tracker.storeHook('beforeEach', python`def eyes_runner_class():`)
    if (options.executionMode.isVisualGrid) tracker.storeHook('beforeEach', python`    return VisualGridRunner(10)`)
    else tracker.storeHook('beforeEach', python`    return ClassicRunner()`)
    tracker.storeHook('beforeEach', python`\n`)

    if (options.executionMode.isCssStitching || options.executionMode.isScrollStitching) {
        tracker.storeHook('beforeEach', python`@pytest.fixture(scope="function")`)
        tracker.storeHook('beforeEach', python`def stitch_mode():`)
        if (options.executionMode.isCssStitching) tracker.storeHook('beforeEach', python`    return StitchMode.CSS`)
        else tracker.storeHook('beforeEach', python`    return StitchMode.Scroll`)
    }

    const driver = {
        build(options) {
            //return tracker.storeCommand(ruby`await specs.build(${options})`)
            // TODO: implement if needed
        },
        cleanup() {
            tracker.storeCommand(python`driver.quit()`)
        },
        visit(url) {
            tracker.storeCommand(python`driver.get(${url})`)
        },
        executeScript(script, ...args) {
            return tracker.storeCommand(python`driver.execute_script(${script})`)
        },
        sleep(ms) {
            //tracker.storeCommand(ruby`await specs.sleep(driver, ${ms})`)
            // TODO: implement if needed
        },
        switchToFrame(selector) {
            tracker.storeCommand(python`driver.switch_to.frame(${selector})`)
        },
        switchToParentFrame() {
            tracker.storeCommand(python`driver.switch_to.parent_frame()`)
        },
        findElement(selector) {
            return tracker.storeCommand(
                python`driver.find_element_by_css_selector(${selector})`,
            )
        },
        findElements(selector) {
            return tracker.storeCommand(
                python`driver.find_elements_by_css_selector(${selector})`,
            )
        },
        getWindowLocation() {
            // return tracker.storeCommand(ruby`await specs.getWindowLocation(driver)`)
            // TODO: implement if needed
        },
        setWindowLocation(location) {
            // tracker.storeCommand(ruby`await specs.setWindowLocation(driver, ${location})`)
            // TODO: implement if needed
        },
        getWindowSize() {
            return tracker.storeCommand(python`driver.get_window_size()`)
        },
        setWindowSize(size) {
            tracker.storeCommand(python`driver.set_window_size(${size}["width"], ${size}["height"])`)
        },
        click(element) {
            tracker.storeCommand(python`driver.find_element(By.CSS_SELECTOR, ${element}).click()`)
        },
        type(element, keys) {
            tracker.storeCommand(python`driver.find_element(By.CSS_SELECTOR, ${element}).send_keys(${keys})`)
        },
        waitUntilDisplayed() {
            // TODO: implement if needed
        },
        getElementRect() {
            // TODO: implement if needed
        },
        getOrientation() {
            // TODO: implement if needed
        },
        isMobile() {
            // TODO: implement if needed
        },
        isAndroid() {
            // TODO: implement if needed
        },
        isIOS() {
            // TODO: implement if needed
        },
        isNative() {
            // TODO: implement if needed
        },
        getPlatformVersion() {
            // TODO: implement if needed
        },
        getBrowserName() {
            // TODO: implement if needed
        },
        getBrowserVersion() {
            // TODO: implement if needed
        },
        getSessionId() {
            // TODO: implement if needed
        },
        takeScreenshot() {
            // TODO: implement if needed
        },
        getTitle() {
            // TODO: implement if needed
        },
        getUrl() {
            // TODO: implement if needed
        },
    }

    const eyes = {
        open({appName, viewportSize}) {
            tracker.storeCommand(python`conf = eyes.get_configuration()
    conf.app_name = ${appName}
    conf.test_name = ${options.baselineTestName}
    conf.viewport_size = {"width": ${viewportSize.width}, "height": ${viewportSize.height}}
    eyes.set_configuration(conf)
    eyes.open(driver)`)
        },
        check(checkSettings) {
            tracker.storeCommand(`eyes.check("", ${checkSettingsParser(checkSettings)})`)
        },
        checkWindow(tag, matchTimeout, stitchContent) {
            let Tag = !tag ? `` : `tag="${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `,match_timeout=${matchTimeout}`
            tracker.storeCommand(python`eyes.check_window(` + Tag + MatchTimeout + `)`)
        },
        checkFrame(element, matchTimeout, tag) {
            tracker.storeCommand(python`eyes.check(
        ${tag},
        Target.frame(${element})
        .timeout(${matchTimeout})
        .fully()
      )`)
        },
        checkElement(element, matchTimeout, tag) {
            tracker.storeCommand(python`eyes.check(
        ${tag},
        Target.region(${element})
        .timeout(${matchTimeout})
        .fully()
      )`)
        },
        checkElementBy(selector, matchTimeout, tag) {
            tracker.storeCommand(python`eyes.checkElementBy(
        ${selector},
        ${matchTimeout},
        ${tag},
      )`)
        },
        checkRegion(region, matchTimeout, tag) {
            let args = `region='${region}'` +
                `${tag? `, tag=${tag}`: ''}` +
                `${matchTimeout? `, timeout=${matchTimeout}`: ''}`
            tracker.storeCommand(python`eyes.check_region(${args})`)
        },
        checkRegionByElement(element, matchTimeout, tag) {
            tracker.storeCommand(python`eyes.checkRegionByElement(
        ${element},
        ${tag},
        ${matchTimeout},
      )`)
        },
        checkRegionBy(selector, tag, matchTimeout, stitchContent) {
            tracker.storeCommand(python`eyes.checkRegionByElement(
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      )`)
        },
        checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
            tracker.storeCommand(python`eyes.check_region_in_frame(
        ${frameReference},
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      )`)
        },
        close(throwEx) {
            let isThrow = throwEx.toString()
            tracker.storeCommand(python`eyes.close(raise_ex=` + isThrow[0].toUpperCase() + isThrow.slice(1) + `)`)
        },
        abort() {
            tracker.storeCommand(python`eyes.abort`)
        },
    }

    return {tracker, driver, eyes}
}

function getVal (val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}

module.exports = makeSpecEmitter