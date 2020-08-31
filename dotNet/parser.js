'use strict'

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
        if (cs.region) element += region(cs.region, mobile)
    }
    if(cs.ignoreRegions) options += ignoreRegions(cs.ignoreRegions, mobile)
    if(cs.scrollRootElement) options+=scrollRootElement(cs.scrollRootElement)
    if(cs.isFully) options += '.Fully()'
    return target + element + options
}

function frames(arr) {
    return arr.reduce((acc, val) => acc + `.Frame(\"${getVal(val)}\")`, '')
}

function region(region, mobile=false) {
    return `.Region(${regionParameter(region, mobile)})`
}

function ignoreRegions(arr, mobile=false) {
    return arr.reduce((acc, val) => acc + ignore(val, mobile), '')
}

function ignore(region, mobile=false){
    return `.Ignore(${regionParameter(region, mobile)})`
}

function scrollRootElement(cssSelector) {	
    return `.ScrollRootElement(By.CssSelector(\"${cssSelector}\"))`	
}

function regionParameter (region, mobile=false) {
    let string
    switch (typeof region) {
        case 'string':
            string = mobile? `Utilities.FindElement(driver, \"${region}\")` : `By.CssSelector(\"${region}\")`
            break;
        case "object":
            string = `new Rectangle(${region.left}, ${region.top}, ${region.width}, ${region.height})`
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