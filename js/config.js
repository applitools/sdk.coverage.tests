module.exports = {
  output: './test/generic',
  ext: '.spec.js',
  emitter: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/emitter.js',
  overrides: [
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/overrides.js',
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/js-overrides.js',
    ...(process.env.APPLITOOLS_TEST_REMOTE === 'eg' ? ['https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/eg.overrides.js'] : []),
  ],
  template:
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/template.hbs',
  tests: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/coverage-tests.js',
  fixtures: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/fixtures/fixtures.zip',
  format: {
    parser: 'babel',
    singleQuote: true,
    semi: false,
    bracketSpacing: false,
    trailingComma: 'es5',
  },
}
