import { Convert } from "../../utils/time";

describe("Convert", () => {
    it("should return a formatted string given ms", () => {
        expect(Convert(123456)).toBe("2 minutes and 03 seconds")
    })
})