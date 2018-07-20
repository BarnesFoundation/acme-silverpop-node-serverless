import { Config } from '@utils/config';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReport, AcmeReportList } from '@interfaces/acmeReport.interface'
import { TransactionReportFieldIndices } from '@enums/transactionReportFieldIndices.enum';
import { SalesReportItem } from '@classes/salesReportItem';
import { TransactionReportItem } from '@classes/transactionReportItem';
import * as request from 'request-promise-native';

const apiRootUrl = Config.apiRootUrl;
const apiKey = Config.apiKey;

function main() {

    getReports();
}

function getReports() {

    AcmeReportList.forEach(report => {

        const url = apiRootUrl + report.path;

        connectEndpoint(report.type, url);
    });
}

function connectEndpoint(reportType: string, requestUrl: string) {

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

/** Processes a Sales Report */
function processSalesReport(report) {

    // Empty list of Sales Report Items
    const salesReportItems: SalesReportItem[] = [];

    // Count of results in the report
    const resultsCount = 20 // report.resultFieldList[0].values.length;

    for (let i = 0; i < resultsCount; i++) {

        // Extract fields from the values list
        let checkInStatus = report.resultFieldList[0].values[i];
        let conversionStatus = report.resultFieldList[1].values[i];
        let orderNumber = report.resultFieldList[2].values[i];

        // Create new Sales Report Item and store it
        salesReportItems.push(new SalesReportItem(checkInStatus, conversionStatus, orderNumber));
    }
}

function processTransactionReport(report) {

    // Empty list of Transaction Report Items
    const transactionReportItems: TransactionReportItem[] = [];

    // Enums for the fields indices
    const t = TransactionReportFieldIndices;

    // List and count of results in the report
    const results = report.resultFieldList;
    const resultsCount = 20 // report.resultFieldList[0].values.length;

    for (let i = 0; i < 1; i++) {

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

function processMembershipReport(report) {
    /** to do */

    console.log(report);
}



main(); 