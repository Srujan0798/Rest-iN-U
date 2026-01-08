# IoT System Report

## 🚀 Vision

To connect physical world data (climate, energy) with the digital real estate platform.

## Phase 1: Device Simulation

**Goal**: Simulate IoT devices for development.

- [ ] **Scripts**: Create Python scripts to mock sensor data (Temperature, Humidity, AQI).
- [ ] **MQTT**: Set up a local MQTT broker (Mosquitto) for data transmission.

## Phase 2: Data Ingestion

**Goal**: Capture and store IoT data.

- [ ] **Service**: Build a lightweight service (Node/Python) to subscribe to MQTT topics.
- [ ] **Storage**: Store time-series data in TimescaleDB or InfluxDB (or PostgreSQL).

## Phase 3: Integration

**Goal**: Display data in the user dashboard.

- [ ] **API**: Expose data via REST/GraphQL endpoints.
- [ ] **Frontend**: Create real-time charts using Recharts/Chart.js.

## 🛠️ Technical Debt & Maintenance

- [ ] **Security**: Implement TLS for MQTT connections.
- [ ] **Scalability**: Ensure the system can handle thousands of concurrent devices.
