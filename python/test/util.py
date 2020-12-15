import json
import requests
from pip._vendor.retrying import retry

# @retry(exception=requests.HTTPError)
def get_test_info(api_key, results):
    api_session_url = results.api_urls.session
    r = requests.get(
        "{}?format=json&AccessToken={}&apiKey={}".format(
            api_session_url, results.secret_token, api_key
        ),
        verify=False,
    )
    r.raise_for_status()
    return r.json()
