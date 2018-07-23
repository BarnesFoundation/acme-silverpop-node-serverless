enum TransactionReportFieldIndices {

    OrganizationName = 0,
    OrganizationCategoryName = 1,
    TransactionAmount = 2,
    DiscountedTransactionAmount = 3,
    DiscountTransactionValue = 4,
    SaleChannel = 5,
    OrderItemType = 6,
    ItemName = 7,
    CouponCode = 8,
    CouponName = 9,
    EventName = 10,
    EventStartTime = 11,
    TicketType = 12,
    AddOn = 13,
    Quantity = 14,
    DiscountedUnitPrice = 15,
    PaymentAmount = 16,
    Email = 17,
    ContactFirstName = 18,
    ContactLastName = 19,
    ZipCode = 20,
    MembershipExternalId = 21,
    MembershipPrimaryFirstName = 22,
    MembershipPrimaryLastName = 23,
    MembershipLevelName = 24,
    MembershipOfferingName = 25,
    EventTemplateCustomField2 = 26,
    TransactionId = 27,
    OrderNumber = 28,
    TransactionItemId = 29,
    TransactionDate = 30,
}

enum SalesReportFieldIndices {

    CheckInStatus = 0,
    ConversionStatus = 1,
    OrderNumber = 2
}

enum MembershipReportFieldIndices {

    MembershipNumber = 0,
    MembershipLevelName = 1,
    MembershipOfferingName = 2,
    MembershipSource = 3,
    MembershipExternalMembershipId = 4,
    MembershipJoinDate = 5,
    MembershipStartDate = 6,
    MembershipExpirationDate = 7,
    MembershipDuration = 8,
    MembershipStanding = 9,
    MembershipIsGifted = 10,
    RE_MembershipProgramName = 11,
    RE_MembershipCategoryName = 12,
    RE_MembershipFund = 13,
    RE_MembershipCampaign = 14,
    RE_MembershipAppeal = 15,
    CardType = 16,
    CardName = 17,
    CardStartDate = 18,
    CardExpirationDate = 19,
    CardCustomerPrimaryCity = 20,
    CardCustomerPrimaryState = 21,
    CardCustomerPrimaryZip = 22,
    CardCustomerEmail = 23,
    CardCustomerFirstName = 24,
    CardCustomerLastName = 25
}

export { TransactionReportFieldIndices, SalesReportFieldIndices, MembershipReportFieldIndices }