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
    LogInLinkExp?: string;

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
        this.LogInLink = MembershipStanding === "Active" ? Membership.formatLoginLink(MembershipExternalMembershipId, Membership.expiry) : "";
        this.LogInLinkExp = this.formatDate(Membership.expiry);
    }

    static expiry = Membership.getExpirationTime(new Date());

    static formatLoginLink(id: string, isoDate: string): string {
        try {
            const u = encrypt(id);
            const x = encrypt(isoDate);
            return `https://members.barnesfoundation.org/ml?u=${u}&x=${x}`

        } catch (e) {
            return ""
        }
    }

    static getExpirationTime(expiry: Date): string {
        // Set expiry time to 11:59:59pm
        expiry.setHours(23)
        expiry.setMinutes(59)
        expiry.setSeconds(59)
        // Set expiry date to 3 days from now
        expiry.setDate(expiry.getDate() + 3)

        return expiry.toISOString();
    }

}

export { Membership }