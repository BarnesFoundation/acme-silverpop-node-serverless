import { ReportFunctions, ReportExecution } from "acme-ticketing-client";

// Poll until report status is complete
export const pollUntilComplete = async (reportExecution: ReportExecution) => {
  let status = reportExecution.status;
  const id = reportExecution.id;
  await new Promise((resolve) => {
    const interval = setInterval(async () => {
      console.log(`Status for report ID ${reportExecution.id}`);
      [({ status } = await ReportFunctions.pollForReportStatus(id))];

      if (status === "Completed") {
        console.log(
          `Report status for report ID ${id} is ${status}. Ending polling`
        );
        clearInterval(interval);

        resolve("");
      }
    }, 1000);
  });
};
