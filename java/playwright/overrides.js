module.exports = {
 
    // Python like
    // fails in selenium4 only due to legacy driver being used
    
    // not available in chrome > 96(will be avalable on slenium v4)
    'check region by selector within shadow dom with vg': { skipEmit: true },
    'check region by element within shadow dom with vg': { skipEmit: true },

    // Feature not present
    'should handle check of stale element if selector is preserved': { skipEmit: true },
    'should handle check of stale element in frame if selector is preserved': { skipEmit: true }, 
    'check window after manual scroll on safari 11': { skipEmit: true },

    // Functionality no longer exists in the SDK.
    'should return actual viewport size': { skipEmit: true },
    'should set viewport size': { skipEmit: true },
    'should set viewport size on edge legacy': { skipEmit: true },
    "should override default value of fully with true": { skipEmit: true },
    "should override default value of fully with false": { skipEmit: true },

    // TODO verify and enable
    // 'should send agentRunId': { skipEmit: true },
    "Should return exception in TestResultsSummary": { skipEmit: true },

    // check image
    "check image file in png format": {skipEmit: true},
    "check image file in jpeg format": {skipEmit: true},
    "check image file in bmp format": {skipEmit: true},
    "check image base64 in png format": {skipEmit: true},
    "check image url in png format": {skipEmit: true},
    "check image file in png format classic": {skipEmit: true},
    "check image region": {skipEmit: true},
    "check image region classic": {skipEmit: true},
    "should send dom when check image": {skipEmit: true},

    // devices are not available in playwright 
    "appium iOS nav bar check region": {skipEmit: true},
    "check window on mobile web android": {skipEmit: true},
    "check window fully on android chrome emulator on mobile page": { skipEmit: true },
    "check window fully on android chrome emulator on mobile page with horizontal scroll": { skipEmit: true },
    "check window fully on android chrome emulator on desktop page": {skipEmit: true},
    "should not fail if scroll root is stale on android": {skipEmit: true},
    "appium android check window": {skipEmit: true},
    "appium android check region with ignore region": {skipEmit: true},
    "appium android check region": {skipEmit: true},
    "appium iOS check window": {skipEmit: true},
    "appium iOS check fully window with scroll and pageCoverage": {skipEmit: true},
    "appium iOS check window region with scroll and pageCoverage": {skipEmit: true},
    "appium iOS check region with ignore region": {skipEmit: true},
    "appium iOS check region": {skipEmit: true},
    "appium android landscape mode check window on android 7": {skipEmit: true},
    "appium android landscape mode check window on android 10": {skipEmit: true},
    "appium android landscape mode check region on android 7": {skipEmit: true},
    "appium android landscape mode check region on android 10": {skipEmit: true},
    "should capture webview when specified in check settings on android": {skipEmit: true},
    "should capture webview when specified in check settings on ios": {skipEmit: true},
    "check window on mobile web ios": {skipEmit: true},

    // not in ./mapping/supported.js -> TYPES 
    "should send dom on ie": {skipEmit: true}, // "ie"
    "should send dom on edge legacy": {skipEmit: true}, // "edge"
    "check reigon by selector on ie": {skipEmit: true}, // "ie"
    "check frame after manual switch to frame with css stitching classic": {skipEmit: true}, // "webdriver"
    "check frame after manual switch to frame with scroll stitching classic": {skipEmit: true}, // "webdriver"
    "check region by selector in overflowed frame after manual scroll with css stitching": {skipEmit: true}, // "webdriver"
    "check region by selector in overflowed frame after manual scroll with scroll stitching": {skipEmit: true}, // "webdriver"
    "check window after manual scroll on safari 12": {skipEmit: true}, // "webdriver"
    "should fail check of stale element": {skipEmit: true}, // "webdriver"
}
