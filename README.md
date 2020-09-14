# sdk.coverage.tests
A repo to sync all sdks to the same tests

# Adding new generic tests

1. First you need to create new test in the `test.js` inside this repo.
2. Updated `supported-test.js` file with the new tests inside SDK implementation of the generic tests

# Debugging new testcases 

 There are few ways to run different `tests.js` file: 
 1. Update `index.js` file inside SDK with a `testsUrl` pointed out to the url of the required version of the file. 
 2. Create a copy of the `tests.js` locally and for tests generation run the command like this:`yarn run coverage-tests create-tests --path ./configuration --coverage-tests-local-path local_path_to_tests.js`
 
 After generation of the tests files you could run them as before.