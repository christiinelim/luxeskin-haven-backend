const tokenDataLayer = require('../dal/token_dal');

const createToken = async (tokenData) => {
    try {
        return await tokenDataLayer.createToken(tokenData);
    } catch (error) {
        throw new Error(error)
    }
}

const getToken = async (tokenData) => {
    try {
        const tokenExists = await tokenDataLayer.getToken(tokenData);
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
    getToken,
    deleteToken 
}