import { BaseReport } from '@classes/baseReport.class'
import { encrypt } from "@utils/crypto";

class Membership extends BaseReport {
    MembershipNumber: string;
    MembershipLevelName: string;
    MembershipOfferingName: string;
    MembershipSource: string;
    MembershipExternalMembershipId: string;
    MembershipJoinDate: string;
    MembershipStartDate: string;
    MembershipExpirationDate: string;
    MembershipDuration: string;
    MembershipStanding: string;
    MembershipIsGifted: string;
    RE_MembershipProgramName: string;
    RE_MembershipCategoryName: string;
    RE_MembershipFund: string;
    RE_MembershipCampaign: string;
    RE_MembershipAppeal: string;
    CardType: string;
    CardName: string;
    CardStartDate: string;
    CardExpirationDate: string;
    CardCustomerPrimaryCity: string;
    CardCustomerPrimaryState: string;
    CardCustomerPrimaryZip: string;
    CardCustomerEmail: string;
    CardCustomerFirstName?: string;
    CardCustomerLastName?: string;
    LogInLink?: string;
    RenewLink?: string;
    LinkExp?: string;

    constructor(
        MembershipNumber: string, MembershipLevelName: string, MembershipOfferingName: string,
        MembershipSource: string, MembershipExternalMembershipId: string, MembershipJoinDate: string,
        MembershipStartDate: string, MembershipExpirationDate: string, MembershipDuration: string,
        MembershipStanding: string, MembershipIsGifted: string, RE_MembershipProgramName: string,
        RE_MembershipCategoryName: string, RE_MembershipFund: string, RE_MembershipCampaign: string,
        RE_MembershipAppeal: string, CardType: string, CardName: string, CardStartDate: string,
        CardExpirationDate: string, CardCustomerPrimaryCity: string, CardCustomerPrimaryState: string,
        CardCustomerPrimaryZip: string, CardCustomerEmail: string, CardCustomerFirstName?: string,
        CardCustomerLastName?: string
    ) {

        super();

        this.MembershipNumber = MembershipNumber;
        this.MembershipLevelName = MembershipLevelName;
        this.MembershipOfferingName = MembershipOfferingName;
        this.MembershipSource = MembershipSource;
        this.MembershipExternalMembershipId = MembershipExternalMembershipId;
        this.MembershipJoinDate = this.formatDate(MembershipJoinDate);
        this.MembershipStartDate = this.formatDate(MembershipStartDate);
        this.MembershipExpirationDate = this.formatDate(MembershipExpirationDate);
        this.MembershipDuration = MembershipDuration;
        this.MembershipStanding = MembershipStanding;
        this.MembershipIsGifted = MembershipIsGifted;
        this.RE_MembershipProgramName = RE_MembershipProgramName;
        this.RE_MembershipCategoryName = RE_MembershipCategoryName;
        this.RE_MembershipFund = RE_MembershipFund;
        this.RE_MembershipCampaign = RE_MembershipCampaign;
        this.RE_MembershipAppeal = RE_MembershipAppeal;
        this.CardType = CardType;
        this.CardName = CardName;
        this.CardStartDate = this.formatDate(CardStartDate);
        this.CardExpirationDate = this.formatDate(CardExpirationDate);
        this.CardCustomerPrimaryCity = CardCustomerPrimaryCity;
        this.CardCustomerPrimaryState = CardCustomerPrimaryState;
        this.CardCustomerPrimaryZip = CardCustomerPrimaryZip;
        this.CardCustomerEmail = CardCustomerEmail;
        this.CardCustomerFirstName = CardCustomerFirstName;
        this.CardCustomerLastName = CardCustomerLastName;
        this.LogInLink = Membership.formatLoginLink(MembershipExternalMembershipId, Membership.unixExpiry);
        this.RenewLink = Membership.formatLoginLink(MembershipExternalMembershipId, Membership.unixExpiry, "/renew");
        this.LinkExp = this.formatDate(Membership.expiry);
    }

    // Class attributes for dates since the logic will be same for every member
    static today: Date = Membership.getToday(new Date())
    static expiry: string = Membership.getExpirationTime(new Date());
    static unixExpiry: string = (new Date(Membership.expiry).getTime() / 1000).toFixed(0);

    static formatLoginLink(id: string, unixDate: string, redirect?: string): string {
        try {
            const params = [id, unixDate]

            if (redirect) {
                params[2] = redirect;
            }

            const e = encrypt(params.join(","))
            return `ml?e=${e}`

        } catch (e) {
            return ""
        }
    }

    /**
     * @param {Date} date - Current date
     * @returns {Date} - Current date with time set to 11:59:59 pm Eastern time.
     */
    static getToday(date: Date): Date {
        // Set time to 11:59:59pm
        date.setHours(23)
        date.setMinutes(59)
        date.setSeconds(59)

        return date;
    }

    /**
     * @param {Date} date - Current date
     * @returns {string} - ISO string for date 3 days in future.
     */
    static getExpirationTime(date: Date): string {
        const expiry = Membership.getToday(date)
        // Set expiry date to 3 days from now
        expiry.setDate(expiry.getDate() + 3)

        return expiry.toISOString();
    }

    /**
     * @param {string} MembershipExpirationDate - ISO string of membership expiration date
     * @returns {boolean} - Whether or not the membership is within the renewal period. 
     */
    static canRenew(MembershipExpirationDate: string): boolean {
        // Max date for renewal is one month after expiration
        const maxDate = new Date(MembershipExpirationDate);
        maxDate.setMonth(maxDate.getMonth() + 1);

        // Min date for renewal is three months before expiration
        const minDate = new Date(MembershipExpirationDate);
        minDate.setMonth(minDate.getMonth() - 3);

        return minDate <= Membership.today && Membership.today <= maxDate;
    }

}

export { Membership }