/**
 * Created by takovoy on 19.02.2017.
 */

function isNotNegativeNumber (value) {
    return typeof +value === "number" && +value >= 0
}

function isHEXColor (string) {
    return string.length === 7 && string.search(/#[0-9a-f]{6}/i) === 0
}

function isRGB (string) {
    return string.search(/rgb\((\d{1,3},){2}\d{1,3}\)/i) === 0
}

function isRGBA (string) {
    return string.search(/rgba\((\d{1,3},){3}(\d(\.\d+)?)\)/i) === 0
}

function isColor (string) {
    return isHEXColor(string) || isRGB(string) || isRGBA(string);
}