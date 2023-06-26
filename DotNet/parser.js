'use strict'

const types = require('./mapping/types')
const selectors = require('./mapping/selectors')
const {isEmpty} = require("../util");

function checkSettings(cs, mobile = false) {
	let target = `Target`
	if (cs === undefined) {
		return target + '.Window()'
	}
	let element = ''
	let options = ''
	let scrollImplemented = false
	if (cs.frames === undefined && cs.region === undefined) element = '.Window()'
	else {
		if (cs.frames) {
			if (cs.scrollRootElement) {
				element += `.Window()` + scrollRootElement(cs.scrollRootElement)
				scrollImplemented = true
			}
			element += frames(cs.frames)
		}
		if (cs.region) {
			if (cs.region.type) element += region(cs.region, cs.region.type, mobile)
			else element += region(cs.region, undefined, mobile)
		}
	}
	// if (cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions, mobile)
	// if (cs.layoutRegions) options += layoutRegions(cs.layoutRegions)

	if (cs.ignoreRegions) options += typeRegions('Ignore', cs.ignoreRegions, mobile);
	if (cs.layoutRegions) options += typeRegions('Layout', cs.layoutRegions, mobile);
	if (cs.contentRegions) options += typeRegions('Content', cs.contentRegions, mobile);
	if (cs.strictRegions) options += typeRegions('Strict', cs.strictRegions, mobile);

	if (cs.floatingRegions) options += floatingRegions(cs.floatingRegions)
	if ((cs.scrollRootElement) && (!scrollImplemented)) options += scrollRootElement(cs.scrollRootElement)
	if (cs.accessibilityRegions) options += accessibilityRegions(cs.accessibilityRegions[0].region, cs.accessibilityRegions[0].type)
	if (cs.ignoreDisplacements !== undefined) options += `.IgnoreDisplacements(${cs.ignoreDisplacements})`
	if (cs.sendDom !== undefined) options += `.SendDom(${cs.sendDom})`
	if (cs.matchLevel) options += `.MatchLevel(MatchLevel.${cs.matchLevel})`
	if (cs.hooks) options += handleHooks(cs.hooks)
	if ((cs.isFully === true) || (cs.fully === true)) { options += '.Fully()' } else if ((cs.isFully === false) || (cs.fully === false)) { options += '.Fully(false)' }
	if (cs.name) options += `.WithName("${cs.name}")`
    if (cs.layoutBreakpoints) options += layoutBreakpoints(cs.layoutBreakpoints);
	if (cs.variationGroupId) {options += `.VariationGroupId("${cs.variationGroupId}")`}
	if (cs.lazyLoad) options += lazyLoad(cs.lazyLoad);
	return target + element + options
}

function layoutBreakpoints(layoutBreakpoints) {
	let option = `.LayoutBreakpoints(new LayoutBreakpointsOptions()`
	if (typeof layoutBreakpoints == 'object' && !Array.isArray(layoutBreakpoints)) {
		if (typeof layoutBreakpoints.breakpoints == 'boolean') option += `.Breakpoints(${layoutBreakpoints.breakpoints})`;
		if (typeof layoutBreakpoints.breakpoints == 'object') option += `.Breakpoints(${layoutBreakpoints.breakpoints.join(', ')})`
	} else {
		option += `.Breakpoints(${layoutBreakpoints})`
	}
	if (layoutBreakpoints.reload) {
		option += `.Reload(${layoutBreakpoints.reload})`
	}
	option += `)`
	
	return option;
}

function lazyLoadOptions(lazyLoad) {
	let string;
	let llOptions;
	const LLOptionsKeys = Object.keys(lazyLoad);
	llOptions = LLOptionsKeys.map(key => `${key}:${lazyLoad[key]}`).join(', ');
	string = `new LazyLoadOptions(${llOptions})`;
	return `.LazyLoad(${string})`
}
function lazyLoad(lazyLoad) {
	if (isEmpty(lazyLoad))
		return `.LazyLoad()`
	else
		return lazyLoadOptions(lazyLoad)
}

function frames(arr) {
	return arr.reduce((acc, val) => acc + `${frame(val)}`, '')
}

function frame(frames) {
	if (frames && frames.isRef) return `.Frame(` + frames.ref() + `)`
	switch (typeof frames) {
		case 'object':
			let stringified = JSON.stringify(frames)
			if (frames.frame) return `.Frame(${takeSelector(frames.frame)}).ScrollRootElement(By.CssSelector(${takeSelector(frames.scrollRootElement)}))`
			if (frames.type) return `.Frame(${selectors[frames.type]}(${takeSelector(frames.selector)}))`
			throw Error(`Couldn't treat frame ${frames} for type 'object'`)
			break;
		case 'string':
			return `.Frame(${takeSelector(frames)})`
			break;
		default:
			throw Error(`Couldn't treat frame ${frames} - code for type ${(typeof frames)} is not ready yet`)
	}
}

function takeSelector(selector) {
	selector = selector.toString()
	selector = selector.replace(/"/g, "")
	selector = selector.replace(/'/g, "")
	selector = selector.replace(/\[/g, "")
	selector = selector.replace(/\]/g, "")
	selector = selector.replace('name=', "")
	selector = '"' + selector + '"'
	return selector
}

function region(region) {
	return `.Region(${regionParameter(region)})`
}

// function ignoreRegions(arr, mobile = false) {
// 	return arr.reduce((acc, val) => acc + ignore(val, mobile), '')
// }
//
// function ignore(region, type = undefined, mobile = false) {
// 	return `.Ignore(${regionParameter(region, type, mobile)})`
// }
//
// function layoutRegions(arr) {
// 	return `.Layout(${regionParameter(arr[0])})`
// }

function typeRegions(type, arr) {
	return arr.reduce((acc, val) => acc + `.${type}(${regionParameter(val)})`, '')
}

function floatingRegions(arr) {
	return `.Floating(${regionParameter(arr[0].region)}, ${arr[0].maxUpOffset}, ${arr[0].maxDownOffset}, ${arr[0].maxLeftOffset}, ${arr[0].maxRightOffset})`
}

function scrollRootElement(cssSelector) {
	if (cssSelector && cssSelector.isRef) return `.ScrollRootElement(${cssSelector.ref()})`
	return `.ScrollRootElement(By.CssSelector(\"${cssSelector}\"))`
}

function accessibilityRegions(region, type) {
	return `.Accessibility(${regionParameter(region)}, AccessibilityRegionType.${type})`
}

function regionParameter(region) {
	let string
	switch (typeof region) {
		case 'string':
			if (region.includes('name=')) string = `By.Name(${takeSelector(region)})`
			else string = `By.CssSelector(${takeSelector(region)})`
			break;
		case "object":
			if (region.region) {
				string = regionParameter(region.region)
				if (region.padding) {
					string += `, padding:${types.PaddingBounds.constructor(region.padding)}`;
				}
				if (region.regionId) {
					string += `, regionId: ${region.regionId}`;
				}
			} else {
				if (region.type) string = findElementBySelectorType(region.selector, region.type)
				else string = `new System.Drawing.Rectangle(${region.left}, ${region.top}, ${region.width}, ${region.height})`
			}
			break
		case 'function':
			string = serializeRegion(region)
			break
		default:
			throw new Error(`Region parameter of the unimplemented type was used`)
	}
	return string
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

function findElementBySelectorType(selector, type) {
	let fix_selector = selector
	if (fix_selector.includes('"')) fix_selector = fix_selector.replace(/"/g, '\\"')
	return selectors[type] + `(\"` + fix_selector + `\")`
}

function parseAssertActual(actual) {
	let elements = actual.includes('[') ? actual.split('[') : actual.split('.');
	let result = ""
	if ((elements[0] === "dom") || ((elements.length > 2) && ((elements[0] === "scrollingElements") || (elements[0] === "activeFrames")))) {
		elements.forEach(element => {
			if (result === "") { result = element; return; }
			element = element.replace(/"/g, "")
			element = element.replace(/]/g, "")
			if (!isNaN(Number(element))) element = "[" + element + "]"
			else element = "[\"" + element + "\"]"
			result = result + element
		})
		return result
	}
	if ((elements[2] !== undefined) && (elements[2].includes("batchInfo"))) {
		if (elements[4].includes("length")) elements[4] = "Count()"
		if (elements[4].includes('0')) elements[4] = "First()"
	}
	elements.forEach(element => {
		if (result === "") { result = result + element; return; }
		element = element.replace(/"/g, "")
		element = element.replace(/]/g, "")
		if (isNaN(Number(element))) element = "." + element.charAt(0).toUpperCase() + element.slice(1)
		else element = "[" + element + "]"
		if (element === ".Version") element = ".GuidelinesVersion"
		result = result + element
	})
	return result
}

function expectParser(expected) {
	// TODO assert expected calculation to same manner it is done in java
	if (expected.hasOwnProperty('left')) {
		if (expected.hasOwnProperty('maxUpOffset')) return `new FloatingMatchSettings(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height}, ${expected.maxUpOffset}, ${expected.maxDownOffset}, ${expected.maxLeftOffset}, ${expected.maxRightOffset})`
		else {
			if (expected.hasOwnProperty('isDisabled')) return `new AccessibilityRegionByRectangle(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height}, AccessibilityRegionType.${expected.type})`
			else if (expected.regionId) {
				return `new Region(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height}, regionId: ${JSON.stringify(expected.regionId)})`
			}  else return `new Region(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height})`

				//return `new Rectangle(${expected.left}, ${expected.top}, ${expected.width}, ${expected.height})`
		}
	}
	else {
		switch (expected) {
			case 'AA':
			case 'AAA':
				return `AccessibilityLevel.` + expected
			case 'WCAG_2_0':
			case 'WCAG_2_1':
				return `AccessibilityGuidelinesVersion.` + expected
		}
		if (expected.hasOwnProperty('width')) return `new RectangleSize(${expected.width}, ${expected.height})`
		if (expected.hasOwnProperty('applitools_title')) {
			if (expected.regionId) {
				return `new Region(${expected.applitools_title[0].left}, ${expected.applitools_title[0].top}, ${expected.applitools_title[0].width}, ${expected.applitools_title[0].height}, regionId: ${expected.applitools_title[0].regionId})`
			}	else {
				return `new Region(${expected.applitools_title[0].left}, ${expected.applitools_title[0].top}, ${expected.applitools_title[0].width}, ${expected.applitools_title[0].height})`
			}
		}
		if (expected.hasOwnProperty('x') && expected.hasOwnProperty('y')) return `new Location(${expected.x}, ${expected.y})`
		if (expected.hasOwnProperty('name') && expected.hasOwnProperty('value')) return `new PropertyData(\"${expected.name}\", \"${expected.value}\")`
		expected = "\"" + expected + "\""
		return expected
	}
}
function handleHooks(hooks) {
    if ("beforeCaptureScreenshot" in hooks) return '.BeforeRenderScreenshotHook(\"' + `${hooks.beforeCaptureScreenshot}` + '\")'
}

function dot_net(chunks, ...values) {
    const commands = [];
    let code = '';
    values.forEach((value, index) => {
        if (typeof value === 'function' && !value.isRef) {
            code += chunks[index];
            commands.push(code, value);
            code = '';
        } else {
            code += chunks[index] + serialize(value);
        }
    })
    code += chunks[chunks.length - 1];
    commands.push(code);
    return commands;
}

function serialize(value) {
    let stringified = '';
    if (value && value.isRef) {
        stringified = value.ref();
    } else if (value === null) {
        throw Error(`Null shouldn't be passed to the c# code. \n ${value}`);
    } else if (typeof value === 'object') {
        stringified = parseObject(value);
    } else if (typeof value === 'function') {
        stringified = value.toString();
    } else if (typeof value === 'undefined') {
        throw Error(`Undefined shouldn't be passed to the c# code. \n ${value}`);
    } else {
        stringified = JSON.stringify(value);
    }
    return stringified;
}

function parseObject(object) {
    if (object.selector) {
        return selectors[object.type](JSON.stringify(object.selector));
    } else if (object.type) {
        const typeBuilder = types[object.type];
        if (typeBuilder) {
            if (typeBuilder.isGeneric) {
                return typeBuilder.constructor(object.value, object.generic);
            } else {
                return typeBuilder.constructor(object.value);
            }
        } else throw new Error(`Constructor wasn't implemented for the type: ${object.type}`);
    } else return JSON.stringify(object);
}

function getter({ target, key, type }) {
    // console.log(`target: ${target} , key: ${key}, type: ${JSON.stringify(type, null, 3)}, typeOfKey: ${typeof key}, isArray: ${Array.isArray(key)}`)
    try {
        if (typeof type === 'undefined') return `${target}.${key}`
        else if (types[type.name]) return types[type.name].get(target, key)
        else throw new Error(`Haven't implement type ${JSON.stringify(type)}`)
    } catch (err) {
        throw new Error(`type:=${JSON.stringify(type)}\n error:=${err}`)
    }
}
const variable = ({ name, value, type }) => `${mapTypes(type)} ${name} = (${mapTypes(type)}) ${value}`
const call = ({ target, args }) => {
    return args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}()`
}
const returnSyntax = ({ value }) => {
    return `return ${value};`
}

function wrapSelector(val) {
    return val.selector ? val : { type: 'css', selector: val }
}

function printSelector(val) {
    return serialize((val && val.isRef) ? val : wrapSelector(val))
}

function parseEnv(env) {
    checkOptions(env, ENV_PROPERTIES)
    let result = 'Driver = BuildDriver()'
    if (env) {
        if (env.browser) result += `.Browser(${serialize(env.browser)})`
        if (env.device) result += `.Device(${serialize(env.device)})`
        if (env.app) result += `.App(${serialize(env.app)})`
        if (env.orientation) result += `.Orientation(${serialize(env.orientation)})`
        if (env.hasOwnProperty('headless')) result += `.Headless(${serialize(env.headless)})`
        if (env.hasOwnProperty('legacy')) result += `.Legacy(${serialize(env.legacy)})`
        if (env.hasOwnProperty('executionGrid') && env.executionGrid !== undefined) result += `.ExecutionGrid(${serialize(env.executionGrid)})`
    }
    return result + '.Build();'
}

module.exports = {
	checkSettingsParser: checkSettings,
    dot_net: dot_net,
    getter: getter,
	variable: variable,
    call: call,
    returnSyntax: returnSyntax,
    wrapSelector: wrapSelector,
    parseEnv: parseEnv,

	regionParameterParser: regionParameter,
	parseAssertActual: parseAssertActual,
	expectParser: expectParser,
	takeSelector: takeSelector,
}