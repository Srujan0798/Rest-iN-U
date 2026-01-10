export type RootStackParamList = {
    Main: undefined;
    PropertyDetail: { propertyId: string };
    VastuAnalysis: { propertyId: string };
    ClimateAnalysis: { propertyId: string };
    Login: undefined;
    Register: undefined;
    Settings: undefined;
    Notifications: undefined;
    Messages: undefined;
};

export type MainTabParamList = {
    Home: undefined;
    Search: undefined;
    Favorites: undefined;
    Profile: undefined;
};

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Property {
    id: string;
    title: string;
    description?: string;
    price: number;
    address?: string;
    city: string;
    state: string;
    zipCode?: string;
    country?: string;
    type?: string;
    propertyType?: string;
    listingType?: string;
    status?: string;
    bedrooms: number;
    bathrooms: number;
    sqft?: number;
    squareFeet?: number;
    image?: string;
    images?: string[];
    features?: string[];
    location?: {
        lat: number;
        lng: number;
    };
    vastuScore?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PropertyFilters {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string[];
    minVastuScore?: number;
    amenities?: string[];
}

export interface VastuAnalysis {
    score: number;
    summary: string;
    recommendations: string[];
    details: {
        entrance: string;
        kitchen: string;
        bedroom: string;
        bathroom: string;
        livingRoom: string;
    };
}
