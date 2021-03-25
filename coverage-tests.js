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
    Acme: 'https://afternoon-savannah-68940.herokuapp.com/#',
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
  },
})

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
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check()
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

test('check window after manual scroll', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindowAfterScroll'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindowAfterScroll_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowAfterScroll_VG'}},

    'on safari 11': {env: {browser: 'safari-11', legacy: true}, features: ['webdriver']},
    'on safari 12': {env: {browser: 'safari-12', legacy: true}, features: ['webdriver']}
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    driver.executeScript('window.scrollBy(0, 350)')
    eyes.check()
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
    eyes.check({name: 'first'})
    eyes.check({name: 'second'})
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
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    const expectedViewportSize = driver.executeScript('return {width: window.innerWidth, height: window.innerHeight}')
    eyes.check({layoutBreakpoints: [500, 1000]})
    eyes.close()
    const actualViewportSize = driver.executeScript('return {width: window.innerWidth, height: window.innerHeight}')
    assert.equal(actualViewportSize, expectedViewportSize)
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
    eyes.check()
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
  env: {device: 'Android 8.0 Chrome Emulator'},
  variants: {
    'on mobile page': {page: 'ResolutionMobile', config: {baselineName: 'Android Emulator 8.0 Portrait mobile fully', parentBranchName: 'default'}},
    'on mobile page with horizontal scroll': {page: 'ResolutionMobileHorizontalScroll', config: {baselineName: 'Android Emulator 8.0 Portrait scrolled_mobile fully', parentBranchName: 'default'}},
    'on desktop page': {page: 'Resolution', config: {baselineName: 'Android Emulator 8.0 Portrait desktop fully', parentBranchName: 'default'}},
  },
  test({eyes}) {
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
    'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'TestCheckFrame_VG', appName: 'Eyes Selenium SDK - Classic API'}},
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFrame_Fluent', appName: 'Eyes Selenium SDK - Fluent API'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFrame_Fluent_Scroll', appName: 'Eyes Selenium SDK - Fluent API'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckFrame_VG', appName: 'Eyes Selenium SDK - Classic API'}},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckFrameFully_Fluent_VG'}},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckFrameInFrame_Fully_Fluent_VG'}},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckFrameInFrame_Fully_Fluent2_VG'}},
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
    'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'TestCheckInnerFrame_VG'}}
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    driver.executeScript('document.documentElement.scrollTop = 350')
    const frame = driver.findElement('[name="frame1"]')
    driver.switchToFrame(frame)
    eyes.check({frames: ['frame1-1']})
    eyes.check()
    driver.executeScript('document.body.style.background = "red"')
    eyes.check()
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
    'on ie': {env: {browser: 'ie-11'}},
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

test('check region by native selector', {
  features: ['native-selectors'],
  env: {
    device: 'Samsung Galaxy S8',
    app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk',
  },
  config: {baselineName: 'AppiumAndroidCheckRegion'},
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: 'android.widget.Button'})
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
    driver.scrollIntoView(input)
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionByCoordinateInFrame_Fluent_VG'}},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionByCoordinateInFrameFully_Fluent_VG'}},
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
    'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'TestCheckRegionInFrame_VG'}},
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionInFrame_VG'}},
    'on firefox legacy': {config: {baselineName: 'TestCheckRegionInFrame_Scroll'}, env: {browser: 'firefox-48', legacy: true}}
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionInAVeryBigFrame_VG'}},
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
      scrollRootElement: 'body',
      frames: [{frame: 'frame-list', scrollRootElement: 'body'}],
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame_VG'}},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckLongIFrameModal_VG'}},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckLongOutOfBoundsIFrameModal_VG'}},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowWithIgnoreBySelector_Fluent_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['#overflowing-div']})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.ignore[0],
      {left: 8, top: 81, width: 304, height: 184},
    )
  },
})

test('should send ignore regions by selector', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['.ignore'], isFully: true})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    const imageMatchSettings = info.actualAppOutput[0].imageMatchSettings
    const expectedIgnoreRegions = [
      {left: 10, top: 286, width: 800, height: 500},
      {left: 122, top: 933, width: 456, height: 306},
      {left: 8, top: 1277, width: 690, height: 206},
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
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div-image']})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.ignore[0],
      {left: 0, top: 0, width: 304, height: 184},
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
    'with vg': {vg: true, config: {baselineName: 'TestCheckWindowWithFloatingBySelector_Fluent_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      floatingRegions: [
        {
          region: '#overflowing-div',
          maxUpOffset: 3,
          maxDownOffset: 3,
          maxLeftOffset: 20,
          maxRightOffset: 30,
        },
      ],
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
      info.actualAppOutput[0].imageMatchSettings.floating[0],
      {left: 8, top: 81, width: 304, height: 184, maxUpOffset: 3, maxDownOffset: 3, maxLeftOffset: 20, maxRightOffset: 30},
    )
  },
})

test('should send floating region by coordinates in frame', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckRegionInFrame3_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckRegionInFrame3_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestCheckRegionInFrame3_Fluent_VG'}},
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

test('should send accessibility regions by selector', {
  page: 'Default',
  config: {
    defaultMatchSettings: {
      accessibilitySettings: {level: 'AAA', guidelinesVersion: 'WCAG_2_0'}
    }
  },
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestAccessibilityRegions'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestAccessibilityRegions_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestAccessibilityRegions_VG'}},
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      accessibilityRegions: [{region: '.ignore', type: 'LargeText'}]
    })
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    const imageMatchSettings = info.actualAppOutput[0].imageMatchSettings
    assert.equal(imageMatchSettings.accessibilitySettings.level, 'AAA')
    assert.equal(imageMatchSettings.accessibilitySettings.version, 'WCAG_2_0')
    const expectedAccessibilityRegions = [
      {isDisabled: false, type: 'LargeText', left: 10, top: 286, width: 800, height: 500},
      {isDisabled: false, type: 'LargeText', left: 122, top: 933, width: 456, height: 306},
      {isDisabled: false, type: 'LargeText', left: 8, top: 1277, width: 690, height: 206},
    ]
    for (const [index, expectedAccessibilityRegion] of expectedAccessibilityRegions.entries()) {
      assert.equal(imageMatchSettings.accessibility[index], expectedAccessibilityRegion)
    }
  }
})

test('should send region by selector in padded page', {
  page: 'PaddedBody',
  config: {baselineName: 'Test Layout Region within Target Region', stitchMode: 'CSS'},
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Test Layout Region within Target Region', viewportSize: {height: 700, width: 1100}})
    eyes.check({isFully: true, region: '.main', layoutRegions: ['.minions']})
    const result = eyes.close(false)
    const info = helpers.getTestInfo(result)
    assert.equal(
      info['actualAppOutput']['0']['imageMatchSettings']['layout']['0'],
      {left: 0, top: 81, width: 1084, height: 679}
    )
  }
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
    'on edge legacy': {env: {browser: 'edge-18'}},
    'on ie': {env: {browser: 'ie-11'}},
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
    assert.equal(scrollingElements.length, 0)
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
    assert.equal(scrollingElements.length, 0)
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
    assert.equal(scrollingElements.length, 0)
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

test('should send custom batch properties', {
  page: 'Default',
  config: {
    batch: {id: `batch_${Date.now()}`, properties: [{name: 'custom_prop', value: 'custom value'}]}
  },
  test({eyes, assert, helpers}) {
    eyes.open({appName: 'Eyes Selenium SDK - Custom Batch Properties', viewportSize});
    const result = eyes.close();
    const info = helpers.getTestInfo(result); 
    assert.equal(info.startInfo.batchInfo.properties.length, 1)
    assert.equal(info.startInfo.batchInfo.properties[0], {name: 'custom_prop', value: 'custom value'})
  },
})

test('should hide and restore scrollbars', {
  page: 'Default',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestScrollbarsHiddenAndReturned_Fluent'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestScrollbarsHiddenAndReturned_Fluent_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestScrollbarsHiddenAndReturned_Fluent_VG'}},
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
    assert.equal(texts[1], 'Header 2: He110 w0rld!')
    assert.equal(texts[2], 'imagination be your guide.')
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
    assert.equal(regions[patterns[1]][0].text, '1. One')
    assert.equal(regions[patterns[1]][1].text, '2. Two')
    assert.equal(regions[patterns[1]][2].text, '3. Three')
    assert.equal(regions[patterns[1]][3].text, '4. Four')

    // assert.equal(regions[patterns[2]].length, 2)
    assert.equal(regions[patterns[2]][0].text, 'choose to make it that way. Just make a decision and let')
    // assert.equal(regions[patterns[2]][1].text, 'I can make this world as happy as I want it')
  },
})

test('should return actual viewport size', {
  env: {browser: 'chrome', headless: false},
  test({driver, eyes, assert}) {
    eyes.open({
      appName: 'Eyes Selenium SDK - Fluent API',
      viewportSize: {width: 5000, height: 5000},
    })
    const cachedViewportSize = eyes.getViewportSize()
    const expectedViewportSize = driver.executeScript('return {height: window.innerHeight, width: window.innerWidth}').type('Map<String, Number>')
    assert.equal(cachedViewportSize.getWidth().type('Number'), expectedViewportSize.width)
    assert.equal(cachedViewportSize.getHeight().type('Number'), expectedViewportSize.height)
    eyes.close(false)
  },
})

test('should set viewport size', {
  variants: {
    '': {env: {browser: 'chrome'}},
    'on edge legacy': {env: {browser: 'edge-18'}},
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
    '': {env: {browser: 'chrome'}},
    'on android': {env: {browser: 'chrome', device: 'Android 8.0 Chrome Emulator'}},
  },
  test({driver, eyes}) {
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage')
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
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

test('should handle check of stale element if selector is preserved', {
  skip: true,
  features: ['webdriver'],
  test({driver, eyes}) {
    driver.visit('http://localhost:5000/TestPages/RefreshDomPage/auto-refresh')
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
    const element = driver.findElement('#inner-img')
    driver.click('#refresh-button')
    eyes.check({region: element})
    eyes.close()
  },
})

test('should handle check of stale element in frame if selector is preserved', {
  skip: true,
  features: ['webdriver'],
  test({driver, eyes}) {
    driver.visit('https://applitools.github.io/demo/TestPages/RefreshDomPage/iframe')
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 500}})
    const frameElement = driver.findElement('[name="frame"]')
    driver.switchToFrame(frameElement)
    const element = driver.findElement('#inner-img')
    driver.click('#refresh-button')
    driver.switchToFrame(null)

    eyes.check({frames: [frameElement], region: element})
    eyes.close()
  },
})

test('should abort if not closed', {
  variants: {
    '': {vg: false},
    'with vg': {vg: true},
  },
  test({driver, eyes}) {
    driver.visit('https://applitools.github.io/demo/TestPages/FramesTestPage/')
    eyes.open({appName: 'Test Abort', viewportSize: {width: 1200, height: 800}})
    eyes.check()
    eyes.abort()
  },
})

test('should throw if no checkpoints before close', {
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

test('acme login', {
  page: 'Acme',
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestAcmeLogin'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestAcmeLogin_Scroll'}},
    'with vg': {vg: true, config: {baselineName: 'TestAcmeLogin_VG'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - ACME', viewportSize: {width: 1024, height: 768}})
    driver.type(driver.findElement('#username'), 'adamC')
    driver.type(driver.findElement('#password'), 'MySecret123?')
    eyes.check({region: '#username'})
    eyes.check({region: '#password'})
    eyes.close()
  },
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
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({frames: ['[name="frame1"]'], region: '#div1', isFully: true})
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
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk'},
  config: {baselineName: 'Appium_Android_CheckWindow'},
  features: ['native-selectors'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.CLASSNAME, selector: 'android.widget.Button'})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({ignoreRegions: [{type: TYPE.CLASSNAME, selector: 'android.widget.Button'}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 136, top: 237, width: 90, height: 48},
    )
  },
})

test('appium android check region with ignore region', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk'},
  config: {baselineName: 'Appium_Android_CheckRegionWithIgnoreRegion'},
  features: ['native-selectors'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.CLASSNAME, selector: 'android.widget.Button'})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.ID, selector: 'com.applitools.helloworld.android:id/image_container'},ignoreRegions: [{type: TYPE.ANDROID_UI_AUTOMATOR, selector: 'new UiSelector().textContains("You successfully clicked the button!")'}, {type: TYPE.ID, selector: 'com.applitools.helloworld.android:id/image'}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 53, top: 0, width: 254, height: 22},
    )
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[1],
        {left: 0, top: 21, width: 360, height: 234},
    )
  },
})

test('appium android check region', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk'},
  config: {baselineName: 'Appium_Android_CheckRegion'},
  features: ['native-selectors'],
  test: ({eyes}) => {
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.CLASSNAME, selector: 'android.widget.Button'}})
    eyes.close()
  },
})

test('appium iOS check window', {
  env: {device: 'iPhone XS', app: 'https://applitools.bintray.com/Examples/eyes-ios-hello-world/1.2/eyes-ios-hello-world.zip'},
  config: {baselineName: 'Appium_iOS_CheckWindow'},
  features: ['native-selectors'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeButton'"})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({ignoreRegions: [{type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeButton'"}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 155, top: 258, width: 65, height: 30},
    )
  },
})

test('appium iOS check region with ignore region', {
  env: {device: 'iPhone XS', app: 'https://applitools.bintray.com/Examples/eyes-ios-hello-world/1.2/eyes-ios-hello-world.zip'},
  config: {baselineName: 'Appium_iOS_CheckRegionWithIgnoreRegion'},
  features: ['native-selectors'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.IOS_PREDICATE, selector: "type == 'XCUIElementTypeButton'"})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({region: {type: TYPE.ACCESSIBILITY_ID, selector: 'BottomContainer'},ignoreRegions: [{type: TYPE.ACCESSIBILITY_ID, selector: 'BottomLabel'}, {type: TYPE.ACCESSIBILITY_ID, selector: 'BottomImage'}]})
    const result = eyes.close()
    const info = helpers.getTestInfo(result)
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[0],
        {left: 0, top: 0, width: 343, height: 21},
    )
    assert.equal(
        info.actualAppOutput[0].imageMatchSettings.ignore[1],
        {left: 115, top: 35, width: 113, height: 65},
    )
  },
})

test('appium iOS check region', {
  env: {device: 'iPhone XS', app: 'https://applitools.bintray.com/Examples/eyes-ios-hello-world/1.2/eyes-ios-hello-world.zip'},
  config: {baselineName: 'Appium_iOS_CheckRegion'},
  features: ['native-selectors'],
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
    browsersInfo: [
      {name: 'chrome', width: 640, height: 480},
    ],
  },
  test({eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({fully: false})
    eyes.close()
  }
})

test('adopted styleSheets on firefox', {
  page: 'AdoptedStyleSheets',
  vg: true,
  config: {
    browsersInfo: [
      {name: 'firefox', width: 640, height: 480},
    ],
  },
  test({eyes, assert}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({fully: false})
    assert.throws(() => eyes.close())
    // TODO assert test is aborted
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    eyes.check({fully: false, visualGridOptions: {polyfillAdoptedStyleSheets: true}})
    eyes.check({fully: false, visualGridOptions: {polyfillAdoptedStyleSheets: false}})
    eyes.close()
  }
})
// #endregion
