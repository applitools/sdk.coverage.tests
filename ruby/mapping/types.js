const {has} = require("../util")
const types = {
    "RectangleSize": {
        constructor: (value) => `Applitools::RectangleSize.new(${value.width}, ${value.height})`
    },
    "Region": {
        constructor: (region) => {
            let left, top;
            if (has(region, ["left", "top"])) {
                left = region.left;
                top = region.top;
            } else if (has(region, ["x", "y"])) {
                left = region.x;
                top = region.y;
            } else {
                throw new Error(`Region object: ${region}, doesn't contain coordinates`)
            }
            return `Applitools::Region.new(${left}, ${top}, ${region.width}, ${region.height})`
        }
    },
    "FloatingBounds": {
        constructor: (bounds) => `Applitools::FloatingBounds.new(${bounds.maxLeftOffset}, ${bounds.maxUpOffset}, ${bounds.maxRightOffset}, ${bounds.maxDownOffset})`
    },
    "PaddingBounds": {
        constructor: (bounds) => {
            switch (typeof bounds) {
                case "object":
                    return `Applitools::PaddingBounds.new(${bounds.left || 0}, ${bounds.top || 0}, ${bounds.right || 0}, ${bounds.bottom || 0})`
                case "number":
                    return `Applitools::PaddingBounds.new(${bounds}, ${bounds}, ${bounds}, ${bounds})`
                default:
                    throw new Error(`PaddingBounds object: ${bounds}, isn't correct. It should number for all paddings or object containing values directions`)
            }
        }
    },
    "TestResults": {
        class: () => `Applitools::TestResults`
    }
}

module.exports = types
