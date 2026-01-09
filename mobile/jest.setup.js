// Jest setup file for React Native + Expo

// Mock react-native-toast-message
jest.mock('react-native-toast-message', () => ({
    show: jest.fn(),
    hide: jest.fn(),
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
    LinearGradient: 'LinearGradient',
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            goBack: jest.fn(),
        }),
        useRoute: () => ({
            params: {},
        }),
    };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// Silence console warnings in tests
global.console = {
    ...console,
    warn: jest.fn(),
    error: jest.fn(),
};
