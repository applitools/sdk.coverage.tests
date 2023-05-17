'use strict'
const types = require('./mapping/types')
const { TAGS } = require('./mapping/supported')
const { checkSettingsParser, dot_net: dot_net, getter, variable, call, returnSyntax, wrapSelector, parseEnv } = require('./parser')
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
                    result += dot_net`${param}, `
                else
                    result += dot_net`${param}`
            }
            result += `)`
        }
        return insert(result)
    }

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
    addHook('deps', `using NUnit.Framework;`)
    addHook('deps', `using Applitools.Playwright;`)
    addHook('deps', `using Applitools.Playwright.Fluent;`)
    addHook('deps', `using Applitools.Playwright.Universal;`)
    addHook('deps', `using Applitools.Utils.Geometry;`) 
    addHook('afterEach', `runner.GetAllTestResults(false);`)
    
    // Not specific
    addHook('deps', `using Applitools;`)
    addHook('deps', `using Applitools.Playwright;`)
    addHook('deps', `using Microsoft.Playwright;`)
    addHook('deps', `using System;`)
    addHook('deps', `using System.Linq;`)

    addHook('deps', ``)

    addHook('deps', `namespace Applitools.Generated.Playwright.Tests`)
    addHook('deps', `{`)
    addHook('deps', `[TestFixture]`)
    addHook('deps', `[Parallelizable]`)
    addHook('deps', `public class ${test.key}Class : TestSetupGenerated`)

    addSyntax('var', variable)
    addSyntax('getter', getter)
    addSyntax('call', call)
    addSyntax('return', returnSyntax)

    addHook('beforeEach', dot_net`initEyes(${argumentCheck(test.vg, false)}, ${argumentCheck(test.config.stitchMode, 'Scroll')}, ${argumentCheck(test.branchName, "master")});`,)
    addHook('beforeEach', parseEnv({ ...test.env, executionGrid: test.executionGrid }))
    const specific = ['baselineName', 'browsersInfo', 'appName', 'defaultMatchSettings', 'layoutBreakpoints', 'batch'];
    Object.keys(test.config).filter(property => !specific.includes(property))
        .forEach(property => addHook('beforeEach', dot_net`set${insert(capitalizeFirstLetter(property))}(${test.config[property]});`))
    if (test.config.browsersInfo) {
        addHook('deps', 'using Applitools.Visualgrid;')
        addHook('beforeEach', dot_net`setBrowsersInfo(${{ value: test.config.browsersInfo, type: 'BrowsersInfo' }});`)
    }
    if (test.config.defaultMatchSettings) {
        const defaultMatchSettings = test.config.defaultMatchSettings
        Object.keys(defaultMatchSettings)
            .forEach(property => {
                if (property === 'enablePatterns') addHook('beforeEach', `set${capitalizeFirstLetter(property)}(${defaultMatchSettings[property]});`); 
                else addHook('beforeEach',
                dot_net`set${insert(capitalizeFirstLetter(property))}(${{ value: defaultMatchSettings[property], ...ImageMatchSettings.schema[property] }});`)
            })
    }
    if (test.config.layoutBreakpoints) {
        addHook('beforeEach', `setLayoutBreakpoints(${test.config.layoutBreakpoints});`)
    }
    if (test.config.batch) {
        addHook('beforeEach', `setBatch("${test.config.baselineName}", new HashMap[] {\n    ${test.config.batch.properties.map(val => {
            return { value: val, type: 'Map', generic: [{ name: 'String' }, { name: 'String' }] }
        }).map(property => dot_net`${property}`).join(',\n    ')}});`)
    }

    addHook('afterEach', dot_net`driver?.Close();`)
    addHook('afterEach', dot_net`getBuilder()?.Quit();`)
    addHook('afterEach', dot_net`eyes?.Abort();`)

    const driver = {
        constructor: {
            isStaleElementError: () => 'PlaywrightStaleElementReferenceException.class'
        },
        visit(url) {
            addCommand(dot_net`getPage().navigate(${url});`)
        },
        executeScript(script, ...args) {
            let actualScript = script;
            if (script.startsWith("arguments[0]")) {
                actualScript = `arguments => { ${script} };`
                return addCommand(dot_net`getPage().evaluate(${actualScript}${extraParameters(args)});`)
            } else if (script.startsWith('return')) {
                actualScript = `() => { ${script} };`
                return addCommand(dot_net`getPage().evaluate(${actualScript}${extraParameters(args)});`)
            }
            return addCommand(dot_net`getPage().evaluate(${actualScript}${extraParameters(args)});`)
        },
        switchToFrame(selector) {
            if (selector === null) {
                addCommand(dot_net`getPage().mainFrame();`)
            } else {
                addCommand(dot_net`${selector}.contentFrame();`)
            }
        },
        switchToParentFrame() {
            addCommand(dot_net`getPage().mainFrame().parentFrame();`)
        },
        findElement(selector) {
            return addCommand(dot_net`getPage().locator(${wrapSelector(selector)}).elementHandle();`).type('Element')
        },
        findElements(selector) {
            return addCommand(dot_net`getDriver().findElements(${wrapSelector(selector)}));`).type('Array<Element>')
        },
        click(element) {
            if (element.isRef) addCommand(dot_net`${element}.click();`)
            else addCommand(dot_net`getPage().locator(${element}).click();`)
        },
        type(element, keys) {
            addCommand(dot_net`${element}.fill(${keys});`)
        },
        scrollIntoView(element, align = false) {
            addCommand(dot_net`${element}.scrollIntoViewIfNeeded();`)
        },
        hover(element, offset) {
            addCommand(dot_net`${findElement(element)}.hover();`)
        }
    }

    const eyes = {
        constructor: {
            setViewportSize(viewportSize) {
                return addCommand(dot_net`Eyes.setViewportSize(getDriver(), ${addType(viewportSize, 'RectangleSize')});`)
            }
        },
        runner: {
            getAllTestResults(throwEx) {
                return addCommand(dot_net`getRunner().getAllTestResults(${throwEx});`).type('TestResultsSummary').methods({
                    getAllResults: (target) => addCommand(dot_net`${target}.getAllResults();`).type({
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
            command.push('eyes.Open(driver')
            command.push(dot_net`, ${appName || test.config.appName}`)
            command.push(dot_net`, ${testName || test.config.baselineName}`)
            if (viewportSize) command.push(dot_net`, new RectangleSize(${viewportSize.width}, ${viewportSize.height})`)
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
                addCommand(`eyes.Check(${checkSettingsParser(checkSettings, test.meta.native)});`)
            }
        },
        checkWindow(tag, matchTimeout, stitchContent) {
            if (matchTimeout && stitchContent) throw new Error(`There is no signature in dotnet SDK for usage both matchTimeout and stitchContent`)
            const commands = []
            commands.push(dot_net`eyes.Check(Target`)
            commands.push(dot_net`.Window()`)
            if (matchTimeout) commands.push(dot_net`.Timeout(${matchTimeout})`)
            if (stitchContent !== undefined) commands.push(dot_net`.Fully(${stitchContent})`)
            if (tag) commands.push(dot_net`.WithName(${tag})`)
            commands.push(dot_net`);`)
            addCommand([commands.join('')])
        },
        checkFrame(element, matchTimeout, tag) {
            const commands = []
            commands.push(dot_net`eyes.Check(Target`)
            commands.push(dot_net`.Frame(${findFrame(element)})`)
            if (matchTimeout) commands.push(dot_net`.Timeout(${matchTimeout})`)
            if (tag) commands.push(dot_net`.WithName(${tag})`)
            commands.push(dot_net`.Fully());`)
            addCommand([commands.join('')])
        },
        checkRegion(region, matchTimeout, tag) {
            const commands = []
            commands.push(dot_net`eyes.Check(Target`)
            commands.push(dot_net`.Region(${wrapSelector(region)})`)
            if (matchTimeout) commands.push(dot_net`.Timeout(${matchTimeout})`)
            if (tag) commands.push(dot_net`.WithName(${tag})`)
            commands.push(dot_net`);`)
            addCommand([commands.join('')])
        },
        checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
            const commands = []
            commands.push(dot_net`eyes.Check(Target`)
            commands.push(dot_net`.Frame(${findFrame(frameReference)})`)
            commands.push(dot_net`.Region(${wrapSelector(selector)})`)
            if (matchTimeout) commands.push(dot_net`.Timeout(${matchTimeout})`)
            if (tag) commands.push(dot_net`.WithName(${tag})`)
            if (stitchContent) commands.push(dot_net`.Fully(${stitchContent})`)
            commands.push(dot_net`);`)
            addCommand([commands.join('')])
        },
        close(throwEx) {
            return addCommand(dot_net`eyes.Close(${argumentCheck(throwEx, true)});`).type(TestResults)
        },
        abort() {
            return addCommand(dot_net`eyes.Abort();`).type(TestResults)
        },
        getViewportSize() {
            return addCommand(dot_net`eyes.GetViewportSize();`).type({
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
            return addCommand(dot_net`eyes.locate(new VisualLocatorSettings().names(Arrays.asList(${visualLocator.locatorNames.join(', ')})));`).type('Map<String, List<Region>>')
        },
        extractText(ocrRegions) {
            const commands = []
            commands.push(dot_net`eyes.extractText(`)
            for (const index in ocrRegions) {
                commands.push(dot_net`new OcrRegion(`)
                const region = ocrRegions[index]
                if (typeof (region.target) === "string") {
                    commands.push(dot_net`${region.target})`)
                } else if (typeof (region.target) === "object") {
                    commands.push(dot_net`new Region(${region.target.left || region.target.x}, ${region.target.top || region.target.y}, ${region.target.width}, ${region.target.height}))`)
                } else {
                    commands.push(dot_net`${region.target})`)
                }

                if (region.hint) {
                    commands.push(dot_net`.Hint(${region.hint})`)
                }
                if (region.minMatch) {
                    commands.push(dot_net`.MinMatch(${region.minMatch})`)
                }
                if (region.language) {
                    commands.push(dot_net`.language(${region.language})`)
                }
                commands.push(dot_net`, `)
            }
            commands.pop()
            commands.push(dot_net`);`)
            return addCommand([commands.join('')]).type({
                type: 'List<String>',
                items: {
                    type: 'String'
                }
            });
        },
        extractTextRegions({ patterns, ignoreCase, firstOnly, language }) {
            const commands = []
            commands.push(dot_net`eyes.ExtractTextRegions(new TextRegionSettings(${insert(patterns.map(JSON.stringify).join(', '))})`)
            if (ignoreCase) commands.push(dot_net`.IgnoreCase(${ignoreCase})`)
            if (firstOnly) commands.push(dot_net`.FirstOnly(${firstOnly})`)
            if (language) commands.push(dot_net`.Language(${language})`)
            commands.push(dot_net`);`)
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
                addCommand(dot_net`Assert.assertNull(${actual}${assertMessage(message)});`)
            } else if (expected.isRef) {
                const typeCasting = actual.type().name === 'Number' ? insert(` (long) `) : emptyValue()
                addCommand(dot_net`Assert.assertEquals(${typeCasting}${actual}, ${expected}${assertMessage(message)});`)
            } else {
                const type = getTypeName(actual)
                if (type === 'JsonNode') {
                    addCommand(dot_net`Assert.assertEquals(${actual}.asText(""), ${expected}${assertMessage(message)});`)
                } else if (type === 'Array') {
                    addCommand(dot_net`Assert.assertEquals(${actual[0]}, ${addType(expected[0], 'Region')}${assertMessage(message)});`)
                } else if (type !== 'Map') {
                    addCommand(dot_net`Assert.assertEquals(${actual}, ${addType(expected, type)}${assertMessage(message)});`)
                } else {
                    addCommand(dot_net`Assert.assertEqualsDeep(${actual}, ${addType(expected, type, actual.type().generic)}${assertMessage(message)});`)
                }
            }
        },
        notEqual(actual, expected, message) {
            addCommand(dot_net`Assert.assertNotEquals(${actual}, ${expected}${assertMessage(message)});`)
        },
        instanceOf(object, typeName) {
            addCommand(dot_net`Assert.assertTrue(${object} instanceof ${insert(types[typeName].name())});`)
        },
        throws(func, check) {
            let command
            if (check) {
                command = dot_net`Assert.assertThrows(${insert(check())} , new Assert.ThrowingRunnable(){
          public void run() {${func}}
        });`
            } else {
                command = dot_net`Assert.assertThrows(new Assert.ThrowingRunnable(){ 
        public void run() {${func}}
        });`
            }
            addCommand(command)
        },
        ok(arg, message) {
            addCommand(dot_net`Assert.assertNotNull(${arg}${assertMessage(message)});`)
        },
        contains(args, expectedToHave) {
            addCommand(dot_net`Assert.assertTrue(${args}.contains(${expectedToHave}));`)
        }
    }

    const helpers = {
        getTestInfo(result) {
            return addCommand(dot_net`getTestInfo(${result});`).type({
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
            return addCommand(dot_net`getDom(${result},${domId});`).type({ type: 'JsonNode', recursive: true }).methods({
                getNodesByAttribute: (dom, attr) => addCommand(dot_net`getNodesByAttributes(${dom}, ${attr});`).type({
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
                return addExpression(dot_net`Math.round(${number})`)
            }
        }
    }

    return { driver, eyes, assert, helpers }
}
