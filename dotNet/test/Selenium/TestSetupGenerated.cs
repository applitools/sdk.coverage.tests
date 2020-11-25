using Applitools.VisualGrid;
using NUnit.Framework;
using OpenQA.Selenium;
using System;
using OpenQA.Selenium.Chrome;
using Applitools.Selenium;
using Applitools.Tests.Utils;
using Applitools.Utils.Geometry;
using System.Collections.Generic;

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

        [SetUp]
        public void SetUpSelenium()
        {
            ChromeOptions options = new ChromeOptions();
            options.AddArgument("--headless");
            driver = DRIVER_PATH != null ? new ChromeDriver(DRIVER_PATH, options) : new ChromeDriver(options);
            driver.Navigate().GoToUrl(testedPageUrl);
        }

        protected void initEyes(bool isVisualGrid, bool isCSSMode)
        {
            runner = isVisualGrid ? (EyesRunner)(new VisualGridRunner(10)) : new ClassicRunner();
            eyes = new Eyes(runner);
            eyes.HostOS = "Linux";
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
