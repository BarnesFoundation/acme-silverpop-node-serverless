import {
    processToRecords,
    getUnixExpiry,
    generateMembershipLinks,
    batchEncrypt,
} from "../../app/classes/payloadProcessor"
import * as PayloadProcessor from "../../app/classes/payloadProcessor";
import { Person } from "../../app/classes/person.class"
import { ResultItem } from "../../app/interfaces/acmeReportPayload.interface";
import { ReportEnums } from "../../app/enums/report.enums"

import axios from "axios";
import { mocked } from "ts-jest/utils";

jest.mock("axios");

describe("PayloadProcessor", () => {
    describe("processToRecords", () => {
        it("should process results array into typed objects", async () => {
            const reportType = ReportEnums.CONTACT_REPORT;
            const expectedResults: Person[] = [
                {
                    "ContactFirstName": "Albert",
                    "ContactLastName": "Barnes",
                    "Email": "albert@example.com",
                    "TransactionDate": "2016-03-02T12:10:45-05:00",
                    "ZipCode": "19130",
                },
                {
                    "ContactFirstName": "John",
                    "ContactLastName": "Doe",
                    "Email": "test@example.com",
                    "TransactionDate": "2016-03-02T12:10:45-05:00",
                    "ZipCode": "90210",
                },
                {
                    "ContactFirstName": "Vincent",
                    "ContactLastName": "Van Gogh",
                    "Email": "vincent@example.com",
                    "TransactionDate": "2016-03-02T12:10:45-05:00",
                    "ZipCode": "12345",
                },
            ]
            const results = await processToRecords(resultsList, reportType)

            results.forEach((result, i: number) => {
                expect(result).toMatchObject(expectedResults[i])
            });
        })
    })

    describe("getUnixExpiry", () => {
        it("should return unix timestamp given a Date object", () => {
            const date = new Date("10/10/2021")
            expect(getUnixExpiry(date)).toBe(1634183999)
        })
    })

    describe("generateMembershipLinks", () => {
        const values = ["123,0987,/renew", "456,12324,/renew", "789,123456,/renew"]

        it("should return an array of encrypted strings given an array of strings", async () => {
            const encrypted = ['some', 'encrypted', 'strings']
            const payload: any = { status: 200, data: { encrypted } }
            mocked(axios).mockImplementation(() => Promise.resolve(payload))
            expect(await generateMembershipLinks(values)).toMatchObject({
                encryptedLogInValues: encrypted,
                encryptedRenewValues: encrypted
            })
        })
    })

    describe("batchEncrypt", () => {
        it("should return payload when successful", async () => {
            jest.clearAllMocks();
            // Mock axios to return the same payload that it is given
            mocked(axios).mockImplementation((req: any) => Promise.resolve({
                status: 200,
                data: {
                    encrypted: req.data.strings
                }
            } as any))
            const strings = ['a', 's', 'd', 'f', 'g', 'q', 'w', 'e', 'r', 't']
            const promises = await batchEncrypt(strings, [], 4)

            expect(axios).toBeCalledTimes(3)
            expect(promises).toEqual(strings)
        })

        it("should return an empty array when there is an error", async () => {
            jest.clearAllMocks();
            mocked(axios).mockImplementationOnce(() => Promise.reject(new Error("error!")))
            mocked(axios).mockImplementation((req: any) => Promise.resolve({
                status: 200,
                data: {
                    encrypted: req.data.strings
                }
            } as any))
            const strings = ['a', 's', 'd', 'f', 'g', 'q', 'w', 'e', 'r', 't']
            const promises = await batchEncrypt(strings, [], 4)

            expect(promises).toEqual([])
        })

        it("should preserve the index of each string", async () => {
            jest.clearAllMocks();
            // Mock the Utils API to return a 500 one time
            mocked(axios).mockImplementationOnce((req: any) => Promise.resolve({
                status: 200,
                data: {
                    encrypted: req.data.strings
                }
            } as any))
            mocked(axios).mockImplementationOnce((req: any) => Promise.resolve({
                status: 500,
                data: {
                    error: "Oops!"
                }
            } as any))
            mocked(axios).mockImplementationOnce((req: any) => Promise.resolve({
                status: 200,
                data: {
                    encrypted: req.data.strings
                }
            } as any))
            const strings = ['a', 's', 'd', 'f', 'g', 'q', 'w', 'e', 'r', 't']
            const promises = await batchEncrypt(strings, [], 4)

            expect(promises).toEqual(['a', 's', 'd', 'f', '', '', '', '', 'r', 't'])
        })
    })
})

const resultsList: ResultItem[] = [
    {
        fieldName: "OrganizationName",
        analyticsDataType: "STRING",
        values: ["The Barnes Foundation", "PMA", ""]
    }, {
        fieldName: "OrganizationCategoryName",
        analyticsDataType: "STRING",
        values: ["Group Sales No Discount", "GROUP SALES VISITS", "CORPORATE COUNCIL"]
    }, {
        fieldName: "TransactionAmount",
        analyticsDataType: "CURRENCY",
        values: ["50.00", "0.00", "250.00"]
    }, {
        fieldName: "DiscountedTransactionAmount",
        analyticsDataType: "CURRENCY",
        values: ["50.00", "0.00", "200.00"]
    }, {
        fieldName: "DiscountTransactionValue",
        analyticsDataType: "CURRENCY",
        values: ["0.00", "0.00", "-50.00"]
    }, {
        fieldName: "SaleChannel",
        analyticsDataType: "STRING",
        values: ["Online", "Pos", "Reseller"]
    }, {
        fieldName: "OrderItemType",
        analyticsDataType: "STRING",
        values: ['Event', 'Event', 'Event']
    }, {
        fieldName: "ItemName",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "CouponCode",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "CouponName",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "EventName",
        analyticsDataType: "STRING",
        values: ["Admission", "Admission", "Guided Group Visits"]
    }, {
        fieldName: "EventStartTime",
        analyticsDataType: "DATE",
        values: ["2017-04-28T13:00:00-04:00", "2017-04-29T13:00:00-04:00", "2017-04-30T13:00:00-04:00"]
    }, {
        fieldName: "TicketType",
        analyticsDataType: "STRING",
        values: ['Docent-Led Standard', 'Self-Guided Standard', 'Docent-Led Plus',]
    }, {
        fieldName: "AddOn",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "Quantity",
        analyticsDataType: "INTEGER",
        values: [0, 1, 10]
    }, {
        fieldName: "DiscountedUnitPrice",
        analyticsDataType: "CURRENCY",
        values: ["0.00", "5.00", "0.00"]
    }, {
        fieldName: "PaymentAmount",
        analyticsDataType: "STRING",
        values: ["50.00", "0.00", "250.00"]
    }, {
        fieldName: "Email",
        analyticsDataType: "STRING",
        values: ["albert@example.com", "test@example.com", "vincent@example.com"]
    }, {
        fieldName: "ContactFirstName",
        analyticsDataType: "STRING",
        values: ["Albert", "John", "Vincent"]
    }, {
        fieldName: "ContactLastName",
        analyticsDataType: "STRING",
        values: ["Barnes", "Doe", "Van Gogh"]
    }, {
        fieldName: "ZipCode",
        analyticsDataType: "STRING",
        values: ["19130", "90210", "12345"]
    }, {
        fieldName: "MembershipExternalId",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "MembershipPrimaryFirstName",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "MembershipPrimaryLastName",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "MembershipLevelName",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "MembershipOfferingName",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "EventTemplateCustomField2",
        analyticsDataType: "STRING",
        values: ["Admissions", "Admissions", "Admissions"]
    }, {
        fieldName: "TransactionId",
        analyticsDataType: "STRING",
        values: ["10001", "10002", "10003"]
    }, {
        fieldName: "OrderNumber",
        analyticsDataType: "STRING",
        values: ["90001", "90002", "90003"]
    }, {
        fieldName: "TransactionItemId",
        analyticsDataType: "STRING",
        values: ["10101", "10102", "10103"]
    }, {
        fieldName: "TransactionDate",
        analyticsDataType: "Date",
        values: ['2016-03-02T12:10:45-05:00', '2016-03-02T12:10:45-05:00', '2016-03-02T12:10:45-05:00']
    }, {
        fieldName: "MembershipNumber",
        analyticsDataType: "STRING",
        values: ["123", "456", "789"]
    }, {
        fieldName: "MembershipLevelName",
        analyticsDataType: "STRING",
        values: ["Patron", "Supporter", "Contributor"]
    }, {
        fieldName: "MembershipOfferingName",
        analyticsDataType: "STRING",
        values: ["Patron STandard", "Supporter One Year", "Contributor One Year"]
    }, {
        fieldName: "MembershipSource",
        analyticsDataType: "STRING",
        values: ["RE", "RE", "RE"]
    }, {
        fieldName: "MembershipExternalMembershipId",
        analyticsDataType: "STRING",
        values: ["123", "456", "789"]
    }, {
        fieldName: "MembershipJoinDate",
        analyticsDataType: "DATE",
        values: ['2016-06-25T00:00:00-04:00', '2017-02-06T00:00:00-05:00', '2014-07-14T00:00:00-04:00']
    }, {
        fieldName: "MembershipStartDate",
        analyticsDataType: "DATE",
        values: ['2021-07-07T00:00:00-04:00', '2017-02-06T00:00:00-05:00', '2021-10-05T00:00:00-04:00']
    }, {
        fieldName: "MembershipExpirationDate",
        analyticsDataType: "DATE",
        values: ['2021-07-07T23:59:59-04:00', '2018-11-02T23:59:59-04:00', '2021-10-05T23:59:59-04:00']
    }, {
        fieldName: "MembershipDuration",
        analyticsDataType: "INTEGER",
        values: [12, 12, 12]
    }, {
        fieldName: "MembershipStanding",
        analyticsDataType: "STRING",
        values: ["Active", "Dropped", "Lapsed"]
    }, {
        fieldName: "MembershipIsGifted",
        analyticsDataType: "BOOLEAN",
        values: [false, false, true]
    }, {
        fieldName: "RE_MembershipProgramName",
        analyticsDataType: "STRING",
        values: ["General Membership", "General Membership", "General Membership"]
    }, {
        fieldName: "RE_MembershipCategoryName",
        analyticsDataType: "STRING",
        values: ["Patron", "Supporter", "Contributor"]
    }, {
        fieldName: "RE_MembershipFund",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "RE_MembershipCampaign",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "RE_MembershipAppeal",
        analyticsDataType: "STRING",
        values: ["", "", ""]
    }, {
        fieldName: "CardType",
        analyticsDataType: "STRING",
        values: ["PRIMARY", "PRIMARY", "PRIMARY"]
    }, {
        fieldName: "CardName",
        analyticsDataType: "STRING",
        values: ["Dr. Albert Barnes", "John Doe", "Vincent Van Gogh"]
    }, {
        fieldName: "CardStartDate",
        analyticsDataType: "DATE",
        values: ['2019-09-29T20:00:00-04:00', '2017-02-06T00:00:00-05:00', '2019-12-26T19:00:00-05:00']
    }, {
        fieldName: "CardExpirationDate",
        analyticsDataType: "DATE",
        values: ['2021-10-07T20:00:00-04:00', '2018-02-28T23:59:59-05:00', '2021-07-05T20:00:00-04:00']
    }, {
        fieldName: "CardCustomerPrimaryCity",
        analyticsDataType: "STRING",
        values: ["Philadelphia", "Boston", "New York"]
    }, {
        fieldName: "CardCustomerPrimaryState",
        analyticsDataType: "STRING",
        values: ["PA", "MA", "NY"]
    }, {
        fieldName: "CardCustomerPrimaryZip",
        analyticsDataType: "STRING",
        values: ["19130", "90210", "12345"]
    }, {
        fieldName: "CardCustomerEmail",
        analyticsDataType: "STRING",
        values: ["albert@example.com", "test@example.com", "vincent@example.com"]
    }, {
        fieldName: "CardCustomerFirstName",
        analyticsDataType: "STRING",
        values: ["Albert", "John", "Vincent"]
    }, {
        fieldName: "CardCustomerLastName",
        analyticsDataType: "STRING",
        values: ["Barnes", "Doe", "Van Gogh"]
    },
];