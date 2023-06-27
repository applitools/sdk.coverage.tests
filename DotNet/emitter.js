'use strict'
const types = require('./mapping/types')
const { checkSettingsParser, dot_net, getter, variable, call, returnSyntax, wrapSelector, parseEnv, takeSelector} = require('./parser')
const util = require('util')
const selectors = require('./mapping/selectors')
const {execSync} = require('child_process')
const sdk_coverage_tests_repo_webURL = "https://github.com/applitools/sdk.coverage.tests.git"
const sdk_coverage_tests_repo_branch = "master"
let counter = 0

const ImageMatchSettings = {
    type: "ImageMatchSettings",
    schema: {
        enablePatterns: "BooleanObject",
        ignoreDisplacements: 'BooleanObject',
        floating: { type: 'Array', items: 'FloatingRegion' },
        accessibility: { type: 'Array', items: 'AccessibilityRegion' },
        accessibilitySettings: {
            type: 'AccessibilitySettings',
            schema: { level: 'AccessibilityLevel', version: 'AccessibilityGuidelinesVersion' },
        },
        ignore: { type: 'Array', items: 'Region' },
        strict: { type: 'Array', items: 'Region' },
        content: { type: 'Array', items: 'Region' },
        layout: { type: 'Array', items: 'Region' }
    },
}
const Location = {
    type: 'Location',
    schema: {
        x: 'Number',
        y: 'Number'
    }
}

const TestResults = {
    type: "TestResults",
    schema: {
        isAborted: "Boolean",
        status: "String",
    }
}

function serializeOutput(data) {
    let output = data.ref()
    return output
}

function argumentCheck(actual, ifUndefined) {
    return (typeof actual === 'undefined') ? ifUndefined : actual
}

function printCommitHash(webURL, branch) {
    let currentRepoRemotes = execSync("git remote -v")
    if (currentRepoRemotes.includes('sdk_coverage_tests_repo')) execSync("git remote remove sdk_coverage_tests_repo")
    execSync("git remote add sdk_coverage_tests_repo " + webURL)
    execSync("git fetch --quiet --all")
    console.log("sdk.coverage.tests repo - last commit data:")
    console.log("************************************************")
    console.log(execSync("git log -n 1 sdk_coverage_tests_repo/" + branch).toString().trim())
    console.log("************************************************")
}

module.exports = function (tracker, test) {
    const { addSyntax, addCommand, addHook, addExpression } = tracker

    function argumentCheck(actual, ifUndefined) {
        return (typeof actual === 'undefined') ? ifUndefined : actual
    }

    function addType(obj, type, generic) {
        return type ? { value: obj, type: type, generic: generic } : obj
    }

    function getTypeName(obj) {
        return obj.type().name
    }

    function emptyValue() {
        return {
            isRef: true,
            ref: () => ''
        }
    }

    function insert(value) {
        return {
            isRef: true,
            ref: () => value
        }
    }

    // EG for UFG
    if (test.vg && process.env.UFG_ON_EG) {
        test.executionGrid = true;
    }

    let mobile = ("features" in test) && (test.features[0] === 'native-selectors') ? true : false
    mobile = mobile || test.name.includes("webview") || test.name.startsWith("appium");
    let emulator = ((("env" in test) && ("device" in test.env)) && !("features" in test))
    let otherBrowser = ("env" in test) && ("browser" in test.env) && (test.env.browser !== 'chrome') ? true : false
    let openPerformed = false
    let confVisualGridOptionCreated = false

    function assertMessage(param, addToEnd = true) {
        return (typeof param === "undefined") ? emptyValue() : (addToEnd) ? insert(`, "${param}"`) : insert(`"${param}", `)
    }

    addSyntax('cast', ({target, castType}) => `(${castType.name})target`)
    addType('JsonNode', {
        getter: ({target, key}) => `${target}[${key}]`,
        schema: {
            attributes: {type: 'JsonNode', schema: 'JsonNode'},
            length: {type: 'Number', rename: 'Count', getter: ({target, key}) => `${target}.${key}`}
        }
    })

    if (counter === 0) {
        printCommitHash(sdk_coverage_tests_repo_webURL, sdk_coverage_tests_repo_branch);
        counter++;
    }

    addHook('deps', `using NUnit.Framework;`)
    addHook('deps', `using Applitools.Tests.Utils;`)
    addHook('deps', `using Applitools.Generated.Utils;`)
    addHook('deps', `using Applitools.Utils.Geometry;`)
    addHook('deps', `using OpenQA.Selenium;`)
    addHook('deps', `using Applitools.Fluent;`)
    addHook('deps', `using Applitools.Metadata;`)
    addHook('deps', `using Newtonsoft.Json.Linq;`)
    if (mobile) {
        addHook('deps', `using Applitools.Appium;`)
        addHook('deps', `using Applitools.Appium.GenericUtils;`)
        addHook('deps', `using OpenQA.Selenium.Appium;`)
    } else {
        addHook('deps', `using Applitools.Selenium;`)
        addHook('deps', `using OpenQA.Selenium.Interactions;`)
        addHook('deps', `using OpenQA.Selenium.Remote;`)
        addHook('deps', `using System.Collections.Generic;`)
        addHook('deps', `using System;`)
        addHook('deps', `using System.Linq;`)
    }
    if ("browsersInfo" in test.config) addHook('deps', `using Applitools.VisualGrid;`)

    let namespace = mobile ? 'Applitools.Generated.Appium.Tests' : 'Applitools.Generated.Selenium.Tests'
    let baseClass = mobile ? 'TestSetupGeneratedAppium' : 'TestSetupGenerated'
    if (emulator) baseClass = 'TestSetupGeneratedMobileEmulation'

    addHook('deps', `namespace ${namespace}`)
    addHook('deps', `{`)
    addHook('deps', `[TestFixture]`)
    addHook('deps', `[Parallelizable]`)
    addHook('deps', `public class ${test.key}Class : ${baseClass}`)

    addSyntax('var', variable)
    addSyntax('getter', getter)
    addSyntax('call', call)
    addSyntax('return', returnSyntax)

    if (mobile) setUpMobileNative(test, addHook)
    else {
        if (emulator) setUpWithEmulators(test, addHook)
        else setUpBrowsers(test, addHook)
    }

    if ("removeDuplicateTests" in test.config) addHook('beforeEach', dot_net`runner.SetRemoveDuplicateTests(${test.config.removeDuplicateTests});`)
    if ("baselineEnvName" in test.config) addHook('beforeEach', dot_net`eyes.BaselineEnvName = ${test.config.baselineEnvName};`)
    if ("branchName" in test.config) addHook('beforeEach', dot_net`eyes.BranchName = ${test.config.branchName};`)
    if ("parentBranchName" in test.config) addHook('beforeEach', dot_net`eyes.ParentBranchName = ${test.config.parentBranchName};`)
    if ("hideScrollbars" in test.config) addHook('beforeEach', dot_net`eyes.HideScrollbars = ${test.config.hideScrollbars};`)
    if ("isDisabled" in test.config) addHook('beforeEach', dot_net`eyes.IsDisabled = ${test.config.isDisabled};`)
    if ("forceFullPageScreenshot" in test.config) addHook('beforeEach', dot_net`eyes.ForceFullPageScreenshot = ${test.config.forceFullPageScreenshot};`)
    if ("batch" in test.config) {
        if ("id" in test.config.batch) {
            addHook('beforeEach', dot_net`eyes.Batch.Id = ${test.config.batch.id};`)
        }
        if ("properties" in test.config.batch) {
            addHook('beforeEach', dot_net`eyes.Batch.AddProperty(${test.config.batch.properties[0].name}, ${test.config.batch.properties[0].value});`)
        }
    }
    if (("defaultMatchSettings" in test.config) && ("accessibilitySettings" in test.config.defaultMatchSettings)) {
        let level = `${test.config.defaultMatchSettings.accessibilitySettings.level}`
        let version = `${test.config.defaultMatchSettings.accessibilitySettings.guidelinesVersion}`
        addHook('beforeEach', dot_net`AccessibilitySettings settings = new AccessibilitySettings(AccessibilityLevel.` + level + `, AccessibilityGuidelinesVersion.` + version + `);
        var configuration = eyes.GetConfiguration();
        configuration.SetAccessibilityValidation(settings);
        eyes.SetConfiguration(configuration);`)
    }
    if ("browsersInfo" in test.config) {
        addHook('beforeEach', dot_net`var config = eyes.GetConfiguration();`)
        if ("name" in test.config.browsersInfo[0]) {
            let browserType = 'BrowserType.CHROME'
            switch (`${test.config.browsersInfo[0].name}`) {
                case 'chrome':
                    browserType = 'BrowserType.CHROME'
                    break;
                case 'firefox':
                    browserType = 'BrowserType.FIREFOX'
                    break;
                default:
                    throw Error(`Browser type ${test.config.browsersInfo[0].name} not implemented yet`)
            }
            addHook('beforeEach', dot_net`config.AddBrowsers(new DesktopBrowserInfo(${test.config.browsersInfo[0].width}, ${test.config.browsersInfo[0].height}, ` + browserType + `));`)
        }
        if ((test.config.browsersInfo[1]) && ("iosDeviceInfo" in test.config.browsersInfo[1])) {
            //addHook('beforeEach', dot_net`config.AddBrowsers(new IosDeviceInfo((IosDeviceName)Enum.Parse(typeof(IosDeviceName), ${test.config.browsersInfo[1].iosDeviceInfo.deviceName}, true)));`)
            let iosDeviceName = ''
            if (`${test.config.browsersInfo[1].iosDeviceInfo.deviceName}` === 'iPad (7th generation)') iosDeviceName = 'IosDeviceName.iPad_7'
            addHook('beforeEach', dot_net`config.AddBrowsers(new IosDeviceInfo(` + iosDeviceName + `));`)
        }
        if ((test.config.browsersInfo[2]) && ("chromeEmulationInfo" in test.config.browsersInfo[2])) {
            let devName = ''
            if (`${test.config.browsersInfo[2].chromeEmulationInfo.deviceName}` === 'Pixel 4 XL') devName = 'DeviceName.Pixel_4_XL'
            //addHook('beforeEach', dot_net`config.AddBrowsers(new ChromeEmulationInfo((DeviceName)Enum.Parse(typeof(DeviceName), ${test.config.browsersInfo[2].chromeEmulationInfo.deviceName}, true), Applitools.VisualGrid.ScreenOrientation.Portrait));`)
            addHook('beforeEach', dot_net`config.AddBrowsers(new ChromeEmulationInfo(` + devName + `));`)
        }
        if (test.config.layoutBreakpoints) {

            if (typeof test.config.layoutBreakpoints == 'object' && !Array.isArray(test.config.layoutBreakpoints)) {
                let breakpoints;
                if (typeof test.config.layoutBreakpoints.breakpoints == 'object') { 
                    breakpoints = test.config.layoutBreakpoints.breakpoints.join(', ')
                }
                else { 
                    breakpoints = test.config.layoutBreakpoints.breakpoints 
                }
    
                addHook('beforeEach', `SetLayoutBreakpoints(new LayoutBreakpointsOptions().Breakpoints(${breakpoints}).Reload(${test.config.layoutBreakpoints.reload}));`)
            } else {
                addHook('beforeEach', `SetLayoutBreakpoints(new LayoutBreakpointsOptions().Breakpoints(${test.config.layoutBreakpoints}));`)
            }
        }
        addHook('beforeEach', dot_net`eyes.SetConfiguration(config);`);
    }

    addHook('afterEach', dot_net`webDriver?.Quit();`)
    addHook('afterEach', dot_net`driver?.Quit();`)
    addHook('afterEach', dot_net`eyes?.AbortIfNotClosed();`)
    addHook('afterEach', dot_net`runner?.GetAllTestResults(false);`)


    const driver = {
        constructor: {
            isStaleElementError: () => 'StaleElementReferenceException'
        },
        build(test) {
            //return addCommand(ruby`await specs.build(${options})`)
            // TODO: implement if needed
        },
        cleanup() {
            addCommand(dot_net`driver.Quit();`)
        },
        visit(url) {
            addCommand(dot_net`driver.Navigate().GoToUrl(${url});`)
        },
        executeScript(script, ...args) {
            if (args[0] !== undefined) {
                if (openPerformed) return addCommand(dot_net`((IJavaScriptExecutor)webDriver).ExecuteScript(${script}, ${args[0]});`)
                else return addCommand(dot_net`((IJavaScriptExecutor)driver).ExecuteScript(${script}, ${args[0]});`)
            }
            if (openPerformed) return addCommand(dot_net`((IJavaScriptExecutor)webDriver).ExecuteScript(${script});`)
            else return addCommand(dot_net`((IJavaScriptExecutor)driver).ExecuteScript(${script});`)
        },
        sleep(ms) {
            //addCommand(ruby`await specs.sleep(driver, ${ms})`)
            // TODO: implement if needed
        },
        switchToFrame(selector) {
            if (selector === null) addCommand(dot_net`webDriver.SwitchTo().Frame("");`)
            else addCommand(dot_net`webDriver.SwitchTo().Frame(${selector});`)
        },
        switchToParentFrame() {
            addCommand(dot_net`webDriver.SwitchTo().ParentFrame();`)
        },
        findElement(selector) {
            let drv = "driver"
            if (openPerformed) drv = "webDriver"
            if (selector.includes('name=')) return addCommand(dot_net`` + drv + `.FindElement(By.Name(` + takeSelector(selector) + `));`)
            else return addCommand(
                dot_net`` + drv + `.FindElement(By.CssSelector("${selector.toString().replace(/\"/g, '')}"));`,
            )
        },
        findElements(selector) {
            return addCommand(
                dot_net`webDriver.FindElements(By.CssSelector(${selector}));`,
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
            return addCommand(dot_net`webDriver.Manage().Window.Size;`)
        },
        setWindowSize(size) {
            addCommand(dot_net`webDriver.Manage().Window.Size = ${size};`)
        },
        click(element) {
            let drv = "driver"
            if (openPerformed) drv = "webDriver"
            switch (typeof element) {
                case 'string':
                    if (element.includes('name=')) {
                        addCommand(dot_net`` + drv + `.FindElement(By.Name(${takeSelector(element)})).Click();`)
                    } else {
                        addCommand(dot_net`` + drv + `.FindElement(By.CssSelector(\"${element}\")).Click();`)
                    }
                    break;
                case "object":
                    if (element.type === undefined) addCommand(dot_net`${element}.Click();`)
                    else {
                        addCommand(dot_net`` + drv + `.FindElement(${selectors[element.type](JSON.stringify(element.selector))}).Click();`)
                    }
                    break;
            }
        },
        type(element, keys) {
            addCommand(dot_net`${element}.SendKeys(${keys});`)
        },
        scrollIntoView(element, align = false) {
            addCommand(dot_net`Actions actions = new Actions(driver);
		actions.MoveToElement(${element}).Perform();`)
        },
        hover(element, offset) {
            addCommand(dot_net`Actions mouseHover = new Actions(driver);
		mouseHover.MoveToElement(${element}).Perform();`)
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
        constructor: {
            setViewportSize(viewportSize) {
                addCommand(dot_net`eyes.GetConfiguration().SetViewportSize(new RectangleSize(width:${viewportSize.width}, height:${viewportSize.height}));`)
            },
        },
        runner: {
            getAllTestResults(throwEx) {
                return addCommand(dot_net`runner.GetAllTestResults(${throwEx});`).type('TestResultsSummary').methods({
                    getAllResults: (target) => addCommand(dot_net`${target}.GetAllResults();`).type({
                        type: 'Array',
                        items: {
                            type: 'TestResultContainer',
                            schema: {
                                testResults: TestResults,
                                browserInfo: {
                                    type: "BrowserInfo",
                                    schema: {
                                        name: "String",
                                        height: "int",
                                        width: "int",
                                        chromeEmulationInfo: {
                                            type: "ChromeEmulationInfo",
                                            schema: {
                                                deviceName: "String"
                                            }
                                        }
                                    }
                                },
                                exception: "Exception"
                            }
                        }
                    })
                })
            }
        },
        open({appName, viewportSize}) {
            let rectangle = !viewportSize ? '' : `, new RectangleSize(width:${viewportSize.width}, height:${viewportSize.height})`
            let appNm = (appName) ? appName : test.config.appName
            openPerformed = true
            addCommand(dot_net`webDriver = eyes.Open(driver, ${appNm}, ${test.config.baselineName}` + rectangle + ');')
        },
        check(checkSettings = {}) {
            if (checkSettings !== undefined && checkSettings.visualGridOptions) {
                if (!confVisualGridOptionCreated) {
                    addCommand(`var conf = eyes.GetConfiguration();`)
                    confVisualGridOptionCreated = true
                }
                var options = checkSettings.visualGridOptions
                for (var key of Object.keys(options)) {
                    addCommand(`conf.SetVisualGridOptions(new VisualGridOption("${key}", ${options[key]}));`)
                }
                addCommand(`eyes.SetConfiguration(conf);`)
            }
            if (test.api !== 'classic') {
                return addCommand(`eyes.Check(${checkSettingsParser(checkSettings, mobile)});`)
            } else if (checkSettings.region) {
                if (checkSettings.frames && checkSettings.frames.length > 0) {
                    const [frameReference] = checkSettings.frames
                    let Tag = !checkSettings.name ? `""` : `${checkSettings.name}`
                    let MatchTimeout = !checkSettings.timeout ? `` : `, ${checkSettings.timeout}`
                    return addCommand(dot_net`eyes.CheckRegionInFrame(` +
                        takeSelector(frameReference) +
                        `, By.CssSelector("${checkSettings.region}"),` + Tag + `, ${checkSettings.isFully}` + MatchTimeout +
                        `);`)
                }
                let args = `By.CssSelector(\"${checkSettings.region}\")` +
                    `${checkSettings.name ? `, tag: ${checkSettings.name}` : ''}` +
                    `${checkSettings.timeout ? `, matchTimeout: ${checkSettings.timeout}` : ''}`
                return addCommand(dot_net`eyes.CheckRegion(By.CssSelector(${checkSettings.region})` +
                    `${checkSettings.name ? `, tag: ${checkSettings.name}` : ''}` +
                    `${checkSettings.timeout ? `, matchTimeout: ${checkSettings.timeout}` : ''});`)
            } else if (checkSettings.frames && checkSettings.frames.length > 0) {
                let frameSelector = (checkSettings.frames.isRef) ? checkSettings.frames.ref() : takeSelector(checkSettings.frames)
                let args = frameSelector + //arr.reduce((acc, val) => acc + `${takeSelector(val)}`, '')//`"${frames(checkSettings.frames)}"` + //getVal(frameReference)
                    `${checkSettings.name ? `, tag: ${checkSettings.name}` : ''}` +
                    `${checkSettings.timeout ? `, timeout: ${checkSettings.timeout}` : ''}`
                return addCommand(`eyes.CheckFrame(${args});`)
            } else {
                let MatchTimeout = !checkSettings.timeout ? `` : `match_timeout:${checkSettings.timeout}`
                let Tag = !checkSettings.name ? `` : `tag:"${checkSettings.name}"`
                if (Tag !== `` && MatchTimeout !== ``) Tag = `, ` + Tag
                let isFully = (checkSettings.isFully === undefined) ? `` : `fully:${checkSettings.isFully}`
                if (isFully !== `` && Tag !== ``) isFully = `, ` + isFully
                return addCommand(dot_net`eyes.CheckWindow(` + MatchTimeout + Tag + isFully + `);`)
            }
        },

        close(throwEx) {
            return addCommand(dot_net`eyes.Close(${argumentCheck(throwEx, true)});`).type(TestResults)
        },
        abort() {
            return addCommand(dot_net`eyes.Abort();`).type(TestResults)
        },
        getViewportSize() {
            return addCommand(dot_net`eyes.GetConfiguration().ViewportSize;`).type('RectangleSize')
        },
        locate(visualLocator) {
            return addCommand(dot_net`eyes.Locate(new VisualLocatorSettings().Names(${visualLocator.locatorNames.join(', ')}));`).type('Map<String, List<Region>>')
        },
    }
    
    const assert = {
        equal(actual, expected, message) {
            if (expected === null) {
                addCommand(dot_net`Assert.Null(${actual}${assertMessage(message)});`)
            } else if (expected.isRef) {
                const typeCasting = actual.type().name === 'Number' ? insert(` (long) `) : emptyValue()
                if (actual.type().name === 'Map') {
                    addCommand(dot_net`GeneratedTestUtils.compareProcedure(${typeCasting}${actual}, ${expected}${assertMessage(message)}, null);`)
                } else {
                    addCommand(dot_net`Assert.AreEqual(${expected}, ${typeCasting}${actual}${assertMessage(message)});`)
                }
            } else {
                const type = getTypeName(actual)
                if (type === 'JsonNode') {
                    addCommand(dot_net`Assert.AreEqual(${expected}, ${actual}.ToString()${assertMessage(message)});`)
                } else if (type === 'Array') {
                    addCommand(dot_net`Assert.AreEqual(${addType(expected[0], 'Region')}, ${actual[0]}${assertMessage(message)});`)
                } else if (type !== 'Map') {
                    addCommand(dot_net`Assert.AreEqual(${addType(expected, type)}, ${actual}${assertMessage(message)});`)
                } else {
                    addCommand(dot_net`GeneratedTestUtils.compareProcedure(${actual},\n        ${addType(expected, type, actual.type().generic)}${assertMessage(message)});`)
                }
            }
        },
        notEqual(actual, expected, message) {
            addCommand(dot_net`Assert.AreNotEqual(${expected}${assertMessage(message)}, ${actual});`)
        },
        instanceOf(object, typeName) {
            addCommand(dot_net`Assert.IsInstanceOf<${insert(types[typeName].name())}>(${object});`)
        },
        throws(func, check) {
            let command = dot_net`Assert.Catch<Exception>(()=>{${func}});`
            addCommand(command)
        },
        ok(arg, message) {
            addCommand(dot_net`Assert.NotNull(${arg}${assertMessage(message)});`)
        },
        contains(args, expectedToHave) {
            addCommand(dot_net`StringAssert.Contains(${expectedToHave}, (${args});`)
        }
    }

    const helpers = {
        getTestInfo(result) {
            return addCommand(dot_net`GetTestInfo(${result});`).type({
                type: 'TestInfo',
                schema: {
                    actualAppOutput: {
                        type: 'Array',
                        items: {
                            type: 'AppOutput',
                            schema: {
                                image: {
                                    type: 'Image',
                                    schema: {
                                        hasDom: 'Boolean',
                                        location: Location
                                    },
                                },
                                imageMatchSettings: ImageMatchSettings,
                                knownVariantId: {
                                    type: 'String'
                                },
                                pageCoverageInfo: {
                                    type: 'PageCoverageInfo',
                                    schema: {
                                        pageId: 'String',
                                        width: 'Long',
                                        height: 'Long',
                                        imagePositionInPage: {
                                            rename: 'location',
                                            ...Location
                                        }
                                    }
                                }
                            }
                        },
                    },
                    startInfo: {
                        type: 'StartInfo',
                        schema: {
                            batchInfo: {
                                type: 'BatchInfo',
                                schema: {
                                    properties: {
                                        type: 'List<Map<String, String>>',
                                        schema: {
                                            length: { rename: 'Count' }
                                        },
                                        items: {
                                            type: 'Map<String, String>',
                                            items: {
                                                type: 'String'
                                            }
                                        }
                                    },
                                }
                            },
                            agentRunId: 'String'
                        }
                    }
                },
            })
        },
        getDom(result, domId) {
            return addCommand(dot_net`GetDom(${result},${domId});`).type({ type: 'JsonNode', recursive: true }).methods({
                getNodesByAttribute: (dom, attr) => addCommand(dot_net`GetNodesByAttributes(${dom}, ${attr});`).type({
                    type: 'List<JObject>',
                    schema: { length: { rename: 'Count' } },
                    items: {
                        type: 'JsonNode', schema: {
                            rect: {
                                type: 'rect',
                                schema: {
                                    top: 'Number',
                                    left: 'Number'
                                }
                            }
                        }, recursive: true
                    }
                })
            })
        },
        math: {
            round(number) {
                return addExpression(dot_net`Math.Round(${number})`)
            }
        }
    }

    return {driver, eyes, assert, helpers}
}

function castPolynomTerms(castTo, polinom, index = 0) {
    let castPolynom = ""
    let terms = polinom.split("+")
    terms.forEach(term => {
        castPolynom = castPolynom + "(" + castTo + ")" + term.trimStart() + " + "
    })
    return castPolynom.substr(0, castPolynom.length - 3)
}

function getVal(val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}

function insert(value) {
    return {
        isRef: true,
        ref: () => value
    }
}

function setUpMobileNative(test, addHook) {
    addHook('beforeEach', dot_net`initDriver(${test.env.device}, ${test.env.app});`)
    addHook('beforeEach', dot_net`initEyes(false, false);`)
}

function setUpWithEmulators(test, addHook) {
    if (test.env.device === 'Android 8.0 Chrome Emulator') {
        addHook('beforeEach', dot_net`SetUpDriver("Android Emulator", "8.0", "Android", ScreenOrientation.Portrait);`)
        switch (test.config.baselineName) {
            case 'Android Emulator 8.0 Portrait mobile fully':
                addHook('beforeEach', dot_net`initEyes("mobile", ScreenOrientation.Portrait);`)
                break;
            case 'Android Emulator 8.0 Portrait scrolled_mobile fully':
                addHook('beforeEach', dot_net`initEyes("scrolled_mobile", ScreenOrientation.Portrait);`)
                break;
            case 'Android Emulator 8.0 Portrait desktop fully':
                addHook('beforeEach', dot_net`initEyes("desktop", ScreenOrientation.Portrait);`)
                break;
            default:
                //throw Error(`Couldn't intrpret baselineName ${test.config.baselineName}. Code update is needed`)
                addHook('beforeEach', dot_net`initEyes("mobile", ScreenOrientation.Landscape);`)
                break;
        }
    } else throw Error(`Couldn't intrpret device ${test.env.device}. Code update is needed`)
}

function setUpBrowsers(test, addHook) {
    let headless = ("env" in test) && ("headless" in test.env) && (test.env.headless === false) ? false : true
    let legacy = ("env" in test) && ("legacy" in test.env) && (test.env.legacy === true) ? true : false
    let css = ("stitchMode" in test.config) && (test.config.stitchMode.toUpperCase().localeCompare('SCROLL')) ? true : false // localeCompare returns 0 when the strings are equal
    let executionGrid = ("executionGrid" in test) && test.executionGrid
    if (("env" in test) && ("browser" in test.env)) {
        switch (test.env.browser) {
            case 'ie-11':
                addHook('beforeEach', dot_net`SetUpDriver(browserType.IE);`)
                break;
            case 'edge-18':
                addHook('beforeEach', dot_net`SetUpDriver(browserType.Edge);`)
                break;
            case 'firefox':
                addHook('beforeEach', dot_net`SetUpDriver(browserType.Firefox, headless: ${headless});`)
                break;
            case 'safari-11':
                addHook('beforeEach', dot_net`SetUpDriver(browserType.Safari11, legacy: ${legacy});`)
                break;
            case 'safari-12':
                addHook('beforeEach', dot_net`SetUpDriver(browserType.Safari12, legacy: ${legacy});`)
                break;
            case 'chrome':
                addHook('beforeEach', dot_net`SetUpDriver(browserType.Chrome, headless: ${headless}, executionGrid: ${executionGrid});`)
                break;
            default:
                throw Error(`Couldn't intrpret browser type ${test.env.browser}. Code update is needed`)
        }
    } else addHook('beforeEach', dot_net`SetUpDriver(browserType.Chrome, headless: ${headless}, executionGrid: ${executionGrid});`)
    addHook('beforeEach', dot_net`initEyes(isVisualGrid: ${argumentCheck(test.vg, false)}, isCSSMode: ${css});`)
}

//module.exports = makeSpecEmitter
