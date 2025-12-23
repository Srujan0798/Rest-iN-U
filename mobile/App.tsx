import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PropertyDetailScreen from './src/screens/PropertyDetailScreen';
import VastuAnalysisScreen from './src/screens/VastuAnalysisScreen';
import LoginScreen from './src/screens/LoginScreen';

// Types
import { RootStackParamList, MainTabParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Theme colors
const colors = {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    accent: '#f59e0b',
};

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Search':
                            iconName = focused ? 'search' : 'search-outline';
                            break;
                        case 'Favorites':
                            iconName = focused ? 'heart' : 'heart-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.background,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerStyle: {
                    backgroundColor: colors.surface,
                },
                headerTintColor: colors.text,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'REST-iN-U' }}
            />
            <Tab.Screen
                name="Search"
                component={SearchScreen}
                options={{ title: 'Search' }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoritesScreen}
                options={{ title: 'Favorites' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar style="light" />
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: colors.surface,
                        },
                        headerTintColor: colors.text,
                        contentStyle: {
                            backgroundColor: colors.background,
                        },
                    }}
                >
                    <Stack.Screen
                        name="Main"
                        component={MainTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="PropertyDetail"
                        component={PropertyDetailScreen}
                        options={{ title: 'Property Details' }}
                    />
                    <Stack.Screen
                        name="VastuAnalysis"
                        component={VastuAnalysisScreen}
                        options={{ title: 'Vastu Analysis' }}
                    />
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{
                            title: 'Login',
                            presentation: 'modal',
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

