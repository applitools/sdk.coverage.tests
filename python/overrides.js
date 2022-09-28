module.exports = {
    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    "Should return exception in TestResultsSummary": {skipEmit: true},

    // need to add support for the webview property in check settings to the emitter
    "should capture webview when specified in check settings on ios": {skipEmit: true},
    "should capture webview when specified in check settings on android": {skipEmit: true}
}
