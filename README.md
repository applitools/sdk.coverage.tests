# sdk.coverage.tests
A repo to sync all sdks to the same tests

## Project structure

1. This repo should contain all JS code related to generating tests. But not to running them. SDK-specific workflow scripts, or related code (e.g. base class or utility functions) in the specific language should exists in the relevant SDK repo.

2. Tests are specified in the file `coverage-tests.js`.

3. There is a folder for each language which should contain the emitter, template, and overrides for that language. Example: https://github.com/applitools/sdk.coverage.tests/tree/master/js

4. In the specific SDK repo, there should be a `coverage-tests` folder with `package.json` that has the dependency of the `@applitools/sdk-coverage-tests` (A.K.A. *the CLI*), and a configuration for specifying where to take the code emitting files from. See example from the Java SDK: https://github.com/applitools/eyes.sdk.java3/tree/develop/coverage-tests
## Workflow

All SDK's should generate tests from `coverage-tests.js` on the `master` branch.

### Adding/modifying tests

When changes are made to `coverage-tests.js`, the preferable way is to do it in a PR. This is the way to "announce" the addition/change in tests.

Ideally, the PR would be merged only after verifying that there is no negative implication on any SDK (i.e. tests are generated successfully, and there are no regressions in test results).

#### Verifying PR validity

We should make it easy to check if everything is successful for a given SDK.

##### 1. Verify test generation works

The SDK can generate tests from a branch in this repo. Example:
```
coverage-tests generate <path/to/config-file> \
  --emitter https://raw.githubusercontent.com/applitools/sdk.coverage.tests/some-branch/java/emitter.js \
  --overrides https://raw.githubusercontent.com/applitools/sdk.coverage.tests/some-branch/java/overrides.js \
  --template https://raw.githubusercontent.com/applitools/sdk.coverage.tests/some-branch/java/template.hbs
```

It's also possible to generate tests and provide code from the file system:

```
coverage-tests generate <path/to/config-file> \
  --emitter path/to/my/wip/emitter.js \
  --overrides path/to/my/wip/overrides.js \
  --template path/to/my/wip/template.hbs
```

This is something that we can add as a GH action that's triggered on `push`.

##### 2. Verify that the new/modified tests pass

The SDK should have an easy way to run a specific test that was generated from a branch in this repo (see #1), from the source code. 
So that if a fix is done on a branch in the SDK repo, then it should be possible to check if this fix works for a test that's implemented in a branch in this repo.

// TODO: example how to do this in C#

// TODO: example how to do this in Java

// TODO: example how to do this in Ruby

// TODO: example how to do this in Python

// TODO: example how to do this in JavaScript

### How to handle urgent tasks

In reality, the PR might need to be merged urgently. In this case it's possible to add an entry in `overrides.js` for each language with the `skipEmit: true` flag.
It is then the responsibility of those SDK's to include this test later.
