module.exports = {
    "css": (selector) => `[By.CSS_SELECTOR, ${selector}]`,
    "className": (selector) => `[By.CLASS_NAME, ${selector}]`,
    "id": (selector) => `[By.ID, ${selector}]`,
    "accessibilityId": (selector) => `MobileBy.AccessibilityId(${selector})`,
    "androidUIAutomator": (selector) => `MobileBy.AndroidUIAutomator(${selector})`,
    "androidViewTag": (selector) => `MobileBy.AndroidViewTag(${selector})`,
    "iosPredicate": (selector) => `MobileBy.ByIosNsPredicate(${selector})`,
    "iosClassChain": (selector) => `MobileBy.ByIosClassChain(${selector})`,
}
