import { ReportEnums } from '@app/enums/report.enums';

interface AcmeReport {

    type: ReportEnums;
    path: string;
}

const AcmeReportList = {

    salesReport: {   // Sales Report
        type: ReportEnums.SALES_REPORT,
        path: '58c1a8c368d6093a3866db70/zOrdersTest - Source:Sales'
    },

    transactionReport: {   // Transaction Report
        type: ReportEnums.TRANSACTION_REPORT,
        path: '58c1b3ab1f021613ddf20329/zOrdersTest - Source:Transactions'
    },

    membershipReport: {   // Membership Report
        type: ReportEnums.MEMBERSHIP_REPORT,
        path: '58c1d056c1a3ef4d470db22e/zOrders Test - Source Memberships'
    }
}

export { AcmeReport, AcmeReportList }
