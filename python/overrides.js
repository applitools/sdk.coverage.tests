module.exports = {
    // fails in selenium4 only due to legacy driver being used
    'check window after manual scroll on safari 11': {skip: true},

    // fails on chrome>=96
    'check region by element within shadow dom with vg': {skip: true},

    // Stale element are not handled by python binding
    'should handle check of stale element if selector is preserved': {skip: true},
    'should handle check of stale element in frame if selector is preserved': {skip: true},

    // Failing on the universal server 1.10 and lower
    // check on new universal server version
    "check window on mobile web android": {skip: true},

    'should be empty if page delayed by 1500': { skipEmit: true },

    // TODO verify and enable
    'appium iOS check fully window with scroll and pageCoverage': { skipEmit: true },
    'appium iOS check window region with scroll and pageCoverage': { skipEmit: true },
    "appium android landscape mode check window on android 7": {skipEmit: true},
    "appium android landscape mode check window on android 10": {skipEmit: true},
    "appium android landscape mode check region on android 7": {skipEmit: true},
    "appium android landscape mode check region on andorid 10": {skipEmit: true},
}
