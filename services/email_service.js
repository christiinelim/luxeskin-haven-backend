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

const sendEmail = async (data) => {
    try {
        const mailOptions = {
            from: process.env.TOKEN_EMAIL,
            to: 'bizordertest@gmail.com',
            subject: data.subject,
            html: `<p>Name: ${data.name}</p>
                    <p>Contact: ${data.contact}</p>
                    <p>Message: ${data.message}</p>`
        };
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error(error)
    } 
}

module.exports = { sendTokenEmail, sendEmail }