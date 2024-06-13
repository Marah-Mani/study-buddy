const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const logError = require('../../logger');

const sendVerificationOtp = async (otp, email, name) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    try {
        const templatePath = path.join(__dirname, '..', 'views', 'emails', 'email_verification_mail.ejs');
        const htmlContent = await ejs.renderFile(templatePath, { name, email, otp });

        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: email,
            subject: `Email Verification OTP: ${otp}`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        logError(error);
    }
};

module.exports = {
    sendVerificationOtp,
};
