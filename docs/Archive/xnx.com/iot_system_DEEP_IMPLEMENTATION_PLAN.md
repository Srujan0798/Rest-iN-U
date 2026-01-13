# Deep Implementation Plan: IoT System

## Goal

Deploy a "Dharmic" IoT controller that schedules sensor readings based on Vedic astrology (Panchang) and auspicious timings (Muhurats).

## Phase 1: Environment Setup

**Objective**: Prepare the runtime environment.

### Review Environment (VERIFIED)

- **Node.js**: ❌ **MISSING**. Critical for running the controller.
- **MQTT Broker**: Code expects `mqtt://localhost:1883`.
- **Database**: Code expects `mongodb://localhost:27017`.

### Action

- **CRITICAL**: Install Node.js 18+ (LTS).
- **Infrastructure**: Use Docker to spin up Mosquitto (MQTT) and MongoDB.
- **Recommendation**: Create a `docker-compose.yml` specifically for the IoT stack.

## Phase 2: Dependency Management

**Objective**: Install required libraries.

### Review Dependencies (VERIFIED)

- **node_modules**: ❌ **MISSING**.
- **Key Libraries**: `mqtt`, `node-schedule`, `axios`, `mongodb`.

### Action

- Run `npm install` in `iot-system/` (Requires Node.js).
- **Recommendation**: Add `dotenv` to manage configuration (Broker URL, DB URL) instead of hardcoding.

## Phase 3: Infrastructure Integration

**Objective**: Connect the controller to the physical/virtual world.

### Review Connections

- **Jyotish API**: Code calls `http://localhost:8001/api/v1/jyotish`. This service must be running (likely part of the Backend).
- **Sensors**: Code subscribes to `sensors/+/data`.

### Action

- Ensure the Backend (Python/Node) is running to serve the Jyotish API.
- Create a "Sensor Simulator" script to publish mock data to MQTT for testing.

## Phase 4: Simulation & Testing

**Objective**: Verify Dharmic logic.

### Review Logic

- **Rahu Kaal**: Verify sensors pause during inauspicious times.
- **Abhijit Muhurat**: Verify sensors take extra readings during auspicious times.

### Action

- Run the controller: `npm start`.
- Monitor logs for "Performing Dharmic reading" and "Skipping... during Rahu Kaal".
- **Recommendation**: Write unit tests for `validateReadingDharmically` to ensure logic is sound.
