const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    pool: true,
    auth: {
        user: process.env.TOKEN_EMAIL,
        pass: process.env.TOKEN_PASSWORD
    }
});

const sendTokenEmail = async (email) => {
    try {
        const verificationToken = Math.floor(Math.random() * 900000) + 100000;
        const mailOptions = {
            from: process.env.TOKEN_EMAIL,
            to: email,
            subject: 'Verification Token',
            text: `Your verification code is: ${verificationToken}`
        };
        await transporter.sendMail(mailOptions);
        return verificationToken;
    } catch (error) {
        throw new Error(error)
    }
    
}

module.exports = { sendTokenEmail }