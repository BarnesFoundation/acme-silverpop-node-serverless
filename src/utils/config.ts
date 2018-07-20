import * as dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../../.env'});

const Config = {

    port: process.env.PORT,

    apiRootUrl: process.env.API_ROOT_URL,
    apiKey: process.env.API_KEY,

    memberGuestEventTemplateId: process.env.MEMBER_GUEST_EVENT_TEMPLATE_ID,
    memberGuestTicketTypeId: process.env.MEMBER_GUEST_TICKET_TYPE_ID,
};

export { Config };