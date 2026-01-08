# Future Development Plan: Mobile

## 🚀 Vision

To create a "Pocket Vastu Consultant" that uses Augmented Reality to analyze spaces in real-time.

## Phase 1: AR Vastu Scanner

**Goal**: Visualize Vastu energy fields.

- [ ] **AR Overlay**: Use `expo-gl` or ViroReact to overlay a Vastu compass on the camera feed.
- [ ] **Object Detection**: Detect furniture (Bed, Stove) in real-time and show if placement is auspicious.

## Phase 2: Offline Mode

**Goal**: Functional without internet.

- [ ] **Local Database**: Use `expo-sqlite` or WatermelonDB to sync property data.
- [ ] **Map Caching**: Cache map tiles for offline navigation to properties.

## Phase 3: Biometric Security

**Goal**: Seamless and secure login.

- [ ] **FaceID/TouchID**: Implement `expo-local-authentication` for quick access.
- [ ] **Secure Storage**: Store JWT tokens in the device's secure enclave (`expo-secure-store`).

## 🛠️ Technical Debt & Maintenance

- [ ] **Navigation**: Refactor `react-navigation` stack for deep linking support.
- [ ] **Performance**: Optimize FlatLists for smooth scrolling of property feeds.
- [ ] **Updates**: Configure OTA updates via `expo-updates` to push bug fixes instantly.
