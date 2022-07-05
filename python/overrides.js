module.exports = {
    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    "should return exception in TestResultsSummary": {skipEmit: true},
    
    "should use regions padding": {skipEmit: true},
    "should use regions padding with vg": {skipEmit: true},

    "should send codded regions with region id": {skipEmit: true},
    "should send codded regions with region id with vg": {skipEmit: true},
}
