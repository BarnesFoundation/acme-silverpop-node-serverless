
## ACME Silverpop Node Serverless
This project is a rewrite of the existing *ACME Silverpop* project from C# into NodeJS, with enforced typings using TypeScript and deployed to AWS Lambda using the Serverless framework.

The logic of the lambda function lives within the `src` directory, with the `handler.ts` calling the `main()` function of `app.ts` in order to execute the function.

## Installation 

 1. Ensure  `npm` and `serverless cli` are installed on the workstation 
 2. Download and extract the repository into your local development workspace
 3. Run `npm install` to install application dependencies (this will install both production and development dependencies)


## Development
While developing, do the following
 - Use the command `serverless invoke local -f index --path event.json` in the to invoke the lambda function locally. Note: You'll need to provide an event with an object of the following format
    ```
    { report: 'Transactions', reportId: 'TransactionsReport' }
    ```
    You can do this by modifying the `event.json` file directly to provide the above input. The `report` field determines the name of the file. It should be be the same as the report id but without the appended 'report' keyword.

 
## Deployment
This project is configured for deployment to AWS Lambda. Follow the below steps to configure your Serverless setup for deployment.

 1. Run `serverless config credentials --provider aws --key <SecretAccessKeyId> --secret <SecretAccessKey> --profile serverless-admin` to configure the Serverless Framework for use with your AWS credentials
 2. Update `provider.profile` in `serverless.yml` with the name of the profile you chose above
 3. Run `serverless deploy -v` to deploy the lambda function
 
The deployed lambda function can be found here [AcmeNightlySync](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/AcmeNightlySync-dev-index)