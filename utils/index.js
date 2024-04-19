const crypto = require('crypto');

const getHashedPassword = (plainPassword) => {
    const sha256 = crypto.createHash('sha256');
    const hashedPassword = sha256.update(plainPassword).digest('base64');
    return hashedPassword;
};

// const generateAccessToken = (id, email) => {
//     return jwt.sign({
//         'id': id,
//         'email': email
//     }, process.env.TOKEN_SECRET, {
//         'expiresIn': '3h'
//     })
// }

module.exports = {
    getHashedPassword
}