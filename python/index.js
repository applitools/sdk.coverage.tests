const supportedTests = require('./supported-tests')
const initialize = require('./initialize')
const testFrameworkTemplate = require('./template')

module.exports = {
    name: 'python-sdk',
    initialize: initialize,
    supportedTests,
    testFrameworkTemplate: testFrameworkTemplate,
    extname: '.py'
}