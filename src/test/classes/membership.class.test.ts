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

        it("should generate login link for active members", () => {
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

        it("should not generate login link for lapsed, dropped, or expired members", () => {
            const lapsedMember = new Membership(
                '87871',
                'Patron',
                'Patron One Year',
                'RE',
                '9879',
                '11/18/2009',
                '6/2/2016',
                '6/30/2017',
                '12',
                'Lapsed',
                'false',
                'General Membership',
                'Patron',
                '',
                '',
                '',
                'SECONDARY',
                'Guest of John G. Doe',
                '6/2/2016',
                '6/30/2017',
                'Philadelphia',
                'PA',
                '19130',
                'test@example.com',
                'John',
                'Doe',
            )
            const droppedMember = new Membership(
                '87871',
                'Patron',
                'Patron One Year',
                'RE',
                '9879',
                '11/18/2009',
                '6/2/2016',
                '6/30/2017',
                '12',
                'Dropped',
                'false',
                'General Membership',
                'Patron',
                '',
                '',
                '',
                'SECONDARY',
                'Guest of John G. Doe',
                '6/2/2016',
                '6/30/2017',
                'Philadelphia',
                'PA',
                '19130',
                'test@example.com',
                'John',
                'Doe',
            )
            const expiredMember = new Membership(
                '87871',
                'Patron',
                'Patron One Year',
                'RE',
                '9879',
                '11/18/2009',
                '6/2/2016',
                '6/30/2017',
                '12',
                'Expired',
                'false',
                'General Membership',
                'Patron',
                '',
                '',
                '',
                'SECONDARY',
                'Guest of John G. Doe',
                '6/2/2016',
                '6/30/2017',
                'Philadelphia',
                'PA',
                '19130',
                'test@example.com',
                'John',
                'Doe',
            )

            expect(spy).toHaveBeenCalledTimes(0)
            expect(lapsedMember.LogInLink).toBe("")
            expect(droppedMember.LogInLink).toBe("")
            expect(expiredMember.LogInLink).toBe("")
        })
    })
})