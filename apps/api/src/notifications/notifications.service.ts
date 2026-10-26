import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';

export type BookingNotificationPayload = {
  id: string;
  reference: string;
  description: string;
  address: string;
  gpsAddress?: string | null;
  preferredDate?: Date | string | null;
  timeWindow?: string | null;
  createdAt: Date | string;
  customer: {
    fullName: string;
    email?: string;
    phone: string;
    organisationName?: string | null;
    preferredContactMethod?: string | null;
  };
  service: {
    name: string;
    slug: string;
  };
};

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  /**
   * Dispatches an instant email notification to the administrator when a booking or quote is submitted.
   */
  async sendNewBookingNotification(payload: BookingNotificationPayload): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not configured. Skipping email notification.');
      return false;
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'kobbysintertech@gmail.com';
    const from = process.env.EMAIL_FROM || "Kobby's Intertech <onboarding@resend.dev>";
    const webUrl = process.env.WEB_URL || 'https://kobbys-intertech-services.vercel.app';

    const subject = `New Booking: [${payload.reference}] - ${payload.service.name}`;
    const html = this.buildAdminEmailHtml(payload, webUrl);

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [adminEmail],
          subject,
          html,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        this.logger.error(
          `Resend failed to send booking alert for ${payload.reference}: ${JSON.stringify(result)}`,
        );
        return false;
      }

      this.logger.log(
        `✅ Admin booking notification email delivered for ${payload.reference} (ID: ${result.id}) to ${adminEmail}`,
      );
      return true;
    } catch (error) {
      this.logger.error(
        `Unexpected error sending email notification for ${payload.reference}:`,
        error,
      );
      return false;
    }
  }

  async sendStaffPasswordResetEmail(email: string, resetUrl: string): Promise<boolean> {
    return this.sendStaffAccessEmail(
      email,
      resetUrl,
      'Reset your Kobby’s Intertech staff password',
      'A password reset was requested for your staff account.',
      'Set a new password',
    );
  }

  /**
   * Emails the one-time activation link created when an owner invites a staff
   * member. The link is only delivered here, so a failed send must be rolled
   * back by the caller to keep the invitation reusable.
   */
  async sendStaffInvitationEmail(email: string, activationUrl: string): Promise<boolean> {
    return this.sendStaffAccessEmail(
      email,
      activationUrl,
      'Set your Kobby’s Intertech staff password',
      'An account owner has created a staff account for you.',
      'Activate your account',
    );
  }

  private async sendStaffAccessEmail(
    email: string,
    accessUrl: string,
    subject: string,
    intro: string,
    linkLabel: string,
  ): Promise<boolean> {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not configured. Staff access email was not sent.');
      return false;
    }
    const from = process.env.EMAIL_FROM || "Kobby's Intertech <onboarding@resend.dev>";
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from,
          to: [email],
          subject,
          html: `<p>${intro}</p><p><a href="${accessUrl}">${linkLabel}</a></p><p>This one-time link expires in 24 hours. If you did not expect it, you can ignore this email.</p>`,
        }),
      });
      if (!response.ok) {
        this.logger.error(`Resend failed to send a staff access email to ${email}: ${await response.text()}`);
        return false;
      }
      this.logger.log(`✅ Staff access email delivered to ${email}`);
      return true;
    } catch (error) {
      this.logger.error(`Unexpected error sending staff access email to ${email}:`, error);
      return false;
    }
  }

  private buildAdminEmailHtml(data: BookingNotificationPayload, webUrl: string): string {
    const cleanPhone = (data.customer.phone || '').replace(/[^0-9]/g, '');
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}` : '';
    const dashboardUrl = `${webUrl}/admin/bookings`;
    const cleanDescription = (data.description || 'No additional scope description provided.').trim();

    const formattedDate = data.preferredDate
      ? new Date(data.preferredDate).toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'Flexible / Not specified';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking: ${data.reference}</title>
  <style>
    @media only screen and (max-width: 480px) {
      .email-container { width: 100% !important; padding: 0 !important; }
      .email-card { border-radius: 0 !important; }
      .email-content { padding: 18px 16px !important; }
      .header-cell { padding: 22px 18px !important; }
      .ref-stack { display: block !important; width: 100% !important; text-align: left !important; }
      .status-stack { display: inline-block !important; margin-top: 6px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 12px 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9;">
    <tr>
      <td align="center" style="padding: 4px;">
        <table role="presentation" class="email-container" width="100%" style="max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);" border="0" cellspacing="0" cellpadding="0">
          
          <!-- Header Banner -->
          <tr>
            <td class="header-cell" style="background: linear-gradient(135deg, #9a001a 0%, #360009ff 100%); padding: 26px 24px; text-align: left; border-top-left-radius: 11px; border-top-right-radius: 11px;">
              <span style="display: inline-block; background: rgba(255, 255, 255, 0.22); color: #ffffff; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; border-radius: 16px; margin-bottom: 8px;">
                NEW BOOKING RECEIVED
              </span>
              <h1 style="margin: 0 0 4px; font-size: 21px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em; line-height: 1.25;">
                Kobby's Intertech Services
              </h1>
              <p style="margin: 0; font-size: 13.5px; color: rgba(255, 255, 255, 0.9); line-height: 1.4;">
                A new service request was submitted through the website.
              </p>
            </td>
          </tr>

          <!-- Reference Code & Status Ribbon -->
          <tr>
            <td style="background: #f8fafc; padding: 14px 20px; border-bottom: 1px solid #e2e8f0;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="ref-stack" style="vertical-align: middle;">
                    <span style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Reference</span>
                    <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 15px; font-weight: 800; color: #9a001a;">
                      ${data.reference}
                    </span>
                  </td>
                  <td class="status-stack" align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; font-size: 11px; font-weight: 800; background: #fef08a; color: #854d0e; padding: 5px 12px; border-radius: 20px; border: 1px solid #fde047;">
                      ● STATUS: REQUESTED
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Email Main Body -->
          <tr>
            <td class="email-content" style="padding: 22px 20px;">
              
              <!-- Customer Box -->
              <table role="presentation" width="100%" style="background: #ffffff; border-radius: 10px; border: 1.5px solid #e2e8f0; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);" border="0" cellspacing="0" cellpadding="16">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 4px;">
                      👤 Customer Information
                    </div>
                    <div style="font-size: 17px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">
                      ${data.customer.fullName}
                    </div>
                    ${data.customer.organisationName ? `<div style="font-size: 13px; color: #64748b; margin-bottom: 8px;">🏢 ${data.customer.organisationName}</div>` : ''}

                    <div style="font-size: 14px; line-height: 1.6; color: #334155; margin-top: 8px;">
                      <div>📞 <strong>Phone:</strong> <a href="tel:${data.customer.phone}" style="color: #9a001a; text-decoration: none; font-weight: 700;">${data.customer.phone}</a></div>
                      <div>✉️ <strong>Email:</strong> ${data.customer.email ? `<a href="mailto:${data.customer.email}" style="color: #0284c7; text-decoration: none;">${data.customer.email}</a>` : `<span style="color: #64748b; font-style: italic;">Not provided</span>`}</div>
                      ${data.customer.preferredContactMethod ? `<div style="font-size: 12.5px; color: #64748b; margin-top: 2px;">Prefers: <strong>${data.customer.preferredContactMethod}</strong></div>` : ''}
                    </div>

                    <!-- Direct Contact Action Bar (Side by Side) -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 14px;">
                      <tr>
                        <td width="48%" style="vertical-align: middle;">
                          <a href="tel:${data.customer.phone}" style="display: block; width: 100%; box-sizing: border-box; background: #0f172a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 6px; border-radius: 8px; text-align: center; line-height: 1.2;">
                            <span style="font-size: 14px; vertical-align: middle; margin-right: 4px;">📞</span><span style="vertical-align: middle;">Call Client</span>
                          </a>
                        </td>
                        <td width="4%"></td>
                        <td width="48%" style="vertical-align: middle;">
                          ${
                            waUrl
                              ? `<a href="${waUrl}" style="display: block; width: 100%; box-sizing: border-box; background: #22c55e; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 11px 6px; border-radius: 8px; text-align: center; line-height: 1.2;">
                            <span style="font-size: 14px; vertical-align: middle; margin-right: 4px;">💬</span><span style="vertical-align: middle;">WhatsApp</span>
                          </a>`
                              : ''
                          }
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Service & Scope Box -->
              <table role="presentation" width="100%" style="background: #ffffff; border-radius: 10px; border: 1.5px solid #e2e8f0; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);" border="0" cellspacing="0" cellpadding="16">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 4px;">
                      🛠️ Requested Service
                    </div>
                    <div style="font-size: 16px; font-weight: 800; color: #9a001a; margin-bottom: 12px;">
                      ${data.service.name}
                    </div>

                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 6px;">
                      📝 Project Scope &amp; Details
                    </div>
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-size: 13.5px; line-height: 1.55; color: #1e293b; text-align: left;">
${cleanDescription}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Location & Schedule -->
              <table role="presentation" width="100%" style="background: #ffffff; border-radius: 10px; border: 1.5px solid #e2e8f0; margin-bottom: 22px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);" border="0" cellspacing="0" cellpadding="16">
                <tr>
                  <td style="padding: 16px;">
                    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 8px;">
                      📍 Site Location &amp; Schedule
                    </div>
                    <div style="font-size: 13.5px; color: #1e293b; margin-bottom: 4px; line-height: 1.45;">
                      <strong>Address:</strong> ${data.address}
                    </div>
                    ${
                      data.gpsAddress
                        ? `<div style="font-size: 13px; color: #0284c7; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; margin-bottom: 6px;">
                      GPS: ${data.gpsAddress}
                    </div>`
                        : ''
                    }
                    <div style="font-size: 13.5px; color: #1e293b; margin-top: 8px; line-height: 1.45;">
                      📅 <strong>Preferred Date:</strong> <span style="color: #9a001a; font-weight: 700;">${formattedDate}</span>
                      ${data.timeWindow ? `<span style="color: #64748b;">(${data.timeWindow})</span>` : ''}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Big Primary CTA: Open in Dashboard -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 10px 0 16px;">
                <tr>
                  <td align="center">
                    <a href="${dashboardUrl}" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #9a001a 0%, #700013 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 800; padding: 14px 20px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px rgba(154, 0, 26, 0.3);">
                      Open in Admin Control Center →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Clean Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 18px 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; font-size: 11.5px; color: #64748b; line-height: 1.5;">
                Automated notification from <strong>Kobby's Intertech Services</strong><br>
                Admin Dashboard: <a href="${webUrl}/admin" style="color: #9a001a; text-decoration: none; font-weight: 700;">${webUrl}/admin</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }
}
