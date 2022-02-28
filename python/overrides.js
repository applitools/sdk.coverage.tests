module.exports = {
    // Failing checks
    'appium android check region with ignore region': {skip: true}, // new test error
    'appium android check window': {skip: true}, // new test error
    'appium iOS check region with ignore region': {skip: true}, // new test error
    'appium iOS check region': {config: {branchName: 'current_python'}}, // new test error ?!
    'appium iOS check window': {skip: true}, // new test error
    'check frame after manual switch to frame with css stitching classic': {skip: true}, // different frame scroll positions
    'check frame after manual switch to frame with scroll stitching classic': {skip: true}, // incorrect offsets and scrolling positions, missing parts
    'check frame after manual switch to frame with vg classic': {skip: true}, // first check captures default content instead of frame
    'check frame fully with css stitching': {config: {branchName: 'current_ruby'}}, // different font and border styles
    'check frame fully with vg': {skip: true},  // font rendering difference
    'check frame in frame fully with vg': {skip: true}, // new test error
    'check frame with css stitching': {skip: true}, // scrollbars are missing
    'check frame with scroll stitching classic': {skip: true},// scrollbars are missing
    'check frame with scroll stitching': {skip: true}, // scrollbars are missing
    'check frame with vg classic': {skip: true},  // default content is captured instead of a frame
    'check frame with vg': {skip: true}, // default content is captured instead of a frame
    'check region by coordinates in frame fully with vg': {skip: true},  // different region is captured
    'check region by coordinates in frame with css stitching': {skip: true}, // different size, offset, missing scrollbars
    'check region by coordinates in frame with scroll stitching': {skip: true}, // different size, offset, missing scrollbars
    'check region by coordinates in frame with vg': {skip: true}, // default content is captured instead of a frame
    'check region by native selector': {config: {branchName: 'current_python'}}, // new test error ?!
    'check region by selector after manual scroll with css stitching': {skip: true}, // only part of element is captured
    'check region by selector fully on page with sticky header with scroll stitching': {skip: true}, // repeated header is stitched in different position, both are ugly it's stitching algo difference
    'check region by selector fully with scroll stitching': {skip: true}, // bad stitching, incorrect region repeated
    'check region by selector in frame fully on firefox legacy': {skip: true}, // bad stitching, repeated 1st piece
    'check region by selector in frame fully with scroll stitching classic': {skip: true},  // bad stitching, repeated 1st piece
    'check region by selector in frame fully with scroll stitching': {skip: true}, // bad stitching, repeated 1st piece
    'check region by selector in frame in frame fully with scroll stitching': {skip: true}, // bad stitching, repeated 1st piece
    'check region by selector in frame multiple times with scroll stitching': {skip: true}, // bad stitching, repeated 1st piece
    'check region by selector in overflowed frame fully with css stitching': {skip: true},  // only part of the element is captured
    'check region by selector in overflowed frame fully with scroll stitching': {skip: true}, // only part of the region with wrong offset
    'check region in frame hidden under top bar fully with css stitching': {skip: true}, // transparent header is repeated over stitched image
    'check region in frame hidden under top bar fully with scroll stitching': {skip: true}, // slightly offsetted
    'check regions by coordinates in frame with vg': {skip: true}, // lots of white renders
    'check regions by coordinates in overflowed frame with vg': {skip: true}, // lots of white renders
    'check scrollable modal region by selector fully with css stitching': {skip: true}, // bad stitching, incorrect region repeated
    'check scrollable modal region by selector fully with scroll stitching': {skip: true}, // only piece is captured, incorrect offset
    'check window after manual scroll on safari 11': {skip: true}, // incorrect scroll position
    'check window after manual scroll with vg': {skip: true}, // whole page is rendered instead of viewport
    'check window fully and frame in frame fully with vg': {skip: true}, // default content is captured instead of a frame
    'check window fully on android chrome emulator on desktop page': {skip: true}, // incorrect pixel ratio when stitching
    'check window fully on page with sticky header with scroll stitching': {skip: true}, // repeated header is stitched in different position, both are ugly it's stitching algo difference
    'check window fully with custom scroll root with css stitching': {skip: true}, // one piece is captured instead of whole page
    'check window fully with fixed scroll root element': {config: {branchName: 'current_python'}}, // different chunks of stitching
    'check window on page with sticky header with vg': {skip: true}, // whole page is rendered instead of viewport
    'should hide and restore scrollbars with scroll stitching': {skip: true}, // bad stitching, repeated 1st piece
    'should send floating region by coordinates in frame with vg': {skip: true}, // default content is captured instead of a frame

    // SDK errors and failed assertions
    'check hovered region by element with css stitching': {skip: true}, // AttributeError: move_to requires a WebElement
    'check hovered region by element with scroll stitching': {skip: true}, // AttributeError: move_to requires a WebElement
    'check region by selector in frame fully with vg classic': {skip: true}, // Unable to locate element '#inner-frame-div'
    'check region by selector in frame fully with vg': {skip: true}, // Unable to locate element '#inner-frame-div'
    'check region by selector in overflowed frame after manual scroll with scroll stitching': {skip: true}, // OutOfBoundsError: Region [Region(20, 708, 450 x 282, CONTEXT_AS_IS)] is out of screenshot bounds [Region(0, 0, 700 x 460, SCREENSHOT_AS_IS)]
    'check region by selector in overflowed frame with scroll stitching': {skip: true}, // OutOfBoundsError: Region [Region(20, 708, 450 x 282, CONTEXT_AS_IS)] is out of screenshot bounds [Region(0, 0, 700 x 460, SCREENSHOT_AS_IS)]
    'check region by selector in overflowed frame with vg': {skip: true}, // Unable to locate element: {"method":"css selector","selector":"img"}
    'check regions by coordinates in frame with css stitching': {skip: true}, // Unable to locate element: {"method":"css selector","selector":"#modal2"}
    'check regions by coordinates in frame with scroll stitching': {skip: true}, // Unable to locate element: {"method":"css selector","selector":"#modal2"}
    'check regions by coordinates in overflowed frame with css stitching': {skip: true}, // Unable to locate element: "#modal3"
    'check regions by coordinates in overflowed frame with scroll stitching': {skip: true}, // Unable to locate element: "#modal3"
    'should hide and restore scrollbars with vg': {skip: true}, // Unable to locate element: {"method":"css selector","selector":"#inner-frame-div"}
    'should not fail if scroll root is stale on android': {skip: true}, // Couldn't set viewport size
    'should not send dom': {skip: true}, // info["actualAppOutput"][0]["image"]["hasDom"] == False,    assert True == False
    'should send accessibility regions by selector with css stitching': {skip: true}, //Index error. [imageMatchSettings][accessibility] is empty...
    'should send accessibility regions by selector with scroll stitching': {skip: true}, //Index error. [imageMatchSettings][accessibility] is empty...
    'should send custom batch properties': {skip: true}, // assert len(info["startInfo"]["batchInfo"]["properties"]) == 1, None  assert 0 == 1
    'should send dom on edge legacy': {skip: true}, // Couldn't set viewport size
    'should send dom on ie': {skip: true}, // assert info["actualAppOutput"][0]["image"]["hasDom"] == True   assert False == True
    'should set viewport size on edge legacy': {skip: true}, // EyesError: Failed to set the viewport size, 1px off

    // Test code errors
    'check window with layout breakpoints in config': {skip: true}, // incorrect test code
    'check window with layout breakpoints': {skip: true}, // incorrect test code
    'should extract text from regions': {skip: true},  // incorrect test code

    // Generation errors
    'adopted styleSheets on firefox': {skipEmit: true},
    'should handle check of stale element in frame if selector is preserved': {skipEmit: true},
    'should send dom and location when check frame fully with vg': {skipEmit: true},
    'should send dom and location when check frame fully': {skipEmit: true},
    'should send dom and location when check frame': {skipEmit: true},
    'should send dom and location when check region by selector fully with custom scroll root': {skipEmit: true},
    'should send dom and location when check region by selector fully with vg': {skipEmit: true},
    'should send dom and location when check region by selector fully': {skipEmit: true},
    'should send dom and location when check region by selector in frame with vg': {skipEmit: true},
    'should send dom and location when check region by selector in frame': {skipEmit: true},
    'should send dom and location when check region by selector with custom scroll root with vg': {skipEmit: true},
    'should send dom and location when check region by selector with custom scroll root': {skipEmit: true},
    'should send dom and location when check region by selector with vg': {skipEmit: true},
    'should send dom and location when check region by selector': {skipEmit: true},
    'should send dom and location when check window fully with vg': {skipEmit: true},
    'should send dom and location when check window fully': {skipEmit: true},
    'should send dom and location when check window with vg': {skipEmit: true},
    'should send dom and location when check window': {skipEmit: true},
    'should send dom of version 11': {skipEmit: true},
    'check region by selector within shadow dom with vg': {skipEmit: true},
  	'check region by element within shadow dom with vg': {skipEmit: true},
    'pageCoverage data is correct': {skipEmit: true},
    'pageCoverage data is correct with vg': {skipEmit: true},
    'AUTproxy should proxy resources test manually only': {skipEmit: true},
}
