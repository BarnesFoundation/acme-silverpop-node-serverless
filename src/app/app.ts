import * as request from 'request-promise-native';
import * as ssh2SFTPClient from 'ssh2-sftp-client';
import * as querystring from 'querystring';

import { Callback } from 'aws-lambda';

import { Config } from '@utils/config';
import { Convert } from '@utils/time';
import { Input } from '@interfaces/input.interface';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReportList, AcmeReport } from '@interfaces/acmeReport.interface';
import { AcmeReportPayload } from '@interfaces/acmeReportPayload.interface';

import * as rp from '@classes/reportProcessor';
import * as pp from '@classes/payloadProcessor';

async function main(input: Input, cb: Callback) {

    let startTime = Date.now();

    let reportId = input.reportId;

    // Set the report to be used for this execution
    let report = setReport(reportId)

    // Determine the file name based on the environment 
    let fileName = (Config.environment === "PRODUCTION") ? input.report + '.csv' : input.report + '-test.csv';

    // Retrieve the data for this report from ACME
    let reportData = await getReportFromEndpoint(report.type, constructReportUrl(report.path));
    
    let reportRecords = pp.processToRecords(reportData.resultFieldList, report.type) ;
    
    // Apply report modifications
    let reportCSV = await modifyReport(reportRecords, reportId);

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

/** Constructs the complete report url to execute in the ACME API */
function constructReportUrl(path) {
    return Config.apiRootUrl + Config.apiReportEndpoint + path;
}

/** Fetches report from the specified endpoint */
function getReportFromEndpoint(reportType: ReportEnums, requestUrl: string): request.RequestPromise<AcmeReportPayload> {

    // Configure options for the http request
    const options = {
        url: requestUrl,
        headers: {
            'Accept': 'application/json',
            'x-acme-api-key': Config.apiKey,
            'x-b2c-tenant-id': Config.apiTenantId
		}, 
		json: true,
		timeout: 900000
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

/** Applies modifications to the passed records and returns csv string */
async function modifyReport(reportRecords: any, reportType: string): Promise<string> {

	let csv;
	let records;

    switch (reportType) {

		// Membership report has guests removed, sorted, and deduped
        case ReportEnums.MEMBERSHIP_REPORT: {

            // Remove guests, sort by card expiration date, and remove duplicates
            records = rp.removeGuests(reportRecords);
            records = rp.sortByDateField(records, 'MembershipExpirationDate');
			records = rp.removeDuplicates(records, 'CardCustomerEmail');
            break;
        }

		// Transaction report gets no modifications
        case ReportEnums.TRANSACTION_REPORT: {
            
            records = reportRecords;
            break;
        }

		 // Contact report gets sorted and deduped
        case ReportEnums.CONTACT_REPORT: {

            // Sort based on transaction date, remove duplicates, 
            records = rp.sortByDateField(reportRecords, 'TransactionDate');
            records = rp.removeDuplicates(records, 'Email');
            break;
        }
	}
	
	// CSV-ify the records and return the csv
	csv = await rp.createCSV(records);
    return csv;
}
       
export { main as Main }; 