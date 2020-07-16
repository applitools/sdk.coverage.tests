'use strict'
function createPytestTestFileString(emittedTest) {
    return `//Generated by DotNet template
${emittedTest.hooks.deps.join('\n')}

namespace Applitools.Selenium.Tests.Generated
{
  [TestFixture]
  [Parallelizable]
  public class ${emittedTest.name}Class : TestGeneratedSetup
  {
    ${emittedTest.hooks.vars.join('\n    ')}
 
    [SetUp]
    public void SetUpTest()
    {
    ${emittedTest.hooks.beforeEach.join('\n    ')}
    }
    
    [TearDown]
    public void TearDown()
    {
    ${emittedTest.hooks.afterEach.join('\n    ')}
    }

    [Test]
    [Category("Generated")] ${emittedTest.disabled ? '\n    [Ignore("generated")]' : ''}
    public void ${emittedTest.name}()
    {
        ${emittedTest.commands.join('\n        ')}
    }
  }
}
`
}

module.exports = createPytestTestFileString
