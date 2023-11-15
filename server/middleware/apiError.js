class ApiError extends Error{
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static badRequest(message) {  // плохой запрос
        return new ApiError(400, message);
    }

    static internal(message) {  // внутренний
        return new ApiError(500, message)
    }

    static  forbidden(message) { // запрещенный
        return new ApiError(403, message)
    }
}

module.exports = ApiError
