import { ReportEnums } from 'app/enums/report.enums';

interface AcmeReport {

    type: ReportEnums;
    path: string;
}

const AcmeReportList = [

    {   // Sales Report
        type: ReportEnums.SALES_REPORT,
        path: 'b2b/analytics/report/execute/58c1a8c368d6093a3866db70'
    },

    {   // Transaction Report
        type: ReportEnums.TRANSACTION_REPORT,
        path: 'b2b/analytics/report/execute/58c1b3ab1f021613ddf20329'
    },

    {   // Membership Report
        type: ReportEnums.MEMBERSHIP_REPORT,
        path: 'b2b/analytics/report/execute/58c1d056c1a3ef4d470db22e'
    }
]

export { AcmeReport, AcmeReportList }
