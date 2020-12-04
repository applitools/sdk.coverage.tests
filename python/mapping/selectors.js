module.exports = {
    "css": (selector) => `By.cssSelector(${selector})`,
    "className": (selector) => `By.className(${selector})`,
    "id": (selector) => `By.id(${selector})`,
    "accessibilityId": (selector) => `MobileBy.AccessibilityId(${selector})`,
    "androidUIAutomator": (selector) => `MobileBy.AndroidUIAutomator(${selector})`,
    "androidViewTag": (selector) => `MobileBy.AndroidViewTag(${selector})`,
    "iosPredicate": (selector) => `MobileBy.ByIosNsPredicate(${selector})`,
    "iosClassChain": (selector) => `MobileBy.ByIosClassChain(${selector})`,
}