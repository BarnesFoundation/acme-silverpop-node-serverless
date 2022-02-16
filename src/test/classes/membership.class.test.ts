import { Membership } from "../../app/classes/membership.class"

describe("Membership", () => {
    describe("constructor", () => {
        it("should generate login link", () => {
            const membership1 = new Membership({
                MembershipNumber: '23456',
                MembershipLevelName: 'Patron',
                MembershipOfferingName: 'Patron One Year',
                MembershipSource: 'RE',
                MembershipExternalMembershipId: '123456',
                MembershipJoinDate: '10/29/2009',
                MembershipStartDate: '8/6/2014',
                MembershipExpirationDate: '3/1/2022',
                MembershipDuration: '12',
                MembershipStanding: 'Active',
                MembershipIsGifted: 'false',
                RE_MembershipProgramName: 'General Membership',
                RE_MembershipCategoryName: 'Patron',
                RE_MembershipFund: '',
                RE_MembershipCampaign: '',
                RE_MembershipAppeal: '',
                CardType: 'PRIMARY',
                CardName: 'Albert Barnes',
                CardStartDate: '8/6/2014',
                CardExpirationDate: '8/31/2022',
                CardCustomerPrimaryCity: 'Philadelphia',
                CardCustomerPrimaryState: 'PA',
                CardCustomerPrimaryZip: '19130',
                CardCustomerEmail: 'albert@example.com',
                CardCustomerFirstName: 'Albert',
                CardCustomerLastName: 'Barnes',
                LogInLink: 'encryptedLogInLink',
                RenewLink: 'encryptedRenewLink',
                LinkExp: 1634183999
            })

            const membership2 = new Membership({
                MembershipNumber: '23456',
                MembershipLevelName: 'Patron',
                MembershipOfferingName: 'Patron One Year',
                MembershipSource: 'RE',
                MembershipExternalMembershipId: '123456',
                MembershipJoinDate: '10/29/2009',
                MembershipStartDate: '8/6/2014',
                MembershipExpirationDate: '3/1/2022',
                MembershipDuration: '12',
                MembershipStanding: 'Active',
                MembershipIsGifted: 'false',
                RE_MembershipProgramName: 'General Membership',
                RE_MembershipCategoryName: 'Patron',
                RE_MembershipFund: '',
                RE_MembershipCampaign: '',
                RE_MembershipAppeal: '',
                CardType: 'PRIMARY',
                CardName: 'Albert Barnes',
                CardStartDate: '8/6/2014',
                CardExpirationDate: '8/31/2022',
                CardCustomerPrimaryCity: 'Philadelphia',
                CardCustomerPrimaryState: 'PA',
                CardCustomerPrimaryZip: '19130',
                CardCustomerEmail: 'albert@example.com',
                CardCustomerFirstName: 'Albert',
                CardCustomerLastName: 'Barnes',
            })

            expect(membership1.LinkExp).toBe("10/13/2021")
            expect(membership2.LinkExp).toBe(undefined)
            expect(membership2.LogInLink).toBe(undefined)
            expect(membership2.RenewLink).toBe(undefined)
        })
    })
})