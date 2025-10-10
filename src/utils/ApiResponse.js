class ApiResponse {
    constructor(statusCode, message, data) {
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
