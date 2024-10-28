"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const nodemailer = require('nodemailer');
class Mailer {
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
    sendMail(to, subject, htmlContent) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL,
                to: to,
                subject: subject,
                html: htmlContent,
            };
            try {
                yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error("Error sending email", error);
                throw error;
            }
        });
    }
    sendOtpMail(to, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(otp, "this is the otp");
            const subject = "OTP MESSAGE";
            const htmlContent = `<p>Hi,</p>
                             <p>Your OTP code is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`;
            yield this.sendMail(to, subject, htmlContent);
        });
    }
    sendVerificationMail(to, token) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("hi");
            const subject = "Email Verification";
            const htmlContent = `<p>Hi,</p>
                             <p>Please click <a href="https://gingerfrontend.vercel.app/verify?token=${token}">here</a> to verify your email.</p>`;
            yield this.sendMail(to, subject, htmlContent);
        });
    }
}
exports.default = Mailer;
