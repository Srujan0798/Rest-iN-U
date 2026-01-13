# Agent C1 (Kaka) - Priority Task List

**Date:** January 9, 2026
**Goal:** MVP Launch Ready in 1 Week

---

## 🔥 CRITICAL PRIORITY (Do First - 17-23 hours)

### Task 1: Create RegisterScreen ⏱️ 2-3 hours
**Priority:** 🔴 CRITICAL
**Status:** Not Started
**Blocking:** Users cannot sign up

**Implementation Steps:**
1. Create `mobile/src/screens/RegisterScreen.tsx`
2. Copy structure from `LoginScreen.tsx`
3. Add fields: firstName, lastName, email, password, confirmPassword
4. Add validation:
   - All fields required
   - Email format validation
   - Password min 8 characters
   - Password match validation
5. Connect to `POST /api/auth/register` endpoint
6. Add navigation to Login screen
7. Test registration flow

**Files to Create:**
- `mobile/src/screens/RegisterScreen.tsx`

**Files to Modify:**
- `mobile/App.tsx` (add route)

---

### Task 2: Add Error Toast System ⏱️ 2-3 hours
**Priority:** 🔴 CRITICAL
**Status:** Not Started
**Blocking:** Users see no feedback on errors

**Implementation Steps:**
1. Install `react-native-toast-message`
2. Create `mobile/src/utils/toast.ts` utility
3. Add Toast component to `App.tsx`
4. Update all API error handlers in `api.ts`
5. Add toast calls to all screens
6. Test error scenarios

**Files to Create:**
- `mobile/src/utils/toast.ts`

**Files to Modify:**
- `mobile/App.tsx`
- `mobile/src/services/api.ts`
- All screen files with API calls

**Package to Install:**
```bash
cd mobile
npm install react-native-toast-message
```

---

### Task 3: Create ClimateAnalysisScreen ⏱️ 3-4 hours
**Priority:** 🔴 CRITICAL
**Status:** Not Started
**Blocking:** Key differentiator feature missing

**Implementation Steps:**
1. Create `mobile/src/screens/ClimateAnalysisScreen.tsx`
2. Add overall risk score with grade display
3. Add 6 risk type cards (flood, fire, hurricane, heat, drought, seismic)
4. Add projections section (2030, 2050, 2100)
5. Add recommendations section
6. Connect to `GET /api/climate/:propertyId` endpoint
7. Add loading states and error handling
8. Test with sample property

**API Response Structure:**
```typescript
{
  propertyId: string;
  overallRiskGrade: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  overallRiskScore: number; // 0-100
  risks: {
    flood: { current: number; grade: string; };
    wildfire: { current: number; grade: string; };
    hurricane: { current: number; grade: string; };
    heat: { current: number; grade: string; };
    drought: { current: number; grade: string; };
    seismic: { current: number; grade: string; };
  };
  projections: {
    flood: { 2030: number; 2050: number; 2100: number; };
  };
  insuranceImpact: string;
  recommendations: string[];
}
```

**Files to Create:**
- `mobile/src/screens/ClimateAnalysisScreen.tsx`

**Files to Modify:**
- `mobile/App.tsx` (add route)
- `mobile/src/services/api.ts` (verify endpoint)

---

### Task 4: Complete PropertyDetailScreen ⏱️ 4-6 hours
**Priority:** 🔴 CRITICAL
**Status:** Partial (70%)
**Blocking:** Users can't see full property details

**Current Issues:**
- Basic layout only
- Missing full property information
- No image gallery
- Contact agent button not functional

**Implementation Steps:**
1. Read existing `mobile/src/screens/PropertyDetailScreen.tsx`
2. Add image gallery with pagination
3. Add all property details:
   - Price, address, beds, baths, sqft
   - Property description
   - Features list
   - Amenities
4. Add score cards (Vastu, Climate, Feng Shui)
5. Add action buttons:
   - Heart (favorite) - already exists
   - Share property
   - Contact agent (opens messages)
   - Schedule showing
   - View full Vastu analysis
   - View climate analysis
6. Add recently viewed tracking
7. Test navigation and data display

**Files to Modify:**
- `mobile/src/screens/PropertyDetailScreen.tsx`

---

### Task 5: Complete VastuAnalysisScreen ⏱️ 3-4 hours
**Priority:** 🔴 CRITICAL
**Status:** Partial (75%)
**Blocking:** Core ancient wisdom feature incomplete

**Current Issues:**
- Basic 8-zone layout exists
- Needs visual polish
- Missing compass visualization
- Defects/remedies UI needs enhancement

**Implementation Steps:**
1. Read existing `mobile/src/screens/VastuAnalysisScreen.tsx`
2. Add visual compass for direction display
3. Enhance zone display with colors and icons
4. Polish defects section with severity indicators
5. Enhance remedies section with cost estimates
6. Add "Get Vastu Certificate" flow
7. Add share functionality
8. Test with sample property

**Files to Modify:**
- `mobile/src/screens/VastuAnalysisScreen.tsx`

---

### Task 6: Create SettingsScreen ⏱️ 2-3 hours
**Priority:** 🟡 HIGH
**Status:** Not Started
**Blocking:** Users can't configure preferences

**Implementation Steps:**
1. Create `mobile/src/screens/SettingsScreen.tsx`
2. Add sections:
   - **General Settings:**
     - Push notifications toggle
     - Dark mode toggle (already in store)
   - **Vastu Preferences:**
     - Minimum Vastu score slider (50-90)
   - **Ayurvedic Preferences:**
     - Dosha type selector (7 types + Not Set)
   - **Data & Privacy:**
     - Download my data button
     - Clear search history button
     - Privacy policy link
     - Terms of service link
   - **About:**
     - App version display
     - Help & support link
     - Rate us button
3. Connect to appStore for persistence
4. Add logout button
5. Test all toggles and preferences

**Files to Create:**
- `mobile/src/screens/SettingsScreen.tsx`

**Files to Modify:**
- `mobile/App.tsx` (add route)
- `mobile/src/screens/ProfileScreen.tsx` (link to settings)

---

## 📋 TESTING CHECKLIST (After Above Tasks)

### Manual Testing Required

**Registration & Login Flow:**
- [ ] Can register new user with all fields
- [ ] Email validation works
- [ ] Password validation (min 8 chars) works
- [ ] Password match validation works
- [ ] Can login with new credentials
- [ ] Token persists on app reload
- [ ] Can logout successfully

**Property Viewing Flow:**
- [ ] Can browse properties on HomeScreen
- [ ] Can search properties
- [ ] Can view property details
- [ ] Can see all property information
- [ ] Can view Vastu analysis
- [ ] Can view Climate analysis
- [ ] Images load correctly

**Favorites Flow:**
- [ ] Can add property to favorites
- [ ] Can view favorites list
- [ ] Can remove from favorites
- [ ] Favorite persists on app reload

**Error Handling:**
- [ ] API errors show toast messages
- [ ] Offline mode shows error
- [ ] Invalid login shows error
- [ ] Network errors handled gracefully

**Settings Flow:**
- [ ] Can toggle notifications
- [ ] Can set minimum Vastu score
- [ ] Can select dosha type
- [ ] Settings persist on app reload
- [ ] Can clear search history

---

## 🚀 QUICK START GUIDE

### Step-by-Step Execution

**Day 1 (6-8 hours):**
1. Morning: Create RegisterScreen (2-3h)
2. Afternoon: Add Error Toast System (2-3h)
3. Evening: Test registration + errors (1-2h)

**Day 2 (7-9 hours):**
1. Morning: Create ClimateAnalysisScreen (3-4h)
2. Afternoon: Complete PropertyDetailScreen (4-5h)

**Day 3 (5-7 hours):**
1. Morning: Complete VastuAnalysisScreen (3-4h)
2. Afternoon: Create SettingsScreen (2-3h)

**Day 4 (4-6 hours):**
1. Full day: Manual testing all flows
2. Fix any bugs found
3. Polish UI/UX

**Day 5 (Optional Polish):**
1. Add loading skeletons
2. Add animations
3. Improve error messages
4. Final testing

---

## 📦 DELIVERABLES

After completing all tasks, you will have:

### ✅ MVP-Ready Mobile App
- Full user registration and authentication
- Complete property browsing and details
- Full Vastu analysis display
- Full climate risk analysis display
- Settings and preferences management
- Proper error handling with user feedback
- All core user flows working

### ✅ Ready for App Store Beta Testing
- All critical screens implemented
- All critical features working
- Error handling in place
- User feedback mechanisms working

### ⚠️ Still Needed for Production
- Comprehensive testing (Week 2-3)
- Performance optimization
- Security audit
- Additional screens (Messages, Notifications, etc.)

---

## 📞 SUPPORT & RESOURCES

### API Documentation
- Swagger UI: `http://localhost:5000/api/docs` (when backend running)
- Base URL: `https://rest-in-u-backend.onrender.com`

### Design Reference
- Follow existing screen patterns in:
  - `HomeScreen.tsx`
  - `LoginScreen.tsx`
  - `ProfileScreen.tsx`

### Color Scheme (Keep Consistent)
```javascript
colors: {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Purple
  background: '#0f0f23',   // Dark
  surface: '#1a1a2e',      // Lighter dark
  success: '#22c55e',      // Green
  warning: '#f59e0b',      // Amber
  error: '#ef4444',        // Red
  text: '#ffffff',         // White
  textSecondary: '#94a3b8' // Gray
}
```

---

## 🎯 SUCCESS METRICS

After completing all tasks, verify:

- [ ] Users can register and login ✅
- [ ] Users can browse properties ✅
- [ ] Users can view full property details ✅
- [ ] Users can see Vastu analysis ✅
- [ ] Users can see climate risk ✅
- [ ] Users can manage favorites ✅
- [ ] Users can configure settings ✅
- [ ] Errors show helpful messages ✅
- [ ] App feels polished and professional ✅

---

**Agent C1 (Kaka) - Your Mission, Should You Choose to Accept It! 🚀**

This task list will self-destruct in... just kidding! But seriously, tackle these tasks in order for maximum impact. You've got this! 💪
