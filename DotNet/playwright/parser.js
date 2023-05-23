'use strict'
const types = require('./mapping/types')
const selectors = require('./mapping/selectors')
const { capitalizeFirstLetter } = require('../util')
const { checkOptions, isEmpty } = require("../../util")
const { CHECK_SETTINGS_HOOKS, CHECK_SETTINGS_OPTIONS, ENV_PROPERTIES } = require('./mapping/supported')


function checkSettings(cs, native) {
    checkOptions(cs, CHECK_SETTINGS_OPTIONS)
    let dot_net = `Target`
    if (cs === undefined || isEmpty(cs)) {
        return dot_net + '.Window()'
    }
    let element = ''
    let options = ''
    if (cs.frames === undefined && cs.region === undefined) element = '.Window()'
    else {
        if (cs.frames) {
            if (cs.scrollRootElement) {
                element += `.Window().ScrollRootElement(${printSelector(cs.scrollRootElement)})`
            }
            element += frames(cs.frames)
        }
        if (cs.region) element += region(cs.region)
    }
    if (cs.enablePatterns) options += `.EnablePatterns(${cs.enablePatterns})`
    if (cs.webview) options += webview(cs.webview);
    if (cs.floatingRegions) options += floatingRegions(cs.floatingRegions);
    if (cs.accessibilityRegions) options += accessibilityRegions(cs.accessibilityRegions);
    if (cs.ignoreRegions) options += typeRegions('Ignore', cs.ignoreRegions);
    if (cs.strictRegions) options += typeRegions('Strict', cs.strictRegions);
    if (cs.contentRegions) options += typeRegions('Content', cs.contentRegions);
    if (cs.layoutRegions) options += typeRegions('Layout', cs.layoutRegions);
    if (cs.scrollRootElement && !cs.frames) options += `.ScrollRootElement(${printSelector(cs.scrollRootElement)})`;
    if (cs.ignoreDisplacements !== undefined) options += `.IgnoreDisplacements(${cs.ignoreDisplacements})`;
    if (cs.timeout) options += `.Timeout(TimeSpan.FromMilliseconds(${serialize(cs.timeout)}))`;
    if (cs.sendDom !== undefined) options += `.SendDom(${serialize(cs.sendDom)})`;
    if (cs.matchLevel) options += `.MatchLevel(MatchLevel.${capitalizeFirstLetter(cs.matchLevel)})`;
    if (cs.name) options += `.WithName("${cs.name}")`;
    if (cs.layoutBreakpoints) options += layoutBreakpoints(cs.layoutBreakpoints);
    if (cs.waitBeforeCapture) options += `.WaitBeforeCapture(${cs.waitBeforeCapture})`;
    if (cs.isFully === true) {
        options += '.Fully()';
    } else if (cs.isFully === false) {
        options += '.Fully(false)';
    }
    if (cs.visualGridOptions) {
        const VGOptionsKeys = Object.keys(cs.visualGridOptions);
        const vgOptions = VGOptionsKeys.map(key => `new VisualGridOption("${key}", ${cs.visualGridOptions[key]})`).join(', ');
        options += `.VisualGridOptions(${vgOptions})`;
    }
    if (cs.variationGroupId) options += `.VariationGroupId("${cs.variationGroupId}")`;
    if (cs.hooks) {
        checkOptions(cs.hooks, CHECK_SETTINGS_HOOKS);
        if (cs.hooks.beforeCaptureScreenshot) {
            options += `.BeforeRenderScreenshotHook("${cs.hooks.beforeCaptureScreenshot}")`;
        }
    }
    if (cs.pageId) { options += `.PageId("${cs.pageId}")`; }
    if (cs.lazyLoad) { options += lazyLoad(cs.lazyLoad); }

    return dot_net + element + options;

    // check settings
    
    function layoutBreakpoints(layoutBreakpoints) {
        // let option = `.LayoutBreakpoints(new LayoutBreakpointsOptions()`
        // if (typeof layoutBreakpoints == 'object' && !Array.isArray(layoutBreakpoints)) {
        //     if (typeof layoutBreakpoints.breakpoints == 'boolean') option += `.Breakpoints(${layoutBreakpoints.breakpoints})`;
        //     if (typeof layoutBreakpoints.breakpoints == 'object') option += `.Breakpoints(${layoutBreakpoints.breakpoints.join(', ')})`
        // } else {
        //     option += `.Breakpoints(${layoutBreakpoints})`
        // }
        // if (layoutBreakpoints.reload) {
        //     option += `.Reload(${layoutBreakpoints.reload})`
        // }
        // option += `)`
        let option = `.LayoutBreakpoints(`
        if (typeof layoutBreakpoints == 'object' && !Array.isArray(layoutBreakpoints)) {
            if (typeof layoutBreakpoints.breakpoints == 'boolean') option += `${layoutBreakpoints.breakpoints}`;
            if (typeof layoutBreakpoints.breakpoints == 'object') option += `${layoutBreakpoints.breakpoints.join(', ')}`
        } else {
            option += layoutBreakpoints
        }
        option += `)`
        
        return option;
    }

    function webview(webview) {
        let s;
        switch(typeof webview) {
            case "boolean":
                s = `.Webview(${cs.webview})`
                break;
            case "string":
                s = `.Webview(${JSON.stringify(cs.webview)})`
                break;
            default:
                throw new Error(`webview parameter of the unimplemented type was used:  ${JSON.stringify(webview)}`);
        }

        return s;
    }

    function frames(arr) {
        return arr.reduce((acc, val) => acc + `${frame(val)}`, '');
    }

    function frame(frame) {
        return (!frame.isRef && frame.frame) ? `.Frame(${frameSelector(frame.frame)}).ScrollRootElement(${printSelector(frame.scrollRootElement)})` : `.Frame(${frameSelector(frame)})`;
    }

    function frameSelector(selector) {
        if (typeof selector === 'string' && !checkCss(selector)) {
            return JSON.stringify(selector);
        } else {
            return printSelector(selector);
        }

        function checkCss(string) {
            return (string.includes('[') && string.includes(']')) || string.includes('#');
        }
    }

    function region(region) {
        return `.Region(${regionParameter(region)})`;
    }

    function typeRegions(type, arr) {
        return arr.reduce((acc, val) => `${acc}.${type}(${regionParameter(val)})`, '');
    }

    function floatingRegions(arr) {
        return arr.reduce((acc, val) => `${acc}.Floating(${floating(val)})`, ``);
    }

    function floating(floating) {
        let string;
        string = regionParameter(floating.region);
        string += `, ${floating.maxUpOffset}, ${floating.maxDownOffset}, ${floating.maxLeftOffset}, ${floating.maxRightOffset}`;
        return string;
    }

    function accessibilityRegions(arr) {
        return arr.reduce((acc, val) => `${acc}.Accessibility(${accessibility(val)})`, ``);
    }

    function accessibility(val) {
        return `${regionParameter(val.region)}, AccessibilityRegionType.${capitalizeFirstLetter(val.type)}`;
    }

    function regionParameter(region) {
        let string;
        switch (typeof region) {
            case 'string':
                string = `${JSON.stringify(region)}`;
                break;
            case "object":
                if (region.region) {
                    string = regionParameter(region.region)
                    if (region.regionId) {
                        string += `, "${region.regionId}"`
                    }
                    if (region.padding) {
                        switch(typeof region.padding) {
                            case 'number':
                                string += `, new Padding(${region.padding})`
                                break;
                            case 'object':
                                string += `, new Padding()`
                                if (region.padding.top) string += `.setTop(${region.padding.top})`
                                if (region.padding.right) string += `.setRight(${region.padding.right})`
                                if (region.padding.bottom) string += `.setBottom(${region.padding.bottom})`
                                if (region.padding.left) string += `.setLeft(${region.padding.left})`
                                break;
                            default:
                                throw new Error(`Padding parameter of the unimplemented type was used:  ${JSON.stringify(region.padding)}`);
                        }
                    }
                } else if (region.type) {
                    string = native ? `Driver.Locator(${parseObject(region)})` : parseObject(region);
                } else {
                    string = parseObject({ value: region, type: 'Region' });
                }
                break;
            case "function":
                string = serialize(region);
                break;
            default:
                throw new Error(`Region parameter of the unimplemented type was used:  ${JSON.stringify(region)}`);
        }
        return string
    }
    function lazyLoadOptions(lazyLoad) {
        let string;
        let llOptions;
        const LLOptionsKeys = Object.keys(lazyLoad);
        llOptions = LLOptionsKeys.map(key => `${key}: ${lazyLoad[key]}`).join(',');
        string = `new LazyLoadOptions(${llOptions})`;
        return `.LazyLoad(${string})`;
    }
    function lazyLoad(lazyLoad) {
        if (isEmpty(lazyLoad))
            return `.LazyLoad()`
        else
            return lazyLoadOptions(lazyLoad)
    }

}

// General

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

function mapTypes(type) {
    let mapped
    try {
        mapped = type ? types[type.name].name(type) : types.Element.name()
    } catch (e) {
        throw Error(`SDK haven't implemented support for the ${JSON.stringify(type)} \nWith error: ${e.message} \nStack:${e.stack}`)
    }
    return mapped
}

function wrapSelector(val) {
    return val.selector ? val : { type: 'css', selector: val }
}

function printSelector(val) {
    return serialize((val && val.isRef) ? val : wrapSelector(val))
}

const variable = ({ name, value, type }) => `${mapTypes(type)} ${name} = (${mapTypes(type)}) ${value}`
const call = ({ target, args }) => {
    return args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}()`
}
const returnSyntax = ({ value }) => {
    return `return ${value};`
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
    parseEnv: parseEnv
}
