class Person {

    Email: string;
    ContactFirstName: string;
    ContactLastName: string;
    ZipCode: string;

    constructor(Email: string, ContactFirstName: string, ContactLastName: string, ZipCode: string) {

        this.Email = Email;
        this.ContactFirstName = ContactFirstName;
        this.ContactLastName = ContactLastName;
        this.ZipCode = ZipCode;
    }

    //These below are commented out in the original sync code
    
    /* MembershipExternalId: string;
    MembershipPrimaryFirstName: string;
    MembershipPrimaryLastName: string;
    MembershipLevelName: string;
    MembershipOfferingName: string; */
}

export { Person };