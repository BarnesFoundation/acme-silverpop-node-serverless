import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env'});

const Config = {

    port: process.env.PORT,

    apiRootUrl: process.env.API_ROOT_URL,
    apiReportEndpoint: process.env.API_REPORT_ENDPOINT,
    apiKey: process.env.API_KEY,
    apiTenantId: process.env.API_TENANT_ID,

    sftpHost: process.env.SFTP_HOST,
    sftpUsername: process.env.STFP_USERNAME,
    sftpPassword: process.env.SFTP_PASSWORD,
    
    memberGuestEventTemplateId: process.env.MEMBER_GUEST_EVENT_TEMPLATE_ID,
    memberGuestTicketTypeId: process.env.MEMBER_GUEST_TICKET_TYPE_ID,

    environment: process.env.ENV,
};

export { Config };