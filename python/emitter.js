'use strict'
const {checkSettingsParser, python, framesClassic, parseSelector, parseSelectorByType, regionParameter} = require('./parser')
const {capitalizeFirstLetter, toLowerSnakeCase} = require('./util')
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
    let emulator = test.env && test.env.device === "Android 8.0 Chrome Emulator"
    if(emulator) {
        test.meta.native = false;
        test.meta.mobile = false;
    }

    let mobile = test.meta.mobile
    let legacy = test.env && (test.env.legacy === true)
    let openPerformed = false

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


    addHook('deps', `import pytest`)
    addHook('deps', `import selenium`)
    addHook('deps', `from selenium import webdriver`)
    addHook('deps', `from selenium.webdriver.common.by import By`)
    addHook('deps', `from selenium.webdriver.common.action_chains import ActionChains`)
    if (mobile) {
        addHook('deps', `from appium.webdriver.common.mobileby import MobileBy`)
        addHook('deps', `from applitools.core import Feature`)
    }
    addHook('deps', `from test import *`)
    addHook('deps', `from applitools.selenium import (Region, OCRRegion, BrowserType, Configuration, Eyes, Target, VisualGridRunner, ClassicRunner, TestResults, AccessibilitySettings, AccessibilityLevel, AccessibilityGuidelinesVersion, AccessibilityRegionType)`)
    addHook('deps', `from applitools.common import StitchMode, MatchLevel, IosDeviceName, DeviceName, VisualGridOption`)
    addHook('deps', `from applitools.core import VisualLocator, TextRegionSettings`)

    addSyntax('var', ({name, value}) => `${name} = ${value}`)
    addSyntax('getter', ({target, key, type}) => {
        if (key.startsWith('get')) return `${target}.${key.slice(3).toLowerCase()}`
        if (key.startsWith('length')) return `len(${target})`
        if ((type !== undefined) && (type !== null) && (type.name === 'JsonNode')) return `${target}[${key}]`
        if (((type !== undefined) && (type !== null) && (type.name === 'Array')) || (!isNaN(key))) return `${target}[${key}]`
        if (type && types[type.name]) return types[type.name].get(target, key)
        else return `${target}["${key}"]`
    })
    addSyntax('call', ({target, args}) => args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}`)
    addSyntax('return', ({value}) => `return ${value}`)

    if (!mobile) {
        addHook('beforeEach', python`@pytest.fixture(scope="function")`)
        addHook('beforeEach', python`def eyes_runner_class():`)
        if (test.vg) addHook('beforeEach', python`    return VisualGridRunner(10)`)
        else addHook('beforeEach', python`    return ClassicRunner()`)
        addHook('beforeEach', python`\n`)

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
    addHook('beforeEach', python`    conf.test_name = ${test.config.baselineName}`)
    if ("branchName" in test.config) addHook('beforeEach', python`    conf.branch_name = ${test.config.branchName};`)
    if ("parentBranchName" in test.config) addHook('beforeEach', python`    conf.parent_branch_name = ${test.config.parentBranchName};`)
    if ("hideScrollbars" in test.config) addHook('beforeEach', python`    conf.hide_scrollbars = ${test.config.hideScrollbars};`)
    if ("isDisabled" in test.config) addHook('beforeEach', python`    conf.is_disabled = ${test.config.isDisabled};`)
    if (("defaultMatchSettings" in test.config) && ("accessibilitySettings" in test.config.defaultMatchSettings)) {
        let level = `${test.config.defaultMatchSettings.accessibilitySettings.level}`
        let version = `${test.config.defaultMatchSettings.accessibilitySettings.guidelinesVersion}`
        addHook('beforeEach', python`    conf.set_accessibility_validation(AccessibilitySettings(AccessibilityLevel.` + level + `, AccessibilityGuidelinesVersion.` + version + `))`)
    }
    if (test.config.browsersInfo) {
        addHook('deps', 'from applitools.common.ultrafastgrid import DesktopBrowserInfo, IosDeviceInfo, ChromeEmulationInfo, ScreenOrientation')
        addHook('beforeEach', python`    conf.add_browser(${{value: test.config.browsersInfo, type: 'BrowsersInfo'}})`)
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


    addHook('beforeEach', python`    return conf`)
    addHook('beforeEach', python`\n`)

    if (mobile) {
        if(test.env.app) {
            addHook('beforeEach', python`@pytest.fixture(scope="function")`)
            addHook('beforeEach', python`def app():`)
            addHook('beforeEach', python`    return ${test.env.app}\n`)
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
        addHook('beforeEach', python`    return chrome_emulator\n`)
    } else if (test.env && test.env.browser){
        addHook('beforeEach', python`@pytest.fixture(scope="function")`)
        addHook('beforeEach', python`def driver_builder(${directString(toLowerSnakeCase(test.env.browser))}):`)
        addHook('beforeEach', python`    return ${directString(toLowerSnakeCase(test.env.browser))}\n`)
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

    const driver = {
        constructor: {
            isStaleElementError(error) {
                addCommand(python`selenium.common.exceptions.StaleElementReferenceException`)
            },
        },
        cleanup() {
            return addCommand(python`driver.quit()`)
        },
        visit(url) {
            return addCommand(python`driver.get(${url})`)
        },
        executeScript(script, ...args) {
            if (args.length > 0) {
                if (openPerformed) return addCommand(python`eyes_driver.execute_script(${script}, ${args[0]})`)
                else return addCommand(python`driver.execute_script(${script}, ${args[0]})`)
            }
            if (openPerformed) return addCommand(python`eyes_driver.execute_script(${script})`)
            else return addCommand(python`driver.execute_script(${script})`)
        },
        sleep(ms) {
            console.log('Sleep was used Need to Implement')
            // TODO: implement if needed
        },
        switchToFrame(selector) {
            //return addCommand(python`driver.switch_to.frame(${selector})`)
            return addCommand(python`eyes_driver.switch_to.frame(` + framesClassic(selector) + `)`)
        },
        switchToParentFrame() {
            return addCommand(python`eyes_driver.switch_to.parent_frame()`)
        },
        findElement(selector) {
            let drv = "driver"
            if (openPerformed) drv = "eyes_driver"
            if (selector.type) {
                let command = `.${find_commands[selector.type]}`
                return addCommand(python`` + drv + command + `(\"${selector.selector}\")`)
            }
            return addCommand(python`` + drv + `.find_element(` + parseSelectorByType(selector) + `)`)
        },
        findElements(selector) {
            return addCommand(python`eyes_driver.find_elements_by_css_selector(${selector})`)
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
            let drv = "driver"
            if (openPerformed) drv = "eyes_driver"
            let selector = parseSelectorByType(element)
            selector = selector.replace(/\[/g, "")
            selector = selector.replace(/\]/g, "")
            return addCommand(python`` + drv + `.find_element(` + selector + `).click()`)
        },
        type(element, keys) {
            return addCommand(python`${element}.send_keys(${keys})`)
        },
        scrollIntoView(element, align) {
			let alignTemp = (align) ? align : false
            if (openPerformed) return addCommand(python`eyes_driver.execute_script("arguments[0].scrollIntoView(arguments[1])", ${findElementFunc(element)}, ${alignTemp});`)
            return addCommand(python`driver.execute_script("arguments[0].scrollIntoView(arguments[1])", ${findElementFunc(element)}, ${align});`)
        },
        hover(element, offset) {
            if (openPerformed) return addCommand(python`hover = ActionChains(eyes_driver).move_to_element(${findElementFunc(element)})
    hover.perform()`)
            return addCommand(python`hover = ActionChains(driver).move_to_element(${findElementFunc(element)})
    hover.perform()`)
        },
    }

    const eyes = {

        constructor: {
            setViewportSize(viewportSize) {
                return addCommand(python`Eyes.set_viewport_size(driver, ${viewportSize})`)
            }
        },

        getViewportSize() {
            return addCommand(python`eyes.get_viewport_size(driver)`)
        },

        runner: {
            getAllTestResults(throwEx) {
                return addCommand(python`eyes._runner.get_all_test_results(${throwEx})`).type('TestResultsSummary').methods({
                    getAllResults: (target) => addCommand(python`${target}.all_results`).type({
                        type: 'Array',
                        items: {
                            type: 'TestResultContainer',
                            schema: {
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
            let new_line = '\n    '
            let scale_mobile_app = (mobile) && (test.name.includes('iOS')) ? 'eyes.configure.set_features(Feature.SCALE_MOBILE_APP)\n    ' : ''
            let appNm = (appName) ? appName : test.config.appName
            openPerformed = true
            return addCommand(python`configuration.app_name = ${appNm}
    configuration.viewport_size = ${viewportSize}
    eyes.set_configuration(configuration)` + new_line + scale_mobile_app +
                `eyes_driver = eyes.open(driver)`)
        },
        check(checkSettings) {
			if(checkSettings !== undefined && checkSettings.visualGridOptions)
			{
				addCommand(`conf = eyes.get_configuration()`)
				var options = checkSettings.visualGridOptions
				for (var key of Object.keys(options))
				{
					let value = ((typeof options[key]) === "boolean") ? capitalizeFirstLetter(options[key]) : options[key]
					addCommand(`conf.set_visual_grid_options(VisualGridOption("${key}", ${value}))`)
				}
				addCommand(`eyes.set_configuration(conf)`)
			}
            if (test.api === 'classic') {
                if (checkSettings === undefined || (checkSettings.frames === undefined && checkSettings.region === undefined)) {
                    let nm = ((checkSettings) && (checkSettings.name)) ? checkSettings.name : undefined
                    let timeout = checkSettings ? checkSettings.timeout : undefined
                    let isFully = checkSettings ? checkSettings.isFully : undefined
                    eyes.checkWindow(nm, timeout, isFully)
                } else if (checkSettings.frames && checkSettings.region) {
                    eyes.checkRegionInFrame(checkSettings.frames, checkSettings.region, checkSettings.timeout, checkSettings.tag, checkSettings.isFully)
                } else if (checkSettings.frames) {
                    eyes.checkFrame(checkSettings.frames, checkSettings.timeout, checkSettings.tag)
                } else if (checkSettings.region) {
                    eyes.checkRegion(checkSettings.region, checkSettings.tag, checkSettings.timeout, checkSettings.isFully)
                } else {
                    throw new Error('Not implemented classic api method was tried to generate')
                }
            } else {
                addCommand(`eyes.check(${checkSettingsParser(checkSettings)})`)
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
        checkRegion(region, tag, matchTimeout, isFully) {
            /*let args = `region='${region}'` +
                `${tag ? `, tag=${tag}` : ''}` +
                `${matchTimeout ? `, timeout=${matchTimeout}` : ''}`
            return addCommand(python`eyes.check_region(${args})`)*/
            let Tag = !tag ? `` : `, tag="${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `, match_timeout=${matchTimeout}`
            let fully = !isFully ? `` : `, stitch_content=${capitalizeFirstLetter(isFully)}`
            return addCommand(python`eyes.check_region(` + regionParameter(region) + Tag + MatchTimeout + fully + `)`)
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
            return addCommand(python`eyes.close(raise_ex=` + isThrow[0].toUpperCase() + isThrow.slice(1) + `)`)
        },
        abort() {
            return addCommand(python`eyes.abort()`)
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
                    commands.push(python`Region(${region.target.left}, ${region.target.top}, ${region.target.width}, ${region.target.height}))`)
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
            return addCommand(python`get_test_info(eyes.api_key, ${result})`)
        },
        getDom(result, domId) {
            return addCommand(python`get_dom(${result}, ${domId})`).type({type: 'JsonNode'}).methods({
                getNodesByAttribute: (dom, name) => addCommand(python`getNodesByAttribute(${dom}, ${name});`).type({type: 'JsonNode'})
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
