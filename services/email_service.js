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


const verificationToken = Math.floor(Math.random() * 900000) + 100000;

const sendTokenEmail = async (email) => {
    try {
        const mailOptions = {
            from: process.env.TOKEN_EMAIL,
            to: email,
            subject: 'Verification Token',
            text: `Your verification code is: ${verificationToken}`
        };
        transporter.sendMail(mailOptions)
            .then(() => {
                console.log('email sent')
            }).catch(err => {
                console.log(err)
            })

        return true
    } catch (error) {
        console.log('catch');
        console.log(error)
        return false;
    }
    
}

module.exports = { sendTokenEmail }