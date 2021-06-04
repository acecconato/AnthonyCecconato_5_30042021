/**
 * Validate an email address (RFC 5322)
 * @param str
 * @return {boolean}
 */
export function isValidEmail(str) {
    const regex = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/);
    return !!str.match(regex);
}

/**
 * @param str
 * @return {boolean}
 */
export function isValidAddress(str) {
    const regex = new RegExp(/^[a-z]+[\w \-\_\'\"]+[a-z]+$/i);
    return !!str.match(regex);
}

/**
 * @param str
 * @return {boolean}
 */
export function isValidName(str) {
    const regex = new RegExp(/^[a-z]+[\w -]+[a-z]+$/i);
    return !!str.match(regex);
}

/**
 * @param str
 * @return {boolean}
 */
export function isValidCity(str) {
    const regex = new RegExp(/^[a-z]+[\w \-\_\'\"]+[a-z]+$/i);
    return !!str.match(regex);
}

export default {
    isValidEmail,
    isValidAddress,
    isValidName,
    isValidCity
}
