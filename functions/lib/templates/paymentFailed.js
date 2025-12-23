"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentFailedEmail = generatePaymentFailedEmail;
const emailConfig_1 = require("../config/emailConfig");
const emailComponents_1 = require("./emailComponents");
function generatePaymentFailedEmail(data) {
    const { colors } = emailConfig_1.EMAIL_CONFIG;
    const uniqueContent = `
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
  `;
    const emailContent = `
    ${(0, emailComponents_1.generateEmailHeader)('failed', 'Payment Failed ✗')}
    ${(0, emailComponents_1.generateStatusIcon)('failed', 'Payment Unsuccessful', `Hi <strong>${data.participantName}</strong>,<br>Unfortunately, your payment could not be processed. Please try again.`)}
    ${(0, emailComponents_1.generateDetailsSection)('Transaction Details', colors.danger, (0, emailComponents_1.generateParticipantDetailsTable)(data, data, colors.danger, colors.danger, data.failureReason))}
    ${uniqueContent}
    ${(0, emailComponents_1.generateEventInfoSection)()}
    ${(0, emailComponents_1.generateSocialMediaSection)()}
    ${(0, emailComponents_1.generateEmailFooter)()}
  `;
    return (0, emailComponents_1.generateBaseEmailLayout)('Payment Failed', emailContent);
}
//# sourceMappingURL=paymentFailed.js.map