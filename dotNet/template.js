'use strict'
function createTestFileString(emittedTest) {
    return `//Generated by DotNet template
${emittedTest.hooks.deps.join('\n')}
  {
    ${emittedTest.hooks.vars.join('\n    ')}
 
    [SetUp]
    public void SetUpTest()
    {
    ${emittedTest.hooks.beforeEach.join('\n    ')}
    }
    
    [TearDown]
    public void TearDownTest()
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

module.exports = createTestFileString
