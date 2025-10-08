const ApiResponse = (res, statusCode, message , data) => {
    res.status(statusCode).json({
        success: statusCode < 400,
        message,
        data
    });
};

export default ApiResponse;
