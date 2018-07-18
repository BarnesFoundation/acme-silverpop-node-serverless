export class CustomerCard {

    /** Properties  */

    private _cardType: string;
    private _cardName: string;
    private _cardStartDate: string;
    private _cardExpirationDate: string;
    private _cardCustomerPrimaryCity: string;
    private _cardCustomerPrimaryState: string;
    private _cardCustomerPrimaryZip: string;
    private _cardCustomerEmail: string;

    
    /** Constructor */
    constructor(cardType: string, cardName: string, cardStartDate: string, cardExpirationDate: string, cardCustomerPrimaryCity: string, cardCustomerPrimaryState: string, cardCustomerPrimaryZip: string, cardCustomerEmail: string) {

        this._cardType = cardType;
        this._cardName = cardName;
        this._cardStartDate = cardStartDate;
        this._cardExpirationDate = cardExpirationDate;
        this._cardCustomerPrimaryCity = cardCustomerPrimaryCity;
        this._cardCustomerPrimaryState = cardCustomerPrimaryState;
        this._cardCustomerPrimaryZip = cardCustomerPrimaryZip;
        this._cardCustomerEmail = cardCustomerEmail;
    }


    /** Accessor methods */

    get cardType(): string { return this._cardType; }
    get cardName(): string { return this._cardName; }
    get cardStartDate(): string { return this._cardStartDate; }
    get cardExpirationDate(): string { return this._cardExpirationDate; }
    get cardCustomerPrimaryCity(): string { return this._cardCustomerPrimaryCity; }
    get cardCustomerPrimaryState(): string { return this._cardCustomerPrimaryState; }
    get cardCustomerPrimaryZip(): string { return this._cardCustomerPrimaryZip; }
    get cardCustomerEmail(): string { return this._cardCustomerEmail; }
}