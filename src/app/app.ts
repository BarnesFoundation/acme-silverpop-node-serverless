import * as request from 'request-promise-native';
import * as ssh2SFTPClient from 'ssh2-sftp-client';

import { Callback } from 'aws-lambda';

import { Config } from '@utils/config';
import { Convert } from '@utils/time';
import { Input } from '@interfaces/input.interface';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReportList, AcmeReport } from '@interfaces/acmeReport.interface';

import * as rp from '@classes/reportProcessor';

async function main(input: Input, cb: Callback) {

    let startTime = Date.now();

    let reportId = input.reportId;

    // Set the report to be used for this execution
    let report = setReport(reportId)

    // Determine the file name based on the environment 
    let fileName = (Config.environment === "PRODUCTION") ? report.type + '.csv' : report.type + '-test.csv';

    // Retrieve the CSV for this report from ACME
    let reportCSV = await getReportFromEndpoint(report.type, constructReportUrl(report.path));

    // Apply report modifications
    reportCSV = await modifyReport(reportCSV, reportId);

    // Upload the reports to the SFTP site
    let error;
    let sftpUploadSuccess = await uploadToSFTP(reportCSV, fileName, error);

    let endTime = Date.now();
    let elapsedTime = Convert(endTime - startTime);

    let result = (sftpUploadSuccess) ? 'Uploaded ' + fileName + ' to the SFTP site with elapsed time ' + elapsedTime : 'Failed to upload ' + fileName + ' to the SFTP site';

    // Return success
    if (sftpUploadSuccess) { cb(null, result); }

    // Pass the error to AWS
    else { cb(error, result); }
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

        case ReportEnums.CONTACT_REPORT:
            report = AcmeReportList.contactReport;
            break;
    }

    return report;
}

/** Iterates fetching through the list of available report types */
function constructReportUrl(path) {
    return Config.apiRootUrl + Config.apiReportEndpoint + path;
}

/** Fetches report from the specified endpoint */
function getReportFromEndpoint(reportType: ReportEnums, requestUrl: string): request.RequestPromise<string> {

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
        console.log('An error occurred uploading to ' + sftpPath + ' in the SFTP site', error);

        // Return that an error occurred during the sftp upload
        possibleError = error;
        successfulUpload = false;
    }
    finally {
        return successfulUpload;
    }
}

/** Applies modifications to the passed report csv */
async function modifyReport(reportCSV: string, reportId: string): Promise<string> {

    let csv;

    switch (reportId) {

        case ReportEnums.MEMBERSHIP_REPORT: {

            let uniqueIdentifier = 'CardCustomerEmail';
            let columnsToRemove = ['CardCustomerFirstName', 'CardCustomerLastName'];
            let dateField = 'MembershipExpirationDate';

            // Parse the csv into an array of objects
            let csvArray = await rp.parser(reportCSV);

            // Remove guests
            csvArray = rp.removeGuests(csvArray);

            // Sort by card expiration date
            csvArray = rp.sortByDateField(csvArray, dateField);

            // Remove duplicates
            csvArray = rp.removeDuplicates(csvArray, uniqueIdentifier);

            // Remove unneeded columns
            csvArray = rp.removeColumns(csvArray, columnsToRemove);

            // Create csv string
            csv = await rp.createCSV(csvArray);

            break;
        }

        case ReportEnums.SALES_REPORT: {
            csv = reportCSV;

            break;
        }

        case ReportEnums.TRANSACTION_REPORT: {

            let columnsToRemove = ['ContactFirstName', 'ContactLastName', 'ZipCode', 'MembershipExternalId', 'MembershipPrimaryFirstName', 'MembershipPrimaryLastName', 'MembershipLevelName', 'MembershipOfferingName'];
            let columnsSortOrder = [];

            // Parse the csv into an array of objects
            let csvArray = await rp.parser(reportCSV);

            // Remove unneeded columns
            csvArray = rp.removeColumns(csvArray, columnsToRemove);
            
            csv = await rp.createCSV(csvArray);

            break;
        }

        case ReportEnums.CONTACT_REPORT: {

            let dateField = 'TransactionDate';
            let uniqueIdentifier = 'Email';

            // Parse the csv into an array of objects
            let csvArray = await rp.parser(reportCSV);

            // Sort based on transaction date
            csvArray = rp.sortByDateField(csvArray, dateField);

            // Remove duplicates
            csvArray = rp.removeDuplicates(csvArray, uniqueIdentifier)

            // Create the persons array
            let persons = rp.createPersonRecords(csvArray);

            csv = await rp.createCSV(persons);

            break;
        }
    }
    return csv;
}

export { main as Main };