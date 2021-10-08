import { Membership } from "../../app/classes/membership.class"

describe("Membership", () => {
    describe("getExpirationTime", () => {
        it("should return ISO date string given a Date object", () => {
            const date = new Date("10/10/2021")
            expect(Membership.getExpirationTime(date)).toBe("2021-10-14T03:59:59.000Z")
        })
    })

    describe("constructor", () => {
        const spy = jest.spyOn(Membership, "formatLoginLink")

        afterEach(() => {
            spy.mockClear();
        });

        it("should generate login link", () => {
            const membership = new Membership(
                '23456',
                'Patron',
                'Patron One Year',
                'RE',
                '123456',
                '10/29/2009',
                '8/6/2014',
                '3/1/2022',
                '12',
                'Active',
                'false',
                'General Membership',
                'Patron',
                '',
                '',
                '',
                'PRIMARY',
                'Albert Barnes',
                '8/6/2014',
                '8/31/2022',
                'Philadelphia',
                'PA',
                '19130',
                'albert@example.com',
                'Albert',
                'Barnes',
            )

            expect(spy).toHaveBeenCalledTimes(1)
            expect(membership.LogInLink).not.toBe("")
        })
    })
})