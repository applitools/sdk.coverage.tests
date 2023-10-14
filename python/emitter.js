'use strict'
const {checkSettingsParser, layoutBreakpointsArgs, python, framesClassic, parseSelector, parseSelectorByType, regionParameter} = require('./parser')
const {capitalizeFirstLetter, fromCamelCaseToSnakeCase, toLowerSnakeCase} = require('./util')
const find_commands = require('./mapping/find_commands')
const types = require('./mapping/types')

function directString(String) {
    return {
        isRef: true,
        ref: () => {
            if ((String !== undefined) && (((typeof String) === 'string') || (JSON.stringify(String).includes('true')) || (JSON.stringify(String).includes('false')))) {
                if (String.includes('true')) String = String.replace('true', 'True')
                if (String.includes('false')) String = String.replace('false', 'False')
            }
            return String
        }
    }
}

module.exports = function (tracker, test) {
    const {addSyntax, addCommand, addHook, withScope, addType} = tracker
    function findElementFunc(element) {
        if (element.isRef) return element
        else return driver.findElement(element)
    }

    // EG for UFG
    if(test.vg && process.env.UFG_ON_EG) {
        test.executionGrid = true;
    }
    test.playwright = process.env.AUTOMATION_FRAMEWORK === "playwright"

    let emulator = test.env ? test.env.emulation : undefined;
    if(emulator) {
        test.meta.native = false;
        test.meta.mobile = false;
    }

    let mobile = test.meta.mobile
    let legacy = test.env && (test.env.legacy === true)

    addType('JsonNode', {
        getter: ({target, key}) => {
            if (`${key}` !== "len") return `${target}[${key}]`
            else return `${key}(${target})`
        },
        schema: {
            attributes: {type: 'JsonNode', schema: 'JsonNode'},
            length: {type: 'Number', rename: 'len', getter: ({target, key}) => `${key}(${target})`}
        }
    })

    addHook("deps", `import pytest`)
    if (test.features && test.features.includes('image')) {
        addHook("deps", `from applitools.images import Target, Region`);
    } else {
        let framework_namespace = test.playwright ? "applitools.playwright" : "applitools.selenium"
        addHook("deps", `from ${framework_namespace} import (RunnerOptions, Region, OCRRegion, BrowserType, Configuration, Eyes, Target, TargetPath, VisualGridRunner, ClassicRunner, TestResults, AccessibilitySettings, AccessibilityLevel, AccessibilityGuidelinesVersion, AccessibilityRegionType)`);
        addHook("deps", `from applitools.common import StitchMode, MatchLevel, IosDeviceName, DeviceName, VisualGridOption`)
        addHook("deps", `from applitools.core import VisualLocator, TextRegionSettings`)
        if (test.playwright) {
            addHook("deps", `from collections import namedtuple`)
            addHook("beforeEach", `By = namedtuple("By", "CSS_SELECTOR XPATH")("css selector", "xpath")`)
        } else {
            addHook("deps", `from selenium.webdriver.common.by import By`)
            if (mobile) {
                addHook("deps", `from appium.webdriver.common.mobileby import MobileBy`)
            }
        }
    }

    addSyntax('var', ({name, value}) => `${name} = ${value}`)
    addSyntax('getter', ({target, key, type}) => {
        if (key.startsWith('get')) return `${target}.${fromCamelCaseToSnakeCase(key).slice(4)}`
        if (key.startsWith('length')) return `len(${target})`
        if ((type !== undefined) && (type !== null) && (type.name === 'JsonNode')) return `${target}[${key}]`
        if (((type !== undefined) && (type !== null) && (type.name === 'Array')) || (!isNaN(key))) return `${target}[${key}]`
        if (type && types[type.name]) return types[type.name].get(target, key)
        else return `${target}["${key}"]`
    })
    addSyntax('call', ({target, args}) => args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}`)
    addSyntax('return', ({value}) => `return ${value}`)

    if (!mobile) {
        if (!(test.features && test.features.includes('image'))) {
            let removeDuplicateTests = test.config.removeDuplicateTests || test.config.removeDuplicateTestsPerBatch;
            addHook('beforeEach', python`@pytest.fixture(scope="function")`);
            addHook('beforeEach', python`def eyes_runner_class():`);
            if (test.vg) {
                addHook('beforeEach', python`    options = RunnerOptions().test_concurrency(10)`);
                if (removeDuplicateTests !== undefined) {
                    addHook('beforeEach', python`    options = options.remove_duplicate_tests(${removeDuplicateTests})`);
                }
                addHook('beforeEach', python`    return VisualGridRunner(options)`);
            } else {
                addHook('beforeEach', python`    runner = ClassicRunner()`);
                if (removeDuplicateTests !== undefined) {
                    addHook('beforeEach', python`    runner.set_remove_duplicate_tests(${removeDuplicateTests})`);
                }
                addHook('beforeEach', python`    return runner`);
            }
            addHook('beforeEach', python`\n`);
        }

        if (test.config.stitchMode) {
            addHook('beforeEach', python`@pytest.fixture(scope="function")`)
            addHook('beforeEach', python`def stitch_mode():`)
            if (test.config.stitchMode === 'CSS') addHook('beforeEach', python`    return StitchMode.CSS`)
            else addHook('beforeEach', python`    return StitchMode.Scroll`)
            addHook('beforeEach', python`\n`)
        }
    }
    addHook('beforeEach', python`@pytest.fixture(scope="function")`)
    addHook('beforeEach', python`def configuration(eyes):`)
    addHook('beforeEach', python`    conf = eyes.get_configuration()`)
    if ("appName" in test.config) addHook('beforeEach', python`    conf.app_name = ${test.config.appName}`)
    addHook('beforeEach', python`    conf.test_name = ${test.config.baselineName}`)
    if ("branchName" in test.config) addHook('beforeEach', python`    conf.branch_name = ${test.config.branchName};`)
    if ("parentBranchName" in test.config) addHook('beforeEach', python`    conf.parent_branch_name = ${test.config.parentBranchName};`)
    if ("baselineEnvName" in test.config) addHook('beforeEach', python`    conf.baseline_env_name = ${test.config.baselineEnvName};`)
    if ("viewportSize" in test.config) addHook('beforeEach', python`    conf.viewport_size = ${test.config.viewportSize}`)
    if ("hideScrollbars" in test.config) addHook('beforeEach', python`    conf.hide_scrollbars = ${test.config.hideScrollbars};`)
    if ("forceFullPageScreenshot" in test.config) addHook('beforeEach', python`    conf.force_full_page_screenshot = ${test.config.forceFullPageScreenshot}`)
    if ("isDisabled" in test.config) addHook('beforeEach', python`    conf.is_disabled = ${test.config.isDisabled};`)
    if ("defaultMatchSettings" in test.config) {
        if ("accessibilitySettings" in test.config.defaultMatchSettings) {
            let level = `${test.config.defaultMatchSettings.accessibilitySettings.level}`
            let version = `${test.config.defaultMatchSettings.accessibilitySettings.guidelinesVersion}`
            addHook('beforeEach', python`    conf.set_accessibility_validation(AccessibilitySettings(AccessibilityLevel.` + level + `, AccessibilityGuidelinesVersion.` + version + `))`)
        }
        if ("enablePatterns" in test.config.defaultMatchSettings) {
            addHook('beforeEach', python`    conf.set_enable_patterns(${test.config.defaultMatchSettings.enablePatterns})`)
        }
    }
    if ("waitBeforeCapture" in test.config) {
        addHook('beforeEach', python`    conf.set_wait_before_capture(${test.config.waitBeforeCapture})`)
    }
    if (test.config.browsersInfo) {
        addHook('deps', 'from applitools.common.ultrafastgrid import DesktopBrowserInfo, IosDeviceInfo, ChromeEmulationInfo, ScreenOrientation')
        addHook('beforeEach', python`    ${{value: test.config.browsersInfo, type: 'BrowsersInfo'}}`)
    }
    if ("layoutBreakpoints" in test.config) {
        let args = test.config.layoutBreakpoints
        addHook('beforeEach', `    conf.set_layout_breakpoints(${layoutBreakpointsArgs(args)})`)
    }
    if (test.config.properties) {
         test.config.properties.forEach(p=>{
             addHook('beforeEach', python`    conf.add_property(${p.name}, ${p.value})`)
         });
     }
    if ("batch" in test.config) {
        if ("id" in test.config.batch) {
            addHook('deps', 'from datetime import datetime')
            addHook('beforeEach', python`    conf.batch.id = ${test.config.batch.id}`)
        }
        if ("properties" in test.config.batch) {
            addHook('beforeEach', python`    conf.batch.add_property(${test.config.batch.properties[0].name}, ${test.config.batch.properties[0].value})`)
        }
    }


    addHook('beforeEach', python`    eyes.set_configuration(conf)`)
    addHook('beforeEach', python`    return conf`)
    addHook('beforeEach', python`\n`)

    if (mobile) {
        if(test.env.orientation) {
            addHook('beforeEach', python`@pytest.fixture(scope="function")`)
            addHook('beforeEach', python`def orientation():`)
            addHook('beforeEach', python`    return ${test.env.orientation}\n`)
        }
        if(test.env.app) {
            addHook('beforeEach', python`@pytest.fixture(scope="function")`)
            addHook('beforeEach', python`def app():`)
            addHook('beforeEach', python`    return ${test.env.app}\n`)
        }
        if(test.env.nml) {
            addHook('beforeEach', python`@pytest.fixture(scope="function")`)
            addHook('beforeEach', python`def nml():`)
            addHook('beforeEach', python`    return ${test.env.nml}\n`)
        }
        if(test.env.browser) {
            addHook('beforeEach', python`@pytest.fixture(scope="function")`)
            addHook('beforeEach', python`def browser_name():`)
            addHook('beforeEach', python`    return ${test.env.browser}\n`)
        }
        addHook('beforeEach', python`@pytest.fixture(scope="function")`)
        addHook('beforeEach', python`def driver_builder(${directString(toLowerSnakeCase(test.env.device))}):`)
        addHook('beforeEach', python`    return ${directString(toLowerSnakeCase(test.env.device))}\n`)
    }
    else if (emulator) {
        addHook('beforeEach', python`@pytest.fixture(scope="function")`)
        addHook('beforeEach', python`def driver_builder(chrome_emulator):`)
        addHook('beforeEach', python`    return chrome_emulator(${emulator}, ${test.env.args})\n`)
    } else if (!(test.features && test.features.includes('image'))) {
        let browser = (test.env && test.env.browser) ? test.env.browser : "chrome"
        addHook("beforeEach", python`@pytest.fixture(scope="function")`)
        if (test.playwright)
        {
            addHook("beforeEach", python`def pw_browser(pw_${directString(toLowerSnakeCase(browser))}):`)
            addHook("beforeEach", python`    return pw_${directString(toLowerSnakeCase(browser))}\n`)
        } else {
            addHook("beforeEach", python`def driver_builder(${directString(toLowerSnakeCase(browser))}):`)
            addHook("beforeEach", python`    return ${directString(toLowerSnakeCase(browser))}\n`)
        }
    }

    if (legacy) {
        addHook('beforeEach', python`@pytest.fixture(scope="function")`)
        addHook('beforeEach', python`def legacy():`)
        addHook('beforeEach', python`    return True\n`)
    }

    if (test.executionGrid) {
        addHook('beforeEach', python`@pytest.fixture(scope="function")
def execution_grid():
    return True
    `)
    }

    for (const val of test.features || []) {
        const feature = val.replace('-', '_')
        addHook('beforeEach', `@pytest.mark.${feature}`)
    }

    const driver = {
        constructor: {
            isStaleElementError(error) {
                if (test.playwright) {
                    addHook("deps", "from playwright.sync_api import TimeoutError")
                    addCommand(python`TimeoutError`)
                } else {
                    addHook("deps", `from selenium.common.exceptions import StaleElementReferenceException`)
                    addCommand(python`StaleElementReferenceException`)
                }
            },
        },
        cleanup() {
            return addCommand(python`driver.quit()`)
        },
        visit(url) {
            if (test.playwright) {
                return addCommand(python`page.goto(${url})`)
            }
            else {
                return addCommand(python`driver.get(${url})`)
            }
        },
        executeScript(script, arg) {
            if (test.playwright) {
                let call = arg ? `page.evaluate_handle("""function(arguments) {`: `page.evaluate("""function() {`
                let optional_arg = arg ? python`}""", [${arg}])` : `}""")`;
                return addCommand(call + script + optional_arg)
            }
            else {
                let optional_arg = arg ? python`, ${arg}` : "";
                return addCommand(python`driver.execute_script(${script}` + optional_arg + `)`)
            }
        },
        sleep(ms) {
            console.log('Sleep was used Need to Implement')
            // TODO: implement if needed
        },
        switchToFrame(selector) {
            if (test.playwright) {
                return addCommand(python`assert False, "switchToFrame not implemented"`)
            } else {
                return addCommand(python`driver.switch_to.frame(` + framesClassic(selector) + `)`)
            }
        },
        switchToParentFrame() {
            if (test.playwright) {
                return addCommand(python`assert False, "switchToParentFrame not implemented"`)
            } else {
                return addCommand(python`driver.switch_to.parent_frame()`)
            }
        },
        findElement(selector, shadowRoot) {
            if (test.playwright) {
                if (typeof(selector) == "object") {
                    selector = selector["selector"]
                }
                if (shadowRoot) {
                    return addCommand(python`${shadowRoot}.query_selector(${selector})`)
                } else {
                    return addCommand(python`page.locator(${selector}).element_handle()`)
                }
            } else {
                let driver = shadowRoot ? python`${shadowRoot}` : "driver"
                if (selector.type) {
                    let command = `.${find_commands[selector.type](python`${selector.selector}`)}`
                    return addCommand(driver + command)
                }
                return addCommand(driver + `.find_element(` + parseSelectorByType(selector) + `)`)
            }
        },
        getWindowSize() {
            return addCommand(python`driver.get_window_size()`)
        },
        setWindowSize(size) {
            return addCommand(python`driver.set_window_size(${size}["width"], ${size}["height"])`)
        },
        click(element) {
            if (test.playwright) {
                    switch (typeof element) {
                        case "string":
                            return addCommand(`page.click('${element}')`)
                        case "object":
                            return addCommand(`page.click('${element["selector"]}')`)
                    }
            } else {
                let selector = parseSelectorByType(element)
                selector = selector.replace(/\[/g, "")
                selector = selector.replace(/\]/g, "")
                return addCommand(`driver.find_element(` + selector + `).click()`)
            }
        },
        type(element, keys) {
            if (test.playwright) {
                return addCommand(python`${element}.fill(${keys})`)
            } else {
                return addCommand(python`${element}.send_keys(${keys})`)
            }
        },
        scrollIntoView(element, align) {
			let alignTemp = (align) ? align : false
            if (test.playwright) {
                return addCommand(python`${findElementFunc(element)}.evaluate("(elem, arg) => elem.scrollIntoView(arg)", ${alignTemp})`)
            } else {
                return addCommand(python`driver.execute_script("arguments[0].scrollIntoView(arguments[1])", ${findElementFunc(element)}, ${alignTemp})`)
            }
        },
        hover(element, offset) {
            if (test.playwright) {
                return addCommand(python`${findElementFunc(element)}.hover()`)
            } else {
                addHook("deps", `from selenium.webdriver.common.action_chains import ActionChains`)
                return addCommand(python`hover = ActionChains(driver).move_to_element(${findElementFunc(element)})
    hover.perform()`)
            }
        },
    }

    const eyes = {

        constructor: {
            setViewportSize(viewportSize) {
                if (test.playwright) {
                    return addCommand(python`Eyes.set_viewport_size(page, ${viewportSize})`)
                } else {
                    return addCommand(python`Eyes.set_viewport_size(driver, ${viewportSize})`)
                }
            }
        },

        getViewportSize() {
            if (test.playwright) {
                return addCommand(python`eyes.get_viewport_size(page)`)
            } else {
                return addCommand(python`eyes.get_viewport_size(driver)`)
            }
        },

        runner: {
            getAllTestResults(throwEx) {
                return addCommand(python`eyes._runner.get_all_test_results(${throwEx})`).type('TestResultsSummary').methods({
                    getAllResults: (target) => addCommand(python`${target}.all_results`).type({
                        type: 'Array',
                        items: {
                            type: 'TestResultContainer',
                            schema: {
                                exception: {
                                    type: "Exception",
                                },
                                testResults: {
                                    type: "TestResults",
                                    schema: {
                                        isAborted: "Boolean"
                                    }
                                },
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
                                }
                            }
                        }
                    })
                })
            },
        },

        open({appName, viewportSize}) {
            let image = test.features && test.features.includes("image")
            let openArgs = []
            if (!image) {
                openArgs.push(test.playwright ? "page" : "driver")
            }
            if (appName) {
                openArgs.push(python`app_name=${appName}`)
            }
            if (viewportSize) {
                if (image) {
                    openArgs.push(python`dimension=${viewportSize}`)
                } else {
                    openArgs.push(python`viewport_size=${viewportSize}`)
                }
            }
            return addCommand(`eyes.open(${openArgs.join()})`)
        },
        check({image, dom, ...checkSettings} = {}) {
            if (test.api === 'classic') {
                if (checkSettings === undefined || (checkSettings.frames === undefined && checkSettings.region === undefined)) {
                    if (image) {
                        addCommand(python`eyes.check_image(${image})`);
                    } else {
                        let nm = ((checkSettings) && (checkSettings.name)) ? checkSettings.name : undefined
                        let timeout = checkSettings ? checkSettings.timeout : undefined
                        let isFully = checkSettings ? checkSettings.isFully : undefined
                        eyes.checkWindow(nm, timeout, isFully)
                    }
                } else if (checkSettings.frames && checkSettings.region) {
                    eyes.checkRegionInFrame(checkSettings.frames, checkSettings.region, checkSettings.timeout, checkSettings.tag, checkSettings.isFully)
                } else if (checkSettings.frames) {
                    eyes.checkFrame(checkSettings.frames, checkSettings.timeout, checkSettings.tag)
                } else if (checkSettings.region) {
                    eyes.checkRegion(image, checkSettings.region, checkSettings.tag, checkSettings.timeout, checkSettings.isFully)
                } else {
                    throw new Error('Not implemented classic api method was tried to generate')
                }
            } else {
                addCommand(`eyes.check(${checkSettingsParser(image, dom, checkSettings)})`);
            }
        },
        checkWindow(tag, matchTimeout, stitchContent) {
            let Tag = !tag ? `None` : `tag="${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `, match_timeout=${matchTimeout}`
            let fully = (stitchContent === undefined) ? `` : `, fully=${capitalizeFirstLetter(stitchContent)}`
            return addCommand(python`eyes.check_window(` + Tag + MatchTimeout + fully + `)`)
        },
        checkFrame(frameReference, matchTimeout, tag) {
            let Tag = !tag ? `` : `, tag="${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `, match_timeout=${matchTimeout}`
            return addCommand(python`eyes.check_frame(` + framesClassic(frameReference) + Tag + MatchTimeout + `)`)
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
        By.CSS_SELECTOR, ${selector},
        tag=${tag},
        match_timeout=${matchTimeout},
      )`)
        },
        checkRegion(image, region, tag, matchTimeout, isFully) {
            /*let args = `region='${region}'` +
                `${tag ? `, tag=${tag}` : ''}` +
                `${matchTimeout ? `, timeout=${matchTimeout}` : ''}`
            return addCommand(python`eyes.check_region(${args})`)*/
            let image_arg = image ? python`${image}, ` : '';
            let Tag = !tag ? `` : `, tag="${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `, match_timeout=${matchTimeout}`
            let fully = !isFully ? `` : `, stitch_content=${capitalizeFirstLetter(isFully)}`
            return addCommand('eyes.check_region(' + image_arg + regionParameter(region) + Tag + MatchTimeout + fully + `)`)
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
        checkRegionInFrame(frameReference, region, matchTimeout, tag, isFully) {
            let Tag = !tag ? `` : `, tag="${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `, match_timeout=${matchTimeout}`
            let fully = !isFully ? `` : `, stitch_content=${capitalizeFirstLetter(isFully)}`
            return addCommand(python`eyes.check_region_in_frame(` +
                framesClassic(frameReference) + `, ` +
                regionParameter(region) + Tag + MatchTimeout + fully + `)`
            )
        },
        close(throwEx = true) {
            let isThrow = throwEx.toString()
            return addCommand(python`eyes.close(raise_ex=` + isThrow[0].toUpperCase() + isThrow.slice(1) + `)`).type('TestResults')
        },
        abort() {
            return addCommand(python`eyes.abort()`).type("TestResults")
        },
        locate(visualLocatorSettings) {
            let names = `${visualLocatorSettings.locatorNames}`
            names = names.replace(/\[/g, "")
            names = names.replace(/\]/g, "")
            return addCommand(python`eyes.locate(VisualLocator.name(${names}))[${names}][0]`)
        },
        extractText(ocrRegions) {
            const commands = []
            commands.push(python`eyes.extract_text(`)
            for (const index in ocrRegions) {
                commands.push(python`OCRRegion(`)
                const region = ocrRegions[index]
                if (typeof (region.target) === "string") {
                    commands.push(python`[By.CSS_SELECTOR, ${region.target}])`)
                } else if (typeof (region.target) === "object") {
                    commands.push(python`Region(${region.target.left || region.target.x}, ${region.target.top || region.target.y}, ${region.target.width}, ${region.target.height}))`)
                } else {
                    commands.push(python`${region.target})`)
                }

                if (region.hint) {
                    commands.push(python`.hint(${region.hint})`)
                }
                if (region.minMatch) {
                    commands.push(python`.min_match(${region.minMatch})`)
                }
                if (region.language) {
                    commands.push(python`.language(${region.language})`)
                }
                commands.push(python`, `)
            }
            commands.pop()
            commands.push(python`);`)
            return addCommand([commands.join('')]).type({
                type: 'List<String>',
                items: {
                    type: 'String'
                }
            });
        },
        extractTextRegions({patterns, ignoreCase, firstOnly, language}) {
            const commands = []
            commands.push(python`eyes.extract_text_regions(TextRegionSettings(${insert(patterns.map(JSON.stringify).join(', '))})`)
            if (ignoreCase) commands.push(python`.ignore_case(${ignoreCase})`)
            if (firstOnly) commands.push(python`.first_only(${firstOnly})`)
            if (language) commands.push(python`.language(${language})`)
            commands.push(python`);`)
            return addCommand([commands.join('')]).type({
                type: 'Map<String, List<TextRegion>>',
                items: {
                    type: 'List<TextRegion>',
                    getter: ({target, key}) => {
                        if (`${key}` !== "len") return `${target}[${key}]`
                        else return `${key}(${target})`
                    },
                    schema: {
                        length: {type: 'Number', rename: 'len', getter: ({target, key}) => `${key}(${target})`}
                    },
                    items: {
                        type: 'TextRegion',
                        schema: {text: {type: 'String'}}
                    }
                }
            })
        }
    }

    const assert = {
        contains(object, value) {
            return addCommand(python`assert ${value} in ${object}`)
        },
        equal(actual, expected, message) {
            if (expected === null) return addCommand(python`assert ${actual} is None`)
            if ((expected && expected.isRef) && (JSON.stringify(expected) === undefined)) return addCommand(python`assert ${actual} == ` + expected.ref())
            if (((typeof expected) === 'string') && (expected === 'true')) return addCommand(python`assert ${actual} == ${expected}, ${message}`)
            if (expected.hasOwnProperty('applitools_title')) return addCommand(python`assert ${actual} == Region(${expected.applitools_title[0].left}, ${expected.applitools_title[0].top}, ${expected.applitools_title[0].width}, ${expected.applitools_title[0].height})`)
            return addCommand(python`assert ${actual} == ${directString(JSON.stringify(expected))}, ${message}`)
        },
        notEqual(actual, expected, message) {
            return addCommand(python`assert ${actual} != ${directString(JSON.stringify(expected))}, ${message}`)
        },
        ok(value, message) {
            return addCommand(python`assert ${value}, ${message}`)
        },
        instanceOf(object, className, message) {
            return addCommand(python`assert isinstance(${object}, ${directString(className)}), ${message}`)
        },
        throws(func, check) {
            let command
            if (check) {
                command = python`with pytest.raises(${check}):
                     ${func}`
            } else {
                command = python`with pytest.raises(Exception):${func}`
            }
            const commands = test.output.commands
            const initialLength = commands.length
            addCommand(command)
            commands.splice(commands.length - 1, 1)
            commands.forEach((el, index, arr) => {
                if (index > initialLength) arr[index] = `    ${el}`
            })
        },
    }

    const helpers = {
        getTestInfo(result) {
            return addCommand(python`helpers.get_test_info(${result})`)
        },
        getDom(result, domId) {
            return addCommand(python`helpers.get_dom(${result}, ${domId})`).type({type: 'JsonNode'}).methods({
                getNodesByAttribute: (dom, name) => addCommand(python`helpers.get_nodes_by_attribute(${dom}, ${name});`).type({type: 'JsonNode'})
            })
        },
        math: {
            round(number) {
                return addCommand(python`round(${number})`)
            },
        }
    }

    return {driver, eyes, assert, helpers}
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
