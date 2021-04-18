module.exports = {
    // JS specific, no need to implement in java
    'should return test results from close with passed classic test': {skipEmit: true}, // skipped
    'should return test results from close with passed vg test': {skipEmit: true}, //   cause
    'should return test results from close with failed classic test': {skipEmit: true}, // tests
    'should return test results from close with failed vg test': {skipEmit: true}, // JS specific
    'should handle check of stale element in frame if selector is preserved': {skipEmit: true}, // Not implemented yet
    // window
    'check window fully with fixed scroll root element': {config: {branchName: 'current1'}}, // diffs if compare to common baseline
    // region
    'check hovered region by element with css stitching': {config: {branchName: 'current1'}}, // diffs if compare to common baseline
    // frame
    'appium android check window': {skip: true}, //wrong ignore region ticket 2396
    'appium android check region with ignore region': {skip: true}, //wrong ignore region region ticket 2396
    'appium iOS check region with ignore region': {skip: true}, //wrong ignore region region ticket 2396

    'should send dom and location when check window': {skipEmit: true},
    'should send dom and location when check window with vg': {skipEmit: true},
    'should send dom and location when check window fully': {skipEmit: true},
    'should send dom and location when check window fully with vg': {skipEmit: true},
    'should send dom and location when check frame': {skipEmit: true},
    'should send dom and location when check frame with vg': {skipEmit: true},
    'should send dom and location when check frame fully': {skipEmit: true},
    'should send dom and location when check frame fully with vg': {skip: true}, // not supported by ufg
    'should send dom and location when check region by selector': {skipEmit: true},
    'should send dom and location when check region by selector with vg': {skipEmit: true},
    'should send dom and location when check region by selector fully': {skipEmit: true},
    'should send dom and location when check region by selector fully with vg': {skipEmit: true},
    'should send dom and location when check region by selector in frame': {skipEmit: true},
    'should send dom and location when check region by selector in frame with vg': {skip: true}, // not supported by ufg
    'should send dom and location when check region by selector with custom scroll root': {skipEmit: true},
    'should send dom and location when check region by selector with custom scroll root with vg': {skipEmit: true},
    'should send dom and location when check region by selector fully with custom scroll root': {skipEmit: true},
    'should send dom and location when check region by selector fully with custom scroll root with vg': {skipEmit: true},
    'should send dom of version 11': {skipEmit: true},
    'should not fail if scroll root is stale on android': {skipEmit: true},
    'check region by selector in frame fully on firefox legacy': { skipEmit: true },
    'adopted styleSheets on chrome': {skipEmit: true},
	'adopted styleSheets on firefox': {skipEmit: true},
}
