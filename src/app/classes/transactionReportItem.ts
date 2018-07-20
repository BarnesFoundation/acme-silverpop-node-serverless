    export class TransactionReportItem {

    /** Properties */

    private _accountName: string;
    private _accountCategoryName: string;

    private _transactionId: string;
    private _transactionAmount: string;
    private _discountedTransactionAmount: string;
    private _transactionItemId: string;
    private _transactionDate: string;
    private _discountTransactionValue: string;
    private _saleChannel: string;
    private _orderItemType: string;
    private _itemName: string;

    // Some of these spaced out below could perhaps be separated into their own classes - we can refactor later if that's the case

    private _couponCode: string;
    private _couponName: string;

    private _eventName: string;
    private _eventStartTime: string;
    private _eventTemplateCustomField2: string;

    private _ticketType: string;
    private _addOn: string;
    private _quantity: string;
    private _discountedUnitPrice: string;
    private _paymentAmount: string;
    private _email: string;
    private _orderNumber: string;
    private _checkInStatus: string;
    private _conversionStatus: string;


    /** Constructor */

    constructor(accountName: string, accountCategoryName: string, transactionAmount: string, discountedTransactionAmount: string, discountedTransactionValue: string, saleChannel: string, orderItemType: string, itemName: string,
        couponCode: string, couponName: string, eventName: string, eventStartTime: string, ticketType: string, addOn: string, quantity: string, discountedUnitPrice: string, paymentAmount: string, email: string, eventTemplateCustomField2: string,
        transactionId: string, orderNumber: string, checkInStatus: string, conversionStatus: string, transactionItemId: string, transactionDate: string) {

            this._accountName = accountName;
            this._accountCategoryName = accountCategoryName;

            this._transactionId = transactionId;
            this._transactionAmount = transactionAmount;
            this._transactionItemId = transactionItemId;
            this._transactionDate = transactionDate;
            this._discountedTransactionAmount = discountedTransactionAmount;
            this._discountTransactionValue = discountedTransactionValue;
            this._saleChannel = saleChannel;
            this._orderItemType = orderItemType;
            this._itemName = itemName;

            this._couponCode = couponCode;
            this._couponName = couponName;
        
            this._eventName = eventName;
            this._eventStartTime = eventStartTime;
            this._eventTemplateCustomField2 = eventTemplateCustomField2;

            this._ticketType = ticketType;
            this._addOn = addOn;
            this._quantity = quantity;
            this._discountedUnitPrice = discountedUnitPrice;
            this._paymentAmount = paymentAmount;
            this._email = email;
            this._orderNumber = orderNumber;
            this._checkInStatus = checkInStatus;
            this._conversionStatus = conversionStatus;
    }

    /** Accessor methods */

    get accountName(): string { return this._accountName; }
    get accountCategoryName(): string { return this._accountCategoryName; }
    get transactionAmount(): string { return this._transactionAmount; }
    get transactionId(): string { return this._transactionId; }
    get transactionItemId(): string { return this._transactionItemId; }
    get transactionDate(): string { return this._transactionDate; }
    get discountedTransactionAmount(): string { return this._discountedTransactionAmount; }
    get discountTransactionValue(): string { return this._discountTransactionValue; }
    get saleChannel(): string { return this._saleChannel; }
    get orderItemType(): string { return this._orderItemType; }
    get itemName(): string { return this._itemName; }
    get couponCode(): string { return this._couponCode; }
    get couponName(): string { return this._couponName; }
    get eventName(): string { return this._eventName; }
    get eventStartTime(): string { return this._eventStartTime; }
    get eventTemplateCustomField2(): string { return this._eventTemplateCustomField2; }
    get ticketType(): string { return this._ticketType; }
    get addOn(): string { return this._addOn; }
    get quantity(): string { return this._quantity; }
    get discountedUnitPrice(): string { return this._discountedUnitPrice; }
    get paymentAmount(): string { return this._paymentAmount; }
    get email(): string { return this._email; }
    get orderNumber(): string { return this._orderNumber; }
    get checkInStatus(): string { return this._checkInStatus; }
    get conversionStatus(): string { return this._conversionStatus; }
    
}