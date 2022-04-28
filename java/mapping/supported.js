const CHECK_SETTINGS_OPTIONS = [
    'frames',
    'region',
    'scrollRootElement',
    'ignoreRegions',
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
    'pageId']
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
]
module.exports = {
    CHECK_SETTINGS_OPTIONS,
    CHECK_SETTINGS_HOOKS,
    ENV_PROPERTIES
}