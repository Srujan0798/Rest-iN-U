/**
 * @jest-environment node
 */

// Mock expo modules before importing api
jest.mock('expo-secure-store', () => ({
    getItemAsync: jest.fn(),
    setItemAsync: jest.fn(),
    deleteItemAsync: jest.fn(),
}));

jest.mock('expo-constants', () => ({
    expoConfig: { extra: { apiUrl: 'http://test-api.com' } },
}));

// Mock axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        get: jest.fn(),
        post: jest.fn(),
        delete: jest.fn(),
        put: jest.fn(),
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
    })),
}));

import api from '../services/api';

describe('API Service', () => {
    it('should be importable', () => {
        expect(api).toBeDefined();
    });

    it('should have getFeaturedProperties method', () => {
        expect(typeof api.getFeaturedProperties).toBe('function');
    });

    it('should have searchProperties method', () => {
        expect(typeof api.searchProperties).toBe('function');
    });

    it('should have getProperty method', () => {
        expect(typeof api.getProperty).toBe('function');
    });

    it('should have getVastuAnalysis method', () => {
        expect(typeof api.getVastuAnalysis).toBe('function');
    });

    it('should have getClimateAnalysis method', () => {
        expect(typeof api.getClimateAnalysis).toBe('function');
    });
});
