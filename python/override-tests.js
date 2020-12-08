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
}
