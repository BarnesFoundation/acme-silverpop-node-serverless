import { ReportEnums } from '@app/enums/report.enums';

interface AcmeReport {

    type: ReportEnums;
    path: string;
}

const AcmeReportList = {

    salesReport: {   // Sales Report
        type: ReportEnums.SALES_REPORT,
        path: ""// ACME id
    },

    transactionReport: {   // Transaction Report
        type: ReportEnums.TRANSACTION_REPORT,
        path: ""// ACME id
    },

    membershipReport: {   // Membership Report
        type: ReportEnums.MEMBERSHIP_REPORT,
        path: ""// ACME id
    },

    contactReport: {    // Contact Report
        type: ReportEnums.CONTACT_REPORT,
        path: ""// ACME id
    }
}

export { AcmeReport, AcmeReportList }
