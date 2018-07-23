import { CustomerCard } from '@classes/customerCard';

export class MembershipReportItem {

    /** Properties */

    private _membershipNumber: string;
    private _membershipLevelName: string;
    private _membershipOfferingName: string;
    private _membershipSource: string;
    private _membershipExternalMembershipId: string;

    private _membershipJoinDate: string;
    private _membershipStartDate: string;
    private _membershipExpirationDate: string;
    private _membershipDuration: string;

    private _membershipStanding: string;
    private _membershipIsGifted: string;

    // Below properties had RE prepended to them in the original project - couldn't identify any special connotation to them so left them without the RE 

    private _membershipProgramName: string;
    private _membershipCategoryName: string;
    private _membershipFund: string;
    private _membershipCampaign: string;
    private _membershipAppeal: string;

    private _customerCard: CustomerCard;


    /** Constructor */
    
    constructor(membershipNumber: string, membershipLevelName: string, membershipOfferingName: string, membershipSource: string, membershipExternalMembershipId: string,
                membershipJoinDate: string, membershipStartDate: string, membershipExpirationDate: string, membershipDuration: string,
                membershipStanding: string, membershipIsGifted: string, membershipProgramName: string, membershipCategoryName: string, membershipFund: string, membershipCampaign: string, membershipAppeal: string, customerCard: CustomerCard) {

        this._membershipNumber = membershipNumber;
        this._membershipLevelName = membershipLevelName;
        this._membershipOfferingName = membershipOfferingName;
        this._membershipSource = membershipSource;
        this._membershipExternalMembershipId = membershipExternalMembershipId;

        this._membershipJoinDate = membershipJoinDate;
        this._membershipStartDate = membershipStartDate;
        this._membershipExpirationDate = membershipExpirationDate;
        this._membershipDuration = membershipDuration;

        this._membershipStanding = membershipStanding;
        this._membershipIsGifted = membershipIsGifted;

        this._membershipProgramName = membershipProgramName;
        this._membershipCategoryName = membershipCategoryName;
        this._membershipFund = membershipFund;
        this._membershipCampaign = membershipCampaign;
        this._membershipAppeal = membershipAppeal;

        this._customerCard = customerCard;
    }

    /** Accessor methods */

    get membershipNumber(): string { return this._membershipNumber; }
    get membershipLevelName(): string { return this._membershipLevelName; }
    get membershipOfferingName(): string { return this._membershipOfferingName; }
    get membershipSource(): string { return this._membershipSource; }
    get membershipExternalMembershipId(): string { return this._membershipExternalMembershipId; } 

    get membershipJoinDate(): string { return this._membershipJoinDate; }
    get membershipStartDate(): string { return this._membershipStartDate; }
    get membershipExpirationDate(): string { return this._membershipExpirationDate; }
    get membershipDuration(): string { return this._membershipDuration; }

    get membershipStanding(): string { return this._membershipStanding; }
    get membershipIsGifted(): string { return this._membershipIsGifted; }

    get membershipProgramName(): string { return this._membershipProgramName; }
    get membershipCategoryName(): string { return this._membershipCategoryName; }
    get membershipFund(): string { return this._membershipFund; }
    get membershipCampaign(): string { return this._membershipCampaign; }
    get membershipAppeal(): string { return this._membershipAppeal; }

    get customerCard(): CustomerCard { return this._customerCard; }
    
}