import { Config } from '@utils/config';
import { Reports } from '@interfaces/reports';
import { SalesReportItem } from '@classes/salesReportItem';
import * as https from 'https';
import * as request from 'request-promise-native';


const apiRootUrl = Config.apiRootUrl;
const apiKey = Config.apiKey;

function main() {

    getReports();
}

function getReports() {

    // Endpoints for the API
    const salesReportEndpoint = 'b2b/analytics/report/execute/58c1a8c368d6093a3866db70';
    const transactionReportEndpoint = 'b2b/analytics/report/execute/58c1b3ab1f021613ddf20329';
    const membershipReportEndpoint = 'b2b/analytics/report/execute/58c1d056c1a3ef4d470db22e';


    // const url = apiRootUrl + salesReportEndpoint;
    // connectEndpoint(Reports.SALES_REPORT, url);

    
}

function connectEndpoint(reportType: string, requestUrl: string) {

    const options = {
        url: requestUrl,
        headers: {
            'Accept': 'application/json',
            'x-acme-api-key': apiKey
        }, json: true
    }

    request.get(options)
        .then((response) => {
            
            switch (reportType) {

                case Reports.SALES_REPORT:
                    processSalesReport(response);
                    break;

                case Reports.MEMBERSHIP_REPORT:
                    processMembershipReport(response);
                    break;

                case Reports.TRANSACTION_REPORT:
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
    const resultsCount = report.resultFieldList[0].values.length;

    for (let i = 0; i < 20; i++) {

        // Extract fields from the values list
        let checkInStatus = report.resultFieldList[0].values[i];
        let conversionStatus = report.resultFieldList[1].values[i];
        let orderNumber = report.resultFieldList[2].values[i];

        // Create and store the new Sales Report Item
        salesReportItems.push(new SalesReportItem(checkInStatus, conversionStatus, orderNumber)); 
    }
}

function processMembershipReport(report) {
    /** to do */
}

function processTransactionReport(report) {
    /** to do */
}

main(); 