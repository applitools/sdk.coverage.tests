export const config = {
  output: './test/generic/{{test-key}}.spec.js',
  tests: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/coverage-tests.js',
  emitter: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/emitter.mjs',
  overrides: [
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/overrides.mjs',
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/js-overrides.mjs',
  ],
  template: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/js/template.hbs',
  fixtures: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/universal-sdk/fixtures/fixtures.zip',
  format: {
    parser: 'babel',
    singleQuote: true,
    semi: false,
    bracketSpacing: false,
    trailingComma: 'es5',
  },
}
