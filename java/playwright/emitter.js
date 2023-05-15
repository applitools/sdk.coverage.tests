'use strict'
const types = require('./mapping/types')
const { TAGS } = require('./mapping/supported')
const { checkSettingsParser, java, getter, variable, call, returnSyntax, wrapSelector, parseEnv } = require('./parser')
const { capitalizeFirstLetter } = require('../util')
const ImageMatchSettings = {
    type: 'ImageMatchSettings',
    schema: {
        enablePatterns: 'BooleanObject',
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

    function findFrame(frame) {
        if (!Array.isArray(frame)) throw new Error(`Frame property for check wasn't a Array type`)
        frame = frame[0]
        if (typeof frame === 'string' && !(/[#\[\]]/.test(frame))) {
            return frame
        } else {
            return findElement(frame)
        }
    }

    function findElement(element) {
        if (element.isRef && element.type().name === 'Element') return element
        else return driver.findElement(element)
    }

    function assertMessage(param, addToEnd = true) {
        return (typeof param === 'undefined') ? emptyValue() : (addToEnd) ? insert(`, "${param}"`) : insert(`"${param}", `)
    }

    function extraParameters(params) {
        let result = ''
        if (params.length > 0) {
            let i = 0;
            result += `, Arrays.asList(`
            for (const param of params) {
                if (param === undefined) break
                i += 1;
                if (i < params.length)
                    result += java`${param}, `
                else
                    result += java`${param}`
            }
            result += `)`
        }
        return insert(result)
    }

    addHook('deps', `package coverage.generic.playwright;`)
    addHook('deps', ``)
    
    // EG for UFG
    if (test.vg && process.env.UFG_ON_EG) {
        test.executionGrid = true;
    }

    // Dirty emulator workaround
    if (test.env && test.env.device === "Android 8.0 Chrome Emulator") {
        test.meta.native = false;
        test.env.browser = "chrome";
    }

    // Playwright has no mobile testing
    addHook('deps', `import coverage.PlaywrightTestSetup;`)
    addHook('deps', `import com.applitools.eyes.playwright.*;`)
    addHook('deps', `import com.applitools.eyes.playwright.fluent.*;`)
    addHook('deps', `import com.applitools.eyes.playwright.universal.PlaywrightStaleElementReferenceException;`)
    addHook('afterEach', `runner.getAllTestResults(false);`)
    
    // Not specific
    addHook('deps', `import java.net.MalformedURLException;`)
    addHook('deps', `import com.applitools.eyes.*;`)
    addHook('deps', `import com.applitools.eyes.metadata.SessionResults;`)
    addHook('deps', `import com.microsoft.playwright.*;`)
    addHook('deps', `import org.testng.annotations.*;`)
    addHook('deps', `import org.testng.Assert;`)
    addHook('deps', `import java.util.*;`)
    addHook('deps', `import com.applitools.eyes.locators.VisualLocatorSettings;`)
    addHook('deps', 'import com.fasterxml.jackson.databind.JsonNode;')
    addHook('deps', 'import com.applitools.eyes.playwright.locators.OcrRegion;')
    addHook('deps', 'import com.applitools.eyes.locators.TextRegion;')
    addHook('deps', 'import com.applitools.eyes.locators.TextRegionSettings;')

    addSyntax('var', variable)
    addSyntax('getter', getter)
    addSyntax('call', call)
    addSyntax('return', returnSyntax)

    addHook('beforeEach', java`initEyes(${argumentCheck(test.vg, false)}, ${argumentCheck(test.config.stitchMode, 'Scroll')}, ${argumentCheck(test.branchName, "master")});`,)
    addHook('beforeEach', parseEnv({ ...test.env, executionGrid: test.executionGrid }))
    addHook('beforeEach', java`System.out.println(getClass().getName());`)
    const specific = ['baselineName', 'browsersInfo', 'appName', 'defaultMatchSettings', 'layoutBreakpoints', 'batch'];
    Object.keys(test.config).filter(property => !specific.includes(property))
        .forEach(property => addHook('beforeEach', java`set${insert(capitalizeFirstLetter(property))}(${test.config[property]});`))
    if (test.config.browsersInfo) {
        addHook('deps', 'import com.applitools.eyes.visualgrid.model.*;')
        addHook('deps', 'import com.applitools.eyes.visualgrid.model.ScreenOrientation;')
        addHook('deps', 'import com.applitools.eyes.selenium.BrowserType;')
        addHook('beforeEach', java`setBrowsersInfo(${{ value: test.config.browsersInfo, type: 'BrowsersInfo' }});`)
    }
    if (test.config.defaultMatchSettings) {
        const defaultMatchSettings = test.config.defaultMatchSettings
        Object.keys(defaultMatchSettings)
            .forEach(property => {
                if (property === 'enablePatterns') addHook('beforeEach', `set${capitalizeFirstLetter(property)}(${defaultMatchSettings[property]});`); 
                else addHook('beforeEach',
                java`set${insert(capitalizeFirstLetter(property))}(${{ value: defaultMatchSettings[property], ...ImageMatchSettings.schema[property] }});`)
            })
    }
    if (test.config.layoutBreakpoints) {
        if (typeof test.config.layoutBreakpoints == 'object' && !Array.isArray(test.config.layoutBreakpoints)) {
            let breakpoints;
            if (typeof test.config.layoutBreakpoints.breakpoints == 'object') { breakpoints = `new int[] {${test.config.layoutBreakpoints.breakpoints.join(', ')}}` }
            else { breakpoints = test.config.layoutBreakpoints.breakpoints }

            addHook('beforeEach', `setLayoutBreakpoints(${breakpoints}, new LayoutBreakpointsOptions().reload(${test.config.layoutBreakpoints.reload}));`)
        } else {
            addHook('beforeEach', `setLayoutBreakpoints(${test.config.layoutBreakpoints});`)
        }
    }
    if (test.config.batch) {
        addHook('beforeEach', `setBatch("${test.config.baselineName}", new HashMap[] {\n    ${test.config.batch.properties.map(val => {
            return { value: val, type: 'Map', generic: [{ name: 'String' }, { name: 'String' }] }
        }).map(property => java`${property}`).join(',\n    ')}});`)
    }

    addHook('afterEach', java`if (driver != null) { driver.close(); getBuilder().quit(); }`)
    addHook('afterEach', java`eyes.abort();`)

    const driver = {
        constructor: {
            isStaleElementError: () => 'PlaywrightStaleElementReferenceException.class'
        },
        visit(url) {
            addCommand(java`getPage().navigate(${url});`)
        },
        executeScript(script, ...args) {
            let actualScript = script;
            if (script.startsWith("arguments[0]")) {
                actualScript = `arguments => { ${script} };`
                return addCommand(java`getPage().evaluate(${actualScript}${extraParameters(args)});`)
            } else if (script.startsWith('return')) {
                actualScript = `() => { ${script} };`
                return addCommand(java`getPage().evaluate(${actualScript}${extraParameters(args)});`)
            }
            return addCommand(java`getPage().evaluate(${actualScript}${extraParameters(args)});`)
        },
        switchToFrame(selector) {
            if (selector === null) {
                addCommand(java`getPage().mainFrame();`)
            } else {
                addCommand(java`${selector}.contentFrame();`)
            }
        },
        switchToParentFrame() {
            addCommand(java`getPage().mainFrame().parentFrame();`)
        },
        findElement(selector) {
            return addCommand(java`getPage().locator(${wrapSelector(selector)}).elementHandle();`).type('Element')
        },
        findElements(selector) {
            return addCommand(java`getDriver().findElements(${wrapSelector(selector)}));`).type('Array<Element>')
        },
        click(element) {
            if (element.isRef) addCommand(java`${element}.click();`)
            else addCommand(java`getPage().locator(${element}).click();`)
        },
        type(element, keys) {
            addCommand(java`${element}.fill(${keys});`)
        },
        scrollIntoView(element, align = false) {
            addCommand(java`${element}.scrollIntoViewIfNeeded();`)
        },
        hover(element, offset) {
            addCommand(java`${findElement(element)}.hover();`)
        }
    }

    const eyes = {
        constructor: {
            setViewportSize(viewportSize) {
                return addCommand(java`Eyes.setViewportSize(getDriver(), ${addType(viewportSize, 'RectangleSize')});`)
            }
        },
        runner: {
            getAllTestResults(throwEx) {
                return addCommand(java`getRunner().getAllTestResults(${throwEx});`).type('TestResultsSummary').methods({
                    getAllResults: (target) => addCommand(java`${target}.getAllResults();`).type({
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
        open({ appName, testName, viewportSize }) {
            let command = []
            command.push('open(driver')
            command.push(java`, ${appName || test.config.appName}`)
            command.push(java`, ${testName || test.config.baselineName}`)
            if (viewportSize) command.push(java`, new RectangleSize(${viewportSize.width}, ${viewportSize.height})`)
            command.push(');')
            addCommand(command.join(''))
        },
        check(checkSettings = {}) {
            if (test.api === 'classic') {
                if (checkSettings.frames === undefined && checkSettings.region === undefined) {
                    eyes.checkWindow(checkSettings.tag, checkSettings.matchTimeout, checkSettings.isFully)
                } else if (checkSettings.frames && checkSettings.region) {
                    eyes.checkRegionInFrame(checkSettings.frames, checkSettings.region, checkSettings.matchTimeout, checkSettings.tag, checkSettings.isFully)
                } else if (checkSettings.frames) {
                    eyes.checkFrame(checkSettings.frames, checkSettings.matchTimeout, checkSettings.tag)
                } else if (checkSettings.region) {
                    eyes.checkRegion(checkSettings.region, checkSettings.matchTimeout, checkSettings.tag)
                } else {
                    throw new Error('Not implemented classic api method was tried to generate')
                }
            } else {
                addCommand(`eyes.check(${checkSettingsParser(checkSettings, test.meta.native)});`)
            }
        },
        checkWindow(tag, matchTimeout, stitchContent) {
            if (matchTimeout && stitchContent) throw new Error(`There is no signature in java SDK for usage both matchTimeout and stitchContent`)
            const commands = []
            commands.push(java`eyes.check(Target`)
            commands.push(java`.window()`)
            if (matchTimeout) commands.push(java`.timeout(${matchTimeout})`)
            if (stitchContent !== undefined) commands.push(java`.fully(${stitchContent})`)
            if (tag) commands.push(java`.withName(${tag})`)
            commands.push(java`);`)
            addCommand([commands.join('')])
        },
        checkFrame(element, matchTimeout, tag) {
            const commands = []
            commands.push(java`eyes.check(Target`)
            commands.push(java`.frame(${findFrame(element)})`)
            if (matchTimeout) commands.push(java`.timeout(${matchTimeout})`)
            if (tag) commands.push(java`.withName(${tag})`)
            commands.push(java`.fully());`)
            addCommand([commands.join('')])
        },
        checkRegion(region, matchTimeout, tag) {
            const commands = []
            commands.push(java`eyes.check(Target`)
            commands.push(java`.region(${wrapSelector(region)})`)
            if (matchTimeout) commands.push(java`.timeout(${matchTimeout})`)
            if (tag) commands.push(java`.withName(${tag})`)
            commands.push(java`);`)
            addCommand([commands.join('')])
        },
        checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
            const commands = []
            commands.push(java`eyes.check(Target`)
            commands.push(java`.frame(${findFrame(frameReference)})`)
            commands.push(java`.region(${wrapSelector(selector)})`)
            if (matchTimeout) commands.push(java`.timeout(${matchTimeout})`)
            if (tag) commands.push(java`.withName(${tag})`)
            if (stitchContent) commands.push(java`.fully(${stitchContent})`)
            commands.push(java`);`)
            addCommand([commands.join('')])
        },
        close(throwEx) {
            return addCommand(java`eyes.close(${argumentCheck(throwEx, true)});`).type(TestResults)
        },
        abort() {
            return addCommand(java`eyes.abort();`).type(TestResults)
        },
        getViewportSize() {
            return addCommand(java`eyes.getViewportSize();`).type({
                type: 'RectangleSize',
                schema: {
                    height: {
                        type: 'int'
                    },
                    width: {
                        type: 'int'
                    }
                }
            })
        },
        locate(visualLocator) {
            return addCommand(java`eyes.locate(new VisualLocatorSettings().names(Arrays.asList(${visualLocator.locatorNames.join(', ')})));`).type('Map<String, List<Region>>')
        },
        extractText(ocrRegions) {
            const commands = []
            commands.push(java`eyes.extractText(`)
            for (const index in ocrRegions) {
                commands.push(java`new OcrRegion(`)
                const region = ocrRegions[index]
                if (typeof (region.target) === "string") {
                    commands.push(java`${region.target})`)
                } else if (typeof (region.target) === "object") {
                    commands.push(java`new Region(${region.target.left || region.target.x}, ${region.target.top || region.target.y}, ${region.target.width}, ${region.target.height}))`)
                } else {
                    commands.push(java`${region.target})`)
                }

                if (region.hint) {
                    commands.push(java`.hint(${region.hint})`)
                }
                if (region.minMatch) {
                    commands.push(java`.minMatch(${region.minMatch})`)
                }
                if (region.language) {
                    commands.push(java`.language(${region.language})`)
                }
                commands.push(java`, `)
            }
            commands.pop()
            commands.push(java`);`)
            return addCommand([commands.join('')]).type({
                type: 'List<String>',
                items: {
                    type: 'String'
                }
            });
        },
        extractTextRegions({ patterns, ignoreCase, firstOnly, language }) {
            const commands = []
            commands.push(java`eyes.extractTextRegions(new TextRegionSettings(${insert(patterns.map(JSON.stringify).join(', '))})`)
            if (ignoreCase) commands.push(java`.ignoreCase(${ignoreCase})`)
            if (firstOnly) commands.push(java`.firstOnly(${firstOnly})`)
            if (language) commands.push(java`.language(${language})`)
            commands.push(java`);`)
            return addCommand([commands.join('')]).type({
                type: 'Map<String, List<TextRegion>>',
                items: {
                    type: 'List<TextRegion>',
                    schema: {
                        length: { rename: 'size' }
                    },
                    items: {
                        type: 'TextRegion',
                        schema: { text: { type: 'String' } }
                    }
                }
            })
        }
    }

    const assert = {
        equal(actual, expected, message) {
            if (expected === null) {
                addCommand(java`Assert.assertNull(${actual}${assertMessage(message)});`)
            } else if (expected.isRef) {
                const typeCasting = actual.type().name === 'Number' ? insert(` (long) `) : emptyValue()
                addCommand(java`Assert.assertEquals(${typeCasting}${actual}, ${expected}${assertMessage(message)});`)
            } else {
                const type = getTypeName(actual)
                if (type === 'JsonNode') {
                    addCommand(java`Assert.assertEquals(${actual}.asText(""), ${expected}${assertMessage(message)});`)
                } else if (type === 'Array') {
                    addCommand(java`Assert.assertEquals(${actual[0]}, ${addType(expected[0], 'Region')}${assertMessage(message)});`)
                } else if (type !== 'Map') {
                    addCommand(java`Assert.assertEquals(${actual}, ${addType(expected, type)}${assertMessage(message)});`)
                } else {
                    addCommand(java`Assert.assertEqualsDeep(${actual}, ${addType(expected, type, actual.type().generic)}${assertMessage(message)});`)
                }
            }
        },
        notEqual(actual, expected, message) {
            addCommand(java`Assert.assertNotEquals(${actual}, ${expected}${assertMessage(message)});`)
        },
        instanceOf(object, typeName) {
            addCommand(java`Assert.assertTrue(${object} instanceof ${insert(types[typeName].name())});`)
        },
        throws(func, check) {
            let command
            if (check) {
                command = java`Assert.assertThrows(${insert(check())} , new Assert.ThrowingRunnable(){
          public void run() {${func}}
        });`
            } else {
                command = java`Assert.assertThrows(new Assert.ThrowingRunnable(){ 
        public void run() {${func}}
        });`
            }
            addCommand(command)
        },
        ok(arg, message) {
            addCommand(java`Assert.assertNotNull(${arg}${assertMessage(message)});`)
        },
        contains(args, expectedToHave) {
            addCommand(java`Assert.assertTrue(${args}.contains(${expectedToHave}));`)
        }
    }

    const helpers = {
        getTestInfo(result) {
            return addCommand(java`getTestInfo(${result});`).type({
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
                                            length: { rename: 'size' }
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
            return addCommand(java`getDom(${result},${domId});`).type({ type: 'JsonNode', recursive: true }).methods({
                getNodesByAttribute: (dom, attr) => addCommand(java`getNodesByAttributes(${dom}, ${attr});`).type({
                    type: 'List<JsonNode>',
                    schema: { length: { rename: 'size' } },
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
                return addExpression(java`Math.round(${number})`)
            }
        }
    }

    return { driver, eyes, assert, helpers }
}
