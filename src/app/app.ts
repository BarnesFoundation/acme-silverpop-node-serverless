import * as request from 'request-promise-native';
import * as ssh2SFTPClient from 'ssh2-sftp-client';

import { Config } from '@utils/config';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReportList } from '@interfaces/acmeReport.interface'


async function main() {

    // Get the report objects
    let transactionReport = AcmeReportList.transactionReport;
    let membershipReport = AcmeReportList.membershipReport;
    let salesReport = AcmeReportList.salesReport;

    // Retrieve the report CSVs from ACME
    let transactionCSV = await getReportFromEndpoint(membershipReport.type, constructReportUrl(membershipReport.path));
    let membershipCSV = await getReportFromEndpoint(transactionReport.type, constructReportUrl(transactionReport.path));
    let salesCSV = await getReportFromEndpoint(salesReport.type, constructReportUrl(salesReport.path));

    // Upload the reports to the SFTP site
    uploadToSFTP(salesCSV, salesReport.type);
    uploadToSFTP(transactionCSV, transactionReport.type);
    uploadToSFTP(membershipCSV, membershipReport.type);
}

/** Iterates fetching through the list of available report types */
function constructReportUrl(path) {
    return Config.apiRootUrl + Config.apiReportEndpoint + path;
}

/** Fetches report from the specified endpoint */
function getReportFromEndpoint(reportType: ReportEnums, requestUrl: string): request.RequestPromise<any> {

    // Configure options for the http request
    const options = {
        url: requestUrl,
        headers: {
            'Accept': 'application/json',
            'x-acme-api-key': Config.apiKey
        }, json: true
    }

    // Await the response for the csv data from the request
    try {
         return request.get(options)
    }
    catch (error) {
        console.log('An error occurred: ', error);
    }
}

/** Connects to the Watson Campaign Automation SFTP site */
function uploadToSFTP(csv, reportType) {

    // Setup sftp client
    let sftp = new ssh2SFTPClient();

    let credentials = {
        host: Config.sftpHost,
        port: 22,
        username: Config.sftpUsername,
        password: Config.sftpPassword
    };

    // Setup stream for writing
    let Readable = require('stream').Readable;
    let stream = new Readable;

    let fileName = '/upload/' + reportType + '.csv';

    // Add the CSV to the stream and newline to signify end of stream
    stream.push(csv);
    stream.push(null);

    sftp.connect(credentials)
        .then(() => {
            return sftp.put(stream, fileName)
        })
        .then((response) => {
            console.log('Successfully wrote ' + fileName + ' to SFTP');
            sftp.end();
        })
        .catch((error) => {
            console.log('An error occurred with the SFTP', error);
        });
}

export { main as Main };