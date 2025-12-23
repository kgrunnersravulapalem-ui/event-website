import { EMAIL_CONFIG } from '../config/emailConfig';

/**
 * Common participant data interface
 */
export interface ParticipantData {
  participantName: string;
  participantEmail: string;
  phone: string;
  age?: number;
  gender: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  tshirtSize?: string;
  bloodGroup?: string;
  raceCategory: string;
}

/**
 * Common payment data interface
 */
export interface PaymentData {
  amount: number;
  orderId: string;
  transactionId: string;
  paymentDate: string;
}

/**
 * Generate email header
 */
export function generateEmailHeader(type: 'success' | 'pending' | 'failed', subtitle: string): string {
  const { event, colors } = EMAIL_CONFIG;
  
  const headerColors = {
    success: `linear-gradient(135deg, ${colors.success} 0%, ${colors.primary} 100%)`,
    pending: `linear-gradient(135deg, ${colors.warning} 0%, #D97706 100%)`,
    failed: `linear-gradient(135deg, ${colors.danger} 0%, #DC2626 100%)`
  };
  
  return `
    <tr>
      <td style="background: ${headerColors[type]}; padding: 40px 30px; text-align: center;">
        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
          ${event.name}
        </h1>
        <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
          ${subtitle}
        </p>
      </td>
    </tr>
  `;
}

/**
 * Generate status icon (success/pending/failed)
 */
export function generateStatusIcon(type: 'success' | 'pending' | 'failed', heading: string, message: string): string {
  const { colors } = EMAIL_CONFIG;
  
  const icons = {
    success: {
      color: colors.success,
      symbol: '✓',
      fontSize: '48px'
    },
    pending: {
      color: colors.warning,
      symbol: '⏰',
      fontSize: '40px'
    },
    failed: {
      color: colors.danger,
      symbol: '✗',
      fontSize: '48px'
    }
  };
  
  const icon = icons[type];
  
  return `
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <div style="width: 80px; height: 80px; background-color: ${icon.color}; border-radius: 50%; margin: 0 auto; display: table;">
          <div style="display: table-cell; vertical-align: middle; text-align: center;">
            <span style="color: #ffffff; font-size: ${icon.fontSize}; font-weight: bold; line-height: 80px;">
              ${icon.symbol}
            </span>
          </div>
        </div>
        <h2 style="margin: 20px 0 15px; color: ${colors.dark}; font-size: 24px;">
          ${heading}
        </h2>
        <p style="margin: 0; color: #6B7280; font-size: 16px; line-height: 1.6;">
          ${message}
        </p>
      </td>
    </tr>
  `;
}

/**
 * Generate participant details table
 */
export function generateParticipantDetailsTable(
  participant: ParticipantData,
  payment: PaymentData,
  borderColor: string,
  amountColor: string,
  failureReason?: string
): string {
  const { colors } = EMAIL_CONFIG;
  
  return `
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Participant Name</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; font-weight: bold; text-align: right;">
          ${participant.participantName}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Email</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.participantEmail}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Phone</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.phone}
        </td>
      </tr>
      ${participant.age ? `
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Age</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.age} years
        </td>
      </tr>
      ` : ''}
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Gender</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.gender}
        </td>
      </tr>
      ${participant.dateOfBirth ? `
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Date of Birth</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.dateOfBirth}
        </td>
      </tr>
      ` : ''}
      ${participant.tshirtSize ? `
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">T-Shirt Size</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.tshirtSize}
        </td>
      </tr>
      ` : ''}
      ${participant.bloodGroup ? `
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Blood Group</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.bloodGroup}
        </td>
      </tr>
      ` : ''}
      ${participant.emergencyContact ? `
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Emergency Contact</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${participant.emergencyContact}
        </td>
      </tr>
      ` : ''}
      <tr>
        <td colspan="2" style="padding: 16px 0 8px; border-top: 1px solid #E5E7EB;"></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Race Category</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; font-weight: bold; text-align: right;">
          ${participant.raceCategory}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Amount</td>
        <td style="padding: 8px 0; color: ${amountColor}; font-size: 16px; font-weight: bold; text-align: right;">
          ₹${(payment.amount / 100).toFixed(2)}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Order ID</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 12px; font-family: monospace; text-align: right;">
          ${payment.orderId}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Transaction ID</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 12px; font-family: monospace; text-align: right;">
          ${payment.transactionId}
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Payment Date & Time</td>
        <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
          ${payment.paymentDate}
        </td>
      </tr>
      ${failureReason ? `
      <tr>
        <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Failure Reason</td>
        <td style="padding: 8px 0; color: ${colors.danger}; font-size: 14px; text-align: right;">
          ${failureReason}
        </td>
      </tr>
      ` : ''}
    </table>
  `;
}

/**
 * Generate details section wrapper
 */
export function generateDetailsSection(title: string, borderColor: string, content: string): string {
  const { colors } = EMAIL_CONFIG;
  
  return `
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: ${colors.light}; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 20px; color: ${colors.dark}; font-size: 18px; border-bottom: 2px solid ${borderColor}; padding-bottom: 10px;">
            ${title}
          </h3>
          ${content}
        </div>
      </td>
    </tr>
  `;
}

/**
 * Generate event information section
 */
export function generateEventInfoSection(): string {
  const { event, colors } = EMAIL_CONFIG;
  
  return `
    <tr>
      <td style="padding: 0 30px 30px;">
        <div style="background-color: #FEF3C7; border-left: 4px solid ${colors.warning}; padding: 20px; border-radius: 4px;">
          <h3 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 18px;">
            📅 Event Information
          </h3>
          <p style="margin: 0 0 10px; color: ${colors.dark}; font-size: 15px;">
            <strong>Date:</strong> ${event.date}
          </p>
          <p style="margin: 0 0 10px; color: ${colors.dark}; font-size: 15px;">
            <strong>Venue:</strong> ${event.venue}
          </p>
          <p style="margin: 0; color: ${colors.dark}; font-size: 15px;">
            <strong>Reporting Time:</strong> ${event.reportingTime}
          </p>
        </div>
      </td>
    </tr>
  `;
}

/**
 * Generate social media section
 */
export function generateSocialMediaSection(): string {
  const { social, colors, footer } = EMAIL_CONFIG;
  
  return `
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
  `;
}

/**
 * Generate email footer
 */
export function generateEmailFooter(): string {
  const { support, colors, footer } = EMAIL_CONFIG;
  
  return `
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
  `;
}

/**
 * Generate base email layout
 */
export function generateBaseEmailLayout(title: string, content: string): string {
  const { colors } = EMAIL_CONFIG;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: ${colors.light};">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
