const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const getHashedPassword = (plainPassword) => {
    const sha256 = crypto.createHash('sha256');
    const hashedPassword = sha256.update(plainPassword).digest('base64');
    return hashedPassword;
};

const generateAccessToken = (id, email, tokenSecret, expiry) => {
    return jwt.sign({
        'id': id,
        'email': email
    }, tokenSecret, {
        'expiresIn': expiry
    })
}

module.exports = {
    getHashedPassword,
    generateAccessToken
}