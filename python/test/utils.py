from selenium.common.exceptions import InvalidSelectorException, NoSuchElementException


def my_find_element(driver, element):
    try:
        #print('by_css_selector')
        return driver.find_element_by_css_selector(element)
    except InvalidSelectorException:
        #print('by_accessibility_id')
        try:
            return driver.find_element_by_accessibility_id(element)
        except NoSuchElementException:
                #print('by_class_name')
                try:
                    return driver.find_element_by_class_name(element)
                except NoSuchElementException:
                    #print('find_element_by_id')
                    try:
                        return driver.find_element_by_id(element)
                    except NoSuchElementException:
                        #print('by_android_uiautomator')
                        return driver.find_element_by_android_uiautomator('new UiSelector().textContains(\"'+element+'\")')#find_elements_by_android_data_matcher(element)#find_elements_by_android_viewtag(element)#
