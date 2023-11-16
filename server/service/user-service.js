const {User} = require('../models/models')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

const ApiError = require('../exceptions/apiError')

class UserService {
    async registration(email, password){
        if (!email || !password) {
            throw ApiError.badRequest('Некорректный email или пароль');
            //return ('Некорректный email или пароль');
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`);
            //return next(ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`));
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({email, password: hashPassword});

        const userPublicInfo = new UserDto(user);
        const tokens = tokenService.generateTokens({...userPublicInfo});
        await tokenService.saveToken(userPublicInfo.id, tokens.refreshToken);

        return {...tokens, user: userPublicInfo} // возвращаем
    }

    async login(email, password) {
        if (!email || !password) {
            throw ApiError.badRequest('Некорректный email или пароль');
        }
        const candidate = await User.findOne({where: {email: email}});
        if (!candidate) {
            throw ApiError.badRequest(`Пользователь с почтовым адресом ${email} не найден`);
        }
        const isPassEqual = await bcrypt.compare(password, candidate.password);
        if (!isPassEqual) {
            throw ApiError.badRequest('Неверный пароль');
        }

        const userPublicInfo = new UserDto(candidate);
        const tokens = tokenService.generateTokens({...userPublicInfo});
        await tokenService.saveToken(userPublicInfo.id, tokens.refreshToken);

        return {...tokens, user: userPublicInfo}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorized();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {  /// проверка если токен валидный и есть в базе данных
            throw ApiError.unauthorized();
        }

        const user = User.findOne({where: {id: userData.id}})
        const userPublicInfo = new UserDto(user);
        const tokens = tokenService.generateTokens({...userPublicInfo});
        await tokenService.saveToken(userPublicInfo.id, tokens.refreshToken);

        return {...tokens, user: userPublicInfo}
    }


    async getAllUsers() {
        const users = User.findAll();
        return users;
    }
}

module.exports = new UserService();