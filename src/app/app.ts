import { Config } from '@utils/config';
import { Reports } from '@interfaces/reports';
import * as https from 'https';
import * as request from 'request-promise-native';


const apiRootUrl = Config.apiRootUrl;
const apiKey = Config.apiKey;

function main() {

    // Endpoints for the API
    const salesReportEndpoint = 'b2b/analytics/report/execute/58c1a8c368d6093a3866db70';
    const transactionReportEndpoint = 'b2b/analytics/report/execute/58c1b3ab1f021613ddf20329';
    const membershipReportEndpoint = 'b2b/analytics/report/execute/58c1d056c1a3ef4d470db22e';


    const url = apiRootUrl + salesReportEndpoint;
    connectEndpoint(Reports.SALES_REPORT, url);


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

function processSalesReport(report) {

    console.log(report);

    console.log('CheckInStatus', 'ConversionStatus', 'OrderNumber');
    for (let i = 0; i < 20; i++) {
        console.log('Row: ', report.resultFieldList[0].values[i], report.resultFieldList[1].values[i], report.resultFieldList[2].values[i]);
    }


}

function processMembershipReport(report) {
    /** to do */
}

function processTransactionReport(report) {
    /** to do */
}

main(); 