import { Membership } from "../../app/classes/membership.class"

describe("Membership", () => {
    describe("getToday", () => {
        it("should return date with time set to 11:59:59 pm Eastern Time", () => {
            const date = new Date("10/10/2021")
            expect(Membership.getToday(date).toISOString()).toBe("2021-10-11T03:59:59.000Z")
        })
    })

    describe("getExpirationTime", () => {
        it("should return ISO date string given a Date object", () => {
            const date = new Date("10/10/2021")
            expect(Membership.getExpirationTime(date)).toBe("2021-10-14T03:59:59.000Z")
        })
    })

    describe("canRenew", () => {
        beforeAll(() => {
            // set current date to 10/13/2021
            jest.useFakeTimers("modern").setSystemTime(new Date("2021-10-13"))
        });

        afterAll(() => {
            // reset date
            jest.clearAllTimers();
        })

        it("should return true when expiration date is within three months from now", () => {
            expect(Membership.canRenew('2021-11-30T12:10:45-05:00')).toBe(true)
        })

        it("should return true when expiration is less than one month in the past", () => {
            expect(Membership.canRenew('2021-09-30T12:10:45-05:00')).toBe(true)
        })

        it("should return false when expiration is more than three months from now", () => {
            expect(Membership.canRenew('2022-02-28T12:10:45-05:00')).toBe(false)
        })

        it("should return false when expiration is more than one month in the past", () => {
            expect(Membership.canRenew('2022-08-31T12:10:45-05:00')).toBe(false)
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