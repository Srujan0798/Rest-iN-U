# Deep Implementation Plan: ML Models

## Goal

Develop and deploy AI models that blend ancient Vedic wisdom with modern computer vision and data science.

## Phase 1: Environment Setup

**Objective**: Prepare the Python environment for ML workloads.

### Review Environment (VERIFIED)

- **Python**: ✅ **Installed** (v3.13.9).
- **Dependencies**: ❌ **MISSING**. `numpy`, `opencv-python`, `Pillow`, `tensorflow` are not installed.
- **Structure**: Models are organized by domain (`vastu`, `jyotish`, `ayurveda`).

### Action

- Create a `requirements.txt` specifically for `ml-models`.
- Install dependencies: `pip install numpy opencv-python Pillow tensorflow`.
- **Recommendation**: Use a dedicated `venv` or Conda environment for ML to avoid conflicts.

## Phase 2: Data Collection

**Objective**: Gather datasets for training and validation.

### Review Data

- **Vastu**: Need floor plans with labeled rooms and directional data.
- **Jyotish**: Need planetary ephemeris data (Swiss Ephemeris).

### Action

- **Vastu**: Scrape floor plan images or use public datasets (e.g., CubiCasa5k).
- **Jyotish**: Download Swiss Ephemeris files (`.se1`) for high-precision calculations.
- **Recommendation**: Store large datasets in S3/MinIO, not Git.

## Phase 3: Model Training

**Objective**: Train models to detect rooms and score layouts.

### Review Models

- `vastu_analyzer.py`: Uses rule-based logic + CNN for room detection (Mocked).
- `jyotish_property_analyzer.py`: Likely uses astronomical algorithms.

### Action

- **Room Detection**: Train a YOLOv8 or Faster R-CNN model on floor plan data.
- **Vastu Scoring**: Implement the 10,000+ rules engine using a graph database (Neo4j) for complex relationships.
- **Recommendation**: Use MLflow to track experiments and model versions.

## Phase 4: Deployment

**Objective**: Serve models via API.

### Review Deployment

- Current integration is via direct Python import or `api_server.py`.

### Action

- Wrap models in a FastAPI service (`ml-service`).
- Dockerize the service for easy deployment.
- **Recommendation**: Use ONNX Runtime for faster inference in production.
