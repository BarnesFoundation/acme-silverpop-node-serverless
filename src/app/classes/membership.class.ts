class Membership {

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

    constructor(MembershipNumber: string, MembershipLevelName: string, MembershipOfferingName: string, MembershipSource: string, MembershipExternalMembershipId: string, MembershipJoinDate: string, MembershipStartDate: string, MembershipExpirationDate: string, MembershipDuration: string, MembershipStanding: string, MembershipIsGifted: string, RE_MembershipProgramName: string, RE_MembershipCategoryName: string, RE_MembershipFund: string, RE_MembershipCampaign: string, RE_MembershipAppeal: string, CardType: string,
        CardName: string, CardStartDate: string, CardExpirationDate: string, CardCustomerPrimaryCity: string, CardCustomerPrimaryState: string, CardCustomerPrimaryZip: string,
        CardCustomerEmail: string, ) {

            this.MembershipNumber = MembershipNumber;
            this.MembershipLevelName = MembershipLevelName;
            this.MembershipOfferingName = MembershipOfferingName;
            this.MembershipSource = MembershipSource;
            this.MembershipExternalMembershipId = MembershipExternalMembershipId;
            this.MembershipJoinDate = MembershipJoinDate;
            this.MembershipStartDate = MembershipStartDate;
            this.MembershipExpirationDate = MembershipExpirationDate;
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
            this.CardStartDate = CardStartDate;
            this.CardExpirationDate = CardExpirationDate;
            this.CardCustomerPrimaryCity = CardCustomerPrimaryCity;
            this.CardCustomerPrimaryState = CardCustomerPrimaryState;
            this.CardCustomerPrimaryZip = CardCustomerPrimaryZip;
            this.CardCustomerEmail = CardCustomerEmail;
    }

}

export { Membership }