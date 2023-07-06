module.exports = {
 
    // Relevant only for JS
    'should handle check of stale element if selector is preserved': { skipEmit: true },
    'should handle check of stale element in frame if selector is preserved': { skipEmit: true },
    
    // They are testing a functionality that no longer exists for the SDK
    'should return actual viewport size': { skipEmit: true },
    'should set viewport size': { skipEmit: true },
    'should set viewport size on edge legacy': { skipEmit: true },
    
    // Chrome emulator have minor diffs with JS sdk
    'should not fail if scroll root is stale on android': { config: { branchName: 'universal-dotnet' } },

    // WebDriver support removed
    'check window after manual scroll on safari 11': { skip: true },

    //
    // com.applitools.eyes.EyesException: unknown command: Cannot call non W3C standard command while in W3C mode
    // INFO: Detected dialect: W3C
    // coverage.generic.CheckWindowOnMobileWebAndroid
    // REQUEST: {"name":"EyesManager.openEyes","key":"6dba109a-d023-44ba-9466-83af1ff3a912","payload":{"manager":{"applitools-ref-id":"4e73260e-70b8-49aa-a5d2-369246ded3b3"},"driver":{"sessionId":"d723182048e34c089ced8392ed0717cd","serverUrl":"https://ondemand.saucelabs.com:443/wd/hub","capabilities":{"appActivity":"com.google.android.apps.chrome.Main","appPackage":"com.android.chrome","browserName":"chrome","databaseEnabled":false,"desired":{"sauce:options":{},"deviceName":"Google Pixel 3a XL GoogleAPI Emulator","orientation":"PORTRAIT","udid":"emulator-5554","noReset":true,"selenium:webdriver.remote.quietExceptions":false,"browserName":"chrome","noSign:noSign":true,"proxy":{"proxyAutoconfigUrl":"http://127.0.0.1:19876/pac.js","proxyType":"PAC"},"newCommandTimeout":0,"platformVersion":"10.0","platformName":"android","eventTimings":true,"maxTypingFrequency":8},"deviceApiLevel":29,"deviceManufacturer":"Google","deviceModel":"Android SDK built for x86_64","deviceName":"emulator-5554","deviceScreenDensity":400,"deviceScreenSize":"1080x2160","deviceUDID":"emulator-5554","eventTimings":true,"javascriptEnabled":true,"locationContextEnabled":false,"maxTypingFrequency":8,"networkConnectionEnabled":true,"newCommandTimeout":0,"noReset":true,"noSign:noSign":true,"orientation":"PORTRAIT","pixelRatio":2.5,"platform":"LINUX","platformName":"LINUX","platformVersion":"10","proxy":{"proxyType":"PAC","autodetect":false,"ftpProxy":null,"httpProxy":null,"noProxy":null,"sslProxy":null,"socksProxy":null,"socksVersion":null,"socksUsername":null,"socksPassword":null,"proxyAutoconfigUrl":"http://127.0.0.1:19876/pac.js"},"sauce:options":{},"selenium:webdriver.remote.quietExceptions":false,"statBarHeight":60,"takesScreenshot":true,"udid":"emulator-5554","viewportRect":{"width":1080,"top":60,"left":0,"height":1980},"warnings":{},"webStorageEnabled":false}},"config":{"debugScreenshots":{},"apiKey":"97ELuwdIiAilbeumIilysV8yY24tygCeRFFTYEBO7EfE110","serverUrl":"https://eyes.applitools.com/","appName":"Eyes Selenium SDK - Classic API","testName":"CheckWindowOnMobileWebAndroid","viewportSize":{"width":700,"height":460},"batch":{"id":"c9c27955-1d5c-4933-9987-a59fa35e0e85","name":"dotnet coverage tests","startedAt":"2022-03-13T18:32:03Z","notifyOnCompletion":false,"properties":[]},"defaultMatchSettings":{"matchLevel":"Strict","useDom":false,"enablePatterns":false,"ignoreCaret":false,"ignoreDisplacements":false},"branchName":"master","parentBranchName":"master","saveNewTests":false,"matchTimeout":0,"hideScrollbars":true,"hideCaret":true,"browsersInfo":[{"name":"chrome","width":700,"height":460}],"disabled":false}}}
    // RESPONSE: {"name":"EyesManager.openEyes","key":"6dba109a-d023-44ba-9466-83af1ff3a912","payload":{"error":{"message":"unknown command: Cannot call non W3C standard command while in W3C mode","stack":"#0 0x56477aac9199 <unknown>\n"}}}
    // REQUEST: {"name":"EyesManager.closeManager","key":"36cd5684-44c2-4b96-a217-803d1efc7981","payload":{"manager":{"applitools-ref-id":"4e73260e-70b8-49aa-a5d2-369246ded3b3"},"throwErr":false}}
    // RESPONSE: {"name":"EyesManager.closeManager","key":"36cd5684-44c2-4b96-a217-803d1efc7981","payload":{"result":{"results":[],"passed":0,"unresolved":0,"failed":0,"exceptions":0,"mismatches":0,"missing":0,"matches":0}}}
    'appium iOS check fully window with scroll and pageCoverage': { skipEmit: true },
    'appium iOS check window region with scroll and pageCoverage': { skipEmit: true },
    
    // still has visual diffs
    "check window fully on android chrome emulator on mobile page": {skipEmit: true},
    "check window fully on android chrome emulator on desktop page": {skipEmit: true},
    "check window fully on android chrome emulator on mobile page with horizontal scroll": {skipEmit: true},
    "should not fail if scroll root is stale on android": {skipEmit: true},
    
    // problems emitting (uncompilable code)
    "check window on mobile web ios": { skipEmit: true },
    "should extract text from regions": { skipEmit: true },
    "should extract text from regions without a hint": { skipEmit: true },
    "should extract text regions from image": { skipEmit: true },
    
    // problems emitting (wrong code)
    'check region by element within shadow dom': { skip: true },
    'check region by element within shadow dom with vg': { skip: true }
}
