/* eslint-disable */
const viewportSize = {width: 700, height: 460}
const TYPE = {
  CSS: `css`, // in the selenium api it's 'css selector'
  CLASSNAME: 'class name',
  ID: 'id',
  XPATH: 'xpath',
  NAME: 'name',
  ACCESSIBILITY_ID: 'accessibility id',
  ANDROID_UI_AUTOMATOR: '-android uiautomator',
  IOS_PREDICATE: '-ios predicate string',
  IOS_CLASS_CHAIN: '-ios class chain',
}
config({
  pages: {
    Default: 'https://applitools.github.io/demo/TestPages/FramesTestPage/',
    StickyHeader: 'https://applitools.github.io/demo/TestPages/PageWithHeader/index.html',
    Wix: 'https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html',
    ScrollableBody: 'https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html',
    Simple: 'https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html',
    FixedRegion: 'http://applitools.github.io/demo/TestPages/fixed-position',
    Modals: 'https://applitools.github.io/demo/TestPages/ModalsPage/index.html',
    HorizontalScroll: 'https://applitools.github.io/demo/TestPages/horizontal-scroll.html',
    BurgerMenu: 'http://applitools.github.io/demo/TestPages/PageWithBurgerMenu',
    FractionalMetric: 'https://applitools.github.io/demo/TestPages/FractionalMetrics',
    FrameLargerThenViewport: 'https://applitools.github.io/demo/TestPages/OutOfViewport/',
    StickyHeaderWithRegions: 'https://applitools.github.io/demo/TestPages/StickyHeaderWithRegions',
    JsLayout: 'https://applitools.github.io/demo/TestPages/JsLayout',
    DomCapture: 'https://applitools.github.io/demo/TestPages/DomTest/dom_capture.html',
    DomCaptureSurge: 'http://applitools-dom-capture-origin-1.surge.sh/ie.html',
    Resolution: 'https://applitools.github.io/demo/TestPages/DynamicResolution/desktop.html',
    ResolutionMobile: 'https://applitools.github.io/demo/TestPages/DynamicResolution/mobile.html',
    ResolutionMobileHorizontalScroll: 'https://applitools.github.io/demo/TestPages/DynamicResolution/scrolled_mobile.html',
    Randomizable: 'https://applitools.github.io/demo/TestPages/RandomizePage/',
    Randomized: 'https://applitools.github.io/demo/TestPages/RandomizePage/?randomize',
    HelloWorld: 'https://applitools.com/helloworld',
    HelloWorldDiff: 'https://applitools.com/helloworld?diff1',
    SpecialCharacters: 'https://applitools.github.io/demo/TestPages/SpecialCharacters/index.html',
    PaddedBody: 'https://applitools.github.io/demo/TestPages/PaddedBody/index.html',
    PageWithFrameHiddenByBar: 'https://applitools.github.io/demo/TestPages/PageWithFrameHiddenByBar/index.html',
    OCR: 'https://applitools.github.io/demo/TestPages/OCRPage',
    AdoptedStyleSheets: 'https://applitools.github.io/demo/TestPages/AdoptedStyleSheets/index.html',
    ShadowDOM: 'https://applitools.github.io/demo/TestPages/ShadowDOM/index.html',
    LazyLoad: 'https://applitools.github.io/demo/TestPages/LazyLoad/',
    LazyLoadInsideScrollableArea: 'https://applitools.github.io/demo/TestPages/LazyLoad/insideScrollableArea.html',
    CodedRegionPage: 'https://applitools.github.io/demo/TestPages/CodedRegionPage/index.html',
    LongPage: 'https://applitools.github.io/demo/TestPages/LongPage/index.html',
    AdjustDocumentHeight: 'https://applitools.github.io/demo/TestPages/ufg-options.html',
    OnLoad: 'https://applitools.github.io/demo/TestPages/OnLoad/',
  },
})

// #region CHECK IMAGE

test('check image', {
  features: ['image'],
  variants: {
    'file in png format': {image: fixture('/images/house.png')},
    'file in jpeg format': {image: fixture('/images/house.jpeg')},
    'file in bmp format': {image: fixture('/images/house.bmp')},
    'base64 in png format': {image: fixture('/images/house.png').toBase64()},
    'url in png format': {image: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/fixtures/images/house.png'},
    'file in png format classic': {api: 'classic',image: fixture('/images/house.png')},
  },
  test({eyes, image}) {
    eyes.open({appName: 'Eyes Images SDK', viewportSize})
    eyes.check({image})
    eyes.close()
  },
})

test('check image region', {
  features: ['image'],
  image: fixture('/images/house.png'),
  variants: {
    '': {api: 'fluent'},
    'classic': {api: 'classic'},
  },
  test({eyes, image}) {
    eyes.open({appName: 'Eyes Images SDK', viewportSize})
    eyes.check({image, region: {left: 10, top: 10, height: 100, width: 100}})
    eyes.close()
  },
})

// #endregion

// #region CHECK WINDOW

test('check window', {
  page: 'Default',
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow'}},
    'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Scroll'}},
    'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'TestCheckWindow_VG'}},
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindow_VG'}},
    'with vg on all browsers': {
      vg: true,
      config: {
        browsersInfo: [
          {name: 'chrome', width: 1000, height: 800},
          {name: 'chrome-one-version-back', width: 1000, height: 800},
          {name: 'chrome-two-versions-back', width: 1000, height: 800},
          {name: 'firefox', width: 1000, height: 800},
          {name: 'firefox-one-version-back', width: 1000, height: 800},
          {name: 'firefox-two-versions-back', width: 1000, height: 800},
          {name: 'safari', width: 1000, height: 800},
          {name: 'safari-one-version-back', width: 1000, height: 800},
          {name: 'safari-two-versions-back', width: 1000, height: 800},
          {name: 'safari-earlyaccess', width: 1000, height: 800},
          {name: 'ie10', width: 1000, height: 800},
          {name: 'ie11', width: 1000, height: 800},
          {name: 'edgelegacy', width: 1000, height: 800},
          {name: 'edgechromium', width: 1000, height: 800},
          {name: 'edgechromium-one-version-back', width: 1000, height: 800},
          {name: 'edgechromium-two-versions-back', width: 1000, height: 800},
        ]
      }
    },
    'on mobile web android': {page: 'HelloWorld', env: {device: 'Pixel 3a XL', browser: 'chrome'}, features: ['sauce']},
    'on mobile web ios': {page: 'HelloWorld', env: {device: 'iPhone XS', browser: 'safari'}, features: ['sauce']},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check({isFully: false})
    eyes.close()
  },
})

test('check window fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowFully'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowFully_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowFully_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check({isFully: true})
    eyes.close()
  },
})

test('check window with default fully', {
  page: 'Default',
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'CheckWindowDefaultFully'}},
    'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'CheckWindowDefaultFully_Scroll'}},
    'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'CheckWindowDefaultFully_VG'}},
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'CheckWindowDefaultFully'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'CheckWindowDefaultFully_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'CheckWindowDefaultFully_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check()
    eyes.close()
  },
})

test('check window after manual scroll', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowAfterScroll'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowAfterScroll_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowAfterScroll_VG'}},
    'on safari 11': {env: {browser: 'safari-11', legacy: true}, features: ['webdriver', 'jsonwire', 'sauce']},
    'on safari 12': {env: {browser: 'safari-12', legacy: true}, features: ['webdriver', 'jsonwire', 'sauce']}
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    driver.executeScript('window.scrollBy(0, 350)')
    eyes.check({isFully: false})
    eyes.close()
  },
})

test('check window two times', {
  page: 'Default',
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'TestDoubleCheckWindow'}},
    'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'TestDoubleCheckWindow_Scroll'}},
    'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'TestDoubleCheckWindow_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check({name: 'first', isFully: false})
    eyes.check({name: 'second', isFully: false})
    eyes.close()
  },
})

test('check window with layout breakpoints', {
  page: 'JsLayout',
  vg: true,
  config: {
    browsersInfo: [
      {name: 'chrome', width: 1000, height: 800},
      {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
      {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
    ],
  },
  test({eyes, driver, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    const expectedViewportSize = driver.executeScript('return {width: window.innerWidth, height: window.innerHeight}').type('Map<String, Number>')
    eyes.check({layoutBreakpoints: [500, 1000], isFully: false})
    eyes.close()
    const actualViewportSize = driver.executeScript('return {width: window.innerWidth, height: window.innerHeight}').type('Map<String, Number>')
    assert.equal(actualViewportSize, expectedViewportSize)
  }
})

test('check window with reload layout breakpoints', {
  page: 'OnLoad',
  vg: true,
  config: {
    browsersInfo: [
      {name: 'chrome', width: 400, height: 800},
      {name: 'chrome', width: 1000, height: 800},
    ],
  },
  test({eyes,}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    // For reload, the expected payload is as seen here.
    eyes.check({layoutBreakpoints: {breakpoints: [400, 1000], reload: true}})
    // And the user facing API would looking something like this:
    // Target.window().layoutBreakpoints(boolean, {reload: true})
    // or
    // Target.window().layoutBreakpoints(number[], {reload: true})
    eyes.close()
  }
})

test('check window with layout breakpoints in config', {
  page: 'JsLayout',
  vg: true,
  config: {
    browsersInfo: [
      {name: 'chrome', width: 1000, height: 800},
      {iosDeviceInfo: {deviceName: 'iPad (7th generation)'}},
      {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
    ],
    layoutBreakpoints: [500, 1000],
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: false})
    eyes.close()
  }
})

test('check window with reload layout breakpoints in config', {
  page: 'OnLoad',
  vg: true,
  config: {
    browsersInfo: [
      {name: 'chrome', width: 400, height: 800},
      {name: 'chrome', width: 1000, height: 800},
    ],
    layoutBreakpoints: {breakpoints: [400, 1000], reload: true},
  },
  test({eyes,}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check()
    eyes.close()
  }
})

test('check window on page with sticky header', {
  page: 'StickyHeader',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Window'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Window_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckPageWithHeader_Window_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({isFully: false})
    eyes.close()
  },
})

test('check window fully on page with sticky header', {
  page: 'StickyHeader',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Window_Fully'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Window_Fully_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckPageWithHeader_Window_Fully_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({isFully: true})
    eyes.close()
  },
})

test('check window fully with custom scroll root', {
  page: 'ScrollableBody',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow_Body'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Body_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindow_Body_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
    eyes.check({scrollRootElement: 'body', isFully: true})
    eyes.close()
  },
})

test('check window fully with wrong scroll root', {
  page: 'ScrollableBody',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow_Html'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Html_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindow_Html_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
    eyes.check({scrollRootElement: 'html', isFully: true})
    eyes.close()
  },
})

test('check window fully with fixed scroll root element', {
  page: 'Modals',
  config: {baselineName: 'TestWindowWithModal_Fully_Scroll'},
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_scrollable_modal')
    eyes.check({scrollRootElement: '#scrollable_modal', isFully: true})
    eyes.close()
  },
})

test('check window fully on page with horizontal scroll', {
  page: 'HorizontalScroll',
  env: {browser: 'firefox'},
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestHorizonalScroll'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestHorizonalScroll_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 400}})
    eyes.check({isFully: true})
    eyes.close()
  },
})

test('check window fully on page with burger menu', {
  page: 'BurgerMenu',
  config: {stitchMode: 'CSS', baselineName: 'CheckPageWithBurgerMenuFully'},
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: true})
    eyes.close()
  }
})

test('check window fully on android chrome emulator', {
  env: {browser: 'chrome', emulation: 'Android 8.0', args: ['--hide-scrollbars']},
  variants: {
    'on mobile page': {page: 'ResolutionMobile', config: {baselineName: 'Android Emulator 8.0 Portrait mobile fully', parentBranchName: 'default'}},
    'on mobile page with horizontal scroll': {page: 'ResolutionMobileHorizontalScroll', config: {baselineName: 'Android Emulator 8.0 Portrait scrolled_mobile fully', parentBranchName: 'default'}},
    'on desktop page': {page: 'Resolution', config: {baselineName: 'Android Emulator 8.0 Portrait desktop fully', parentBranchName: 'default'}},
  },
  test({eyes, driver}) {
    driver.executeScript('updateData()')
    eyes.open({appName: 'Eyes Selenium SDK - iOS Safari Cropping'})
    eyes.check({isFully: true})
    eyes.close()
  },
})

// #endregion

// #region CHECK FRAME

test('check frame', {
  page: 'Default',
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'TestCheckFrame', appName: 'Eyes Selenium SDK - Classic API'}},
    'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrame_Scroll', appName: 'Eyes Selenium SDK - Classic API'}},
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrame_Fluent', appName: 'Eyes Selenium SDK - Fluent API'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrame_Fluent_Scroll', appName: 'Eyes Selenium SDK - Fluent API'}},
  },
  test({eyes}) {
    eyes.open({viewportSize})
    eyes.check({frames: ['[name="frame1"]']})
    eyes.close()
  },
})

test('check frame fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrameFully_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrameFully_Fluent_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({frames: ['[name="frame1"]'], isFully: true})
    eyes.close()
  },
})

test('check frame in frame fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrameInFrame_Fully_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrameInFrame_Fully_Fluent_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({frames: ['[name="frame1"]', '[name="frame1-1"]'], isFully: true})
    eyes.close()
  },
})

test('check window fully and frame in frame fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrameInFrame_Fully_Fluent2'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrameInFrame_Fully_Fluent2_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({isFully: true})
    eyes.check({frames: ['[name="frame1"]', '[name="frame1-1"]'], isFully: true})
    eyes.close()
  },
})

test('check frame after manual switch to frame', {
  features: ['webdriver'],
  page: 'Default',
  config: {hideScrollbars: false},
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'TestCheckInnerFrame'}},
    'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'TestCheckInnerFrame_Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    driver.executeScript('document.documentElement.scrollTop = 350')
    const frame = driver.findElement('[name="frame1"]')
    driver.switchToFrame(frame)
    eyes.check({frames: ['frame1-1']})
    eyes.check({isFully: false})
    driver.executeScript('document.body.style.background = "red"')
    eyes.check({isFully: false})
    eyes.close()
  }
})

// #endregion

// #region CHECK REGION

test('check region by selector', {
  page: 'Default',
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'TestCheckRegion'}},
    'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegion_Scroll'}},
    'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'TestCheckRegion_VG'}},
    'on ie': {env: {browser: 'ie-11'}, features: ['sauce']},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check({region: '#overflowing-div'})
    eyes.close()
  },
})

test('check region by selector fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementFully_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementFully_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckElementFully_Fluent_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#overflowing-div-image', isFully: true})
    eyes.close()
  },
})

test('check region by selector after manual scroll', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionBySelectorAfterManualScroll_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionBySelectorAfterManualScroll_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionBySelectorAfterManualScroll_Fluent_VG'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.executeScript('window.scrollBy(0, 250)')
    eyes.check({region: '#centered'})
    eyes.close()
  },
})

test('check region with fractional metrics by selector', {
  page: 'FractionalMetric',
  config: {baselineName: 'CheckRegionWithFractionalMetrics'},
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({region: '#target'})
    eyes.close()
  },
})

test('check region by coordinates', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionByCoordinates_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionByCoordinates_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionByCoordinates_Fluent_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: {left: 50, top: 70, width: 90, height: 110}})
    eyes.close()
  },
})

test('check overflowed region by coordinates', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckOverflowingRegionByCoordinates_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckOverflowingRegionByCoordinates_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckOverflowingRegionByCoordinates_Fluent_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: {left: 50, top: 110, width: 90, height: 550}})
    eyes.close()
  },
})

test('check region by selector on page with sticky header', {
  page: 'StickyHeader',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Region'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Region_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckPageWithHeader_Region_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({region: 'div.page', isFully: false})
    eyes.close()
  },
})

test('check region by selector fully on page with sticky header', {
  page: 'StickyHeader',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckPageWithHeader_Region_Fully'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckPageWithHeader_Region_Fully_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckPageWithHeader_Region_Fully_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({region: 'div.page', isFully: true})
    eyes.close()
  },
})

test('check fixed region by selector', {
  page: 'FixedRegion',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFixedRegion'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFixedRegion_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckFixedRegion_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#fixed'})
    eyes.close()
  },
})

test('check fixed region by selector fully', {
  page: 'FixedRegion',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFixedRegion_Fully'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFixedRegion_Fully_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckFixedRegion_Fully_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#fixed', isFully: true})
    eyes.close()
  },
})

test('check modal region by selector', {
  page: 'Modals',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestSimpleModal'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestSimpleModal_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestSimpleModal_VG'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_simple_modal')
    eyes.check({region: '#simple_modal > .modal-content'})
    eyes.close()
  },
})

test('check modal region by selector fully', {
  page: 'Modals',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestScrollableContentInModal_Fully'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestScrollableContentInModal_Fully_Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_scrollable_content_modal')
    eyes.check({
      region: '#scrollable_content_modal > .modal-content',
      scrollRootElement: '#scrollable_content_modal',
      isFully: true,
    })
    eyes.close()
  },
})

test('check scrollable modal region by selector fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckScrollableModal'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckScrollableModal_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckScrollableModal_VG'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#centered')
    eyes.check({region: '#modal-content', scrollRootElement: '#modal1', isFully: true})
    eyes.close()
  },
})

test('check hovered region by element', {
  page: 'StickyHeaderWithRegions',
  config: {hideScrollbars: false},
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const input = driver.findElement('#input')
    driver.executeScript('arguments[0].scrollIntoView(false)', input)
    driver.hover(input)
    eyes.check({region: input})
    eyes.close()
  }
})

test('check region by coordinates in frame', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionByCoordinateInFrame_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionByCoordinateInFrame_Fluent_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      region: {left: 30, top: 40, width: 400, height: 1200},
      frames: ['[name="frame1"]'],
    })
    eyes.close()
  },
})

test('check region by coordinates in frame fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      region: {left: 30, top: 40, width: 400, height: 1200},
      frames: ['[name="frame1"]'],
      isFully: true,
    })
    eyes.close()
  },
})

test('check region by selector in frame fully', {
  page: 'Default',
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame'}},
    'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame_Scroll'}},
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
    eyes.close()
  },
})

test('check region by selector in frame in frame fully', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrameInFrame_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrameInFrame_Fluent_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      frames: ['frame1', 'frame1-1'],
      region: {type: 'css', selector: 'img'},
      isFully: true,
    })
    eyes.close()
  }
})

test('check region by selector in overflowed frame', {
  page: 'Wix',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInAVeryBigFrame'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInAVeryBigFrame_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
    eyes.check({region: 'img', frames: ['[name="frame1"]']})
    eyes.close()
  },
})

test('check region by selector in overflowed frame fully', {
  page: 'FrameLargerThenViewport',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'CheckRegionInFrameLargerThenViewport'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'CheckRegionInFrameLargerThenViewport_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 800, height: 600}})
    eyes.check({
      region: '#list',
      frames: ['frame-list'],
      isFully: true,
    })
    eyes.close()
  },
})

test('check region by selector in overflowed frame after manual scroll', {
  features: ['webdriver'],
  page: 'Wix',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame_Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
    driver.switchToFrame(driver.findElement('[name="frame1"]'))
    eyes.check({region: 'img'})
    eyes.close()
  },
})

test('check region by selector in frame multiple times', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame2_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame2_Fluent_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
      isFully: true,
    })
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      ignoreRegions: [
        {left: 50, top: 50, width: 100, height: 100},
        {left: 70, top: 170, width: 90, height: 90},
      ],
      isFully: true,
    })
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      isFully: true,
      timeout: 5000
    })
    eyes.check({
      frames: ['frame1'],
      region: '#inner-frame-div',
      isFully: true,
    })
    eyes.check({
      frames: ['frame1'],
      floatingRegions: [{region: {left: 200, top: 200, width: 150, height: 150,}, maxUpOffset: 25, maxDownOffset: 25, maxLeftOffset: 25, maxRightOffset: 25}],
      isFully: true,
      matchLevel: 'Layout'
    })
    eyes.close()
  }
})

test('check regions by coordinates in frame', {
  page: 'Default',
  config: {hideScrollbars: false},
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckLongIFrameModal'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckLongIFrameModal_Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click({type: 'css', selector: '#stretched'})
    const regions = [
      {left: 0, top: 0, width: 385, height: 5000},
      {left: 0, top: 5000, width: 385, height: 5000},
      {left: 0, top: 10000, width: 385, height: 5000},
      {left: 0, top: 15000, width: 385, height: 5000},
      {left: 0, top: 20000, width: 385, height: 5000},
      {left: 0, top: 25000, width: 385, height: 4072}
    ]
    for (const region of regions) {
      eyes.check({
        scrollRootElement: '#modal2',
        frames: [{type: 'css', selector: '#modal2 iframe'}],
        region,
        isFully: true,
      })
    }
    eyes.close()
  }
})

test('check regions by coordinates in overflowed frame', {
  page: 'Default',
  config: {hideScrollbars: false},
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckLongOutOfBoundsIFrameModal'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckLongOutOfBoundsIFrameModal_Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click({type: 'css', selector: '#hidden_click'})
    const regions = [
      {left: 0, top: 0, width: 385, height: 5000},
      {left: 0, top: 5000, width: 385, height: 5000},
      {left: 0, top: 10000, width: 385, height: 5000},
      {left: 0, top: 15000, width: 385, height: 5000},
      {left: 0, top: 20000, width: 385, height: 5000},
      {left: 0, top: 25000, width: 385, height: 4072}
    ]
    for (const region of regions) {
      eyes.check({
        scrollRootElement: '#modal3',
        frames: [{type: 'css', selector: '#modal3 iframe'}],
        region,
        isFully: true,
      })
    }
    eyes.close()
  }
})

test('check region by selector within shadow dom', {
  page: 'ShadowDOM',
  features: ['shadow-dom'],
  variants: {
    'with vg': {vg: true},
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({region: {selector: '#has-shadow-root', shadow: 'h1'}})
    eyes.check({region: {selector: '#has-shadow-root', shadow: {selector: '#has-shadow-root-nested > div', shadow: 'div'}}})
    eyes.close()
  },
})

test('check region by element within shadow dom', {
  page: 'ShadowDOM',
  features: ['shadow-dom'],
  variants: {
    'with vg': {vg: true},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const shadowRootHost = driver.findElement('#has-shadow-root')
    const shadowRoot = driver.executeScript('return arguments[0].shadowRoot', shadowRootHost).type('ShadowRoot')
    const nestedShadowRootHost = driver.findElement('#has-shadow-root-nested > div', shadowRoot)
    const nestedShadowRoot = driver.executeScript('return arguments[0].shadowRoot', nestedShadowRootHost).type('ShadowRoot')
    const element1 = driver.findElement('h1', shadowRoot)
    const element2 = driver.findElement('div', nestedShadowRoot)
    eyes.check({region: element1})
    eyes.check({region: element2})
    eyes.close()
  },
})

// #endregion

// #region SEND CODED REGIONS, FLAGS and DOM

test('should send ignore region by coordinates', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithIgnoreRegion_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithIgnoreRegion_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowWithIgnoreRegion_Fluent_VG'}},
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.type(driver.findElement('input'), 'My Input')
    eyes.check({
      ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
      isFully: true,
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.ignore[0],
      {left: 50, top: 50, width: 100, height: 100},
    )
  },
})

test('should send ignore region by selector', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent_Scroll'}},
    'with vg': {vg: true, config: { baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent_VG'}},
  },
  test({eyes, assert, helpers, vg}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['#overflowing-div'], isFully: false})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.ignore[0],
      { left: 8, top: vg ? 80 : 81, width: 304, height: vg ? 185 : 184, regionId: '#overflowing-div'},
    )
  },
})

test('should send multiple ignore regions by selector', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent_VG'}},
  },
  test({eyes, assert, helpers, vg}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['.ignore'], isFully: true})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    const imageMatchSettings = info.actualAppOutput[0].imageMatchSettings
    const expectedIgnoreRegions = [
      {left: 10, top: vg ? 285 : 286, width: 800, height: vg ? 501 : 500, regionId: '.ignore (1)'},
      {left: 122, top: vg ? 932 : 933, width: 456, height: vg ? 307 : 306, regionId: '.ignore (2)'},
      {left: 8, top: vg ? 1276 : 1277, width: 690, height: vg ? 207 : 206, regionId: '.ignore (3)'},
    ]
    for (const [index, expectedIgnoreRegion] of expectedIgnoreRegions.entries()) {
      assert.equal(imageMatchSettings.ignore[index], expectedIgnoreRegion)
    }
  },
})

test('should send ignore region by coordinates in target region', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionWithIgnoreRegion_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionWithIgnoreRegion_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionWithIgnoreRegion_Fluent_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      region: '#overflowing-div',
      ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].imageMatchSettings.ignore[0], {left: 50, top: 50, width: 100, height: 100})
  },
})

test('should send ignore region by the same selector as target region', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementWithIgnoreRegionBySameElement_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementWithIgnoreRegionBySameElement_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckElementWithIgnoreRegionBySameElement_Fluent_VG'}},
  },
  test({eyes, assert, helpers, vg}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div-image']})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.ignore[0],
      {left: 0, top: 0, width: 304, height: vg ? 185 : 184, regionId: '#overflowing-div-image'},
    )
  },
})

test('should send ignore region by selector outside of the target region', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div']})
    eyes.close()
  },
})

test('should send correct ignore region if page scrolled before check', {
  page: 'LongPage',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll'}},
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK', viewportSize})
    driver.click('#secondary')
    eyes.check({isFully: true, ignoreRegions: ['#secondary']})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.ignore[0],
      {left: 8, top: 2014, width: 56, height: 56, regionId: '#secondary'},
    )
  },
})

test('should send correct layout region if page has padded body with css stitching', {
  page: 'PaddedBody',
  config: {baselineName: 'Test Layout Region within Target Region', stitchMode: 'CSS'},
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Test Layout Region within Target Region', viewportSize: {height: 700, width: 1100}})
    eyes.check({isFully: true, region: '.main', layoutRegions: ['.minions']})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(
      info['actualAppOutput']['0']['imageMatchSettings']['layout']['0'],
      {left: 0, top: 59, width: 1084, height: 679, regionId: '.minions'}
    )
  }
})

test('should send floating region by coordinates', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithFloatingByRegion_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithFloatingByRegion_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowWithFloatingByRegion_Fluent_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      floatingRegions: [
        {region: {left: 10, top: 10, width: 20, height: 20}, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30},
      ],
      isFully: false,
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.floating[0],
      {left: 10, top: 10, width: 20, height: 20, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30},
    )
  },
})

test('should send floating region by selector', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent_VG'}}
  },
  test({eyes, assert, helpers, vg}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      floatingRegions: [
        {region: '#overflowing-div', maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30},
      ],
      isFully: false,
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.floating[0],
      {left: 8, top: vg ? 80 : 81, width: 304, height: vg ? 185 : 184, regionId: '#overflowing-div', maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30},
    )
  },
})

test('should send floating region by coordinates in frame', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame3_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame3_Fluent_Scroll'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      frames: ['[name="frame1"]'],
      floatingRegions: [
        {
          region: {left: 200, top: 200, width: 150, height: 150},
          maxUpOffset: 25,
          maxDownOffset: 25,
          maxLeftOffset: 25,
          maxRightOffset: 25,
        },
      ],
      matchLevel: 'Layout',
      isFully: true,
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.floating[0],
      {left: 200, top: 200, width: 150, height: 150, maxUpOffset: 25, maxDownOffset: 25, maxLeftOffset: 25, maxRightOffset: 25}
    )
  },
})

test('should send multiple accessibility regions by selector', {
  page: 'Default',
  config: {
    defaultMatchSettings: {accessibilitySettings: {level: 'AAA', guidelinesVersion: 'WCAG_2_0'}}
  },
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestAccessibilityRegions'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestAccessibilityRegions_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestAccessibilityRegions_VG'}}
  },
  test({eyes, assert, helpers, vg}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      accessibilityRegions: [{region: '.ignore', type: 'LargeText'}],
      isFully: false,
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    const imageMatchSettings = info.actualAppOutput[0].imageMatchSettings
    assert.equal(imageMatchSettings.accessibilitySettings.level, 'AAA')
    assert.equal(imageMatchSettings.accessibilitySettings.version, 'WCAG_2_0')
    const expectedAccessibilityRegions = [
      {left: 10, top: vg ? 285 : 286, width: 800, height: vg ? 501 : 500, regionId: '.ignore (1)', type: 'LargeText', isDisabled: false},
      {left: 122, top: vg ? 932 : 933, width: 456, height: vg ? 307 : 306, regionId: '.ignore (2)', type: 'LargeText', isDisabled: false},
      {left: 8, top: vg ? 1276 : 1277, width: 690, height: vg ? 207 : 206, regionId: '.ignore (3)', type: 'LargeText', isDisabled: false},
    ]
    for (const [index, expectedAccessibilityRegion] of expectedAccessibilityRegions.entries()) {
      assert.equal(imageMatchSettings.accessibility[index], expectedAccessibilityRegion)
    }
  }
})

test('should send codded regions with padding', {
  variants: {
    '': {config: {baselineName: 'TestRegionsPadding'}},
    'with vg': {vg: true, config: {baselineName: 'TestRegionsPadding_VG'}},
  },
  test({eyes, assert, helpers, driver}) {
    driver.visit('https://applitools.github.io/demo/TestPages/PaddedBody/region-padding.html')
    eyes.open({appName: 'Test Regions Padding', viewportSize: {height: 700, width: 1100}})
    eyes.check({
      isFully: true,
      ignoreRegions: [{region: '#ignoreRegions', padding: 20}],
      layoutRegions: [{region: '#layoutRegions', padding: {top: 20, right: 20}}],
      contentRegions: [{region: '#contentRegions', padding: {right: 20, left: 20}}],
      strictRegions: [{region: '#strictRegions', padding: {bottom: 20} }]
    })
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    const imageMatchSettings = info.actualAppOutput[0].imageMatchSettings
    const expectedRegions = {
      ignore: [{left: 131, top: 88, width: 838, height: 110, regionId: '#ignoreRegions'}],
      layout: [{left: 151, top: 238, width: 818, height: 90, regionId: '#layoutRegions'}],
      content: [{left: 131, top: 408, width: 838, height: 70, regionId: '#contentRegions'}],
      strict: [{left: 151, top: 558, width: 798, height: 548, regionId: '#strictRegions'}],
    }
    Object.keys(expectedRegions).forEach( regionName => {
      assert.equal(imageMatchSettings[regionName], expectedRegions[regionName], regionName)
    })
  }
})

test('should send codded regions with region id', {
  page: 'CodedRegionPage',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({assert, helpers, driver, eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 800, height: 600}})
    
    const element = driver.findElement('.region.two:nth-child(2)')
    const regions = [
      {type: 'css', selector: '.region.three:nth-child(3n)'}, // 4 regions are targeted by this selector
      {type: 'xpath', selector: '//div[@class="region one"][3]'},
      {region: element, regionId: 'my-region-id'},
    ]
    // check #1 - ignore regions
    eyes.check({isFully: false, ignoreRegions: regions})

    // check #2 - layout regions
    eyes.check({isFully: false, layoutRegions: regions})

    // check #3 - content regions
    eyes.check({isFully: false, contentRegions: regions})

    // check #4 - strict regions
    eyes.check({isFully: false, strictRegions: regions})

    const result = eyes.close(false)

    const info = helpers.getTestInfo(result)
    const expectedRegions = [
      {left: 290, top: 30, width: 100, height: 100, regionId: '//div[@class="region one"][3]'}, // selector with type:'xpath
      {left: 280, top: 170, width: 200, height: 200, regionId: 'my-region-id'}, // element with custom id
      {left: 250, top: 420, width: 50, height: 50, regionId: '.region.three:nth-child(3n) (1)'}, // string that targets multiple elements
      {left: 550, top: 420, width: 50, height: 50, regionId: '.region.three:nth-child(3n) (2)'}, // string that targets multiple elements
      {left: 250, top: 520, width: 50, height: 50, regionId: '.region.three:nth-child(3n) (3)'}, // string that targets multiple elements
      {left: 550, top: 520, width: 50, height: 50, regionId: '.region.three:nth-child(3n) (4)'}, // string that targets multiple elements
    ]
    for (const [index, expectedIgnoreRegion] of expectedRegions.entries()) {
      assert.equal(info.actualAppOutput[0].imageMatchSettings.ignore[index], expectedIgnoreRegion)
      assert.equal(info.actualAppOutput[1].imageMatchSettings.layout[index], expectedIgnoreRegion)
      assert.equal(info.actualAppOutput[2].imageMatchSettings.content[index], expectedIgnoreRegion)
      assert.equal(info.actualAppOutput[3].imageMatchSettings.strict[index], expectedIgnoreRegion)
    }
  },
})

test('should send ignore displacements', {
  page: 'Default',
  variants: {
    '': {config: {baselineName: 'TestIgnoreDisplacements'}},
    'with vg': {vg: true, config: {baselineName: 'TestIgnoreDisplacements_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({isFully: true, ignoreDisplacements: true})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].imageMatchSettings.ignoreDisplacements, true)
  },
})

test('should send dom', {
  page: 'DomCaptureSurge',
  variants: {
    'on edge legacy': {env: {browser: 'edge-18'}, features: ['sauce']},
    'on ie': {env: {browser: 'ie-11'}, features: ['sauce']},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes SDK', viewportSize})
    eyes.check()
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
  }
})

test('should not send dom', {
  page: 'HelloWorld',
  config: {baselineName: 'Test NOT SendDom'},
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Test NOT SendDom', viewportSize: {width: 1000, height: 700}})
    eyes.check({sendDom: false})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, false)
  }
})

test('should send dom when check image', {
  features: ['image'],
  image: fixture('/images/house.png'),
  dom: fixture('/dom.json').toText(),
  test({eyes, image, dom, assert, helpers}) {
    eyes.open({appName: 'Eyes Images SDK', viewportSize})
    eyes.check({image, dom})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
  }
})

test('should send dom and location when check window', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const scrollLocation = {x: 0, y: 350}
    driver.executeScript(`window.scrollTo(${scrollLocation.x}, ${scrollLocation.y})`)
    driver.executeScript('document.documentElement.setAttribute("data-expected-target", "true");')
    eyes.check({isFully: false, hooks: {beforeCaptureScreenshot: `window.scrollTo(${scrollLocation.x}, ${scrollLocation.y})`}})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 0)
    const targetElements = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(targetElements[0].rect.left + scrollLocation.x))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(targetElements[0].rect.top + scrollLocation.y))
  }
})

test('should send dom and location when check window fully', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    driver.executeScript('document.documentElement.setAttribute("data-expected-target", "true");')
    driver.executeScript('document.documentElement.setAttribute("data-expected-scroll", "true");')
    eyes.check({isFully: true})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 1)
    assert.equal(scrollingElements[0].attributes['data-applitools-scroll'], 'true')
    assert.equal(scrollingElements[0].attributes['data-expected-scroll'], 'true')
    const targetElements = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(targetElements[0].rect.left))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(targetElements[0].rect.top))
  }
})

test('should send dom and location when check frame', {
  page: 'Default',
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const frameElement = driver.findElement('[name="frame1"]')
    driver.executeScript(`arguments[0].setAttribute("data-expected-target", "true");`, frameElement)
    eyes.check({frames: [frameElement]})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 0)
    const frameElements = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(frameElements[0].rect.left))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(frameElements[0].rect.top))
  }
})

test('should send dom and location when check frame fully', {
  page: 'Default',
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const frameElement = driver.findElement('[name="frame1"]')
    driver.executeScript(`arguments[0].setAttribute("data-expected-frame", "true");`, frameElement)
    driver.executeScript('arguments[0].contentDocument.documentElement.setAttribute("data-expected-scroll", "true");', frameElement)
    eyes.check({frames: [frameElement], isFully: true})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 1)
    assert.equal(scrollingElements[0].attributes['data-applitools-scroll'], 'true')
    assert.equal(scrollingElements[0].attributes['data-expected-scroll'], 'true')
    const frameElementInDom = dom.getNodesByAttribute('data-expected-frame')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(frameElementInDom[0].rect.left + 2))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(frameElementInDom[0].rect.top + 2))
  }
})

test('should send dom and location when check region by selector', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const element = driver.findElement('#centered')
    driver.executeScript('arguments[0].setAttribute("data-expected-target", "true");', element)
    eyes.check({region: element, isFully: false})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 1)
    assert.equal(scrollingElements[0].attributes['data-applitools-scroll'], 'true')
    assert.equal(scrollingElements[0].attributes['data-expected-target'], 'true')
    const targetElement = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(targetElement[0].rect.left))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(targetElement[0].rect.top))
  }
})

test('should send dom and location when check region by selector fully', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    driver.executeScript('window.scrollTo(0, 350)')
    const scrollableElement = driver.findElement('#overflowing-div')
    driver.executeScript('arguments[0].setAttribute("data-expected-target", "true");', scrollableElement)
    driver.executeScript('arguments[0].setAttribute("data-expected-scroll", "true");', scrollableElement)
    eyes.check({region: scrollableElement, isFully: true})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 1)
    assert.equal(scrollingElements[0].attributes['data-applitools-scroll'], 'true')
    assert.equal(scrollingElements[0].attributes['data-expected-scroll'], 'true')
    const targetElements = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(targetElements[0].rect.left + 2))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(targetElements[0].rect.top + 2))
  }
})

test('should send dom and location when check region by selector in frame', {
  page: 'Default',
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const frameElement = driver.findElement('[name="frame1"]')
    driver.executeScript('arguments[0].setAttribute("data-applitools-frame", "true");', frameElement)
    driver.executeScript(`arguments[0].contentDocument.querySelector('[name="frame1-1"]').setAttribute("data-expected-target", "true");`, frameElement)
    eyes.check({frames: [frameElement], region: '[name="frame1-1"]'})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 1)
    assert.equal(scrollingElements[0].attributes['data-applitools-scroll'], 'true')
    assert.equal(scrollingElements[0].attributes['data-expected-target'], 'true')
    const frameElementInDom = dom.getNodesByAttribute('data-applitools-frame')
    const targetElement = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(frameElementInDom[0].rect.left + 2 + targetElement[0].rect.left))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(frameElementInDom[0].rect.top + 2 + targetElement[0].rect.top))
  }
})

test('should send dom and location when check region by selector with custom scroll root', {
  page: 'Default',
  env: {browser: 'chrome', args: ['--hide-scrollbars']},
  variants: {
    '': {vg: false},
    'with vg': {vg: true}
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    driver.click('#centered')
    // TODO this is due to differences between JS and non-JS SDK's. Since what's important in this test is not the image itself, nor can this be solved with branch baselines, we hard coded hide scrollbars on the HTML element in order to verify that the DOM and location are correct.
    // TODO this happens because non-JS emitters are ignore env args
    driver.executeScript('document.documentElement.style.overflow="hidden";')
    const element = driver.findElement('#modal-content')
    driver.executeScript('arguments[0].setAttribute("data-expected-target", "true");', element)
    eyes.check({region: element, isFully: false, scrollRootElement: '#modal1'})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 1)
    assert.equal(scrollingElements[0].attributes['data-applitools-scroll'], 'true')
    assert.equal(scrollingElements[0].attributes['data-expected-target'], 'true')
    const targetElement = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(targetElement[0].rect.left))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(targetElement[0].rect.top))
  }
})

test('should send dom and location when check region by selector fully with custom scroll root', {
  page: 'Default',
  env: {browser: 'chrome', args: ['--hide-scrollbars']},
  variants: {
    '': {vg: false},
    'with vg': {vg: true, skip: true}, // TODO grid marks a different block with `applitools-scroll`
  },
  test({driver, eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    driver.click('#centered')
    // TODO this is due to differences between JS and non-JS SDK's. Since what's important in this test is not the image itself, nor can this be solved with branch baselines, we hard coded hide scrollbars on the HTML element in order to verify that the DOM and location are correct.
    // TODO this happens because non-JS emitters are ignore env args
    driver.executeScript('document.documentElement.style.overflow="hidden";')
    const element = driver.findElement('#modal-content')
    driver.executeScript('arguments[0].setAttribute("data-expected-target", "true");', element)
    const scrollRootElement = driver.findElement('#modal1')
    driver.executeScript('arguments[0].setAttribute("data-expected-scroll", "true");', scrollRootElement)
    eyes.check({region: element, isFully: true, scrollRootElement})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].image.hasDom, true)
    const dom = helpers.getDom(result, info.actualAppOutput[0].image.domId)
    const scrollingElements = dom.getNodesByAttribute('data-applitools-scroll')
    assert.equal(scrollingElements.length, 1)
    assert.equal(scrollingElements[0].attributes['data-applitools-scroll'], 'true')
    assert.equal(scrollingElements[0].attributes['data-expected-scroll'], 'true')
    const targetElement = dom.getNodesByAttribute('data-expected-target')
    assert.equal(info.actualAppOutput[0].image.location.x, helpers.math.round(targetElement[0].rect.left))
    assert.equal(info.actualAppOutput[0].image.location.y, helpers.math.round(targetElement[0].rect.top))
  }
})

// #endregion

// #region OTHERS

test('should send enablePatterns when specified in config', {
  page: 'HelloWorld',
  config: {defaultMatchSettings: {enablePatterns: true}},
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK', viewportSize});
    eyes.check()
    const result = eyes.close(false);
    const info = helpers.getTestInfo(result);
    assert.equal(info.actualAppOutput[0].imageMatchSettings.enablePatterns, true)
  },
})

test('should send enablePatterns when specified in check settings', {
  page: 'HelloWorld',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK', viewportSize});
    eyes.check({enablePatterns: true})
    const result = eyes.close(false);
    const info = helpers.getTestInfo(result);
    assert.equal(info.actualAppOutput[0].imageMatchSettings.enablePatterns, true)
  },
})

test('should send custom batch properties', {
  features: ['non-visual'],
  config: {
    batch: {id: `test_batch_props_${Date.now()}`, properties: [{name: 'custom batch prop', value: 'custom batch value'}]}
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Custom Batch Properties', viewportSize});
    // python default behaviour is to throw an error if there are no checks was performed, so changed to not throwing an exception to be able to check custom batch props
    const result = eyes.close(false);
    const info = helpers.getTestInfo(result);
    assert.equal(info.startInfo.batchInfo.properties.length, 1)
    assert.equal(info.startInfo.batchInfo.properties[0], {name: 'custom batch prop', value: 'custom batch value'})
  },
})

test('should send custom session properties', {
  features: ['non-visual'],
  config: {
    batch: {id: `test_batch_session_props_${Date.now()}`},
    properties: [{name: 'custom session prop', value: 'custom session value'}]
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Custom Session Properties', viewportSize});
    // python default behaviour is to throw an error if there are no checks was performed, so changed to not throwing an exception to be able to check custom session props
    const result = eyes.close(false);
    const info = helpers.getTestInfo(result);
    assert.equal(info.startInfo.properties.length, 1)
    assert.equal(info.startInfo.properties[0], {name: 'custom session prop', value: 'custom session value'})
  },
})

test('should send batch sequence name', {
  features: ['non-visual'],
  config: {
    batch: {id: `test_batch_sequence_name_${Date.now()}`, sequenceName: 'custom sequence name'}
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Batch Sequence Name', viewportSize});
    // python default behaviour is to throw an error if there are no checks was performed, so changed to not throwing an exception to be able to check custom batch props
    const result = eyes.close(false);
    const info = helpers.getTestInfo(result);
    assert.equal(info.startInfo.batchInfo.batchSequenceName, 'custom sequence name')
  },
})

test('should hide and restore scrollbars', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestScrollbarsHiddenAndReturned_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestScrollbarsHiddenAndReturned_Fluent_Scroll'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({isFully: true})
    eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
    eyes.check({isFully: true})
    eyes.close()
  },
})

test('should find regions by visual locator', {
  page: 'Default',
  variants: {
    '': {vg: false, config: {baselineName: 'TestVisualLocators'}},
    'with vg': {vg: true, config: {baselineName: 'TestVisualLocators_VG'}},
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    const regionsMap = eyes.locate({locatorNames: ['applitools_title']})
    eyes.close(false)
    assert.equal(regionsMap, {
      applitools_title: [{left: 3, top: 19, width: 158, height: 38}],
    })
  },
})

test('should extract text from regions', {
  page: 'OCR',
  config: {stitchMode: 'CSS'},
  test({driver, eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const element = driver.findElement({type: 'css', selector: 'body > h2'})
    const texts = eyes.extractText([
      {target: 'body > h1'},
      {target: element},
      {target: {left: 10, top: 405, width: 210, height: 22}, hint: 'imagination be your guide'},
    ])
    eyes.close(false)
    assert.equal(texts[0], 'Header 1: Hello world!')
    assert.equal(texts[1], 'Header 2: He110 world!')
    assert.equal(texts[2], 'imagination be your guide.')
  },
})

test('should extract text from regions without a hint', {
  page: 'OCR',
  config: {stitchMode: 'CSS'},
  test({driver, eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const text = eyes.extractText([
      {target: {x: 10, y: 405, width: 210, height: 22}},
      {target: {x: 10, y: 405, width: 210, height: 22}, hint: ''},
    ])
    eyes.close(false)
    assert.equal(text[0], 'imagination be your guide.')
    assert.equal(text[1], 'imagination be your guide.')
  },
})

test('should extract text regions from image', {
  page: 'OCR',
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const patterns = ['header \\d: Hello world', '\\d\\..+', 'make']
    const regions = eyes.extractTextRegions({patterns, ignoreCase: true})
    eyes.close(false)

    assert.equal(regions[patterns[0]].length, 3)
    assert.equal(regions[patterns[0]][0].text, 'Header 1: Hello world!')
    assert.equal(regions[patterns[0]][1].text, 'Header 2: Hello world!')
    assert.equal(regions[patterns[0]][2].text, 'Header 3: Hello world!')

    assert.equal(regions[patterns[1]].length, 4)
    assert.equal(regions[patterns[1]][0].text, '1.One')
    assert.equal(regions[patterns[1]][1].text, '2.Two')
    assert.equal(regions[patterns[1]][2].text, '3.Three')
    assert.equal(regions[patterns[1]][3].text, '4.Four')

    // Temorary remove
    // assert.equal(regions[patterns[2]].length, 2)
    // assert.equal(regions[patterns[2]][0].text, 'choose to make it that way. Just make a decision and let')
    // assert.equal(regions[patterns[2]][1].text, 'I can make this world as happy as I want it')
  },
})

test('should set viewport size', {
  page: 'Default',
  variants: {
    '': {env: {browser: 'chrome'}},
    'on edge legacy': {env: {browser: 'edge-18'}, features: ['sauce']},
  },
  test({driver, eyes, assert}) {
    const expectedViewportSize = {width: 600, height: 600}
    eyes.constructor.setViewportSize(expectedViewportSize)
    const actualViewportSize = driver.executeScript('return {width: window.innerWidth, height: window.innerHeight}').type('Map<String, Number>')
    assert.equal(actualViewportSize, expectedViewportSize)
  },
})

test('should not fail if scroll root is stale', {
  variants: {
    '': {env: {browser: 'chrome'}, config: {viewportSize: {width: 600, height: 500}}},
    'on android': {env: {browser: 'chrome', emulation: 'Android 8.0', args: ['--hide-scrollbars']}},
  },
  test({driver, eyes}) {
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check()
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.check()
    eyes.close()
  },
})

test('should fail check of stale element', {
  features: ['webdriver'],
  test({driver, eyes, assert}) {
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
    const element = driver.findElement('#inner-img')
    driver.click('#invalidate-button')
    assert.throws(
      () => void eyes.check({region: element}),
      error => driver.constructor.isStaleElementError(error),
    )
    eyes.close(false)
  },
})

test('should throw if no checkpoints before close', {
  page: 'Default',
  config: {baselineName: 'TestGetAllTestResults'},
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 800, height: 600}})
    assert.throws(() => void eyes.close())
    eyes.runner.getAllTestResults(false)
  },
})

test('should throw if target frame is not found', {
  page: 'Default',
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    assert.throws(() => void eyes.check({frames: ['non-existing-frame']}))
    eyes.abort()
  }
})

test('should not check if disabled', {
  page: 'HelloWorldDiff',
  config: {isDisabled: true, baselineName: 'hello world'},
  test({eyes}) {
    eyes.open({appName: 'Demo C# app', viewportSize: {width: 800, height: 600}})
    eyes.check({isFully: true})
    eyes.check({region: '.random-number'})
    eyes.check()
    eyes.check({region: '#someId'})
    eyes.close()
  }
})

test('pageCoverage data is correct', {
  page: 'Simple',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({eyes, assert, helpers, vg}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize});
    eyes.check({isFully: true, pageId: 'my-page'});
    eyes.check({isFully: true, region: '#overflowing-div > img:nth-child(22)', pageId: 'my-page'});
    eyes.check({isFully: true, region: {width: 200, height: 150, left: 10, top: 15}, pageId: 'my-page1'});
    const result = eyes.close(false);
    const info = helpers.getTestInfo(result);
    assert.equal(info.actualAppOutput[0].pageCoverageInfo.pageId, 'my-page', 'pageId match')
    assert.equal(info.actualAppOutput[0].pageCoverageInfo.width, 958, 'Page width match')
    assert.equal(info.actualAppOutput[0].pageCoverageInfo.height, 3540, 'Page height match')
    assert.equal(info.actualAppOutput[0].pageCoverageInfo.imagePositionInPage, {x: 0, y: 0}, 'Full page')
    assert.equal(info.actualAppOutput[1].pageCoverageInfo.imagePositionInPage, vg ? {x: 641, y: 1297} : {x: 636, y: 1292}, 'Selector match')
    assert.equal(info.actualAppOutput[2].pageCoverageInfo.imagePositionInPage, {x: 10, y: 15}, 'Region match')
  },
});

test('should return test results from close', {
  variants: {
    'with passed classic test': {page: 'Randomizable', config: {baselineName: 'TestCloseReturnsTestResults_Passed_ClassicRunner'}},
    'with passed vg test': {page: 'Randomizable', vg: true, config: {baselineName: 'TestCloseReturnsTestResults_Passed_VisualGridRunner'}},
    'with failed classic test': {page: 'Randomized', config: {baselineName: 'TestCloseReturnsTestResults_Failed_ClassicRunner'}},
    'with failed vg test': {page: 'Randomized', vg: true, config: {baselineName: 'TestCloseReturnsTestResults_Failed_VisualGridRunner'}},
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({region: '#random_wrapper'})
    const result = eyes.close(false)
    assert.instanceOf(result, 'TestResults')
  }
})

test('should render special characters', {
  page: 'SpecialCharacters',
  vg: true,
  config: {browsersInfo: [{name: 'chrome', width: 800, height: 600}], branchName: 'default', baselineName: 'Special Characters'},
  test({eyes}) {
    eyes.open({appName: 'Special Characters Test'})
    eyes.check({isFully: true})
    eyes.close()
  }
})

test('check region fully after scroll non scrollable element', {
  page: 'Simple',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementFullyAfterScrollNonScrollableElement'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementFullyAfterScrollNonScrollableElement_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckElementFullyAfterScrollNonScrollableElement_VG'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - check non scrollable element', viewportSize})
    driver.executeScript('window.scrollBy(0, 500)')
    eyes.check({
      region: '#overflowing-div',
      isFully: true,
    })
    eyes.close()
  }
})

test('check region in frame hidden under top bar fully', {
  page: 'PageWithFrameHiddenByBar',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckElementInFrameHiddenUnderTopBar_Fully_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckElementInFrameHiddenUnderTopBar_Fully_Fluent_Scroll'}},
  },
  test({eyes, config}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      frames: ['[name="frame1"]'],
      region: '#div1',
      scrollRootElement: config.stitchMode === 'Scroll' ? 'body' : undefined,
      isFully: true,
    })
    eyes.close()
  }
})

test('check window fully with html scrollRootElement after scroll', {
  page: 'Simple',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowFullyWithHtmlScrollRootElementAfterScroll'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowFullyWithHtmlScrollRootElementAfterScroll_Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.executeScript('window.scrollBy(0, 100)')
    eyes.check({
      scrollRootElement: 'html',
      isFully: true
    })
    eyes.close()
  }
})

test('check window fully with html scrollRootElement after scroll when fail to scroll', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowFullyWithHtmlScrollRootElementAfterScrollWhenFailToScroll'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowFullyWithHtmlScrollRootElementAfterScrollWhenFailToScroll_Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.executeScript('window.scrollBy(0, 200)')
    eyes.check({
      scrollRootElement: 'html',
      isFully: true
    })
    eyes.close()
  },
})

test('appium android check window', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk'},
  config: {baselineName: 'Appium_Android_CheckWindow'},
  features: ['sauce'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.CLASSNAME, selector: 'android.widget.Button'})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({ignoreRegions: [{type: TYPE.CLASSNAME, selector: 'android.widget.Button'}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 135, top: 236, width: 90, height: 48, regionId: 'android.widget.Button'},
    )
  },
})

test('appium android check region with ignore region', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk'},
  config: {baselineName: 'Appium_Android_CheckRegionWithIgnoreRegion'},
  features: ['sauce'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.CLASSNAME, selector: 'android.widget.Button'})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.ID, selector: 'com.applitools.helloworld.android:id/image_container'}, ignoreRegions: [{type: TYPE.ANDROID_UI_AUTOMATOR, selector: 'new UiSelector().textContains("You successfully clicked the button!")'}, {type: TYPE.ID, selector: 'com.applitools.helloworld.android:id/image'}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 53, top: 0, width: 254, height: 22, regionId: 'new UiSelector().textContains("You successfully clicked the button!")',},
    )
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[1],
        {left: 0, top: 22, width: 360, height: 234, regionId: 'com.applitools.helloworld.android:id/image', },
    )
  },
})

test('appium android check region', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk'},
  config: {baselineName: 'Appium_Android_CheckRegion'},
  features: ['sauce'],
  test: ({eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.CLASSNAME, selector: 'android.widget.Button'}})
    eyes.close()
  },
})

test('appium iOS check window', {
  env: {device: 'iPhone XS', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-ios-hello-world/1.2/eyes-ios-hello-world.zip'},
  config: {baselineName: 'Appium_iOS_CheckWindow'},
  features: ['sauce'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeButton'"})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({ignoreRegions: [{type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeButton'"}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 155, top: 258, width: 65, height: 30, regionId: `type == 'XCUIElementTypeButton'`},
    )
  },
})

test('appium iOS check fully window with scroll and pageCoverage', {
  env: {device: 'iPhone XS', app: 'https://applitools.jfrog.io/artifactory/Examples/IOSTestApp/1.9/app/IOSTestApp.zip'},
  config: {baselineName: 'Appium_iOS_CheckWindow_with_scroll'},
  features: ['sauce'],
  test: ({ driver, eyes, helpers, assert }) => {
    driver.click({ type: TYPE.ACCESSIBILITY_ID, selector: 'Scroll view' })
    eyes.open({ appName: 'Applitools Eyes SDK' })
    eyes.check({ pageId: 'my-page', isFully: true })
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.pageId,
      'my-page', 'pageId match'
    )
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.width,
      335, 'Page width match'
    )
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.height,
      1500, 'Page height match'
    )
  },
})

test('appium iOS check window region with scroll and pageCoverage', {
  env: {device: 'iPhone XS', app: 'https://applitools.jfrog.io/artifactory/Examples/IOSTestApp/1.9/app/IOSTestApp.zip'},
  config: {baselineName: 'Appium_iOS_CheckWindow_with_region_scroll'},
  features: ['sauce'],
  test: ({ driver, eyes, helpers, assert }) => {
    driver.click({ type: TYPE.ACCESSIBILITY_ID, selector: 'Scroll view with nested table' })
    eyes.open({ appName: 'Applitools Eyes SDK' })
    eyes.check({ pageId: 'my-page', isFully: false, region: { type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeTable'" } })
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.pageId,
      'my-page', 'pageId match'
    )
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.width,
      335, 'Page width match'
    )
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.height,
      690, 'Page height match'
    )
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.imagePositionInPage.x,
      20, 'Image position x match'
    )
    assert.equal(
      info.actualAppOutput[0].pageCoverageInfo.imagePositionInPage.y,
      84, 'Image position y match'
    )
  },
})

test('appium iOS check region with ignore region', {
  env: {device: 'iPhone XS', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-ios-hello-world/1.2/eyes-ios-hello-world.zip'},
  config: {baselineName: 'Appium_iOS_CheckRegionWithIgnoreRegion'},
  features: ['sauce'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeButton'"})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.ACCESSIBILITY_ID, selector: 'BottomContainer'},ignoreRegions: [{type: TYPE.ACCESSIBILITY_ID, selector: 'BottomLabel'}, {type: TYPE.ACCESSIBILITY_ID, selector: 'BottomImage'}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 0, top: 0, width: 343, height: 21, regionId: 'BottomLabel'},
    )
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[1],
        {left: 115, top: 35, width: 113, height: 65, regionId: 'BottomImage'},
    )
  },
})

test('appium iOS check region', {
  env: {device: 'iPhone XS', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-ios-hello-world/1.2/eyes-ios-hello-world.zip'},
  config: {baselineName: 'Appium_iOS_CheckRegion'},
  features: ['sauce'],
  test: ({eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeButton'"}})
    eyes.close()
  },
})

test('adopted styleSheets on chrome', {
  page: 'AdoptedStyleSheets',
  vg: true,
  config: {
    browsersInfo: [{name: 'chrome', width: 640, height: 480}],
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: false})
    eyes.close()
  }
})

test('adopted styleSheets on firefox', {
  page: 'AdoptedStyleSheets',
  vg: true,
  config: {
    browsersInfo: [{name: 'firefox', width: 640, height: 480}],
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: false})
    assert.throws(() => void eyes.close())
    // TODO assert test is aborted
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: false, visualGridOptions: {polyfillAdoptedStyleSheets: true}})
    eyes.check({isFully: false, visualGridOptions: {polyfillAdoptedStyleSheets: false}})
    eyes.close()
  }
})

test('variant id', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: false, variationGroupId: 'variant-id'})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(info.actualAppOutput[0].knownVariantId, 'variant-id')
  }
})

test('should abort after close', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check()
    eyes.close(false)
    const abortResult = eyes.abort()
    assert.equal(abortResult, null)
  },
})

test('should abort unclosed tests', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check()
    const results = eyes.runner.getAllTestResults(false)
    assert.equal(results.getAllResults().length, 1)
    assert.equal(results.getAllResults()[0].testResults.isAborted, true)
  },
})

test('should return aborted tests in getAllTestResults', {
  page: 'Default',
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check()
    const abortResult = eyes.abort()
    assert.equal(abortResult.isAborted, true)
    const results = eyes.runner.getAllTestResults(false)
    assert.equal(results.getAllResults().length, 1)
    assert.equal(results.getAllResults()[0].testResults.isAborted, true)
  },
})

test('should return browserInfo in getAllTestResults', {
  page: 'Default',
  vg: true,
  config: {
    browsersInfo: [
      {name: 'chrome', width: 800, height: 600},
      {name: 'firefox', width: 640, height: 480},
      {chromeEmulationInfo: {deviceName: 'Pixel 4 XL'}},
    ],
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: false})
    const testResults = eyes.close(false)
    assert.equal(testResults.status, 'Passed')
    const results = eyes.runner.getAllTestResults(false)
    assert.equal(results.getAllResults().length, 3)
    assert.equal(results.getAllResults()[0].browserInfo.name, 'chrome')
    assert.equal(results.getAllResults()[0].browserInfo.width, 800)
    assert.equal(results.getAllResults()[0].browserInfo.height, 600)
    assert.equal(results.getAllResults()[0].testResults.status, 'Passed')
    assert.equal(results.getAllResults()[1].browserInfo.name, 'firefox')
    assert.equal(results.getAllResults()[1].browserInfo.width, 640)
    assert.equal(results.getAllResults()[1].browserInfo.height, 480)
    assert.equal(results.getAllResults()[1].testResults.status, 'Unresolved')
    assert.equal(results.getAllResults()[2].browserInfo.chromeEmulationInfo.deviceName, 'Pixel 4 XL')
    assert.equal(results.getAllResults()[2].testResults.status, 'Passed')
  },
})

test('should waitBeforeCapture with breakpoints in open', {
  vg: true,
  config: {
    layoutBreakpoints: true,
    waitBeforeCapture: 2000,
    browsersInfo: [
      {name: 'chrome', width: 1200, height: 800},
    ]
  },
  test({ driver, eyes }) {
    driver.visit('https://applitools.github.io/demo/TestPages/waitBeforeCapture')
    eyes.open({ appName: 'Applitools Eyes SDK', viewportSize: { width: 600, height: 600 } })
    eyes.check({isFully: true})
    eyes.close()
  },
})

test('should waitBeforeCapture with breakpoints in check', {
  vg: true,
  config: {
    browsersInfo: [
      {name: 'chrome', width: 1200, height: 800},
    ]
  },
  test({ driver, eyes }) {
    driver.visit('https://applitools.github.io/demo/TestPages/waitBeforeCapture')
    eyes.open({ appName: 'Applitools Eyes SDK', viewportSize: { width: 600, height: 600 } })
    eyes.check({
      isFully: true,
      layoutBreakpoints: true,
      waitBeforeCapture: 2000,
    })
    eyes.close()
  },
})

test('should waitBeforeCapture in open', {
  vg: true,
  config: {
    waitBeforeCapture: 2000,
  },
  test({ driver, eyes }) {
    // 'delay' (in queryString) is the time in milliseconds until image is visible in html (default is 1000)
    driver.visit('https://applitools.github.io/demo/TestPages/waitBeforeCapture/dynamicDelay.html?delay=1000')
    eyes.open({ appName: 'Applitools Eyes SDK', viewportSize })
    eyes.check({ isFully: true })
    eyes.close()
  },
})

test('should waitBeforeCapture in check', {
  page: 'Simple',
  vg: true,
  test({ driver, eyes }) {
    eyes.open({ appName: 'Applitools Eyes SDK', viewportSize })
    eyes.check({name: "session opening is finished", isFully: false})
    // 'delay' (in queryString) is the time in milliseconds until image is visible in html (default is 1000)
    driver.visit('https://applitools.github.io/demo/TestPages/waitBeforeCapture/dynamicDelay.html?delay=5000')
    eyes.check({name: "should show smurf", isFully: true, waitBeforeCapture: 6000})
    driver.visit('https://applitools.github.io/demo/TestPages/waitBeforeCapture/dynamicDelay.html?delay=5000')
    eyes.check({name: "should be blank", isFully: true})
    eyes.close()
  },
})

test('should send agentRunId', {
  page: 'Default',
  vg: true,
  config: {
    browsersInfo: [
      {name: 'chrome', width: 400, height: 400},
      {name: 'chrome', width: 500, height: 500}
    ]
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK', viewportSize});
    eyes.check({isFully: false});
    eyes.close(false)
    const resultSummary = eyes.runner.getAllTestResults(false)
    const info1 = helpers.getTestInfo(resultSummary.getAllResults()[0].testResults);
    const info2 = helpers.getTestInfo(resultSummary.getAllResults()[1].testResults); 
    assert.ok(info1.startInfo.agentRunId)
    assert.equal(info1.startInfo.agentRunId, info2.startInfo.agentRunId)
  },
})

test('appium iOS nav bar check region', {
  env: {device: 'iPhone XS', app: 'https://applitools.jfrog.io/artifactory/Examples/awesomeswift.zip'},
  features: ['sauce'],
  test: ({driver, eyes, helpers, assert}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.IOS_PREDICATE, selector: 'name == \"Awesome Swift\" AND type == \"XCUIElementTypeNavigationBar\"'}, isFully: false})
    const result = eyes.close()
  },
})

test('appium android landscape mode check window', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk', orientation: 'landscape'},
  features: ['sauce'],
  variants: {
    'on android 7': {env: {device: 'Samsung Galaxy S8', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk', orientation: 'landscape'}},
    'on android 10': {env: {device: 'Pixel 3 XL', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk', orientation: 'landscape'}}
  },
  test: ({driver, eyes, helpers, assert}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: false})
    const result = eyes.close()
  },
})

test('appium android landscape mode check region', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk', orientation: 'landscape'},
  features: ['sauce'],
  variants: {
    'on android 7': {env: {device: 'Samsung Galaxy S8', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk', orientation: 'landscape'}},
    'on android 10': {env: {device: 'Pixel 3 XL', app: 'https://applitools.jfrog.io/artifactory/Examples/eyes-android-hello-world.apk', orientation: 'landscape'}}
  },
  test: ({driver, eyes, helpers, assert}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.XPATH, selector: '//android.widget.CheckBox[1]'}, isFully: false})
    const result = eyes.close()
  },
})

test('should work with beforeCaptureScreenshot hook', {
  page: 'HelloWorld',
  config: {
    browsersInfo: [{name: 'chrome', width: 800, height: 600}]
  },
  variants: {
    'with vg': {vg: true},
  },
  test: ({driver, eyes, helpers, assert}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: true, hooks: {beforeCaptureScreenshot: `document.body.style.backgroundColor = 'gold'`}})
    eyes.close()
  }
})

test('lazy load page with default options', {
  page: 'LazyLoad',
  variants: {
    '': {config: {baselineName: 'LazyLoad'}},
    'with vg': {vg: true, config: {baselineName: 'LazyLoad_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: true, lazyLoad: {}})
    eyes.close()
  },
})

test('lazy load page with all options specified', {
  page: 'LazyLoad',
  variants: {
    '': {config: {baselineName: 'LazyLoad'}},
    'with vg': {vg: true, config: {baselineName: 'LazyLoad_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: true, lazyLoad: {
       scrollLength: 500,
       waitingTime: 500,
       maxAmountToScroll: 10000, 
    }})
    eyes.close()
  },
})

test('lazy load page with one option specified scrollLength', {
  page: 'LazyLoad',
  variants: {
    '': {config: {baselineName: 'LazyLoad'}},
    'with vg': {vg: true, config: {baselineName: 'LazyLoad_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: true, lazyLoad: {
       scrollLength: 500,
    }})
    eyes.close()
  },
})

test('lazy load page with one option specified waitingTime', {
  page: 'LazyLoad',
  variants: {
    '': {config: {baselineName: 'LazyLoad'}},
    'with vg': {vg: true, config: {baselineName: 'LazyLoad_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: true, lazyLoad: {
       waitingTime: 300,
    }})
    eyes.close()
  },
})

test('lazy load page with one option specified maxAmountToScroll', {
  page: 'LazyLoad',
  variants: {
    '': {config: {baselineName: 'LazyLoad'}},
    'with vg': {vg: true, config: {baselineName: 'LazyLoad_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: true, lazyLoad: {
       maxAmountToScroll: 10000, 
    }})
    eyes.close()
  },
})

test('lazy load inside scrollRootElement', {
  page: 'LazyLoadInsideScrollableArea',
  variants: {
    '': {config: {baselineName: 'LazyLoadInsideScrollableArea'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({scrollRootElement: '#sre', isFully: true, lazyLoad: {
      waitingTime: 500,
    }})
    eyes.close()
  },
})

test('should override default value of fully', {
  page: 'Default',
  variants: {
    'with true': {config: {forceFullPageScreenshot: true}},
    'with false': {config: {forceFullPageScreenshot: false}},
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({name: 'default'})
    eyes.check({name: 'default', region: {type: 'css', selector: '#overflowing-div-image'}})
    eyes.check({name: 'fully', isFully: true})
    eyes.check({name: 'fully', region: {type: 'css', selector: '#overflowing-div-image'}, isFully: true})
    eyes.check({name: 'not fully', isFully: false})
    eyes.check({name: 'not fully', region: {type: 'css', selector: '#overflowing-div-image'}, isFully: false})
    eyes.close()
  }
})

test('should capture webview when specified in check settings on ios', {
  env: {device: 'iPhone 12', app: 'https://applitools.jfrog.io/artifactory/Examples/IOSTestApp/1.9/app/IOSTestApp.zip'},
  config: {forceFullPageScreenshot: false},
  features: ['sauce'],
  test: ({driver, eyes}) => {
    driver.click({type: TYPE.ACCESSIBILITY_ID, selector: 'Web view'})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({webview: true})
    // NOTE:
    // this check command is omitted because the webview id is dynamcially generated in the ios test app
    // keeping it here but commented out for reference
    //
    // eyes.check({webview: 'WEBVIEW_3055.1'})
    eyes.close()
  },
})

test('should capture webview when specified in check settings on android', {
  env: {device: 'Pixel 3a XL', app: 'https://applitools.jfrog.io/artifactory/Examples/android/1.3/app-debug.apk'},
  config: {forceFullPageScreenshot: false},
  features: ['sauce'],
  test: ({driver, eyes}) => {
    driver.click({type: TYPE.ID, selector: 'com.applitools.eyes.android:id/btn_web_view'})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({webview: true})
    eyes.check({webview: 'WEBVIEW_com.applitools.eyes.android'})
    eyes.close()
  },
})

test('should support removal of duplicate test results', {
  page: 'Default',
  variants: {
    'with classic': {vg: false},
    'with ufg': {vg: true},
  },
  config: {
    removeDuplicateTests: true,
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: false})
    eyes.close(false)
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: false})
    eyes.close(false)
    const results = eyes.runner.getAllTestResults(false)
    assert.equal(results.getAllResults().length, 1)
  },
})

test('should skip removal of duplicate test results when baseline name used', {
  page: 'Default',
  variants: {
    'with classic': {vg: false},
    'with ufg': {vg: true},
  },
  config: {
    removeDuplicateTests: true,
    baselineEnvName: 'default-page',
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: false})
    eyes.close(false)
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({isFully: false})
    eyes.close(false)
    const results = eyes.runner.getAllTestResults(false)
    assert.equal(results.getAllResults().length, 2)
  },
})

test('should send ufg options', {
  page: 'AdjustDocumentHeight',
  vg: true,
  config: {
    browsersInfo: [{name: 'chrome', width: 640, height: 480}],
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({isFully: false, visualGridOptions: {adjustDocumentHeight: false}})
    eyes.check({isFully: false, visualGridOptions: {adjustDocumentHeight: true}})
    eyes.close()
  }
})

test('appium check window with nml', {
  variants: {
    'on android': {env: {nml: true, device: 'Pixel 3a XL', app: 'https://applitools.jfrog.io/artifactory/Examples/SimpleApp26Sep.apk',}, features: ['sauce']},
    'on ios': {env: {nml: true, device: 'iPhone 12', app: 'https://applitools.jfrog.io/artifactory/ufg-mobile/UFGTestApp_x86.app.zip'}, features: ['sauce']},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Appium SDK - Classic API'})
    eyes.check({isFully: false})
    eyes.close()
  },
})

test('appium check window with nml use system screenshot', {
  variants: {
    'on android': {env: {nml: true, device: 'Pixel 3a XL', app: 'https://applitools.jfrog.io/artifactory/Examples/SimpleApp26Sep.apk',}, features: ['sauce']},
    'on ios': {env: {nml: true, device: 'iPhone 12', app: 'https://applitools.jfrog.io/artifactory/ufg-mobile/UFGTestApp_x86.app.zip'}, features: ['sauce']},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Appium SDK - Classic API'})
    eyes.check({isFully: false, useSystemScreenshot: true})
    eyes.close()
  },
})
// #endregion
