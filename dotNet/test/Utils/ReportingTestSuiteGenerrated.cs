using Applitools.Tests.Utils;
using NUnit.Framework;
using NUnit.Framework.Interfaces;

namespace Applitools.Generated.Selenium.Tests
{
    public abstract class ReportingTestSuiteGenerrated : ReportingTestSuite
    {
        protected override TestResult GetTestResult()
        {
            TestContext tc = TestContext.CurrentContext;
            TestStatus status = tc.Result.Outcome.Status;
            bool passed = status == TestStatus.Passed;
            string name;
            string mode = null;
            if (tc.Test.MethodName.EndsWith("_Scroll"))
            {
                name = tc.Test.MethodName.Substring(0, tc.Test.MethodName.LastIndexOf('_'));
                mode = "scroll";
            }
            else if (tc.Test.MethodName.EndsWith("_VG"))
            {
                name = tc.Test.MethodName.Substring(0, tc.Test.MethodName.LastIndexOf('_'));
                mode = "visualgrid";
            }
            else if (tc.Test.MethodName.StartsWith("Appium"))
            {
                name = tc.Test.MethodName;
                //mode = "";
            }
            else
            {
                name = tc.Test.MethodName;
                mode = "css";
            }
            TestResultGenerated result = new TestResultGenerated(name, passed, GetTestParameters(), "chrome", mode);
            return result;
        }
    }
}
