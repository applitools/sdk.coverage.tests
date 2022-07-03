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
	'should abort unclosed tests': {skip: true},
    'should abort unclosed tests with vg': {skip: true},
    'should return aborted tests in getAllTestResults': {skip: true},
    'should return aborted tests in getAllTestResults with vg': {skip: true},
    'should return browserInfo in getAllTestResults': {skip: true},
    'should be empty if page delayed by 1500': {skip: true},

    "should return exception in TestResultsSummary": {skipEmit: true},
    // Universal server is still not latest for ruby
    "should send correct ignore region if page scrolled before check with css stitching": {skip: true},
    
    "should use regions padding": {skipEmit: true},
    "should use regions padding with vg": {skipEmit: true},
}
