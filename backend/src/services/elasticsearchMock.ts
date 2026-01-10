// Mock Elasticsearch Service for Development
import { logger } from '../utils/logger';

export class MockElasticsearchService {
    constructor() {
        logger.info('Using Mock Elasticsearch Service');
    }

    async createPropertyIndex(): Promise<void> {
        logger.info('Mock: createPropertyIndex called');
        return;
    }

    async indexProperty(property: any): Promise<void> {
        logger.info(`Mock: indexProperty called for ${property.id || property.property_id}`);
        return;
    }

    async bulkIndexProperties(properties: any[]): Promise<any> {
        logger.info(`Mock: bulkIndexProperties called for ${properties.length} properties`);
        return { errors: false, items: properties.map(p => ({ index: { _id: p.id, status: 201 } })) };
    }

    async deleteProperty(propertyId: string): Promise<void> {
        logger.info(`Mock: deleteProperty called for ${propertyId}`);
        return;
    }

    async search(query: any): Promise<any> {
        logger.info('Mock: search called', query);

        // Return dummy data matching the structure
        return {
            total: 5,
            hits: [
                {
                    property_id: 'mock-prop-1',
                    address: {
                        street: '123 Mock Vastu Way',
                        city: 'Bangalore',
                        state: 'KA',
                        zip: '560001',
                        location: { lat: 12.9716, lon: 77.5946 }
                    },
                    basic_info: {
                        price: 15000000,
                        bedrooms: 3,
                        bathrooms: 2,
                        square_feet: 1800,
                        property_type: 'apartment',
                        status: 'active'
                    },
                    scores: {
                        vastu: 95,
                        feng_shui: 88,
                        climate_risk: 12
                    },
                    description: 'A perfectly Vastu compliant mock property for development.',
                    images: ['https://placehold.co/600x400']
                },
                {
                    property_id: 'mock-prop-2',
                    address: {
                        street: '456 Tech Park Rd',
                        city: 'Hyderabad',
                        state: 'TS',
                        zip: '500081',
                        location: { lat: 17.4448, lon: 78.3926 }
                    },
                    basic_info: {
                        price: 25000000,
                        bedrooms: 4,
                        bathrooms: 3,
                        square_feet: 2400,
                        property_type: 'villa',
                        status: 'active'
                    },
                    scores: {
                        vastu: 75,
                        feng_shui: 80,
                        climate_risk: 25
                    },
                    description: 'Luxury villa near tech hub.',
                    images: ['https://placehold.co/600x400']
                }
            ],
            aggregations: {
                price_ranges: { buckets: [] },
                property_types: { buckets: [] },
                bedrooms: { buckets: [] },
                vastu_ranges: { buckets: [] }
            }
        };
    }

    async searchByLocation(lat: number, lng: number, radiusMiles: number, filters?: any): Promise<any[]> {
        logger.info('Mock: searchByLocation called');
        return [];
    }

    async getMapClusters(bounds: any, precision: number = 5): Promise<any[]> {
        logger.info('Mock: getMapClusters called');
        return [
            {
                location: { lat: 12.9716, lon: 77.5946 },
                count: 5,
                avg_price: 15000000,
                price_range: { min: 10000000, max: 20000000 }
            }
        ];
    }

    async findSimilar(propertyId: string, count: number = 5): Promise<any[]> {
        logger.info(`Mock: findSimilar called for ${propertyId}`);
        return [];
    }

    async healthCheck(): Promise<boolean> {
        return true;
    }
}
