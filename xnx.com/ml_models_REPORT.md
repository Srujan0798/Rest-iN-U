# ML Models Report

## 🚀 Vision

To provide intelligent, data-driven insights for the real estate platform.

## Phase 1: Data Collection

**Goal**: Gather datasets for training.

- [ ] **Sources**: Identify data sources (public records, user behavior).
- [ ] **Pipeline**: Build a scraping/ingestion pipeline.
- [ ] **Storage**: Store raw data in a data lake (S3/Azure Blob).

## Phase 2: Model Training

**Goal**: Develop predictive models.

- [ ] **Price Prediction**: Train regression models (XGBoost/LightGBM) on property data.
- [ ] **Recommendation**: Train collaborative filtering models on user interactions.
- [ ] **Image Analysis**: Train CNNs for property image classification (e.g., "Modern Kitchen").

## Phase 3: Deployment

**Goal**: Serve models via API.

- [ ] **Serialization**: Save trained models (Pickle/ONNX).
- [ ] **API**: Wrap models in a Flask/FastAPI service (integrated with `backend/ai_ml`).
- [ ] **Monitoring**: Track model drift and accuracy over time.

## 🛠️ Technical Debt & Maintenance

- [ ] **Versioning**: Use DVC (Data Version Control) for datasets and models.
- [ ] **Reproducibility**: Ensure training environments are containerized (Docker).
