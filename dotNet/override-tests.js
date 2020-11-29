module.exports = {
    // window
    'check window with layout breakpoints in config': {skip: true}, // layout breakpoints are not implemented
    'check window with layout breakpoints': {skip: true}, // layout breakpoints are not implemented
	'check window fully on page with sticky header with css stitching': {skip: true},   //diff
	'check window fully on page with sticky header with scroll stitching': {skip: true},   //diff
	'check window fully with fixed scroll root element': {skip: true},   //diff
	'check window on page with sticky header with vg': {skip: true},   //diff
	//region
	'check regions by coordinates in frame with css stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal2"}
	'check regions by coordinates in frame with scroll stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal2"}
	'check regions by coordinates in overflowed frame with css stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal3"}
	'check regions by coordinates in overflowed frame with scroll stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal3"}
	'should find regions by visual locator': {skip: true}, //VisualLocators are not implemented in DotNet SDK
	'should find regions by visual locator with vg': {skip: true}, //VisualLocators are not implemented in DotNet SDK
	'check region by selector fully on page with sticky header with css stitching': {skip: true},   //diff
	'check region by selector fully on page with sticky header with scroll stitching': {skip: true},   //diff
	'check region by selector on page with sticky header with css stitching': {skip: true},   //diff
	'check region by selector on page with sticky header with scroll stitching': {skip: true},   //diff
	'check window after manual scroll with vg': {skip: true},   //diff
	'check window after manual scroll on safari 12': {skip: true},   //diff
	'should send accessibility regions by selector with css stitching': {skip: true},   //actual region AccessibilityRegionByRectangle (10, 286) 285x165 - LargeText not found in expected regions list. - It's other regions in original specific test TestAccessibilityRegions for CSS and Scroll
	'should send accessibility regions by selector with scroll stitching': {skip: true},   //actual region AccessibilityRegionByRectangle (10, 286) 285x165 - LargeText not found in expected regions list. - It's other regions in original specific test TestAccessibilityRegions for CSS and Scroll
	'should send ignore regions by selector with css stitching': {skip: true},   //actual Region region (10, 286) 285x165 not found in expected regions list.   It's other regions in original specific test TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent for CSS and Scroll
	'should send ignore regions by selector with scroll stitching': {skip: true},   //actual Region region (10, 286) 285x165 not found in expected regions list.   It's other regions in original specific test TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent for CSS and Scroll
	//frame
	'check frame after manual switch to frame with vg classic': {skip: true},   //diff
	'check frame fully with css stitching': {skip: true},   //diff
	'check frame fully with vg': {skip: true},   //diff
	'check region by selector in overflowed frame after manual scroll with scroll stitching': {skip: true},   //diff
	'check region by selector in overflowed frame fully with css stitching': {skip: true},   //diff
	'check region by selector in overflowed frame fully with scroll stitching': {skip: true},   //diff
	//unknown issue
	'check window after manual scroll on safari 11': {skip: true},   //NoSuchWindowException : A request to use a window could not be satisfied because the window could not be found
	// can be quick fixed
	'check region by native selector': {skip: true}, //To fit in existing baseline for C# should have test name "Appium_Android_CheckRegion"
	'check frame in frame fully with vg': {skip: true},  //baseline NEW. Need compare with JS tests, maybe add baseline.
 }
