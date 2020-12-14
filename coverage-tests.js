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

test('appium android check window', {
  env: {device: 'Samsung Galaxy S8', app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk'},
  config: {baselineName: 'Appium_Android_CheckWindow'},
  features: ['native-selectors'],
  test: ({driver, eyes, helpers, assert}) => {
    driver.click({type: TYPE.CLASSNAME, selector: 'android.widget.Button'})
    eyes.open({appName: 'Applitools Eyes SDK'})
    eyes.check({ignoreRegions: [{type: TYPE.CLASSNAME, selector: 'android.widget.Button'}]})
    const result = eyes.close().ref('result')
    const info = helpers.getTestInfo(result).ref('info')
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
    const result = eyes.close().ref('result')
    const info = helpers.getTestInfo(result).ref('info')
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
    const result = eyes.close().ref('result')
    const info = helpers.getTestInfo(result).ref('info')
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
    const result = eyes.close().ref('result')
    const info = helpers.getTestInfo(result).ref('info')
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

/*test('should return actual viewport size', {
  env: {browser: 'chrome', headless: false},
  test({driver, eyes, assert}) {
    eyes.open({34
      appName: 'Eyes Selenium SDK - Fluent API',
      viewportSize: {width: 5000, height: 5000},
    })
    const cachedViewportSize = eyes.getViewportSize().ref('cachedViewportSize')
    const expectedViewportSize = driver
      .executeScript('return {height: window.innerHeight, width: window.innerWidth}')
      .type('Map<String, Number>')
      .ref('expectedViewportSize')
    assert.equal(cachedViewportSize.getWidth().type('Number'), expectedViewportSize.width)
    assert.equal(cachedViewportSize.getHeight().type('Number'), expectedViewportSize.height)
    eyes.close(false)
  },
})*/

/*test('should set viewport size', {
  variants: {
    '': {env: {browser: 'chrome'}},
    'on edge legacy': {env: {browser: 'edge-18'}},
  },
  test({driver, eyes, assert}) {
    const expectedViewportSize = {width: 600, height: 600}
    eyes.constructor.setViewportSize(expectedViewportSize)
    const actualViewportSize = driver
      .executeScript('return {width: window.innerWidth, height: window.innerHeight}')
      .type('Map<String, Number>')
      .ref('actualViewportSize')
    assert.equal(actualViewportSize, expectedViewportSize)
  },
})*/
