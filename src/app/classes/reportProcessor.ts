import * as parse from 'csv-parse';
import * as stringify from 'csv-stringify';

import { ReportEnums } from '@enums/report.enums';
import { Person } from '@classes/person.class';
import { Transaction } from '@classes/transaction.class';
import { Membership } from '@classes/membership.class';


/** Parses a provided csv string into an array of objects */
export function parser(csv, recordType): Promise<any[]> {
    return new Promise((resolve, reject) => {

        // Setup output and the parser
        let output = [];
        let parser = parse({ columns: true });

        // Read in the stream for parsing
        parser.on('readable', () => {
            let record;
            while (record = parser.read()) {
                output.push(objectFactory(record, recordType));
            }
        });

        // Catch any error
        parser.on('error', (error) => { console.log(error.message); });

        // Once parsing has finished
        parser.on('end', () => { resolve(output); });

        // Write the csv to the parser
        parser.write(csv);
        parser.end();
    });
}

function objectFactory(r, objectType): {} {

    switch (objectType) {

        case ReportEnums.CONTACT_REPORT:
            return new Person(r.Email, r.ContactFirstName, r.ContactLastName, r.ZipCode);

        case ReportEnums.TRANSACTION_REPORT:
            return new Transaction(r.OrganizationName, r.OrganizationCategoryName, r.TransactionAmount, r.DiscountedTransactionAmount, r.DiscountTransactionValue, r.SaleChannel, r.OrderItemType,
                r.ItemName, r.CouponCode, r.CouponName, r.EventName, r.EventStartTime, r.TicketType, r.AddOn, r.Quantity, r.DiscountedUnitPrice, r.PaymentAmount, r.Email, r.EventTemplateCustomerField2, r.TransactionId, r.OrderNumber, '', '', r.TransactionItemId, r.TransactionDate);

        case ReportEnums.MEMBERSHIP_REPORT:
                return new Membership(r.MembershipNumber, r.MembershipLevelName, r.MembershipOfferingName, r.MembershipSource, r.MembershipExternalMembershipId, r.MembershipJoinDate, r.MembershipStartDate, r.MembershipExpirationDate, r.MembershipDuration, r.MembershipStanding, r.MembershipIsGifted, r.RE_MembershipProgramName, r.RE_MembershipCategoryName, r.RE_MembershipFund, r.RE_MembershipCampaign, r.RE_MembershipAppeal, r.CardType, r.CardName, r.CardStartDate, r.CardExpirationDate, r.CardCustomerPrimaryCity, r.CardCustomerPrimaryState, r.CardCustomerPrimaryZip, r.CardCustomerEmail);
                
        case ReportEnums.SALES_REPORT:
                return r;
    }
}

/** Removes guest rows from the provided csv array */
export function removeGuests(csv: any[]) {
    return csv.filter((currentElement, index, array) => {
        return !currentElement.CardName.toLowerCase().includes('Guest of'.toLowerCase()) // Only accept rows where CardName doesn't include 'Guest of'
    });
}

/** Sorts the provided array by the provided date-type field, in descending order */
export function sortByDateField(csv: any[], dateField) {
    return csv.sort((a, b) => {

        // Get the date of each row
        let aDate = new Date(a[dateField]);
        let bDate = new Date(b[dateField]);

        // -1 so that it is in descending order
        if (aDate > bDate) { return -1; }

        if (bDate > aDate) { return 1; }

        if (aDate.getTime() === bDate.getTime()) { return 0; }
    });
}

/** Transform a csv-like array and returns a csv formatted string */
export function createCSV(records: any[]): Promise<string> {
    return new Promise((resolve, reject) => {

        // Generate the headers for the csv
        let headers = generateHeaders(records[0]);

        // Create output and stringifier
        let csvString = [];
        let stringifier = stringify({ columns: headers, header: true });

        // Read each row into the output
        stringifier.on('readable', () => {
            let row;
            while (row = stringifier.read()) { csvString.push(row); }
        });

        // Write each record to be stringifier
        for (let i = 0; i < records.length; i++) {

            let row = [];

            // Build the row by iterating the object properties and adding them
            for (let j = 0; j < headers.length; j++) { row.push(records[i][headers[j].key]); }

            stringifier.write(row);
        }

        stringifier.end();

        // Catch any errors that occur in reading the input
        stringifier.on('error', (error) => { reject(error); });

        // Resolve the promise once the stringifier is done
        stringifier.on('finish', () => { resolve(csvString.join('')); });
    });
}

/** Generates a key-value array containing the properties of an object */
function generateHeaders(record: {}): { key: string }[] {

    let headers = [];
    let properties = Object.getOwnPropertyNames(record)

    for (let i = 0; i < properties.length; i++) {
        let header = { key: properties[i] }
        headers.push(header);
    }
    return headers;
}

/** Removes duplicate rows based on the provided unique key */
export function removeDuplicates(records: any[], uniqueField): any[] {

    // Array of encountered records and duplicates filtered out
    let encountered = [];
    let filteredSet = [];

    for (let i = 0; i < records.length; i++) {

        let uniqueIndex: string = records[i][uniqueField].toLowerCase();

        // Continue if the identfier field is blank space
        if (uniqueIndex.trim().length == 0) { continue }

        // Othertise, process as expected
        else {

            // If the record doesn't already exist in the encountered array, add it there and the filtered array
            if (typeof encountered[uniqueIndex] === 'undefined') {

                // Add that we've encountered the index and add the data to filtered set
                encountered[uniqueIndex] = records[i];
                filteredSet.push(records[i]);
            }
        }
    }

    // Empty the encountered array
    encountered = [];

    return filteredSet;
}

/** Removes the designated columns from each object in the array provided */
export function removeColumns(records: {}[], columns: any[]): any[] {

    // Iterate through the records
    for (let i = 0; i < records.length; i++) {

        // Delete the columns from the record
        for (let j = 0; j < columns.length; j++) { delete records[i][columns[j]]; };
    }
    return records;
}

export function createPersonRecords(records: any[]): Person[] {

    let persons: Person[] = [];

    for (let i = 0; i < records.length; i++) {

        let transaction: any = records[i];

        let person: Person = {
            Email: transaction.Email,
            ContactFirstName: transaction.ContactFirstName,
            ContactLastName: transaction.ContactLastName,
            ZipCode: transaction.ZipCode
        };

        persons.push(person);
    }
    return persons;
}