/**
 * Validate an email address (RFC 5322)
 * @param str
 * @return {boolean}
 */
export function isValidEmail(str) {
    const regex = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/i);
    return !!str.match(regex);
}

/**
 * Should start nor end with a letter, a digit, é or è
 * Can contains Letters, digits, é, è, comma
 * Can be separated by one whitespace, apostrophe, hyphen, underscore
 * @param str
 * @return {boolean}
 */
export function isValidAddress(str) {
    const regex = new RegExp(/^(?:(?:[\w\déè]+[,]*[\s|\'|\-|\_])*)[a-zA-Zéè\d]+$/i);
    return !!str.match(regex);
}

/**
 * Should start nor end with a letter, é or è
 * Can contains Letters, é, è
 * Can be separated by one whitespace, apostrophe, hyphen
 * @param str
 * @return {boolean}
 */
export function isValidName(str) {
    const regex = new RegExp(/^(?:(?:[\wéè]+[\s|\'|\-])*)[a-zA-Zéè]+$/i);
    return !!str.match(regex);
}

/**
 * Should start nor end with a letter, a digit, é or è
 * Can contains Letters, digits, é, è
 * Can be separated by one whitespace, apostrophe, hyphen, underscore
 * @param str
 * @return {boolean}
 */
export function isValidCity(str) {
    const regex = new RegExp(/^(?:(?:[\w\déè]+[\s|\'|\-|\_])*)[a-zA-Zéè]+$/i);
    return !!str.match(regex);
}

export default {
    isValidEmail,
    isValidAddress,
    isValidName,
    isValidCity
}
