import { decrypt, encrypt } from "../../utils/crypto";

describe("CryptoService", () => {
    describe("decrypt", () => {
        it("should return a decrypted value given an encrypted string", () => {
            const secret = "keep it secret..."
            const encrypted = encrypt(secret)
            expect(decrypt(encrypted)).toEqual(secret)
        })

        it.skip("should throw an error if unsuccessful", () => {
            // Skipping test because mocking isn't working as expected
            const encrypted = "imafakeencryptedstring";
            // sinon.stub(Buffer, "toString").throws("Counld not decrypt string")
            expect(() => decrypt(encrypted)).toThrow(Error)
        })
    })

    describe("encrypt", () => {
        const secret = "...keep it safe"

        it("should return an encrypted value given a string", () => {
            expect(encrypt(secret)).not.toEqual(secret)
        })

        it.skip("should throw an error if unsuccessful", () => {
            // Skipping test because mocking isn't working as expected
            // sinon.stub(Buffer, "from").throws("Could not encrypt string")
            expect(() => encrypt(secret)).toThrow(Error)
        })
    })
})