class ApiError extends Error{
    constructor(status, message, errors) {
        super(message);
        this.status = status
        this.errors = errors
    }

    static badRequest(message, errors = []) {  // плохой запрос
        return new ApiError(400, message, errors);
    }

    static internal(message) {  // внутренний
        return new ApiError(500, message)
    }

    static  forbidden(message) { // запрещенный
        return new ApiError(403, message)
    }

    static unauthorized() {
        return new ApiError(401, 'Пользователь не авторизован!')
    }
}

module.exports = ApiError
