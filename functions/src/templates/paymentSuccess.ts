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

export interface PaymentSuccessEmailData extends ParticipantData, PaymentData {}

export function generatePaymentSuccessEmail(data: PaymentSuccessEmailData): string {
  const { colors } = EMAIL_CONFIG;

  const emailContent = `
    ${generateEmailHeader('success', 'Payment Successful ✓')}
    ${generateStatusIcon('success', 'Registration Confirmed!', `Hi <strong>${data.participantName}</strong>,<br>Your payment has been successfully processed. You're all set for the race!`)}
    ${generateDetailsSection('Registration Details', colors.primary, generateParticipantDetailsTable(data, data, colors.primary, colors.success))}
    ${generateEventInfoSection()}
    
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
    
    ${generateSocialMediaSection()}
    ${generateEmailFooter()}
  `;
  
  return generateBaseEmailLayout('Payment Successful', emailContent);
}
