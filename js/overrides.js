module.exports = {
    /**
     *  Fails because of the difference between SCREEN SIZE and LAYOUT VIEWPORT SIZE.
     *  We should use screen.width/screen.height for cropping/scaling and innerWidth/innerHeight to understand element location related to the viewport
     */
    'check region in frame hidden under top bar fully with css stitching': {skip: true},
    'check region in frame hidden under top bar fully with scroll stitching': {skip: true},
    // Rendered image isn't fully
    'check frame fully with vg': {skip: true},
    /// Updating baselines to JS
    // Window
    'check window fully on android chrome emulator on desktop page': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check window fully on page with sticky header with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check window two times with vg classic': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check window with vg classic': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check window with vg': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check window fully and frame in frame fully with css stitching': {config: {branchName: 'universal-sdk'}}, // was v2
    'check window fully and frame in frame fully with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was v2
    'check window fully and frame in frame fully with vg': {config: {branchName: 'universal-sdk'}}, // was v2
    'check window fully with custom scroll root with css stitching': {config: {branchName: 'universal-sdk'}}, // was v2
    // Region
    'check region by selector fully on page with sticky header with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check region by coordinates in frame with css stitching': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check region by coordinates in frame with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check overflowed region by coordinates with css stitching': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check overflowed region by coordinates with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check regions by coordinates in overflowed frame with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was next
    'check region by selector with vg classic': {config: {branchName: 'universal-sdk'}}, // was no-fully-by-default
    // Frame
    'check frame in frame fully with css stitching': {config: {branchName: 'universal-sdk'}}, // was v1
    'check frame in frame fully with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was v1
    'check frame in frame fully with vg': {config: {branchName: 'universal-sdk'}}, // was v1
    'check frame with vg': {config: {branchName: 'universal-sdk'}}, // was v2 and skipped
    'check frame fully with css stitching': {config: {branchName: 'universal-sdk'}}, // was skipped
    'check frame with css stitching': {config: {branchName: 'universal-sdk'}}, // was v2 and skipped
    'check frame with scroll stitching': {config: {branchName: 'universal-sdk'}}, // was v2
    'check frame after manual switch to frame with vg classic': {config: {branchName: 'universal-sdk'}}, // was no-fully-by-default
    // Assertion
    'should send floating region by selector with vg': {config: {branchName: 'universal-sdk'}}, // was skipped
    'should send ignore region by selector with vg': {config: {branchName: 'universal-sdk'}}, // was skipped
    'should send floating region by coordinates with vg': {config: {branchName: 'universal-sdk'}}, // was skipped
    'should send accessibility regions by selector with vg': {config: {branchName: 'universal-sdk'}}, // was v1
}
