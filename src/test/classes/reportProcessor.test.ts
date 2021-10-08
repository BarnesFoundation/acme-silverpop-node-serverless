import { removeGuests, sortByDateField, createCSV, generateHeaders, removeDuplicates } from "../../app/classes/reportProcessor";
import { Membership } from "../../app/classes/membership.class";

describe("ReportProcessor", () => {
    describe("removeGuests", () => {
        it("should remove guest rows from the CSV array", () => {
            expect(removeGuests(memberships)).toMatchObject(membersList)
        })
    })

    describe("sortByDateField", () => {
        it("should return sorted array descending by given date-type field", () => {
            expect(sortByDateField(membersList, 'MembershipExpirationDate')).toMatchObject(sortedMembersList)
        })
    })

    describe("removeDuplicates", () => {
        it("should remove duplicate rows given a unique key", () => {
            expect(removeDuplicates(sortedMembersList, "CardCustomerEmail")).toMatchObject(deDupedMembersList)
        })
    })

    describe("generateHeaders", () => {
        it("should return array of keys given an object", () => {
            expect(generateHeaders(deDupedMembersList[0])).toMatchObject([
                "CardCustomerEmail",
                "CardCustomerFirstName",
                "CardCustomerLastName",
                "CardCustomerPrimaryCity",
                "CardCustomerPrimaryState",
                "CardCustomerPrimaryZip",
                "CardExpirationDate",
                "CardName",
                "CardStartDate",
                "CardType",
                "LogInLink",
                "MembershipDuration",
                "MembershipExpirationDate",
                "MembershipExternalMembershipId",
                "MembershipIsGifted",
                "MembershipJoinDate",
                "MembershipLevelName",
                "MembershipNumber",
                "MembershipOfferingName",
                "MembershipSource",
                "MembershipStanding",
                "MembershipStartDate",
                "RE_MembershipAppeal",
                "RE_MembershipCampaign",
                "RE_MembershipCategoryName",
                "RE_MembershipFund",
                "RE_MembershipProgramName",
            ])
        })
    })

    describe("createCSV", () => {
        it("should return a csv formatted string given an array", async () => {
            const csv = await createCSV(deDupedMembersList)
            new Promise(setImmediate);
            expect(csv).toMatch(
                `CardCustomerEmail,CardCustomerFirstName,CardCustomerLastName,CardCustomerPrimaryCity,CardCustomerPrimaryState,CardCustomerPrimaryZip,CardExpirationDate,CardName,CardStartDate,CardType,LogInLink,MembershipDuration,MembershipExpirationDate,MembershipExternalMembershipId,MembershipIsGifted,MembershipJoinDate,MembershipLevelName,MembershipNumber,MembershipOfferingName,MembershipSource,MembershipStanding,MembershipStartDate,RE_MembershipAppeal,RE_MembershipCampaign,RE_MembershipCategoryName,RE_MembershipFund,RE_MembershipProgramName
albert@example.com,Albert,Barnes,Philadelphia,PA,19130,8/31/2022,Albert Barnes,8/6/2014,PRIMARY,,12,3/1/2022,123456,false,10/29/2009,Patron,23456,Patron One Year,RE,Active,8/6/2014,,,Patron,,General Membership`
            )
        })
    })
})

const memberships = [
    {
        MembershipNumber: '87871',
        MembershipLevelName: 'Patron',
        MembershipOfferingName: 'Patron One Year',
        MembershipSource: 'RE',
        MembershipExternalMembershipId: '9879',
        MembershipJoinDate: '11/18/2009',
        MembershipStartDate: '6/2/2016',
        MembershipExpirationDate: '6/30/2017',
        MembershipDuration: '12',
        MembershipStanding: 'Lapsed',
        MembershipIsGifted: 'false',
        RE_MembershipProgramName: 'General Membership',
        RE_MembershipCategoryName: 'Patron',
        RE_MembershipFund: '',
        RE_MembershipCampaign: '',
        RE_MembershipAppeal: '',
        CardType: 'SECONDARY',
        CardName: 'Guest of John G. Doe',
        CardStartDate: '6/2/2016',
        CardExpirationDate: '6/30/2017',
        CardCustomerPrimaryCity: 'Philadelphia',
        CardCustomerPrimaryState: 'PA',
        CardCustomerPrimaryZip: '19130',
        CardCustomerEmail: 'test@example.com',
        CardCustomerFirstName: 'John',
        CardCustomerLastName: 'Doe',
        LogInLink: ''
    },
    {
        MembershipNumber: '654654',
        MembershipLevelName: 'Patron',
        MembershipOfferingName: 'Patron One Year',
        MembershipSource: 'RE',
        MembershipExternalMembershipId: '543543',
        MembershipJoinDate: '11/18/2009',
        MembershipStartDate: '12/17/2015',
        MembershipExpirationDate: '7/31/2017',
        MembershipDuration: '12',
        MembershipStanding: 'Lapsed',
        MembershipIsGifted: 'false',
        RE_MembershipProgramName: 'General Membership',
        RE_MembershipCategoryName: 'Patron',
        RE_MembershipFund: '',
        RE_MembershipCampaign: '',
        RE_MembershipAppeal: '',
        CardType: 'PRIMARY',
        CardName: 'Vincent Van Gogh',
        CardStartDate: '12/17/2015',
        CardExpirationDate: '7/31/2017',
        CardCustomerPrimaryCity: 'Philadelphia',
        CardCustomerPrimaryState: 'PA',
        CardCustomerPrimaryZip: '19130',
        CardCustomerEmail: 'albert@example.com',
        CardCustomerFirstName: 'Vincent',
        CardCustomerLastName: 'Van Gogh',
        LogInLink: ''
    },
    {
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
        LogInLink: '',
    },
] as unknown as Membership[];

const membersList = [
    {
        "CardCustomerEmail": "albert@example.com",
        "CardCustomerFirstName": "Vincent",
        "CardCustomerLastName": "Van Gogh",
        "CardCustomerPrimaryCity": "Philadelphia",
        "CardCustomerPrimaryState": "PA",
        "CardCustomerPrimaryZip": "19130",
        "CardExpirationDate": "7/31/2017",
        "CardName": "Vincent Van Gogh",
        "CardStartDate": "12/17/2015",
        "CardType": "PRIMARY",
        "LogInLink": "",
        "MembershipDuration": "12",
        "MembershipExpirationDate": "7/31/2017",
        "MembershipExternalMembershipId": "543543",
        "MembershipIsGifted": "false",
        "MembershipJoinDate": "11/18/2009",
        "MembershipLevelName": "Patron",
        "MembershipNumber": "654654",
        "MembershipOfferingName": "Patron One Year",
        "MembershipSource": "RE",
        "MembershipStanding": "Lapsed",
        "MembershipStartDate": "12/17/2015",
        "RE_MembershipAppeal": "",
        "RE_MembershipCampaign": "",
        "RE_MembershipCategoryName": "Patron",
        "RE_MembershipFund": "",
        "RE_MembershipProgramName": "General Membership",
    },
    {
        "CardCustomerEmail": "albert@example.com",
        "CardCustomerFirstName": "Albert",
        "CardCustomerLastName": "Barnes",
        "CardCustomerPrimaryCity": "Philadelphia",
        "CardCustomerPrimaryState": "PA",
        "CardCustomerPrimaryZip": "19130",
        "CardExpirationDate": "8/31/2022",
        "CardName": "Albert Barnes",
        "CardStartDate": "8/6/2014",
        "CardType": "PRIMARY",
        "LogInLink": "",
        "MembershipDuration": "12",
        "MembershipExpirationDate": "3/1/2022",
        "MembershipExternalMembershipId": "123456",
        "MembershipIsGifted": "false",
        "MembershipJoinDate": "10/29/2009",
        "MembershipLevelName": "Patron",
        "MembershipNumber": "23456",
        "MembershipOfferingName": "Patron One Year",
        "MembershipSource": "RE",
        "MembershipStanding": "Active",
        "MembershipStartDate": "8/6/2014",
        "RE_MembershipAppeal": "",
        "RE_MembershipCampaign": "",
        "RE_MembershipCategoryName": "Patron",
        "RE_MembershipFund": "",
        "RE_MembershipProgramName": "General Membership",
    },
] as unknown as Membership[];

const sortedMembersList = [membersList[1], membersList[0]] as unknown as Membership[];
const deDupedMembersList = [sortedMembersList[0]] as unknown as Membership[];