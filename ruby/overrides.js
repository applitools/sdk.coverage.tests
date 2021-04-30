module.exports = {
    'should extract text from regions': {skipEmit: true}, // Not implemented yet
    'should extract text regions from image': {skipEmit: true}, // Not implemented yet
    // Appium test need a lot of fixes before run
    'check region by native selector': {skipEmit: true},
    'appium android check window': {skipEmit: true},
    'appium android check region with ignore region': {skipEmit: true},
    'appium android check region': {skipEmit: true},
    'appium iOS check window': {skipEmit: true},
    'appium iOS check region with ignore region': {skipEmit: true},
    'appium iOS check region': {skipEmit: true},

    // Visual locator not implemented feature
    // dom location block
    'should send dom and location when check window': {skipEmit: true},
    'should send dom and location when check window with vg': {skipEmit: true},
    'should send dom and location when check window fully': {skipEmit: true},
    'should send dom and location when check window fully with vg': {skipEmit: true},
    'should send dom and location when check frame': {skipEmit: true},
    'should send dom and location when check frame fully': {skipEmit: true},
    'should send dom and location when check region by selector': {skipEmit: true},
    'should send dom and location when check region by selector with vg': {skipEmit: true},
    'should send dom and location when check region by selector fully': {skipEmit: true},
    'should send dom and location when check region by selector fully with vg': {skipEmit: true},
    'should send dom and location when check region by selector in frame': {skipEmit: true},
    'should send dom and location when check region by selector with custom scroll root': {skipEmit: true},
    'should send dom and location when check region by selector with custom scroll root with vg': {skipEmit: true},
    'should send dom and location when check region by selector fully with custom scroll root': {skipEmit: true},
    // Missing (Or I could find a scroll root option)
    'check region by selector in overflowed frame fully with css stitching': {skipEmit: true},
    'check region by selector in overflowed frame fully with scroll stitching': {skipEmit: true},
    'check regions by coordinates in frame with css stitching': {skipEmit: true},
    'check regions by coordinates in frame with scroll stitching': {skipEmit: true},
    'check regions by coordinates in frame with vg': {skipEmit: true},
    'check regions by coordinates in overflowed frame with css stitching': {skipEmit: true},
    'check regions by coordinates in overflowed frame with scroll stitching': {skipEmit: true},
    'check window fully with custom scroll root with css stitching': {skipEmit: true},
    'check window fully with custom scroll root with scroll stitching': {skipEmit: true},
    'check window fully with custom scroll root with vg': {skipEmit: true},
    'check window fully with wrong scroll root with css stitching': {skipEmit: true},
    'check window fully with wrong scroll root with scroll stitching': {skipEmit: true},
    'check window fully with wrong scroll root with vg': {skipEmit: true},
    'check window fully with fixed scroll root element': {skipEmit: true},
    'check modal region by selector fully with css stitching': {skipEmit: true},
    'check modal region by selector fully with scroll stitching': {skipEmit: true},
    'check scrollable modal region by selector fully with css stitching': {skipEmit: true},
    'check scrollable modal region by selector fully with scroll stitching': {skipEmit: true},
    'check scrollable modal region by selector fully with vg': {skipEmit: true},
    'check regions by coordinates in overflowed frame with vg': {skipEmit: true},
    'check window fully with html scrollRootElement after scroll with css stitching': {skipEmit: true},
    'check window fully with html scrollRootElement after scroll with scroll stitching': {skipEmit: true},
    // Not implemented layout breakpoints
    'check window with layout breakpoints': {skipEmit: true},
    'check window with layout breakpoints in config': {skipEmit: true},
    // Set_viewport_size method should work without Eyes instance
    // Chrome emulator have wrong type of browser used
    'check window fully on android chrome emulator on mobile page': {skipEmit: true},
    'check window fully on android chrome emulator on mobile page with horizontal scroll': {skipEmit: true},
    'check window fully on android chrome emulator on desktop page': {skipEmit: true},

    // Diffs
    'check region by selector after manual scroll with scroll stitching': {config: {branchName: 'current_ruby'}}, // diffs if compare to common baseline
    'check frame fully with css stitching': {config: {branchName: 'current_ruby'}}, // diffs if compare to common baseline

    // A bug in the full page algorithm to fix
    'check window fully with html scrollRootElement after scroll when fail to scroll with scroll stitching': {skipEmit: true},
    'check window fully with html scrollRootElement after scroll when fail to scroll with css stitching': {skipEmit: true},
    'should not fail if scroll root is stale on android': {skipEmit: true},
    'check region by selector in frame fully on firefox legacy': { skipEmit: true },
    'adopted styleSheets on chrome': {skipEmit: true},
	'adopted styleSheets on firefox': {skipEmit: true},
    'variant id': {skipEmit: true},
	'variant id with vg': {skipEmit: true},
    // Scroll root option not implemented in the ruby SDK
    'should send dom and location when check region by selector fully with custom scroll root with vg': {skipEmit: true},
}
