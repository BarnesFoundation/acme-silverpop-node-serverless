import axios from "axios";
import { ReportEnums } from '@enums/report.enums';
import { Person } from '@classes/person.class';
import { Transaction } from '@classes/transaction.class';
import { Membership } from '@classes/membership.class';
import { ResultItem } from '@interfaces/acmeReportPayload.interface';
import { Config } from "@utils/config";

/** Processes the provided results array into typed objects */
export async function processToRecords(resultsList: ResultItem[], reportType): Promise<Person[] | Transaction[] | Membership[]> {
    // fields array includes all column titles (fields) from the ACME report
    let fields: string[] = [];
    // each object in the fieldValues array represents a column from the ACME report with the key being the column title (field)
    let fieldValues = {}

    // Map the values array to the field name it corresponds to
    resultsList.forEach(async (element: ResultItem) => {
        fieldValues[element.fieldName] = element.values;
        fields.push(element.fieldName);

        // Generate LoginLink and RenewLink field and record for MembershipsReport
        if (reportType === ReportEnums.MEMBERSHIP_REPORT && element.fieldName === "MembershipExternalMembershipId") {
            const {
                encryptedLogInValues, encryptedRenewValues, linkExpValues
            } = await generateMembershipLinks(element.values);

            const loginLinkField = "LogInLink";
            const renewLinkField = "RenewLink";
            const linkExp = "LinkExp";

            // Add fields to fieldValues
            fieldValues[loginLinkField] = encryptedLogInValues;
            fields.push(loginLinkField);

            fieldValues[renewLinkField] = encryptedRenewValues;
            fields.push(renewLinkField);

            fieldValues[linkExp] = linkExpValues;
            fields.push(linkExp);
        }

    })


    let resultCount = fieldValues[fields[0]].length;
    // Formatted records for the sync
    let records = [];

    // Create a record from the field values
    for (let h = 0; h < resultCount; h++) {
        let record = {};
        // Go through each column/field from the ACME report and find the value for a single row
        for (let i = 0; i < fields.length; i++) {
            record[fields[i]] = fieldValues[fields[i]][h];
        }
        // Create an object from the data from a single row
        records.push(objectFactory(record, reportType));
    }
    return records;
}

/** Creates object based off the type passed */
function objectFactory(r, objectType: string): Person | Transaction | Membership {

    switch (objectType) {

        case ReportEnums.CONTACT_REPORT:
            return new Person(r.Email, r.ContactFirstName, r.ContactLastName, r.ZipCode, r.TransactionDate);

        case ReportEnums.TRANSACTION_REPORT:
            return new Transaction(r.OrganizationName, r.OrganizationCategoryName, r.TransactionAmount, r.DiscountedTransactionAmount, r.DiscountTransactionValue, r.SaleChannel, r.OrderItemType,
                r.ItemName, r.CouponCode, r.CouponName, r.EventName, r.EventStartTime, r.TicketType, r.AddOn, r.Quantity, r.DiscountedUnitPrice, r.PaymentAmount, r.Email, r.EventTemplateCustomField2, r.TransactionId, r.OrderNumber, '', '', r.TransactionItemId, r.TransactionDate);

        case ReportEnums.MEMBERSHIP_REPORT:
            return new Membership({
                MembershipNumber: r.MembershipNumber, MembershipLevelName: r.MembershipLevelName,
                MembershipOfferingName: r.MembershipOfferingName, MembershipSource: r.MembershipSource,
                MembershipExternalMembershipId: r.MembershipExternalMembershipId,
                MembershipJoinDate: r.MembershipJoinDate, MembershipStartDate: r.MembershipStartDate,
                MembershipExpirationDate: r.MembershipExpirationDate, MembershipDuration: r.MembershipDuration,
                MembershipStanding: r.MembershipStanding, MembershipIsGifted: r.MembershipIsGifted,
                RE_MembershipProgramName: r.RE_MembershipProgramName,
                RE_MembershipCategoryName: r.RE_MembershipCategoryName, RE_MembershipFund: r.RE_MembershipFund,
                RE_MembershipCampaign: r.RE_MembershipCampaign, RE_MembershipAppeal: r.RE_MembershipAppeal,
                CardType: r.CardType, CardName: r.CardName, CardStartDate: r.CardStartDate,
                CardExpirationDate: r.CardExpirationDate, CardCustomerPrimaryCity: r.CardCustomerPrimaryCity,
                CardCustomerPrimaryState: r.CardCustomerPrimaryState, CardCustomerPrimaryZip: r.CardCustomerPrimaryZip,
                CardCustomerEmail: r.CardCustomerEmail, CardCustomerFirstName: r.CardCustomerFirstName,
                CardCustomerLastName: r.CardCustomerLastName, LoginLink: r.LoginLink,
                RenewLink: r.RenewLink, LinkExp: r.LinkExp
            });

        case ReportEnums.SALES_REPORT:
            return r;
    }
}

/** 
 * @param {Date} date
 * @returns {number} - Date 3 days from the given date as a unix timestamp
*/
export function getUnixExpiry(date: Date): number {
    // Set time to 11:59:59pm and date 3 days from now
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setDate(date.getDate() + 3)

    return Math.round(date.getTime() / 1000);
}

/**
 * @param {string[]} values - Array of field values from ACME report column
 * @returns {{ 
 *      encryptedLogInValues: string[]; 
 *      encryptedRenewValues: string[]; 
 *      linkExpValues: string[];
 * }} - Object with arrays of encrypted strings
 */
export async function generateMembershipLinks(values) {
    // Expiration date for generating login links for Membership objects
    const unixExpiry: number = getUnixExpiry(new Date())

    // Create array with values to be encrypted for the LogInLink
    const logInLinkValues = values.map(value => [value, unixExpiry].join(","))

    // Create array with values to be encrypted for the RenewLink
    const renewLinkValues = values.map(value => [value, unixExpiry, "/renew"].join(","))

    // Create array with values for the LinkExp
    const linkExpValues = Array(values.length).fill(unixExpiry)
     // Encrypted values
     let encryptedLogInValues = []
     let encryptedRenewValues = []

    try {
        encryptedLogInValues = await batchEncrypt(logInLinkValues, [], 500)
        encryptedRenewValues = await batchEncrypt(renewLinkValues, [], 500)
    } catch (e) {
        console.log("Error in PayloadProcessor.generateMembershipLinks: Could not encrypt member links due to", e)
    }

    return { encryptedLogInValues, encryptedRenewValues, linkExpValues }
}

export async function batchEncrypt(strings: string[], promiseArray: Promise<any>[], batchSize) {
    const strToEncrypt = strings.slice(0, batchSize)
    const remainder = strings.slice(batchSize)

    promiseArray.push(axios({
        method: "post",
        baseURL: Config.utilsApiUrl,
        url: "/encrypt/base64/batch",
        data: {
            strings: strToEncrypt
        }
    }))

    if (remainder.length) {
        return batchEncrypt(remainder, promiseArray, batchSize)
    } else {
        return Promise.all(promiseArray).then(responses => {
            const data = []
            responses.forEach(resp => {
                if (resp.status === 200) {
                    data.push(...resp.data.encrypted)
                } else {
                    // Push empty string to the array if there was an issue encrypting a batch
                    // Since the index of each item matters, this will preserve then indexes
                    data.push(...Array(batchSize).fill(""))
                }
            })
            return data
        }).catch(e => {
            console.log("Error in PayloadProcessor.batchEncrypt: Could not encrypt member links due to", e)
            return []
        })
    }
}