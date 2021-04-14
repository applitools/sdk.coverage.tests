module.exports = {
    'should handle check of stale element in frame if selector is preserved': {skipEmit: true, skip: true},
    'should extract text from regions': {skipEmit: true, skip: true},
    'should extract text regions from image': {skipEmit: true}, // Not implemented yet
    'check hovered region by element with css stitching': {config: {branchName: 'current_python'}}, // diffs if compare to common baseline
    'check window fully with fixed scroll root element': {config: {branchName: 'current_python'}}, // diffs if compare to common baseline							//diffs
    'should send dom of version 11': {skipEmit: true},
    'appium android check window': {skip: true},						//assertion for ignored region fails
    'appium android check region with ignore region': {skip: true},				//assertion for ignored region fails
    'appium iOS check window': {skip: true},							//assertion for ignored region fails
    'appium iOS check region with ignore region': {skip: true},					//assertion for ignored region fails
    'appium iOS check region': {skip: true},							//wrong  scale
    'should not fail if scroll root is stale on android': {skipEmit: true},
    'check region by selector in frame fully on firefox legacy': { skipEmit: true },
    'should send custom batch properties': {skipEmit: true},
    'adopted styleSheets on chrome': {skipEmit: true},
	'adopted styleSheets on firefox': {skipEmit: true},
}
