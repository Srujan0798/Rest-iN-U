"""
=============================================================================
API ROUTES: CLIMATE & IOT MODULE
Dharma Realty Platform - Sprint 9-10 API
=============================================================================
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
sys.path.append('..')

from climate_iot import (
    ClimateRiskModeler, ClimateScenario, HazardType,
    IoTSensorManager, SensorType
)


climate_iot_bp = Blueprint('climate_iot', __name__, url_prefix='/api/climate-iot')


# =============================================================================
# CLIMATE RISK ENDPOINTS
# =============================================================================

@climate_iot_bp.route('/climate-risk/assess', methods=['POST'])
def assess_climate_risk():
    """
    Assess climate risk for a property
    
    Request Body:
    {
        "id": "PROP-001",
        "latitude": 19.076,
        "longitude": 72.877,
        "elevation": 15,
        "distance_to_coast": 5,
        "rainfall": 2400
    }
    """
    try:
        data = request.get_json()
        scenario_str = data.pop('scenario', 'SSP2-4.5')
        
        scenario_map = {
            "SSP1-1.9": ClimateScenario.SSP1_19,
            "SSP1-2.6": ClimateScenario.SSP1_26,
            "SSP2-4.5": ClimateScenario.SSP2_45,
            "SSP3-7.0": ClimateScenario.SSP3_70,
            "SSP5-8.5": ClimateScenario.SSP5_85
        }
        
        scenario = scenario_map.get(scenario_str, ClimateScenario.SSP2_45)
        
        modeler = ClimateRiskModeler(scenario)
        assessment = modeler.assess_property_risk(data)
        
        return jsonify({
            "success": True,
            "data": {
                "property_id": assessment.property_id,
                "location": assessment.location,
                "overall_risk_score": assessment.overall_risk_score,
                "investment_rating": assessment.investment_rating,
                "insurance_risk_class": assessment.insurance_risk_class,
                "resilience_score": assessment.resilience_score,
                "estimated_climate_premium": assessment.estimated_climate_premium,
                "projections": {
                    year: {
                        "temperature_change": proj.temperature_change,
                        "sea_level_rise": proj.sea_level_rise,
                        "extreme_heat_days": proj.extreme_heat_days,
                        "flood_probability": proj.flood_probability,
                        "drought_probability": proj.drought_probability
                    }
                    for year, proj in assessment.projections.items()
                },
                "hazard_risks": [{
                    "type": h.hazard_type.value,
                    "current_risk": h.current_risk,
                    "future_risk_2050": h.future_risk_2050,
                    "future_risk_2100": h.future_risk_2100,
                    "mitigation_measures": h.mitigation_measures[:3]
                } for h in assessment.hazard_risks],
                "adaptation_measures": [{
                    "id": m.measure_id,
                    "category": m.category,
                    "description": m.description,
                    "cost": m.implementation_cost,
                    "annual_savings": m.annual_savings,
                    "priority": m.priority
                } for m in assessment.adaptation_measures[:5]]
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@climate_iot_bp.route('/climate-risk/scenarios', methods=['GET'])
def get_climate_scenarios():
    """Get available IPCC climate scenarios"""
    scenarios = []
    for scenario in ClimateScenario:
        scenarios.append({
            "code": scenario.code,
            "pathway": scenario.pathway,
            "temp_rise": scenario.temp_rise,
            "description": scenario.description
        })
    
    return jsonify({"success": True, "data": scenarios})


# =============================================================================
# IOT SENSOR ENDPOINTS
# =============================================================================

# Store sensor managers per property (in production, use database)
_sensor_managers = {}


def get_sensor_manager(property_id: str) -> IoTSensorManager:
    if property_id not in _sensor_managers:
        _sensor_managers[property_id] = IoTSensorManager(property_id)
    return _sensor_managers[property_id]


@climate_iot_bp.route('/iot/sensors', methods=['POST'])
def register_sensor():
    """Register a new IoT sensor"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        sensor_type_str = data.get('sensor_type')
        location = data.get('location')
        room = data.get('room')
        
        if not all([property_id, sensor_type_str, location, room]):
            return jsonify({"success": False, "error": "Missing required fields"}), 400
        
        sensor_type_map = {s.value.lower(): s for s in SensorType}
        sensor_type = sensor_type_map.get(sensor_type_str.lower())
        
        if not sensor_type:
            return jsonify({"success": False, "error": f"Invalid sensor type: {sensor_type_str}"}), 400
        
        manager = get_sensor_manager(property_id)
        sensor = manager.register_sensor(sensor_type, location, room)
        
        return jsonify({
            "success": True,
            "data": {
                "sensor_id": sensor.sensor_id,
                "sensor_type": sensor.sensor_type.value,
                "location": sensor.location,
                "room": sensor.room,
                "status": sensor.status
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@climate_iot_bp.route('/iot/sensors/<property_id>', methods=['GET'])
def get_sensors(property_id):
    """Get all sensors for a property"""
    try:
        manager = get_sensor_manager(property_id)
        
        sensors = []
        for sensor in manager.sensors.values():
            sensors.append({
                "sensor_id": sensor.sensor_id,
                "sensor_type": sensor.sensor_type.value,
                "location": sensor.location,
                "room": sensor.room,
                "status": sensor.status,
                "battery_level": sensor.battery_level,
                "last_reading": sensor.last_reading
            })
        
        return jsonify({"success": True, "data": sensors})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@climate_iot_bp.route('/iot/readings', methods=['POST'])
def ingest_reading():
    """Ingest a sensor reading"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        sensor_id = data.get('sensor_id')
        value = data.get('value')
        
        if not all([property_id, sensor_id, value is not None]):
            return jsonify({"success": False, "error": "Missing required fields"}), 400
        
        manager = get_sensor_manager(property_id)
        reading = manager.ingest_reading(sensor_id, float(value))
        
        return jsonify({
            "success": True,
            "data": {
                "reading_id": reading.reading_id,
                "sensor_id": reading.sensor_id,
                "value": reading.value,
                "unit": reading.unit,
                "quality": reading.quality,
                "triggered_alert": reading.triggered_alert,
                "timestamp": reading.timestamp.isoformat()
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@climate_iot_bp.route('/iot/readings/<property_id>', methods=['GET'])
def get_current_readings(property_id):
    """Get current readings for all sensors"""
    try:
        manager = get_sensor_manager(property_id)
        readings = manager.get_current_readings()
        
        return jsonify({"success": True, "data": readings})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@climate_iot_bp.route('/iot/alerts/<property_id>', methods=['GET'])
def get_alerts(property_id):
    """Get active alerts for a property"""
    try:
        manager = get_sensor_manager(property_id)
        alerts = manager.get_active_alerts()
        
        return jsonify({
            "success": True,
            "data": [{
                "alert_id": a.alert_id,
                "sensor_id": a.sensor_id,
                "severity": a.severity.value,
                "message": a.message,
                "value": a.value,
                "threshold": a.threshold,
                "timestamp": a.timestamp.isoformat(),
                "acknowledged": a.acknowledged
            } for a in alerts]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@climate_iot_bp.route('/iot/comfort/<property_id>', methods=['GET'])
def get_comfort_score(property_id):
    """Get comfort score for a property"""
    try:
        manager = get_sensor_manager(property_id)
        comfort = manager.calculate_comfort_score()
        
        return jsonify({"success": True, "data": comfort})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@climate_iot_bp.route('/iot/network/<property_id>', methods=['GET'])
def get_network_status(property_id):
    """Get sensor network status"""
    try:
        manager = get_sensor_manager(property_id)
        status = manager.get_network_status()
        
        return jsonify({
            "success": True,
            "data": {
                "property_id": status.property_id,
                "total_sensors": status.total_sensors,
                "online_sensors": status.online_sensors,
                "offline_sensors": status.offline_sensors,
                "active_alerts": len(status.active_alerts),
                "daily_readings": status.daily_readings,
                "network_health": status.network_health
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


def register_routes(app):
    """Register all climate/IoT routes with Flask app"""
    app.register_blueprint(climate_iot_bp)
    return app
