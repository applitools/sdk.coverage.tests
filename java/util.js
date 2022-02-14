function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
module.exports = {
    capitalizeFirstLetter: capitalizeFirstLetter,
    isEmpty
}