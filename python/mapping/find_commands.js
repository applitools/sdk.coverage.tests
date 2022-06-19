module.exports = {
    "css": (selector) => `find_element(By.CSS_SELECTOR, ${selector})`,
    "class name": (selector) => `find_element(By.CLASS_NAME, ${selector})`,
    "id": (selector) => `find_element(By.ID, ${selector})`,
}
