const CHECK_SETTINGS_OPTIONS = [
    'frames',
    'region',
    'scrollRootElement',
    'ignoreRegions',
    'strictRegions',
    'contentRegions',
    'floatingRegions',
    'accessibilityRegions',
    'layoutRegions',
    'ignoreDisplacements',
    'sendDom',
    'matchLevel',
    'name',
    'layoutBreakpoints',
    'isFully',
    'visualGridOptions',
    'variationGroupId',
    'hooks',
    'timeout',
    'pageId',
    'waitBeforeCapture',
    'lazyLoad',
    "webview",
    'enablePatterns'
]
const CHECK_SETTINGS_HOOKS = [
    'beforeCaptureScreenshot'
]

const ENV_PROPERTIES = [
    'browser',
    'device',
    'app',
    'headless',
    'legacy',
    'executionGrid',
    'orientation',
    'args', // Need to add in the future
]

const TAGS = ['image', 'chrome', 'chromium', 'firefox', 'webkit', 'safari', 'all-cookies']

module.exports = {
    CHECK_SETTINGS_OPTIONS,
    CHECK_SETTINGS_HOOKS,
    ENV_PROPERTIES,
    TAGS
}