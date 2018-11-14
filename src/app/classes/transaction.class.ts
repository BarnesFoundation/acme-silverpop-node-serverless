class Transaction {

    AccountName: string;
    AccountCategoryName: string;
    TransactionAmount: string;
    DiscountedTransactionAmount: string;
    DiscountTransactionValue: string;
    SaleChannel: string;
    OrderItemType: string;
    ItemName: string;
    CouponCode: string;
    CouponName: string;
    EventName: string;
    EventStartTime: string;
    TicketType: string;
    AddOn: string;
    Quantity: string;
    DiscountedUnitPrice: string;
    PaymentAmount: string;
    Email: string;
    EventTemplateCustomField2: string;
    TransactionId: string;
    OrderNumber: string;
    CheckInStatus: string;
    ConversionStatus: string;
    TransactionItemId: string;
    TransactionDate: string;

    constructor(AccountName: string, AccountCategoryName: string, TransactionAmount: string, DiscountedTransactionAmount: string, DiscountTransactionValue: string, SaleChannel: string,
        OrderItemType: string, ItemName: string, CouponCode: string, CouponName: string, EventName: string, EventStartTime: string, TicketType: string, AddOn: string,  
        DiscountedUnitPrice: string, PaymentAmount: string, Email: string, EventTemplateCustomField2: string, TransactionId: string, OrderNumber: string, CheckInStatus: string, 
        ConversionStatus: string, TransactionItemId: string, TransactionDate: string) {

            this.AccountName = AccountName;
            this.AccountCategoryName = AccountCategoryName;
            this.TransactionAmount = TransactionAmount;
            this.DiscountedTransactionAmount = DiscountedTransactionAmount;
            this.DiscountTransactionValue = DiscountTransactionValue;
            this.SaleChannel = SaleChannel;
            this.OrderItemType = OrderItemType;
            this.ItemName = ItemName;
            this.CouponCode = CouponCode;
            this.CouponName = CouponName;
            this.EventName = EventName;
            this.EventStartTime = EventStartTime;
            this.TicketType = TicketType;
            this.AddOn = AddOn;
            this.DiscountedUnitPrice = DiscountedUnitPrice;
            this.PaymentAmount = PaymentAmount;
            this.Email = Email;
            this.EventTemplateCustomField2 = EventTemplateCustomField2; 
            this.TransactionId = TransactionId;
            this.OrderNumber = OrderNumber;
            this.CheckInStatus = CheckInStatus;
            this.ConversionStatus = ConversionStatus;
            this.TransactionItemId = TransactionItemId;
            this.TransactionDate = TransactionDate;
        }
}

export { Transaction };