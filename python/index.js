const overrideTests = require('./override-tests')
const initialize = require('./initialize')
const testFrameworkTemplate = require('./template')

module.exports = {
    name: 'eyes_selenium_python',
    initializeSdk: initialize,
    overrideTests,
    testFrameworkTemplate: testFrameworkTemplate,
    ext: '.py',
    outPath: './test/coverage/generic'
}
