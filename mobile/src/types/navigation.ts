// Navigation type definitions for REST-iN-U Mobile App

export type RootStackParamList = {
    Main: undefined;
    PropertyDetail: { propertyId: string };
    VastuAnalysis: { propertyId: string };
    Login: undefined;
    Register: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Search: undefined;
    Favorites: undefined;
    Profile: undefined;
};

// Property types
export interface Property {
    id: string;
    title: string;
    description: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    propertyType: PropertyType;
    listingType: 'SALE' | 'RENT' | 'LEASE';
    status: 'ACTIVE' | 'PENDING' | 'SOLD';
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
    latitude: number;
    longitude: number;
    photos: PropertyPhoto[];
    vastuScore?: number;
    vastuGrade?: string;
    climateRiskScore?: number;
    listedDate: string;
    daysOnMarket: number;
    features: string[];
    amenities: string[];
}

export type PropertyType =
    | 'HOUSE'
    | 'CONDO'
    | 'TOWNHOUSE'
    | 'VILLA'
    | 'PENTHOUSE'
    | 'APARTMENT'
    | 'ASHRAM'
    | 'PLOT'
    | 'COMMERCIAL'
    | 'LAND'
    | 'MULTI_FAMILY'
    | 'FARMHOUSE';

export interface PropertyPhoto {
    id: string;
    url: string;
    thumbnailUrl?: string;
    caption?: string;
    order: number;
}

// User types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    userType: 'BUYER' | 'SELLER' | 'AGENT' | 'INVESTOR';
    profilePhotoUrl?: string;
    doshaType?: 'VATA' | 'PITTA' | 'KAPHA' | 'VATA_PITTA' | 'PITTA_KAPHA' | 'VATA_KAPHA' | 'TRIDOSHA';
}

// Vastu types
export interface VastuAnalysis {
    id: string;
    propertyId: string;
    overallScore: number;
    grade: string;
    entranceDirection: string;
    recommendations: VastuRecommendation[];
    issues: VastuIssue[];
    remedies: VastuRemedy[];
}

export interface VastuRecommendation {
    type: string;
    description: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface VastuIssue {
    area: string;
    issue: string;
    severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
}

export interface VastuRemedy {
    issue: string;
    remedy: string;
    cost?: string;
    effectiveness: number;
}

// Search filters
export interface PropertyFilters {
    query?: string;
    propertyType?: PropertyType[];
    listingType?: 'SALE' | 'RENT' | 'LEASE';
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    minSquareFeet?: number;
    maxSquareFeet?: number;
    minVastuScore?: number;
    maxClimateRisk?: number;
    city?: string;
    state?: string;
    latitude?: number;
    longitude?: number;
    radiusMiles?: number;
}
