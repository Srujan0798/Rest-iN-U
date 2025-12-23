// Email Service using SendGrid
import sgMail from '@sendgrid/mail';
import { config } from '../config';
import { logger } from '../utils/logger';

// Initialize SendGrid
if (config.sendgrid.apiKey) {
    sgMail.setApiKey(config.sendgrid.apiKey);
}

interface EmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: Array<{
        content: string;
        filename: string;
        type: string;
    }>;
}

export class EmailService {
    private fromEmail = config.sendgrid.fromEmail;

    /**
     * Send a single email
     */
    async send(options: EmailOptions): Promise<boolean> {
        if (!config.sendgrid.apiKey) {
            logger.warn('SendGrid API key not configured, email not sent');
            return false;
        }

        try {
            await sgMail.send({
                to: options.to,
                from: this.fromEmail,
                subject: options.subject,
                html: options.html,
                text: options.text || this.stripHtml(options.html),
                attachments: options.attachments,
            });

            logger.info(`Email sent to ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
            return true;
        } catch (error) {
            logger.error('Failed to send email:', error);
            return false;
        }
    }

    /**
     * Send welcome email to new user
     */
    async sendWelcomeEmail(email: string, firstName: string): Promise<boolean> {
        return this.send({
            to: email,
            subject: 'Welcome to REST-iN-U - Where Ancient Wisdom Meets Modern Living',
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fff;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🙏 Namaste, ${firstName}!</h1>
          </div>
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Welcome to <strong>REST-iN-U</strong> - the world's first real estate platform that combines
              5,000 years of Vedic wisdom with cutting-edge technology.
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Here's what makes us unique:
            </p>
            <ul style="font-size: 15px; line-height: 1.8; color: #555;">
              <li>🏠 <strong>Vastu Analysis</strong> - Every property scored for positive energy</li>
              <li>📅 <strong>Auspicious Timing</strong> - Know the best dates for property decisions</li>
              <li>🌍 <strong>Climate Resilience</strong> - 100-year climate risk projections</li>
              <li>🔗 <strong>Blockchain Verified</strong> - Immutable property records</li>
            </ul>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${config.frontendUrl}/properties" 
                 style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; 
                        padding: 14px 30px; text-decoration: none; border-radius: 8px; 
                        font-weight: bold; font-size: 16px;">
                Start Exploring Properties
              </a>
            </div>
            <p style="font-size: 14px; color: #666; text-align: center;">
              May your property journey be blessed with good fortune! 🪷
            </p>
          </div>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #888;">
            <p>© ${new Date().getFullYear()} REST-iN-U. Where homes find their rightful owners.</p>
          </div>
        </div>
      `,
        });
    }

    /**
     * Send property inquiry notification to agent
     */
    async sendInquiryNotification(
        agentEmail: string,
        agentName: string,
        inquirerName: string,
        inquirerEmail: string,
        inquirerPhone: string,
        propertyAddress: string,
        message: string
    ): Promise<boolean> {
        return this.send({
            to: agentEmail,
            subject: `New Inquiry for ${propertyAddress}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e40af; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Property Inquiry</h1>
          </div>
          <div style="padding: 25px; background: #fff;">
            <p>Hello ${agentName},</p>
            <p>You have received a new inquiry for:</p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <strong style="color: #1e40af;">${propertyAddress}</strong>
            </div>
            <h3 style="color: #333;">Contact Information:</h3>
            <table style="width: 100%; font-size: 14px;">
              <tr><td style="padding: 5px 0;"><strong>Name:</strong></td><td>${inquirerName}</td></tr>
              <tr><td style="padding: 5px 0;"><strong>Email:</strong></td><td><a href="mailto:${inquirerEmail}">${inquirerEmail}</a></td></tr>
              <tr><td style="padding: 5px 0;"><strong>Phone:</strong></td><td>${inquirerPhone || 'Not provided'}</td></tr>
            </table>
            ${message ? `
              <h3 style="color: #333;">Message:</h3>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border-left: 4px solid #1e40af;">
                ${message}
              </div>
            ` : ''}
            <div style="text-align: center; margin: 25px 0;">
              <a href="${config.frontendUrl}/agent/leads" 
                 style="background: #1e40af; color: white; padding: 12px 25px; 
                        text-decoration: none; border-radius: 6px;">
                View in Dashboard
              </a>
            </div>
          </div>
        </div>
      `,
        });
    }

    /**
     * Send Vastu certificate
     */
    async sendVastuCertificate(
        email: string,
        recipientName: string,
        propertyAddress: string,
        vastuScore: number,
        vastuGrade: string,
        certificateUrl: string
    ): Promise<boolean> {
        return this.send({
            to: email,
            subject: `Vastu Certificate for ${propertyAddress}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669, #047857); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🪷 Vastu Shastra Certificate</h1>
          </div>
          <div style="padding: 25px; background: #fff;">
            <p>Dear ${recipientName},</p>
            <p>Your property has been analyzed according to the ancient principles of Vastu Shastra.</p>
            
            <div style="text-align: center; padding: 25px; background: #ecfdf5; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; color: #059669;">${vastuScore}</div>
              <div style="font-size: 24px; color: #047857;">Grade: ${vastuGrade}</div>
              <div style="font-size: 14px; color: #666; margin-top: 10px;">Out of 100</div>
            </div>
            
            <p><strong>Property:</strong> ${propertyAddress}</p>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${certificateUrl}" 
                 style="background: #059669; color: white; padding: 12px 25px; 
                        text-decoration: none; border-radius: 6px;">
                Download Certificate (PDF)
              </a>
            </div>
            
            <p style="font-size: 13px; color: #666; text-align: center;">
              This certificate is verified on the blockchain for authenticity.
            </p>
          </div>
        </div>
      `,
        });
    }

    /**
     * Send auspicious date reminder
     */
    async sendAuspiciousDateReminder(
        email: string,
        recipientName: string,
        eventType: string,
        date: string,
        property?: string
    ): Promise<boolean> {
        const eventDescriptions: Record<string, string> = {
            'PROPERTY_VIEWING': 'property viewing',
            'MAKING_OFFER': 'making an offer',
            'SIGNING_CONTRACT': 'signing the contract',
            'CLOSING': 'closing the deal',
            'GRIHA_PRAVESH': 'Griha Pravesh (housewarming ceremony)',
            'RENOVATION_START': 'starting renovations',
        };

        return this.send({
            to: email,
            subject: `🗓️ Auspicious Date Reminder - ${eventDescriptions[eventType] || eventType}`,
            html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #7c3aed, #5b21b6); padding: 25px; text-align: center;">
            <h1 style="color: white; margin: 0;">📅 Auspicious Date Reminder</h1>
          </div>
          <div style="padding: 25px; background: #fff;">
            <p>Namaste ${recipientName},</p>
            <p>According to Vedic astrology, the following date is highly auspicious for:</p>
            
            <div style="text-align: center; padding: 20px; background: #faf5ff; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 18px; color: #7c3aed; text-transform: uppercase;">
                ${eventDescriptions[eventType] || eventType}
              </div>
              <div style="font-size: 32px; font-weight: bold; color: #5b21b6; margin: 10px 0;">
                ${date}
              </div>
              ${property ? `<div style="font-size: 14px; color: #666;">Property: ${property}</div>` : ''}
            </div>
            
            <p style="font-size: 14px; color: #666;">
              This timing is based on:
            </p>
            <ul style="font-size: 14px; color: #555;">
              <li>Favorable Nakshatra (lunar mansion)</li>
              <li>Shubh Muhurat (auspicious moment)</li>
              <li>Absence of Rahu Kalam</li>
            </ul>
            
            <p style="text-align: center; font-size: 13px; color: #888;">
              🕉️ May this be blessed with success and prosperity
            </p>
          </div>
        </div>
      `,
        });
    }

    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
    }
}

export const emailService = new EmailService();

