import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';
import { EMAIL_CONFIG } from '../config/emailConfig';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send email using Nodemailer with Gmail SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    // Get credentials from environment or functions:config
    const config = functions.config().email;
    const emailUser = config?.user || process.env.EMAIL_USER;
    const emailPass = config?.pass || process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      throw new Error('Email credentials not configured. Set either functions:config email.user/pass or EMAIL_USER/PASS environment variables.');
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
      from: `${EMAIL_CONFIG.sender.name} <${EMAIL_CONFIG.sender.email}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || EMAIL_CONFIG.support.email,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    // Don't throw - we don't want email failures to break the payment flow
    // Log the error and continue
  }
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
