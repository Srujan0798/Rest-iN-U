# Deep Implementation Plan: Mobile

## Goal

Deliver a native iOS and Android experience that brings the power of Rest-iN-U to the user's fingertips, leveraging device capabilities like GPS and Camera.

## Phase 1: Environment Setup

**Objective**: Prepare the local environment for React Native/Expo development.

### Review Environment (VERIFIED)

- **Node.js**: ❌ **MISSING**. Critical for Expo CLI.
- **Expo CLI**: Not installed globally (recommended) or locally.
- **Emulators**: Android Studio / Xcode required for local simulation.

### Action

- **CRITICAL**: Install Node.js 18+ (LTS).
- Install Expo Go on your physical device for easiest testing.
- **Recommendation**: Use `npx expo start` to avoid global version conflicts.

## Phase 2: Dependency Management

**Objective**: Install and verify mobile libraries.

### Review Dependencies (VERIFIED)

- **node_modules**: ❌ **MISSING**.
- **Key Libraries**: `expo` (v50), `react-native` (0.73), `react-native-maps`, `zustand`.

### Action

- Run `npm install` in `mobile/` (Requires Node.js).
- **Recommendation**: Use `npx expo install` when adding new libraries to ensure compatibility.

## Phase 3: Development & Simulation

**Objective**: Run the app locally.

### Review Config

- `app.json`: Configured for "REST-iN-U" (slug: `rest-in-u`).
- **Maps**: Google Maps API key is placeholder (`YOUR_GOOGLE_MAPS_API_KEY`).

### Action

- Update `app.json` with a valid Google Maps API Key.
- Run `npx expo start`.
- Scan QR code with Expo Go (Android/iOS).

## Phase 4: Build & Publish

**Objective**: Prepare for App Store / Play Store.

### Review Build

- **EAS**: Expo Application Services config is missing (`eas.json`).

### Action

- Install EAS CLI: `npm install -g eas-cli`.
- Configure build: `eas build:configure`.
- **Recommendation**: Use EAS Build for cloud builds to avoid setting up native environments locally.
