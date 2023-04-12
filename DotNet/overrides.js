module.exports = {
    "check region by selector in frame fully on firefox legacy": {skipEmit: true},
    "check region by selector within shadow dom with vg": {skipEmit: true},
    "check region by element within shadow dom with vg": {skipEmit: true},
    "should handle check of stale element if selector is preserved": {skip: true},
    "should handle check of stale element in frame if selector is preserved": {skip: true},
    "check window after manual scroll on safari 11": {skip: true},
    "should extract text from regions": {skipEmit: true},
    "should extract text regions from image": {skipEmit: true},
    "should fail check of stale element": {skip: true},
    "should set viewport size": {skip: true},
    "should set viewport size on edge legacy": {skip: true},
  
    // Generation errors:
    "check window on mobile web android": {skipEmit: true},
    "check window on mobile web ios": {skipEmit: true},
    "should extract text from regions without a hint": {skipEmit: true},
    "should return aborted tests in getAllTestResults": {skipEmit: true},
    "should return aborted tests in getAllTestResults with vg": {skipEmit: true},
    "should send agentRunId": {skipEmit: true},
    "appium android landscape mode check window on android 7": {skipEmit: true},
    "appium android landscape mode check window on android 10": {skipEmit: true},
    "appium android landscape mode check region on android 7": {skipEmit: true},
    "appium android landscape mode check region on android 10": {skipEmit: true},
    // Compilation errors:
    "should return browserInfo in getAllTestResults": {skipEmit: true},
    // // Page coverage feature
    "pageCoverage data is correct": {skipEmit: true},
    "pageCoverage data is correct with vg": {skipEmit: true},
    "appium iOS check fully window with scroll and pageCoverage": {skipEmit: true},
    "appium iOS check window region with scroll and pageCoverage": {skipEmit: true},
    
    // locator emitter
    "should find regions by visual locator": {skipEmit: true},
    "should find regions by visual locator with vg": {skipEmit: true},
  
    // Flaky tests (waitBeforeCapture isn't implemented)
    'should waitBeforeCapture in open': {skip: true},
    'should waitBeforeCapture in check': {skip: true},
  
    // Skipped test running on Selenium3 but not on Selenium4
    "should send dom on edge legacy": {skip: true},
    "Should return exception in TestResultsSummary": {skipEmit: true},
  
    // waitBeforeCapture is not implemented
    "should waitBeforeCapture with breakpoints in check": {skipEmit: true},
    "should waitBeforeCapture with breakpoints in open": {skipEmit: true},
    
    // need to add support for the webview property in check settings to the emitter
    "should capture webview when specified in check settings on ios": {skipEmit: true},
    "should capture webview when specified in check settings on android": {skipEmit: true},
    "should use regions padding": {skipEmit: true},
    "should use regions padding with vg": {skipEmit: true},

    "should send codded regions with region id": {skipEmit: true},
    "should send codded regions with region id with vg": {skipEmit: true},

    // "should send codded regions with padding": {skipEmit: true},
    // "should send codded regions with padding with vg": {skipEmit: true},


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
    
    "should send enablePatterns when specified in config": {skipEmit: true},
    "should send enablePatterns when specified in config with vg": {skipEmit: true},
    "should send enablePatterns when specified in check settings": {skipEmit: true},
    "should send enablePatterns when specified in check settings with vg": {skipEmit: true},

    // Support removing duplicates:
    // TODO: update the emitter to support passing the new runner option `removeDuplicateTestsPerBatch`
    "should support removal of duplicate test results with classic": {skipEmit: true},
    "should support removal of duplicate test results with ufg": {skipEmit: true},
    "should skip removal of duplicate test results when baseline name used with classic": {skipEmit: true},
    "should skip removal of duplicate test results when baseline name used with ufg": {skipEmit: true},

    // Support chrome emulations drivers:
    "check window fully on android chrome emulator on mobile page": {skipEmit: true},
    "check window fully on android chrome emulator on mobile page with horizontal scroll": {skipEmit: true},
    "check window fully on android chrome emulator on desktop page": {skipEmit: true},
    "should not fail if scroll root is stale on android": {skipEmit: true},
    
    "should send custom batch properties": {skipEmit: true},
}
