import os
import pytest

from selenium import webdriver
from applitools.selenium import Eyes, Target, BatchInfo, ClassicRunner
from webdriver_manager.chrome import ChromeDriverManager


@pytest.fixture(scope="session")
def batch_info():
    return BatchInfo("Python Generated tests")


@pytest.fixture(scope="function")
def eyes_runner_class():
    return None


@pytest.fixture(name="driver", scope="function")
def driver_setup():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    yield driver
    # Close the browser.
    driver.quit()


@pytest.fixture(name="runner", scope="function")
def runner_setup(eyes_runner_class):
    runner = eyes_runner_class
    yield runner
#     all_test_results = runner.get_all_test_results()
#     print(all_test_results)

@pytest.fixture(scope="function")
def stitch_mode():
    return None

@pytest.fixture(name="eyes", scope="function")
def eyes_setup(runner, batch_info, stitch_mode):
    """
    Basic Eyes setup. It'll abort test if wasn't closed properly.
    """
    eyes = Eyes(runner)
    # Initialize the eyes SDK and set your private API key.
    eyes.api_key = os.environ["APPLITOOLS_API_KEY"]
    eyes.configure.batch = batch_info
    eyes.configure.branch_name = "master"
    eyes.configure.parent_branch_name = "master"
    eyes.configure.set_stitch_mode(stitch_mode)
    eyes.configure.set_hide_scrollbars(True).set_save_new_tests(False).set_hide_caret(True)
    eyes.add_property(
        "ForceFPS", "true" if eyes.force_full_page_screenshot else "false"
    )
    yield eyes
    # If the test was aborted before eyes.close was called, ends the test as aborted.
    eyes.abort_if_not_closed()
