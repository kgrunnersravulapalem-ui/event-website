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
exports.contact = void 0;
const functions = __importStar(require("firebase-functions"));
const email_1 = require("./utils/email");
const emailConfig_1 = require("./config/emailConfig");
/**
 * Contact Form Handler
 * Cloud Function endpoint: /contact
 */
exports.contact = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }
    try {
        const { name, email, subject, message } = req.body;
        // Validate required fields
        if (!name || !email || !message) {
            res.status(400).json({
                success: false,
                error: 'Missing required fields: name, email, message',
            });
            return;
        }
        // Validate email format
        if (!(0, email_1.isValidEmail)(email)) {
            res.status(400).json({
                success: false,
                error: 'Invalid email address',
            });
            return;
        }
        // Generate HTML email for contact form
        const htmlContent = generateContactEmail({
            name,
            email,
            subject: subject || 'Contact Form Submission',
            message,
        });
        // Send email to support team
        await (0, email_1.sendEmail)({
            to: emailConfig_1.EMAIL_CONFIG.support.email,
            subject: `Contact Form: ${subject || 'New Message'} - From ${name}`,
            html: htmlContent,
            replyTo: email,
        });
        console.log('Contact form submitted successfully:', {
            name,
            email,
            subject,
        });
        res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully. We will get back to you soon!',
        });
    }
    catch (error) {
        console.error('Contact form error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({
            success: false,
            error: 'Failed to send message. Please try again later.',
            details: errorMessage,
        });
    }
});
/**
 * Generate HTML email template for contact form
 */
function generateContactEmail(data) {
    const { colors, event, footer } = emailConfig_1.EMAIL_CONFIG;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: ${colors.light};">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">
                Contact Form Submission
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 14px; opacity: 0.95;">
                ${event.name}
              </p>
            </td>
          </tr>

          <!-- Contact Details -->
          <tr>
            <td style="padding: 30px;">
              <div style="background-color: ${colors.light}; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px; border-bottom: 2px solid ${colors.primary}; padding-bottom: 10px;">
                  Sender Information
                </h2>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px; width: 100px;">Name:</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; font-weight: bold;">
                      ${data.name}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0; color: ${colors.primary}; font-size: 14px;">
                      <a href="mailto:${data.email}" style="color: ${colors.primary}; text-decoration: none;">
                        ${data.email}
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Subject:</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; font-weight: bold;">
                      ${data.subject}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Received:</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px;">
                      ${new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Message Content -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="border-left: 4px solid ${colors.primary}; background-color: ${colors.light}; padding: 20px; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 16px;">
                  Message:
                </h3>
                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">
${data.message}
                </p>
              </div>
            </td>
          </tr>

          <!-- Reply Button -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" 
                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;">
                Reply to ${data.name}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${colors.dark}; padding: 20px; text-align: center;">
              <p style="margin: 0; color: #6B7280; font-size: 12px;">
                © ${footer.copyrightYear} ${footer.organizationName}. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
//# sourceMappingURL=contact.js.map