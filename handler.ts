import { Callback, Context, Handler } from "aws-lambda";
import { Main } from "./src/app/app";

/** This file is the entry point for the AWS Lambda function. When the lambda is executed, the acmeNightlySync function of this file is called.
 *  The index function calls the Main() function of the actual program. This begins the process of retrieving the CSV reports and placing them in the Watson Campaign Automation SFTP site.
 *  Repository: https://github.com/BarnesFoundation/acme-silverpop-node-serverless
 */

export const index: Handler = (event, context: Context, cb: Callback) => {
  let input = {
    report: event.report,
    reportId: event.reportId,
  };

  Main(input, cb);
};
