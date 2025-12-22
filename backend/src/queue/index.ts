import Queue, { Job } from 'bull';
import { PrismaClient } from '@prisma/client';
import { redis } from '../utils/redis';

const prisma = new PrismaClient();

// Redis configuration for Bull
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// ============================================
// QUEUE DEFINITIONS
// ============================================

export const queues = {
  mlsSync: new Queue('mls-sync', { redis: redisConfig }),
  alertProcessor: new Queue('alert-processor', { redis: redisConfig }),
  climateUpdater: new Queue('climate-updater', { redis: redisConfig }),
  iotAggregator: new Queue('iot-aggregator', { redis: redisConfig }),
  karmicCalculator: new Queue('karmic-calculator', { redis: redisConfig }),
  tokenDistributor: new Queue('token-distributor', { redis: redisConfig }),
  listingExpiry: new Queue('listing-expiry', { redis: redisConfig }),
  performanceMetrics: new Queue('performance-metrics', { redis: redisConfig }),
  emailSender: new Queue('email-sender', { redis: redisConfig }),
  reportGenerator: new Queue('report-generator', { redis: redisConfig }),
  imageProcessor: new Queue('image-processor', { redis: redisConfig }),
  searchIndexer: new Queue('search-indexer', { redis: redisConfig }),
};

// ============================================
// MLS SYNC JOB (Every 15 minutes)
// ============================================

queues.mlsSync.process(async (job: Job) => {
  console.log('Starting MLS sync job...');

  try {
    // Fetch from MLS API (simulated)
    const mlsApiUrl = process.env.MLS_API_URL;
    const mlsApiKey = process.env.MLS_API_KEY;

    if (!mlsApiUrl) {
      console.log('MLS API not configured, skipping sync');
      return { skipped: true };
    }

    // Get last sync timestamp
    const lastSync = await redis.get('mls:last_sync');
    const lastSyncDate = lastSync ? new Date(lastSync) : new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fetch updated listings from MLS
    // In production, this would be an actual API call
    console.log(`Fetching MLS updates since ${lastSyncDate.toISOString()}`);

    // Process updates
    const updates = {
      created: 0,
      updated: 0,
      deleted: 0,
    };

    // Update last sync timestamp
    await redis.set('mls:last_sync', new Date().toISOString());

    return { success: true, ...updates };
  } catch (err) {
    console.error('MLS sync error:', err);
    throw err;
  }
});

// ============================================
// ALERT PROCESSOR (Instant, Daily, Weekly)
// ============================================

queues.alertProcessor.process(async (job: Job<{ frequency: string }>) => {
  const { frequency } = job.data;
  console.log(`Processing ${frequency} alerts...`);

  try {
    // Get saved searches with matching frequency
    const savedSearches = await prisma.savedSearch.findMany({
      where: {
        isActive: true,
        alertFrequency: frequency.toUpperCase(),
      },
      include: {
        user: {
          select: { id: true, email: true, firstName: true },
        },
      },
    });

    let alertsSent = 0;

    for (const search of savedSearches) {
      // Find new matches since last alert
      const filters = search.filters as any;
      const lastAlert = search.lastAlertSent || search.createdAt;

      // Build query based on filters
      const whereClause: any = {
        createdAt: { gt: lastAlert },
        isActive: true,
        status: 'ACTIVE',
      };

      if (filters.propertyType) whereClause.propertyType = filters.propertyType;
      if (filters.listingType) whereClause.listingType = filters.listingType;
      if (filters.minPrice) whereClause.price = { gte: filters.minPrice };
      if (filters.maxPrice) whereClause.price = { ...whereClause.price, lte: filters.maxPrice };
      if (filters.minBedrooms) whereClause.bedrooms = { gte: filters.minBedrooms };
      if (filters.city) whereClause.city = { contains: filters.city, mode: 'insensitive' };

      const newMatches = await prisma.property.findMany({
        where: whereClause,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });

      if (newMatches.length > 0) {
        // Create notification
        await prisma.notification.create({
          data: {
            userId: search.userId,
            type: 'NEW_LISTING',
            title: `${newMatches.length} new properties match "${search.name}"`,
            message: `We found ${newMatches.length} new properties matching your saved search.`,
            data: {
              searchId: search.id,
              matchCount: newMatches.length,
              propertyIds: newMatches.map(p => p.id),
            },
          },
        });

        // Queue email
        await queues.emailSender.add({
          type: 'saved_search_alert',
          to: search.user.email,
          data: {
            userName: search.user.firstName,
            searchName: search.name,
            matchCount: newMatches.length,
            properties: newMatches.slice(0, 5),
          },
        });

        // Update last alert timestamp
        await prisma.savedSearch.update({
          where: { id: search.id },
          data: { lastAlertSent: new Date() },
        });

        alertsSent++;
      }
    }

    return { frequency, searchesProcessed: savedSearches.length, alertsSent };
  } catch (err) {
    console.error('Alert processor error:', err);
    throw err;
  }
});

// ============================================
// CLIMATE DATA UPDATER (Monthly)
// ============================================

queues.climateUpdater.process(async (job: Job) => {
  console.log('Starting climate data update...');

  try {
    // Get all properties that need climate analysis update
    const properties = await prisma.property.findMany({
      where: {
        isActive: true,
        OR: [
          { climateAnalysis: null },
          {
            climateAnalysis: {
              updatedAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            },
          },
        ],
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        address: true,
      },
      take: 100, // Process in batches
    });

    let updated = 0;

    for (const property of properties) {
      if (!property.latitude || !property.longitude) continue;

      // Fetch climate data from external APIs (simulated)
      const climateData = await fetchClimateData(property.latitude, property.longitude);

      await prisma.climateAnalysis.upsert({
        where: { propertyId: property.id },
        update: {
          ...climateData,
          updatedAt: new Date(),
        },
        create: {
          propertyId: property.id,
          ...climateData,
        },
      });

      updated++;
    }

    return { propertiesUpdated: updated };
  } catch (err) {
    console.error('Climate updater error:', err);
    throw err;
  }
});

async function fetchClimateData(lat: number, lng: number) {
  // In production, call actual climate APIs (NOAA, EPA, etc.)
  // This is simulated data
  return {
    overallRiskScore: Math.random() * 100,
    overallGrade: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
    floodRiskScore: Math.random() * 100,
    wildfireRiskScore: Math.random() * 100,
    hurricaneRiskScore: Math.random() * 100,
    earthquakeRiskScore: Math.random() * 100,
    airQualityIndex: Math.floor(Math.random() * 200),
    averageTemperature: 15 + Math.random() * 20,
    annualRainfall: 500 + Math.random() * 1000,
  };
}

// ============================================
// IOT DATA AGGREGATOR (Hourly)
// ============================================

queues.iotAggregator.process(async (job: Job) => {
  console.log('Aggregating IoT data...');

  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    // Get all active devices
    const devices = await prisma.iotDevice.findMany({
      where: { isActive: true },
    });

    let aggregated = 0;

    for (const device of devices) {
      // Get readings from the last hour
      const readings = await prisma.sensorReading.findMany({
        where: {
          deviceId: device.id,
          timestamp: { gte: oneHourAgo },
        },
      });

      if (readings.length === 0) continue;

      // Calculate aggregates
      const values = readings.map(r => r.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const min = Math.min(...values);
      const max = Math.max(...values);

      // Store hourly aggregate
      await prisma.sensorHourlyAggregate.create({
        data: {
          deviceId: device.id,
          propertyId: device.propertyId,
          sensorType: device.sensorType,
          hour: new Date(new Date().setMinutes(0, 0, 0)),
          avgValue: avg,
          minValue: min,
          maxValue: max,
          readingCount: readings.length,
        },
      });

      // Update device stats
      await prisma.iotDevice.update({
        where: { id: device.id },
        data: {
          lastReading: avg,
          readingCount: { increment: readings.length },
        },
      });

      aggregated++;
    }

    // Clean up old raw readings (keep 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await prisma.sensorReading.deleteMany({
      where: { timestamp: { lt: sevenDaysAgo } },
    });

    return { devicesAggregated: aggregated };
  } catch (err) {
    console.error('IoT aggregator error:', err);
    throw err;
  }
});

// ============================================
// KARMIC SCORE CALCULATOR (Daily)
// ============================================

queues.karmicCalculator.process(async (job: Job) => {
  console.log('Calculating karmic scores...');

  try {
    // Get all active agents
    const agents = await prisma.agent.findMany({
      where: { isActive: true },
      include: {
        user: true,
        properties: {
          where: { status: 'SOLD' },
        },
        reviews: true,
      },
    });

    let calculated = 0;

    for (const agent of agents) {
      // Calculate karmic score based on various factors
      let karmicScore = 50; // Base score

      // Positive factors
      const avgRating = agent.reviews.length > 0
        ? agent.reviews.reduce((sum, r) => sum + r.rating, 0) / agent.reviews.length
        : 0;
      karmicScore += avgRating * 5; // Up to +25 for 5-star average

      // Response time factor
      const avgResponseTime = agent.avgResponseTimeMinutes || 60;
      if (avgResponseTime < 30) karmicScore += 10;
      else if (avgResponseTime < 60) karmicScore += 5;

      // Successful closings factor
      const closingBonus = Math.min(agent.properties.length * 2, 20);
      karmicScore += closingBonus;

      // Vastu expertise bonus
      if (agent.vastuCertified) karmicScore += 10;

      // Cap at 100
      karmicScore = Math.min(100, Math.max(0, karmicScore));

      await prisma.agent.update({
        where: { id: agent.id },
        data: {
          karmicScore,
          lastKarmicCalculation: new Date(),
        },
      });

      // Record history
      await prisma.karmicScoreHistory.create({
        data: {
          agentId: agent.id,
          score: karmicScore,
          factors: {
            avgRating,
            avgResponseTime,
            closings: agent.properties.length,
            vastuCertified: agent.vastuCertified,
          },
        },
      });

      calculated++;
    }

    return { agentsCalculated: calculated };
  } catch (err) {
    console.error('Karmic calculator error:', err);
    throw err;
  }
});

// ============================================
// TOKEN REWARDS DISTRIBUTOR (Daily)
// ============================================

queues.tokenDistributor.process(async (job: Job) => {
  console.log('Distributing token rewards...');

  try {
    // Get pending rewards
    const pendingRewards = await prisma.tokenReward.findMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // At least 24h old
      },
      include: {
        user: true,
      },
    });

    let distributed = 0;

    for (const reward of pendingRewards) {
      try {
        // In production, call blockchain contract to transfer tokens
        // await transferTokens(reward.user.walletAddress, reward.amount);

        await prisma.tokenReward.update({
          where: { id: reward.id },
          data: {
            status: 'DISTRIBUTED',
            distributedAt: new Date(),
          },
        });

        // Update user's token balance
        await prisma.user.update({
          where: { id: reward.userId },
          data: {
            tokenBalance: { increment: reward.amount },
          },
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId: reward.userId,
            type: 'TOKEN_REWARD',
            title: 'Tokens Earned!',
            message: `You've earned ${reward.amount} DHARMA tokens for ${reward.reason}`,
            data: { rewardId: reward.id, amount: reward.amount },
          },
        });

        distributed++;
      } catch (err) {
        console.error(`Failed to distribute reward ${reward.id}:`, err);
        await prisma.tokenReward.update({
          where: { id: reward.id },
          data: { status: 'FAILED' },
        });
      }
    }

    return { rewardsDistributed: distributed };
  } catch (err) {
    console.error('Token distributor error:', err);
    throw err;
  }
});

// ============================================
// LISTING EXPIRY HANDLER
// ============================================

queues.listingExpiry.process(async (job: Job) => {
  console.log('Processing expired listings...');

  try {
    const now = new Date();

    // Find expired listings
    const expiredListings = await prisma.property.findMany({
      where: {
        isActive: true,
        listingExpiresAt: { lt: now },
      },
      include: {
        agent: { include: { user: true } },
        owner: true,
      },
    });

    let processed = 0;

    for (const listing of expiredListings) {
      // Mark as expired
      await prisma.property.update({
        where: { id: listing.id },
        data: {
          status: 'EXPIRED',
          isActive: false,
        },
      });

      // Notify agent
      if (listing.agentId) {
        await prisma.notification.create({
          data: {
            userId: listing.agentId,
            type: 'SYSTEM',
            title: 'Listing Expired',
            message: `Your listing at ${listing.address} has expired. Renew it to keep it active.`,
            data: { propertyId: listing.id },
          },
        });
      }

      // Notify owner
      if (listing.ownerId && listing.ownerId !== listing.agentId) {
        await prisma.notification.create({
          data: {
            userId: listing.ownerId,
            type: 'SYSTEM',
            title: 'Property Listing Expired',
            message: `The listing for ${listing.address} has expired.`,
            data: { propertyId: listing.id },
          },
        });
      }

      processed++;
    }

    // Also handle featured listings that expired
    await prisma.property.updateMany({
      where: {
        isFeatured: true,
        featuredUntil: { lt: now },
      },
      data: {
        isFeatured: false,
        featuredUntil: null,
      },
    });

    return { expiredListings: processed };
  } catch (err) {
    console.error('Listing expiry error:', err);
    throw err;
  }
});

// ============================================
// PERFORMANCE METRICS CALCULATOR (Monthly)
// ============================================

queues.performanceMetrics.process(async (job: Job) => {
  console.log('Calculating performance metrics...');

  try {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Calculate agent performance
    const agents = await prisma.agent.findMany({
      where: { isActive: true },
      include: {
        properties: {
          where: {
            soldAt: {
              gte: lastMonthStart,
              lt: monthStart,
            },
          },
        },
        leads: {
          where: {
            createdAt: {
              gte: lastMonthStart,
              lt: monthStart,
            },
          },
        },
        reviews: {
          where: {
            createdAt: {
              gte: lastMonthStart,
              lt: monthStart,
            },
          },
        },
      },
    });

    for (const agent of agents) {
      const totalSales = agent.properties.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
      const avgSalePrice = agent.properties.length > 0 ? totalSales / agent.properties.length : 0;
      const conversionRate = agent.leads.length > 0
        ? (agent.properties.length / agent.leads.length) * 100
        : 0;
      const avgRating = agent.reviews.length > 0
        ? agent.reviews.reduce((sum, r) => sum + r.rating, 0) / agent.reviews.length
        : 0;

      await prisma.agentPerformance.create({
        data: {
          agentId: agent.id,
          month: lastMonthStart,
          salesCount: agent.properties.length,
          totalSalesVolume: totalSales,
          avgSalePrice,
          leadsGenerated: agent.leads.length,
          conversionRate,
          avgRating,
          reviewCount: agent.reviews.length,
        },
      });
    }

    // Calculate market metrics
    const allSales = await prisma.property.findMany({
      where: {
        status: 'SOLD',
        soldAt: {
          gte: lastMonthStart,
          lt: monthStart,
        },
      },
      select: {
        soldPrice: true,
        price: true,
        daysOnMarket: true,
        propertyType: true,
        city: true,
      },
    });

    // Group by city and property type
    const marketMetrics: Record<string, any> = {};

    for (const sale of allSales) {
      const key = `${sale.city}-${sale.propertyType}`;
      if (!marketMetrics[key]) {
        marketMetrics[key] = {
          city: sale.city,
          propertyType: sale.propertyType,
          sales: [],
        };
      }
      marketMetrics[key].sales.push(sale);
    }

    for (const [key, data] of Object.entries(marketMetrics)) {
      const sales = data.sales;
      const avgPrice = sales.reduce((s: number, p: any) => s + (p.soldPrice || 0), 0) / sales.length;
      const avgDaysOnMarket = sales.reduce((s: number, p: any) => s + (p.daysOnMarket || 0), 0) / sales.length;
      const medianPrice = sales.sort((a: any, b: any) => (a.soldPrice || 0) - (b.soldPrice || 0))[Math.floor(sales.length / 2)]?.soldPrice || 0;

      await prisma.marketMetrics.create({
        data: {
          month: lastMonthStart,
          city: data.city,
          propertyType: data.propertyType,
          avgPrice,
          medianPrice,
          totalSales: sales.length,
          avgDaysOnMarket,
        },
      });
    }

    return { agentsProcessed: agents.length, marketsAnalyzed: Object.keys(marketMetrics).length };
  } catch (err) {
    console.error('Performance metrics error:', err);
    throw err;
  }
});

// ============================================
// EMAIL SENDER
// ============================================

queues.emailSender.process(async (job: Job<{ type: string; to: string; data: any }>) => {
  const { type, to, data } = job.data;
  console.log(`Sending ${type} email to ${to}...`);

  try {
    // In production, use actual email service (SendGrid, SES, etc.)
    // await sendEmail({ type, to, data });

    console.log(`Email sent: ${type} to ${to}`);
    return { sent: true };
  } catch (err) {
    console.error('Email send error:', err);
    throw err;
  }
});

// ============================================
// SEARCH INDEXER
// ============================================

queues.searchIndexer.process(async (job: Job<{ propertyId: string; action: string }>) => {
  const { propertyId, action } = job.data;
  console.log(`Indexing property ${propertyId} (${action})...`);

  try {
    // In production, update Elasticsearch/OpenSearch index
    // const property = await prisma.property.findUnique({ where: { id: propertyId } });
    // await esClient.index({ index: 'properties', id: propertyId, body: property });

    return { indexed: true };
    // eslint-disable-next-line no-unreachable
  } catch (err) {
    console.error('Search indexer error:', err);
    throw err;
  }
});

// ============================================
// SCHEDULE RECURRING JOBS
// ============================================

export async function scheduleRecurringJobs() {
  // MLS Sync - Every 15 minutes
  await queues.mlsSync.add({}, { repeat: { cron: '*/15 * * * *' } });

  // Instant Alerts - Every minute (check for instant alerts)
  await queues.alertProcessor.add({ frequency: 'INSTANT' }, { repeat: { cron: '* * * * *' } });

  // Daily Alerts - Every day at 8 AM
  await queues.alertProcessor.add({ frequency: 'DAILY' }, { repeat: { cron: '0 8 * * *' } });

  // Weekly Alerts - Every Monday at 9 AM
  await queues.alertProcessor.add({ frequency: 'WEEKLY' }, { repeat: { cron: '0 9 * * 1' } });

  // Climate Update - First of every month at 2 AM
  await queues.climateUpdater.add({}, { repeat: { cron: '0 2 1 * *' } });

  // IoT Aggregator - Every hour
  await queues.iotAggregator.add({}, { repeat: { cron: '0 * * * *' } });

  // Karmic Calculator - Every day at 3 AM
  await queues.karmicCalculator.add({}, { repeat: { cron: '0 3 * * *' } });

  // Token Distributor - Every day at 4 AM
  await queues.tokenDistributor.add({}, { repeat: { cron: '0 4 * * *' } });

  // Listing Expiry - Every hour
  await queues.listingExpiry.add({}, { repeat: { cron: '0 * * * *' } });

  // Performance Metrics - First of every month at 1 AM
  await queues.performanceMetrics.add({}, { repeat: { cron: '0 1 1 * *' } });

  console.log('Recurring jobs scheduled');
}

// ============================================
// QUEUE MONITORING
// ============================================

export async function getQueueStats() {
  const stats: Record<string, any> = {};

  for (const [name, queue] of Object.entries(queues)) {
    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);

    stats[name] = { waiting, active, completed, failed };
  }

  return stats;
}

// Clean up completed jobs (run periodically)
export async function cleanupJobs() {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (const queue of Object.values(queues)) {
    await queue.clean(oneWeekAgo, 'completed');
    await queue.clean(oneWeekAgo, 'failed');
  }
}









