const supportedTests = require('./supported-tests')
const initialize = require('./initialize')
const testFrameworkTemplate = require('./template')

module.exports = {
    name: 'eyes_selenium_python',
    initialize: initialize,
    supportedTests,
    testFrameworkTemplate: testFrameworkTemplate,
    ext: '.py',
    out: './test/coverage/generic'
}