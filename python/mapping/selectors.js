module.exports = {
    "css": (selector) => `[By.CSS_SELECTOR, ${selector}]`,
    "class name": (selector) => `[By.CLASS_NAME, ${selector}]`,
    "id": (selector) => `[By.ID, ${selector}]`,
    "xpath": (selector) => `[By.XPATH, ${selector}]`,
    "accessibility id": (selector) => `[AppiumBy.ACCESSIBILITY_ID, (${selector})]`,
    "-android uiautomator": (selector) => `[AppiumBy.ANDROID_UIAUTOMATOR, (${selector})]`,
    "androidViewTag": (selector) => `[AppiumBy.ANDROID_VIEWTAG, (${selector})]`,
    "-ios predicate string": (selector) => `[AppiumBy.IOS_PREDICATE, (${selector})]`,
    "-ios class chain": (selector) => `[AppiumBy.IOS_CLASS_CHAIN, (${selector})]`,
}
