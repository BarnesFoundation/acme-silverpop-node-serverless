import { ReportEnums } from '@app/enums/report.enums';

interface AcmeReport {

    type: ReportEnums;
    path: string;
}

const AcmeReportList = {

    salesReport: {   // Sales Report
        type: ReportEnums.SALES_REPORT,
        path: "62b2139975a9d2782146c4d3"// ACME id
    },

    transactionReport: {   // Transaction Report
        type: ReportEnums.TRANSACTION_REPORT,
        path: "62b213ffafd4944b6d414951"// ACME id
    },

    membershipReport: {   // Membership Report
        type: ReportEnums.MEMBERSHIP_REPORT,
        path: "5ecebf01ff7e897d592d4244"// ACME id
    },

    contactReport: {    // Contact Report
        type: ReportEnums.CONTACT_REPORT,
        path: "62b2122cafd4944b6d4147fe"// ACME id
    }
}

export { AcmeReport, AcmeReportList }
