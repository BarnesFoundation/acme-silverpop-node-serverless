export class SalesReportItem {
    
    /** Properties */

    private _checkInStatus: string;
    private _conversionStatus: string;
    private _orderNumber: string;

    /** Constructor */
    
    constructor(checkInStatus: string, conversionStatus: string, orderNumber: string) {  
        
        this._checkInStatus = checkInStatus;
        this._conversionStatus = conversionStatus;
        this._orderNumber = orderNumber;
    }

    /** Accessor methods */

    public get checkInStatus(): string {
        return this._checkInStatus;
    }

    public get conversionStatus(): string {
        return this._conversionStatus;
    }

    public get orderNumber(): string {
        return this._orderNumber;
    }


}