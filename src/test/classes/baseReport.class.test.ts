import { BaseReport } from "../../app/classes/baseReport.class"

describe("BaseReport", () => {
    describe("formatDate", () => {
        const br = new BaseReport()

        it("should return a properly formatted date given an ISO string", () => {
            expect(br.formatDate("2021-10-06T19:06:18.940Z")).toBe("10/6/2021")
        })

        it("should return an empty string when given an empty string", () => {
            expect(br.formatDate("")).toBe("")
        })
    })
})