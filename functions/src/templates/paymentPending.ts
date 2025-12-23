import { EMAIL_CONFIG } from '../config/emailConfig';
import {
  generateBaseEmailLayout,
  generateEmailHeader,
  generateStatusIcon,
  generateDetailsSection,
  generateParticipantDetailsTable,
  generateEventInfoSection,
  generateSocialMediaSection,
  generateEmailFooter,
  ParticipantData,
  PaymentData,
} from './emailComponents';

export interface PaymentPendingEmailData extends ParticipantData, PaymentData {}

export function generatePaymentPendingEmail(data: PaymentPendingEmailData): string {
  const { colors } = EMAIL_CONFIG;

  const emailContent = `
    ${generateEmailHeader('pending', 'Payment Pending ⏳')}
    ${generateStatusIcon('pending', 'Payment Being Processed', `Hi <strong>${data.participantName}</strong>,<br>Your payment is currently being processed by the payment gateway. This usually takes a few minutes.`)}
    ${generateDetailsSection('Transaction Details', colors.warning, generateParticipantDetailsTable(data, data, colors.warning, colors.warning))}
    
    <!-- What Happens Next -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #FEF3C7; border-left: 4px solid ${colors.warning}; padding: 20px; border-radius: 4px;">
          <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px;">
            ⏰ What Happens Next?
          </h3>
          <ul style="margin: 0; padding-left: 20px; color: #6B7280; font-size: 14px; line-height: 1.8;">
            <li>Your payment is being verified by the bank</li>
            <li>This process usually takes 5-10 minutes</li>
            <li>You'll receive a confirmation email once the payment is successful</li>
            <li>If the payment fails, the amount will be automatically refunded to your account within 3-5 business days</li>
          </ul>
        </div>
      </td>
    </tr>
    
    <!-- Action Required -->
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="border: 2px solid ${colors.warning}; border-radius: 8px; padding: 20px; background-color: #FFFBEB;">
          <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px;">
            ℹ️ Important Notice
          </h3>
          <p style="margin: 0 0 10px; color: #6B7280; font-size: 14px; line-height: 1.6;">
            <strong>Do not close the payment window</strong> if you're still on the payment page. Wait for the final confirmation.
          </p>
          <p style="margin: 0; color: #6B7280; font-size: 14px; line-height: 1.6;">
            If you don't receive a confirmation email within 30 minutes, please check your spam folder or contact our support team.
          </p>
        </div>
      </td>
    </tr>
    
    ${generateEventInfoSection()}
    ${generateSocialMediaSection()}
    ${generateEmailFooter()}
  `;
  
  return generateBaseEmailLayout('Payment Pending', emailContent);
}
