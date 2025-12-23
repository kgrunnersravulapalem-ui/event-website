"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.isValidEmail = isValidEmail;
const nodemailer = __importStar(require("nodemailer"));
const emailConfig_1 = require("../config/emailConfig");
/**
 * Send email using Nodemailer with Gmail SMTP
 */
async function sendEmail(options) {
    try {
        // Get credentials from environment variables
        const emailUser = process.env.EMAIL_USER;
        const emailPass = process.env.EMAIL_PASS;
        if (!emailUser || !emailPass) {
            throw new Error('Email credentials not configured. Set EMAIL_USER and EMAIL_PASS environment variables.');
        }
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
        // Email options
        const mailOptions = {
            from: `${emailConfig_1.EMAIL_CONFIG.sender.name} <${emailConfig_1.EMAIL_CONFIG.sender.email}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
            replyTo: options.replyTo || emailConfig_1.EMAIL_CONFIG.support.email,
        };
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', {
            messageId: info.messageId,
            to: options.to,
            subject: options.subject,
        });
    }
    catch (error) {
        console.error('Failed to send email:', error);
        // Don't throw - we don't want email failures to break the payment flow
        // Log the error and continue
    }
}
/**
 * Validate email address format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
//# sourceMappingURL=email.js.map