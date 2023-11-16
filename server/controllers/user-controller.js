const userService = require('../service/user-service');
const {validationResult} = require('express-validator')
const ApiError = require('../exceptions/apiError')

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) // сохраняем в cookie/ httpOnly: true - чтобы нельзя было прочитать refreshToken с клиента через js
            return res.json(userData);
        } catch (e){
            next(e);  // для того чтобы сработал наш apiError
        }
    }

    async login (req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) // сохраняем в cookie/ httpOnly: true - чтобы нельзя было прочитать refreshToken с клиента через js
            return res.json(userData);
        } catch (e){
            next(e);
        }
    }

    async logout (req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token); // вернет id Token в базе данных
        } catch (e){
            next(e);
        }
    }

    async refresh (req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e){
            next(e);
        }
    }

    async getUsers (req, res, next) {
        try {
            const users = await userService.getAllUsers()
            res.json(users);
        } catch (e){
            next(e);
        }
    }
}

module.exports = new UserController();