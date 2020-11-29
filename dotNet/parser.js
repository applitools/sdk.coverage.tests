'use strict'

const types = require('./mapping/types')
const selectors = require('./mapping/selectors')

/*const TYPES = {
    "Map<String, Number>": (target, key) => `${target}.get("${key}").intValue()`,
    "RectangleSize": (target, key) => `${target}.${key}`
}*/

function checkSettings(cs, mobile=false) {
    let target = `Target`
    if(cs === undefined){
        return target + '.Window()'
    }
    let element = ''
    let options = ''
    if (cs.frames === undefined && cs.region === undefined) element = '.Window()'
    else {
        if (cs.frames) element += frames(cs.frames)
        if (cs.region) {
			if (cs.region.type) {console.log("cs.region.type = " + cs.region.type)
				element += region(cs.region, cs.region.type, mobile)
			}
			else element += region(cs.region, undefined, mobile)
		}
    }
    if(cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions, mobile)
	if (cs.floatingRegions) options += floatingRegions(cs.floatingRegions)
    if(cs.scrollRootElement) options+=scrollRootElement(cs.scrollRootElement)
	if(cs.accessibilityRegions) options+=accessibilityRegions(cs.accessibilityRegions[0].region, cs.accessibilityRegions[0].type)
	if(cs.layoutRegions) options+=layoutRegions(cs.layoutRegions)
	if (cs.ignoreDisplacements !== undefined) options += `.IgnoreDisplacements(${cs.ignoreDisplacements})`
	if (cs.sendDom !== undefined) options += `.SendDom(${cs.sendDom})`
    if (cs.matchLevel) options += `.MatchLevel(MatchLevel.${cs.matchLevel})`
    if(cs.isFully) options += '.Fully()'
	if (cs.name) options += `.WithName(${cs.name})`
    return target + element + options
}

function frames(arr) {
	//return arr.reduce((acc, val) => acc + `.Frame(\"${getVal(val)}\")`, '')
	//return arr.reduce((acc, val) => acc + `.Frame(\"${val}\")`, '')
	return arr.reduce((acc, val) => acc + `${frame(val)}`, '')
}

/*function printSelector(val) {
    return serialize(wrapSelector(val))
}*/

function frame(frames) {
	console.log("in frames...")
	//console.log("frame = " + frames)
	console.log("stringify frame = " + JSON.stringify(frames))
	if (frames && frames.isRef) return `.Frame(` + frames.ref() + `)`
    switch (typeof frames){
	case 'object':
		let stringified = JSON.stringify(frames)
		console.log("stringified = " + stringified)
		console.log("frames.frame = " + frames.frame)
		console.log("frames.type = " + frames.type)
		console.log("frames.scrollRootElement = " + frames.scrollRootElement)
		if (frames.frame) return `.Frame(${takeSelector(frames.frame)}).ScrollRootElement(By.CssSelector(${takeSelector(frames.scrollRootElement)}))`
		if (frames.type) return `.Frame(${selectors[frames.type]}(${takeSelector(frames.selector)}))`
		throw Error(`Couldn't treat frame ${frames} for type 'object'`)
		break;
	case 'string':
		return `.Frame(${takeSelector(frames)})`//`.Frame(By.CssSelector(${takeSelector(frames)}))`
		break;
	default:
		throw Error(`Couldn't treat frame ${frames} - code for type ${(typeof frames)} is not ready yet`)
		//return  frame.frame ? `.Frame(${takeSelector(frame.frame)}).ScrollRootElement(${takeSelector(frame.scrollRootElement)})` : `.Frame(${takeSelector(frame)})`
	}
}

function takeSelector(selector) {
	console.log("selector = " + selector)
	selector = selector.toString()
    selector = selector.replace(/"/g, "")
	selector = selector.replace(/'/g, "")
	selector = selector.replace(/\[/g, "")
	selector = selector.replace(/\]/g, "")
	selector = selector.replace('name=', "")
	selector = '"' + selector + '"'
	return selector
}

/*function takeSelector(selector) {
    if(typeof selector === 'string' && !checkCss(selector)) {
        return JSON.stringify(selector)
    } else {
        return printSelector(selector);
    }
    function checkCss(string) {
        return (string.includes('[') && string.includes(']')) || string.includes('#')
    }
}

function wrapSelector(val) {
    return val.selector ? val : {type: 'css', selector: val}
}

function serialize(value) {
    let stringified = ''
    if (value && value.isRef) {
        stringified = value.ref()
    } else if (typeof value === 'object') {
        stringified = parseObject(value)
    } else if (typeof value === 'function') {
        stringified = value.toString()
    } else if (typeof value === 'undefined') {
        throw Error(`Undefined shouldn't be passed to the java code. \n ${value}`)
    } else {
        stringified = JSON.stringify(value)
    }
    return stringified
}

function parseObject(object) {
    if (object.selector) {
        return selectors[object.type](JSON.stringify(object.selector))
    } else if (object.type) {
        const typeBuilder = types[object.type]
        if (typeBuilder) {
            if(typeBuilder.isGeneric) {
                return typeBuilder.constructor(object.value, object.generic)
            } else {
                return typeBuilder.constructor(object.value)
            }
        } else throw new Error(`Constructor wasn't implemented for the type: ${object.type}`)
    } else return JSON.stringify(object)
}*/

function region(region) {
    return `.Region(${regionParameter(region)})`
}

function ignoreRegions(arr, mobile=false) {
    return arr.reduce((acc, val) => acc + ignore(val, mobile), '')
}

function ignore(region, type=undefined, mobile=false){
    return `.Ignore(${regionParameter(region, type, mobile)})`
}

function floatingRegions(arr) {
	return `.Floating(${regionParameter(arr[0].region)}, ${arr[0].maxUpOffset}, ${arr[0].maxDownOffset}, ${arr[0].maxLeftOffset}, ${arr[0].maxRightOffset})`
}

function layoutRegions(arr) {
	return `.Layout(${regionParameter(arr[0])})`
}

function scrollRootElement(cssSelector) {	
    return `.ScrollRootElement(By.CssSelector(\"${cssSelector}\"))`	
}

function accessibilityRegions(region, type) {	
    return `.Accessibility(${regionParameter(region)}, AccessibilityRegionType.${type})`	
}

/*function regionParameter (region) {
    let string
	console.log("in regionParameter")
	console.log("type = " + type)
	console.log("typeof = " + (typeof region))
    switch (typeof region) {
        case 'string':
		console.log("in string")
            string = mobile? `Utilities.FindElement(driver, \"${region}\")` : findElementBySelectorType(region, type)//`By.CssSelector(\"${region}\")`
            break;
        case "object":
		    console.log("in object")
			if (type === 'css') string = findElementBySelectorType(region, type)//`By.CssSelector(\"${region}\")`
			else string = `new Rectangle(${region.left}, ${region.top}, ${region.width}, ${region.height})`
			break
		case 'function':
			console.log("in function")
			string = serializeRegion(region)
			console.log("type-function string = " + string)
			break
		default:
			throw new Error(`Region parameter of the unimplemented type was used`)
    }
    return string
}*/
function regionParameter (region) {
    let string
	console.log("in regionParameter")
	//console.log("type = " + type)
	console.log("typeof = " + (typeof region))
    switch (typeof region) {
        case 'string':
		console.log("in string")
            string = `By.CssSelector(\"${region}\")`
            break;
        case "object":
		    console.log("in object")
			if (region.type) string = findElementBySelectorType(region.selector, region.type)//`By.CssSelector(\"${region}\")`
			else string = `new System.Drawing.Rectangle(${region.left}, ${region.top}, ${region.width}, ${region.height})`
			break
		case 'function':
			console.log("in function")
			string = serializeRegion(region)
			console.log("type-function string = " + string)
			break
		default:
			throw new Error(`Region parameter of the unimplemented type was used`)
    }
    return string
}

function getVal (val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}

function serializeRegion(data) {
  if (data && data.isRef) {
    return data.ref()
  } else if (Array.isArray(data)) {
    return `[${data.map(serializeRegion).join(', ')}]`
  } else if (typeof data === 'object' && data !== null) {
	return `new System.Drawing.Rectangle(${data.left}, ${data.top}, ${data.width}, ${data.height})`
  } else {
    return JSON.stringify(data)
  }
}

function getTypes({target, key, type}){
    console.log("in getTypes")
	console.log("target = " + target)
	console.log("key = " + key)
	console.log("type = " + type)
	if (typeof type === 'undefined') {console.log("in getTypes undefined")
	return `${target}.${key}`}
    else if(TYPES[type]) return TYPES[type](target, key)
    else throw new Error(`Haven't implement type ${type}`)
}

function findElementBySelectorType(selector, type){
	switch (type) {
		case 'css':
            return `By.CssSelector(\"${selector}\")`
			break;
		default:
			return `By.CssSelector(\"${selector}\")`
	}
}

/*function parseAssertActual(actual){
	if (actual.indexOf('info') == 0) return parseInfo(actual)
	return actual
}*/

function parseAssertActual(actual){//parseInfo(actual){
	let elements = actual.includes('[')? actual.split('[') : actual.split('.');
	let result = ""
	//console.log("actual = " + actual)
	elements.forEach(element => {
		if (result === "") {result = result + element; return;}
		//console.log("element = " + element)
		element = element.replace(/"/g, "")
		element = element.replace(/]/g, "")
		if (isNaN(Number(element))) element = "." + element.charAt(0).toUpperCase() + element.slice(1)
		else element = "[" + element + "]"
		if (element === ".Version") element = ".GuidelinesVersion"
		result = result + element
	})
	return result
}

function expectParser(expected){
	console.log("in expectParser")
	if (expected.hasOwnProperty('left')){
		if (expected.hasOwnProperty('maxUpOffset')) return `new FloatingMatchSettings(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height}, ${expected.maxUpOffset}, ${expected.maxDownOffset}, ${expected.maxLeftOffset}, ${expected.maxRightOffset})`
		else {
			if (expected.hasOwnProperty('isDisabled')) return `new AccessibilityRegionByRectangle(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height}, AccessibilityRegionType.${expected.type})`
			else return `new Region(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height})`//return `new Rectangle(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height})`
		}
	}
	else{ 
		switch (expected){
			case 'AA':
			case 'AAA':
				return `AccessibilityLevel.` + expected
			case 'WCAG_2_0':
			case 'WCAG_2_1':
				return `AccessibilityGuidelinesVersion.` + expected
		}
		//throw new Error(`Haven't implement parser for expected ${expected}`)
		if (expected.hasOwnProperty('width')) return `new RectangleSize(${expected.width}, ${expected.height})`
		if (expected.hasOwnProperty('applitools_title')) return `new Region(${expected.applitools_title[0].left}, ${expected.applitools_title[0].top}, ${expected.applitools_title[0].width}, ${expected.applitools_title[0].height})`
		console.log("expected111 = " + expected)
		return expected
	}
}

function variable(name, value, type){console.log("variable type = " + type)
	return `${mapTypes(type)} ${name} = (${mapTypes(type)}) ${value}`
}

function mapTypes(type) {
    let mapped
    try {
        mapped = type ? types[type.name].name(type) : types.Element.name()
    } catch (e) {
        throw Error(`SDK haven't implemented support for the ${JSON.stringify(type)} \nWith error: ${e.message} \nStack:${e.stack}`)
    }
    return mapped
}

/*function chooseCompareProcedure(actual){
	let elements = actual.split('.')
	elements.forEach(element => console.log("element="+element))
	switch (elements[elements.length-1]){
		case 'Ignore', 'Layout', 'Content', 'Strict':
			return `TestUtils.CompareSimpleRegionsList_`
			break;
		case 'Floating':
			return `CompareFloatingRegionsList_`
			break;
	}
}*/

module.exports = {
    checkSettingsParser: checkSettings,
	regionParameterParser: regionParameter,
	getTypes: getTypes,
	parseAssertActual: parseAssertActual,
	expectParser: expectParser,
	takeSelector: takeSelector,
	//chooseCompareProcedure: chooseCompareProcedure
}