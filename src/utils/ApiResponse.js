class ApiResponse {
    constructor(res, statusCode, message, data) {
        this.res = res;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }

    send() {
        this.res.status(this.statusCode).json({
            success: this.statusCode < 400,
            message: this.message,
            data: this.data
        });
    }
}

export default ApiResponse;
