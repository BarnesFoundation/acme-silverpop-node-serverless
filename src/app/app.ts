import * as request from 'request-promise-native';
import * as ssh2SFTPClient from 'ssh2-sftp-client';

import { Callback } from 'aws-lambda';

import { Config } from '@utils/config';
import { Input } from '@interfaces/input.interface';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReportList, AcmeReport } from '@interfaces/acmeReport.interface'

async function main(input: Input, cb: Callback) {

    // Set the report to be used for this execution
    let report = setReport(input.reportId)
    let fileName = report.type + '.csv';

    // Retrieve the CSV for this report from ACME
    let reportCSV = await getReportFromEndpoint(report.type, constructReportUrl(report.path))

    // Upload the reports to the SFTP site
    let error;
    let sftpUploadSuccess = await uploadToSFTP(reportCSV, fileName, error);
    let result = (sftpUploadSuccess) ? 'Finished uploading ' + fileName + ' to the SFTP site' : 'Failed to upload ' + fileName + ' to the SFTP site';

    // Return success
    if (sftpUploadSuccess) { cb(null, result); } 
    
    // Pass the error to AWS
    else { cb(error, result) }   
}

/** Sets the report to be executed and uploaded */
function setReport(reportId): AcmeReport {

    let report: AcmeReport

    // Match report to be exected
    switch (reportId) {

        case ReportEnums.SALES_REPORT:
            report = AcmeReportList.salesReport;
            break;

        case ReportEnums.TRANSACTION_REPORT:
            report = AcmeReportList.transactionReport;
            break;

        case ReportEnums.MEMBERSHIP_REPORT:
            report = AcmeReportList.membershipReport;
            break;
    }

    return report;
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
            'x-acme-api-key': Config.apiKey,
            'x-b2c-tenant-id': Config.apiTenantId
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
async function uploadToSFTP(csv, csvName, possibleError) {

    let successfulUpload: boolean;

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

    let sftpPath = '/upload/' + csvName;

    // Add the CSV to the stream and newline to signify end of stream
    stream.push(csv);
    stream.push(null);

    try {
        await sftp.connect(credentials);
        await sftp.put(stream, sftpPath);
        await sftp.end();

        // Set that the stfp upload completed
        successfulUpload = true;
    }
    catch (error) {
        console.log('An error occurred uploading to ' + sftpPath + ' in the SFTP site' , error);

        // Return that an error occurred during the sftp upload
        possibleError = error;
        successfulUpload = false;
    }
    finally {
        return successfulUpload;
    }
}

export { main as Main };