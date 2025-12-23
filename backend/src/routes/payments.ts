import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Stripe configuration (simulated - in production, use Stripe SDK)
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_...';

// ============================================
// SUBSCRIPTION PLANS
// ============================================
const SUBSCRIPTION_PLANS = {
    dharma: {
        id: 'plan_dharma',
        name: 'REST-iN-U',
        price: 499, // cents = $4.99/month
        priceYearly: 4990, // $49.90/year
        features: [
            'Up to 10 listings',
            'Basic analytics',
            'Email support',
            'Vastu basic reports',
        ]
    },
    karma: {
        id: 'plan_karma',
        name: 'Karma',
        price: 1499, // $14.99/month
        priceYearly: 14990, // $149.90/year
        features: [
            'Unlimited listings',
            'Advanced analytics',
            'Priority support',
            'AI lead qualification',
            'Vastu detailed reports',
            'Climate risk reports',
            'Blockchain verification',
        ]
    },
    moksha: {
        id: 'plan_moksha',
        name: 'Moksha',
        price: 4999, // $49.99/month
        priceYearly: 49990, // $499.90/year
        features: [
            'Everything in Karma',
            'AI negotiation agent',
            'White-label branding',
            'API access',
            'Dedicated account manager',
            'Custom integrations',
        ]
    }
};

// ============================================
// GET SUBSCRIPTION PLANS
// ============================================
router.get('/plans', (req: Request, res: Response) => {
    res.json({ plans: SUBSCRIPTION_PLANS });
});

// ============================================
// CREATE CHECKOUT SESSION
// ============================================
const checkoutSchema = z.object({
    planId: z.enum(['dharma', 'karma', 'moksha']),
    billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
});

router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { planId, billingCycle, successUrl, cancelUrl } = checkoutSchema.parse(req.body);
        const plan = SUBSCRIPTION_PLANS[planId];

        const amount = billingCycle === 'yearly' ? plan.priceYearly : plan.price;

        // In production, create Stripe checkout session:
        // const session = await stripe.checkout.sessions.create({...})

        // Simulated checkout session
        const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store pending subscription
        await prisma.subscription.create({
            data: {
                userId: req.userId!,
                planId: plan.id,
                planName: plan.name,
                status: 'PENDING',
                billingCycle,
                amount,
                stripeSessionId: sessionId,
            }
        });

        res.json({
            sessionId,
            checkoutUrl: `https://checkout.stripe.com/pay/${sessionId}`,
            plan: plan.name,
            amount: amount / 100, // Convert to dollars
            billingCycle,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Checkout error:', error);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// ============================================
// STRIPE WEBHOOK (Payment confirmation)
// ============================================
router.post('/webhook', async (req: Request, res: Response) => {
    try {
        // In production, verify Stripe signature
        // const sig = req.headers['stripe-signature'];
        // const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

        const event = req.body as {
            type: string;
            data: {
                object: {
                    id: string;
                    customer?: string;
                    subscription?: string;
                    metadata?: {
                        userId?: string;
                        planId?: string;
                    };
                };
            };
        };

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;

                // Activate subscription
                await prisma.subscription.updateMany({
                    where: { stripeSessionId: session.id },
                    data: {
                        status: 'ACTIVE',
                        stripeCustomerId: session.customer,
                        stripeSubscriptionId: session.subscription,
                        startDate: new Date(),
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                    }
                });
                break;
            }

            case 'invoice.payment_succeeded': {
                // Renewal payment successful
                const invoice = event.data.object;
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: invoice.subscription },
                    data: {
                        status: 'ACTIVE',
                        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    }
                });
                break;
            }

            case 'invoice.payment_failed': {
                // Payment failed - mark subscription as past due
                const invoice = event.data.object;
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: invoice.subscription },
                    data: { status: 'PAST_DUE' }
                });
                break;
            }

            case 'customer.subscription.deleted': {
                // Subscription cancelled
                const subscription = event.data.object;
                await prisma.subscription.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: { status: 'CANCELLED' }
                });
                break;
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({ error: 'Webhook processing failed' });
    }
});

// ============================================
// GET USER'S SUBSCRIPTION
// ============================================
router.get('/subscription', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.userId,
                status: { in: ['ACTIVE', 'PAST_DUE'] }
            },
            orderBy: { createdAt: 'desc' }
        });

        if (!subscription) {
            return res.json({
                subscription: null,
                plan: 'free',
                features: ['Up to 3 listings', 'Basic search', 'Community support']
            });
        }

        const plan = Object.values(SUBSCRIPTION_PLANS).find(p => p.id === subscription.planId);

        res.json({
            subscription: {
                id: subscription.id,
                status: subscription.status,
                planName: subscription.planName,
                billingCycle: subscription.billingCycle,
                startDate: subscription.startDate,
                endDate: subscription.endDate,
                amount: subscription.amount / 100,
            },
            plan: plan?.name || 'Unknown',
            features: plan?.features || []
        });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: 'Failed to fetch subscription' });
    }
});

// ============================================
// CANCEL SUBSCRIPTION
// ============================================
router.post('/cancel', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: req.userId,
                status: 'ACTIVE'
            }
        });

        if (!subscription) {
            return res.status(404).json({ error: 'No active subscription found' });
        }

        // In production, cancel via Stripe API
        // await stripe.subscriptions.del(subscription.stripeSubscriptionId);

        await prisma.subscription.update({
            where: { id: subscription.id },
            data: {
                status: 'CANCELLED',
                cancelledAt: new Date()
            }
        });

        res.json({
            message: 'Subscription cancelled successfully',
            effectiveUntil: subscription.endDate
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
});

// ============================================
// ONE-TIME PAYMENTS (Property Certification, Reports, etc.)
// ============================================
const paymentSchema = z.object({
    productType: z.enum([
        'vastu_report',
        'climate_report',
        'blockchain_cert',
        'ai_valuation',
        'iot_installation'
    ]),
    propertyId: z.string().uuid().optional(),
    amount: z.number().positive().optional(),
});

const PRODUCT_PRICES: Record<string, number> = {
    vastu_report: 2999, // $29.99
    climate_report: 4999, // $49.99
    blockchain_cert: 9999, // $99.99
    ai_valuation: 2999, // $29.99
    iot_installation: 499900, // $4,999.00
};

router.post('/pay', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { productType, propertyId } = paymentSchema.parse(req.body);
        const amount = PRODUCT_PRICES[productType];

        // Create payment intent
        const paymentId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Store payment record
        await prisma.payment.create({
            data: {
                userId: req.userId!,
                productType,
                propertyId,
                amount,
                status: 'PENDING',
                stripePaymentId: paymentId,
            }
        });

        res.json({
            paymentId,
            clientSecret: `${paymentId}_secret_${Math.random().toString(36).substr(2, 16)}`,
            amount: amount / 100,
            productType,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Payment error:', error);
        res.status(500).json({ error: 'Failed to create payment' });
    }
});

// ============================================
// CONFIRM PAYMENT (After client-side processing)
// ============================================
router.post('/confirm', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { paymentId } = z.object({ paymentId: z.string() }).parse(req.body);

        const payment = await prisma.payment.findFirst({
            where: {
                stripePaymentId: paymentId,
                userId: req.userId
            }
        });

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // In production, verify payment with Stripe
        // const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

        await prisma.payment.update({
            where: { id: payment.id },
            data: {
                status: 'COMPLETED',
                completedAt: new Date()
            }
        });

        res.json({
            message: 'Payment confirmed',
            productType: payment.productType,
            receipt: `https://receipts.stripe.com/${paymentId}`
        });
    } catch (error) {
        console.error('Confirm payment error:', error);
        res.status(500).json({ error: 'Failed to confirm payment' });
    }
});

export default router;

