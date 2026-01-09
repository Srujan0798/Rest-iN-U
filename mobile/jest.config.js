module.exports = {
    preset: 'jest-expo',
    setupFilesAfterEnv: ['./jest.setup.js'],
    testPathIgnorePatterns: ['/node_modules/', '/android/', '/ios/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
    transformIgnorePatterns: [
        'node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
    ],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/types/**',
    ],
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
};
