module.exports = {
 
    // Relevant only for JS
    'should handle check of stale element if selector is preserved': { skipEmit: true },
    'should handle check of stale element in frame if selector is preserved': { skipEmit: true },
    
    // They are testing a functionality that no longer exists for the SDK
    'should return actual viewport size': { skipEmit: true },
    'should set viewport size': { skipEmit: true },
    'should set viewport size on edge legacy': { skipEmit: true },
   
    // WebDriver support removed
    'check window after manual scroll on safari 11': { skip: true },

    // problems emitting (emitter throws error)
    "check window on mobile web ios": { skipEmit: true },

    // returns a new baseline for some reason
    "check window on mobile web android": { skip: true }
}
