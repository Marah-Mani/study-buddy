const nodemailer = require('nodemailer');
const EmailTemplate = require('../models/emailTemplate');
const AdminSetting = require('../models/adminSettings');
const ejs = require('ejs');
const path = require('path');
const logError = require('../../logger');
const { getAdminDataByRole } = require('../common/functions');

const sendEmail = async (user, templateType, extraPlaceholders = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    try {
        const emailTemplate = await EmailTemplate.findOne({ type: templateType });

        if (!emailTemplate) {
            throw new Error('Email template not found');
        }

        const adminId = await getAdminDataByRole('users');
        const adminSetting = await AdminSetting.findOne({ userId: adminId });
        const emailSignature = adminSetting.emailSignature;

        // Replace placeholders in the email template
        let emailContent = emailTemplate.template
            .replace(/\*\|Name\|\*/g, user.name)
            .replace(/\*\|Email\|\*/g, user.email)
            .replace(/\*\|Phone\|\*/g, user.phoneNumber);

        // Replace additional placeholders
        for (const [key, value] of Object.entries(extraPlaceholders)) {
            const placeholder = `\\*\\|${key}\\|\\*`; // Escape asterisks and pipe symbol
            emailContent = emailContent.replace(new RegExp(placeholder, 'g'), value);
        }

        // Render the final HTML content
        const templatePath = path.resolve(__dirname, '../', 'views/emails', 'dynamicTemplate.ejs');
        const title = emailTemplate.subject;
        const htmlContent = await ejs.renderFile(templatePath, { emailContent, emailSignature, title });

        const mailOptions = {
            from: process.env.MAIL_FROM_ADDRESS,
            to: user.email,
            subject: emailTemplate.subject,
            html: htmlContent,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        logError(error);
        console.error('Error sending email:', error);
    }
};

const newAccountEmail = async (user) => {
    await sendEmail(user, 'registration');
};

const resetPasswordEmail = async (user, resetUrl) => {
    await sendEmail(user, 'resetPassword', { ResetLink: resetUrl });
};

const passwordConfirmationEmail = async (user) => {
    await sendEmail(user, 'password-confirmation');
};

module.exports = {
    newAccountEmail,
    resetPasswordEmail,
    passwordConfirmationEmail
};
