const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

const getHashedPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return hashedPassword;
};

const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const passwordMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return passwordMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

const generateAccessToken = (id, email, tokenSecret, expiry) => {
    return jwt.sign({
        'id': id,
        'email': email
    }, tokenSecret, {
        'expiresIn': expiry
    })
};

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

module.exports = {
    getHashedPassword,
    comparePasswords,
    generateAccessToken,
    // cloudinary
}