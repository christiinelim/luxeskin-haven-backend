const { BlacklistedToken } = require("../models");

const getBlacklistedToken = async (refreshToken) => {
    try {
        const blacklistedToken = await BlacklistedToken.where({
            'token': refreshToken
            }).fetch({
                require: false
            });
        return blacklistedToken
    } catch (error) {
        throw new Error(error)
    } 
}

const createBlacklistedToken = async (refreshToken) => {
    try {
        const newBlacklistedToken = new BlacklistedToken ({
            token: refreshToken,
            created_at: new Date()
        });

        await newBlacklistedToken.save();
    } catch (error) {
        throw new Error(error)
    } 
}

module.exports = {
    getBlacklistedToken,
    createBlacklistedToken
}