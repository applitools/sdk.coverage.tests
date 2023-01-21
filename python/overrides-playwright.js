module.exports = {
    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    "Should return exception in TestResultsSummary": {skipEmit: true},

    // need to add support for the webview property in check settings to the emitter
    "should capture webview when specified in check settings on ios": {skipEmit: true},
    "should capture webview when specified in check settings on android": {skipEmit: true},

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
    "appium android check region with ignore region": {skipEmit: true},
    "appium android check region": {skipEmit: true},
    "appium android check window": {skipEmit: true},
    "appium android landscape mode check region on android 10": {skipEmit: true},
    "appium android landscape mode check region on android 7": {skipEmit: true},
    "appium android landscape mode check window on android 10": {skipEmit: true},
    "appium android landscape mode check window on android 7": {skipEmit: true},
    "appium iOS check fully window with scroll and pageCoverage": {skipEmit: true},
    "appium iOS check region with ignore region": {skipEmit: true},
    "appium iOS check region": {skipEmit: true},
    "appium iOS check window region with scroll and pageCoverage": {skipEmit: true},
    "appium iOS check window": {skipEmit: true},
    "appium iOS nav bar check region": {skipEmit: true},
    "check window on mobile web android": {skipEmit: true},
    "check window on mobile web ios": {skipEmit: true},

    // cheomr emulation
    "check window fully on android chrome emulator on desktop page": {skipEmit: true},
    "check window fully on android chrome emulator on mobile page with horizontal scroll": { skipEmit: true },
    "check window fully on android chrome emulator on mobile page": { skipEmit: true },
    "should not fail if scroll root is stale on android": {skipEmit: true},

    // manual frame switching
    "check frame after manual switch to frame with css stitching classic": {skipEmit: true},
    "check frame after manual switch to frame with scroll stitching classic": {skipEmit: true},
    "check region by selector in overflowed frame after manual scroll with css stitching":  {skipEmit: true},
    "check region by selector in overflowed frame after manual scroll with scroll stitching":  {skipEmit: true},
}
