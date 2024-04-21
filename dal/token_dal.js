const { Token } = require("../models");

const createToken = async (tokenData) => {
    try {
        const created_at = new Date();
        const expires_at_timestamp = created_at.getTime() + 10 * 60 * 1000;
        const expires_at = new Date(expires_at_timestamp);

        const newToken = new Token ({
            ...tokenData,
            created_at,
            expires_at
        });

        await newToken.save();
        return newToken
    } catch (error) {
        throw new Error(error)
    } 
}

const deleteToken = async (token) => {
    try {
        await token.destroy();
    } catch (error) {
        throw new Error(error)
    } 
}

const getToken = async (tokenData) => {
    try {
        const token = await Token
            .where(tokenData)
            .fetch({ 
                require: false 
            });
        return token
    } catch (error) {
        throw new Error(error)
    } 
}

module.exports = { 
    createToken, 
    getToken, 
    deleteToken 
}