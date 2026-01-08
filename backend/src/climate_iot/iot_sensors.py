"""
=============================================================================
SPRINT 9-10: IOT SENSOR NETWORK
Dharma Realty - Climate & IoT Module
=============================================================================

12+ Sensor Types, Real-Time Monitoring, Alert System
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass
from enum import Enum
import random
import json


class SensorType(Enum):
    """Types of IoT sensors"""
    TEMPERATURE = "Temperature"
    HUMIDITY = "Humidity"
    AIR_QUALITY = "Air Quality (AQI)"
    CO2 = "CO2"
    VOC = "Volatile Organic Compounds"
    PARTICULATE = "Particulate Matter (PM2.5/PM10)"
    NOISE = "Noise Level"
    LIGHT = "Light Intensity"
    MOTION = "Motion"
    DOOR_WINDOW = "Door/Window Contact"
    WATER_LEAK = "Water Leak"
    SMOKE = "Smoke"
    GAS = "Gas Leak"
    RADON = "Radon"
    ELECTRICITY = "Electricity Usage"


class AlertSeverity(Enum):
    """Alert severity levels"""
    INFO = "Info"
    WARNING = "Warning"
    CRITICAL = "Critical"
    EMERGENCY = "Emergency"


@dataclass
class Sensor:
    """IoT Sensor definition"""
    sensor_id: str
    sensor_type: SensorType
    location: str
    room: str
    status: str  # Online/Offline/Maintenance
    battery_level: int
    last_reading: float
    last_reading_time: datetime
    calibration_date: datetime
    thresholds: Dict


@dataclass
class SensorReading:
    """Individual sensor reading"""
    reading_id: str
    sensor_id: str
    sensor_type: SensorType
    value: float
    unit: str
    timestamp: datetime
    quality: str  # Good/Fair/Poor
    triggered_alert: bool


@dataclass
class Alert:
    """Alert generated from sensor readings"""
    alert_id: str
    sensor_id: str
    severity: AlertSeverity
    message: str
    value: float
    threshold: float
    timestamp: datetime
    acknowledged: bool
    resolved: bool
    resolution_time: Optional[datetime]


@dataclass
class SensorNetwork:
    """Complete sensor network status"""
    property_id: str
    total_sensors: int
    online_sensors: int
    offline_sensors: int
    sensors: List[Sensor]
    active_alerts: List[Alert]
    daily_readings: int
    network_health: str


class IoTSensorManager:
    """
    IoT Sensor Network Management System
    Implements: Multi-sensor support, Real-time monitoring, Alerts
    """
    
    # Sensor units and thresholds
    SENSOR_CONFIG = {
        SensorType.TEMPERATURE: {
            "unit": "°C",
            "min_threshold": 10,
            "max_threshold": 35,
            "optimal_min": 20,
            "optimal_max": 26
        },
        SensorType.HUMIDITY: {
            "unit": "%",
            "min_threshold": 20,
            "max_threshold": 80,
            "optimal_min": 40,
            "optimal_max": 60
        },
        SensorType.AIR_QUALITY: {
            "unit": "AQI",
            "min_threshold": 0,
            "max_threshold": 150,
            "optimal_min": 0,
            "optimal_max": 50
        },
        SensorType.CO2: {
            "unit": "ppm",
            "min_threshold": 400,
            "max_threshold": 1000,
            "optimal_min": 400,
            "optimal_max": 600
        },
        SensorType.VOC: {
            "unit": "ppb",
            "min_threshold": 0,
            "max_threshold": 500,
            "optimal_min": 0,
            "optimal_max": 100
        },
        SensorType.PARTICULATE: {
            "unit": "μg/m³",
            "min_threshold": 0,
            "max_threshold": 60,
            "optimal_min": 0,
            "optimal_max": 12
        },
        SensorType.NOISE: {
            "unit": "dB",
            "min_threshold": 0,
            "max_threshold": 70,
            "optimal_min": 0,
            "optimal_max": 45
        },
        SensorType.LIGHT: {
            "unit": "lux",
            "min_threshold": 0,
            "max_threshold": 10000,
            "optimal_min": 300,
            "optimal_max": 500
        },
        SensorType.ELECTRICITY: {
            "unit": "kWh",
            "min_threshold": 0,
            "max_threshold": 1000,
            "optimal_min": 0,
            "optimal_max": 30
        }
    }
    
    def __init__(self, property_id: str):
        self.property_id = property_id
        self.sensors: Dict[str, Sensor] = {}
        self.readings: List[SensorReading] = []
        self.alerts: List[Alert] = []
        self.alert_callbacks: List[Callable] = []
        self._reading_counter = 0
        self._alert_counter = 0
    
    def register_sensor(self, sensor_type: SensorType, location: str,
                       room: str) -> Sensor:
        """Register a new sensor in the network"""
        
        sensor_id = f"S-{len(self.sensors) + 1:04d}"
        config = self.SENSOR_CONFIG.get(sensor_type, {})
        
        sensor = Sensor(
            sensor_id=sensor_id,
            sensor_type=sensor_type,
            location=location,
            room=room,
            status="Online",
            battery_level=100,
            last_reading=0.0,
            last_reading_time=datetime.now(),
            calibration_date=datetime.now(),
            thresholds={
                "min": config.get("min_threshold", 0),
                "max": config.get("max_threshold", 100),
                "optimal_min": config.get("optimal_min", 20),
                "optimal_max": config.get("optimal_max", 80)
            }
        )
        
        self.sensors[sensor_id] = sensor
        return sensor
    
    def ingest_reading(self, sensor_id: str, value: float,
                      timestamp: datetime = None) -> SensorReading:
        """Ingest a new reading from a sensor"""
        
        if sensor_id not in self.sensors:
            raise ValueError(f"Sensor {sensor_id} not found")
        
        sensor = self.sensors[sensor_id]
        config = self.SENSOR_CONFIG.get(sensor.sensor_type, {})
        
        if timestamp is None:
            timestamp = datetime.now()
        
        self._reading_counter += 1
        reading_id = f"R-{self._reading_counter:08d}"
        
        # Determine reading quality
        quality = self._assess_reading_quality(value, sensor.sensor_type)
        
        # Check if alert should be triggered
        triggered_alert = self._check_thresholds(sensor, value)
        
        reading = SensorReading(
            reading_id=reading_id,
            sensor_id=sensor_id,
            sensor_type=sensor.sensor_type,
            value=value,
            unit=config.get("unit", ""),
            timestamp=timestamp,
            quality=quality,
            triggered_alert=triggered_alert
        )
        
        # Update sensor
        sensor.last_reading = value
        sensor.last_reading_time = timestamp
        
        # Store reading
        self.readings.append(reading)
        
        # Generate alert if needed
        if triggered_alert:
            self._generate_alert(sensor, value)
        
        return reading
    
    def get_current_readings(self) -> Dict[str, Dict]:
        """Get current readings from all sensors"""
        
        current = {}
        for sensor_id, sensor in self.sensors.items():
            config = self.SENSOR_CONFIG.get(sensor.sensor_type, {})
            current[sensor_id] = {
                "sensor_type": sensor.sensor_type.value,
                "location": sensor.location,
                "room": sensor.room,
                "value": sensor.last_reading,
                "unit": config.get("unit", ""),
                "quality": self._assess_reading_quality(sensor.last_reading, sensor.sensor_type),
                "timestamp": sensor.last_reading_time.isoformat(),
                "status": sensor.status
            }
        return current
    
    def get_sensor_history(self, sensor_id: str, hours: int = 24) -> List[Dict]:
        """Get historical readings for a sensor"""
        
        cutoff = datetime.now() - timedelta(hours=hours)
        history = [
            {
                "value": r.value,
                "timestamp": r.timestamp.isoformat(),
                "quality": r.quality
            }
            for r in self.readings
            if r.sensor_id == sensor_id and r.timestamp > cutoff
        ]
        return history
    
    def get_active_alerts(self) -> List[Alert]:
        """Get all active (unresolved) alerts"""
        return [a for a in self.alerts if not a.resolved]
    
    def acknowledge_alert(self, alert_id: str) -> bool:
        """Acknowledge an alert"""
        for alert in self.alerts:
            if alert.alert_id == alert_id:
                alert.acknowledged = True
                return True
        return False
    
    def resolve_alert(self, alert_id: str) -> bool:
        """Resolve an alert"""
        for alert in self.alerts:
            if alert.alert_id == alert_id:
                alert.resolved = True
                alert.resolution_time = datetime.now()
                return True
        return False
    
    def get_network_status(self) -> SensorNetwork:
        """Get overall network status"""
        
        online = sum(1 for s in self.sensors.values() if s.status == "Online")
        offline = len(self.sensors) - online
        active_alerts = [a for a in self.alerts if not a.resolved]
        
        # Determine network health
        if offline == 0 and len(active_alerts) == 0:
            health = "Excellent"
        elif offline <= 1 and len([a for a in active_alerts if a.severity == AlertSeverity.CRITICAL]) == 0:
            health = "Good"
        elif offline <= 2:
            health = "Fair"
        else:
            health = "Poor"
        
        # Count today's readings
        today = datetime.now().date()
        daily = sum(1 for r in self.readings if r.timestamp.date() == today)
        
        return SensorNetwork(
            property_id=self.property_id,
            total_sensors=len(self.sensors),
            online_sensors=online,
            offline_sensors=offline,
            sensors=list(self.sensors.values()),
            active_alerts=active_alerts,
            daily_readings=daily,
            network_health=health
        )
    
    def calculate_comfort_score(self) -> Dict:
        """Calculate overall comfort score based on sensor readings"""
        
        scores = {}
        weights = {
            SensorType.TEMPERATURE: 0.25,
            SensorType.HUMIDITY: 0.20,
            SensorType.AIR_QUALITY: 0.25,
            SensorType.CO2: 0.15,
            SensorType.NOISE: 0.10,
            SensorType.LIGHT: 0.05
        }
        
        for sensor in self.sensors.values():
            if sensor.sensor_type in weights:
                score = self._calculate_sensor_score(sensor)
                scores[sensor.sensor_type.value] = score
        
        # Calculate weighted average
        total_weight = 0
        weighted_sum = 0
        for sensor_type, weight in weights.items():
            if sensor_type.value in scores:
                weighted_sum += scores[sensor_type.value] * weight
                total_weight += weight
        
        overall = weighted_sum / total_weight if total_weight > 0 else 50
        
        return {
            "overall_score": round(overall, 1),
            "category": self._score_to_category(overall),
            "component_scores": scores,
            "recommendations": self._generate_comfort_recommendations(scores)
        }
    
    def register_alert_callback(self, callback: Callable):
        """Register a callback for alerts"""
        self.alert_callbacks.append(callback)
    
    def simulate_readings(self, duration_hours: int = 24):
        """Simulate sensor readings for testing"""
        
        for sensor in self.sensors.values():
            config = self.SENSOR_CONFIG.get(sensor.sensor_type, {})
            optimal_min = config.get("optimal_min", 20)
            optimal_max = config.get("optimal_max", 80)
            
            for hour in range(duration_hours):
                timestamp = datetime.now() - timedelta(hours=duration_hours - hour)
                
                # Generate value around optimal range
                mid = (optimal_min + optimal_max) / 2
                variation = (optimal_max - optimal_min) / 4
                value = mid + random.uniform(-variation, variation)
                
                self.ingest_reading(sensor.sensor_id, value, timestamp)
    
    def _assess_reading_quality(self, value: float, sensor_type: SensorType) -> str:
        """Assess reading quality based on optimal ranges"""
        
        config = self.SENSOR_CONFIG.get(sensor_type, {})
        optimal_min = config.get("optimal_min", 20)
        optimal_max = config.get("optimal_max", 80)
        
        if optimal_min <= value <= optimal_max:
            return "Good"
        elif value < optimal_min * 0.8 or value > optimal_max * 1.2:
            return "Poor"
        else:
            return "Fair"
    
    def _check_thresholds(self, sensor: Sensor, value: float) -> bool:
        """Check if value exceeds thresholds"""
        return value < sensor.thresholds["min"] or value > sensor.thresholds["max"]
    
    def _generate_alert(self, sensor: Sensor, value: float):
        """Generate an alert for threshold violation"""
        
        self._alert_counter += 1
        alert_id = f"A-{self._alert_counter:06d}"
        
        config = self.SENSOR_CONFIG.get(sensor.sensor_type, {})
        threshold = sensor.thresholds["max"] if value > sensor.thresholds["max"] else sensor.thresholds["min"]
        
        # Determine severity
        if value > sensor.thresholds["max"] * 1.5 or value < sensor.thresholds["min"] * 0.5:
            severity = AlertSeverity.CRITICAL
        elif value > sensor.thresholds["max"] * 1.2 or value < sensor.thresholds["min"] * 0.8:
            severity = AlertSeverity.WARNING
        else:
            severity = AlertSeverity.INFO
        
        message = f"{sensor.sensor_type.value} in {sensor.room}: {value}{config.get('unit', '')} (Threshold: {threshold})"
        
        alert = Alert(
            alert_id=alert_id,
            sensor_id=sensor.sensor_id,
            severity=severity,
            message=message,
            value=value,
            threshold=threshold,
            timestamp=datetime.now(),
            acknowledged=False,
            resolved=False,
            resolution_time=None
        )
        
        self.alerts.append(alert)
        
        # Notify callbacks
        for callback in self.alert_callbacks:
            try:
                callback(alert)
            except Exception:
                pass
    
    def _calculate_sensor_score(self, sensor: Sensor) -> float:
        """Calculate score for individual sensor"""
        
        config = self.SENSOR_CONFIG.get(sensor.sensor_type, {})
        optimal_min = config.get("optimal_min", 20)
        optimal_max = config.get("optimal_max", 80)
        value = sensor.last_reading
        
        if optimal_min <= value <= optimal_max:
            # Within optimal range - score based on how centered
            mid = (optimal_min + optimal_max) / 2
            distance = abs(value - mid) / (optimal_max - mid)
            return 100 - (distance * 20)
        else:
            # Outside optimal range
            if value < optimal_min:
                deviation = (optimal_min - value) / optimal_min
            else:
                deviation = (value - optimal_max) / optimal_max
            return max(0, 80 - (deviation * 50))
    
    def _score_to_category(self, score: float) -> str:
        """Convert score to category"""
        if score >= 90:
            return "Excellent"
        elif score >= 75:
            return "Good"
        elif score >= 60:
            return "Fair"
        elif score >= 40:
            return "Poor"
        else:
            return "Critical"
    
    def _generate_comfort_recommendations(self, scores: Dict) -> List[str]:
        """Generate recommendations based on scores"""
        
        recommendations = []
        
        if scores.get(SensorType.TEMPERATURE.value, 100) < 70:
            recommendations.append("Adjust HVAC temperature settings")
        if scores.get(SensorType.HUMIDITY.value, 100) < 70:
            recommendations.append("Consider using humidifier/dehumidifier")
        if scores.get(SensorType.AIR_QUALITY.value, 100) < 70:
            recommendations.append("Improve ventilation or use air purifier")
        if scores.get(SensorType.CO2.value, 100) < 70:
            recommendations.append("Increase fresh air intake")
        if scores.get(SensorType.NOISE.value, 100) < 70:
            recommendations.append("Investigate noise sources")
        
        return recommendations if recommendations else ["All parameters within optimal range"]


# =============================================================================
# Climate IoT Module Init
# =============================================================================

# Create __init__.py content
__all__ = [
    "ClimateRiskModeler",
    "IoTSensorManager",
    "SensorType",
    "Sensor",
    "SensorReading",
    "Alert"
]


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    manager = IoTSensorManager("PROP-001")
    
    # Register sensors
    temp_sensor = manager.register_sensor(SensorType.TEMPERATURE, "Main Hall", "Living Room")
    humid_sensor = manager.register_sensor(SensorType.HUMIDITY, "Main Hall", "Living Room")
    aqi_sensor = manager.register_sensor(SensorType.AIR_QUALITY, "Main Hall", "Living Room")
    co2_sensor = manager.register_sensor(SensorType.CO2, "Main Hall", "Living Room")
    
    print(f"Registered {len(manager.sensors)} sensors")
    
    # Simulate readings
    manager.simulate_readings(24)
    
    # Get network status
    status = manager.get_network_status()
    print(f"\nNetwork Status:")
    print(f"  Total Sensors: {status.total_sensors}")
    print(f"  Online: {status.online_sensors}")
    print(f"  Network Health: {status.network_health}")
    print(f"  Daily Readings: {status.daily_readings}")
    
    # Get comfort score
    comfort = manager.calculate_comfort_score()
    print(f"\nComfort Score: {comfort['overall_score']}/100 ({comfort['category']})")
