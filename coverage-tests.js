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
    Demo: 'https://demo.applitools.com',
    PageWithFrameHiddenByBar: 'https://applitools.github.io/demo/TestPages/PageWithFrameHiddenByBar/index.html'
  },
})

// #region CHECK WINDOW

test('check window', {
  page: 'Default',
  variants: {
    'with css stitching classic': {api: 'classic', config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow'}},
    //'with scroll stitching classic': {api: 'classic', config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Scroll'}},
    //'with vg classic': {api: 'classic', vg: true, config: {baselineName: 'TestCheckWindow_VG'}},
    //'with css stitching': {config: {stitchMode: 'CSS', baselineName: 'TestCheckWindow'}},
    //'with scroll stitching': {config: {stitchMode: 'Scroll', baselineName: 'TestCheckWindow_Scroll'}},
    //'with vg': {vg: true, config: {baselineName: 'TestCheckWindow_VG'}},
  },
  test({eyes}) {
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.check()
    eyes.close()
  },
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

// #endregion
