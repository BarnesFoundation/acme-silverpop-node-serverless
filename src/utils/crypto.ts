import * as crypto from "crypto";
import { Config } from "./config";

const algorithm = "aes-192-cbc";
const iv = "96539eed52ceb0ef068dca51d2cc80cc";

/**
 * @param {string} encryptedString - The string to be decrypted.
 * @returns {string} - The decrypted string.
 */
const decrypt = (encryptedString: string): string => {
    try {
        const key = Buffer.from(Config.encryptionSecretKey)
        const bufferText = Buffer.from(encryptedString, "hex");
        const decipher = crypto.createDecipheriv(
            algorithm,
            key,
            Buffer.from(iv, "hex")
        );
        let decrypted = decipher.update(bufferText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch (e) {
        console.log(`Could not decrypt due to ${e}`);
        throw new Error(`Could not decrypt due to ${e}`);
    }
}

/**
 * @param {string} stringToEncrypt - The string to be encrypted
 * @returns {string} - The encrypted string.
 */
const encrypt = (stringToEncrypt: string): string => {
    try {
        const key = Buffer.from(Config.encryptionSecretKey)
        const cipher = crypto.createCipheriv(
            algorithm,
            key,
            Buffer.from(iv, "hex")
        );
        const encryptedString =
            cipher.update(stringToEncrypt, "utf8", "hex") + cipher.final("hex");

        return encryptedString;
    } catch (error) {
        console.log(`An error occurred encrypting the string`, error);
    }
}

export { decrypt, encrypt };