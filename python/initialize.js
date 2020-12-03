'use strict'
const {checkSettingsParser, python} = require('./parser')

function directString(String) {
    return {
        isRef: true,
        ref: () => String
    }
}

module.exports = function (tracker, test) {
    const {addSyntax, addCommand, addHook, withScope} = tracker


    addHook('deps', `import pytest`)
    addHook('deps', `import selenium`)
    addHook('deps', `from selenium.webdriver.common.by import By`)
    addHook('deps', `from python.test import *`)
    addHook('deps', `from applitools.selenium import (Region, BrowserType, Configuration, Eyes, Target, VisualGridRunner, ClassicRunner, TestResults)`)
    addHook('deps', `from applitools.common import StitchMode`)

    addSyntax('var', ({name, value}) => `${name} = ${value}`)
    addSyntax('getter', ({target, key, type}) => {
        return `${target}${key.startsWith('get') ?
            `.${key.slice(3).toLowerCase()}` :
            `[${type.name === 'Array' ? key : `"${key}"`}]`}`
    })
    addSyntax('call', ({target, args}) => args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}`)
    addSyntax('return', ({value}) => `return ${value}`)

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
            if (args.length > 0) console.log('Need to Implement args for the execute script')
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
            return addCommand(python`driver.find_element_by_css_selector(${selector})`)
        },
        findElements(selector) {
            return addCommand(python`driver.find_elements_by_css_selector(${selector})`)
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
        scrollIntoView(element, align) {
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

        getViewportSize() {
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
        close(throwEx = true) {
            let isThrow = throwEx.toString()
            return addCommand(python`eyes.close(raise_ex=` + isThrow[0].toUpperCase() + isThrow.slice(1) + `)`)
        },
        abort() {
            return addCommand(python`eyes.abort`)
        },
        locate(visualLocatorSettings) {
            return addCommand(python`eyes.locate(${visualLocatorSettings})`)
        },
        extractText(regions) {
            return addCommand(python`eyes.extract_text(${regions})`)
        }
    }

    const assert = {
        equal(actual, expected, message) {
            return addCommand(python`assert ${actual} == ${expected}, ${message}`)
        },
        notEqual(actual, expected, message) {
            return addCommand(python`assert ${actual} != ${expected}, ${message}`)
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
            return addCommand(python`get_test_info(eyes.api_key, ${result})`).type({
                type: 'TestInfo',
                schema: {
                    actualAppOutput: {
                        type: 'Array',
                        items: {
                            type: 'AppOutput',
                            schema: {
                                image: {
                                    type: 'Image',
                                    schema: {hasDom: 'Boolean'},
                                },
                                imageMatchSettings: {
                                    type: 'ImageMatchSettings',
                                    schema: {
                                        ignoreDisplacements: 'Boolean',
                                        ignore: {type: 'Array', items: 'Region'},
                                        floating: {type: 'Array', items: 'FloatingRegion'},
                                        accessibility: {type: 'Array', items: 'AccessibilityRegion'},
                                        accessibilitySettings: {
                                            type: 'AccessibilitySettings',
                                            schema: {
                                                level: 'AccessibilityLevel',
                                                version: 'AccessibilityGuidelinesVersion'
                                            },
                                        },
                                        layout: {type: 'Array', items: 'Region'}
                                    },
                                },
                            }
                        },
                    },
                },
            })
        },
    }

    return {driver, eyes, assert, helpers}
}


function getVal(val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}


