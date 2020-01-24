import { ReportEnums } from '@enums/report.enums';
import { Person } from '@classes/person.class';
import { Transaction } from '@classes/transaction.class';
import { Membership } from '@classes/membership.class';
import { ResultItem } from '@interfaces/acmeReportPayload.interface';

/** Processes the provided results array into typed objects */
export function processToRecords(resultsList: ResultItem[], reportType): Person[] | Transaction[] | Membership[] {

    let records = [];
    let fields = [];

    // Map the values array to the field name it corresponds to
    let fieldValues = resultsList.reduce((accumulator, element: ResultItem) => {
        accumulator[element.fieldName] = element.values;
        fields.push(element.fieldName);
        return accumulator;
    }, [[]]);

    let resultCount = fieldValues[fields[0]].length;

    // Create a record from the field values
    for (let h = 0; h < resultCount; h++) {
        let record = {};
        for (let i = 0; i < fields.length; i++) {
            record[fields[i]] = fieldValues[fields[i]][h];
        }
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