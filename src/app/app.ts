import * as ssh2SFTPClient from "ssh2-sftp-client";
import { ReportFunctions, ACMETicketingClient } from "acme-ticketing-client";
import { Readable } from "stream";

import { Callback } from "aws-lambda";

import { Config } from "@utils/config";
import { Convert } from "@utils/time";
import { pollUntilComplete } from "@utils/polUntilComplete";
import { generateReportFileName } from "@utils/generateReportFileName";
import { Input } from "@interfaces/input.interface";
import { ReportEnums } from "@enums/report.enums";
import {
  AcmeReportList,
  AcmeReport,
} from "@interfaces/acmeReport_Template.interface";

import * as rp from "@classes/reportProcessor";
import * as pp from "@classes/payloadProcessor";
import { Membership } from "./classes/membership.class";
import { Transaction } from "./classes/transaction.class";
import { Person } from "@classes/person.class";

new ACMETicketingClient({
  b2cTenantId: Config.apiTenantId,
  apiKey: Config.apiKey,
  apiRootUrl: Config.apiRootUrl,
});

async function main(input: Input, cb: Callback) {
  const startTime = Date.now();

  // Set the report to be used for this execution and file name
  const requestedReport = setReport(input.reportId);
  const fileName = generateReportFileName(input.report);

  // Retrieve report results and parse them to records
  const records = await execute(requestedReport);
  console.log(
    `Created ${records.length} records for the ${input.report} Report`
  );

  const reportCSV = await modifyReportRecords(records, requestedReport.type);
  console.log(`Generated the CSV for the report`);

  // Upload the report CSV to the SFTP site
  try {
    await uploadToSFTP(reportCSV, fileName);
    const elapsedTime = Convert(Date.now() - startTime);

    console.log(
      `Uploaded ${fileName} to the SFTP site with elapsed time ${elapsedTime}`
    );
    cb(
      null,
      `Successfully uploaded the file ${fileName} to the SFTP site in ${elapsedTime}`
    );
  } catch (error) {
    cb(error);
  }
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

/** Connects to the Watson Campaign Automation SFTP site */
async function uploadToSFTP(reportCSV: string, nameOfCSV: string) {
  const sftpPath = `/upload/${nameOfCSV}`;
  const sftpClient = new ssh2SFTPClient();

  // Setup stream for writing. For some reason, typescript doesn't recognize "Readable.from" as a valid function
  // @ts-ignore
  const readable = Readable.from(reportCSV);
  const stream = new Readable();

  // Add the CSV to the stream and newline to signify end of stream
  readable.on("data", (csvChunk) => {
    stream.push(csvChunk);
  });
  readable.on("end", () => {
    stream.push(null);
  });

  try {
    await sftpClient.connect({
      host: Config.sftpHost,
      port: 22,
      username: Config.sftpUsername,
      password: Config.sftpPassword,
    });
    await sftpClient.put(stream, sftpPath);
    await sftpClient.end();
  } catch (error) {
    console.log(
      `Failed upload of the CSV ${nameOfCSV} to ${sftpPath} in the SFTP site`,
      error
    );
    throw new Error(
      `An error occurred uploading the CSV ${nameOfCSV} to the SFTP site`
    );
  }
}

/** Applies modifications to the passed records and returns csv string */
async function modifyReportRecords(
  reportRecords: Person[] | Membership[] | Transaction[],
  reportType: ReportEnums
): Promise<string> {
  switch (reportType) {
    // Membership report has guests removed, sorted, and deduped
    case ReportEnums.MEMBERSHIP_REPORT: {
      let records = reportRecords as Membership[];

      // Remove guests, sort by card expiration date, and remove duplicates
      records = rp.removeGuests(records);
      records = rp.sortByDateField(records, "MembershipExpirationDate");
      records = rp.removeDuplicates(records, "CardCustomerEmail");

      // Create CSV with these headers only
      const membershipCSV = await rp.createCSV(records, [
        "MembershipNumber",
        "MembershipLevelName",
        "MembershipOfferingName",
        "MembershipSource",
        "MembershipExternalMembershipId",
        "MembershipJoinDate",
        "MembershipStartDate",
        "MembershipExpirationDate",
        "MembershipDuration",
        "MembershipStanding",
        "MembershipIsGifted",
        "RE_MembershipProgramName",
        "RE_MembershipCategoryName",
        "RE_MembershipFund",
        "RE_MembershipCampaign",
        "RE_MembershipAppeal",
        "CardType",
        "CardName",
        "CardStartDate",
        "CardExpirationDate",
        "CardCustomerPrimaryCity",
        "CardCustomerPrimaryState",
        "CardCustomerPrimaryZip",
        "CardCustomerEmail",
        "LogInLink",
        "RenewLink",
        "LinkExp",
      ]);
      return membershipCSV;
    }

    // Transaction report gets no modifications
    case ReportEnums.TRANSACTION_REPORT: {
      const transactionCSV = await rp.createCSV(reportRecords);
      return transactionCSV;
    }

    // Contact report
    case ReportEnums.CONTACT_REPORT: {
      // Remove duplicates -- because membership records are listed first, they'll always be the latest unique record for a person.
      // And if no membership record exists for a person's transaction, their latest transaction details would be used instead
      const records = rp.removeDuplicates(reportRecords as Person[], "Email");

      // Create CSV with these headers only
      const contactCSV = await rp.createCSV(records, [
        "Email",
        "ContactFirstName",
        "ContactLastName",
        "ZipCode",
      ]);
      return contactCSV;
    }

    default: {
      throw new Error("Unhandled report type passed for CSV creation");
    }
  }
}

/** Handles most of the work for processing the requested report. Returns a list of records of Transaction, Membership, or Person type */
async function execute(
  report: AcmeReport
): Promise<Membership[] | Transaction[] | Person[]> {
  // Handle executing the Contact Report
  if (report.type === ReportEnums.CONTACT_REPORT) {
    const { membershipReport } = AcmeReportList;

    const transactionReportDefinition =
      await ReportFunctions.getReportDefinition(report.path);
    const membershipReportDefinition =
      await ReportFunctions.getReportDefinition(membershipReport.path);

    // Get the definitions for both of the reports
    const transactionReportExecution = await ReportFunctions.executeReport({
      reportUuid: report.path,
      queryExpression: transactionReportDefinition.queryExpression,
      endDate: transactionReportDefinition.dateSettings.endDate,
      endDateTime: transactionReportDefinition.dateSettings.endDateTime,
      startDate: transactionReportDefinition.dateSettings.startDate,
      startDateTime: transactionReportDefinition.dateSettings.startDateTime,
      dateRangeField: transactionReportDefinition.dateSettings.dateRangeField,
    });
    const membershipReportExecution = await ReportFunctions.executeReport({
      reportUuid: membershipReport.path,
      queryExpression: membershipReportDefinition.queryExpression,
      endDate: membershipReportDefinition.dateSettings.endDate,
      endDateTime: membershipReportDefinition.dateSettings.endDateTime,
      startDate: membershipReportDefinition.dateSettings.startDate,
      startDateTime: membershipReportDefinition.dateSettings.startDateTime,
      dateRangeField: membershipReportDefinition.dateSettings.dateRangeField,
    });

    // Poll until the reports are complete
    await Promise.all([
      pollUntilComplete(transactionReportExecution),
      pollUntilComplete(membershipReportExecution),
    ]);

    // Retrieve the report results
    const [transactionData, membershipData] = await Promise.all([
      ReportFunctions.retrieveReportResults(
        transactionReportExecution.id,
        "json"
      ),
      ReportFunctions.retrieveReportResults(
        membershipReportExecution.id,
        "json"
      ),
    ]);
    console.log(
      "Retrieved report results for the Transaction and Membership Reports execution"
    );

    // Convert both to lists of person objects
    const personRecordsFromTransactions = (await pp.processToRecords(
      transactionData.resultFieldList,
      report.type
    )) as Person[];
    const personRecordsFromMemberships = (
      (await pp.processToRecords(
        membershipData.resultFieldList,
        membershipReport.type
      )) as Membership[]
    ).map((membership) => {
      const {
        CardCustomerEmail,
        CardCustomerFirstName,
        CardCustomerLastName,
        CardCustomerPrimaryZip,
        CardStartDate,
      } = membership;
      return new Person(
        CardCustomerEmail,
        CardCustomerFirstName,
        CardCustomerLastName,
        CardCustomerPrimaryZip,
        CardStartDate
      );
    });

    // We want the most recent membership record to use as the final contact record, or if no membership record exists for that person, we'd use the latest transaction record
    // So sort both record sets by transaction date descending
    const [
      sortedContactRecordsFromTransactions,
      sortedContactRecordsFromMemberships,
    ] = await Promise.all([
      rp.sortByDateField(personRecordsFromTransactions, "TransactionDate"),
      rp.sortByDateField(personRecordsFromMemberships, "TransactionDate"),
    ]);

    // Merge the two lists into a single records lst -- with memberships being first. This way a membership record would supercede even a later transaction record
    const records = [
      ...sortedContactRecordsFromMemberships,
      ...sortedContactRecordsFromTransactions,
    ];

    return records;
  }

  // Handle executing the Transaction Report
  else {
    const transactionReportDefinition =
      await ReportFunctions.getReportDefinition(report.path);

    // Get the definitions for both of the reports
    const transactionReportExecution = await ReportFunctions.executeReport({
      reportUuid: report.path,
      queryExpression: transactionReportDefinition.queryExpression,
      endDate: transactionReportDefinition.dateSettings.endDate,
      endDateTime: transactionReportDefinition.dateSettings.endDateTime,
      startDate: transactionReportDefinition.dateSettings.startDate,
      startDateTime: transactionReportDefinition.dateSettings.startDateTime,
      dateRangeField: transactionReportDefinition.dateSettings.dateRangeField,
    });

    // Poll until the reports are complete
    await pollUntilComplete(transactionReportExecution);

    // Retrieve the report results
    const transactionData = await ReportFunctions.retrieveReportResults(
      transactionReportExecution.id,
      "json"
    );
    console.log(
      "Retrieved report results for the Transaction Report execution"
    );

    const records = await pp.processToRecords(
      transactionData.resultFieldList,
      report.type
    );

    return records;
  }
}

export { main as Main };
