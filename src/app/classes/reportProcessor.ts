import * as stringify from "csv-stringify";

import { Person } from "@classes/person.class";
import { Membership } from "@classes/membership.class";

/** Removes guest rows from the provided csv array */
export function removeGuests(memberships: Membership[]) {
  return memberships.filter((currentElement) => {
    return !currentElement.CardName.toLowerCase().includes(
      "Guest of".toLowerCase()
    ); // Only accept rows where CardName doesn't include 'Guest of'
  });
}

/** Sorts the provided array by the provided date-type field, in descending order */
export function sortByDateField(list: any[], dateField: string) {
  return list.sort((a, b) => {
    // Get the date of each row
    let aDate = new Date(a[dateField]);
    let bDate = new Date(b[dateField]);

    // -1 so that it is in descending order
    if (aDate > bDate) {
      return -1;
    }

    if (bDate > aDate) {
      return 1;
    }

    if (aDate.getTime() === bDate.getTime()) {
      return 0;
    }
  });
}

/** Transform a csv-like array and returns a csv formatted string */
export function createCSV(records: any[], headers?: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    // Generate the column headers for the csv if they weren't provided
    const columns = headers ? headers : generateHeaders(records[0]);

    // Create output and stringifier
    const csvString = [];
    const stringifier = stringify({ columns: columns, header: true });

    // Read each row into the output
    stringifier.on("readable", () => {
      let row;
      while ((row = stringifier.read())) {
        csvString.push(row);
      }
    });

    // Write each record to be stringifier
    for (let i = 0; i < records.length; i++) {
      let row = [];

      // Build the row by iterating the object properties and adding them
      for (let j = 0; j < columns.length; j++) {
        row.push(records[i][columns[j]]);
      }

      stringifier.write(row);
    }

    stringifier.end();

    // Catch any errors that occur in reading the input
    stringifier.on("error", (error) => {
      reject(error);
    });

    // Resolve the promise once the stringifier is done
    stringifier.on("finish", () => {
      resolve(csvString.join(""));
    });
  });
}

/** Generates a key-value array containing the properties of an object */
export function generateHeaders(record: {}): string[] {
  const headers = [];
  const properties = Object.getOwnPropertyNames(record);

  for (let i = 0; i < properties.length; i++) {
    headers.push(properties[i]);
  }
  return headers;
}

/** Removes duplicate rows based on the provided unique key */
export function removeDuplicates(
  records: Person[] | Membership[],
  uniqueField: string
): any[] {
  // Array of encountered records and duplicates filtered out
  let encountered = [];
  let filteredSet = [];

  for (let i = 0; i < records.length; i++) {
    let uniqueIndex: string = records[i][uniqueField].toLowerCase();

    // Continue if the identfier field is blank space
    if (uniqueIndex.trim().length == 0) {
      continue;
    }

    // Othertise, process as expected
    else {
      // If the record doesn't already exist in the encountered array, add it there and the filtered array
      if (typeof encountered[uniqueIndex] === "undefined") {
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
