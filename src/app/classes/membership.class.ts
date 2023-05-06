import { BaseReport } from "@classes/baseReport.class";

type ConstructorData = {
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
  LinkExp?: number;
};

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

  constructor(data: ConstructorData) {
    super();

    this.MembershipNumber = data.MembershipNumber;
    this.MembershipLevelName = data.MembershipLevelName;
    this.MembershipOfferingName = data.MembershipOfferingName;
    this.MembershipSource = data.MembershipSource;
    this.MembershipExternalMembershipId = data.MembershipExternalMembershipId;
    this.MembershipJoinDate = this.formatDate(data.MembershipJoinDate);
    this.MembershipStartDate = this.formatDate(data.MembershipStartDate);
    this.MembershipExpirationDate = this.formatDate(
      data.MembershipExpirationDate
    );
    this.MembershipDuration = data.MembershipDuration;
    this.MembershipStanding = data.MembershipStanding;
    this.MembershipIsGifted = data.MembershipIsGifted;
    this.RE_MembershipProgramName = data.RE_MembershipProgramName;
    this.RE_MembershipCategoryName = data.RE_MembershipCategoryName;
    this.RE_MembershipFund = data.RE_MembershipFund;
    this.RE_MembershipCampaign = data.RE_MembershipCampaign;
    this.RE_MembershipAppeal = data.RE_MembershipAppeal;
    this.CardType = data.CardType;
    this.CardName = data.CardName;
    this.CardStartDate = this.formatDate(data.CardStartDate);
    this.CardExpirationDate = this.formatDate(data.CardExpirationDate);
    this.CardCustomerPrimaryCity = data.CardCustomerPrimaryCity;
    this.CardCustomerPrimaryState = data.CardCustomerPrimaryState;
    this.CardCustomerPrimaryZip = data.CardCustomerPrimaryZip;
    this.CardCustomerEmail = data.CardCustomerEmail;
    this.CardCustomerFirstName = data.CardCustomerFirstName;
    this.CardCustomerLastName = data.CardCustomerLastName;
    this.LogInLink = this.formatLoginLink(data.LogInLink);
    this.RenewLink = this.formatLoginLink(data.RenewLink);

    data.LinkExp &&
      (this.LinkExp = this.formatDate(
        new Date(data.LinkExp * 1000).toISOString()
      ));
  }

  formatLoginLink(e): string {
    return e ? `ml?e=${e}` : e;
  }
}

export { Membership };
