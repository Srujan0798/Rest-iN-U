# Future Development Plan: ML Models

## 🚀 Vision

To create an "AI Rishi" capable of perceiving the subtle energies of a space and its inhabitants.

## Phase 1: Generative AI

**Goal**: Auto-generate Vastu-compliant designs.

- [ ] **Floor Plan Gen**: Use Stable Diffusion / ControlNet to generate floor plans based on text prompts ("South-facing 3BHK with Vastu compliance").
- [ ] **Remedy Gen**: Generate images showing how to apply Vastu remedies (e.g., "Show where to place the pyramid").

## Phase 2: Multimodal Analysis

**Goal**: Analyze more than just images.

- [ ] **3D Analysis**: Process 3D models (GLB/USDZ) to understand vertical dimensions and energy flow.
- [ ] **Video Walkthrough**: Analyze video tours to detect issues invisible in 2D plans (e.g., beam depth, lighting).

## Phase 3: Personalized Recommendations

**Goal**: Tailor advice to the user's horoscope.

- [ ] **Astro-Vastu**: Correlate the user's birth chart (Janma Kundali) with the property's Vastu.
- [ ] **Muhurat AI**: Predict the exact minute for groundbreaking (Bhoomi Pujan) based on real-time planetary transits.

## 🛠️ Technical Debt & Maintenance

- [ ] **Optimization**: Quantize models (int8) to run on edge devices/mobile.
- [ ] **Explainability**: Implement SHAP/LIME to explain *why* a Vastu score is low.
- [ ] **Testing**: Create a regression test suite with "Golden Floor Plans" that have known scores.
