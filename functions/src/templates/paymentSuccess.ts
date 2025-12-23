import { EMAIL_CONFIG } from '../config/emailConfig';

export interface PaymentSuccessEmailData {
  participantName: string;
  participantEmail: string;
  raceCategory: string;
  amount: number;
  transactionId: string;
  paymentDate: string;
}

export function generatePaymentSuccessEmail(data: PaymentSuccessEmailData): string {
  const { event, colors, social, support, footer } = EMAIL_CONFIG;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: ${colors.light};">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                ${event.name}
              </h1>
              <p style="margin: 10px 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                Payment Successful ✓
              </p>
            </td>
          </tr>

          <!-- Success Message -->
          <tr>
            <td style="padding: 40px 30px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto 20px; background-color: ${colors.success}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <h2 style="margin: 0 0 15px; color: ${colors.dark}; font-size: 24px;">
                Registration Confirmed!
              </h2>
              <p style="margin: 0; color: #6B7280; font-size: 16px; line-height: 1.6;">
                Hi <strong>${data.participantName}</strong>,<br>
                Your payment has been successfully processed. You're all set for the race!
              </p>
            </td>
          </tr>

          <!-- Registration Details -->
          <tr>
            <td style="padding: 0 30px 30px;">
              <div style="background-color: ${colors.light}; border-radius: 8px; padding: 25px; margin-bottom: 20px;">
                <h3 style="margin: 0 0 20px; color: ${colors.dark}; font-size: 18px; border-bottom: 2px solid ${colors.primary}; padding-bottom: 10px;">
                  Registration Details
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
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Amount Paid</td>
                    <td style="padding: 8px 0; color: ${colors.success}; font-size: 16px; font-weight: bold; text-align: right;">
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
                    <td style="padding: 8px 0; color: #6B7280; font-size: 14px;">Payment Date</td>
                    <td style="padding: 8px 0; color: ${colors.dark}; font-size: 14px; text-align: right;">
                      ${data.paymentDate}
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Event Information -->
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
