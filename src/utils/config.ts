import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env'});

const Config = {

    port: process.env.PORT,

    apiRootUrl: process.env.API_ROOT_URL,
    apiToken: process.env.API_TOKEN,

    memberGuestEventTemplateId: process.env.MEMBER_GUEST_EVENT_TEMPLATE_ID,
    memberGuestTicketTypeId: process.env.MEMBER_GUEST_TICKET_TYPE_ID,
};

export { Config };