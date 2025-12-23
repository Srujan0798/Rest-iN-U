import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

// Email Service for Transactional and Marketing Emails
class EmailService {
    private transporter: nodemailer.Transporter;
    private fromEmail: string;
    private fromName: string;

    constructor() {
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@restinu.com';
        this.fromName = process.env.EMAIL_FROM_NAME || 'Rest-iN-U';

        // Configure based on environment
        if (process.env.NODE_ENV === 'production') {
            // Use SES or SendGrid in production
            this.transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT || '587'),
                secure: process.env.SMTP_SECURE === 'true',
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            });
        } else {
            // Use Ethereal for development
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: process.env.ETHEREAL_USER || 'test@ethereal.email',
                    pass: process.env.ETHEREAL_PASS || 'testpass'
                }
            });
        }
    }

    // ============================================
    // TRANSACTIONAL EMAILS
    // ============================================

    async sendWelcomeEmail(user: { email: string; firstName: string }): Promise<void> {
        await this.send({
            to: user.email,
            subject: 'Welcome to Rest-iN-U! 🏠',
            template: 'welcome',
            data: { firstName: user.firstName }
        });
    }

    async sendPasswordResetEmail(user: { email: string; firstName: string }, resetToken: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        await this.send({
            to: user.email,
            subject: 'Reset Your Password - Rest-iN-U',
            template: 'password-reset',
            data: { firstName: user.firstName, resetUrl }
        });
    }

    async sendEmailVerification(user: { email: string; firstName: string }, verifyToken: string): Promise<void> {
        const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

        await this.send({
            to: user.email,
            subject: 'Verify Your Email - Rest-iN-U',
            template: 'email-verification',
            data: { firstName: user.firstName, verifyUrl }
        });
    }

    // ============================================
    // PROPERTY ALERTS
    // ============================================

    async sendSavedSearchAlert(
        user: { email: string; firstName: string },
        searchName: string,
        properties: any[]
    ): Promise<void> {
        await this.send({
            to: user.email,
            subject: `${properties.length} New Properties Match "${searchName}" 🏡`,
            template: 'saved-search-alert',
            data: {
                firstName: user.firstName,
                searchName,
                properties,
                viewAllUrl: `${process.env.FRONTEND_URL}/saved-searches`
            }
        });
    }

    async sendPriceDropAlert(
        user: { email: string; firstName: string },
        property: { address: string; oldPrice: number; newPrice: number; url: string }
    ): Promise<void> {
        const priceDrop = property.oldPrice - property.newPrice;
        const percentDrop = ((priceDrop / property.oldPrice) * 100).toFixed(1);

        await this.send({
            to: user.email,
            subject: `Price Dropped $${priceDrop.toLocaleString()} on ${property.address}! 📉`,
            template: 'price-drop',
            data: {
                firstName: user.firstName,
                ...property,
                priceDrop,
                percentDrop
            }
        });
    }

    async sendNewListingAlert(
        user: { email: string; firstName: string },
        property: any
    ): Promise<void> {
        await this.send({
            to: user.email,
            subject: `New Listing: ${property.address} - $${property.price.toLocaleString()} 🆕`,
            template: 'new-listing',
            data: { firstName: user.firstName, property }
        });
    }

    // ============================================
    // AGENT NOTIFICATIONS
    // ============================================

    async sendNewLeadNotification(
        agent: { email: string; firstName: string },
        lead: { name: string; email: string; phone?: string; message: string; propertyAddress: string }
    ): Promise<void> {
        await this.send({
            to: agent.email,
            subject: `New Lead for ${lead.propertyAddress} 🎯`,
            template: 'new-lead',
            data: { agentName: agent.firstName, lead }
        });
    }

    async sendShowingRequest(
        agent: { email: string; firstName: string },
        showing: { buyerName: string; propertyAddress: string; requestedDate: string; requestedTime: string }
    ): Promise<void> {
        await this.send({
            to: agent.email,
            subject: `Showing Request: ${showing.propertyAddress} 📅`,
            template: 'showing-request',
            data: { agentName: agent.firstName, showing }
        });
    }

    async sendOfferReceived(
        agent: { email: string; firstName: string },
        offer: { buyerName: string; propertyAddress: string; offerAmount: number; expiresAt: string }
    ): Promise<void> {
        await this.send({
            to: agent.email,
            subject: `New Offer: $${offer.offerAmount.toLocaleString()} on ${offer.propertyAddress} 💰`,
            template: 'offer-received',
            data: { agentName: agent.firstName, offer }
        });
    }

    // ============================================
    // TRANSACTION EMAILS
    // ============================================

    async sendTransactionUpdate(
        user: { email: string; firstName: string },
        transaction: { propertyAddress: string; milestone: string; nextStep: string }
    ): Promise<void> {
        await this.send({
            to: user.email,
            subject: `Transaction Update: ${transaction.milestone} ✅`,
            template: 'transaction-update',
            data: { firstName: user.firstName, transaction }
        });
    }

    async sendClosingReminder(
        user: { email: string; firstName: string },
        closing: { propertyAddress: string; closingDate: string; location: string; checklist: string[] }
    ): Promise<void> {
        await this.send({
            to: user.email,
            subject: `Closing Reminder: ${closing.closingDate} 🔑`,
            template: 'closing-reminder',
            data: { firstName: user.firstName, closing }
        });
    }

    // ============================================
    // DOCUMENT EMAILS
    // ============================================

    async sendDocumentShared(
        recipient: { email: string; name: string },
        document: { name: string; sharedBy: string; downloadUrl: string; expiresAt: string }
    ): Promise<void> {
        await this.send({
            to: recipient.email,
            subject: `Document Shared: ${document.name} 📄`,
            template: 'document-shared',
            data: { recipientName: recipient.name, document }
        });
    }

    async sendESignatureRequest(
        recipient: { email: string; name: string },
        document: { name: string; requestedBy: string; signUrl: string; dueDate: string }
    ): Promise<void> {
        await this.send({
            to: recipient.email,
            subject: `Signature Required: ${document.name} ✍️`,
            template: 'esignature-request',
            data: { recipientName: recipient.name, document }
        });
    }

    // ============================================
    // CORE SEND METHOD
    // ============================================

    private async send(options: EmailOptions): Promise<void> {
        const emailId = uuidv4();
        const html = this.renderTemplate(options.template, options.data);

        try {
            const info = await this.transporter.sendMail({
                from: `"${this.fromName}" <${this.fromEmail}>`,
                to: options.to,
                subject: options.subject,
                html,
                text: this.htmlToText(html)
            });

            console.log(`[EMAIL:${emailId}] Sent to ${options.to}: ${options.subject}`);

            // Log for analytics
            await this.logEmail(emailId, options.to, options.template, 'sent');
        } catch (error: any) {
            console.error(`[EMAIL:${emailId}] Failed:`, error.message);
            await this.logEmail(emailId, options.to, options.template, 'failed', error.message);
            throw error;
        }
    }

    // ============================================
    // TEMPLATE RENDERING
    // ============================================

    private renderTemplate(template: string, data: any): string {
        const templates: Record<string, (data: any) => string> = {
            'welcome': (d) => `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2D3748;">Welcome to Rest-iN-U, ${d.firstName}! 🏠</h1>
                    <p>We're excited to have you on board. Rest-iN-U combines ancient wisdom with modern technology to help you find your perfect home.</p>
                    <h3>What makes us different:</h3>
                    <ul>
                        <li>🕉️ <strong>Vastu Analysis</strong> - Energy alignment for your home</li>
                        <li>🌍 <strong>Climate Risk</strong> - 100-year projections for peace of mind</li>
                        <li>📊 <strong>AI-Powered Insights</strong> - Smart property recommendations</li>
                        <li>🔗 <strong>Blockchain Verified</strong> - Transparent property history</li>
                    </ul>
                    <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: #667EEA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Start Exploring</a>
                </div>
            `,

            'password-reset': (d) => `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2D3748;">Reset Your Password</h1>
                    <p>Hi ${d.firstName},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <a href="${d.resetUrl}" style="display: inline-block; background: #667EEA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reset Password</a>
                    <p style="margin-top: 20px; color: #718096; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,

            'saved-search-alert': (d) => `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2D3748;">${d.properties.length} New Matches! 🎉</h1>
                    <p>Hi ${d.firstName}, new properties match your search "${d.searchName}":</p>
                    ${d.properties.slice(0, 3).map((p: any) => `
                        <div style="border: 1px solid #E2E8F0; border-radius: 8px; padding: 16px; margin: 12px 0;">
                            <h3 style="margin: 0;">${p.address}</h3>
                            <p style="color: #667EEA; font-size: 24px; margin: 8px 0;">$${p.price.toLocaleString()}</p>
                            <p style="color: #718096;">${p.beds} beds • ${p.baths} baths • ${p.sqft.toLocaleString()} sqft</p>
                        </div>
                    `).join('')}
                    <a href="${d.viewAllUrl}" style="display: inline-block; background: #667EEA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View All Matches</a>
                </div>
            `,

            'new-lead': (d) => `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2D3748;">New Lead! 🎯</h1>
                    <p>Hi ${d.agentName}, you have a new inquiry:</p>
                    <div style="background: #F7FAFC; border-radius: 8px; padding: 20px; margin: 16px 0;">
                        <p><strong>Property:</strong> ${d.lead.propertyAddress}</p>
                        <p><strong>From:</strong> ${d.lead.name}</p>
                        <p><strong>Email:</strong> ${d.lead.email}</p>
                        ${d.lead.phone ? `<p><strong>Phone:</strong> ${d.lead.phone}</p>` : ''}
                        <p><strong>Message:</strong></p>
                        <p style="font-style: italic;">"${d.lead.message}"</p>
                    </div>
                    <a href="${process.env.FRONTEND_URL}/agent/leads" style="display: inline-block; background: #667EEA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View in Dashboard</a>
                </div>
            `,

            'transaction-update': (d) => `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2D3748;">Transaction Update ✅</h1>
                    <p>Hi ${d.firstName},</p>
                    <p>Great news! Your transaction for <strong>${d.transaction.propertyAddress}</strong> has reached a new milestone:</p>
                    <div style="background: #F0FFF4; border-left: 4px solid #48BB78; padding: 16px; margin: 16px 0;">
                        <h3 style="margin: 0; color: #276749;">✓ ${d.transaction.milestone}</h3>
                    </div>
                    <p><strong>Next Step:</strong> ${d.transaction.nextStep}</p>
                    <a href="${process.env.FRONTEND_URL}/transactions" style="display: inline-block; background: #667EEA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Transaction</a>
                </div>
            `
        };

        const templateFn = templates[template];
        if (!templateFn) {
            return `<p>${JSON.stringify(data)}</p>`;
        }

        return templateFn(data);
    }

    private htmlToText(html: string): string {
        return html
            .replace(/<style[^>]*>.*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // ============================================
    // LOGGING
    // ============================================

    private async logEmail(
        emailId: string,
        to: string,
        template: string,
        status: 'sent' | 'failed',
        error?: string
    ): Promise<void> {
        // Would log to database for analytics
        console.log(`[EMAIL LOG] ${emailId}: ${template} to ${to} - ${status}${error ? ` (${error})` : ''}`);
    }

    // ============================================
    // HEALTH CHECK
    // ============================================

    async healthCheck(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch {
            return false;
        }
    }
}

// Types
interface EmailOptions {
    to: string;
    subject: string;
    template: string;
    data: any;
}

// Export singleton instance
export const emailService = new EmailService();
export default EmailService;

