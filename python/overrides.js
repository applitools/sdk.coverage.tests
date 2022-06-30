module.exports = {
    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    "Should return exception in TestResultsSummary": {skipEmit: true},
    
    "should use regions padding": {skipEmit: true},
    "should use regions padding with vg": {skipEmit: true},

    "regionId can be specified as part of checkSettings classic": {skipEmit: true},
    "regionId can be specified as part of checkSettings with vg": {skipEmit: true},
    "coded regions with selectors or elements should automatically include a regionId classic": {skipEmit: true},
    "coded regions with selectors or elements should automatically include a regionId with vg": {skipEmit: true},
}
