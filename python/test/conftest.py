import os
import pytest
import time
from copy import copy

from selenium import webdriver
from appium import webdriver as appium_webdriver

from applitools.selenium import Eyes
from applitools.selenium import (Region, BrowserType, Configuration, Target, Eyes, BatchInfo, VisualGridRunner, ClassicRunner)
#from applitools.common import StitchMode
from webdriver_manager.chrome import ChromeDriverManager


@pytest.fixture(scope="session")
def batch_info():
    return BatchInfo("Python Generated tests")


def pytest_generate_tests(metafunc):
    import uuid
    # setup environment variables once per test run if not settled up
    # needed for multi thread run
#     os.environ["APPLITOOLS_BATCH_ID"] = os.getenv(
#         "APPLITOOLS_BATCH_ID", str(uuid.uuid4())
#     )


@pytest.fixture(scope="function")
def eyes_runner_class():
    return None

@pytest.fixture(scope="function")
def desired_caps():
    return None

@pytest.yield_fixture(scope="function")
def android_desired_capabilities(request, dev, app):
    desired_caps = copy(getattr(request, "param", {}))  # browser_config.copy()
    desired_caps["app"] = app
    desired_caps["NATIVE_APP"] = True
    desired_caps["browserName"] = ""
    desired_caps["deviceName"] = "Samsung Galaxy S8 WQHD GoogleAPI Emulator"
    desired_caps["platformVersion"] = "8.1"
    desired_caps["platformName"] = "Android"
    desired_caps["clearSystemFiles"] = True
    desired_caps["noReset"] = True
    desired_caps["name"] = "AndroidNativeApp checkWindow"
    return desired_caps


@pytest.yield_fixture(scope="function")
def ios_desired_capabilities(request, dev, app):
    desired_caps = copy(getattr(request, "param", {}))
    desired_caps[
        "app"
    ] = app
    desired_caps["NATIVE_APP"] = True
    desired_caps["browserName"] = ""
    desired_caps["deviceName"] = "iPhone XS Simulator"
    desired_caps["platformVersion"] = "12.2"
    desired_caps["platformName"] = "iOS"
    desired_caps["clearSystemFiles"] = True
    desired_caps["noReset"] = True
    desired_caps["name"] = "iOSNativeApp checkWindow"
    return desired_caps



@pytest.fixture(name="driver", scope="function")
def driver_setup(request, desired_caps):
    counter = 0
    while counter < 5:
        try:
            if "Appium" in request.node.name:
                sauce_url = "https://{username}:{password}@ondemand.saucelabs.com:443/wd/hub".format(
                username=os.getenv("SAUCE_USERNAME", None),
                password=os.getenv("SAUCE_ACCESS_KEY", None),
                )
                selenium_url = os.getenv("SELENIUM_SERVER_URL", sauce_url)
                driver = appium_webdriver.Remote(
        command_executor=selenium_url, desired_capabilities=desired_caps)
            else:
                options = webdriver.ChromeOptions()
                options.add_argument("--headless")
                driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=options,)
            break
        except Exception as e:
            print("Tried to start browser. It was exception {}".format(e))
            time.sleep(1.0)
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
    eyes.api_key = os.environ["APPLITOOLS_API_KEY"]
    eyes.configure.batch = batch_info
    eyes.configure.branch_name = "master"
    eyes.configure.parent_branch_name = "master"
    eyes.configure.set_stitch_mode(stitch_mode)
    eyes.configure.set_hide_scrollbars(True).set_save_new_tests(False).set_hide_caret(True)
    eyes.configure.set_save_new_tests(False)
    eyes.add_property(
        "ForceFPS", "true" if eyes.force_full_page_screenshot else "false"
    )
    yield eyes
    # If the test was aborted before eyes.close was called, ends the test as aborted.
    eyes.abort_if_not_closed()
