'use strict';
const types = require('./mapping/types')
const selectors = require('./mapping/selectors')
const {isSelector, pascalToSnakeCase,} = require('./util')
const {checkOptions, fromCamelCaseToSnakeCase} = require('../util')
const {CHECK_SETTINGS_OPTIONS} = require('./mapping/supported')

function checkSettings(cs, driver, native) {
    checkOptions(cs, CHECK_SETTINGS_OPTIONS)
    let target = native ? `target: Applitools::Appium::Target` : `Applitools::Selenium::Target`;
    if (cs === undefined) {
        return target + '.window'
    }
    let name = '';
    let element = '';
    let options = '';
    if (cs.frames === undefined && cs.region === undefined) element = '.window';
    else {
        if (cs.frames) element += frames(cs.frames);
        if (cs.region) element += region(cs.region)
    }
    if (cs.accessibilityRegions) options += accessibilityRegions(cs.accessibilityRegions)
    if (cs.floatingRegions) options += floatingRegions(cs.floatingRegions);
    if (cs.strictRegions) options += typeRegions('strict', cs.strictRegions);
    if (cs.contentRegions) options += typeRegions('content', cs.contentRegions);
    if (cs.layoutRegions) options += typeRegions('layout', cs.layoutRegions);
    if (cs.ignoreRegions) options += typeRegions('ignore', cs.ignoreRegions);
    if (cs.scrollRootElement) element += scrollRootElement(cs.scrollRootElement)
    if (cs.ignoreDisplacements !== undefined) options += `.ignore_displacements(${cs.ignoreDisplacements})`
    if (cs.sendDom !== undefined) options += `.send_dom(${serialize(cs.sendDom)})`
    if (cs.layoutBreakpoints) options += `.layout_breakpoints(${serialize(cs.layoutBreakpoints)})`
    if (cs.variationGroupId) options += `.variation_group_id(${serialize(cs.variationGroupId)})`
    if (cs.visualGridOptions) {
        const VGOptionsKeys = Object.keys(cs.visualGridOptions);
        const vgOptions = VGOptionsKeys.map(key => `${key}: ${cs.visualGridOptions[key]}`).join(', ');
        options += `.visual_grid_options(${vgOptions})`;
    }
    if (cs.waitBeforeCapture) options += `.wait_before_capture(${cs.waitBeforeCapture})`
    if (cs.pageId) options += `.page_id(${serialize(cs.pageId)})`
    if (cs.timeout !== undefined) options += `.timeout(${serialize(cs.timeout)})`
    if (cs.lazyLoad !== undefined) options += lazyLoad(cs.lazyLoad)
    if (cs.isFully !== undefined) options += `.fully(${serialize(cs.isFully)})`;
    if (cs.hooks) options += hooks(cs.hooks);
    if (cs.name) name = `'${cs.name}', `;
    if (cs.matchLevel) options += `.match_level(${serialize(cs.matchLevel)})`
    if (cs.enablePatterns) options += `.enable_patterns(${serialize(cs.enablePatterns)})`
    if (cs.webview) options += webview(cs.webview);
    return name + target + element + options

    function hooks(obj) {
        const hooks = Object.keys(obj).map(key => `${key}: ${serialize(obj[key])}`).join(',')
        return `.hooks(${hooks})`
    }

    function frames(arr) {
        return arr.reduce((acc, val) => acc + `${frame(val)}`, '')
    }

    function frame(val) {
        return (!val.isRef && val.frame) ? `.frame(${frameSelector(val.frame)})` : `.frame(${frameSelector(val)})`

        function frameSelector(selector) {
            if (typeof selector === 'string' && !checkCss(selector)) {
                return JSON.stringify(selector)
            } else {
                return printSelector(selector);
            }

            function checkCss(string) {
                return (string.includes('[') && string.includes(']')) || string.includes('#')
            }
        }

        function printSelector(val) {
            let selector;
            if (val && val.isRef) {
                selector = val;
            } else if (isSelector(val)) {
                // Might need to add mapping for selector's types if they won't match for ruby
                selector = ref(`'${val.selector}'`)
            } else {
                selector = ref(`'${val}'`)
            }
            return serialize(selector)
        }
    }

    function region(region) {
        return `.region(${regionParameter(region)})`
    }

    function ignoreRegions(arr) {
        return arr.reduce((acc, val) => acc + ignore(val), '')
    }

    function ignore(region) {
        return `.ignore(${regionParameter(region)})`
    }

    function typeRegions(type, arr) {
        return arr.reduce((acc, val) => acc + `.${type}(${regionParameter(val)})`, '')
    }

    function floatingRegions(arr) {
        return arr.reduce((acc, val) => acc + floating(val), '')
    }

    function floating(floating) {
        return `.floating(${regionParameter(floating.region)}, ${floatingBounds(floating)})`
    }

    function floatingBounds(bounds) {
        return types.FloatingBounds.constructor(bounds)
    }

    function regionParameter(region) {
        let string;
        switch (typeof region) {
            case 'string':
                string = `:css, \'${region}\'`;
                break;
            case "object":
                if(region.region) {
                    string = regionParameter(region.region)
                    if (region.padding) {
                        string += `, padding: ${types.PaddingBounds.constructor(region.padding)}`;
                    }
                    if (region.regionId) {
                        string += ruby`, region_id: ${region.regionId}`;
                    }
                } else {
                    string = region.selector ? serialize(region) : types.Region.constructor(region)
                }
                break;
            default:
                string = serialize(region)
        }
        return string
    }

    function accessibilityRegions(regions) {

        return regions.map(accessibilityRegion).join('')

        function accessibilityRegion(reg) {
            return `.accessibility(${regionParameter(reg.region)}, type: ${serialize(reg.type)})`
        }
    }

    function scrollRootElement(scrollRootElement) {
        return `.scroll_root_element(${regionParameter(scrollRootElement)})`
    }

    function lazyLoad(arg) {
        let args = Object.entries(arg).map(([key, value], _) => fromCamelCaseToSnakeCase(key) + ruby`: ${value}`)
        return `.lazy_load(${args.join(', ')})`
    }

    function webview(webview) {
        let s;
        switch(typeof webview) {
            case "boolean":
                s = `.webview(${cs.webview})`
                break;
            case "string":
                s = `.webview(${JSON.stringify(cs.webview)})`
                break;
            default:
                throw new Error(`webview parameter of the unimplemented type was used:  ${JSON.stringify(webview)}`);
        }

        return s;
    }
}


function construct(chunks, ...values) {
    const commands = []

    function isPresent(values) {
        const value = (values.length > 0 && typeof values[0] !== 'undefined')
        return value && values[0].isRef ?
            values[0].ref() !== 'undefined' &&
            values[0].ref() !== undefined :
            value
    }

    const builder = {
        add(chunks, ...values) {
            commands.push(...ruby(chunks, ...values))
            return builder
        },
        notAdd() {
            return builder
        },
        extra(chunks, ...values) {
            if (isPresent(values)) commands.push(...ruby(chunks, ...values))
            return builder
        },
        build(separator = '') {
            return [commands.join(separator)]
        },
        addIf(bool) {
            return bool ? builder.add : builder.notAdd
        }
    }
    return builder.add(chunks, ...values)
}

function ruby(chunks, ...values) {
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

function serialize(value) {
    let stringified = '';
    if (value && value.isRef) {
        stringified = value.ref()
    } else if (Array.isArray(value)) {
        stringified = `[${value.map(serialize).join(', ')}]`
    } else if (typeof value === 'function') {
        stringified = value.toString()
    } else if (typeof value === 'undefined' || value === null) {
        stringified = 'nil'
    } else if (typeof value === 'string') {
        stringified = `'${value.replace(/'/ig, `\\'`)}'`
    } else if (isSelector(value)) {
        stringified = selectors[value.type](value.selector)
    } else if (typeof value === 'object') {
        stringified = `{ ${Object.keys(value).map(key => `${serialize(key)} => ${serialize(value[key])}`).join(', ')} }`
    } else {
        stringified = JSON.stringify(value)
    }
    return stringified
}

function driverBuild(env) {
    let parsed = (env && Object.keys(env).length > 0) ? '(' +
        Object.keys(env).map(key => `${key}: ${serialize(env[key])}`).join(', ') +
        ')' : ''
    return `@driver = build_driver${parsed}`
}

function ref(val) {
    const wrapped = {
        isRef: true,
        ref: () => val,
        type: (type) => {
            if (type) {
                wrapped._type = type;
                const val = wrapped.ref();
                wrapped.ref = () => val ? types[type].constructor(val) : val
                return wrapped
            } else return wrapped._type;
        },
    }
    return wrapped
}

function variable({name, value}) {
    return `${name} = ${value}`
}

function getter({target, key, type}) {
    let get;
    if (type && type.name === 'Array') {
        get = key === 'length' ? `.${key}` : `[${key}]`
    } else if (type && types[type.name] && types[type.name].get) {
        return types[type.name].get(target, key)
    } else {
        get = key.startsWith('get') ? `.${key.slice(3).toLowerCase()}` : `[${serialize(key)}]`
    }
    return `${target}${get}`
}

function call({target, args}) {
    return args.length > 0 ? `${target}(${args.map(val => JSON.stringify(val)).join(", ")})` : `${target}`
}

function returnSyntax({value}) {
    return `return ${value}`
}

function getClassName(coverageClassName) {
    if (!types[coverageClassName]) throw new Error(`There is no type for the ${coverageClassName}`)
    return ref(types[coverageClassName].class())
}

function prepareTestConfig(config) {
    return Object.keys(config).map(property => `${pascalToSnakeCase(property)}: ${serialize(config[property])}`).join(', ')
}

module.exports = {
    checkSettingsParser: checkSettings,
    ruby: ruby,
    driverBuild: driverBuild,
    construct: construct,
    ref: ref,
    variable: variable,
    getter: getter,
    call: call,
    returnSyntax: returnSyntax,
    getClassName: getClassName,
    prepareTestConfig: prepareTestConfig,
};