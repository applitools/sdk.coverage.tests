module.exports = {
    'should handle check of stale element in frame if selector is preserved': {skipEmit: true, skip: true},
    'should extract text from regions': {skipEmit: true, skip: true},
    'check region by selector in frame multiple times with css stitching': {skip: true},		//problems in SDK to check multiple times
    'check region by selector in frame multiple times with scroll stitching': {skip: true},	//problems in SDK to check multiple times
    'check region by selector in overflowed frame with scroll stitching': {skip: true},	//OutOfBoundsError: Region [Region(20, 708, 450 x 282, CONTEXT_RELATIVE)] is out of screenshot bounds [Region(0, 0, 700 x 460, SCREENSHOT_AS_IS)]
    'check region by selector in overflowed frame with vg': {skip: true},		//Unable to locate element: {"method":"css selector","selector":"img"}
    'check frame after manual switch to frame with css stitching classic': {skip: true},		//Stale element, but with driver2 it works with diffs 
    'check frame after manual switch to frame with scroll stitching classic': {skip: true},	//Stale element, but with driver2 it works with diffs
    'check frame after manual switch to frame with vg': {skip: true},				//diffs
    'check region by native selector': {skip: true},				                //Will be implement in separate task
    'check region by selector in frame in frame fully with scroll stitching': {skip: true},	//diffs
    'check hovered region by element with css stitching': {skip: true},				//diffs
    'check hovered region by element with scroll stitching': {skip: true},			//OutOfBoundsError: Region [Region(67, 0, 191 x 29, CONTEXT_RELATIVE)] is out of screenshot bounds [Region(0, 0, 685 x 460, SCREENSHOT_AS_IS)]
    'check region by selector in overflowed frame after manual scroll with css stitching': {skip: true},	//Stale element
    'check region by selector in overflowed frame after manual scroll with scroll stitching': {skip: true},	//Stale element
    'check regions by coordinates in frame with css stitching': {skip: true},		//Unable to locate element: {"method":"css selector","selector":"#modal2"}
    'check regions by coordinates in frame with scroll stitching': {skip: true},		//Unable to locate element: {"method":"css selector","selector":"#modal2"}
    'check regions by coordinates in frame with vg': {skip: true},		//diffs
    'should find regions by visual locator ': {skip: true},		//Visual locators not implemented
    'should find regions by visual locator with vg': {skip: true},		//Visual locators not implemented
    'should not check if disabled': {skip: true},		//Unable to locate element: {"method":"css selector","selector":"[id="someId"]"}
    'should hide and restore scrollbars with scroll stitching': {skip: true},		//diff
    'should hide and restore scrollbars with vg': {skip: true},		// Unable to locate element: {"method":"css selector","selector":"#inner-frame-div"}
    'should send floating region by coordinates in frame with vg': {skip: true},		//diffs
    'should not send dom': {skip: true},		//diffs - info["actualAppOutput"][0]["image"]["hasDom"] == False,    assert True == False
    'should send dom on ie': {skip: true},		//diffs - assert info["actualAppOutput"][0]["image"]["hasDom"] == True   assert False == True
    'should send dom on edge legacy': {skip: true},		//eyes.open(driver)   -  EyesError: eyes.open_base() failed
    'should set viewport size on edge legacy': {skip: true},		//EyesError: Failed to set the viewport size
}
