import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../utils/asyncHandler';
import { redis } from '../utils/redis';

const router = Router();
const prisma = new PrismaClient();

// Stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Subscription tiers configuration
const SUBSCRIPTION_TIERS = {
  FREE: {
    id: 'free',
    name: 'Starter',
    price: 0,
    priceId: null,
    features: {
      maxListings: 3,
      maxLeads: 10,
      maxPhotosPerListing: 10,
      vastuAnalysis: false,
      climateReports: false,
      aiValuation: false,
      prioritySupport: false,
      featuredListings: 0,
      virtualTours: false,
      apiAccess: false,
      teamMembers: 0,
      customBranding: false,
      analyticsAccess: 'basic',
      leadNotifications: 'daily',
      karmicRewards: false,
    },
  },
  BASIC: {
    id: 'basic',
    name: 'Professional',
    price: 49,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || 'price_basic',
    features: {
      maxListings: 25,
      maxLeads: 100,
      maxPhotosPerListing: 30,
      vastuAnalysis: true,
      climateReports: true,
      aiValuation: false,
      prioritySupport: false,
      featuredListings: 2,
      virtualTours: true,
      apiAccess: false,
      teamMembers: 0,
      customBranding: false,
      analyticsAccess: 'standard',
      leadNotifications: 'instant',
      karmicRewards: true,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 149,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium',
    features: {
      maxListings: 100,
      maxLeads: 500,
      maxPhotosPerListing: 50,
      vastuAnalysis: true,
      climateReports: true,
      aiValuation: true,
      prioritySupport: true,
      featuredListings: 10,
      virtualTours: true,
      apiAccess: true,
      teamMembers: 3,
      customBranding: true,
      analyticsAccess: 'advanced',
      leadNotifications: 'instant',
      karmicRewards: true,
    },
  },
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 499,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
    features: {
      maxListings: -1, // Unlimited
      maxLeads: -1,
      maxPhotosPerListing: 100,
      vastuAnalysis: true,
      climateReports: true,
      aiValuation: true,
      prioritySupport: true,
      featuredListings: -1,
      virtualTours: true,
      apiAccess: true,
      teamMembers: -1,
      customBranding: true,
      analyticsAccess: 'enterprise',
      leadNotifications: 'instant',
      karmicRewards: true,
      whiteLabel: true,
      dedicatedSupport: true,
      customIntegrations: true,
    },
  },
};

// Add-ons configuration
const ADD_ONS = {
  EXTRA_LISTINGS: {
    id: 'extra_listings',
    name: 'Extra Listings Pack',
    description: '10 additional property listings',
    price: 19,
    priceId: process.env.STRIPE_ADDON_LISTINGS_PRICE_ID || 'price_addon_listings',
    quantity: 10,
    type: 'listings',
  },
  EXTRA_LEADS: {
    id: 'extra_leads',
    name: 'Extra Leads Pack',
    description: '50 additional lead capacity',
    price: 29,
    priceId: process.env.STRIPE_ADDON_LEADS_PRICE_ID || 'price_addon_leads',
    quantity: 50,
    type: 'leads',
  },
  FEATURED_BOOST: {
    id: 'featured_boost',
    name: 'Featured Listing Boost',
    description: 'Feature one listing for 30 days',
    price: 49,
    priceId: process.env.STRIPE_ADDON_FEATURED_PRICE_ID || 'price_addon_featured',
    duration: 30,
    type: 'featured',
  },
  VASTU_CERTIFICATE: {
    id: 'vastu_certificate',
    name: 'Vastu Compliance Certificate',
    description: 'Official Vastu compliance certificate for a property',
    price: 99,
    priceId: process.env.STRIPE_ADDON_VASTU_CERT_PRICE_ID || 'price_addon_vastu',
    type: 'certificate',
  },
  CLIMATE_DEEP_ANALYSIS: {
    id: 'climate_deep_analysis',
    name: 'Deep Climate Analysis',
    description: '100-year climate projection for a property',
    price: 79,
    priceId: process.env.STRIPE_ADDON_CLIMATE_PRICE_ID || 'price_addon_climate',
    type: 'analysis',
  },
  AI_VALUATION: {
    id: 'ai_valuation',
    name: 'AI Property Valuation',
    description: 'Comprehensive AI-powered property valuation',
    price: 149,
    priceId: process.env.STRIPE_ADDON_VALUATION_PRICE_ID || 'price_addon_valuation',
    type: 'valuation',
  },
};

// ============================================
// SUBSCRIPTION PLANS
// ============================================

// Get available plans
router.get('/plans', asyncHandler(async (req: Request, res: Response) => {
  const plans = Object.values(SUBSCRIPTION_TIERS).map(tier => ({
    id: tier.id,
    name: tier.name,
    price: tier.price,
    priceFormatted: tier.price === 0 ? 'Free' : `$${tier.price}/month`,
    features: tier.features,
    popular: tier.id === 'premium',
  }));

  res.json(plans);
}));

// Get add-ons
router.get('/add-ons', asyncHandler(async (req: Request, res: Response) => {
  const addOns = Object.values(ADD_ONS).map(addon => ({
    id: addon.id,
    name: addon.name,
    description: addon.description,
    price: addon.price,
    priceFormatted: `$${addon.price}`,
  }));

  res.json(addOns);
}));

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

// Get current subscription
router.get('/current', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const agent = await prisma.agent.findUnique({
    where: { userId },
    include: {
      subscription: true,
    },
  });

  if (!agent) {
    return res.status(404).json({ error: 'Agent profile not found' });
  }

  const subscription = agent.subscription;
  const tier = SUBSCRIPTION_TIERS[subscription?.tier || 'FREE'];

  // Get usage stats
  const [listingCount, leadCount] = await Promise.all([
    prisma.property.count({ where: { agentId: userId } }),
    prisma.lead.count({ where: { agentId: agent.id } }),
  ]);

  res.json({
    subscription: subscription ? {
      id: subscription.id,
      tier: subscription.tier,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
    } : null,
    plan: {
      name: tier.name,
      price: tier.price,
      features: tier.features,
    },
    usage: {
      listings: {
        used: listingCount,
        limit: tier.features.maxListings,
        percentage: tier.features.maxListings > 0 
          ? Math.round((listingCount / tier.features.maxListings) * 100)
          : 0,
      },
      leads: {
        used: leadCount,
        limit: tier.features.maxLeads,
        percentage: tier.features.maxLeads > 0
          ? Math.round((leadCount / tier.features.maxLeads) * 100)
          : 0,
      },
    },
  });
}));

// Create checkout session for new subscription
router.post('/checkout', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const schema = z.object({
    planId: z.enum(['basic', 'premium', 'enterprise']),
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
  });

  const { planId, successUrl, cancelUrl } = schema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      agent: {
        include: { subscription: true },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!user.agent) {
    return res.status(400).json({ error: 'Agent profile required' });
  }

  // Check if already subscribed
  if (user.agent.subscription?.status === 'ACTIVE') {
    return res.status(400).json({ 
      error: 'Already has active subscription',
      message: 'Use the portal to manage your subscription',
    });
  }

  const tier = SUBSCRIPTION_TIERS[planId.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS];
  if (!tier || !tier.priceId) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  // Create or retrieve Stripe customer
  let stripeCustomerId = user.stripeCustomerId;
  
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: {
        userId: user.id,
        agentId: user.agent.id,
      },
    });
    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: tier.priceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    subscription_data: {
      metadata: {
        userId: user.id,
        agentId: user.agent.id,
        tier: planId,
      },
      trial_period_days: 14, // 14-day free trial
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
  });

  res.json({
    sessionId: session.id,
    url: session.url,
  });
}));

// Create portal session for subscription management
router.post('/portal', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const schema = z.object({
    returnUrl: z.string().url(),
  });

  const { returnUrl } = schema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.stripeCustomerId) {
    return res.status(400).json({ error: 'No billing account found' });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl,
  });

  res.json({
    url: session.url,
  });
}));

// Upgrade/downgrade subscription
router.post('/change-plan', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const schema = z.object({
    newPlanId: z.enum(['free', 'basic', 'premium', 'enterprise']),
  });

  const { newPlanId } = schema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      agent: {
        include: { subscription: true },
      },
    },
  });

  if (!user?.agent?.subscription) {
    return res.status(400).json({ error: 'No active subscription' });
  }

  const subscription = user.agent.subscription;

  // Handle downgrade to free
  if (newPlanId === 'free') {
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId!);
    
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        cancelAtPeriodEnd: true,
      },
    });

    return res.json({
      message: 'Subscription will be canceled at end of billing period',
      effectiveDate: subscription.currentPeriodEnd,
    });
  }

  const newTier = SUBSCRIPTION_TIERS[newPlanId.toUpperCase() as keyof typeof SUBSCRIPTION_TIERS];
  if (!newTier?.priceId) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  // Get current Stripe subscription
  const stripeSubscription = await stripe.subscriptions.retrieve(
    subscription.stripeSubscriptionId!
  );

  // Update subscription
  const updatedSubscription = await stripe.subscriptions.update(
    subscription.stripeSubscriptionId!,
    {
      items: [
        {
          id: stripeSubscription.items.data[0].id,
          price: newTier.priceId,
        },
      ],
      proration_behavior: 'create_prorations',
      metadata: {
        tier: newPlanId,
      },
    }
  );

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      tier: newPlanId.toUpperCase(),
    },
  });

  res.json({
    message: `Subscription updated to ${newTier.name}`,
    subscription: {
      tier: newPlanId,
      nextBillingDate: new Date(updatedSubscription.current_period_end * 1000),
    },
  });
}));

// Cancel subscription
router.post('/cancel', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const schema = z.object({
    cancelImmediately: z.boolean().optional().default(false),
    reason: z.string().max(500).optional(),
  });

  const { cancelImmediately, reason } = schema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      agent: {
        include: { subscription: true },
      },
    },
  });

  if (!user?.agent?.subscription) {
    return res.status(400).json({ error: 'No active subscription' });
  }

  const subscription = user.agent.subscription;

  if (cancelImmediately) {
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId!);
    
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        cancelReason: reason,
      },
    });

    return res.json({
      message: 'Subscription canceled immediately',
      effectiveDate: new Date(),
    });
  } else {
    await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
      cancel_at_period_end: true,
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true,
        cancelReason: reason,
      },
    });

    return res.json({
      message: 'Subscription will be canceled at end of billing period',
      effectiveDate: subscription.currentPeriodEnd,
    });
  }
}));

// Resume canceled subscription
router.post('/resume', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      agent: {
        include: { subscription: true },
      },
    },
  });

  if (!user?.agent?.subscription) {
    return res.status(400).json({ error: 'No subscription found' });
  }

  const subscription = user.agent.subscription;

  if (!subscription.cancelAtPeriodEnd) {
    return res.status(400).json({ error: 'Subscription is not scheduled for cancellation' });
  }

  await stripe.subscriptions.update(subscription.stripeSubscriptionId!, {
    cancel_at_period_end: false,
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: false,
      cancelReason: null,
    },
  });

  res.json({
    message: 'Subscription resumed successfully',
  });
}));

// ============================================
// ADD-ONS PURCHASE
// ============================================

// Purchase add-on
router.post('/add-ons/purchase', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const schema = z.object({
    addOnId: z.enum(['extra_listings', 'extra_leads', 'featured_boost', 'vastu_certificate', 'climate_deep_analysis', 'ai_valuation']),
    propertyId: z.string().optional(), // For property-specific add-ons
    successUrl: z.string().url(),
    cancelUrl: z.string().url(),
  });

  const { addOnId, propertyId, successUrl, cancelUrl } = schema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { agent: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const addOn = ADD_ONS[addOnId.toUpperCase() as keyof typeof ADD_ONS];
  if (!addOn) {
    return res.status(400).json({ error: 'Invalid add-on' });
  }

  // Create or retrieve Stripe customer
  let stripeCustomerId = user.stripeCustomerId;
  
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      metadata: { userId: user.id },
    });
    stripeCustomerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  // Create checkout session for one-time purchase
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: addOn.priceId,
        quantity: 1,
      },
    ],
    success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    metadata: {
      userId: user.id,
      agentId: user.agent?.id,
      addOnId: addOn.id,
      propertyId: propertyId || '',
      type: 'addon',
    },
  });

  res.json({
    sessionId: session.id,
    url: session.url,
  });
}));

// ============================================
// INVOICES & BILLING HISTORY
// ============================================

// Get billing history
router.get('/invoices', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { limit = 10 } = req.query;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.stripeCustomerId) {
    return res.json({ invoices: [] });
  }

  const invoices = await stripe.invoices.list({
    customer: user.stripeCustomerId,
    limit: Number(limit),
  });

  const formattedInvoices = invoices.data.map(invoice => ({
    id: invoice.id,
    number: invoice.number,
    status: invoice.status,
    amount: invoice.amount_due / 100,
    amountPaid: invoice.amount_paid / 100,
    currency: invoice.currency.toUpperCase(),
    created: new Date(invoice.created * 1000),
    dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
    paidAt: invoice.status_transitions?.paid_at 
      ? new Date(invoice.status_transitions.paid_at * 1000) 
      : null,
    invoiceUrl: invoice.hosted_invoice_url,
    pdfUrl: invoice.invoice_pdf,
    description: invoice.lines.data[0]?.description,
  }));

  res.json({ invoices: formattedInvoices });
}));

// Get upcoming invoice
router.get('/invoices/upcoming', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      agent: {
        include: { subscription: true },
      },
    },
  });

  if (!user?.stripeCustomerId || !user.agent?.subscription?.stripeSubscriptionId) {
    return res.json({ upcomingInvoice: null });
  }

  try {
    const upcomingInvoice = await stripe.invoices.retrieveUpcoming({
      customer: user.stripeCustomerId,
      subscription: user.agent.subscription.stripeSubscriptionId,
    });

    res.json({
      upcomingInvoice: {
        amount: upcomingInvoice.amount_due / 100,
        currency: upcomingInvoice.currency.toUpperCase(),
        dueDate: upcomingInvoice.next_payment_attempt
          ? new Date(upcomingInvoice.next_payment_attempt * 1000)
          : null,
        lineItems: upcomingInvoice.lines.data.map(item => ({
          description: item.description,
          amount: item.amount / 100,
          period: item.period,
        })),
      },
    });
  } catch (err: any) {
    if (err.code === 'invoice_upcoming_none') {
      return res.json({ upcomingInvoice: null });
    }
    throw err;
  }
}));

// ============================================
// PAYMENT METHODS
// ============================================

// Get payment methods
router.get('/payment-methods', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.stripeCustomerId) {
    return res.json({ paymentMethods: [] });
  }

  const paymentMethods = await stripe.paymentMethods.list({
    customer: user.stripeCustomerId,
    type: 'card',
  });

  // Get default payment method
  const customer = await stripe.customers.retrieve(user.stripeCustomerId);
  const defaultPaymentMethodId = typeof customer !== 'string' && !customer.deleted
    ? customer.invoice_settings.default_payment_method
    : null;

  const formattedMethods = paymentMethods.data.map(pm => ({
    id: pm.id,
    brand: pm.card?.brand,
    last4: pm.card?.last4,
    expMonth: pm.card?.exp_month,
    expYear: pm.card?.exp_year,
    isDefault: pm.id === defaultPaymentMethodId,
  }));

  res.json({ paymentMethods: formattedMethods });
}));

// Add payment method
router.post('/payment-methods', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const schema = z.object({
    paymentMethodId: z.string(),
    setAsDefault: z.boolean().optional().default(true),
  });

  const { paymentMethodId, setAsDefault } = schema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.stripeCustomerId) {
    return res.status(400).json({ error: 'No billing account found' });
  }

  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: user.stripeCustomerId,
  });

  // Set as default if requested
  if (setAsDefault) {
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }

  res.json({ message: 'Payment method added successfully' });
}));

// Remove payment method
router.delete('/payment-methods/:paymentMethodId', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { paymentMethodId } = req.params;
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.stripeCustomerId) {
    return res.status(400).json({ error: 'No billing account found' });
  }

  // Verify payment method belongs to customer
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
  if (paymentMethod.customer !== user.stripeCustomerId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  await stripe.paymentMethods.detach(paymentMethodId);

  res.json({ message: 'Payment method removed successfully' });
}));

// Set default payment method
router.put('/payment-methods/:paymentMethodId/default', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { paymentMethodId } = req.params;
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user?.stripeCustomerId) {
    return res.status(400).json({ error: 'No billing account found' });
  }

  await stripe.customers.update(user.stripeCustomerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  res.json({ message: 'Default payment method updated' });
}));

// ============================================
// COUPONS & PROMOTIONS
// ============================================

// Validate coupon
router.post('/coupons/validate', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const schema = z.object({
    code: z.string(),
  });

  const { code } = schema.parse(req.body);

  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
    });

    if (promotionCodes.data.length === 0) {
      return res.status(404).json({ 
        valid: false, 
        error: 'Invalid or expired coupon code' 
      });
    }

    const promotionCode = promotionCodes.data[0];
    const coupon = await stripe.coupons.retrieve(promotionCode.coupon.id);

    res.json({
      valid: true,
      coupon: {
        id: coupon.id,
        name: coupon.name,
        percentOff: coupon.percent_off,
        amountOff: coupon.amount_off ? coupon.amount_off / 100 : null,
        duration: coupon.duration,
        durationInMonths: coupon.duration_in_months,
      },
    });
  } catch (err) {
    return res.status(404).json({ 
      valid: false, 
      error: 'Invalid coupon code' 
    });
  }
}));

// ============================================
// USAGE TRACKING
// ============================================

// Get feature usage
router.get('/usage', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      agent: {
        include: { subscription: true },
      },
    },
  });

  if (!user?.agent) {
    return res.status(404).json({ error: 'Agent profile not found' });
  }

  const tier = SUBSCRIPTION_TIERS[user.agent.subscription?.tier || 'FREE'];

  // Get current usage
  const [
    listingCount,
    leadCount,
    featuredCount,
    vastuAnalysisCount,
    climateReportCount,
    aiValuationCount,
  ] = await Promise.all([
    prisma.property.count({ where: { agentId: userId } }),
    prisma.lead.count({ where: { agentId: user.agent.id } }),
    prisma.property.count({ 
      where: { 
        agentId: userId,
        isFeatured: true,
      } 
    }),
    prisma.vastuAnalysis.count({
      where: {
        property: { agentId: userId },
        createdAt: {
          gte: new Date(new Date().setDate(1)), // This month
        },
      },
    }),
    prisma.climateAnalysis.count({
      where: {
        property: { agentId: userId },
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    }),
    prisma.propertyValuation.count({
      where: {
        property: { agentId: userId },
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    }),
  ]);

  res.json({
    tier: tier.name,
    usage: {
      listings: {
        used: listingCount,
        limit: tier.features.maxListings,
        unlimited: tier.features.maxListings === -1,
      },
      leads: {
        used: leadCount,
        limit: tier.features.maxLeads,
        unlimited: tier.features.maxLeads === -1,
      },
      featuredListings: {
        used: featuredCount,
        limit: tier.features.featuredListings,
        unlimited: tier.features.featuredListings === -1,
      },
      vastuAnalysis: {
        available: tier.features.vastuAnalysis,
        usedThisMonth: vastuAnalysisCount,
      },
      climateReports: {
        available: tier.features.climateReports,
        usedThisMonth: climateReportCount,
      },
      aiValuation: {
        available: tier.features.aiValuation,
        usedThisMonth: aiValuationCount,
      },
    },
    resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
  });
}));

// Check feature access
router.get('/access/:feature', authenticate, asyncHandler(async (req: Request, res: Response) => {
  const { feature } = req.params;
  const userId = req.user!.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      agent: {
        include: { subscription: true },
      },
    },
  });

  if (!user?.agent) {
    return res.status(404).json({ error: 'Agent profile not found' });
  }

  const tier = SUBSCRIPTION_TIERS[user.agent.subscription?.tier || 'FREE'];
  const features = tier.features as Record<string, any>;

  if (!(feature in features)) {
    return res.status(400).json({ error: 'Unknown feature' });
  }

  const featureValue = features[feature];
  let hasAccess = false;
  let reason = '';

  if (typeof featureValue === 'boolean') {
    hasAccess = featureValue;
    reason = hasAccess ? '' : `Upgrade to access ${feature}`;
  } else if (typeof featureValue === 'number') {
    if (featureValue === -1) {
      hasAccess = true;
    } else {
      // Check current usage
      let currentUsage = 0;
      if (feature === 'maxListings') {
        currentUsage = await prisma.property.count({ where: { agentId: userId } });
      } else if (feature === 'maxLeads') {
        currentUsage = await prisma.lead.count({ where: { agentId: user.agent.id } });
      }
      hasAccess = currentUsage < featureValue;
      reason = hasAccess ? '' : `Limit reached (${currentUsage}/${featureValue})`;
    }
  } else {
    hasAccess = true;
  }

  res.json({
    feature,
    hasAccess,
    reason,
    value: featureValue,
    upgradeTier: hasAccess ? null : getNextTierWithFeature(feature, tier.id),
  });
}));

// Helper function to find next tier with feature
function getNextTierWithFeature(feature: string, currentTierId: string): string | null {
  const tierOrder = ['free', 'basic', 'premium', 'enterprise'];
  const currentIndex = tierOrder.indexOf(currentTierId);
  
  for (let i = currentIndex + 1; i < tierOrder.length; i++) {
    const tier = SUBSCRIPTION_TIERS[tierOrder[i].toUpperCase() as keyof typeof SUBSCRIPTION_TIERS];
    const features = tier.features as Record<string, any>;
    
    if (features[feature] === true || features[feature] === -1 || 
        (typeof features[feature] === 'number' && features[feature] > 0)) {
      return tierOrder[i];
    }
  }
  
  return null;
}

export default router;
