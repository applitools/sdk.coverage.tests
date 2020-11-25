const overrideTests = require('./override-tests')
const initializeSdk = require('./initialize')
const testFrameworkTemplate = require('./template')
module.exports = {
  name: 'eyes_selenium_dotnet',
  initializeSdk: initializeSdk,
  overrideTests,
  testFrameworkTemplate: testFrameworkTemplate,
  ext: '.cs',
  outPath: './test/Selenium/coverage/generic'
}