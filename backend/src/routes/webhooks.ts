import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler';
import { redis } from '../utils/redis';

const router = Router();
const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// ============================================
// STRIPE WEBHOOKS
// ============================================

router.post('/stripe', asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body, // Raw body
      sig,
      webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}));

// Stripe webhook handlers
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, agentId, tier, addOnId, propertyId, type } = session.metadata || {};

  if (type === 'addon') {
    // Handle add-on purchase
    await processAddOnPurchase(userId!, agentId!, addOnId!, propertyId);
    return;
  }

  // Handle subscription checkout
  if (!agentId || !tier) return;

  // Subscription will be handled by customer.subscription.created
  console.log(`Checkout completed for agent ${agentId}, tier ${tier}`);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const { userId, agentId, tier } = subscription.metadata;

  if (!agentId || !tier) return;

  // Check if subscription record already exists
  const existing = await prisma.subscription.findFirst({
    where: { agentId },
  });

  if (existing) {
    await prisma.subscription.update({
      where: { id: existing.id },
      data: {
        tier: tier.toUpperCase(),
        status: 'ACTIVE',
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: false,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        agentId,
        tier: tier.toUpperCase(),
        status: 'ACTIVE',
        stripeSubscriptionId: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }

  // Create notification
  if (userId) {
    await createNotification(userId, 'SYSTEM', 'Subscription Activated', 
      `Your ${tier} subscription is now active. Enjoy all the premium features!`);
  }

  // Update agent tier
  await prisma.agent.update({
    where: { id: agentId },
    data: { tier: tier.toUpperCase() },
  });
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { agent: { include: { user: true } } },
  });

  if (!sub) return;

  const status = mapStripeStatus(subscription.status);

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status,
      tier: subscription.metadata.tier?.toUpperCase() || sub.tier,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  // Notify if tier changed
  if (subscription.metadata.tier && subscription.metadata.tier.toUpperCase() !== sub.tier) {
    await createNotification(
      sub.agent.userId,
      'SYSTEM',
      'Subscription Updated',
      `Your subscription has been updated to ${subscription.metadata.tier}`
    );
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { agent: { include: { user: true } } },
  });

  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: {
      status: 'CANCELED',
      canceledAt: new Date(),
    },
  });

  // Downgrade agent to free tier
  await prisma.agent.update({
    where: { id: sub.agentId },
    data: { tier: 'FREE' },
  });

  await createNotification(
    sub.agent.userId,
    'SYSTEM',
    'Subscription Canceled',
    'Your subscription has been canceled. You have been moved to the free tier.'
  );
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  if (!subscriptionId) return;

  const sub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (sub) {
    await prisma.subscription.update({
      where: { id: sub.id },
      data: { status: 'ACTIVE' },
    });
  }

  // Log payment
  await prisma.paymentLog.create({
    data: {
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid / 100,
      currency: invoice.currency.toUpperCase(),
      status: 'PAID',
      paidAt: new Date(),
      subscriptionId: sub?.id,
    },
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string;
  
  if (!subscriptionId) return;

  const sub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    include: { agent: { include: { user: true } } },
  });

  if (!sub) return;

  await prisma.subscription.update({
    where: { id: sub.id },
    data: { status: 'PAST_DUE' },
  });

  await createNotification(
    sub.agent.userId,
    'SYSTEM',
    'Payment Failed',
    'Your subscription payment failed. Please update your payment method to avoid service interruption.',
    { priority: 'HIGH', actionUrl: '/dashboard/billing' }
  );
}

async function handleTrialWillEnd(subscription: Stripe.Subscription) {
  const sub = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscription.id },
    include: { agent: { include: { user: true } } },
  });

  if (!sub) return;

  const trialEnd = new Date(subscription.trial_end! * 1000);
  const daysLeft = Math.ceil((trialEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  await createNotification(
    sub.agent.userId,
    'SYSTEM',
    'Trial Ending Soon',
    `Your free trial ends in ${daysLeft} days. Add a payment method to continue enjoying premium features.`,
    { priority: 'HIGH', actionUrl: '/dashboard/billing' }
  );
}

async function handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment succeeded:', paymentIntent.id);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('Payment failed:', paymentIntent.id);
}

async function processAddOnPurchase(userId: string, agentId: string, addOnId: string, propertyId?: string) {
  // Record the purchase
  await prisma.addOnPurchase.create({
    data: {
      agentId,
      addOnType: addOnId,
      propertyId: propertyId || null,
      purchasedAt: new Date(),
      expiresAt: addOnId === 'featured_boost' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : null,
    },
  });

  // Apply add-on effects
  switch (addOnId) {
    case 'extra_listings':
      await prisma.agent.update({
        where: { id: agentId },
        data: { extraListingsQuota: { increment: 10 } },
      });
      break;

    case 'extra_leads':
      await prisma.agent.update({
        where: { id: agentId },
        data: { extraLeadsQuota: { increment: 50 } },
      });
      break;

    case 'featured_boost':
      if (propertyId) {
        await prisma.property.update({
          where: { id: propertyId },
          data: {
            isFeatured: true,
            featuredUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
      break;
  }

  await createNotification(userId, 'SYSTEM', 'Add-On Purchased',
    `Your ${addOnId.replace(/_/g, ' ')} has been activated.`);
}

function mapStripeStatus(status: string): string {
  const statusMap: Record<string, string> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    unpaid: 'UNPAID',
    trialing: 'TRIALING',
    incomplete: 'INCOMPLETE',
    incomplete_expired: 'EXPIRED',
  };
  return statusMap[status] || 'UNKNOWN';
}

// ============================================
// MLS FEED WEBHOOKS
// ============================================

// Signature verification for MLS webhook
function verifyMLSSignature(payload: string, signature: string, secret: string): boolean {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(computedSignature)
  );
}

router.post('/mls', asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers['x-mls-signature'] as string;
  const mlsSecret = process.env.MLS_WEBHOOK_SECRET!;

  // Verify signature
  if (!verifyMLSSignature(JSON.stringify(req.body), signature, mlsSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const eventSchema = z.object({
    eventType: z.enum(['listing.created', 'listing.updated', 'listing.deleted', 'listing.status_changed', 'listing.price_changed']),
    listingId: z.string(),
    mlsNumber: z.string(),
    data: z.any(),
    timestamp: z.string(),
  });

  const event = eventSchema.parse(req.body);

  try {
    switch (event.eventType) {
      case 'listing.created':
        await handleMLSListingCreated(event);
        break;

      case 'listing.updated':
        await handleMLSListingUpdated(event);
        break;

      case 'listing.deleted':
        await handleMLSListingDeleted(event);
        break;

      case 'listing.status_changed':
        await handleMLSStatusChanged(event);
        break;

      case 'listing.price_changed':
        await handleMLSPriceChanged(event);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('MLS webhook error:', err);
    res.status(500).json({ error: 'Processing failed' });
  }
}));

async function handleMLSListingCreated(event: any) {
  const { listingId, mlsNumber, data } = event;

  // Check if already exists
  const existing = await prisma.property.findFirst({
    where: { mlsNumber },
  });

  if (existing) return;

  // Map MLS data to our schema
  const propertyData = mapMLSToProperty(data);

  // Find or create default system agent for MLS imports
  let systemAgent = await prisma.agent.findFirst({
    where: { isSystemAgent: true },
  });

  if (!systemAgent) {
    const systemUser = await prisma.user.create({
      data: {
        email: 'mls-import@rest-in-u.com',
        firstName: 'MLS',
        lastName: 'Import',
        userType: 'AGENT',
      },
    });
    systemAgent = await prisma.agent.create({
      data: {
        userId: systemUser.id,
        licenseNumber: 'SYSTEM-MLS',
        isSystemAgent: true,
      },
    });
  }

  await prisma.property.create({
    data: {
      ...propertyData,
      mlsNumber,
      mlsId: listingId,
      agentId: systemAgent.userId,
      source: 'MLS',
      lastMLSSync: new Date(),
    },
  });

  // Notify agents with matching saved searches
  await notifyMatchingSavedSearches(propertyData);
}

async function handleMLSListingUpdated(event: any) {
  const { mlsNumber, data } = event;

  const property = await prisma.property.findFirst({
    where: { mlsNumber },
  });

  if (!property) return;

  const propertyData = mapMLSToProperty(data);

  await prisma.property.update({
    where: { id: property.id },
    data: {
      ...propertyData,
      lastMLSSync: new Date(),
    },
  });

  // Invalidate cache
  await redis.del(`property:${property.id}`);
}

async function handleMLSListingDeleted(event: any) {
  const { mlsNumber } = event;

  const property = await prisma.property.findFirst({
    where: { mlsNumber },
  });

  if (!property) return;

  // Soft delete - mark as inactive
  await prisma.property.update({
    where: { id: property.id },
    data: {
      status: 'WITHDRAWN',
      isActive: false,
    },
  });

  await redis.del(`property:${property.id}`);
}

async function handleMLSStatusChanged(event: any) {
  const { mlsNumber, data } = event;

  const property = await prisma.property.findFirst({
    where: { mlsNumber },
    include: { favorites: { include: { user: true } } },
  });

  if (!property) return;

  const statusMap: Record<string, string> = {
    'A': 'ACTIVE',
    'P': 'PENDING',
    'S': 'SOLD',
    'W': 'WITHDRAWN',
    'C': 'CANCELED',
  };

  const newStatus = statusMap[data.status] || data.status;

  await prisma.property.update({
    where: { id: property.id },
    data: {
      status: newStatus,
      lastMLSSync: new Date(),
    },
  });

  // Notify users who favorited this property
  for (const favorite of property.favorites) {
    await createNotification(
      favorite.userId,
      'PROPERTY_UPDATE',
      'Property Status Changed',
      `A property you saved has a new status: ${newStatus}`,
      { propertyId: property.id }
    );
  }
}

async function handleMLSPriceChanged(event: any) {
  const { mlsNumber, data } = event;

  const property = await prisma.property.findFirst({
    where: { mlsNumber },
    include: { favorites: { include: { user: true } } },
  });

  if (!property) return;

  const oldPrice = property.price;
  const newPrice = data.listPrice;
  const priceChange = newPrice - oldPrice;
  const percentChange = Math.round((priceChange / oldPrice) * 100);

  // Record price history
  await prisma.priceHistory.create({
    data: {
      propertyId: property.id,
      price: newPrice,
      previousPrice: oldPrice,
      changeAmount: priceChange,
      changePercent: percentChange,
      source: 'MLS',
    },
  });

  await prisma.property.update({
    where: { id: property.id },
    data: {
      price: newPrice,
      priceReduced: priceChange < 0,
      lastMLSSync: new Date(),
    },
  });

  // Notify users who favorited this property
  const changeType = priceChange < 0 ? 'reduced' : 'increased';
  for (const favorite of property.favorites) {
    await createNotification(
      favorite.userId,
      'PRICE_CHANGE',
      `Price ${changeType.charAt(0).toUpperCase() + changeType.slice(1)}`,
      `A property you saved has been ${changeType} by ${Math.abs(percentChange)}%`,
      { propertyId: property.id, priority: priceChange < 0 ? 'HIGH' : 'NORMAL' }
    );
  }

  await redis.del(`property:${property.id}`);
}

function mapMLSToProperty(mlsData: any): any {
  return {
    title: mlsData.publicRemarks?.substring(0, 100) || `${mlsData.propertyType} in ${mlsData.city}`,
    description: mlsData.publicRemarks || '',
    propertyType: mapPropertyType(mlsData.propertyType),
    listingType: mlsData.listingType === 'R' ? 'RENT' : 'SALE',
    price: mlsData.listPrice,
    bedrooms: mlsData.bedroomsTotal,
    bathrooms: mlsData.bathroomsTotal,
    squareFeet: mlsData.livingArea,
    lotSize: mlsData.lotSizeArea,
    yearBuilt: mlsData.yearBuilt,
    address: mlsData.streetAddress,
    city: mlsData.city,
    state: mlsData.stateOrProvince,
    zipCode: mlsData.postalCode,
    country: mlsData.country || 'USA',
    latitude: mlsData.latitude,
    longitude: mlsData.longitude,
    features: mlsData.features || [],
    amenities: mlsData.amenities || [],
  };
}

function mapPropertyType(mlsType: string): string {
  const typeMap: Record<string, string> = {
    'RES': 'SINGLE_FAMILY',
    'CND': 'CONDO',
    'TWN': 'TOWNHOUSE',
    'MUL': 'MULTI_FAMILY',
    'LND': 'LAND',
    'COM': 'COMMERCIAL',
  };
  return typeMap[mlsType] || 'OTHER';
}

async function notifyMatchingSavedSearches(propertyData: any) {
  // Find saved searches that match this property
  const savedSearches = await prisma.savedSearch.findMany({
    where: {
      isActive: true,
      alertFrequency: { not: 'NEVER' },
    },
    include: { user: true },
  });

  for (const search of savedSearches) {
    const filters = search.filters as any;
    
    // Basic matching logic
    let matches = true;
    
    if (filters.propertyType && filters.propertyType !== propertyData.propertyType) {
      matches = false;
    }
    if (filters.minPrice && propertyData.price < filters.minPrice) {
      matches = false;
    }
    if (filters.maxPrice && propertyData.price > filters.maxPrice) {
      matches = false;
    }
    if (filters.minBedrooms && propertyData.bedrooms < filters.minBedrooms) {
      matches = false;
    }
    if (filters.city && !propertyData.city.toLowerCase().includes(filters.city.toLowerCase())) {
      matches = false;
    }

    if (matches && search.alertFrequency === 'INSTANT') {
      await createNotification(
        search.userId,
        'NEW_LISTING',
        'New Property Match',
        `A new property matching your "${search.name}" search is available`,
        { searchId: search.id, priority: 'HIGH' }
      );
    }
  }
}

// ============================================
// IOT SENSOR WEBHOOKS
// ============================================

router.post('/iot', asyncHandler(async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (apiKey !== process.env.IOT_WEBHOOK_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const dataSchema = z.object({
    deviceId: z.string(),
    propertyId: z.string(),
    sensorType: z.enum(['TEMPERATURE', 'HUMIDITY', 'AIR_QUALITY', 'WATER_LEAK', 'MOTION', 'DOOR_WINDOW', 'ENERGY', 'SMOKE', 'CO2', 'NOISE']),
    value: z.number(),
    unit: z.string(),
    timestamp: z.string(),
    batteryLevel: z.number().optional(),
    metadata: z.any().optional(),
  });

  const data = dataSchema.parse(req.body);

  try {
    // Store reading
    await prisma.sensorReading.create({
      data: {
        deviceId: data.deviceId,
        propertyId: data.propertyId,
        sensorType: data.sensorType,
        value: data.value,
        unit: data.unit,
        timestamp: new Date(data.timestamp),
        batteryLevel: data.batteryLevel,
        metadata: data.metadata,
      },
    });

    // Update device last seen
    await prisma.iotDevice.update({
      where: { id: data.deviceId },
      data: {
        lastSeen: new Date(),
        batteryLevel: data.batteryLevel,
        lastReading: data.value,
      },
    });

    // Check for alerts
    await checkSensorAlerts(data);

    // Update Redis cache for real-time display
    await redis.setex(
      `sensor:${data.deviceId}:latest`,
      3600,
      JSON.stringify(data)
    );

    res.json({ received: true });
  } catch (err) {
    console.error('IoT webhook error:', err);
    res.status(500).json({ error: 'Processing failed' });
  }
}));

async function checkSensorAlerts(data: any) {
  const property = await prisma.property.findUnique({
    where: { id: data.propertyId },
    include: { owner: true, agent: true },
  });

  if (!property) return;

  const alertThresholds: Record<string, { min?: number; max?: number; immediate?: boolean }> = {
    TEMPERATURE: { min: 10, max: 35 }, // Celsius
    HUMIDITY: { min: 20, max: 80 }, // Percent
    AIR_QUALITY: { max: 150 }, // AQI
    WATER_LEAK: { max: 0.1, immediate: true }, // Any detection
    SMOKE: { max: 0.5, immediate: true },
    CO2: { max: 1000 }, // PPM
    NOISE: { max: 70 }, // dB
  };

  const threshold = alertThresholds[data.sensorType];
  if (!threshold) return;

  let shouldAlert = false;
  let alertMessage = '';
  let priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' = 'NORMAL';

  if (threshold.min !== undefined && data.value < threshold.min) {
    shouldAlert = true;
    alertMessage = `Low ${data.sensorType.toLowerCase()}: ${data.value}${data.unit}`;
    priority = 'HIGH';
  } else if (threshold.max !== undefined && data.value > threshold.max) {
    shouldAlert = true;
    alertMessage = `High ${data.sensorType.toLowerCase()}: ${data.value}${data.unit}`;
    priority = threshold.immediate ? 'URGENT' : 'HIGH';
  }

  if (shouldAlert) {
    // Create alert record
    await prisma.sensorAlert.create({
      data: {
        deviceId: data.deviceId,
        propertyId: data.propertyId,
        sensorType: data.sensorType,
        alertType: data.value > (threshold.max || 0) ? 'HIGH' : 'LOW',
        value: data.value,
        threshold: threshold.max || threshold.min,
        message: alertMessage,
        priority,
      },
    });

    // Notify owner
    if (property.ownerId) {
      await createNotification(
        property.ownerId,
        'SENSOR_ALERT',
        `Sensor Alert: ${data.sensorType}`,
        alertMessage,
        { 
          propertyId: property.id, 
          deviceId: data.deviceId,
          priority,
          requiresAction: threshold.immediate,
        }
      );
    }

    // Notify agent for urgent alerts
    if (threshold.immediate && property.agentId) {
      await createNotification(
        property.agentId,
        'SENSOR_ALERT',
        `URGENT: ${data.sensorType} Alert`,
        `${alertMessage} at ${property.address}`,
        { 
          propertyId: property.id, 
          priority: 'URGENT',
        }
      );
    }

    // Publish to real-time channel
    await redis.publish(`property:${property.id}:alerts`, JSON.stringify({
      type: 'SENSOR_ALERT',
      data: {
        sensorType: data.sensorType,
        value: data.value,
        message: alertMessage,
        priority,
        timestamp: new Date().toISOString(),
      },
    }));
  }
}

// Bulk IoT data ingestion endpoint
router.post('/iot/bulk', asyncHandler(async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (apiKey !== process.env.IOT_WEBHOOK_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const bulkSchema = z.object({
    readings: z.array(z.object({
      deviceId: z.string(),
      propertyId: z.string(),
      sensorType: z.string(),
      value: z.number(),
      unit: z.string(),
      timestamp: z.string(),
    })),
  });

  const { readings } = bulkSchema.parse(req.body);

  // Batch insert
  await prisma.sensorReading.createMany({
    data: readings.map(r => ({
      deviceId: r.deviceId,
      propertyId: r.propertyId,
      sensorType: r.sensorType,
      value: r.value,
      unit: r.unit,
      timestamp: new Date(r.timestamp),
    })),
    skipDuplicates: true,
  });

  res.json({ received: readings.length });
}));

// ============================================
// CLIMATE DATA WEBHOOKS
// ============================================

router.post('/climate', asyncHandler(async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (apiKey !== process.env.CLIMATE_WEBHOOK_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const dataSchema = z.object({
    eventType: z.enum(['weather_alert', 'flood_warning', 'wildfire_update', 'air_quality_update', 'hurricane_update']),
    region: z.object({
      latitude: z.number(),
      longitude: z.number(),
      radius: z.number(), // km
    }),
    severity: z.enum(['LOW', 'MODERATE', 'HIGH', 'EXTREME']),
    data: z.any(),
    expiresAt: z.string().optional(),
  });

  const event = dataSchema.parse(req.body);

  try {
    // Find properties in affected region
    const affectedProperties = await prisma.property.findMany({
      where: {
        latitude: {
          gte: event.region.latitude - (event.region.radius / 111),
          lte: event.region.latitude + (event.region.radius / 111),
        },
        longitude: {
          gte: event.region.longitude - (event.region.radius / 111),
          lte: event.region.longitude + (event.region.radius / 111),
        },
        isActive: true,
      },
      include: {
        owner: true,
        agent: true,
        favorites: { include: { user: true } },
      },
    });

    // Create climate event record
    await prisma.climateEvent.create({
      data: {
        type: event.eventType,
        severity: event.severity,
        latitude: event.region.latitude,
        longitude: event.region.longitude,
        radius: event.region.radius,
        data: event.data,
        affectedPropertyCount: affectedProperties.length,
        expiresAt: event.expiresAt ? new Date(event.expiresAt) : null,
      },
    });

    // Notify affected property owners and interested users
    const notifiedUsers = new Set<string>();

    for (const property of affectedProperties) {
      // Update property climate risk if severe
      if (event.severity === 'HIGH' || event.severity === 'EXTREME') {
        await prisma.climateAnalysis.updateMany({
          where: { propertyId: property.id },
          data: {
            hasActiveAlert: true,
            lastAlertType: event.eventType,
            lastAlertSeverity: event.severity,
          },
        });
      }

      // Notify owner
      if (property.ownerId && !notifiedUsers.has(property.ownerId)) {
        await createNotification(
          property.ownerId,
          'CLIMATE_ALERT',
          `Climate Alert: ${formatEventType(event.eventType)}`,
          `${event.severity} severity alert for your property at ${property.address}`,
          {
            propertyId: property.id,
            priority: event.severity === 'EXTREME' ? 'URGENT' : 'HIGH',
            data: event.data,
          }
        );
        notifiedUsers.add(property.ownerId);
      }

      // Notify agent
      if (property.agentId && !notifiedUsers.has(property.agentId)) {
        await createNotification(
          property.agentId,
          'CLIMATE_ALERT',
          `Climate Alert: ${formatEventType(event.eventType)}`,
          `${event.severity} alert affecting ${property.address}`,
          {
            propertyId: property.id,
            priority: event.severity === 'EXTREME' ? 'URGENT' : 'HIGH',
          }
        );
        notifiedUsers.add(property.agentId);
      }

      // Notify users who favorited
      for (const favorite of property.favorites) {
        if (!notifiedUsers.has(favorite.userId)) {
          await createNotification(
            favorite.userId,
            'CLIMATE_ALERT',
            `Climate Alert for Saved Property`,
            `${event.severity} ${formatEventType(event.eventType)} near a property you saved`,
            {
              propertyId: property.id,
              priority: event.severity === 'HIGH' || event.severity === 'EXTREME' ? 'HIGH' : 'NORMAL',
            }
          );
          notifiedUsers.add(favorite.userId);
        }
      }
    }

    res.json({ 
      received: true,
      affectedProperties: affectedProperties.length,
      notifiedUsers: notifiedUsers.size,
    });
  } catch (err) {
    console.error('Climate webhook error:', err);
    res.status(500).json({ error: 'Processing failed' });
  }
}));

function formatEventType(type: string): string {
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// ============================================
// PANCHANG/ASTROLOGY WEBHOOKS
// ============================================

router.post('/panchang', asyncHandler(async (req: Request, res: Response) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (apiKey !== process.env.PANCHANG_WEBHOOK_API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  const dataSchema = z.object({
    date: z.string(),
    nakshatra: z.string(),
    tithi: z.string(),
    yoga: z.string(),
    karana: z.string(),
    rahuKaal: z.object({
      start: z.string(),
      end: z.string(),
    }),
    specialDay: z.string().optional(),
    isAuspicious: z.boolean(),
    auspiciousFor: z.array(z.string()).optional(),
  });

  const data = dataSchema.parse(req.body);

  try {
    // Store daily panchang
    await prisma.dailyPanchang.upsert({
      where: { date: new Date(data.date) },
      update: data,
      create: {
        ...data,
        date: new Date(data.date),
      },
    });

    // If it's an auspicious day, notify users with relevant events scheduled
    if (data.isAuspicious && data.auspiciousFor?.length) {
      const upcomingEvents = await prisma.propertyEvent.findMany({
        where: {
          scheduledDate: {
            gte: new Date(data.date),
            lt: new Date(new Date(data.date).getTime() + 24 * 60 * 60 * 1000),
          },
          eventType: {
            in: data.auspiciousFor,
          },
        },
        include: { property: { include: { owner: true } } },
      });

      for (const event of upcomingEvents) {
        if (event.property.ownerId) {
          await createNotification(
            event.property.ownerId,
            'AUSPICIOUS_DATE',
            'Auspicious Day for Your Event',
            `Today is especially favorable for ${event.eventType}. Nakshatra: ${data.nakshatra}, Tithi: ${data.tithi}`,
            {
              propertyId: event.propertyId,
              eventId: event.id,
              panchang: data,
            }
          );
        }
      }
    }

    // Cache for the day
    await redis.setex(
      `panchang:${data.date}`,
      86400,
      JSON.stringify(data)
    );

    res.json({ received: true });
  } catch (err) {
    console.error('Panchang webhook error:', err);
    res.status(500).json({ error: 'Processing failed' });
  }
}));

// ============================================
// HELPER FUNCTIONS
// ============================================

async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  metadata?: any
) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        priority: metadata?.priority || 'NORMAL',
        data: metadata,
      },
    });

    // Publish to real-time channel
    await redis.publish(`user:${userId}:notifications`, JSON.stringify({
      type: 'NEW_NOTIFICATION',
      notification,
    }));

    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
}

// Health check for webhook endpoints
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    endpoints: {
      stripe: '/webhooks/stripe',
      mls: '/webhooks/mls',
      iot: '/webhooks/iot',
      climate: '/webhooks/climate',
      panchang: '/webhooks/panchang',
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;

