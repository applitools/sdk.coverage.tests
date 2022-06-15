module.exports = {
    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    "Should return exception in TestResultsSummary": {skipEmit: true},

    // lazyload tests (api change needed in check settings to support it)
    'lazy load page with one option specified maxAmountToScroll': {skipEmit: true},
    'lazy load page with one option specified maxAmountToScroll with vg': {skipEmit: true},
    'lazy load page with one option specified waitingTime': {skipEmit: true},
    'lazy load page with one option specified waitingTime with vg': {skipEmit: true},
    'lazy load page with one option specified scrollLength': {skipEmit: true},
    'lazy load page with one option specified scrollLength with vg': {skipEmit: true},
    'lazy load page with all options specified': {skipEmit: true},
    'lazy load page with all options specified with vg': {skipEmit: true},
    'lazy load page with default options': {skipEmit: true},
    'lazy load page with default options with vg': {skipEmit: true},

    'should use regions padding': { skipEmit: true },
    'should use regions padding with vg': { skipEmit: true },
}
