function checkOptions(actual, supported) {
    const actualOptions = Object.keys(actual);
    actualOptions.forEach(option => {
        if (!supported.includes(option)) throw new Error(`Emitter need update to support option: ${option}`);
    })
}

module.exports = {
    checkOptions
}