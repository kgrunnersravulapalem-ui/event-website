"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentFailedEmail = generatePaymentFailedEmail;
const emailConfig_1 = require("../config/emailConfig");
function generatePaymentFailedEmail(data) {
    const { event, colors, social, support, footer } = emailConfig_1.EMAIL_CONFIG;
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Failed</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: ${colors.light};">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${colors.danger} 0%, #DC2626 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ${event.name}
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                Payment Failed ✗
              </p>
            </td>
          </tr>

          <!-- Failed Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background-color: ${colors.danger}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 18L18 6M6 6l12 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h2 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 24px;">
                Payment Unsuccessful
              </h2>
              <p style="margin: 0; color: #6B7280; font-size: 16px; line-height: 1.6;">
                Hi <strong>${data.participantName}</strong>,<br>
                Unfortunately, your payment could not be processed. Please try again.
              </p>
            </td>
          </tr>

          <!-- Transaction Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: ${colors.light}; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 20px; color: ${colors.dark}; font-size: 18px; border-bottom: 2px solid ${colors.danger}; padding-bottom: 10px;">
                  Transaction Details
                </h3>
                <table role="presentation" style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Participant</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.participantName}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Race Category</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; font-weight: bold; text-align: right;">
                      ${data.raceCategory}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Amount</td>
                    <td style="padding: 8px 0; color: ${colors.danger}; font-size: 16px; font-weight: bold; text-align: right;">
                      ₹${data.amount}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Transaction ID</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 12px; font-family: monospace; text-align: right;">
                      ${data.transactionId}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Attempted On</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
                      ${data.paymentDate}
                    </td>
                  </tr>
                  ${data.failureReason ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Reason</td>
                    <td style="padding: 8px 0; color: ${colors.danger}; font-size: 14px; text-align: right;">
                      ${data.failureReason}
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>
            </td>
          </tr>

          <!-- Common Reasons -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: #FEE2E2; border-left: 4px solid ${colors.danger}; padding: 20px; border-radius: 4px;">
                <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px;">
                  ❓ Common Reasons for Payment Failure
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #6B7280; font-size: 14px; line-height: 1.8;">
                  <li>Insufficient balance in your account</li>
                  <li>Incorrect card details or CVV</li>
                  <li>Payment declined by your bank</li>
                  <li>Network connectivity issues</li>
                  <li>Daily transaction limit exceeded</li>
                  <li>Expired card or blocked card</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="border: 2px solid ${colors.primary}; border-radius: 8px; padding: 20px; background-color: #FFFBEB;">
                <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px;">
                  🔄 What You Can Do
                </h3>
                <p style="margin: 0 0 15px; color: #6B7280; font-size: 14px; line-height: 1.6;">
                  <strong>1. Check your bank account:</strong> Ensure you have sufficient balance and that your card is active.
                </p>
                <p style="margin: 0 0 15px; color: #6B7280; font-size: 14px; line-height: 1.6;">
                  <strong>2. Try a different payment method:</strong> Use another card or payment option.
                </p>
                <p style="margin: 0 0 15px; color: #6B7280; font-size: 14px; line-height: 1.6;">
                  <strong>3. Contact your bank:</strong> If the issue persists, your bank can help identify the problem.
                </p>
                <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                  <strong>4. Try again:</strong> Visit our registration page to complete your registration.
                </p>
              </div>
            </td>
          </tr>

          <!-- Refund Information -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: ${colors.light}; padding: 20px; border-radius: 8px;">
                <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px;">
                  💳 Refund Information
                </h3>
                <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
                  <strong>Don't worry about duplicate charges!</strong> If any amount was deducted from your account, it will be automatically refunded to your original payment method within <strong>3-5 business days</strong>.
                </p>
              </div>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="https://konaseemarkgrunners.netlify.app/register" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                Try Again - Register Now
              </a>
            </td>
          </tr>

          <!-- Social Media -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <p style="margin: 0 0 15px; color: ${colors.dark}; font-size: 16px; font-weight: bold;">
                ${footer.message}
              </p>
              <div style="margin-bottom: 20px;">
                <a href="${social.instagram}" style="display: inline-block; margin: 0 10px; padding: 12px 24px; background-color: ${colors.primary}; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;">
                  📷 Instagram
                </a>
                <a href="${social.facebook}" style="display: inline-block; margin: 0 10px; padding: 12px 24px; background-color: ${colors.secondary}; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;">
                  👍 Facebook
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${colors.dark}; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px; color: #9CA3AF; font-size: 14px;">
                Need help? Contact us at <a href="mailto:${support.email}" style="color: ${colors.primary}; text-decoration: none;">${support.email}</a>
              </p>
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
//# sourceMappingURL=paymentFailed.js.map