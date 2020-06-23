'use strict'
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')

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
                stringified = 'nil'
            } else {
                stringified = JSON.stringify(value)
            }
            code += chunks[index] + stringified
        })
        return code + chunks[chunks.length - 1]
    }

    tracker.storeHook('deps', `import pytest`)
    tracker.storeHook('deps', `from selenium import webdriver`)
    tracker.storeHook('deps', `from applitools.selenium import (BrowserType, Configuration, Eyes, Target, VisualGridRunner, ClassicRunner)`)
    tracker.storeHook('deps', `from applitools.common import StitchMode`)

    // tracker.storeHook('vars', `eyes = None`)
    // tracker.storeHook('vars', `driver = None`)
    // tracker.storeHook('vars', `batch = None`)

    tracker.storeHook('beforeEach', python`@pytest.fixture(scope="session")`)
    tracker.storeHook('beforeEach', python`def eyes_runner_class():`)
    if (options.executionMode.isVisualGrid) tracker.storeHook('beforeEach', python`    return VisualGridRunner(10)`)
    else tracker.storeHook('beforeEach', python`    return ClassicRunner()`)
    tracker.storeHook('beforeEach', python`\n`)

    if (options.executionMode.isCssStitching || options.executionMode.isScrollStitching) {
        tracker.storeHook('beforeEach', python`@pytest.fixture(scope="session")`)
        tracker.storeHook('beforeEach', python`def stitch_mode():`)
        if (options.executionMode.isCssStitching) tracker.storeHook('beforeEach', python`    return StitchMode.CSS`)
        else tracker.storeHook('beforeEach', python`    return StitchMode.Scroll`)
    }


    // tracker.storeHook('afterEach', python`global driver`)
    // tracker.storeHook('afterEach', python`driver.quit()`)
    // tracker.storeHook('afterEach', python`global eyes`)
    // tracker.storeHook('afterEach', python`eyes.close(False)`)

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
            return tracker.storeCommand(python`driver.execute_script(${script}, ...${args})`)
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
            return tracker.storeCommand(python`driver.driver.get_window_size()`)
        },
        setWindowSize(size) {
            tracker.storeCommand(python`driver.set_window_size(${size}["width"], ${size}["height"])`)
        },
        click(element) {
            tracker.storeCommand(python`${element}.click()`)
        },
        type(element, keys) {
            tracker.storeCommand(python`${element}.send_keys(${keys})`)
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
    conf.test_name =  ${options.baselineTestName}
    conf.viewport_size = {"width": ${viewportSize.width}, "height": ${viewportSize.height}}
    conf.stitch_mode == StitchMode.CSS
    eyes.set_configuration(conf)
    eyes.open(driver)`)
        },
        check(checkSettings) {
            tracker.storeCommand(python`eyes.check("", ${checkSettings})`)
        },
        checkWindow(tag, matchTimeout, stitchContent) {
            let Tag = !tag ? `` : `tag=${tag}`
            let MatchTimeout = !matchTimeout ? `` : `match_timeout=${matchTimeout}`
            tracker.storeCommand(python`eyes.check_window(` + Tag + MatchTimeout + `)`)
        },
        checkFrame(element, matchTimeout, tag) {
            let args = `name_or_id: '${element}'` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, timeout: ${matchTimeout}`: ''}`
            tracker.storeCommand(`eyes.check_frame(${args})`)
        },
        checkElement(element, matchTimeout, tag) {
            tracker.storeCommand(python`eyes.checkElement(
        ${element},
        ${matchTimeout},
        ${tag},
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
            let args = `css: '${region}'` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, timeout: ${matchTimeout}`: ''}`
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

module.exports = makeSpecEmitter