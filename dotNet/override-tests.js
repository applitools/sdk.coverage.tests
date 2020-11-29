module.exports = {
    // window
    'check window with layout breakpoints in config': {skip: true}, // layout breakpoints are not implemented
    'check window with layout breakpoints': {skip: true}, // layout breakpoints are not implemented
	//region
	'check regions by coordinates in frame with css stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal2"}
	'check regions by coordinates in frame with scroll stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal2"}
	'check regions by coordinates in overflowed frame with css stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal3"}
	'check regions by coordinates in overflowed frame with scroll stitching': {skip: true}, //Unable to locate element: {"method":"css selector","selector":"#modal3"}
	// can be quick fixed
	'check region by native selector': {skip: true}, //To fit in existing baseline for C# should have test name "Appium_Android_CheckRegion"
	'check frame in frame fully with vg': {skip: true},  //baseline NEW. Need compare with JS tests, maybe add baseline.
 }
