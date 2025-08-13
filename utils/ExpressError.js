/*
    To send the custom error, for different error that gets generated.
    Better to send specified error than to send the general.
    Helps client understand what mistake they have made (if they have made any) - more user friendly.
*/

class ExpressError extends Error{
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;