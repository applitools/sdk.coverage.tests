module.exports = {
	// api
	'should throw if no checkpoints before close' : { skip: true }, // where did this requirement come from?
	// window
	//'check window with layout breakpoints in config': { skip: true }, // layout breakpoints are not implemented
	//'check window with layout breakpoints': { skip: true }, // layout breakpoints are not implemented
	//region
	'should find regions by visual locator': { skip: true }, //VisualLocators are not implemented in DotNet SDK
	'should find regions by visual locator with vg': { skip: true }, //VisualLocators are not implemented in DotNet SDK
	//frame
	//unknown issue
	'should extract text from regions': { skipEmit: true },   //test not implemented yet. It exists for JS only now
	'should extract text regions from image': {skipEmit: true},   // Not implemented yet
	// can be quick fixed
	'check region by native selector': { skip: true }, //To fit in existing baseline for C# should have test name "Appium_Android_CheckRegion"
	// check many
	'acme login with css stitching': { skip: true }, // original test tested fluent API's check many. This test doesn't.
	'acme login with scroll stitching': { skip: true }, // original test tested fluent API's check many. This test doesn't.
	'acme login with vg': { skip: true }, // original test tested fluent API's check many. This test doesn't.
	// location
	// 'should send dom and location when check window': { skipEmit: true },
	'should send dom and location when check window with vg': { skipEmit: true },
	// 'should send dom and location when check window fully': { skipEmit: true },
	// 'should send dom and location when check window fully with vg': { skipEmit: true },
	// 'should send dom and location when check frame': { skipEmit: true },
	// 'should send dom and location when check frame with vg': { skipEmit: true },
	// 'should send dom and location when check frame fully': { skipEmit: true },
	// 'should send dom and location when check frame fully with vg': { skipEmit: true },
	// 'should send dom and location when check region by selector': { skipEmit: true },
	// 'should send dom and location when check region by selector with vg': { skipEmit: true },
	// 'should send dom and location when check region by selector fully': { skipEmit: true },
	// 'should send dom and location when check region by selector fully with vg': { skipEmit: true },
	//'should send dom and location when check region by selector in frame': { skipEmit: true },
	// 'should send dom and location when check region by selector with custom scroll root': { skipEmit: true },
	// 'should send dom and location when check region by selector with custom scroll root with vg': { skipEmit: true },
  'should send dom and location when check region by selector fully with custom scroll root': { skipEmit: true }, // test is wrong!
	'should send dom and location when check region by selector fully with custom scroll root with vg': { skipEmit: true }, // test is wrong!
	// 'should send dom of version 11': { skipEmit: true },
	'should not fail if scroll root is stale on android': {skipEmit: true},
	'check region by selector in frame fully on firefox legacy': { skipEmit: true },
	'should send custom batch properties': {skipEmit: true},
	'adopted styleSheets on chrome': {skipEmit: true},
	'adopted styleSheets on firefox': {skipEmit: true},
}
