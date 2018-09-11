import * as request from 'request-promise-native';
import ssh2SFTPClient = require('ssh2-sftp-client');
import * as fs from 'fs';

import { Config } from '@utils/config';
import { ReportEnums } from '@enums/report.enums';
import { AcmeReportList } from '@interfaces/acmeReport.interface'


export function main() {

    iterateReports();
    // connectSFTP();
}

/** Iterates fetching through the list of available report types */
function iterateReports() {

    // For each type of report
    for (let i = 0; i < AcmeReportList.length; i++) {

        const url = Config.apiRootUrl + Config.apiReportEndpoint + AcmeReportList[i].path;

        // Connect to the endpoint 
        getReportFromEndpoint(AcmeReportList[i].type, url);
    }
}

/** Fetches report from the specified endpoint */
async function getReportFromEndpoint(reportType: ReportEnums, requestUrl: string) {

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
        writeCSVToFile(await request.get(options), reportType);
    }
    catch (error) {
        console.log('An error occurred: ', error);
    }
}

/** Writes CSV to file */
function writeCSVToFile(csv, reportType: ReportEnums) {

    let fileName = reportType;

    fs.writeFile(fileName + '.csv', csv, (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('File created: ' + fileName);
        }
    });
}

/** Connects to the Watson Campaign Automation SFTP site */
function uploadFileToSFTP() {

    let sftp = new ssh2SFTPClient();
    let credentials = {
        host: Config.sftpHost,
        port: 22,
        username: Config.sftpUsername,
        password: Config.sftpPassword
    };

    sftp.connect(credentials)
        .then(() => {
            // Upload the file
            // return sftp.put('./nodemon.json', '/upload/nodemon.json')
        })
        .then((response) => {
            console.log('Success');
        })
        .catch((error) => {
            console.log('An error occurred authenticating with SFTP', error);
        });
}

main(); 