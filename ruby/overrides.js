module.exports = {
    // fails in selenium4 only due to legacy driver being used
    'check window after manual scroll on safari 11': {skip: true},

    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    // Different ruby getAllTestResults returned value
    'should send agentRunId': {skip: true},
    'should abort after close': {skip: true},
    'should abort after close with vg': {skip: true},
	'should abort unclosed tests': {skip: true},
    'should abort unclosed tests with vg': {skip: true},
    'should return aborted tests in getAllTestResults': {skip: true},
    'should return aborted tests in getAllTestResults with vg': {skip: true},
    'should return browserInfo in getAllTestResults': {skip: true},

    "Should return exception in TestResultsSummary": {skipEmit: true},

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

    // Support removing duplicates: isAborted/error conflict
    "should support removal of duplicate test results with classic": {skipEmit: true},
    "should support removal of duplicate test results with ufg": {skipEmit: true},
    "should skip removal of duplicate test results when baseline name used with classic": {skipEmit: true},
    "should skip removal of duplicate test results when baseline name used with ufg": {skipEmit: true},

    // broken test
    // 'should send custom batch properties': {skip: true},

    'check window with reload layout breakpoints': {skipEmit: true},
    'check window with reload layout breakpoints in config': {skipEmit: true}
}
