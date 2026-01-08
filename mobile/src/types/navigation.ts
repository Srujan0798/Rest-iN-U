// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  PropertyDetail: { propertyId: string };
  VastuAnalysis: { propertyId: string };
  ClimateAnalysis: { propertyId: string };
  Settings: undefined;
  AgentProfile: { agentId: string };
  Neighborhood: { neighborhoodId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Property Types
export enum PropertyType {
  HOUSE = 'HOUSE',
  APARTMENT = 'APARTMENT',
  CONDO = 'CONDO',
  TOWNHOUSE = 'TOWNHOUSE',
  LAND = 'LAND',
  COMMERCIAL = 'COMMERCIAL',
}

export enum ListingType {
  SALE = 'SALE',
  RENT = 'RENT',
  LEASE = 'LEASE',
}

export enum PropertyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  OFF_MARKET = 'OFF_MARKET',
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  propertyType: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  lotSize?: number;
  yearBuilt?: number;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  images?: string[];
  image?: string;
  features?: string[];
  vastuScore?: number;
  vastuGrade?: string;
  climateRiskScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Vastu Types
export interface VastuAnalysis {
  id: string;
  propertyId: string;
  overallScore: number;
  grade: string;
  entranceDirection: string;
  entranceScore: number;
  rooms: VastuRoom[];
  issues: VastuIssue[];
  remedies: VastuRemedy[];
  positives: string[];
  createdAt: string;
}

export interface VastuRoom {
  name: string;
  direction: string;
  score: number;
  ideal: boolean;
}

export interface VastuIssue {
  area: string;
  issue: string;
  severity: 'minor' | 'major' | 'critical';
}

export interface VastuRemedy {
  issue: string;
  remedy: string;
  cost: string;
}

// Climate Types
export interface ClimateAnalysis {
  id: string;
  propertyId: string;
  overallRiskScore: number;
  riskGrade: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  floodRisk: number;
  floodRisk2030: number;
  floodRisk2050: number;
  floodRisk2100: number;
  wildfireRisk: number;
  hurricaneRisk: number;
  heatRisk: number;
  droughtRisk: number;
  seismicRisk: number;
  insuranceImpact: 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
  summary: string;
  createdAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'AGENT' | 'ADMIN';
  doshaType?: string;
  preferences?: UserPreferences;
  createdAt: string;
}

export interface UserPreferences {
  minVastuScore?: number;
  maxClimateRisk?: number;
  doshaPreference?: string;
  notifications?: boolean;
  darkMode?: boolean;
}

// Agent Types
export interface Agent {
  id: string;
  userId: string;
  licenseNumber: string;
  bio?: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  propertiesListed: number;
  propertiesSold: number;
  verified: boolean;
  user: User;
}

// Search Types
export interface PropertyFilters {
  propertyType?: PropertyType[];
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minBathrooms?: number;
  maxBathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  minVastuScore?: number;
  maxClimateRisk?: number;
  features?: string[];
  sortBy?: 'price' | 'vastuScore' | 'climateRisk' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface SearchResults {
  properties: Property[];
  total: number;
  page: number;
  totalPages: number;
}

// Settings Types
export interface AppSettings {
  notifications: boolean;
  darkMode: boolean;
  minVastuScore: number;
  doshaPreference: string | null;
}
