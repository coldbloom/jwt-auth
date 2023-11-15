const userService = require('../service/user-service');

class UserController {
    async registration(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.registration(email, password, next);
            //res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}) // сохраняем в cookie/ httpOnly: true - чтобы нельзя было прочитать refreshToken с клиента через js
            //return res.json(userData);
            return res.json(userData);
        } catch (e){
            console.log(e);
        }
    }

    async login (req, res, next) {
        try {

        } catch {

        }
    }

    async logout (req, res, next) {
        try {

        } catch {

        }
    }

    async refresh (req, res, next) {
        try {

        } catch {

        }
    }

    async getUsers (req, res, next) {
        try {
            res.json(['123', '123']);
        } catch {
            res.json('Ошибка запроса users')
        }
    }
}

module.exports = new UserController();