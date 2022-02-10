import { ReportEnums } from '@enums/report.enums';
import { Person } from '@classes/person.class';
import { Transaction } from '@classes/transaction.class';
import { Membership } from '@classes/membership.class';
import { ResultItem } from '@interfaces/acmeReportPayload.interface';

/** Processes the provided results array into typed objects */
export function processToRecords(resultsList: ResultItem[], reportType): Person[] | Transaction[] | Membership[] {
    // Expiration date for generating login links for Membership objects
    const unixExpiry: string = getUnixExpiry(new Date())

    let records = [];
    // fields array includes all column titles (fields) from the ACME report
    let fields: string[] = [];

    // Map the values array to the field name it corresponds to
    // each object in the fieldValues array represents a column from the ACME report with the key being the column title (field)
    let fieldValues = resultsList.reduce((accumulator, element: ResultItem) => {
        accumulator[element.fieldName] = element.values;
        fields.push(element.fieldName);

        // Generate LoginLink and RenewLink field and record for MembershipsReport
        if (reportType === ReportEnums.MEMBERSHIP_REPORT && element.fieldName === "MembershipExternalMembershipId") {
            // Create array with values to be encrypted for the LogInLink
            const logInLinkValues = element.values.map(value => [value, unixExpiry].join(","))

            // Create array with values to be encrypted for the RenewLink
            const renewLinkValues = element.values.map(value => [value, unixExpiry, "/renew"].join(","))

            // Encrypt values and add to accumulator
            const encryptedLogInValues = []
            const encryptedRenewValues = []

            // Create array with values for the LinkExp
            const linkExpValues = Array(element.values.length).fill(unixExpiry)

            // Add fields to accumulator
            const loginLinkField = "LogInLink"
            const renewLinkField = "RenewLink"
            const linkExp = "LinkExp"
            accumulator[loginLinkField] = encryptedLogInValues;
            fields.push(loginLinkField)
            accumulator[renewLinkField] = encryptedRenewValues;
            fields.push(renewLinkField)
            accumulator[linkExp] = linkExpValues;
            fields.push(linkExp)
        }

        return accumulator;
    }, [[]]);



    let resultCount = fieldValues[fields[0]].length;

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
            return new Membership(r.MembershipNumber, r.MembershipLevelName, r.MembershipOfferingName, r.MembershipSource, r.MembershipExternalMembershipId, r.MembershipJoinDate, r.MembershipStartDate, r.MembershipExpirationDate, r.MembershipDuration, r.MembershipStanding, r.MembershipIsGifted, r.RE_MembershipProgramName, r.RE_MembershipCategoryName, r.RE_MembershipFund, r.RE_MembershipCampaign, r.RE_MembershipAppeal, r.CardType, r.CardName, r.CardStartDate, r.CardExpirationDate, r.CardCustomerPrimaryCity, r.CardCustomerPrimaryState, r.CardCustomerPrimaryZip, r.CardCustomerEmail, r.CardCustomerFirstName, r.CardCustomerLastName);

        case ReportEnums.SALES_REPORT:
            return r;
    }
}

/** 
 * @param {Date} date - 
 * @returns {string} - Date 3 days from the given date as a unix timestamp
*/
export function getUnixExpiry(date: Date): string {
    // Set time to 11:59:59pm and date 3 days from now
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    date.setDate(date.getDate() + 3)

    return (date.getTime() / 1000).toFixed(0);
}