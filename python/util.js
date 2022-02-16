function capitalizeFirstLetter(string) {
    return string.toString().charAt(0).toUpperCase() + string.toString().slice(1);
}

function toLowerSnakeCase(string){
    return string.toString().replaceAll(" ", "_").replaceAll("-", "_").toLowerCase()
}
module.exports = {
    capitalizeFirstLetter,
    toLowerSnakeCase
}
