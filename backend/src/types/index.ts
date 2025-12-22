// Backend Utility Types and Interfaces

// import { Request } from 'express';

// Extended Request with user authentication
export interface AuthenticatedRequest {
    [key: string]: any;
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

// Response wrapper types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: ValidationError[];
}

export interface ValidationError {
    field: string;
    message: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

// Vastu types
export type VastuDirection =
    | 'NORTH' | 'SOUTH' | 'EAST' | 'WEST'
    | 'NORTHEAST' | 'NORTHWEST' | 'SOUTHEAST' | 'SOUTHWEST'
    | 'CENTER';

export interface VastuRuleset {
    direction: VastuDirection;
    idealUses: string[];
    avoidUses: string[];
    element: string;
    deity: string;
    color: string;
    weight: number;
}

export interface VastuDefect {
    type: string;
    direction: VastuDirection;
    severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
    description: string;
    impact: number;
}

export interface VastuRemedy {
    type: string;
    description: string;
    direction?: VastuDirection;
    cost: 'LOW' | 'MEDIUM' | 'HIGH';
    effectiveness: number;
}

// Climate analysis types
export interface ClimateRiskFactors {
    flood: number;
    wildfire: number;
    hurricane: number;
    tornado: number;
    earthquake: number;
    drought: number;
    heatwave: number;
    sealevelRise: number;
}

export interface ClimateProjection {
    year: number;
    temperature: number;
    precipitation: number;
    seaLevel: number;
    extremeHeatDays: number;
    floodRisk: number;
}

// Property valuation types
export interface ValuationInput {
    property: {
        squareFeet: number;
        bedrooms: number;
        bathrooms: number;
        yearBuilt: number;
        lotSize?: number;
        features: string[];
    };
    location: {
        latitude: number;
        longitude: number;
        city: string;
        state: string;
        zipCode: string;
    };
    vastuScore?: number;
    climateRiskScore?: number;
}

export interface ValuationResult {
    estimatedValue: number;
    lowEstimate: number;
    highEstimate: number;
    confidence: number;
    comparables: ComparableProperty[];
    adjustments: Record<string, number>;
    marketTrends: {
        appreciation: number;
        daysOnMarket: number;
        pricePerSqFt: number;
    };
}

export interface ComparableProperty {
    address: string;
    price: number;
    squareFeet: number;
    bedrooms: number;
    bathrooms: number;
    soldDate: string;
    distance: number;
    adjustedPrice: number;
}

// Blockchain types
export interface BlockchainConfig {
    network: 'mainnet' | 'polygon' | 'mumbai' | 'localhost';
    rpcUrl: string;
    contractAddress: string;
    privateKey?: string;
}

export interface PropertyRegistration {
    propertyId: string;
    dataHash: string;
    ownerAddress: string;
    timestamp: number;
}

export interface OwnershipTransfer {
    propertyId: string;
    fromAddress: string;
    toAddress: string;
    transactionHash: string;
    blockNumber: number;
}

// IoT types
export interface SensorConfig {
    sensorId: string;
    propertyId: string;
    type: string;
    interval: number;
    thresholds: {
        min?: number;
        max?: number;
        warning?: number;
        critical?: number;
    };
}

export interface SensorReading {
    sensorId: string;
    value: number;
    unit: string;
    timestamp: Date;
    quality: 'GOOD' | 'FAIR' | 'POOR' | 'ERROR';
}

export interface EnergyAnalysis {
    score: number;
    grade: string;
    consumption: {
        current: number;
        average: number;
        trend: number;
    };
    efficiency: {
        hvac: number;
        lighting: number;
        appliances: number;
        solar?: number;
    };
    recommendations: string[];
    potentialSavings: number;
}

// DAO types
export interface ProposalCreation {
    title: string;
    description: string;
    category: string;
    votingPeriodDays: number;
    executionData?: any;
}

export interface VotingPower {
    karma: number;
    tokens: number;
    total: number;
    multiplier: number;
}

export interface ProposalVoteSummary {
    forVotes: number;
    againstVotes: number;
    abstainVotes: number;
    totalVotes: number;
    quorumReached: boolean;
    passed: boolean;
}

// Email types
export interface EmailTemplate {
    subject: string;
    html: string;
    text?: string;
}

export interface EmailRecipient {
    email: string;
    name?: string;
}

export interface SendEmailParams {
    to: EmailRecipient | EmailRecipient[];
    template: string;
    data: Record<string, any>;
}

// Search types
export interface NLPSearchResult {
    query: string;
    parsedFilters: Record<string, any>;
    confidence: number;
    suggestions: string[];
}

// Cache types
export interface CacheOptions {
    ttl?: number;
    tags?: string[];
}

// Job types
export interface AsyncJob {
    id: string;
    type: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    data: any;
    result?: any;
    error?: string;
    createdAt: Date;
    completedAt?: Date;
}

// Webhook types
export interface WebhookPayload {
    event: string;
    timestamp: string;
    data: any;
    signature?: string;
}
