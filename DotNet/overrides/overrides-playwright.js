module.exports = {
    
    // not available in chrome > 96(will be avalable on slenium v4)
    // 'check region by selector within shadow dom with vg': { skipEmit: true },
    // "check region by element within shadow dom with vg": { skipEmit: true },

    // Feature not present
    'should handle check of stale element if selector is preserved': { skipEmit: true },
    'should handle check of stale element in frame if selector is preserved': { skipEmit: true }, 
    "check window after manual scroll on safari 11": { skipEmit: true },

    // Functionality no longer exists in the SDK.
    'should return actual viewport size': { skipEmit: true },
    'should set viewport size': { skipEmit: true },
    'should set viewport size on edge legacy': { skipEmit: true },
    "should override default value of fully with true": { skipEmit: true },
    "should override default value of fully with false": { skipEmit: true },

    // TODO verify and enable
    "Should return exception in TestResultsSummary": { skipEmit: true },

    // not in ./mapping/supported.js -> TAGS 
    "should send dom on ie": {skipEmit: true}, // "ie"
    "check region by selector on ie": {skipEmit: true}, // "ie"
    "should send dom on edge legacy": {skipEmit: true}, // "edge"
    "check frame after manual switch to frame with css stitching classic": {skipEmit: true}, // "webdriver"
    "check frame after manual switch to frame with scroll stitching classic": {skipEmit: true}, // "webdriver"
    "check region by selector in overflowed frame after manual scroll with css stitching": {skipEmit: true}, // "webdriver"
    "check region by selector in overflowed frame after manual scroll with scroll stitching": {skipEmit: true}, // "webdriver"
    "check window after manual scroll on safari 12": {skipEmit: true}, // "webdriver"
    "should fail check of stale element": {skipEmit: true}, // "webdriver"

    // server response has null properties
    'should send custom batch properties': {skip: true},
    
}
