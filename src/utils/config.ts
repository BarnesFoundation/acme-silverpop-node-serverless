import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env'});

const Config = {

    apiRootUrl: process.env.API_ROOT_URL,
    apiReportEndpoint: process.env.API_REPORT_ENDPOINT,
    apiKey: process.env.API_KEY,
    apiTenantId: process.env.API_TENANT_ID,

    sftpHost: process.env.SFTP_HOST,
    sftpUsername: process.env.STFP_USERNAME,
    sftpPassword: process.env.SFTP_PASSWORD,

    environment: process.env.ENV,

    encryptionSecretKey: process.env.ENCRYPTION_SECRET_KEY,
};

export { Config };