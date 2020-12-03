'use strict'

function checkSettings(cs) {
    let target = `Target`
    if(cs === undefined){
        return target + '.window()'
    }
    let element = ''
    let options = ''
    if (cs.frames === undefined && cs.region === undefined) element = '.window()'
    else {
        if (cs.frames) element += frames(cs.frames)
        if (cs.region) element += region(cs.region)
    }
    if(cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions)
    if(cs.isFully) options += '.fully()'
    return target + element + options
}

function frames(arr) {
    return arr.reduce((acc, val) => acc + `.frame(\"${getVal(val)}\")`, '')
}

function region(region) {
    return `.region(${regionParameter(region)})`
}

function ignoreRegions(arr) {
    return arr.reduce((acc, val) => acc + ignore(val), '')
}

function ignore(region){
    return `.ignore(${regionParameter(region)})`
}

function regionParameter (region) {
    let string
    switch (typeof region) {
        case 'string':
            string = `\"${region}\"`
            break;
        case "object":
            string = `Region(${region.left}, ${region.top}, ${region.width}, ${region.height})`
            break;
        case "undefined":
            string = 'None'
            break;
        case "function":
            string = region.isRef ? region.ref() : region()
            break;
    }
    return string
}

function getVal (val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}

// General functions

function python(chunks, ...values) {
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
        let stringified = ''
        if (value && value.isRef) {
            stringified = value.ref()
        } else if (typeof value === 'function') {
            stringified = value.toString()
        } else if (typeof value === 'undefined') {
            stringified = 'None'
        } else if (typeof value === 'boolean') {
            stringified = value ? 'True' : 'False'
        } else {
            stringified = JSON.stringify(value)
        }
    return stringified
}

module.exports = {
    checkSettingsParser: checkSettings,
    python: python,
}
