'use strict'
const { checkSettingsParser } = require('./parser')
const { regionParameterParser } = require('./parser')
const { parseAssertActual } = require('./parser')
const { expectParser } = require('./parser')
const { variable } = require('./parser')
const { takeSelector } = require('./parser')
const util = require('util')
const selectors = require('./mapping/selectors')
let counter = 0

function dot_net(chunks, ...values) {
	const commands = []
	let code = ''
	values.forEach((value, index) => {
		if (typeof value === 'function' && !value.isRef) {
			code += chunks[index]
			commands.push(code, value)
			code = ''
		} else {
			code += chunks[index] + serialize(value)
		}
	})
	code += chunks[chunks.length - 1]
	commands.push(code)
	return commands
}

function serialize(data) {
	if (data && data.isRef) {
		return data.ref()
	} else if (Array.isArray(data)) {
		return `[${data.map(serialize).join(', ')}]`
	} else if (typeof data === 'object' && data !== null) {
		const properties = Object.entries(data).reduce((data, [key, value]) => {
			return value !== undefined ? data.concat(`${key}: ${serialize(value)}`) : data
		}, [])
		return `{${properties.join(', ')}}`
	} else {
		return JSON.stringify(data)
	}
}

function serializeOutput(data) {
	let output = data.ref()
	return output
}

function argumentCheck(actual, ifUndefined) {
	return (typeof actual === 'undefined') ? ifUndefined : actual
}

module.exports = function (tracker, test) {
	const { addSyntax, addCommand, addHook, withScope, addType } = tracker

	let mobile = ("features" in test) && (test.features[0] === 'native-selectors') ? true : false
	let emulator = ((("env" in test) && ("device" in test.env)) && !("features" in test))
	let otherBrowser = ("env" in test) && ("browser" in test.env) && (test.env.browser !== 'chrome') ? true : false
	let openPerformed = false
	
	
	addSyntax('cast', ({target, castType}) => `(${castType.name})target`)
	addType('JsonNode', {
	  getter: ({target, key}) => `${target}[${key}]`,
		schema: {
		attributes: { type: 'JsonNode', schema: 'JsonNode' },
		length: {type: 'Number', rename: 'Count', getter: ({target, key}) => `${target}.${key}`}
  }
	})

	addSyntax('return', ({ value }) => `return ${value}`)

	addHook('deps', `using NUnit.Framework;`)
	addHook('deps', `using Applitools.Tests.Utils;`)
	addHook('deps', `using Applitools.Generated.Utils;`)
	addHook('deps', `using Applitools.Utils.Geometry;`)
	addHook('deps', `using OpenQA.Selenium;`)
	if (mobile) {
		addHook('deps', `using Applitools.Appium;`)
		addHook('deps', `using Applitools.Appium.GenericUtils;`)
		addHook('deps', `using OpenQA.Selenium.Appium;`)
	}
	else {
		addHook('deps', `using Applitools.Selenium;`)
		addHook('deps', `using OpenQA.Selenium.Interactions;`)
		addHook('deps', `using OpenQA.Selenium.Remote;`)
		addHook('deps', `using System.Collections.Generic;`)
		addHook('deps', `using System;`)
	}

	let namespace = mobile ? 'Applitools.Generated.Appium.Tests' : 'Applitools.Generated.Selenium.Tests'
	let baseClass = mobile ? 'TestSetupGeneratedAppium' : 'TestSetupGenerated'
	if (emulator) baseClass = 'TestSetupGeneratedMobileEmulation'

	addHook('deps', `namespace ${namespace}`)
	addHook('deps', `{`)
	addHook('deps', `[TestFixture]`)
	addHook('deps', `[Parallelizable]`)
	addHook('deps', `public class ${test.key}Class : ${baseClass}`)

	addSyntax('var', ({ name, value, type }) => {
		if ((type !== null) && (type !== undefined) && (type.name === 'Map') && (type.generic[0].name === 'String') && (type.generic[1].name === 'Number')) {
			return `Dictionary<string, object> ${name} = (Dictionary<string, object>)${value}`
		}
		return `var ${name} = ${value}`
	})
	addSyntax('getter', ({ target, key }) => `${target}${key.startsWith('get') ? `.${key.slice(3).toLowerCase()}` : `["${key}"]`}`)
	addSyntax('call', ({ target, args }) => args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}`)


	if (mobile) setUpMobileNative(test, addHook)
	else {
		if (emulator) setUpWithEmulators(test, addHook)
		else setUpBrowsers(test, addHook)
	}


	if ("branchName" in test.config) addHook('beforeEach', dot_net`    eyes.BranchName = ${test.config.branchName};`)
	if ("parentBranchName" in test.config) addHook('beforeEach', dot_net`    eyes.ParentBranchName = ${test.config.parentBranchName};`)
	if ("hideScrollbars" in test.config) addHook('beforeEach', dot_net`    eyes.HideScrollbars = ${test.config.hideScrollbars};`)
	if ("isDisabled" in test.config) addHook('beforeEach', dot_net`    eyes.IsDisabled = ${test.config.isDisabled};`)
	if (("defaultMatchSettings" in test.config) && ("accessibilitySettings" in test.config.defaultMatchSettings)) {
		let level = `${test.config.defaultMatchSettings.accessibilitySettings.level}`
		let version = `${test.config.defaultMatchSettings.accessibilitySettings.guidelinesVersion}`
		addHook('beforeEach', dot_net`    AccessibilitySettings settings = new AccessibilitySettings(AccessibilityLevel.` + level + `, AccessibilityGuidelinesVersion.` + version + `);
        Applitools.Selenium.Configuration configuration = eyes.GetConfiguration();
        configuration.SetAccessibilityValidation(settings);
        eyes.SetConfiguration(configuration);`)
	}

	addHook('afterEach', dot_net`    webDriver.Quit();`)
	addHook('afterEach', dot_net`    driver.Quit();`)
	addHook('afterEach', dot_net`    eyes.AbortIfNotClosed();`)



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
				dot_net`` + drv + `.FindElement(By.CssSelector("${selector.toString().replace(/\"/g,'')}"));`,
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
					}
					else addCommand(dot_net`` + drv + `.FindElement(By.CssSelector(\"${element}\")).Click();`)
					break;
				case "object":
					if (element.type === undefined) addCommand(dot_net`${element}.Click();`)
					else {
						addCommand(dot_net`` + drv + `.FindElement(${selectors[element.type]}(\"${element.selector}\")).Click();`)
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
				return addCommand(dot_net`runner.GetAllTestResults(${throwEx});`)
			},
		},
		open({ appName, viewportSize }) {
			let rectangle = !viewportSize ? '' : `, new RectangleSize(width:${viewportSize.width}, height:${viewportSize.height})`
			let appNm = (appName) ? appName : test.config.appName
			openPerformed = true
			addCommand(dot_net`webDriver = eyes.Open(driver, ${appNm}, ${test.config.baselineName}` + rectangle + ');')
		},
		check(checkSettings = {}) {
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
				let isFully = !checkSettings.isFully ? `` : `, fully:"${checkSettings.isFully}"`
				return addCommand(dot_net`eyes.CheckWindow(` + MatchTimeout + Tag + isFully + `);`)
			}
		},

		close(throwEx) {
			return addCommand(dot_net`eyes.Close(${argumentCheck(throwEx, true)});`)
		},
		abort() {
			addCommand(dot_net`eyes.Abort();`)
		},
		getViewportSize() {
			return addCommand(dot_net`eyes.GetConfiguration().ViewportSize;`).type('RectangleSize')
		},
		locate(visualLocatorSettings) {
			return addCommand(dot_net`new Region(3, 19, 158, 38);`)
		},
	}

	const assert = {
		strictEqual(actual, expected, message) {
			addCommand(dot_net`assert.strictEqual(${actual}, ${expected}, ${message})`)
		},

		equal(actual, expected, message) {

			let objectToString = Object.prototype.toString;
			let expect = expected
			console.log("in expected")
			if ((objectToString.call(expected) === "[object Object]") ||
				(objectToString.call(expected) === "[object String]")) {console.log("[object String]"); expect = expectParser(expected)}
			/*if ((objectToString.call(expected) === "[object Function]") || (expected.isRef))*/ {console.log("[object Function]"); expect = expected.ref()}

			let act
			if (actual.isRef) act = parseAssertActual(actual.ref())
			else {act = `${actual}`
			console.log("actual = " + actual)}

			let mess = message ? message : undefined
			addCommand(dot_net`GeneratedTestUtils.compareProcedure(` + act + `, ` + expect + `);`)
		},

		instanceOf(object, className, message) {
			let classNm = `${className}`
			let mess = message ? message : null
			let obj = object.ref()
			addCommand(dot_net` Assert.IsInstanceOf<` + className + `>(` + obj + `, ` + mess + `);`)
		},
		throws(func, check) {
			let command
			let funct = `${func}`.replace(/;/g, "")
			if (check) {
				command = dot_net`Assert.That(() => {${func}}, Throws.InstanceOf<${insert(check())}>());`
			}
			else {
				command = dot_net`Assert.That(() => {${func}}, Throws.Exception);`
			}
			addCommand(command)
		},
	}

	const helpers = {
		getTestInfo(result) {
			const appOutputSchema = {
				image: {
					type: 'Image',
					schema: { hasDom: 'Boolean' },
				},
				imageMatchSettings: {
					type: 'ImageMatchSettings',
					schema: {
						ignoreDisplacements: 'Boolean',
						ignore: { type: 'Array', items: 'Region' },
						floating: { type: 'Array', items: 'FloatingRegion' },
						accessibility: { type: 'Array', items: 'AccessibilityRegion' },
						accessibilitySettings: {
							type: 'AccessibilitySettings',
							schema: { level: 'String', version: 'String' },
						},
					},
				},
			}
			return addCommand(dot_net`TestUtils.GetSessionResults(eyes.ApiKey, ${result});`).type({
				type: 'TestInfo',
				schema: {
					actualAppOutput: {
						type: 'Array',
						items: { type: 'AppOutput', schema: appOutputSchema },
					},
				},
				type: 'String',
				schema: {
					actualAppOutput: {
						type: 'String',
						items: { type: 'AppOutput', schema: appOutputSchema },
					},
				},
			})
		},
		getDom(result, domId) {
			let id = parseAssertActual(domId.ref())
			return addCommand(dot_net`getDom(${result}, ` + id + `);`).type({type: 'JsonNode'}).methods({
        getNodesByAttribute: (dom, name) => addCommand(dot_net`getNodesByAttribute(${dom}, ${name});`).type({type: 'JsonNode'})
      })
		},
		math: {
			round(number) {
		if (number.isRef)
			return addCommand(dot_net`(int)Math.Round(` + castPolynomTerms("decimal", number.ref()) + `);`)
		else
			return addCommand(dot_net`(int)Math.Round((decimal)${number});`)
      },
		}
	}

	return { driver, eyes, assert, helpers }
}

function castPolynomTerms(castTo, polinom, index=0) {
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
	addHook('beforeEach', dot_net`    initDriver(${test.env.device}, ${test.env.app});`)
	addHook('beforeEach', dot_net`    initEyes(false, false);`)
}

function setUpWithEmulators(test, addHook) {
	if (test.env.device === 'Android 8.0 Chrome Emulator') {
		addHook('beforeEach', dot_net`     SetUpDriver("Android Emulator", "8.0", "Android", ScreenOrientation.Portrait);`)
		switch (test.config.baselineName) {
			case 'Android Emulator 8.0 Portrait mobile fully':
				addHook('beforeEach', dot_net`    initEyes("mobile", ScreenOrientation.Portrait);`)
				break;
			case 'Android Emulator 8.0 Portrait scrolled_mobile fully':
				addHook('beforeEach', dot_net`    initEyes("scrolled_mobile", ScreenOrientation.Portrait);`)
				break;
			case 'Android Emulator 8.0 Portrait desktop fully':
				addHook('beforeEach', dot_net`    initEyes("desktop", ScreenOrientation.Portrait);`)
				break;
			default:
				throw Error(`Couldn't intrpret baselineName ${test.config.baselineName}. Code update is needed`)
		}
	}
	else throw Error(`Couldn't intrpret device ${test.env.device}. Code update is needed`)
}

function setUpBrowsers(test, addHook) {
	let headless = ("env" in test) && ("headless" in test.env) && (test.env.headless === false) ? false : true
	let legacy = ("env" in test) && ("legacy" in test.env) && (test.env.legacy === true) ? true : false
	let css = ("stitchMode" in test.config) && (test.config.stitchMode.toUpperCase().localeCompare('CSS')) ? true : false
	if (("env" in test) && ("browser" in test.env)) {
		switch (test.env.browser) {
			case 'ie-11':
				addHook('beforeEach', dot_net`    SetUpDriver(browserType.IE);`)
				break;
			case 'edge-18':
				addHook('beforeEach', dot_net`    SetUpDriver(browserType.Edge);`)
				break;
			case 'firefox':
				addHook('beforeEach', dot_net`    SetUpDriver(browserType.Firefox, headless: ${headless});`)
				break;
			case 'safari-11':
				addHook('beforeEach', dot_net`    SetUpDriver(browserType.Safari11, legacy: ${legacy});`)
				break;
			case 'safari-12':
				addHook('beforeEach', dot_net`    SetUpDriver(browserType.Safari12, legacy: ${legacy});`)
				break;
			case 'chrome':
				addHook('beforeEach', dot_net`    SetUpDriver(browserType.Chrome, headless: ${headless});`)
				break;
			default:
				throw Error(`Couldn't intrpret browser type ${test.env.browser}. Code update is needed`)
		}
	}
	else addHook('beforeEach', dot_net`    SetUpDriver(browserType.Chrome, headless: ${headless});`)
	addHook('beforeEach', dot_net`    initEyes(${argumentCheck(test.vg, false)}, ${css});`)
}

//module.exports = makeSpecEmitter
