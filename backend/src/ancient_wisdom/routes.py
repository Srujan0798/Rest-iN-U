"""
=============================================================================
API ROUTES: ANCIENT WISDOM MODULE
Dharma Realty Platform - Sprint 7-8 API
=============================================================================
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, date
import sys
sys.path.append('..')

from ancient_wisdom import (
    FengShuiCalculator, Direction, Element,
    VedicAstrologyEngine,
    NumerologyCalculator, NumerologySystem,
    LandEnergyAssessor
)


# Create Blueprint
ancient_wisdom_bp = Blueprint('ancient_wisdom', __name__, url_prefix='/api/ancient-wisdom')


# =============================================================================
# FENG SHUI ENDPOINTS
# =============================================================================

@ancient_wisdom_bp.route('/feng-shui/analyze', methods=['POST'])
def analyze_feng_shui():
    """
    Analyze property Feng Shui
    
    Request Body:
    {
        "property_id": "PROP-001",
        "facing_direction": "south",
        "wood_score": 25,
        "fire_score": 15,
        "earth_score": 20,
        "metal_score": 22,
        "water_score": 18
    }
    """
    try:
        data = request.get_json()
        
        # Map direction string to enum
        direction_map = {
            "north": Direction.NORTH,
            "northeast": Direction.NORTHEAST,
            "east": Direction.EAST,
            "southeast": Direction.SOUTHEAST,
            "south": Direction.SOUTH,
            "southwest": Direction.SOUTHWEST,
            "west": Direction.WEST,
            "northwest": Direction.NORTHWEST
        }
        
        facing = direction_map.get(data.get("facing_direction", "north").lower(), Direction.NORTH)
        
        calculator = FengShuiCalculator()
        report = calculator.analyze_property(data, facing)
        
        return jsonify({
            "success": True,
            "data": {
                "property_id": report.property_id,
                "overall_score": report.overall_score,
                "element_balance": {e.value: v for e, v in report.element_balance.items()},
                "wealth_sectors": [d.value for d in report.wealth_sectors],
                "health_concerns": report.health_concerns,
                "remedies": report.remedies[:5],
                "enhancements": report.enhancements[:5],
                "favorable_rooms": {k: v.value for k, v in report.favorable_rooms.items()},
                "annual_afflictions": report.annual_afflictions
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ancient_wisdom_bp.route('/feng-shui/directions', methods=['GET'])
def get_directions():
    """Get all Feng Shui directions with their elements"""
    calculator = FengShuiCalculator()
    
    directions = []
    for direction in Direction:
        element = calculator.DIRECTION_ELEMENTS[direction]
        bagua = calculator.DIRECTION_BAGUA[direction]
        colors = calculator.ELEMENT_COLORS[element]
        
        directions.append({
            "direction": direction.value,
            "element": element.value,
            "bagua_area": bagua.value,
            "colors": colors
        })
    
    return jsonify({"success": True, "data": directions})


# =============================================================================
# VEDIC ASTROLOGY ENDPOINTS
# =============================================================================

@ancient_wisdom_bp.route('/astrology/panchang', methods=['GET'])
def get_panchang():
    """Get today's Panchang"""
    try:
        date_str = request.args.get('date')
        
        engine = VedicAstrologyEngine()
        
        if date_str:
            target_date = datetime.strptime(date_str, '%Y-%m-%d')
        else:
            target_date = datetime.now()
        
        panchang = engine.get_panchang(target_date)
        
        return jsonify({
            "success": True,
            "data": {
                "date": panchang.date.strftime('%Y-%m-%d'),
                "tithi": panchang.tithi.name,
                "nakshatra": panchang.nakshatra.nakshatra_name,
                "yoga": panchang.yoga,
                "karana": panchang.karana,
                "day": panchang.vara.value[0],
                "sunrise": panchang.sunrise,
                "sunset": panchang.sunset,
                "rahu_kaal": panchang.rahu_kaal,
                "abhijit_muhurta": panchang.abhijit_muhurta
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ancient_wisdom_bp.route('/astrology/griha-pravesh', methods=['GET'])
def get_griha_pravesh_dates():
    """Get auspicious Griha Pravesh dates"""
    try:
        months = int(request.args.get('months', 3))
        
        engine = VedicAstrologyEngine()
        dates = engine.get_griha_pravesh_dates(datetime.now(), months)
        
        return jsonify({
            "success": True,
            "data": [{
                "date": d["date"].strftime('%Y-%m-%d'),
                "quality": d["quality"],
                "nakshatra": d["nakshatra"],
                "tithi": d["tithi"],
                "day": d["day"],
                "auspicious_time": d["auspicious_time"],
                "avoid_time": d["avoid_time"]
            } for d in dates]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ancient_wisdom_bp.route('/astrology/purchase-dates', methods=['GET'])
def get_purchase_dates():
    """Get auspicious property purchase dates"""
    try:
        months = int(request.args.get('months', 3))
        
        engine = VedicAstrologyEngine()
        dates = engine.get_property_purchase_dates(datetime.now(), months)
        
        return jsonify({
            "success": True,
            "data": [{
                "date": d["date"].strftime('%Y-%m-%d'),
                "quality": d["quality"],
                "nakshatra": d["nakshatra"],
                "tithi": d["tithi"],
                "day": d["day"],
                "notes": d.get("notes", "")
            } for d in dates]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# NUMEROLOGY ENDPOINTS
# =============================================================================

@ancient_wisdom_bp.route('/numerology/profile', methods=['POST'])
def calculate_numerology_profile():
    """Calculate numerology profile for a person"""
    try:
        data = request.get_json()
        
        name = data.get('name')
        birth_date_str = data.get('birth_date')
        system = data.get('system', 'pythagorean')
        
        if not name or not birth_date_str:
            return jsonify({"success": False, "error": "Name and birth_date required"}), 400
        
        birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
        
        numerology_system = NumerologySystem.CHALDEAN if system.lower() == 'chaldean' else NumerologySystem.PYTHAGOREAN
        
        calculator = NumerologyCalculator(numerology_system)
        profile = calculator.calculate_person_profile(name, birth_date)
        
        return jsonify({
            "success": True,
            "data": {
                "name": profile.name,
                "birth_date": profile.birth_date.strftime('%Y-%m-%d'),
                "life_path_number": profile.life_path_number,
                "destiny_number": profile.destiny_number,
                "soul_urge_number": profile.soul_urge_number,
                "personality_number": profile.personality_number,
                "maturity_number": profile.maturity_number,
                "personal_year": profile.personal_year,
                "lucky_numbers": profile.lucky_numbers,
                "challenging_numbers": profile.challenging_numbers,
                "interpretation": profile.interpretation
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ancient_wisdom_bp.route('/numerology/property', methods=['POST'])
def analyze_property_numerology():
    """Analyze property address numerology"""
    try:
        data = request.get_json()
        address = data.get('address')
        
        if not address:
            return jsonify({"success": False, "error": "Address required"}), 400
        
        calculator = NumerologyCalculator()
        analysis = calculator.analyze_property_number(address)
        
        return jsonify({
            "success": True,
            "data": {
                "property_number": analysis.property_number,
                "address_number": analysis.address_number,
                "reduced_number": analysis.reduced_number,
                "energy": analysis.energy,
                "suitable_for": analysis.suitable_for,
                "challenges": analysis.challenges,
                "enhancements": analysis.enhancements,
                "color_recommendations": analysis.color_recommendations
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@ancient_wisdom_bp.route('/numerology/compatibility', methods=['POST'])
def calculate_compatibility():
    """Calculate person-property compatibility"""
    try:
        data = request.get_json()
        
        person_name = data.get('name')
        birth_date_str = data.get('birth_date')
        address = data.get('address')
        
        if not all([person_name, birth_date_str, address]):
            return jsonify({"success": False, "error": "Name, birth_date, and address required"}), 400
        
        birth_date = datetime.strptime(birth_date_str, '%Y-%m-%d').date()
        
        calculator = NumerologyCalculator()
        profile = calculator.calculate_person_profile(person_name, birth_date)
        property_num = calculator.analyze_property_number(address)
        compatibility = calculator.calculate_compatibility(profile, property_num)
        
        return jsonify({
            "success": True,
            "data": {
                "compatibility_score": compatibility.compatibility_score,
                "life_path_match": compatibility.life_path_match,
                "energy_alignment": compatibility.energy_alignment,
                "strengths": compatibility.strengths,
                "challenges": compatibility.challenges,
                "recommendations": compatibility.recommendations,
                "lucky_days": compatibility.lucky_days,
                "lucky_months": compatibility.lucky_months
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# LAND ENERGY ENDPOINTS
# =============================================================================

@ancient_wisdom_bp.route('/land-energy/assess', methods=['POST'])
def assess_land_energy():
    """Assess land energy and geopathic stress"""
    try:
        data = request.get_json()
        
        assessor = LandEnergyAssessor()
        report = assessor.assess_land_energy(data)
        
        return jsonify({
            "success": True,
            "data": {
                "property_id": report.property_id,
                "overall_energy_quality": report.overall_energy_quality.value,
                "energy_score": report.energy_score,
                "geopathic_zones_count": len(report.geopathic_zones),
                "ley_lines": [{
                    "line_id": ll.line_id,
                    "direction": ll.direction,
                    "energy_type": ll.energy_type,
                    "enhancement_potential": ll.enhancement_potential
                } for ll in report.ley_lines],
                "safe_zones": report.safe_zones[:5],
                "danger_zones": report.danger_zones[:5],
                "bed_placement": report.bed_placement,
                "desk_placement": report.desk_placement,
                "remediation_plan": report.remediation_plan[:5],
                "estimated_cost": report.estimated_cost
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# UNIFIED ANCIENT WISDOM REPORT
# =============================================================================

@ancient_wisdom_bp.route('/complete-analysis', methods=['POST'])
def complete_ancient_wisdom_analysis():
    """Generate complete ancient wisdom analysis for a property"""
    try:
        data = request.get_json()
        
        property_data = data.get('property', {})
        owner_data = data.get('owner', {})
        
        results = {}
        
        # Feng Shui Analysis
        facing = Direction.SOUTH  # Default
        if property_data.get('facing_direction'):
            direction_map = {
                "north": Direction.NORTH, "south": Direction.SOUTH,
                "east": Direction.EAST, "west": Direction.WEST
            }
            facing = direction_map.get(property_data['facing_direction'].lower(), Direction.SOUTH)
        
        feng_shui = FengShuiCalculator()
        feng_shui_report = feng_shui.analyze_property(property_data, facing)
        results['feng_shui'] = {
            "score": feng_shui_report.overall_score,
            "wealth_sectors": [d.value for d in feng_shui_report.wealth_sectors],
            "top_remedies": feng_shui_report.remedies[:3]
        }
        
        # Astrology (if owner birth date provided)
        astrology = VedicAstrologyEngine()
        panchang = astrology.get_panchang()
        results['astrology'] = {
            "today": {
                "tithi": panchang.tithi.name,
                "nakshatra": panchang.nakshatra.nakshatra_name,
                "day": panchang.vara.value[0]
            },
            "griha_pravesh_dates": len(astrology.get_griha_pravesh_dates(datetime.now(), 1))
        }
        
        # Numerology
        if owner_data.get('name') and property_data.get('address'):
            numerology = NumerologyCalculator()
            property_num = numerology.analyze_property_number(property_data['address'])
            results['numerology'] = {
                "property_number": property_num.reduced_number,
                "energy": property_num.energy
            }
            
            if owner_data.get('birth_date'):
                birth_date = datetime.strptime(owner_data['birth_date'], '%Y-%m-%d').date()
                profile = numerology.calculate_person_profile(owner_data['name'], birth_date)
                compat = numerology.calculate_compatibility(profile, property_num)
                results['numerology']['compatibility_score'] = compat.compatibility_score
        
        # Land Energy
        land_assessor = LandEnergyAssessor()
        land_report = land_assessor.assess_land_energy(property_data)
        results['land_energy'] = {
            "quality": land_report.overall_energy_quality.value,
            "score": land_report.energy_score,
            "estimated_remediation_cost": land_report.estimated_cost
        }
        
        # Overall Score
        scores = [
            feng_shui_report.overall_score,
            land_report.energy_score,
            results.get('numerology', {}).get('compatibility_score', 70)
        ]
        overall_score = sum(scores) / len(scores)
        
        return jsonify({
            "success": True,
            "data": {
                "property_id": property_data.get('id', 'unknown'),
                "overall_ancient_wisdom_score": round(overall_score, 1),
                "components": results,
                "analysis_date": datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# ROUTE REGISTRATION HELPER
# =============================================================================

def register_routes(app):
    """Register all ancient wisdom routes with Flask app"""
    app.register_blueprint(ancient_wisdom_bp)
    return app
