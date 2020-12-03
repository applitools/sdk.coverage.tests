const overrideTests = require('./override-tests')
const initialize = require('./initialize')
const testFrameworkTemplate = require('./template')

module.exports = {
    name: 'eyes_selenium_python',
    initializeSdk: initialize,
    overrideTests,
    testFrameworkTemplate: testFrameworkTemplate,
    ext: '.py',
    emitOnly: ['/should return test results from close/'],
    outPath: './python/test/coverage/generic'
}
