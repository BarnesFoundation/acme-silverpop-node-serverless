import { Membership } from "../../app/classes/membership.class"

describe("Membership", () => {
    describe("getExpirationTime", () => {
        it("should return ISO date string given a Date object", () => {
            const date = new Date("10/10/2021")
            expect(Membership.getExpirationTime(date)).toBe("2021-10-14T03:59:59.000Z")
        })
    })

    // test to confirm that the expiry is only being encrypted once
})