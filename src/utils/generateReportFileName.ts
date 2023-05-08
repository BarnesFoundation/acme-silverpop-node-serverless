import { Config } from "@utils/config";

export function generateReportFileName(reportName: string) {
  const fileName =
    Config.environment === "PRODUCTION"
      ? reportName + ".csv"
      : reportName + "-test.csv";
  return fileName;
}
