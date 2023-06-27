module.exports = {
    "css": (selector) => `By.CssSelector(${selector})`,
    "class name": (selector) => `By.ClassName(${selector})`,
    "id": (selector) => `By.Id(${selector})`,
    "xpath": (selector) => `By.XPath(${selector})`,
    "accessibility id": (selector) => `MobileBy.AccessibilityId(${selector})`,
    "-android uiautomator": (selector) => `MobileBy.AndroidUIAutomator(${selector})`,
    "androidViewTag": (selector) => `MobileBy.AndroidViewTag(${selector})`,
    "-ios predicate string": (selector) => `MobileBy.IosNSPredicate(${selector})`,
    "-ios class chain": (selector) => `MobileBy.IosClassChain(${selector})`,
}