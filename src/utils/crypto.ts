/**
 * @param {string} encryptedString - The base64 string to be decrypted.
 * @returns {string} - The decrypted string.
 */
const decrypt = (encryptedString: string): string => {
    try {
        const buffer = Buffer.from(encryptedString, "base64");
        return buffer.toString('utf8');
    } catch (e) {
        console.log(`Could not decrypt due to ${e}`);
        throw new Error(`Could not decrypt due to ${e}`);
    }
}

/**
 * @param {string} stringToEncrypt - The string to be encrypted
 * @returns {string} - The base64 encrypted string.
 */
const encrypt = (stringToEncrypt: string): string => {
    try {
        const buffer = Buffer.from(stringToEncrypt, 'utf8')
        return buffer.toString('base64');
    } catch (error) {
        console.log(`An error occurred encrypting the string`, error);
    }
}

export { decrypt, encrypt };