'use strict'
const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const {checkSettingsParser} = require('./parser')

function makeSpecEmitter(options) {
    const tracker = makeEmitTracker()
    function dot_net(chunks, ...values) {
        let code = ''
        values.forEach((value, index) => {
            let stringified = ''
            if (value && value.isRef) {
                stringified = value.resolve()
            } else if (typeof value === 'function') {
                stringified = value.toString()
            } else if (typeof value === 'undefined'){
                stringified = 'null'
            } else {
                stringified = JSON.stringify(value)
            }
            code += chunks[index] + stringified
        })
        return code + chunks[chunks.length - 1]
    }

    function argumentCheck(actual, ifUndefined){
        return (typeof actual === 'undefined') ? ifUndefined : actual
    }

    tracker.storeHook('deps', `using NUnit.Framework;`)
    tracker.storeHook('deps', `using OpenQA.Selenium;`)
    tracker.storeHook('deps', `using Applitools.Utils.Geometry;`)
    tracker.storeHook('deps', `using System.Drawing;`)

    tracker.storeHook('beforeEach', dot_net`    initEyes(${argumentCheck(options.executionMode.isVisualGrid, false)}, ${argumentCheck(options.executionMode.isCssStitching, false)});`)

    tracker.storeHook('afterEach', dot_net`    driver.Quit();`)
    tracker.storeHook('afterEach', dot_net`    eyes.AbortIfNotClosed();`)



    const driver = {
        build(options) {
            //return tracker.storeCommand(ruby`await specs.build(${options})`)
            // TODO: implement if needed
        },
        cleanup() {
            tracker.storeCommand(dot_net`driver.Quit();`)
        },
        visit(url) {
            tracker.storeCommand(dot_net`driver.Navigate().GoToUrl(${url});`)
        },
        executeScript(script, ...args) {
            return tracker.storeCommand(dot_net`IJavaScriptExecutor js = (IJavaScriptExecutor)driver;
js.ExecuteScript(${script});`)
        },
        sleep(ms) {
            //tracker.storeCommand(ruby`await specs.sleep(driver, ${ms})`)
            // TODO: implement if needed
        },
        switchToFrame(selector) {
            tracker.storeCommand(dot_net`driver.SwitchTo.Frame(${selector});`)
        },
        switchToParentFrame() {
            tracker.storeCommand(dot_net`driver.SwitchTo.ParentFrame();`)
        },
        findElement(selector) {
            return tracker.storeCommand(
                dot_net`driver.FindElement(By.CssSelector(${selector}));`,
            )
        },
        findElements(selector) {
            return tracker.storeCommand(
                dot_net`driver.FindElements(By.CssSelector(${selector}));`,
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
            return tracker.storeCommand(dot_net`driver.Manage().Window.Size;`)
        },
        setWindowSize(size) {
            tracker.storeCommand(dot_net`driver.Manage().Window.Size = ${size};`)
        },
        click(element) {
            tracker.storeCommand(dot_net`driver.FindElement(By.CssSelector(${element})).Click();`)
        },
        type(element, keys) {
            tracker.storeCommand(dot_net`${element}.SendKeys(${keys});`)
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
            tracker.storeCommand(dot_net`
        eyes.Open(driver, ${appName}, ${options.baselineTestName}, new RectangleSize(width:${viewportSize.width}, height:${viewportSize.height}));`)
        },
        check(checkSettings) {
            tracker.storeCommand(`eyes.Check(${checkSettingsParser(checkSettings)});`)
        },
        checkWindow(tag, matchTimeout, stitchContent) {
            let Tag = !tag ? `` : `tag:"${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `,match_timeout:${matchTimeout}`
            tracker.storeCommand(dot_net`eyes.CheckWindow(` + Tag + MatchTimeout + `);`)
        },
        checkFrame(element, matchTimeout, tag) {
            let args = `"${getVal(element)}"` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, timeout: ${matchTimeout}`: ''}`
            tracker.storeCommand(`eyes.CheckFrame(${args});`)
        },
        checkElement(element, matchTimeout, tag) {
            tracker.storeCommand(dot_net`eyes.CheckElement(
        ${element},
        ${matchTimeout},
        ${tag},
      );`)
        },
        //is absent in DotNet SDK
        checkElementBy(selector, matchTimeout, tag) {
            tracker.storeCommand(dot_net`/*eyes.checkElementBy is absent in DotNet SDK
            eyes.checkElementBy(
        ${selector},
        ${matchTimeout},
        ${tag},
      );*/`)
        },
        checkRegion(region, matchTimeout, tag) {
            let args = `region: '${region}'` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, matchTimeout: ${matchTimeout}`: ''}`
            tracker.storeCommand(dot_net`eyes.CheckRegion(${args});`)
        },
        //is absent in DotNet SDK
        checkRegionByElement(element, matchTimeout, tag) {
            tracker.storeCommand(dot_net`eyes.checkRegionByElement(
        ${element},
        ${tag},
        ${matchTimeout},
      );`)
        },
        //is absent in DotNet SDK
        checkRegionBy(selector, tag, matchTimeout, stitchContent) {
            tracker.storeCommand(dot_net`eyes.checkRegionByElement(
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      );`)
        },
        checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
            tracker.storeCommand(dot_net`eyes.CheckRegionInFrame(
        ${frameReference},
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      );`)
        },
        close(throwEx) {
            tracker.storeCommand(dot_net`eyes.Close(throwEx: ${throwEx});`)
        },
        abort() {
            tracker.storeCommand(dot_net`eyes.Abort();`)
        },
    }

    return {tracker, driver, eyes}
}

function getVal (val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}

module.exports = makeSpecEmitter