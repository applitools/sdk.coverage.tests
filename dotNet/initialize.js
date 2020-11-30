'use strict'
//const {makeEmitTracker} = require('@applitools/sdk-coverage-tests')
const {checkSettingsParser} = require('./parser')
const {regionParameterParser} = require('./parser')
const {getTypes} = require('./parser')
const {parseAssertActual} = require('./parser')
const {expectParser} = require('./parser')
const {variable} = require('./parser')
const {takeSelector} = require('./parser')
const util = require('util')
//const {chooseCompareProcedure} = require('./parser')
let counter = 0

/*function dot_net222(chunks, ...values) {
	let code = ''
	values.forEach((value, index) => {
		let stringified = ''
		if (value && value.isRef) {
			stringified = value.ref()
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
}*/

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
/*function java(chunks, ...values) {
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
}*/

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
  /*const properties = Object.entries(data).reduce((data, [key, value]) => {
      return value !== undefined ? data.concat(`${key}: ${serialize(value)}`) : data
    }, [])
  let out2 = `{${properties.join(', ')}}`*/
  console.log("output = " + output)
  //output.map(myFunction)
  //output.join('.')
  console.log("output = " + output)
  //console.log("out2 = " + out2)
    return output
}

/*function myFunction(item, index) {
  console.log("item=" + item + " index=" + index)
}*/

function argumentCheck(actual, ifUndefined){
	return (typeof actual === 'undefined') ? ifUndefined : actual
}

module.exports = function(tracker, test) {
  const {addSyntax, addCommand, addHook, withScope} = tracker
	
	let mobile = ("features" in test) && (test.features[0] === 'native-selectors') ? true: false
	let emulator = ((("env" in test) && ("device" in test.env))&& !("features" in test))
	let otherBrowser = ("env" in test) && ("browser" in test.env) && (test.env.browser !== 'chrome')? true: false
	let legacy = ("env" in test) && ("legacy" in test.env) && (test.env.legacy === true)? true: false
	let headless = ("env" in test) && ("headless" in test.env) && (test.env.headless === false)? false: true
	
	
	/*addSyntax('var', ({constant, name, value}) => `${constant ? 'const' : 'let'} ${name} = ${value}`)
    addSyntax('getter', ({target, key}) => `${target}['${key}']`)
    addSyntax('call', ({target, args}) => `${target}(${dot_net`...${args}`})`)*/
	/*tracker.addSyntax('var', ({name, value, type='WebElement'}) => `${type} ${name} = (${type}) ${value}`)
    tracker.addSyntax('getter', getTypes)
    tracker.addSyntax('call', ({target, args}) => args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}()`)*/
    addSyntax('return', ({value}) => `return ${value}`)

    addHook('deps', `using NUnit.Framework;`)
	if (mobile) {
	    addHook('deps', `using Applitools.Appium.GenericUtils;`)
	}
	else {
        addHook('deps', `using OpenQA.Selenium;`)
        addHook('deps', `using Applitools.Utils.Geometry;`)
	    addHook('deps', `using Applitools.Selenium;`)
		addHook('deps', `using Applitools.Tests.Utils;`)
		addHook('deps', `using OpenQA.Selenium.Interactions;`)
        //addHook('deps', `using System.Drawing;`)
	    addHook('deps', `using OpenQA.Selenium.Remote;`)
	    addHook('deps', `using System.Collections.Generic;`)
		addHook('deps', `using System;`)
	}
	
	let namespace = mobile? 'Applitools.Appium.Tests': 'Applitools.Generated.Selenium.Tests'
	let baseClass = mobile? 'TestSetupGeneratedAppium': 'TestSetupGenerated'
	if (emulator) baseClass = 'TestSetupGeneratedMobileEmulation'

	addHook('deps', `namespace ${namespace}`)
	addHook('deps', `{`)
	addHook('deps', `[TestFixture]`)
	addHook('deps', `[Parallelizable]`)
	console.log("String 51 !!! TTTTTTTTTTTTTTTTTTTT");
	console.log(counter)
	counter = counter + 1
	console.log(JSON.stringify(test));
	//let class1 = ("baselineName" in test.config)? test.config.baselineName: 'LAZHA'
	//addHook('deps', `public class ${class1}Class : ${baseClass}`)
	addHook('deps', `public class ${test.key}Class : ${baseClass}`)
	
	addSyntax('var', ({name, value, type}) => {
		if ((type !== undefined) && (type.name === 'Map') && (type.generic[0].name === 'String') && (type.generic[1].name === 'Number')) {console.log("Map<String, Number>")
			return `Dictionary<string, object> ${name} = (Dictionary<string, object>)${value}`
		}
		console.log("var type = " + type)
	//console.log("var " + `${name}` + " has type.name = " + type.name)
	console.log(util.inspect(type, {showHidden: false, depth: null}))
		return `var ${name} = ${value}`
	})
	//addSyntax('var', variable)
    addSyntax('getter', ({target, key}) => `${target}${key.startsWith('get') ? `.${key.slice(3).toLowerCase()}` : `["${key}"]`}`)
	//tracker.addSyntax('getter', getTypes)
    addSyntax('call', ({target, args}) => args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}`)

    if (mobile && ("app" in test.env)) addHook('beforeEach', dot_net`    initDriver(${test.env.device}, ${test.env.app});`)
	//if (("options" in options) && ("capabilities" in options.options)) storeHook('beforeEach', dot_net`options.options.capabilities = ${options.options.capabilities}`)
		
	let css = ("stitchMode" in test.config) && (test.config.stitchMode.toUpperCase().localeCompare('CSS'))? true: false
	
    if ((!otherBrowser) && (!emulator)) {
		if (!mobile) addHook('beforeEach', dot_net`    SetUpDriver(browserType.Chrome, headless: ${headless});`)
		addHook('beforeEach', dot_net`    initEyes(${argumentCheck(test.vg, false)}, ${css});`)
	}
	else {
		if (!emulator){
			switch (test.env.browser){
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
				default:
					throw Error(`Couldn't intrpret browser type ${test.env.browser}. Code update is needed`)
			}	
			addHook('beforeEach', dot_net`    initEyes(false, true);`)
		}
		else {
			if (test.env.device === 'Android 8.0 Chrome Emulator') {
				addHook('beforeEach', dot_net`     SetUpDriver("Android Emulator", "8.0", "Android", ScreenOrientation.Portrait);`)
				switch (test.config.baselineName){
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
	}
	if ("branchName" in test.config) addHook('beforeEach', dot_net`    eyes.BranchName = ${test.config.branchName};`)
	if ("parentBranchName" in test.config) addHook('beforeEach', dot_net`    eyes.ParentBranchName = ${test.config.parentBranchName};`)
	if ("hideScrollbars" in test.config) addHook('beforeEach', dot_net`    eyes.HideScrollbars = ${test.config.hideScrollbars};`)
	if ("isDisabled" in test.config) addHook('beforeEach', dot_net`    eyes.IsDisabled = ${test.config.isDisabled};`)
	if (("defaultMatchSettings" in test.config) && ("accessibilitySettings" in test.config.defaultMatchSettings)){
		let level = `${test.config.defaultMatchSettings.accessibilitySettings.level}`
		let version = `${test.config.defaultMatchSettings.accessibilitySettings.guidelinesVersion}`
		addHook('beforeEach', dot_net`    AccessibilitySettings settings = new AccessibilitySettings(AccessibilityLevel.` + level +`, AccessibilityGuidelinesVersion.` + version + `);
        Applitools.Selenium.Configuration configuration = eyes.GetConfiguration();
        configuration.SetAccessibilityValidation(settings);
        eyes.SetConfiguration(configuration);`)
	}

    addHook('afterEach', dot_net`    webDriver.Quit();`)
	addHook('afterEach', dot_net`    driver.Quit();`)
    addHook('afterEach', dot_net`    eyes.AbortIfNotClosed();`)



    const driver = {
		constructor: {
		  /*isStaleElementError(error) {
			return addCommand(dot_net`isStaleElementError(${error})`)*/
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
            return addCommand(dot_net`((IJavaScriptExecutor)webDriver).ExecuteScript(${script});`)
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
			if (selector.includes('name=')) return addCommand(dot_net`webDriver.FindElement(By.Name(` + takeSelector(selector) + `));`)//${takeSelector(selector)}));`)//`driver.FindElement(By.Name(${takeSelector(element)})).Click();`)
            else return addCommand(
                dot_net`webDriver.FindElement(By.CssSelector(${selector.toString().replace(/\"/g,'')}));`,
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
			switch (typeof element) {
				case 'string':
					if (mobile) addCommand(dot_net`Utilities.FindElement(webDriver, ${element}).Click();`)
					else { 
						if (element.includes('name=')) {
							addCommand(dot_net`webDriver.FindElement(By.Name(${takeSelector(element)})).Click();`)
						}
						else addCommand(dot_net`webDriver.FindElement(By.CssSelector(${element})).Click();`)
					}
					break;
				case "object":
					if (element.type === undefined) addCommand(dot_net`${element}.Click();`)
					else {
						let selector
						switch (element.type){
							case 'css':
							  selector = 'CssSelector'
							  break;
							case 'id':
							  selector = 'Id'
							  break;
							case 'class':
							  selector = 'ClassName'
							  break;
							case 'name':
							  selector = 'Name'
							  break;
							default:
							  throw new Error(`Click - unimplemented type of selector was used`)
						}
						addCommand(dot_net`webDriver.FindElement(By.` + selector + `(\"${element.selector}\")).Click();`)
					}
					break;
			}
        },
        type(element, keys) {
            addCommand(dot_net`${element}.SendKeys(${keys});`)
        },
		scrollIntoView(element, align=false) {
		  addCommand(dot_net`Actions actions = new Actions(driver);
		actions.MoveToElement(${element}).Perform();`)
		},
		hover(element, offset) {
		  addCommand(dot_net`Actions mouseHover = new Actions(webDriver);
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
		open({appName, viewportSize}) {
			let rectangle = !viewportSize ? '' : `, new RectangleSize(width:${viewportSize.width}, height:${viewportSize.height})`
			//let class2 = ("baselineName" in test.config)? test.config.baselineName: 'LAZHA'
			//addCommand(dot_net`eyes.Open(driver, ${appName}, ${class2}` + rectangle + ');')
			let appNm = (appName) ? appName : test.config.appName
            addCommand(dot_net`webDriver = eyes.Open(driver, ${appNm}, ${test.config.baselineName}` + rectangle + ');')
        },
        check(checkSettings = {}) {
			if (mobile) return addCommand(`eyes.Check(Target.Region(Utilities.FindElement(webDriver, "${checkSettings.region}")));`)
			if (test.api !== 'classic') {
              return addCommand(`eyes.Check(${checkSettingsParser(checkSettings, mobile)});`)
			}else if (checkSettings.region) {
				if (checkSettings.frames && checkSettings.frames.length > 0) {
				  const [frameReference] = checkSettings.frames
				  let Tag = !checkSettings.name ? `""` : `${checkSettings.name}`
				  let MatchTimeout = !checkSettings.timeout ? `` : `, ${checkSettings.timeout}`
				  return addCommand(dot_net`eyes.CheckRegionInFrame(` +
					//${frameReference.toString().replace(/\"/g,'')},
					takeSelector(frameReference) +
					`, By.CssSelector("${checkSettings.region}"),` + Tag + `, ${checkSettings.isFully}` + MatchTimeout + 
				`);`)
				//` +
		//`${matchTimeout? `, matchTimeout: ${matchTimeout}`: ''}` +
				}
				let args = `By.CssSelector(\"${checkSettings.region}\")` +
                `${checkSettings.name? `, tag: ${checkSettings.name}`: ''}` +
                `${checkSettings.timeout? `, matchTimeout: ${checkSettings.timeout}`: ''}`
				//return addCommand(dot_net`eyes.CheckRegion(${args});`)
				return addCommand(dot_net`eyes.CheckRegion(By.CssSelector(${checkSettings.region})` +
                `${checkSettings.name? `, tag: ${checkSettings.name}`: ''}` +
                `${checkSettings.timeout? `, matchTimeout: ${checkSettings.timeout}`: ''});`)
			  } else if (checkSettings.frames && checkSettings.frames.length > 0) {
				//const [frameReference] = checkSettings.frames
				let frameSelector = (checkSettings.frames.isRef)? checkSettings.frames.ref() : takeSelector(checkSettings.frames)
				console.log("frameSelector = " + frameSelector)
				let args = frameSelector + //arr.reduce((acc, val) => acc + `${takeSelector(val)}`, '')//`"${frames(checkSettings.frames)}"` + //getVal(frameReference)
                `${checkSettings.name? `, tag: ${checkSettings.name}`: ''}` +
                `${checkSettings.timeout? `, timeout: ${checkSettings.timeout}`: ''}`
				return addCommand(`eyes.CheckFrame(${args});`)
			  } else {
				  let MatchTimeout = !checkSettings.timeout ? `` : `match_timeout:${checkSettings.timeout}`
				  let Tag = !checkSettings.name ? `` : `tag:"${checkSettings.name}"`
				  if (Tag !== `` && MatchTimeout !== ``) Tag = `, ` + Tag
				  let isFully = !checkSettings.isFully ? `` : `, fully:"${checkSettings.isFully}"`
				  return addCommand(dot_net`eyes.CheckWindow(` + MatchTimeout + Tag + isFully + `);`)
			  }
        },
        /*checkWindow(tag, matchTimeout, stitchContent) {
            let Tag = !tag ? `` : `tag:"${tag}"`
            let MatchTimeout = !matchTimeout ? `` : `,match_timeout:${matchTimeout}`
            addCommand(dot_net`eyes.CheckWindow(` + Tag + MatchTimeout + `);`)
        },
        checkFrame(element, matchTimeout, tag) {
            let args = `"${getVal(element)}"` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, timeout: ${matchTimeout}`: ''}`
            addCommand(`eyes.CheckFrame(${args});`)
        },
        checkElement(element, matchTimeout, tag) {
            let args = `region: 'By.CssSelector(\"${region}\")'` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, matchTimeout: ${matchTimeout}`: ''}`
            addCommand(dot_net`eyes.CheckElement(${args});`)
        },
        //is absent in DotNet SDK
        checkElementBy(selector, matchTimeout, tag) {
			let arg1 = `selector: 'By.CssSelector(${selector})'`
			let args = `selector: 'By.CssSelector(${selector})'` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, matchTimeout: ${matchTimeout}`: ''}`
            addCommand(dot_net`eyes.CheckRegion(selector: By.CssSelector(${selector}));`)
        },
        checkRegion(region, matchTimeout, tag) {
            let args = `region: 'By.CssSelector(\"${region}\")'` +
                `${tag? `, tag: ${tag}`: ''}` +
                `${matchTimeout? `, matchTimeout: ${matchTimeout}`: ''}`
            addCommand(dot_net`eyes.CheckRegion(${args});`)
        },
		//is absent in DotNet SDK
        checkRegionByElement(element, matchTimeout, tag) {
            addCommand(dot_net`eyes.checkRegionByElement(
        By.CssSelector(${element}),
        ${tag},
        ${matchTimeout},
      );`)
        },
        //is absent in DotNet SDK
        checkRegionBy(selector, tag, matchTimeout, stitchContent) {
            addCommand(dot_net`eyes.checkRegionByElement(
        ${selector},
        ${tag},
        ${matchTimeout},
        ${stitchContent},
      );`)
        },
        checkRegionInFrame(frameReference, selector, matchTimeout, tag, stitchContent) {
            addCommand(dot_net`eyes.CheckRegionInFrame(
        ${frameReference.toString().replace(/\"/g,'')},
        By.CssSelector(${selector}),
        ${tag},
        ${stitchContent}` +
		`${matchTimeout? `, matchTimeout: ${matchTimeout}`: ''}` +
      `);`)
        },*/
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
		  return addCommand(dot_net`new Region(3, 19, 158, 38);`)//addCommand(dot_net`await eyes.locate(${visualLocatorSettings})`)
		},
    }
	
	const assert = {
    strictEqual(actual, expected, message) {
      addCommand(dot_net`assert.strictEqual(${actual}, ${expected}, ${message})`)
    },
	//deepStrictEqual(actual, expected, message) {
	equal(actual, expected, message) {
		//console.log("NEW type = " + serialize(actual.schema))
		//console.log("NEW type serialize = " + serialize(actual.type))
		
		let objectToString = Object.prototype.toString;
		console.log("expected type = " + objectToString.call(expected))
		console.log("expected222 type = " + expected.toString())
		console.log("verify type = " + objectToString.call(true))
		if(expected.isRef) {console.log("expected.isRef")
			console.log("expected.type() = " + expected.type())
			//const typeCasting = actual.type().name === 'Number' ? insert(` (long) `) : emptyValue()
            //addCommand(java`Assert.assertEquals(${typeCasting}${actual}, ${expected}${extraParameter(message)});`)
		}
		let expect = expected
		if ((objectToString.call(expected) === "[object Object]") || 
			(objectToString.call(expected) === "[object String]")) expect = expectParser(expected)
		if (objectToString.call(expected) === "[object Function]") expect = expected.ref()
			
		
		//let expect = regionParameterParser(expected)
		
		
		//let act = actual ? parseAssertExpected(actual) : null
		console.log("actual type = " + objectToString.call(actual))
		//console.log("actual1 = " + actual)
		if (actual.isRef) {
			console.log("actual.isRef")
			//console.log("actual.ref = " + actual.ref())
			//console.log("actual.type().name = " + actual.type().name)
			if ((actual.type() !== undefined) && (actual.type().name === 'Map<String, Number>')) {console.log("actual.type().name = " + actual.type().name)
				act = `(Dictionary<string, object>)${actual.ref()}`
			}
		}
		let act = parseAssertActual(serializeOutput(actual))
		
		let mess = message ? message : null
		//let compareProcedure = chooseCompareProcedure(act)
		console.log("act00 = " + act)
		console.log("expect00 = " + expect)
      addCommand(dot_net`compareProcedure(` + act + `, ` + expect + `, ` + mess + `);`)
    },
	/*equal(actual, expected, message){
      if(expected.isRef) {
        const typeCasting = actual.type().name === 'Number' ? insert(` (long) `) : emptyValue()
        addCommand(java`Assert.assertEquals(${typeCasting}${actual}, ${expected}${extraParameter(message)});`)
      } else {
        const type = getTypeName(actual)
        if(type !== 'Map') {
          addCommand(java`Assert.assertEquals(${actual}, ${addType(expected, type)}${extraParameter(message)});`)
        } else {
          addCommand(java`Assert.assertEqualsDeep(${actual}, ${addType(expected, type, actual.type().generic)}${extraParameter(message)});`)
        }
      }
    },*/
	instanceOf(object, className, message) {
		let classNm = `${className}`
		let mess = message ? message : null 
		let obj = object.ref()
      addCommand(dot_net` Assert.IsInstanceOf<` + className + `>(` + obj + `, ` + mess + `);`)
    },
	throws(func, check) {
      let command
	  let funct = `${func}`.replace(/;/g, "")
	  console.log("funct = " + funct)
	  console.log("func = " + `${func}`)
	  if (check) {
	    //command = dot_net`Assert.Throws<${insert(check())}>(() => {${func}});`
		command = dot_net`Assert.That(() => {${func}}, Throws.InstanceOf<${insert(check())}>());`
		//`Assert.That(${func}, Throws.Exception.TypeOf<${insert(check())}>);`
	  }
	  else {
		  //command = dot_net`Assert.Throws<Exception>(() => {${func}});`
		  command = dot_net`Assert.That(() => {${func}}, Throws.Exception);`
		  //`Assert.That(() => {${func}}, Throws.Exception.TypeOf<Exception>);`
	  }
      addCommand(command)
    },
	/*throws(func, check){
      let command
      if(check){
        command = dot_net`Assert.assertThrows(${check()} , new Assert.ThrowingRunnable(){
          public void run() {${func}}
        });`
      } else {
        command = dot_net`Assert.assertThrows(new Assert.ThrowingRunnable(){ 
        public void run() {${func}}
        });`
      }
      addCommand(command)
    },*/
  }

    const helpers = {
    /*getTestInfo(result) {
      return addCommand(dot_net`TestUtils.GetSessionResults(eyes.ApiKey, ${result});`).type('TestInfo')*/
	  getTestInfo(result) {
      const appOutputSchema = {
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
              schema: {level: 'String', version: 'String'},
            },
          },
        },
      }
      return addCommand(dot_net`TestUtils.GetSessionResults(eyes.ApiKey, ${result});`).type({
        type: 'TestInfo',
        schema: {
          actualAppOutput: {
            type: 'Array',
            items: {type: 'AppOutput', schema: appOutputSchema},
          },
        },
		type: 'String',
        schema: {
          actualAppOutput: {
            type: 'String',
            items: {type: 'AppOutput', schema: appOutputSchema},
          },
        },
      })
    },
  }

  return {driver, eyes, assert, helpers}
}

function getVal (val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}

function insert(value) {
    return {
      isRef: true,
      ref: () => value
    }
  }

//module.exports = makeSpecEmitter