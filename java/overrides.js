module.exports = {
    // Failed to generate
    // 'should not fail if scroll root is stale on android': {skipEmit: true},
    // 'check region by selector in frame fully on firefox legacy': { skipEmit: true },


    // Python like
    // fails in selenium4 only due to legacy driver being used
    'check window after manual scroll on safari 11': {skip: true},

    // Shadow emitter not implemented
    'check region by selector within shadow dom with vg': {skipEmit: true},
    'check region by element within shadow dom with vg': {skipEmit: true},

    // Feature not present in Selenium
    'should handle check of stale element if selector is preserved': {skip: true}, // Not implemented yet
    'should handle check of stale element in frame if selector is preserved': {skip: true}, // Not implemented yet

    // They are testing a functionality that no longer exists for the SDK
    'should return actual viewport size': {skip: true},
    'should set viewport size': {skip: true},
    'should set viewport size on edge legacy': {skip: true},

    // Chrome emulator have minor diffs with JS sdk
    'should not fail if scroll root is stale on android': {config: {branchName: 'universal-java'}},
    'check window fully on android chrome emulator on mobile page': {config: {branchName: 'universal-java'}},
    'should abort after close': {skipEmit: true},
    'should abort unclosed tests': {skipEmit: true},
    'should abort unclosed tests with vg': {skipEmit: true},
    'should return aborted tests in getAllTestResults': {skipEmit: true},
    'should return aborted tests in getAllTestResults with vg': {skipEmit: true},
    'should return browserInfo in getAllTestResults': {skipEmit: true},
    
    // TODO - recheck Chrome emulator flaky test (was overridden by a specific branch, maybe default will work).
    'check window fully on android chrome emulator on mobile page with horizontal scroll': {skip: true},

    // New mobile web tests which is failing on the eyes.Open() with the error
    //
    // com.applitools.eyes.EyesException: unknown command: Cannot call non W3C standard command while in W3C mode
    // INFO: Detected dialect: W3C
    // coverage.generic.CheckWindowOnMobileWebAndroid
    // REQUEST: {"name":"EyesManager.openEyes","key":"6dba109a-d023-44ba-9466-83af1ff3a912","payload":{"manager":{"applitools-ref-id":"4e73260e-70b8-49aa-a5d2-369246ded3b3"},"driver":{"sessionId":"d723182048e34c089ced8392ed0717cd","serverUrl":"https://ondemand.saucelabs.com:443/wd/hub","capabilities":{"appActivity":"com.google.android.apps.chrome.Main","appPackage":"com.android.chrome","browserName":"chrome","databaseEnabled":false,"desired":{"sauce:options":{},"deviceName":"Google Pixel 3a XL GoogleAPI Emulator","orientation":"PORTRAIT","udid":"emulator-5554","noReset":true,"selenium:webdriver.remote.quietExceptions":false,"browserName":"chrome","noSign:noSign":true,"proxy":{"proxyAutoconfigUrl":"http://127.0.0.1:19876/pac.js","proxyType":"PAC"},"newCommandTimeout":0,"platformVersion":"10.0","platformName":"android","eventTimings":true,"maxTypingFrequency":8},"deviceApiLevel":29,"deviceManufacturer":"Google","deviceModel":"Android SDK built for x86_64","deviceName":"emulator-5554","deviceScreenDensity":400,"deviceScreenSize":"1080x2160","deviceUDID":"emulator-5554","eventTimings":true,"javascriptEnabled":true,"locationContextEnabled":false,"maxTypingFrequency":8,"networkConnectionEnabled":true,"newCommandTimeout":0,"noReset":true,"noSign:noSign":true,"orientation":"PORTRAIT","pixelRatio":2.5,"platform":"LINUX","platformName":"LINUX","platformVersion":"10","proxy":{"proxyType":"PAC","autodetect":false,"ftpProxy":null,"httpProxy":null,"noProxy":null,"sslProxy":null,"socksProxy":null,"socksVersion":null,"socksUsername":null,"socksPassword":null,"proxyAutoconfigUrl":"http://127.0.0.1:19876/pac.js"},"sauce:options":{},"selenium:webdriver.remote.quietExceptions":false,"statBarHeight":60,"takesScreenshot":true,"udid":"emulator-5554","viewportRect":{"width":1080,"top":60,"left":0,"height":1980},"warnings":{},"webStorageEnabled":false}},"config":{"debugScreenshots":{},"apiKey":"97ELuwdIiAilbeumIilysV8yY24tygCeRFFTYEBO7EfE110","serverUrl":"https://eyes.applitools.com/","appName":"Eyes Selenium SDK - Classic API","testName":"CheckWindowOnMobileWebAndroid","viewportSize":{"width":700,"height":460},"batch":{"id":"c9c27955-1d5c-4933-9987-a59fa35e0e85","name":"JAVA coverage tests","startedAt":"2022-03-13T18:32:03Z","notifyOnCompletion":false,"properties":[]},"defaultMatchSettings":{"matchLevel":"Strict","useDom":false,"enablePatterns":false,"ignoreCaret":false,"ignoreDisplacements":false},"branchName":"master","parentBranchName":"master","saveNewTests":false,"matchTimeout":0,"hideScrollbars":true,"hideCaret":true,"browsersInfo":[{"name":"chrome","width":700,"height":460}],"disabled":false}}}
    // RESPONSE: {"name":"EyesManager.openEyes","key":"6dba109a-d023-44ba-9466-83af1ff3a912","payload":{"error":{"message":"unknown command: Cannot call non W3C standard command while in W3C mode","stack":"#0 0x56477aac9199 <unknown>\n"}}}
    // REQUEST: {"name":"EyesManager.closeManager","key":"36cd5684-44c2-4b96-a217-803d1efc7981","payload":{"manager":{"applitools-ref-id":"4e73260e-70b8-49aa-a5d2-369246ded3b3"},"throwErr":false}}
    // RESPONSE: {"name":"EyesManager.closeManager","key":"36cd5684-44c2-4b96-a217-803d1efc7981","payload":{"result":{"results":[],"passed":0,"unresolved":0,"failed":0,"exceptions":0,"mismatches":0,"missing":0,"matches":0}}}
    'check window on mobile web android': {skip: true},
    'appium iOS check fully window with scroll and pageCoverage': { skipEmit: true },
    'appium iOS check window region with scroll and pageCoverage': { skipEmit: true },
      
    // TODO verify and enable
    'should send agentRunId': {skipEmit: true},
    "appium iOS nav bar check regio": {skipEmit: true},
    "should return exception in TestResultsSummary": {skipEmit: true},
    
    // TODO Failed and needs to be re-checked.
    'appium iOS nav bar check region': {skip: true},
    "appium android landscape mode check window": {skip: true},
    "appium android landscape mode check region": {skip: true},
    
    
    // Emitter failure
    "appium android landscape mode check region on android 10": {skipEmit: true},
    "appium android landscape mode check region on android 7": {skipEmit: true},
    "appium android landscape mode check window on android 10": {skipEmit: true},
    "appium android landscape mode check window on android 7": {skipEmit: true},
    "should work with beforeCaptureScreenshot hook": {skip: true},
    "should override default value of fully with true": {skipEmit: true},
    "should override default value of fully with false": {skipEmit: true},

    // lazyload tests (api change needed in check settings to support it)
    'lazy load page with one option specified maxAmountToScroll': {skipEmit: true},
    'lazy load page with one option specified maxAmountToScroll with vg': {skipEmit: true},
    'lazy load page with one option specified waitingTime': {skipEmit: true},
    'lazy load page with one option specified waitingTime with vg': {skipEmit: true},
    'lazy load page with one option specified scrollLength': {skipEmit: true},
    'lazy load page with one option specified scrollLength with vg': {skipEmit: true},
    'lazy load page with all options specified': {skipEmit: true},
    'lazy load page with all options specified with vg': {skipEmit: true},
    'lazy load page with default options': {skipEmit: true},
    'lazy load page with default options with vg': {skipEmit: true},

     "should use regions padding": {skipEmit: true},
     "should use regions padding with vg": {skipEmit: true},

    "should send codded regions with region id": {skipEmit: true},
    "should send codded regions with region id with vg": {skipEmit: true},
    "should send codded regions with padding": {skipEmit: true},
    "should send codded regions with padding with vg": {skipEmit: true}
    
}
