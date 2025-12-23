// Constants for the REST-iN-U platform

export const VASTU_DIRECTIONS = [
    'NORTH', 'SOUTH', 'EAST', 'WEST',
    'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST', 'CENTER'
] as const;

export const VASTU_ELEMENTS = {
    NORTH: 'Water',
    SOUTH: 'Fire',
    EAST: 'Air',
    WEST: 'Earth',
    NORTHEAST: 'Water',
    NORTHWEST: 'Air',
    SOUTHEAST: 'Fire',
    SOUTHWEST: 'Earth',
    CENTER: 'Ether',
} as const;

export const VASTU_DEITIES = {
    NORTH: 'Kubera (Wealth)',
    SOUTH: 'Yama (REST-iN-U)',
    EAST: 'Indra (King of Gods)',
    WEST: 'Varuna (Water)',
    NORTHEAST: 'Ishana (Divine)',
    NORTHWEST: 'Vayu (Wind)',
    SOUTHEAST: 'Agni (Fire)',
    SOUTHWEST: 'Nirriti (Protection)',
    CENTER: 'Brahma (Creator)',
} as const;

export const VASTU_IDEAL_ROOMS = {
    NORTH: ['Living Room', 'Office', 'Treasury'],
    SOUTH: ['Bedroom', 'Storage'],
    EAST: ['Prayer Room', 'Living Room', 'Study'],
    WEST: ['Dining Room', 'Children\'s Room'],
    NORTHEAST: ['Prayer Room', 'Meditation', 'Water Feature'],
    NORTHWEST: ['Guest Room', 'Garage', 'Bathroom'],
    SOUTHEAST: ['Kitchen'],
    SOUTHWEST: ['Master Bedroom', 'Safe', 'Heavy Items'],
    CENTER: ['Open Space', 'Courtyard'],
} as const;

export const VASTU_AVOID_ROOMS = {
    NORTH: ['Toilet', 'Kitchen'],
    SOUTH: ['Main Entrance'],
    EAST: ['Toilet', 'Kitchen'],
    WEST: ['Kitchen'],
    NORTHEAST: ['Toilet', 'Kitchen', 'Stairs', 'Heavy Items'],
    NORTHWEST: ['Master Bedroom', 'Kitchen'],
    SOUTHEAST: ['Bedroom', 'Main Entrance'],
    SOUTHWEST: ['Toilet', 'Open Space'],
    CENTER: ['Toilet', 'Kitchen', 'Stairs', 'Pillars'],
} as const;

export const CLIMATE_RISK_THRESHOLDS = {
    LOW: 25,
    MEDIUM: 50,
    HIGH: 75,
    CRITICAL: 100,
} as const;

export const VASTU_SCORE_THRESHOLDS = {
    EXCELLENT: 90,
    GOOD: 75,
    AVERAGE: 60,
    POOR: 45,
    CRITICAL: 0,
} as const;

export const PROPERTY_TYPES = [
    'HOUSE',
    'CONDO',
    'TOWNHOUSE',
    'VILLA',
    'LAND',
    'COMMERCIAL',
] as const;

export const LISTING_TYPES = ['SALE', 'RENT', 'LEASE'] as const;

export const PROPERTY_STATUS = [
    'ACTIVE',
    'PENDING',
    'SOLD',
    'RENTED',
    'WITHDRAWN',
] as const;

export const USER_ROLES = ['BUYER', 'SELLER', 'AGENT', 'ADMIN'] as const;

export const AGENT_TIERS = ['KARMIC', 'DHARMIC', 'ENLIGHTENED'] as const;

export const DAO_CATEGORIES = [
    'PLATFORM_FEE',
    'NEW_FEATURE',
    'COMMUNITY',
    'PARTNERSHIP',
    'GOVERNANCE',
    'OTHER',
] as const;

export const PROPOSAL_STATUS = [
    'PENDING',
    'ACTIVE',
    'PASSED',
    'REJECTED',
    'EXECUTED',
] as const;

export const SENSOR_TYPES = [
    'TEMPERATURE',
    'HUMIDITY',
    'AIR_QUALITY',
    'CO2',
    'NOISE',
    'LIGHT',
    'POWER',
    'SOLAR',
    'WATER',
    'GAS',
] as const;

export const BLOCKCHAIN_NETWORKS = {
    MAINNET: {
        name: 'Ethereum Mainnet',
        chainId: 1,
    },
    POLYGON: {
        name: 'Polygon',
        chainId: 137,
    },
    MUMBAI: {
        name: 'Polygon Mumbai',
        chainId: 80001,
    },
} as const;

export const TOKEN_EXPIRY = {
    ACCESS: '1h',
    REFRESH: '7d',
    RESET_PASSWORD: '1h',
    EMAIL_VERIFICATION: '24h',
} as const;

export const RATE_LIMITS = {
    GENERAL: { windowMs: 15 * 60 * 1000, max: 100 },
    AUTH: { windowMs: 15 * 60 * 1000, max: 10 },
    SEARCH: { windowMs: 60 * 1000, max: 30 },
    API: { windowMs: 60 * 1000, max: 60 },
} as const;

export const CACHE_TTL = {
    SHORT: 60,           // 1 minute
    MEDIUM: 300,         // 5 minutes
    LONG: 3600,          // 1 hour
    DAY: 86400,          // 1 day
    WEEK: 604800,        // 1 week
} as const;

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
} as const;

export const AUSPICIOUS_TITHIS = [
    'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
    'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
    'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima', 'Amavasya'
] as const;

export const NAKSHATRAS = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
    'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
    'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
    'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
    'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
    'Uttara Bhadrapada', 'Revati'
] as const;

export const WEEKDAY_LORDS = {
    0: 'Surya (Sun)',
    1: 'Chandra (Moon)',
    2: 'Mangala (Mars)',
    3: 'Budha (Mercury)',
    4: 'Guru (Jupiter)',
    5: 'Shukra (Venus)',
    6: 'Shani (Saturn)',
} as const;

