/* eslint-disable */
const viewportSize = {width: 700, height: 460}

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
test('check hovered region by element', {
  page: 'StickyHeaderWithRegions',
  config: {hideScrollbars: false},
  variants: {
    'with css stitching': {config: {stitchMode: 'CSS'}},
    'with scroll stitching': {config: {stitchMode: 'Scroll'}},
  },
  test({driver, eyes}) {
    eyes.open({appName: 'Applitools Eyes SDK', viewportSize})
    const input = driver.findElement('#input').ref('input')
    driver.scrollIntoView(input)
    driver.hover(input)
    eyes.check({region: input})
    eyes.close()
  }
})
