# Mobile Development Plan

## 🚀 Vision

To deliver a seamless, native mobile experience for iOS and Android users using React Native.

## Phase 1: Environment Setup

**Goal**: Configure local environment for mobile development.

- [ ] **Node.js**: Install Node.js 18+ (LTS).
- [ ] **Expo CLI**: Install globally via `npm install -g expo-cli`.
- [ ] **Simulators**:
  - **Android**: Install Android Studio & set up AVD.
  - **iOS**: Install Xcode (Mac only) or use Expo Go app.

## Phase 2: Dependency Management

**Goal**: Install and verify mobile libraries.

- [ ] **Install**: Run `npm install` in `mobile/`.
- [ ] **Expo Doctor**: Run `npx expo-doctor` to check for issues.
- [ ] **Upgrade**: Run `npx expo upgrade` if needed to match SDK versions.

## Phase 3: Development & Simulation

**Goal**: Run the app locally.

- [ ] **Start Bundler**: Run `npx expo start`.
- [ ] **Run on Android**: Press `a` in terminal.
- [ ] **Run on iOS**: Press `i` in terminal (Mac only).
- [ ] **Run on Physical**: Scan QR code with Expo Go app.

## Phase 4: Build & Publish

**Goal**: Prepare app for store submission.

- [ ] **Prebuild**: Run `npx expo prebuild` to generate native directories.
- [ ] **EAS Build**: Configure EAS (Expo Application Services) for cloud builds.
- [ ] **Submit**: Use `eas submit` to upload to Play Store / App Store.

## 🛠️ Technical Debt & Maintenance

- [ ] **Navigation**: Verify React Navigation flows.
- [ ] **Permissions**: Check Camera/Location permission handling.
- [ ] **Styling**: Ensure responsive design across screen sizes.
