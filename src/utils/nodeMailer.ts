require('dotenv').config();

const nodemailer = require('nodemailer');

class Mailer {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.G_PASSWORD,
            },
        });
    }

    async sendMail(to: string, subject: string, htmlContent: string) {
        const mailOptions = {
            from: process.env.GMAIL,
            to: to,
            subject: subject,
            html: htmlContent,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error("Error sending email", error);
            throw error;
        }
    }

    async sendOtpMail(to: string, otp: string) {
        console.log(otp, "this is the otp");

        const subject = "OTP MESSAGE";
        const htmlContent = `<p>Hi,</p>
                             <p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;
        await this.sendMail(to, subject, htmlContent);
    }

    async sendVerificationMail(to: string, token: string) {
        console.log("hi");

        const subject = "Password Reset";
        const htmlContent = `<p>Hi,</p>
                             <p>Please click <a href="http://localhost:3000/verify?token=${token}">here</a> to reset your password.</p>`;
        await this.sendMail(to, subject, htmlContent);
    }
}

export default Mailer;
