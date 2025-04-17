const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS, 
    },
});

const sendVerificationEmail = async (email, token) => {
    const verificationLink = `http://localhost:3000/userAuth/verify-email?token=${token}`;
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Verify Your Email",
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    });
};

module.exports = { sendVerificationEmail };
