const url = 'https://applitools.github.io/demo/TestPages/FramesTestPage/'
const viewportSize = {width: 700, height: 460}
const throwException = true

module.exports = {
  TestAbortIfNotClosed: ({driver, eyes}) => {
    driver.visit('data:text/html,<p>Test</p>')
    eyes.open({appName: 'Test Abort', viewportSize: {width: 1200, height: 800}})
    eyes.check()
    eyes.abort()
  },
  TestAcmeLogin: ({driver, eyes}) => {
    driver.visit('https://afternoon-savannah-68940.herokuapp.com/#')
    eyes.open({appName: 'Eyes Selenium SDK - ACME', viewportSize: {width: 1024, height: 768}})
    const username = driver.findElement('#username').ref('username')
    driver.type(username, 'adamC')
    const password = driver.findElement('#password').ref('password')
    driver.type(password, 'MySecret123?')
    eyes.check({region: '#username'})
    eyes.check({region: '#password'})
    eyes.close(throwException)
  },
  TestCheckElementFully_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#overflowing-div-image', isFully: true})
    eyes.close(throwException)
  },
  TestCheckElementWithIgnoreRegionByElementOutsideTheViewport_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div']})
    eyes.close(throwException)
  },
  TestCheckElementWithIgnoreRegionBySameElement_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#overflowing-div-image', ignoreRegions: ['#overflowing-div-image']})
    eyes.close(throwException)
  },
  TestCheckFrame: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkFrame('[name="frame1"]')
    eyes.close(throwException)
  },
  TestCheckFrame_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({frames: ['[name="frame1"]']})
    eyes.close(throwException)
  },
  TestCheckFrameFully_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({frames: ['[name="frame1"]'], isFully: true})
    eyes.close(throwException)
  },
  TestCheckFrameInFrame_Fully_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({frames: ['[name="frame1"]', '[name="frame1-1"]'], isFully: true})
    eyes.close(throwException)
  },
  TestCheckFrameInFrame_Fully_Fluent2: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({isFully: true})
    eyes.check({frames: ['[name="frame1"]', '[name="frame1-1"]'], isFully: true})
    eyes.close(throwException)
  },
  TestCheckFullWindowWithMultipleIgnoreRegionsBySelector_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['.ignore'], isFully: true})
    eyes.close(throwException)
  },
  TestCheckOverflowingRegionByCoordinates_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: {left: 50, top: 110, width: 90, height: 550}})
    eyes.close(throwException)
  },
  TestCheckPageWithHeader_Window: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({isFully: false})
    eyes.close(throwException)
  },
  TestCheckPageWithHeader_Window_Fully: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({isFully: true})
    eyes.close(throwException)
  },
  TestCheckPageWithHeader_Region: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({region: 'div.page', isFully: false})
    eyes.close(throwException)
  },
  TestCheckPageWithHeader_Region_Fully: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/PageWithHeader/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Page With Header', viewportSize})
    eyes.check({region: 'div.page', isFully: true})
    eyes.close(throwException)
  },
  TestCheckRegion: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkElementBy('#overflowing-div')
    eyes.close(throwException)
  },
  TestCheckRegion2: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkElementBy('#overflowing-div-image')
    eyes.close(throwException)
  },
  TestCheckRegionInAVeryBigFrame: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
    eyes.check({region: 'img', frames: ['[name="frame1"]']})
    eyes.close(throwException)
  },
  TestCheckRegionInAVeryBigFrameAfterManualSwitchToFrame: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/WixLikeTestPage/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Special Cases', viewportSize})
    driver.switchToFrame(driver.findElement('[name="frame1"]'))
    eyes.check({region: 'img'})
    eyes.close(throwException)
  },
  TestCheckRegionByCoordinates_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: {left: 50, top: 70, width: 90, height: 110}})
    eyes.close(throwException)
  },
  TestCheckRegionByCoordinateInFrame_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      region: {left: 30, top: 40, width: 400, height: 1200},
      frames: ['[name="frame1"]'],
    })
    eyes.close(throwException)
  },
  TestCheckRegionByCoordinateInFrameFully_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      region: {left: 30, top: 40, width: 400, height: 1200},
      frames: ['[name="frame1"]'],
      isFully: true,
    })
    eyes.close(throwException)
  },
  TestCheckRegionBySelectorAfterManualScroll_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.executeScript('window.scrollBy(0, 250)')
    eyes.check({region: '#centered'})
    eyes.close(throwException)
  },
  TestCheckRegionInFrame: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkRegionInFrame('[name="frame1"]', '#inner-frame-div', null, '', true)
    eyes.close(throwException)
  },
  TestCheckRegionInFrame_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
    eyes.close(throwException)
  },
  TestCheckRegionInFrame3_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      frames: ['[name="frame1"]'],
      floatingRegions: [
        {
          region: {left: 25, top: 25, width: 25, height: 25},
          maxUp: 200,
          maxDown: 200,
          maxLeft: 150,
          maxRight: 150,
        },
      ],
      matchLevel: 'Layout',
      isFully: true,
    })
    eyes.close(throwException)
  },
  TestCheckRegionWithIgnoreRegion_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      region: '#overflowing-div',
      ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
    })
    eyes.close(throwException)
  },
  TestCheckScrollableModal: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    const element = driver.findElement('#centered').ref('element')
    driver.click(element)
    eyes.check({region: '#modal-content', scrollRootElement: '#modal1', isFully: true})
    eyes.close(throwException)
  },
  TestCheckWindow: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkWindow()
    eyes.close(throwException)
  },
  TestCheckWindow_Body: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
    eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
    eyes.check({scrollRootElement: 'body', isFully: true})
    eyes.close(throwException)
  },
  TestCheckWindow_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check()
    eyes.close(throwException)
  },
  TestCheckWindow_Html: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/scrollablebody.html')
    eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
    eyes.check({scrollRootElement: 'html', isFully: true})
    eyes.close(throwException)
  },
  TestCheckWindow_Simple_Html: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/SimpleTestPage/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Scroll Root Element', viewportSize})
    eyes.check({scrollRootElement: 'html', isFully: true})
    eyes.close(throwException)
  },
  TestCheckWindowAfterScroll: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    driver.executeScript('window.scrollBy(0, 350)')
    eyes.checkWindow()
    eyes.close(throwException)
  },
  TestCheckWindowFully: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkWindow('', 0, true)
    eyes.close(throwException)
  },
  TestCheckWindowViewport: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkWindow()
    eyes.close(throwException)
  },
  TestCheckWindowWithFloatingByRegion_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      floatingRegions: [
        {
          region: {left: 10, top: 10, width: 20, height: 10},
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      ],
    })
    eyes.close(throwException)
  },
  TestCheckWindowWithFloatingBySelector_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({
      floatingRegions: [
        {
          region: '#overflowing-div',
          maxUp: 3,
          maxDown: 3,
          maxLeft: 20,
          maxRight: 30,
        },
      ],
    })
    eyes.close(throwException)
  },
  TestCheckWindowWithIgnoreBySelector_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['#overflowing-div']})
    eyes.close(throwException)
  },
  TestCheckWindowWithIgnoreBySelector_Centered_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['#centered']})
    eyes.close(throwException)
  },
  TestCheckWindowWithIgnoreBySelector_Stretched_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({ignoreRegions: ['#stretched']})
    eyes.close(throwException)
  },
  TestCheckWindowWithIgnoreRegion_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    const input = driver.findElement('input').ref('input')
    driver.type(input, 'My Input')
    eyes.check({
      ignoreRegions: [{left: 50, top: 50, width: 100, height: 100}],
      isFully: true,
    })
    eyes.close(throwException)
  },
  TestDoubleCheckWindow: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Classic API', viewportSize})
    eyes.checkWindow('first')
    eyes.checkWindow('second')
    eyes.close(throwException)
  },
  TestSimpleRegion: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: {left: 50, top: 50, width: 100, height: 100}})
    eyes.close(throwException)
  },
  TestScrollbarsHiddenAndReturned_Fluent: ({driver, eyes}) => {
    driver.visit(url)
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({isFully: true})
    eyes.check({region: '#inner-frame-div', frames: ['[name="frame1"]'], isFully: true})
    eyes.check({isFully: true})
    eyes.close(throwException)
  },
  TestCheckFixedRegion: ({driver, eyes}) => {
    driver.visit('http://applitools.github.io/demo/TestPages/fixed-position')
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#fixed'})
    eyes.close(throwException)
  },
  TestCheckFixedRegion_Fully: ({driver, eyes}) => {
    driver.visit('http://applitools.github.io/demo/TestPages/fixed-position')
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    eyes.check({region: '#fixed', isFully: true})
    eyes.close(throwException)
  },
  TestSimpleModal: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/ModalsPage/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_simple_modal')
    eyes.check({region: '#simple_modal > .modal-content'})
    eyes.close(throwException)
  },
  TestScrollableModal_Fully: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/ModalsPage/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_scrollable_modal')
    eyes.check({
      region: '#scrollable_modal > .modal-content',
      scrollRootElement: '#scrollable_modal',
      isFully: true,
    })
    eyes.close(throwException)
  },
  TestScrollableContentInModal_Fully: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/ModalsPage/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_scrollable_content_modal')
    eyes.check({
      region: '#scrollable_content_modal > .modal-content',
      scrollRootElement: '#scrollable_content_modal',
      isFully: true,
    })
    eyes.close(throwException)
  },
  TestWindowWithModal_Fully: ({driver, eyes}) => {
    driver.visit('https://applitools.github.io/demo/TestPages/ModalsPage/index.html')
    eyes.open({appName: 'Eyes Selenium SDK - Fluent API', viewportSize})
    driver.click('#open_scrollable_modal')
    eyes.check({scrollRootElement: '#scrollable_modal', isFully: true})
    eyes.close(throwException)
  },
  TestTooBigViewportSize: {
    options: {
      capabilities: {
        browserName: 'chrome',
        browserVersion: 'latest',
        platformName: 'Windows 10',
        'sauce:options': {
          screenResolution: '1280x800',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
        },
      },
      host: 'https://ondemand.saucelabs.com:443/wd/hub',
    },
    test: ({driver, eyes, assert}) => {
      eyes.open({
        appName: 'Eyes Selenium SDK - Fluent API',
        viewportSize: {width: 5000, height: 5000},
      })
      const cachedViewportSize = eyes.getViewportSize().ref('cachedViewportSize')
      const expectedViewportSize = driver
        .executeScript('return {height: window.innerHeight, width: window.innerWidth}')
        .type('Map<String, Number>')
        .ref('expectedViewportSize')
      assert.strictEqual(cachedViewportSize.getWidth(), expectedViewportSize.width)
      assert.strictEqual(cachedViewportSize.getHeight(), expectedViewportSize.height)
      eyes.close(false)
    },
  },
  TestSetViewportSize: ({driver, eyes, assert}) => {
    const expectedViewportSize = {width: 600, height: 600}
    eyes.constructor.setViewportSize(expectedViewportSize)
    const actualViewportSize = driver
      .executeScript('return {width: window.innerWidth, height: window.innerHeight}')
      .type('Map<String, Number>')
      .ref('actualViewportSize')
    assert.deepStrictEqual(actualViewportSize, expectedViewportSize)
  },
  TestSetViewportSizeEdge: {
    options: {
      capabilities: {
        browserName: 'MicrosoftEdge',
        browserVersion: '18',
        platformName: 'Windows 10',
        'sauce:options': {
          screenResolution: '1920x1080',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
        },
      },
      host: 'https://ondemand.saucelabs.com:443/wd/hub',
    },
    // TODO : this is exactly the same test as TestSetViewportSize only on Edge
    test: ({driver, eyes, assert}) => {
      const expectedViewportSize = {width: 600, height: 600}
      eyes.constructor.setViewportSize(expectedViewportSize)
      const actualViewportSize = driver
        .executeScript('return {width: window.innerWidth, height: window.innerHeight}')
        .type('Map<String, Number>')
        .ref('actualViewportSize')
      assert.deepStrictEqual(actualViewportSize, expectedViewportSize)
    },
  },
  TestVisualLocators: ({driver, eyes, assert}) => {
    driver.visit(url)
    eyes.open({appName: 'Applitools Eyes SDK'})
    const regionsMap = eyes
      .locate({locatorNames: ['applitools_title']})
      .type('Map<String, List<Region>>')
      .ref('regionsMap')
    eyes.close(false)
    assert.deepStrictEqual(regionsMap, {
      applitools_title: [{left: 2, top: 11, width: 173, height: 58}],
    })
  },
  AppiumAndroidCheckRegion: {
    options: {
      capabilities: {
        browserName: '',
        name: 'Android Demo',
        platformName: 'Android',
        platformVersion: '7.0',
        appiumVersion: '1.17.1',
        deviceName: 'Samsung Galaxy S8 FHD GoogleAPI Emulator',
        app: 'https://applitools.bintray.com/Examples/eyes-android-hello-world.apk',
        automationName: 'uiautomator2',
        username: process.env.SAUCE_USERNAME,
        accesskey: process.env.SAUCE_ACCESS_KEY,
      },
      host: 'https://ondemand.saucelabs.com:443/wd/hub',
    },
    test: ({eyes}) => {
      eyes.open({appName: 'Applitools Eyes SDK'})
      eyes.check({region: 'android.widget.Button'})
      eyes.close(throwException)
    },
  },
  TestHorizonalScroll: {
    options: {
      capabilities: {
        browserName: 'firefox',
        'sauce:options': {
          seleniumVersion: '3.141.59',
          username: process.env.SAUCE_USERNAME,
          accesskey: process.env.SAUCE_ACCESS_KEY,
        }
      },
      host: 'https://ondemand.saucelabs.com:443/wd/hub',
    },
    test: ({driver, eyes}) => {
      driver.visit('https://applitools.github.io/demo/TestPages/horizontal-scroll.html')
      eyes.open({appName: 'Applitools Eyes SDK', viewportSize: {width: 600, height: 400}})
      eyes.check({isFully: true})
      eyes.close(throwException)
    }
  }
}
