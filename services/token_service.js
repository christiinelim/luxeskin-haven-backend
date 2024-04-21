const tokenDataLayer = require('../dal/token_dal');

const createToken = async (tokenData) => {
    try {
        return await tokenDataLayer.createToken(tokenData);
    } catch (error) {
        throw new Error(error)
    }
}

const getTokenBySellerAndToken = async (tokenData) => {
    try {
        const tokenExists = await tokenDataLayer.getTokenBySellerAndToken(tokenData);
        if (tokenExists) {
            return tokenExists
        }
        return false
    } catch (error) {
        throw new Error(error)
    }
}

const deleteToken = async (token) => {
    try {
        await tokenDataLayer.deleteToken(token);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { 
    createToken, 
    getTokenBySellerAndToken,
    deleteToken 
}