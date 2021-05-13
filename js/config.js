module.exports = {
  output: './test/generic',
  ext: '.spec.js',
  emitter: 'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/master/js/emitter.js',
  overrides:
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/master/js/overrides.js',
  template:
    'https://raw.githubusercontent.com/applitools/sdk.coverage.tests/master/js/template.hbs',
  format: {
    parser: 'babel',
    singleQuote: true,
    semi: false,
    bracketSpacing: false,
    trailingComma: 'es5',
  },
}
