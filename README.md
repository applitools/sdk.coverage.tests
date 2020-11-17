# sdk.coverage.tests
A repo to sync all sdks to the same tests

# Adding new generic tests

## JS SDK's (@applitools/sdk-coverage-tests v2)

Create new test in `coverage-tests.js` inside this repo.

## Non-JS SDK's ((@applitools/sdk-coverage-tests v1)

1. Create new test in `test.js` inside this repo.
2. Updated `supported-test.js` file with the new tests inside SDK implementation of the generic tests

# Debugging new testcases 

 There are few ways to run different `tests.js` file: 
 1. Update `index.js` file inside SDK with a `testsUrl` pointed out to the url of the required version of the file. 
 2. Create a copy of the `tests.js` locally and for tests generation run the command like this:`yarn run coverage-tests create-tests --path ./configuration --coverage-tests-local-path local_path_to_tests.js`
 
 After generation of the tests files you could run them as before.
