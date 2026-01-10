/**
 * @jest-environment jsdom
 */
import { RootStackParamList, MainTabParamList, Property } from '../types/navigation';

describe('Navigation Types', () => {
    it('should have correct RootStackParamList routes', () => {
        const routes: (keyof RootStackParamList)[] = [
            'Main',
            'PropertyDetail',
            'VastuAnalysis',
            'ClimateAnalysis',
            'Login',
            'Register',
            'Settings',
            'Notifications',
            'Messages',
        ];
        expect(routes.length).toBe(9);
    });

    it('should have correct MainTabParamList routes', () => {
        const routes: (keyof MainTabParamList)[] = [
            'Home',
            'Search',
            'Favorites',
            'Profile',
        ];
        expect(routes.length).toBe(4);
    });
});

describe('Property Interface', () => {
    it('should create valid property object', () => {
        const property: Property = {
            id: '1',
            title: 'Test Property',
            propertyType: 'HOUSE',
            listingType: 'SALE',
            status: 'ACTIVE',
            price: 500000,
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 2000,
            address: '123 Main St',
            city: 'Test City',
            state: 'CA',
            zipCode: '12345',
            country: 'USA',
        };

        expect(property.id).toBe('1');
        expect(property.propertyType).toBe('HOUSE');
        expect(property.price).toBe(500000);
    });
});
