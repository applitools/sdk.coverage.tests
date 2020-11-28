﻿using Applitools.VisualGrid;
using NUnit.Framework;
using OpenQA.Selenium;
using System;
using OpenQA.Selenium.Chrome;
using Applitools.Selenium;
using Applitools.Tests.Utils;
using Applitools.Utils.Geometry;
using System.Collections.Generic;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Safari;
using OpenQA.Selenium.Remote;

namespace Applitools.Generated.Selenium.Tests
{
    public abstract class TestSetupGenerated : ReportingTestSuiteGenerrated
    {

        protected IWebDriver driver;
        protected EyesRunner runner;
        protected Eyes eyes;
        protected string testedPageUrl = "https://applitools.github.io/demo/TestPages/FramesTestPage/";
        public static readonly BatchInfo BatchInfo = new BatchInfo("DotNet Generated Tests");
		public static readonly string DRIVER_PATH = Environment.GetEnvironmentVariable("DRIVER_PATH");
        public static readonly string SAUCE_USERNAME = Environment.GetEnvironmentVariable("SAUCE_USERNAME");
        public static readonly string SAUCE_ACCESS_KEY = Environment.GetEnvironmentVariable("SAUCE_ACCESS_KEY");
        public static readonly string SAUCE_SELENIUM_URL = "https://ondemand.saucelabs.com:443/wd/hub";
        protected enum browserType
        {
            Chrome,
            IE,
            Edge,
            Firefox,
            Safari11,
            Safari12
        }
        protected DriverOptions options_;
        private SafariOptions browserOptions;
        private DesiredCapabilities caps;

        /*[SetUp]
        public void SetUpSelenium()
        {
            ChromeOptions options = new ChromeOptions();
            options.AddArgument("--headless");
            driver = DRIVER_PATH != null ? new ChromeDriver(DRIVER_PATH, options) : new ChromeDriver(options);
            driver.Navigate().GoToUrl(testedPageUrl);
        }*/

        protected void SetUpDriver(browserType browser = browserType.Chrome, Boolean legacy = false)
        {
            switch(browser)
            {
                case browserType.Chrome:
                    var optionsChr = new ChromeOptions();
                    driver = CreateChromeDriver();//DRIVER_PATH != null ? new ChromeDriver(DRIVER_PATH, optionsChr) : new ChromeDriver(optionsChr);
                    break;
                case browserType.Firefox:
                    var optionsFx = new FirefoxOptions();
                    optionsFx.AddArgument("--headless");
                    driver = new FirefoxDriver(DRIVER_PATH, optionsFx);
                    break;
                case browserType.IE:
                    /*var optionsIE = new InternetExplorerOptions();
                    optionsIE.BrowserVersion = "11.0";
                    optionsIE.AddAdditionalCapability("username", SAUCE_USERNAME);
                    optionsIE.AddAdditionalCapability("accesskey", SAUCE_ACCESS_KEY);*/

                    var sauceOptions = new Dictionary<string, object>();
                    sauceOptions.Add("username", SAUCE_USERNAME);
                    sauceOptions.Add("accesskey", SAUCE_ACCESS_KEY);
                    var browserOptionsIE = new InternetExplorerOptions();
                    browserOptionsIE.PlatformName = "Windows 10";
                    browserOptionsIE.BrowserVersion = "11.285";
                    browserOptionsIE.AddAdditionalCapability("sauce:options", sauceOptions, true);
                    driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), browserOptionsIE.ToCapabilities(), TimeSpan.FromMinutes(4));

                    /*browserOptions = new InternetExplorerOptions();
                    setDriverOptions(ref browserOptions, "Windows 10", "11.285");
                    driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), browserOptions.ToCapabilities(), TimeSpan.FromMinutes(4));*/
                    break;
                case browserType.Edge:
                    /*var optionsEdge = new EdgeOptions();
                    optionsEdge.BrowserVersion = "18.0";
                    optionsEdge.AddAdditionalCapability("username", SAUCE_USERNAME);
                    optionsEdge.AddAdditionalCapability("accesskey", SAUCE_ACCESS_KEY);*/
                    var sauceOptionsEdge = new Dictionary<string, object>();
                    sauceOptionsEdge.Add("username", SAUCE_USERNAME);
                    sauceOptionsEdge.Add("accesskey", SAUCE_ACCESS_KEY);
                    var browserOptionsEdge = new EdgeOptions();
                    browserOptionsEdge.PlatformName = "Windows 10";
                    browserOptionsEdge.BrowserVersion = "18.17763";
                    browserOptionsEdge.AddAdditionalCapability("sauce:options", sauceOptionsEdge);
                    driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), browserOptionsEdge.ToCapabilities(), TimeSpan.FromMinutes(4));

                    /*browserOptions = new EdgeOptions();
                    setDriverOptions(ref browserOptions, "Windows 10", "18.17763");
                    driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), browserOptions.ToCapabilities(), TimeSpan.FromMinutes(4));*/
                    break;
                case browserType.Safari11:
                    if (legacy)
                    {
                        setDesiredCapabilities("macOS 10.12", "Safari", "11.0");
                        driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), caps, TimeSpan.FromMinutes(4));
                    }
                    else
                    {
                        browserOptions = new SafariOptions();
                        setDriverOptions(ref browserOptions, "macOS 10.12", "11.0");
                        driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), browserOptions.ToCapabilities(), TimeSpan.FromMinutes(4));
                    }
                    break;
                case browserType.Safari12:
                    if (legacy)
                    {
                        setDesiredCapabilities("macOS 10.13", "Safari", "12.1");
                        driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), caps, TimeSpan.FromMinutes(4));
                    }
                    else
                    {
                        browserOptions = new SafariOptions();
                        setDriverOptions(ref browserOptions, "macOS 10.13", "12.1");
                        driver = new RemoteWebDriver(new Uri(SAUCE_SELENIUM_URL), browserOptions.ToCapabilities(), TimeSpan.FromMinutes(4));
                    }
                    break;
                default:
                    throw new Exception("Unknown browser type");
            }
        }


        private void setDriverOptions(ref SafariOptions driverOptions, string PlatformName, string BrowserVersion)
        {
            var sauceOptions = new Dictionary<string, object>();
            sauceOptions.Add("username", SAUCE_USERNAME);
            sauceOptions.Add("accesskey", SAUCE_ACCESS_KEY);
            driverOptions.PlatformName = PlatformName;
            driverOptions.BrowserVersion = BrowserVersion;
            driverOptions.AddAdditionalCapability("username", SAUCE_USERNAME);
            driverOptions.AddAdditionalCapability("accesskey", SAUCE_ACCESS_KEY);
            //driverOptions.AddAdditionalCapability("sauce:options", sauceOptions);
        }
        /*private void setDriverOptions(ref DriverOptions driverOptions, string PlatformName, string BrowserVersion)
        {
            var sauceOptions = new Dictionary<string, object>();
            sauceOptions.Add("username", SAUCE_USERNAME);
            sauceOptions.Add("accesskey", SAUCE_ACCESS_KEY);
            driverOptions.PlatformName = PlatformName;
            driverOptions.BrowserVersion = BrowserVersion;
            driverOptions.AddAdditionalCapability("username", SAUCE_USERNAME);
            driverOptions.AddAdditionalCapability("accesskey", SAUCE_ACCESS_KEY);
            //driverOptions.AddAdditionalCapability("sauce:options", sauceOptions);
        }*/

        /*private void setDriverOptions(ref InternetExplorerOptions driverOptions, string PlatformName, string BrowserVersion)
        {
            var sauceOptions = new Dictionary<string, object>();
            sauceOptions.Add("username", SAUCE_USERNAME);
            sauceOptions.Add("accesskey", SAUCE_ACCESS_KEY);
            driverOptions.PlatformName = PlatformName;
            driverOptions.BrowserVersion = BrowserVersion;
            driverOptions.AddAdditionalCapability("sauce:options", sauceOptions, true);
        }*/

        private void setDesiredCapabilities(string PlatformName, string BrowserName, string BrowserVersion)
        {
            caps = new DesiredCapabilities();
            caps.SetCapability("browserName", BrowserName);
            caps.SetCapability("platform", PlatformName);
            caps.SetCapability("version", BrowserVersion);
            caps.SetCapability("seleniumVersion", "3.4.0");
            caps.SetCapability("username", SAUCE_USERNAME);
            caps.SetCapability("accesskey", SAUCE_ACCESS_KEY);
        }

        protected static ChromeDriver CreateChromeDriver(ChromeOptions options = null)
        {
            if (options == null)
            {
                options = new ChromeOptions();
            }
            options.AddArgument("--headless");

            ChromeDriver webDriver = DRIVER_PATH != null ? new ChromeDriver(DRIVER_PATH, options) : new ChromeDriver(options);
            return webDriver;
        }

        protected void initEyes(bool isVisualGrid, bool isCSSMode)
        {
            runner = isVisualGrid ? (EyesRunner)(new VisualGridRunner(10)) : new ClassicRunner();
            eyes = new Eyes(runner);
            initEyesSettings(isVisualGrid, isCSSMode);
        }

        protected void initEyesSettings(bool isVisualGrid, bool isCSSMode)
        {
            //eyes.HostOS = "Linux";
            eyes.Batch = BatchInfo;
            if (!isVisualGrid) eyes.StitchMode = isCSSMode ? StitchModes.CSS : StitchModes.Scroll;
            eyes.BranchName = "master";
            eyes.ParentBranchName = "master";
            eyes.SaveNewTests = false;
            //eyes.AddProperty("ForceFPS", eyes.ForceFullPageScreenshot ? "true" : "false");
            //eyes.AddProperty("Agent ID", eyes.FullAgentId);
            //eyes.HideScrollbars = true;
        }


        protected bool isStaleElementError(Exception errorObj)
		{
			return (errorObj is StaleElementReferenceException);
		}

        protected void compareProcedure(Region actualRegion, Region expectedRegion, string type=null)
        {
            Region[] actualRegions = new Region[] { actualRegion };
            HashSet<Region> expectedRegions = new HashSet<Region> { expectedRegion };
            TestUtils.CompareSimpleRegionsList_(actualRegions, expectedRegions, "Region");
        }

        protected void compareProcedure(Dictionary<string, object> actualRegion, RectangleSize expectedRegion, string type)
        {
            RectangleSize actual = new RectangleSize((int)actualRegion["width"], (int)actualRegion["height"]);
            Assert.IsTrue(RectangleSize.AreEqual(expectedRegion, actual), "Actual region with Width="+ actual.Width.ToString()+" Height="+ actual.Height.ToString()+ " don't equal to expected region with Width = "+ expectedRegion.Width.ToString()+" Height = "+ expectedRegion.Height.ToString());
        }

        protected void compareProcedure(int actual, object expected, string type = null)
        {
            Assert.AreEqual((int)expected, actual);
        }

        protected void compareProcedure(FloatingMatchSettings actualRegion, FloatingMatchSettings expectedRegion, string type= "Floating")
        {
            FloatingMatchSettings[] actualRegions = new FloatingMatchSettings[] { actualRegion };
            HashSet<FloatingMatchSettings> expectedRegions = new HashSet<FloatingMatchSettings> { expectedRegion };
            HashSet<FloatingMatchSettings> expectedRegionsClone = new HashSet<FloatingMatchSettings>(expectedRegions);
            if (expectedRegions.Count > 0)
            {
                foreach (FloatingMatchSettings region in actualRegions)
                {
                    if (!expectedRegionsClone.Remove(region))
                    {
                        Assert.Fail("actual {0} region {1} not found in expected regions list", type, region);
                    }
                }
                Assert.IsEmpty(expectedRegionsClone, "not all expected regions found in actual regions list.", type);
            }
        }

        protected void compareProcedure(AccessibilityRegionByRectangle actualRegion, AccessibilityRegionByRectangle expectedRegion, string type="")
        {
            AccessibilityRegionByRectangle[] actualRegions = new AccessibilityRegionByRectangle[] { actualRegion };
            HashSet<AccessibilityRegionByRectangle> expectedRegions = new HashSet<AccessibilityRegionByRectangle> { expectedRegion };
            HashSet<AccessibilityRegionByRectangle> expectedRegionsClone = new HashSet<AccessibilityRegionByRectangle>(expectedRegions);
            if (expectedRegions.Count > 0)
            {
                foreach (AccessibilityRegionByRectangle region in actualRegions)
                {
                    if (!expectedRegionsClone.Remove(region))
                    {
                        Assert.Fail("actual {0} region {1} not found in expected regions list", type, region);
                    }
                }
                Assert.IsEmpty(expectedRegionsClone, "not all expected regions found in actual regions list.", type);
            }
        }

        protected void compareProcedure(AccessibilityLevel actualLevel, AccessibilityLevel expectedLevel, string type=null)
        {
            Assert.IsTrue(actualLevel == expectedLevel, "Actual Level '"+actualLevel.ToString()+"' don't equal to Expected Level '" + expectedLevel.ToString() + "'");
        }

        protected void compareProcedure(AccessibilityGuidelinesVersion actualVersion, AccessibilityGuidelinesVersion expectedVersion, string type = null)
        {
            Assert.IsTrue(actualVersion == expectedVersion, "Actual Version '" + actualVersion.ToString() + "' don't equal to Expected Version '" + expectedVersion.ToString() + "'");
        }

        protected void compareProcedure(Boolean actual, Boolean expected, string type = null)
        {
            Assert.AreEqual(expected, actual);
        }
    }
}
