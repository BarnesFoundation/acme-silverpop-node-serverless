import * as request from 'request-promise-native';
import * as ssh2SFTPClient from 'ssh2-sftp-client';

import { Callback } from 'aws-lambda';

import { Config } from '@utils/config';
import { Convert } from '@utils/time';
import { Input } from '@interfaces/input.interface';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReportList, AcmeReport } from '@interfaces/acmeReport.interface';
import { AcmeReportPayload } from '@interfaces/acmeReportPayload.interface';

import * as rp from '@classes/reportProcessor';
import * as pp from '@classes/payloadProcessor';
import { Membership } from './classes/membership.class';
import { Transaction } from './classes/transaction.class';
import { Person } from '@classes/person.class';


async function main(input: Input, cb: Callback) {

	const startTime = Date.now();

	const { reportId } = input;

	// Set the report to be used for this execution and file name
	const requestedReport = setReport(reportId)
	const fileName = (Config.environment === "PRODUCTION") ? input.report + '.csv' : input.report + '-test.csv';

	// Retrieve the report records and pply modifications to them
	const records = await execute(requestedReport);
	const reportCSV = await modifyReportRecords(records, requestedReport.type);

	// Upload the reports to the SFTP site
	let error;
	const sftpUploadSuccess = await uploadToSFTP(reportCSV, fileName, error);

	const elapsedTime = Convert(Date.now() - startTime);
	const result = (sftpUploadSuccess) ? 'Uploaded ' + fileName + ' to the SFTP site with elapsed time ' + elapsedTime : 'Failed to upload ' + fileName + ' to the SFTP site';

	// Return success
	if (sftpUploadSuccess) { cb(null, result); }

	// Pass the error to AWS
	else { cb(error, result); }
}

/** Sets the report to be executed and uploaded */
function setReport(reportId): AcmeReport {

	// Match report to be executed
	switch (reportId) {

		case ReportEnums.SALES_REPORT:
			return AcmeReportList.salesReport;

		case ReportEnums.TRANSACTION_REPORT:
			return AcmeReportList.transactionReport;

		case ReportEnums.MEMBERSHIP_REPORT:
			return AcmeReportList.membershipReport;

		case ReportEnums.CONTACT_REPORT:
			return AcmeReportList.contactReport;
	}
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
		console.log(`An error occurred retrieving: ${reportType} from ACME`, error);
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

	let sftpPath = `/upload/${csvName}`;

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
		console.log(`An error occurred uploading to ${sftpPath} in the SFTP site`, error);

		// Return that an error occurred during the sftp upload
		possibleError = error;
		successfulUpload = false;
	}
	finally {
		return successfulUpload;
	}
}

/** Applies modifications to the passed records and returns csv string */
async function modifyReportRecords(reportRecords: Person[] | Membership[] | Transaction[], reportType: string): Promise<string> {

	let csv: string;

	switch (reportType) {

		// Membership report has guests removed, sorted, and deduped
		case ReportEnums.MEMBERSHIP_REPORT: {

			let records = reportRecords as Membership[];

			// Remove guests, sort by card expiration date, and remove duplicates
			records = rp.removeGuests(records);
			records = rp.sortByDateField(records, 'MembershipExpirationDate');
			records = rp.removeDuplicates(records, 'CardCustomerEmail');

			// Create CSV with these headers only
			csv = await rp.createCSV(records, ['MembershipNumber', 'MembershipLevelName', 'MembershipOfferingName', 'MembershipSource', 'MembershipExternalMembershipId', 'MembershipJoinDate', 'MembershipStartDate', 'MembershipExpirationDate', 'MembershipDuration', 'MembershipStanding', 'MembershipIsGifted', 'RE_MembershipProgramName', 'RE_MembershipCategoryName', 'RE_MembershipFund', 'RE_MembershipCampaign', 'RE_MembershipAppeal', 'CardType', 'CardName', 'CardStartDate', 'CardExpirationDate', 'CardCustomerPrimaryCity', 'CardCustomerPrimaryState', 'CardCustomerPrimaryZip', 'CardCustomerEmail', 'LogInLink', 'LogInLinkExp']);
			break;
		}

		// Transaction report gets no modifications
		case ReportEnums.TRANSACTION_REPORT: {

			let records = reportRecords as Transaction[];
			csv = await rp.createCSV(records);
			break;
		}

		// Contact report
		case ReportEnums.CONTACT_REPORT: {

			let records = reportRecords as Person[];

			// Remove duplicates -- because membership records are listed first, they'll always be the latest unique record for a person. And if no membership record exists for a person's transaction, their latest transaction details would be used instead
			records = rp.removeDuplicates(records, 'Email');

			// Create CSV with these headers only
			csv = await rp.createCSV(records, ['Email', 'ContactFirstName', 'ContactLastName', 'ZipCode']);
			break;
		}
	}

	return csv;
}

/** Handles most of the work for processing the requested report. Returns a list of records of Transaction, Membership, or Person type */
async function execute(report: AcmeReport): Promise<Membership[] | Transaction[] | Person[]> {

	let records;

	if (report.type === ReportEnums.CONTACT_REPORT) {

		// Retrieve the transaction data and membership data simultaneously
		const [transactionData, membershipData] = await Promise.all([getReportFromEndpoint(report.type, constructReportUrl(report.path)), getReportFromEndpoint(AcmeReportList.membershipReport.type, constructReportUrl(AcmeReportList.membershipReport.path))]);

		// Convert both to lists of person objects
		const personRecordsFromTransactions = pp.processToRecords(transactionData.resultFieldList, report.type) as Person[];
		const personRecordsFromMemberships = (pp.processToRecords(membershipData.resultFieldList, AcmeReportList.membershipReport.type) as Membership[]).map((membership) => {
			const { CardCustomerEmail, CardCustomerFirstName, CardCustomerLastName, CardCustomerPrimaryZip, CardStartDate } = membership;
			return new Person(CardCustomerEmail, CardCustomerFirstName, CardCustomerLastName, CardCustomerPrimaryZip, CardStartDate);
		});

		// We want the most recent membership record to use as the final contact record, or if no membership record exists for that person, we'd use the latest transaction record
		// So sort both record sets by transaction date descending
		const [ sortedContactRecordsFromTransactions, sortedContactRecordsFromMemberships ] = await Promise.all([ rp.sortByDateField(personRecordsFromTransactions, 'TransactionDate'), rp.sortByDateField(personRecordsFromMemberships, 'TransactionDate')]);

		// Merge the two lists into a single records lst -- with memberships being first. This way a membership record would supercede even a later transaction record
		records = [ ...sortedContactRecordsFromMemberships, ...sortedContactRecordsFromTransactions ];
	}

	else {
		// Retrieve the data for this report from ACME
		const reportData = await getReportFromEndpoint(report.type, constructReportUrl(report.path));
		records = pp.processToRecords(reportData.resultFieldList, report.type);
	}

	return records;
}

export { main as Main }; 