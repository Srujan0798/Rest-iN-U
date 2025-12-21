import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { authMiddleware, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Validation schemas
const searchSchema = z.object({
    location: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    bedrooms: z.coerce.number().optional(),
    minBedrooms: z.coerce.number().optional(),
    bathrooms: z.coerce.number().optional(),
    minBathrooms: z.coerce.number().optional(),
    propertyType: z.enum(['HOUSE', 'CONDO', 'TOWNHOUSE', 'LAND', 'MULTI_FAMILY', 'APARTMENT']).optional(),
    listingType: z.enum(['SALE', 'RENT']).optional(),
    minSquareFeet: z.coerce.number().optional(),
    maxSquareFeet: z.coerce.number().optional(),
    yearBuilt: z.coerce.number().optional(),
    status: z.enum(['ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET']).optional(),
    sort: z.enum(['price_asc', 'price_desc', 'newest', 'oldest', 'sqft_asc', 'sqft_desc']).optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(24),
});

// ============================================
// SEARCH PROPERTIES
// ============================================
router.get('/search', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
        const params = searchSchema.parse(req.query);

        // Build where clause
        const where: any = {
            status: params.status || 'ACTIVE',
        };

        // Location filters
        if (params.city) where.city = { contains: params.city, mode: 'insensitive' };
        if (params.state) where.state = { equals: params.state, mode: 'insensitive' };
        if (params.zip) where.zip = params.zip;

        // General location search
        if (params.location) {
            where.OR = [
                { city: { contains: params.location, mode: 'insensitive' } },
                { state: { contains: params.location, mode: 'insensitive' } },
                { zip: { contains: params.location } },
                { street: { contains: params.location, mode: 'insensitive' } },
            ];
        }

        // Price filters
        if (params.minPrice || params.maxPrice) {
            where.price = {};
            if (params.minPrice) where.price.gte = params.minPrice;
            if (params.maxPrice) where.price.lte = params.maxPrice;
        }

        // Bedroom filters
        if (params.bedrooms) {
            where.bedrooms = params.bedrooms;
        } else if (params.minBedrooms) {
            where.bedrooms = { gte: params.minBedrooms };
        }

        // Bathroom filters
        if (params.bathrooms) {
            where.bathrooms = { gte: params.bathrooms };
        } else if (params.minBathrooms) {
            where.bathrooms = { gte: params.minBathrooms };
        }

        // Property type
        if (params.propertyType) where.propertyType = params.propertyType;
        if (params.listingType) where.listingType = params.listingType;

        // Square feet
        if (params.minSquareFeet || params.maxSquareFeet) {
            where.squareFeet = {};
            if (params.minSquareFeet) where.squareFeet.gte = params.minSquareFeet;
            if (params.maxSquareFeet) where.squareFeet.lte = params.maxSquareFeet;
        }

        // Year built
        if (params.yearBuilt) where.yearBuilt = { gte: params.yearBuilt };

        // Sorting
        let orderBy: any = { createdAt: 'desc' };
        switch (params.sort) {
            case 'price_asc': orderBy = { price: 'asc' }; break;
            case 'price_desc': orderBy = { price: 'desc' }; break;
            case 'newest': orderBy = { listedDate: 'desc' }; break;
            case 'oldest': orderBy = { listedDate: 'asc' }; break;
            case 'sqft_asc': orderBy = { squareFeet: 'asc' }; break;
            case 'sqft_desc': orderBy = { squareFeet: 'desc' }; break;
        }

        // Pagination
        const skip = (params.page - 1) * params.limit;
        const take = Math.min(params.limit, 100); // Max 100 per page

        // Execute query
        const [properties, total] = await Promise.all([
            prisma.property.findMany({
                where,
                orderBy,
                skip,
                take,
                select: {
                    id: true,
                    street: true,
                    city: true,
                    state: true,
                    zip: true,
                    lat: true,
                    lng: true,
                    price: true,
                    propertyType: true,
                    listingType: true,
                    bedrooms: true,
                    bathrooms: true,
                    squareFeet: true,
                    status: true,
                    listedDate: true,
                    daysOnMarket: true,
                    photos: {
                        take: 1,
                        orderBy: { order: 'asc' },
                        select: { url: true }
                    },
                    listingAgent: {
                        select: {
                            id: true,
                            rating: true,
                            user: {
                                select: {
                                    firstName: true,
                                    lastName: true,
                                    profilePhoto: true,
                                }
                            }
                        }
                    }
                }
            }),
            prisma.property.count({ where })
        ]);

        // Format response
        const formattedProperties = properties.map(p => ({
            property_id: p.id,
            address: {
                street: p.street,
                city: p.city,
                state: p.state,
                zip: p.zip,
            },
            coordinates: p.lat && p.lng ? { lat: p.lat, lng: p.lng } : null,
            price: p.price,
            property_type: p.propertyType,
            listing_type: p.listingType,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            square_feet: p.squareFeet,
            status: p.status,
            listed_date: p.listedDate,
            days_on_market: p.daysOnMarket,
            primary_photo: p.photos[0]?.url || null,
            listing_agent: p.listingAgent ? {
                agent_id: p.listingAgent.id,
                name: `${p.listingAgent.user.firstName} ${p.listingAgent.user.lastName}`,
                photo: p.listingAgent.user.profilePhoto,
                rating: p.listingAgent.rating,
            } : null,
        }));

        res.json({
            total,
            page: params.page,
            total_pages: Math.ceil(total / params.limit),
            limit: params.limit,
            properties: formattedProperties,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Search error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
});

// ============================================
// GET PROPERTY DETAILS
// ============================================
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: {
                photos: { orderBy: { order: 'asc' } },
                priceHistory: { orderBy: { changeDate: 'desc' } },
                openHouses: {
                    where: { startTime: { gte: new Date() } },
                    orderBy: { startTime: 'asc' }
                },
                listingAgent: {
                    include: {
                        user: {
                            select: {
                                firstName: true,
                                lastName: true,
                                phone: true,
                                email: true,
                                profilePhoto: true,
                            }
                        }
                    }
                },
                neighborhood: {
                    include: {
                        schools: true
                    }
                }
            }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Increment view count
        await prisma.property.update({
            where: { id: req.params.id },
            data: { viewCount: { increment: 1 } }
        });

        // Check if favorited by current user
        let isFavorited = false;
        if (req.userId) {
            const favorite = await prisma.favorite.findUnique({
                where: {
                    userId_propertyId: {
                        userId: req.userId,
                        propertyId: req.params.id
                    }
                }
            });
            isFavorited = !!favorite;
        }

        // Calculate estimated payment
        const estimatedPayment = calculateMortgage(property.price);

        res.json({
            property_id: property.id,
            mls_id: property.mlsId,
            address: {
                street: property.street,
                city: property.city,
                state: property.state,
                zip: property.zip,
                country: property.country,
            },
            coordinates: property.lat && property.lng ? { lat: property.lat, lng: property.lng } : null,
            price: property.price,
            price_history: property.priceHistory.map(ph => ({
                date: ph.changeDate,
                previous_price: ph.previousPrice,
                new_price: ph.newPrice,
            })),
            property_type: property.propertyType,
            listing_type: property.listingType,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            square_feet: property.squareFeet,
            lot_size: property.lotSize,
            year_built: property.yearBuilt,
            description: property.description,
            features: property.features,
            photos: property.photos.map(p => ({
                url: p.url,
                caption: p.caption,
                order: p.order,
            })),
            virtual_tour_url: property.virtualTourUrl,
            status: property.status,
            listed_date: property.listedDate,
            days_on_market: property.daysOnMarket,
            hoa_fee: property.hoaFee,
            property_tax: property.propertyTax,
            view_count: property.viewCount,
            favorite_count: property.favoriteCount,
            is_favorited: isFavorited,
            listing_agent: property.listingAgent ? {
                agent_id: property.listingAgent.id,
                name: `${property.listingAgent.user.firstName} ${property.listingAgent.user.lastName}`,
                phone: property.listingAgent.user.phone,
                email: property.listingAgent.user.email,
                photo: property.listingAgent.user.profilePhoto,
                rating: property.listingAgent.rating,
                review_count: property.listingAgent.reviewCount,
                brokerage: property.listingAgent.brokerage,
            } : null,
            open_houses: property.openHouses.map(oh => ({
                id: oh.id,
                start_time: oh.startTime,
                end_time: oh.endTime,
                notes: oh.notes,
            })),
            neighborhood: property.neighborhood ? {
                name: property.neighborhood.name,
                median_price: property.neighborhood.medianHomePrice,
                walkability_score: property.neighborhood.walkabilityScore,
                transit_score: property.neighborhood.transitScore,
                crime_index: property.neighborhood.crimeIndex,
                schools: property.neighborhood.schools.map(s => ({
                    name: s.name,
                    type: s.type,
                    rating: s.rating,
                    distance_miles: s.distanceMiles,
                })),
            } : null,
            estimated_payment: estimatedPayment,
        });
    } catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({ error: 'Failed to get property' });
    }
});

// ============================================
// CREATE PROPERTY (Agent only)
// ============================================
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        // Check if user is an agent
        const agent = await prisma.agent.findUnique({
            where: { userId: req.userId }
        });

        if (!agent) {
            return res.status(403).json({ error: 'Only agents can create listings' });
        }

        const propertySchema = z.object({
            mlsId: z.string().optional(),
            street: z.string().min(1),
            city: z.string().min(1),
            state: z.string().min(2).max(2),
            zip: z.string().min(5),
            lat: z.number().optional(),
            lng: z.number().optional(),
            price: z.number().positive(),
            propertyType: z.enum(['HOUSE', 'CONDO', 'TOWNHOUSE', 'LAND', 'MULTI_FAMILY', 'APARTMENT']),
            listingType: z.enum(['SALE', 'RENT']).default('SALE'),
            bedrooms: z.number().int().min(0),
            bathrooms: z.number().min(0),
            squareFeet: z.number().optional(),
            lotSize: z.number().optional(),
            yearBuilt: z.number().optional(),
            description: z.string().optional(),
            features: z.array(z.string()).default([]),
            virtualTourUrl: z.string().url().optional(),
            hoaFee: z.number().optional(),
            propertyTax: z.number().optional(),
            photos: z.array(z.object({
                url: z.string().url(),
                caption: z.string().optional(),
                order: z.number().default(0),
            })).default([]),
        });

        const data = propertySchema.parse(req.body);

        const property = await prisma.property.create({
            data: {
                ...data,
                listingAgentId: agent.id,
                photos: {
                    create: data.photos,
                }
            },
            include: {
                photos: true,
            }
        });

        res.status(201).json({
            message: 'Property created successfully',
            property_id: property.id,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Create property error:', error);
        res.status(500).json({ error: 'Failed to create property' });
    }
});

// ============================================
// UPDATE PROPERTY
// ============================================
router.patch('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        // Check if user owns this listing
        const agent = await prisma.agent.findUnique({
            where: { userId: req.userId }
        });

        if (!agent) {
            return res.status(403).json({ error: 'Only agents can update listings' });
        }

        const property = await prisma.property.findFirst({
            where: { id: req.params.id, listingAgentId: agent.id }
        });

        if (!property) {
            return res.status(404).json({ error: 'Property not found or you do not have permission' });
        }

        const updateSchema = z.object({
            price: z.number().positive().optional(),
            description: z.string().optional(),
            features: z.array(z.string()).optional(),
            status: z.enum(['ACTIVE', 'PENDING', 'SOLD', 'OFF_MARKET']).optional(),
            virtualTourUrl: z.string().url().optional(),
        });

        const data = updateSchema.parse(req.body);

        // If price changed, add to price history
        if (data.price && data.price !== property.price) {
            await prisma.priceChange.create({
                data: {
                    propertyId: property.id,
                    previousPrice: property.price,
                    newPrice: data.price,
                }
            });
        }

        const updated = await prisma.property.update({
            where: { id: req.params.id },
            data,
        });

        res.json({
            message: 'Property updated successfully',
            property_id: updated.id,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation error', details: error.errors });
        }
        console.error('Update property error:', error);
        res.status(500).json({ error: 'Failed to update property' });
    }
});

// Helper function to calculate mortgage
function calculateMortgage(price: number, downPaymentPercent: number = 20) {
    const downPayment = price * (downPaymentPercent / 100);
    const loanAmount = price - downPayment;
    const annualRate = 0.0699; // 6.99% typical rate
    const monthlyRate = annualRate / 12;
    const numPayments = 360; // 30 years

    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1);

    const monthlyTax = (price * 0.012) / 12; // ~1.2% annual property tax
    const monthlyInsurance = 100; // Estimated

    return {
        principal_interest: Math.round(monthlyPI),
        property_tax: Math.round(monthlyTax),
        insurance: monthlyInsurance,
        hoa: 0,
        total: Math.round(monthlyPI + monthlyTax + monthlyInsurance),
    };
}

export default router;
