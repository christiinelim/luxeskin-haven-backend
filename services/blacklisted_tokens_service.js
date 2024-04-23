const BlacklistedTokenDataLayer = require('../dal/blacklisted_tokens_dal');

const getBlacklistedToken = async (refreshToken) => {
    try {
        const tokenExists = await BlacklistedTokenDataLayer.getBlacklistedToken(refreshToken);
        if (tokenExists) {
            return true
        }
        return false
    } catch (error) {
        throw new Error(error)
    }
}

const createBlacklistedToken = async (refreshToken) => {
    try {
        await BlacklistedTokenDataLayer.createBlacklistedToken(refreshToken);
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = { 
    getBlacklistedToken,
    createBlacklistedToken
}