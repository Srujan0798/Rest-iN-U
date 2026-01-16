import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { JyotishVidya } from '../agents/JyotishVidya';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

const router = Router();
const jyotishAgent = new JyotishVidya();

const matchSchema = z.object({
  buyerDetails: z.object({
    dateOfBirth: z.string(),
    timeOfBirth: z.string(),
    placeOfBirth: z.object({
      city: z.string(),
      state: z.string().optional(),
      country: z.string(),
    }),
  }),
  propertyId: z.string().optional(),
  propertyDetails: z.object({
    address: z.string().optional(),
    entranceDirection: z.string().optional(),
    propertyNumber: z.number().optional(),
    floor: z.number().optional(),
    constructionYear: z.number().optional(),
  }).optional(),
});

router.post('/match', async (req: Request, res: Response) => {
  try {
    const { buyerDetails, propertyId, propertyDetails } = matchSchema.parse(req.body);

    let targetPropertyDetails = propertyDetails;

    if (propertyId) {
      // Fetch property from DB if provided
      const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: { vastuAnalysis: true } // Assuming vastuAnalysis holds direction info
      });

      if (property) {
        // Merge DB details with provided details (provided takes precedence if specific)
        targetPropertyDetails = {
            propertyId: property.id,
            address: property.streetAddress,
            // mapping logic depends on schema, assuming vastuAnalysis has entranceDirection
            entranceDirection: property.vastuAnalysis?.entranceDirection || targetPropertyDetails?.entranceDirection,
            constructionYear: property.yearBuilt || targetPropertyDetails?.constructionYear,
            ...targetPropertyDetails
        };
      }
    }

    if (!targetPropertyDetails) {
       return res.status(400).json({ error: "Property details or ID required" });
    }

    const result = await jyotishAgent.assessCompatibilityAndTiming(
        buyerDetails, 
        targetPropertyDetails as any // Type assertion for compatibility
    );

    res.json(result);

  } catch (error) {
    if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    logger.error('Jyotish match error:', error);
    res.status(500).json({ error: 'Failed to perform Jyotish matching' });
  }
});

export default router;
