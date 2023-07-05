const iosDeviceName = require('./iosDeviceName')
const deviceName = require('./deviceName')
const { capitalizeFirstLetter } = require('../util')
const simpleGetter = (target, key) => `${target}.Get${capitalizeFirstLetter(key)}()`;
const propertyGetter = (target, key) => `${target}.${capitalizeFirstLetter(key)}`;
const stringifyShadowSelector = (value) => {
    var str = '';
    while (value && value.shadow) {
        if (value.selector){
            str += `.Shadow("${value.selector}")`
        }
        if (typeof value.shadow === 'string') {
            str += `.Shadow("${value.shadow}")`
        } 
        value = value.shadow
    }
    return str;
};

const types = {
    "Map": {
        constructor: (value, generic) => {
            const mapKey = generic[0]
            const mapValue = generic[1]
            const keyType = types[mapKey.name]
            const valueType = types[mapValue.name]
            return `new Dictionary<${keyType.name(mapKey)}, ${valueType.name(mapValue)}>
    { ${Object.keys(value).map(key => `{${keyType.constructor(key, mapKey.generic)}, ${valueType.constructor(value[key], mapValue.generic)}}`).join(", ")} }`
        },
        get: (target, key) => `${target}["${key}"]`,
        isGeneric: true,
        name: (type) => {
            const key = type.generic[0].name
            const genericKey = type.generic[0]
            const value = type.generic[1].name
            const genericValue = type.generic[1]
            let genVal;
            if (value === 'List') {
                genVal = types[value].name(genericValue);
            } else {
                genVal = 'object'
            }
            return `Dictionary<${types[key].name(genericKey)}, ${genVal}>`
        },
    },
    "List": {
        constructor: (value, generic) => {
            const param = generic[0]
            const paramType = types[param.name]
            return `new List<${paramType.name(param)}>
            { ${value.map(region => `${paramType.constructor(region)}`).join(", ")} }`
        },
        name: (type) => `IList<${type.generic[0].name}>`,
        get: (target, key) => Number.isInteger(Number(key)) ? `${target}[${key}]` : `${target}.${key}()`
    },
    "RectangleSize": {
        constructor: (value) => `new RectangleSize(${value.width}, ${value.height})`,
        get: (target, key) => key.includes('get') ? `${target}.${key}` : simpleGetter(target, key),
        name: () => 'RectangleSize',
    },
    "TestInfo": {
        get: propertyGetter,
        name: () => 'SessionResults',
    },
    "JsonNode": {
        get: (target, key) => `${target}[${Number.isInteger(Number(key)) ? key : `"${key}"`}]`,
        name: () => 'JToken'
    },
    "Element": {
        name: () => 'IWebElement',
        get: simpleGetter,
    },
    "Region": {
        name: () => 'Region',
        constructor: (value) => {
            if (value.selector && value.shadow) {
                return `TargetPath` + stringifyShadowSelector(value)
            }
            if (value.selector){
                return `By.CssSelector(${value.selector})`
            }
            return `new Region(${value.left}, ${value.top}, ${value.width}, ${value.height})`
        }
    },
    "FloatingRegion": {
        constructor: (value) => {
            let region;
            if (value.region) region = `${value.region.left},${value.region.top}, ${value.region.width}, ${value.region.height}`
            else region = `${value.left}, ${value.top}, ${value.width}, ${value.height}`
            return `new FloatingMatchSettings(${region}, ${value.maxUpOffset}, ${value.maxDownOffset}, ${value.maxLeftOffset}, ${value.maxRightOffset})`
        }
    },
    "Array": {
        get: (target, key) => Number.isInteger(Number(key)) ? `${target}[${key}]` : propertyGetter(target, key),
        name: (arr) => `${arr.items.type}[]`,
    },
    "Boolean": {
        constructor: (value) => `${value}`,
        name: () => `bool`
    },
    "BooleanObject": {
        constructor: (value) => `${value.toString().toLowerCase()}`
    },
    "String": {
        constructor: (value) => JSON.stringify(value),
        name: () => `string`,
    },
    "Number": {
        constructor: (value) => `${JSON.stringify(value)}L`,
        name: () => `long`,
    },
    "Long": {
        constructor: (value) => `(long)${JSON.stringify(value)}`,
        name: () => `long`,
    },
    "int": {
        constructor: (value) => `${JSON.stringify(value)}`,
        name: () => `int`,
    },
    "Image": {
        get: propertyGetter,
    },
    "ImageMatchSettings": {
        get: propertyGetter,
    },
    "AppOutput": {
        get: propertyGetter,
    },
    "AccessibilitySettings": {
        constructor: function (value) {
            return `new AccessibilitySettings(${types.AccessibilityLevel.constructor(value.level)}, ${types.AccessibilityGuidelinesVersion.constructor(value.guidelinesVersion || value.version)})`
        },
        get: (target, key) => (key === 'version') ? `${target}.GuidelinesVersion` : propertyGetter(target, key)
    },
    "AccessibilityRegion": {
        constructor: (value) => `new AccessibilityRegionByRectangle(${value.left}, ${value.top}, ${value.width}, ${value.height}, AccessibilityRegionType.${capitalizeFirstLetter(value.type)})`
    },
    "AccessibilityLevel": {
        constructor: (value) => `AccessibilityLevel.${value}`
    },
    "AccessibilityGuidelinesVersion": {
        constructor: (value) => `AccessibilityGuidelinesVersion.${value}`
    },
    "Location": {
        constructor: (value) => `new Location(${value.x}, ${value.y})`,
        name: () => `Location`,
        get: propertyGetter,
    },
    "BrowsersInfo": {
        constructor: (value) => {
            return value.map(render => {
                if (render.name) return `new DesktopBrowserInfo(${render.width}, ${render.height}, BrowserType.${render.name.toUpperCase()})`
                else if (render.iosDeviceInfo) return `new IosDeviceInfo(${iosDeviceName[render.iosDeviceInfo.deviceName]})`
                else if (render.chromeEmulationInfo) return `new ChromeEmulationInfo(${deviceName[render.chromeEmulationInfo.deviceName]}, ScreenOrientation.Portrait)`
            }).join(', ')
        },
    },
    "TextRegion": {
        get: propertyGetter
    },
    "BatchInfo": {
        get: propertyGetter
    },
    "StartInfo": {
        get: propertyGetter
    },
    "TestResultsSummary": {
        name: () => `TestResultsSummary`,
        get: simpleGetter
    },
    "TestResultContainer": {
        name: () => `TestResultContainer`,
        get: (target, key) => key.includes('get') ? `${target}.${key}` : propertyGetter(target, key)
    },
    "TestResults": {
        name: () => `TestResults`,
        get: (target, key) => {
            if (key.startsWith('is')) {
                return propertyGetter(target, key)
            }
            else if (key === 'status') {
                return `${target}.Status.ToString()`
            } else {
                return propertyGetter(target, key)
            }
        }
    },
    "rect": {
        name: () => 'Rect',
        get: (target, key) => `${target}["${key}"].Value<double>()`,
    },
    "PageCoverageInfo": {
        get: propertyGetter
    },
    "BrowserInfo": {
        name: () => `BrowserInfo`,
        get: (target, key) => {
            if (key === 'name'){
                return `${target}.BrowserType.ToString().ToLower()`
            }
            return propertyGetter(target, key)
        },
    },
    "StitchModes": {
        constructor: (value)=>{
            if (value === undefined) return null
            return `StitchModes.${value}`
        }
    },
    "ChromeEmulationInfo": {
        name: () => "ChromeEmulationInfo",
        get: (target, key) => {
            if (key == "deviceName") {
                return `${target}.DeviceName.ToString().Replace('_', ' ')`;
            }
            return propertyGetter(target, key);
        }
    }

}
module.exports = types