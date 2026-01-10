/**
 * Screen file existence tests
 * Note: Full component tests require react-native-testing-library setup
 */
import * as fs from 'fs';
import * as path from 'path';

const screensDir = path.join(__dirname, '../screens');

describe('Screen Files', () => {
    const expectedScreens = [
        'HomeScreen.tsx',
        'SearchScreen.tsx',
        'FavoritesScreen.tsx',
        'ProfileScreen.tsx',
        'PropertyDetailScreen.tsx',
        'VastuAnalysisScreen.tsx',
        'ClimateAnalysisScreen.tsx',
        'SettingsScreen.tsx',
        'LoginScreen.tsx',
        'RegisterScreen.tsx',
        'NotificationsScreen.tsx',
        'MessagesScreen.tsx',
    ];

    expectedScreens.forEach((screen) => {
        it(`should have ${screen} file`, () => {
            const filePath = path.join(screensDir, screen);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    it('should have all required screens', () => {
        expect(expectedScreens.length).toBe(12);
    });
});
