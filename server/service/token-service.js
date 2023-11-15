const jwt = require('jsonwebtoken');
const {Token} = require('../models/models')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId})
        if (tokenData) { // перезаписываем токен
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({userId: userId, refreshToken})  // сценарий когда пользователь регистрируется первый раз, создаем модель Token
        return token;
    }
}

module.exports = new TokenService();