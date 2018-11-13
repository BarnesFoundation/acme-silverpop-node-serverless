import * as parse from 'csv-parse';
import * as stringify from 'csv-stringify';

/** Parses a provided csv string into an array of objects */
export function parser(csv): Promise<any[]> {
    return new Promise((resolve, reject) => {

        // Setup output and the parser
        let output = [];
        let parser = parse({ columns: true });

        // Read in the stream for parsing
        parser.on('readable', () => {
            let record;
            while (record = parser.read()) { output.push(record); }
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

/** Removes guest rows from the provided csv array */
export function removeGuests(csv: any[]) {
    return csv.filter((currentElement, index, array) => {
        return !currentElement.CardName.toLowerCase().includes('Guest of'.toLowerCase()) // Only accept rows where CardName doesn't include 'Guest of'
    });
}

/** Sorts the provided array by the MembershipExpirationDate in descending order */
export function sortByExpirationDate(csv: any[]) {
    return csv.sort((a, b) => {

        // Get the date of each row
        let aDate = new Date(a.MembershipExpirationDate);
        let bDate = new Date(b.MembershipExpirationDate);

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
export function removeDuplicates(records: any[], uniqueKey){
    
    // Array of encountered records and duplicates filtered out
    let encountered = [];
    let filteredSet = [];

    for (let i = 0; i < records.length; i++) {

        let index = records[i][uniqueKey].toLowerCase();

        // If the record doesn't already exist in the encountered array, add it there and the filtered array
        if (typeof encountered[index] === 'undefined') {

            // Add that we've encountered the index and add the data to filtered set
            encountered[index] = records[i];
            filteredSet.push(records[i]);
        }
    }

    // Empty the encountered array
    encountered = [];

    return filteredSet;
}
