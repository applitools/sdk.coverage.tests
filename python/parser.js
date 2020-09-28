'use strict'

function checkSettings(cs, mobile=false) {
    let target = `Target`
    if(cs === undefined){
        return target + '.window()'
    }
    let element = ''
    let options = ''
    if (cs.frames === undefined && cs.region === undefined) element = '.window()'
    else {
        if (cs.frames) element += frames(cs.frames)
        if (cs.region) element += region(cs.region, mobile)
    }
    if(cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions, mobile)
    if(cs.isFully) options += '.fully()'
    return target + element + options
}

function frames(arr) {
    return arr.reduce((acc, val) => acc + `.frame(\"${getVal(val)}\")`, '')
}

function region(region, mobile=false) {
    return `.region(${regionParameter(region, mobile)})`
}

function ignoreRegions(arr, mobile=false) {
    return arr.reduce((acc, val) => acc + ignore(val, mobile), '')
}

function ignore(region, mobile=false){
    return `.ignore(${regionParameter(region, mobile)})`
}

function regionParameter (region, mobile=false) {
    let string
    switch (typeof region) {
        case 'string':
            string = mobile? `my_find_element(driver, \"${region}\")` : `\"${region}\"`
            break;
        case "object":
            string = `Region(${region.left}, ${region.top}, ${region.width}, ${region.height})`
    }
    return string
}

function getVal (val) {
    let nameAndValue = val.toString().split("\"")
    return nameAndValue[1]
}

module.exports = {
    checkSettingsParser: checkSettings
}
