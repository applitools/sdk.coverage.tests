module.exports = {
    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},
    
    // 100% broken since Apr 10, 2023, was flaky 5 days before
    'should send custom batch properties': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    "Should return exception in TestResultsSummary": {skipEmit: true},

    // Support removing duplicates:
    // TODO: update the emitter to support passing the new runner option `removeDuplicateTestsPerBatch`
    "should support removal of duplicate test results with classic": {skipEmit: true},
    "should support removal of duplicate test results with ufg": {skipEmit: true},
    "should skip removal of duplicate test results when baseline name used with classic": {skipEmit: true},
    "should skip removal of duplicate test results when baseline name used with ufg": {skipEmit: true},
}
