"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePaymentSuccessEmail = generatePaymentSuccessEmail;
const emailConfig_1 = require("../config/emailConfig");
const emailComponents_1 = require("./emailComponents");
function generatePaymentSuccessEmail(data) {
    const { colors } = emailConfig_1.EMAIL_CONFIG;
    const emailContent = `
    ${(0, emailComponents_1.generateEmailHeader)('success', 'Payment Successful ✓')}
    ${(0, emailComponents_1.generateStatusIcon)('success', 'Registration Confirmed!', `Hi <strong>${data.participantName}</strong>,<br>Your payment has been successfully processed. You're all set for the race!`)}
    ${(0, emailComponents_1.generateDetailsSection)('Registration Details', colors.primary, (0, emailComponents_1.generateParticipantDetailsTable)(data, data, colors.primary, colors.success))}
    ${(0, emailComponents_1.generateEventInfoSection)()}
    
    <!-- Important Instructions -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="border: 2px dashed ${colors.primary}; border-radius: 8px; padding: 20px;">
          <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px;">
            ⚠️ Important Instructions
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #6B7280; font-size: 14px; line-height: 1.8;">
            <li>Please arrive at least 30 minutes before the reporting time</li>
            <li>Bring a valid ID proof for verification</li>
            <li>Wear comfortable running shoes and sportswear</li>
            <li>Stay hydrated before and during the event</li>
            <li>Follow all safety instructions from organizers</li>
          </ul>
        </div>
      </td>
    </tr>
    
    ${(0, emailComponents_1.generateSocialMediaSection)()}
    ${(0, emailComponents_1.generateEmailFooter)()}
  `;
    return (0, emailComponents_1.generateBaseEmailLayout)('Payment Successful', emailContent);
}
//# sourceMappingURL=paymentSuccess.js.map