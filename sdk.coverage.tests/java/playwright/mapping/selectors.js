module.exports = {
    "css": (selector) => `${selector}`,
    "class name": (selector) => `${selector}`,
    "id": (selector) => `${selector}`,
    "accessibility id": (selector) => `${JSON.stringify(`accessibility id=${JSON.parse(selector)}`)}`,
    "-android uiautomator": (selector) => `MobileBy.AndroidUIAutomator(${selector})`,
    "androidViewTag": (selector) => `MobileBy.AndroidViewTag(${selector})`,
    "-ios predicate string": (selector) => `MobileBy.iOSNsPredicateString(${selector})`,
    "-ios class chain": (selector) => `MobileBy.iOSClassChain(${selector})`,
    "xpath": (selector) => `${selector}`,
}