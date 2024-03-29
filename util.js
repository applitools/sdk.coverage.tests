function checkOptions(actual, supported) {
    const actualOptions = Object.keys(actual);
    actualOptions.forEach(option => {
        if (!supported.includes(option)) throw new Error(`Emitter need update to support option: ${option}`);
    })
}

function fromCamelCaseToSnakeCase(string) {
    return string.replace(/([A-Z])/g, '_$1').toLowerCase()
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = {
    fromCamelCaseToSnakeCase,
    checkOptions,
    isEmpty
}