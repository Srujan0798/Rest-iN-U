import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';

// Payment Service for Stripe Integration
class PaymentService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_xxx', {
            apiVersion: '2023-10-16'
        });
    }

    // ============================================
    // CUSTOMER MANAGEMENT
    // ============================================

    async createCustomer(user: { email: string; name: string; userId: string }): Promise<Stripe.Customer> {
        return this.stripe.customers.create({
            email: user.email,
            name: user.name,
            metadata: { userId: user.userId }
        });
    }

    async getOrCreateCustomer(user: { email: string; name: string; userId: string; stripeCustomerId?: string }): Promise<Stripe.Customer> {
        if (user.stripeCustomerId) {
            return this.stripe.customers.retrieve(user.stripeCustomerId) as Promise<Stripe.Customer>;
        }
        return this.createCustomer(user);
    }

    // ============================================
    // SUBSCRIPTION MANAGEMENT (Agent Tiers)
    // ============================================

    async createSubscription(
        customerId: string,
        priceId: string,
        metadata?: Record<string, string>
    ): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
            metadata
        });
    }

    async cancelSubscription(subscriptionId: string, immediately: boolean = false): Promise<Stripe.Subscription> {
        if (immediately) {
            return this.stripe.subscriptions.cancel(subscriptionId);
        }
        return this.stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });
    }

    async upgradeSubscription(subscriptionId: string, newPriceId: string): Promise<Stripe.Subscription> {
        const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
        return this.stripe.subscriptions.update(subscriptionId, {
            items: [{
                id: subscription.items.data[0].id,
                price: newPriceId
            }],
            proration_behavior: 'create_prorations'
        });
    }

    async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
        return this.stripe.subscriptions.retrieve(subscriptionId);
    }

    // ============================================
    // ONE-TIME PAYMENTS
    // ============================================

    async createPaymentIntent(
        amount: number, // in cents
        currency: string = 'usd',
        metadata?: Record<string, string>
    ): Promise<Stripe.PaymentIntent> {
        return this.stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: { enabled: true },
            metadata
        });
    }

    async capturePayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        return this.stripe.paymentIntents.capture(paymentIntentId);
    }

    async refundPayment(paymentIntentId: string, amount?: number): Promise<Stripe.Refund> {
        return this.stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount
        });
    }

    // ============================================
    // CHECKOUT SESSIONS
    // ============================================

    async createCheckoutSession(options: {
        customerId: string;
        priceId?: string;
        amount?: number;
        mode: 'subscription' | 'payment';
        successUrl: string;
        cancelUrl: string;
        metadata?: Record<string, string>;
    }): Promise<Stripe.Checkout.Session> {
        const sessionConfig: Stripe.Checkout.SessionCreateParams = {
            customer: options.customerId,
            mode: options.mode,
            success_url: options.successUrl,
            cancel_url: options.cancelUrl,
            metadata: options.metadata,
            line_items: options.priceId ? [{ price: options.priceId, quantity: 1 }] : undefined
        };

        if (options.amount && !options.priceId) {
            sessionConfig.line_items = [{
                price_data: {
                    currency: 'usd',
                    unit_amount: options.amount,
                    product_data: { name: 'Custom Payment' }
                },
                quantity: 1
            }];
        }

        return this.stripe.checkout.sessions.create(sessionConfig);
    }

    // ============================================
    // CONNECT (For Agent Payouts)
    // ============================================

    async createConnectAccount(agent: { email: string; userId: string }): Promise<Stripe.Account> {
        return this.stripe.accounts.create({
            type: 'express',
            email: agent.email,
            metadata: { userId: agent.userId },
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            }
        });
    }

    async createConnectAccountLink(accountId: string, refreshUrl: string, returnUrl: string): Promise<Stripe.AccountLink> {
        return this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: refreshUrl,
            return_url: returnUrl,
            type: 'account_onboarding'
        });
    }

    async createTransfer(
        amount: number,
        destinationAccountId: string,
        description?: string
    ): Promise<Stripe.Transfer> {
        return this.stripe.transfers.create({
            amount,
            currency: 'usd',
            destination: destinationAccountId,
            description
        });
    }

    // ============================================
    // INVOICES
    // ============================================

    async createInvoice(customerId: string, items: Array<{ description: string; amount: number }>): Promise<Stripe.Invoice> {
        // Add invoice items
        for (const item of items) {
            await this.stripe.invoiceItems.create({
                customer: customerId,
                amount: item.amount,
                currency: 'usd',
                description: item.description
            });
        }

        // Create and finalize invoice
        const invoice = await this.stripe.invoices.create({
            customer: customerId,
            auto_advance: true
        });

        return this.stripe.invoices.finalizeInvoice(invoice.id);
    }

    async getInvoices(customerId: string): Promise<Stripe.Invoice[]> {
        const invoices = await this.stripe.invoices.list({ customer: customerId });
        return invoices.data;
    }

    // ============================================
    // PAYMENT METHODS
    // ============================================

    async attachPaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.PaymentMethod> {
        return this.stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });
    }

    async setDefaultPaymentMethod(customerId: string, paymentMethodId: string): Promise<Stripe.Customer> {
        return this.stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId }
        });
    }

    async listPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
        const methods = await this.stripe.paymentMethods.list({
            customer: customerId,
            type: 'card'
        });
        return methods.data;
    }

    // ============================================
    // WEBHOOK HANDLING
    // ============================================

    constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
        return this.stripe.webhooks.constructEvent(
            payload,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET || ''
        );
    }

    async handleWebhookEvent(event: Stripe.Event): Promise<{ handled: boolean; action?: string }> {
        switch (event.type) {
            case 'checkout.session.completed':
                return this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                return this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);

            case 'customer.subscription.deleted':
                return this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);

            case 'invoice.paid':
                return this.handleInvoicePaid(event.data.object as Stripe.Invoice);

            case 'invoice.payment_failed':
                return this.handlePaymentFailed(event.data.object as Stripe.Invoice);

            case 'payment_intent.succeeded':
                return this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);

            default:
                console.log(`[STRIPE] Unhandled event type: ${event.type}`);
                return { handled: false };
        }
    }

    private async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<{ handled: boolean; action: string }> {
        console.log(`[STRIPE] Checkout completed: ${session.id}`);
        // Update user's subscription status in database
        return { handled: true, action: 'checkout_completed' };
    }

    private async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<{ handled: boolean; action: string }> {
        console.log(`[STRIPE] Subscription updated: ${subscription.id} - Status: ${subscription.status}`);
        // Update subscription in database
        return { handled: true, action: 'subscription_updated' };
    }

    private async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<{ handled: boolean; action: string }> {
        console.log(`[STRIPE] Subscription deleted: ${subscription.id}`);
        // Downgrade user to free tier
        return { handled: true, action: 'subscription_deleted' };
    }

    private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<{ handled: boolean; action: string }> {
        console.log(`[STRIPE] Invoice paid: ${invoice.id}`);
        // Record payment in database
        return { handled: true, action: 'invoice_paid' };
    }

    private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<{ handled: boolean; action: string }> {
        console.log(`[STRIPE] Payment failed: ${invoice.id}`);
        // Send dunning email, update subscription status
        return { handled: true, action: 'payment_failed' };
    }

    private async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<{ handled: boolean; action: string }> {
        console.log(`[STRIPE] Payment succeeded: ${paymentIntent.id}`);
        // Process the successful payment
        return { handled: true, action: 'payment_succeeded' };
    }

    // ============================================
    // PRICING CONFIGURATION
    // ============================================

    static readonly SUBSCRIPTION_PRICES = {
        FREE: 'price_free',
        DHARMA: process.env.STRIPE_PRICE_DHARMA || 'price_dharma_monthly',
        KARMA: process.env.STRIPE_PRICE_KARMA || 'price_karma_monthly'
    };

    static readonly SUBSCRIPTION_FEATURES = {
        FREE: {
            name: 'Free',
            price: 0,
            features: ['5 listings', 'Basic search', 'Email support']
        },
        DHARMA: {
            name: 'Dharma',
            price: 49,
            features: ['25 listings', 'Advanced search', 'Vastu analysis', 'Lead scoring', 'Priority support']
        },
        KARMA: {
            name: 'Karma',
            price: 99,
            features: ['Unlimited listings', 'All features', 'AI insights', 'API access', 'Dedicated support']
        }
    };
}

// Export singleton instance
export const paymentService = new PaymentService();
export default PaymentService;
