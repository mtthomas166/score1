class AppError{
    constructor(message,statusCode){
        this.statusCode=statusCode;
        this.message=message
        this.status=`${this.statusCode}`.startsWith('4')?'fail':'error'
    }
}
module.exports=AppError;
