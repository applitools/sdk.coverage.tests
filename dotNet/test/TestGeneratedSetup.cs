using Applitools.VisualGrid;
using NUnit.Framework;
using OpenQA.Selenium;
using System;
using OpenQA.Selenium.Chrome;

namespace Applitools.Selenium.Tests
{
    public abstract class TestGeneratedSetup
    {

        protected IWebDriver driver;
        protected EyesRunner runner;
        protected Eyes eyes;
        protected string testedPageUrl = "https://applitools.github.io/demo/TestPages/FramesTestPage/";
        public static readonly BatchInfo BatchInfo = new BatchInfo("DotNet Generated Tests");

        [SetUp]
        public void SetUpCHE()
        {
            driver = new ChromeDriver();
            driver.Navigate().GoToUrl(testedPageUrl);
        }

        protected void initEyes(Boolean isVisualGrid, Boolean isCSSMode)
        {
            runner = isVisualGrid ? (EyesRunner)(new VisualGridRunner(10)) : new ClassicRunner();
            eyes = new Eyes(runner);
            eyes.HostOS = "Linux";
            eyes.Batch = BatchInfo;
            if (!isVisualGrid) eyes.StitchMode = isCSSMode ? StitchModes.CSS : StitchModes.Scroll;
            eyes.BranchName = "master";
            eyes.ParentBranchName = "master";
        }

    }
}
