export class PersonItem {

    /** Properties */

    private _email: string;
    private _contactFirstName: string;
    private _contactLastName: string;
    private _zipCode: string;

    private _membershipExternalId: string;
    private _membershipPrimaryFirstName: string;
    private _membershipPrimaryLastName: string;
    private _membershipLevelName: string;
    private _membershipOfferingName: string;

    /** Constructor */

    constructor(email: string, contactFirstName: string, contactLastName: string, zipCode: string, membershipExternalId: string, 
        membershipPrimaryFirstName: string, membershipPrimaryLastName: string, membershipLevelName: string, membershipOfferingName: string) {

        this._email = email;
        this._contactFirstName = contactFirstName;
        this._contactLastName = contactLastName;
        this._zipCode = zipCode;

        this._membershipExternalId = membershipExternalId;
        this._membershipPrimaryFirstName = membershipPrimaryFirstName;
        this._membershipPrimaryLastName = membershipPrimaryLastName;
        this._membershipLevelName = membershipLevelName;
        this._membershipOfferingName = membershipOfferingName;
    }

    /** Accessor methods */

    get email(): string {
        return this._email;
    }

    get contactFirstName(): string {
        return this._contactFirstName;
    }

    get contactLastName(): string {
        return this._contactLastName;
    }

    get zipCode(): string {
        return this._zipCode;
    }

    get memberShipExternalId(): string {
        return this._membershipExternalId;
    }

    get membershipPrimaryFirstName(): string {
        return this._membershipPrimaryFirstName;
    }

    get membershipPrimaryLastName(): string {
        return this._membershipPrimaryLastName;
    }

    get membershipLevelName(): string {
        return this._membershipLevelName;
    }

    get membershipOfferingName(): string {
        return this._membershipOfferingName;
    }

}