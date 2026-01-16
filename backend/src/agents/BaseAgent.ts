// Agent Swarm Framework - Core Types
// Centralizing types here to avoid "enum not exported" issues

export enum PropertyType {
  HOUSE = 'HOUSE',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  APARTMENT = 'APARTMENT',
  LAND = 'LAND',
  MULTI_FAMILY = 'MULTI_FAMILY',
  COMMERCIAL = 'COMMERCIAL',
  VILLA = 'VILLA',
  PENTHOUSE = 'PENTHOUSE',
  FARMHOUSE = 'FARMHOUSE',
  ASHRAM = 'ASHRAM',
  PLOT = 'PLOT',
}

export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT',
  LEASE = 'LEASE',
  AUCTION = 'AUCTION',
}

export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  OFF_MARKET = 'OFF_MARKET',
  COMING_SOON = 'COMING_SOON',
}

export interface PropertyAnalysis {
  agentName?: string; // Enhanced: Allow name
  agentId?: string;
  propertyId?: string;
  score: number;
  confidence: number;
  reasoning: string[] | string; // Enhanced: Allow array of strings
  metadata?: any; // Enhanced: Allow arbitrary metadata
  timestamp?: Date;
}

export interface Property {
  id: string;
  title?: string;
  description?: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
  } | any; // Allow loose typing for existing tests
  features: string[];
  amenities: string[];
  propertyType: PropertyType | string;
  listingType: ListingType | string;
  status: PropertyStatus | string;
  agentId?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  bedrooms?: number; // Legacy support
  bathrooms?: number; // Legacy support
  squareFootage?: number; // Legacy support
  neighborhood?: string; // Legacy support
}

export interface AgentDebate {
  analyses: PropertyAnalysis[];
  consensus?: string;
  confidence: number;
  timestamp: Date;
}

export abstract class BaseAgent {
  name: string = 'Base Agent'; // Default name
  role: string = 'Agent';
  description: string = 'Base Agent';

  protected agentId: string;
  protected agentType: string;

  constructor(agentId: string = 'default', agentType: string = 'base') {
    this.agentId = agentId;
    this.agentType = agentType;
  }

  abstract analyze(property: Property): Promise<PropertyAnalysis>;

  async debate(analyses: PropertyAnalysis[]): Promise<AgentDebate> {
    const validAnalyses = analyses; // Don't filter out self in debate for now
    const consensus = this.calculateConsensus(validAnalyses);
    const confidence = this.calculateDebateConfidence(validAnalyses);

    return {
      analyses: validAnalyses,
      consensus,
      confidence,
      timestamp: new Date(),
    };
  }

  protected calculateConsensus(analyses: PropertyAnalysis[]): string {
    if (analyses.length === 0) return "No consensus available";
    const avgScore = analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length;
    return `Average Score: ${avgScore.toFixed(0)}`;
  }

  protected calculateDebateConfidence(analyses: PropertyAnalysis[]): number {
    if (analyses.length === 0) return 0;
    return analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;
  }
}
