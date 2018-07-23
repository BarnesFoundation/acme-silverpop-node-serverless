import { Config } from '@utils/config';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReport, AcmeReportList } from '@interfaces/acmeReport.interface'
import { TransactionReportFieldIndices as t, SalesReportFieldIndices as s, MembershipReportFieldIndices as m } from '@enums/reportFieldIndices.enum';
import { SalesReportItem } from '@classes/salesReportItem';
import { MembershipReportItem } from '@classes/membershipReportItem';
import { TransactionReportItem } from '@classes/transactionReportItem';
import { CustomerCard } from '@classes/customerCard';
import * as request from 'request-promise-native';


const apiRootUrl = Config.apiRootUrl;
const apiKey = Config.apiKey;

function main() {

    getReports();
}

/** Iterates fetching through the list of available report types */
function getReports() {

    // For each type of report
    /* AcmeReportList.forEach(report => {

        const url = apiRootUrl + report.path;

        // Connect to the endpoint 
        getReportFromEndpoint(report.type, url);
    }); */

    getReportFromEndpoint(AcmeReportList[2].type, apiRootUrl + AcmeReportList[2].path);
}

/** Fetches report from the specified endpoint */
function getReportFromEndpoint(reportType: string, requestUrl: string) {

    // Configure options for the http request
    const options = {
        url: requestUrl,
        headers: {
            'Accept': 'application/json',
            'x-acme-api-key': apiKey
        }, json: true
    }

    // Execute the request
    request.get(options)
        .then((response) => {

            // Process the response based on the report type 
            switch (reportType) {

                case ReportEnums.SALES_REPORT:
                    processSalesReport(response);
                    break;

                case ReportEnums.MEMBERSHIP_REPORT:
                    processMembershipReport(response);
                    break;

                case ReportEnums.TRANSACTION_REPORT:
                    processTransactionReport(response);
                    break;
            }
        });
}

/** Processes the Sales Report */
function processSalesReport(report) {

    // Empty list of Sales Report Items
    const salesReportItems: SalesReportItem[] = [];

    // List and count of results in the report
    const results = report.resultFieldList;
    const resultsCount = 20 // report.resultFieldList[0].values.length;

    for (let i = 0; i < resultsCount; i ++) {

        // Extract fields from the values list
        let checkInStatus = results[s.CheckInStatus].values[i];
        let conversionStatus = results[s.ConversionStatus].values[i];
        let orderNumber = results[s.OrderNumber].values[i];

        // Create new Sales Report Item and store it
        salesReportItems.push(new SalesReportItem(checkInStatus, conversionStatus, orderNumber));
    }
}

/** Process the Transaction Report */
function processTransactionReport(report) {

    // Empty list of Transaction Report Items
    const transactionReportItems: TransactionReportItem[] = [];

    // List and count of results in the report
    const results = report.resultFieldList;
    const resultsCount = 20; // report.resultFieldList[0].values.length;

    for (let i = 0; i < resultsCount; i ++) {

        let accountName = results[t.OrganizationName].values[i];
        let accountCategoryName = results[t.OrganizationCategoryName].values[i];
        let transactionAmount = results[t.TransactionAmount].values[i];
        let transactionId = results[t.TransactionId].values[i];
        let discountedTransactionAmount = results[t.DiscountedTransactionAmount].values[i];
        let transactionItemId = results[t.TransactionItemId].values[i];
        let transactionDate = results[t.TransactionDate].values[i];
        let discountTransactionValue = results[t.DiscountTransactionValue].values[i];
        let saleChannel = results[t.SaleChannel].values[i];
        let orderItemType = results[t.OrderItemType].values[i];
        let itemName = results[t.ItemName].values[i];
        let couponCode = results[t.CouponCode].values[i];
        let couponName = results[t.CouponName].values[i];
        let eventName = results[t.EventName].values[i];
        let eventStartTime = results[t.EventStartTime].values[i];
        let eventTemplateCustomField2 = results[t.TicketType].values[i];
        let ticketType = results[t.TicketType].values[i];
        let addOn = results[t.AddOn].values[i];
        let quantity = results[t.Quantity].values[i];
        let discountedUnitPrice = results[t.DiscountedUnitPrice].values[i];
        let paymentAmount = results[t.PaymentAmount].values[i];
        let email = results[t.Email].values[i];
        let orderNumber = results[t.OrderNumber].values[i];

        // Create new Sales Report Item and store it
        transactionReportItems.push(new TransactionReportItem(accountName, accountCategoryName, transactionAmount, discountedTransactionAmount, discountTransactionValue, saleChannel, orderItemType, itemName,
            couponCode, couponName, eventName, eventStartTime, ticketType, addOn, quantity, discountedUnitPrice, paymentAmount, email, eventTemplateCustomField2, transactionId, orderNumber, 'checkInStatus',
            'conversionStatus', transactionItemId, transactionDate));
    }
}

/** Process the Membership Report */
function processMembershipReport(report) {
    
    // Empty list of Membership Report items
    const membershipReportItems: MembershipReportItem[] = [];

    // List and count of results in the report
    const results = report.resultFieldList;
    const resultsCount = 20; // report.resultFieldList[0].values.length;
    
    for (let i = 0; i < resultsCount; i ++) {

        let membershipNumber = results[m.MembershipNumber].values[i];
        let membershipLevelName = results[m.MembershipLevelName].values[i];
        let membershipOfferingName = results[m.MembershipOfferingName].values[i];
        let membershipSource = results[m.MembershipSource].values[i];
        let membershipExternalMembershipId = results[m.MembershipExternalMembershipId].values[i];
        let membershipJoinDate = results[m.MembershipJoinDate].values[i];
        let membershipStartDate = results[m.MembershipStartDate].values[i];
        let membershipExpirationDate = results[m.MembershipExpirationDate].values[i];
        let membershipDuration = results[m.MembershipDuration].values[i];
        let membershipStanding = results[m.MembershipStanding].values[i];
        let membershipIsGifted = results[m.MembershipIsGifted].values[i];
        let membershipProgramName = results[m.RE_MembershipProgramName].values[i];
        let membershipCategoryName = results[m.RE_MembershipCategoryName].values[i];
        let membershipFund = results[m.RE_MembershipFund].values[i];
        let membershipCampaign = results[m.RE_MembershipCampaign].values[i];
        let membershipAppeal = results[m.RE_MembershipAppeal].values[i];
        
        // Customer Card values
        let cardType = results[m.CardType].values[i];
        let cardName = results[m.CardName].values[i];
        let cardStartDate = results[m.CardStartDate].values[i];
        let cardExpirationDate = results[m.CardExpirationDate].values[i];
        let cardCustomerPrimaryCity = results[m.CardCustomerPrimaryCity].values[i];
        let cardCustomerPrimaryState = results[m.CardCustomerPrimaryState].values[i];
        let cardCustomerPrimaryZip = results[m.CardCustomerPrimaryZip].values[i];
        let cardCustomerEmail = results[m.CardCustomerEmail].values[i];

        // Create new Customer Card
        const customerCard = new CustomerCard(cardType, cardName, cardStartDate, cardExpirationDate, cardCustomerPrimaryCity, cardCustomerPrimaryState, cardCustomerPrimaryZip, cardCustomerEmail);
        
        // Create new Membership Report Item and store it
        membershipReportItems.push(new MembershipReportItem(membershipNumber, membershipLevelName, membershipOfferingName, membershipSource, membershipExternalMembershipId, membershipJoinDate, membershipStartDate,
            membershipExpirationDate, membershipDuration, membershipStanding, membershipIsGifted, membershipProgramName, membershipCategoryName, membershipFund, membershipCampaign, membershipAppeal, customerCard));
    }

    console.log(membershipReportItems[0]);
}



main(); 