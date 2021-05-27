# ACME Acoustic Node Serverless

This project is for creating the nightly reports to sync ACME and Acoustic (formerly Silverpop). Currently syncs transactions, memberships, and contacts reports. 

The logic of the lambda function lives within the `src` directory, with the `handler.ts` calling the `main()` function of `app.ts` in order to execute the function.

## ACME Set Up

This generates CSV files based on reports created in ACME. You will need to create reports in Acme for each of the following types: 

- Sales
- Transactions
- Memberships
- Contacts

After the reports have been created, in this repo you will need to do the following: 

1. Rename or copy [acmeReport_Template.interface.ts](src/app/interfaces/acmeReport_Template.interface.ts) to `src/app/interfaces/acmeReport.interface.ts`. 
2. Add the ACME ID for each report into the path key for the corresponding object for each report. Eg: 
```
transactionReport: {
    type: ReportEnums.TRANSACTION_REPORT,
    path: '1234567890qwertyuiop'
}
```

## Installation 

 1. Ensure  `npm` and `serverless cli` are installed on the workstation 
 2. Download and extract the repository into your local development workspace
 3. Ensure that you are using node v13.14.0
 4. Run `npm ci` to install application dependencies (this will install both production and development dependencies)

## Development

You can test the file generation and SFTP upload locally by:

1. Updating the `ENV` environment variable to `TEST`. This will append `-test` to the end of the generated file so that Acoustic will not process it. 
2. Update `event.json` file with the report that you would like to generate. The JSON object should have an [Input type](src/app/interfaces/input.interface.ts) and should have the following key/value pairs:

    - `report`: Name for the final generated report.
    - `reportId`: Report to be executed, this should match one of the [ReportEnums](src/app/enums/report.enums.ts)

Here is an example of an event object set up to generate transaction reports:     
```
    { report: 'Transactions', reportId: 'TransactionsReport' }
```

3. Use the command `serverless invoke local -f index --path event.json` in the to invoke the lambda function locally. 
4. Optional: You can connect to the SFTP host to check the uploaded report, we have been using [WinSCP](https://winscp.net/eng/index.php) to do this.

 
## Deployment

This project is configured for deployment to AWS Lambda. Follow the below steps to configure your Serverless setup for deployment.

 1. Run `serverless config credentials --provider aws --key <SecretAccessKeyId> --secret <SecretAccessKey> --profile serverless-admin` to configure the Serverless Framework for use with your AWS credentials
 2. Create a `serverless.yml` file based on the template file provided. Fill in the name of your Lambda application and the profile chosen above. If you leave the profile commented out, it will fall back to using the default profile 
 3. Run `serverless deploy -v` to deploy the lambda function
