// Shared TypeScript Types for Frontend

// User types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    profilePhotoUrl?: string;
    userType: 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
    dateOfBirth?: string;
    birthTime?: string;
    birthPlace?: string;
    walletAddress?: string;
    createdAt: string;
}

// Property types
export interface Property {
    id: string;
    title: string;
    description: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
    price: number;
    pricePerSquareFoot?: number;
    propertyType: 'HOUSE' | 'CONDO' | 'TOWNHOUSE' | 'VILLA' | 'LAND' | 'COMMERCIAL';
    listingType: 'SALE' | 'RENT' | 'LEASE';
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    lotSize?: number;
    yearBuilt?: number;
    parkingSpaces?: number;
    features: string[];
    status: 'ACTIVE' | 'PENDING' | 'SOLD' | 'RENTED' | 'WITHDRAWN';
    photos: PropertyPhoto[];
    vastuAnalysis?: VastuAnalysis[];
    climateAnalysis?: ClimateAnalysis;
    listingAgent?: Agent;
    createdAt: string;
}

export interface PropertyPhoto {
    id: string;
    url: string;
    caption?: string;
    isPrimary: boolean;
    order: number;
}

// Vastu types
export interface VastuAnalysis {
    id: string;
    propertyId: string;
    overallScore: number;
    grade: string;
    northScore: number;
    southScore: number;
    eastScore: number;
    westScore: number;
    northEastScore: number;
    northWestScore: number;
    southEastScore: number;
    southWestScore: number;
    centerScore: number;
    entranceScore: number;
    defects: VastuDefect[];
    remedies: VastuRemedy[];
    recommendations: string[];
    createdAt: string;
}

export interface VastuDefect {
    type: string;
    severity: 'MINOR' | 'MODERATE' | 'MAJOR' | 'CRITICAL';
    description: string;
    direction?: string;
}

export interface VastuRemedy {
    type: string;
    description: string;
    cost?: 'LOW' | 'MEDIUM' | 'HIGH';
    effectiveness: number;
}

// Climate types
export interface ClimateAnalysis {
    id: string;
    propertyId: string;
    overallRiskScore: number;
    riskGrade: string;
    floodRiskCurrent: number;
    floodRisk2050: number;
    wildfireRisk: number;
    hurricaneRisk: number;
    seismicRisk: number;
    heatRisk: number;
    insuranceCurrent?: number;
    insurance2030?: number;
    insurance2050?: number;
    recommendations: string[];
    createdAt: string;
}

// Agent types
export interface Agent {
    id: string;
    userId: string;
    user: User;
    licenseNumber: string;
    licenseState: string;
    brokerage?: string;
    bio?: string;
    yearsExperience?: number;
    specialties: string[];
    languages: string[];
    rating?: number;
    reviewCount?: number;
    ethicsScore?: number;
    verified: boolean;
    subscriptionTier: 'KARMIC' | 'DHARMIC' | 'ENLIGHTENED';
    listings?: Property[];
}

export interface AgentReview {
    id: string;
    agentId: string;
    reviewerId: string;
    reviewer: User;
    rating: number;
    comment?: string;
    transactionType: 'BUY' | 'SELL' | 'RENT';
    createdAt: string;
}

// DAO types
export interface DAOProposal {
    id: string;
    proposerId: string;
    proposer: User;
    title: string;
    description: string;
    category: 'PLATFORM_FEE' | 'NEW_FEATURE' | 'COMMUNITY' | 'PARTNERSHIP' | 'GOVERNANCE' | 'OTHER';
    status: 'PENDING' | 'ACTIVE' | 'PASSED' | 'REJECTED' | 'EXECUTED';
    votingEnds?: string;
    quorumRequired?: number;
    executionData?: any;
    createdAt: string;
}

export interface DAOVote {
    id: string;
    proposalId: string;
    voterId: string;
    voter: User;
    vote: 'FOR' | 'AGAINST' | 'ABSTAIN';
    votingPower: number;
    comment?: string;
    createdAt: string;
}

// IoT types
export interface IoTSensor {
    id: string;
    propertyId: string;
    sensorType: 'TEMPERATURE' | 'HUMIDITY' | 'AIR_QUALITY' | 'CO2' | 'NOISE' | 'LIGHT' | 'POWER' | 'SOLAR' | 'WATER' | 'GAS';
    manufacturer?: string;
    model?: string;
    location?: string;
    status: 'ONLINE' | 'OFFLINE' | 'ERROR';
    lastReading?: string;
}

export interface IoTReading {
    id: string;
    sensorId: string;
    value: number;
    unit: string;
    timestamp: string;
}

export interface EnvironmentalSnapshot {
    temperature?: number;
    humidity?: number;
    airQuality?: number;
    co2Level?: number;
    noise?: number;
    light?: number;
    comfortIndex?: number;
    lastUpdated?: string;
}

// Blockchain types
export interface BlockchainRecord {
    id: string;
    propertyId: string;
    transactionHash: string;
    blockNumber: number;
    network: string;
    eventType: 'REGISTRATION' | 'TRANSFER' | 'UPDATE';
    status: 'PENDING' | 'CONFIRMED' | 'FAILED';
    timestamp: string;
}

export interface FractionalShare {
    id: string;
    propertyId: string;
    totalShares: number;
    availableShares: number;
    pricePerShare: number;
    minInvestment: number;
    maxSharesPerInvestor: number;
}

// Valuation types
export interface PropertyValuation {
    id: string;
    propertyId: string;
    estimatedValue: number;
    lowEstimate: number;
    highEstimate: number;
    confidenceLevel: number;
    methodology: string;
    comparablesUsed: number;
    adjustments?: Record<string, number>;
    marketConditions?: string;
    vastuAdjustment?: number;
    valuationDate: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

// Search types
export interface SearchFilters {
    query?: string;
    propertyType?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minSquareFeet?: number;
    maxSquareFeet?: number;
    minVastuScore?: number;
    maxClimateRisk?: number;
    city?: string;
    state?: string;
    features?: string[];
}

// Notification types
export interface Notification {
    id: string;
    userId: string;
    type: 'PROPERTY_ALERT' | 'INQUIRY' | 'PRICE_DROP' | 'IOT_ALERT' | 'DAO_VOTE' | 'MESSAGE';
    title: string;
    message: string;
    read: boolean;
    data?: any;
    createdAt: string;
}

