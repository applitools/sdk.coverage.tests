function capitalizeFirstLetter(string) {
    return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
}

function toLowerSnakeCase(string){
    return string.toString().replaceAll(" ", "_").replaceAll("-", "_").toLowerCase()
}

function fromCamelCaseToSnakeCase(string) {
    return string.replace(/([A-Z])/g, '_$1').toLowerCase()
}

module.exports = {
    capitalizeFirstLetter,
    toLowerSnakeCase,
    fromCamelCaseToSnakeCase
}
