const {User} = require('../models/models')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')

const ApiError = require('../middleware/apiError')

class UserService {
    async registration(email, password, next){
        if (!email || !password) {
            //next(ApiError.badRequest('Некорректный email или пароль'));
            return ('Некорректный email или пароль');
        }
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            //return next(ApiError.badRequest(`Пользователь с почтовым адресом ${email} уже существует`));
            return (`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const user = await User.create({email, password: hashPassword});

        const userPublicInfo = new UserDto(user)
        const tokens = tokenService.generateTokens({...userPublicInfo});
        await tokenService.saveToken(UserDto.id, tokens.refreshToken);

        return {...tokens, user: userPublicInfo} // возвращаем
    }
}

module.exports = new UserService();