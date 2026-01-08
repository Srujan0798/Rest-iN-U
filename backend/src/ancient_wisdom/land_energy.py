"""
=============================================================================
SPRINT 7-8: LAND ENERGY ASSESSOR
Dharma Realty - Ancient Wisdom Module
=============================================================================

Geopathic Stress Detection, Ley Lines, Earth Grids, Underground Water
"""

from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import math


class GeopathicStressType(Enum):
    """Types of geopathic stress"""
    HARTMANN_GRID = "Hartmann Grid"
    CURRY_GRID = "Curry Grid"
    UNDERGROUND_WATER = "Underground Water"
    GEOLOGICAL_FAULT = "Geological Fault"
    MINERAL_DEPOSITS = "Mineral Deposits"
    LEY_LINE = "Ley Line"


class EnergyQuality(Enum):
    """Quality of earth energy"""
    HIGHLY_POSITIVE = "Highly Positive"
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"
    HIGHLY_NEGATIVE = "Highly Negative"


@dataclass
class GeopathicZone:
    """Geopathic stress zone"""
    zone_id: str
    stress_type: GeopathicStressType
    location: Tuple[float, float]  # x, y in meters
    width: float  # meters
    intensity: int  # 1-10
    health_impact: str
    remedies: List[str]


@dataclass
class LeyLine:
    """Ley line crossing information"""
    line_id: str
    direction: float  # degrees from north
    width: float  # meters
    energy_type: str  # Positive/Negative
    historical_significance: str
    enhancement_potential: str


@dataclass
class EarthGrid:
    """Earth energy grid intersection"""
    grid_type: str  # Hartmann/Curry
    intersection_point: Tuple[float, float]
    intensity: int
    safe_for_sleeping: bool
    safe_for_working: bool
    recommendations: List[str]


@dataclass
class LandEnergyReport:
    """Complete land energy assessment"""
    property_id: str
    assessment_date: datetime
    overall_energy_quality: EnergyQuality
    energy_score: int  # 0-100
    geopathic_zones: List[GeopathicZone]
    ley_lines: List[LeyLine]
    earth_grids: List[EarthGrid]
    underground_water: List[Dict]
    safe_zones: List[Dict]
    danger_zones: List[Dict]
    bed_placement: Dict
    desk_placement: Dict
    remediation_plan: List[Dict]
    estimated_cost: float


class LandEnergyAssessor:
    """
    Complete Land Energy Assessment System
    Implements: Geopathic Stress, Ley Lines, Earth Grids, Dowsing Analysis
    """
    
    # Hartmann Grid dimensions (meters)
    HARTMANN_NS_SPACING = 2.0
    HARTMANN_EW_SPACING = 2.5
    HARTMANN_LINE_WIDTH = 0.21
    
    # Curry Grid dimensions (diagonal)
    CURRY_SPACING = 3.5
    CURRY_LINE_WIDTH = 0.5
    
    # Health impact zones
    IMPACT_ZONES = {
        GeopathicStressType.HARTMANN_GRID: "Mild - affects immune system over time",
        GeopathicStressType.CURRY_GRID: "Moderate - affects nervous system",
        GeopathicStressType.UNDERGROUND_WATER: "Significant - causes chronic fatigue",
        GeopathicStressType.GEOLOGICAL_FAULT: "Severe - linked to serious illness",
        GeopathicStressType.MINERAL_DEPOSITS: "Variable - depends on mineral type",
        GeopathicStressType.LEY_LINE: "Variable - can be positive or negative"
    }
    
    def __init__(self):
        self.assessment_date = datetime.now()
    
    def assess_land_energy(self, property_data: Dict,
                          floor_plan: Dict = None) -> LandEnergyReport:
        """
        Complete land energy assessment
        
        Args:
            property_data: Property details including lat/lng
            floor_plan: Room layout for placement recommendations
        
        Returns:
            LandEnergyReport with complete analysis
        """
        
        # Get property dimensions
        width = property_data.get("width", 15)  # meters
        length = property_data.get("length", 20)
        
        # Detect geopathic stress zones
        geopathic_zones = self._detect_geopathic_zones(width, length, property_data)
        
        # Detect ley lines
        ley_lines = self._detect_ley_lines(property_data)
        
        # Calculate earth grid intersections
        earth_grids = self._calculate_earth_grids(width, length)
        
        # Detect underground water
        underground_water = self._detect_underground_water(property_data)
        
        # Identify safe and danger zones
        safe_zones = self._identify_safe_zones(width, length, geopathic_zones, earth_grids)
        danger_zones = self._identify_danger_zones(geopathic_zones, earth_grids)
        
        # Calculate optimal bed placement
        bed_placement = self._calculate_bed_placement(safe_zones, floor_plan)
        
        # Calculate optimal desk placement
        desk_placement = self._calculate_desk_placement(safe_zones, ley_lines, floor_plan)
        
        # Generate remediation plan
        remediation_plan = self._generate_remediation_plan(geopathic_zones, danger_zones)
        
        # Calculate overall energy quality and score
        energy_quality, energy_score = self._calculate_energy_quality(
            geopathic_zones, ley_lines, underground_water
        )
        
        # Estimate remediation cost
        estimated_cost = self._estimate_remediation_cost(remediation_plan)
        
        return LandEnergyReport(
            property_id=property_data.get("id", "unknown"),
            assessment_date=self.assessment_date,
            overall_energy_quality=energy_quality,
            energy_score=energy_score,
            geopathic_zones=geopathic_zones,
            ley_lines=ley_lines,
            earth_grids=earth_grids,
            underground_water=underground_water,
            safe_zones=safe_zones,
            danger_zones=danger_zones,
            bed_placement=bed_placement,
            desk_placement=desk_placement,
            remediation_plan=remediation_plan,
            estimated_cost=estimated_cost
        )
    
    def _detect_geopathic_zones(self, width: float, length: float,
                                property_data: Dict) -> List[GeopathicZone]:
        """Detect geopathic stress zones in the property"""
        
        zones = []
        zone_count = 0
        
        # Simulate Hartmann grid lines (North-South)
        for x in [i * self.HARTMANN_EW_SPACING for i in range(int(width / self.HARTMANN_EW_SPACING) + 1)]:
            zone_count += 1
            zones.append(GeopathicZone(
                zone_id=f"HG-NS-{zone_count}",
                stress_type=GeopathicStressType.HARTMANN_GRID,
                location=(x, length / 2),
                width=self.HARTMANN_LINE_WIDTH,
                intensity=3,
                health_impact=self.IMPACT_ZONES[GeopathicStressType.HARTMANN_GRID],
                remedies=["Cork mat under bed", "Copper coil"]
            ))
        
        # Simulate Curry grid (diagonal)
        for i in range(int(width / self.CURRY_SPACING) + 1):
            x = i * self.CURRY_SPACING
            zone_count += 1
            zones.append(GeopathicZone(
                zone_id=f"CG-{zone_count}",
                stress_type=GeopathicStressType.CURRY_GRID,
                location=(x, x * 0.7),
                width=self.CURRY_LINE_WIDTH,
                intensity=5,
                health_impact=self.IMPACT_ZONES[GeopathicStressType.CURRY_GRID],
                remedies=["Crystal placement", "Orgonite pyramid"]
            ))
        
        # Check for underground water (based on location/history)
        if property_data.get("near_water_body", False) or property_data.get("low_lying", False):
            zones.append(GeopathicZone(
                zone_id="UW-1",
                stress_type=GeopathicStressType.UNDERGROUND_WATER,
                location=(width / 2, length / 3),
                width=2.0,
                intensity=7,
                health_impact=self.IMPACT_ZONES[GeopathicStressType.UNDERGROUND_WATER],
                remedies=["Move sleeping area", "Copper rods", "Professional shielding"]
            ))
        
        # Check for geological faults (simplified - based on seismic zone)
        seismic_zone = property_data.get("seismic_zone", 2)
        if seismic_zone >= 4:
            zones.append(GeopathicZone(
                zone_id="GF-1",
                stress_type=GeopathicStressType.GEOLOGICAL_FAULT,
                location=(width / 2, length / 2),
                width=3.0,
                intensity=9,
                health_impact=self.IMPACT_ZONES[GeopathicStressType.GEOLOGICAL_FAULT],
                remedies=["Professional geo-remediation", "Consider relocation of sleeping area"]
            ))
        
        return zones
    
    def _detect_ley_lines(self, property_data: Dict) -> List[LeyLine]:
        """Detect ley lines crossing the property"""
        
        ley_lines = []
        
        # Check proximity to temples, ancient sites
        if property_data.get("near_temple", False) or property_data.get("near_ancient_site", False):
            ley_lines.append(LeyLine(
                line_id="LL-1",
                direction=45.0,
                width=5.0,
                energy_type="Positive",
                historical_significance="Connected to ancient temple axis",
                enhancement_potential="High - can enhance spiritual practices"
            ))
        
        # Check property orientation
        facing = property_data.get("facing", "North")
        if facing in ["North", "East"]:
            ley_lines.append(LeyLine(
                line_id="LL-2",
                direction=0.0 if facing == "North" else 90.0,
                width=3.0,
                energy_type="Positive",
                historical_significance="Aligned with cardinal direction",
                enhancement_potential="Medium - supports meditation"
            ))
        
        return ley_lines
    
    def _calculate_earth_grids(self, width: float, length: float) -> List[EarthGrid]:
        """Calculate earth energy grid intersections"""
        
        grids = []
        
        # Hartmann grid intersections
        for x in range(0, int(width), int(self.HARTMANN_EW_SPACING)):
            for y in range(0, int(length), int(self.HARTMANN_NS_SPACING)):
                intensity = 4 if (x % 4 == 0 and y % 4 == 0) else 2
                grids.append(EarthGrid(
                    grid_type="Hartmann",
                    intersection_point=(float(x), float(y)),
                    intensity=intensity,
                    safe_for_sleeping=intensity < 3,
                    safe_for_working=intensity < 5,
                    recommendations=self._get_grid_recommendations(intensity)
                ))
        
        # Curry grid intersections (at angles)
        for i in range(int(width / self.CURRY_SPACING) + 1):
            for j in range(int(length / self.CURRY_SPACING) + 1):
                x = i * self.CURRY_SPACING * 0.707
                y = j * self.CURRY_SPACING * 0.707
                if x < width and y < length:
                    intensity = 6
                    grids.append(EarthGrid(
                        grid_type="Curry",
                        intersection_point=(x, y),
                        intensity=intensity,
                        safe_for_sleeping=False,
                        safe_for_working=False,
                        recommendations=["Avoid placing bed here", "Use neutralizing crystals"]
                    ))
        
        return grids
    
    def _detect_underground_water(self, property_data: Dict) -> List[Dict]:
        """Detect underground water veins"""
        
        water_veins = []
        
        # Check water table depth
        water_table = property_data.get("water_table_depth", 30)  # meters
        
        if water_table < 10:
            water_veins.append({
                "type": "Shallow water table",
                "depth": water_table,
                "impact": "Can cause dampness and energy disturbance",
                "direction": "Horizontal layer",
                "remedy": "Proper drainage, waterproofing"
            })
        
        # Check for streams/rivers nearby
        if property_data.get("near_water_body", False):
            water_veins.append({
                "type": "Underground stream",
                "depth": 15,
                "impact": "Strong geopathic stress zone",
                "direction": "North-South",
                "remedy": "Copper rods, move sleeping area"
            })
        
        return water_veins
    
    def _identify_safe_zones(self, width: float, length: float,
                            geopathic_zones: List[GeopathicZone],
                            earth_grids: List[EarthGrid]) -> List[Dict]:
        """Identify safe zones in the property"""
        
        # Create grid of points
        safe_zones = []
        
        for x in range(0, int(width), 2):
            for y in range(0, int(length), 2):
                point = (float(x), float(y))
                
                # Check if point is away from all geopathic zones
                is_safe = True
                for zone in geopathic_zones:
                    distance = math.sqrt((point[0] - zone.location[0])**2 + 
                                        (point[1] - zone.location[1])**2)
                    if distance < zone.width + 1.0:
                        is_safe = False
                        break
                
                # Check earth grid intersections
                for grid in earth_grids:
                    if not grid.safe_for_sleeping:
                        distance = math.sqrt((point[0] - grid.intersection_point[0])**2 + 
                                            (point[1] - grid.intersection_point[1])**2)
                        if distance < 0.5:
                            is_safe = False
                            break
                
                if is_safe:
                    safe_zones.append({
                        "location": point,
                        "size": (2.0, 2.0),
                        "suitable_for": ["Sleeping", "Meditation", "Long-term seating"],
                        "quality": "High"
                    })
        
        return safe_zones[:10]  # Return top 10
    
    def _identify_danger_zones(self, geopathic_zones: List[GeopathicZone],
                              earth_grids: List[EarthGrid]) -> List[Dict]:
        """Identify danger zones to avoid"""
        
        danger_zones = []
        
        for zone in geopathic_zones:
            if zone.intensity >= 5:
                danger_zones.append({
                    "location": zone.location,
                    "type": zone.stress_type.value,
                    "intensity": zone.intensity,
                    "health_risk": zone.health_impact,
                    "avoid_for": ["Sleeping", "Long-term seating"],
                    "remedies": zone.remedies
                })
        
        for grid in earth_grids:
            if not grid.safe_for_sleeping and grid.intensity >= 6:
                danger_zones.append({
                    "location": grid.intersection_point,
                    "type": f"{grid.grid_type} Grid Intersection",
                    "intensity": grid.intensity,
                    "health_risk": "Chronic stress zone",
                    "avoid_for": ["Sleeping", "Working"],
                    "remedies": grid.recommendations
                })
        
        return danger_zones
    
    def _calculate_bed_placement(self, safe_zones: List[Dict],
                                floor_plan: Dict = None) -> Dict:
        """Calculate optimal bed placement"""
        
        if not safe_zones:
            return {
                "location": (5.0, 10.0),
                "orientation": "Head to South",
                "confidence": "Low",
                "notes": "No ideal zones found - use remediation"
            }
        
        # Find largest safe zone
        best_zone = max(safe_zones, key=lambda z: z.get("size", (0, 0))[0] * z.get("size", (0, 0))[1])
        
        return {
            "location": best_zone["location"],
            "orientation": "Head to South or East",
            "confidence": "High",
            "notes": "Zone clear of geopathic stress",
            "vastu_alignment": "South head position recommended"
        }
    
    def _calculate_desk_placement(self, safe_zones: List[Dict],
                                 ley_lines: List[LeyLine],
                                 floor_plan: Dict = None) -> Dict:
        """Calculate optimal desk/work area placement"""
        
        # For work, slight energy can be beneficial
        best_location = (3.0, 5.0)
        
        # Check for positive ley lines
        for ley in ley_lines:
            if ley.energy_type == "Positive":
                best_location = (5.0, 5.0)  # Near ley line
                break
        
        return {
            "location": best_location,
            "facing": "North or East",
            "confidence": "Medium",
            "notes": "Position near positive energy for productivity",
            "vastu_alignment": "Face East while working"
        }
    
    def _generate_remediation_plan(self, geopathic_zones: List[GeopathicZone],
                                  danger_zones: List[Dict]) -> List[Dict]:
        """Generate remediation plan"""
        
        plan = []
        
        for zone in geopathic_zones:
            if zone.intensity >= 4:
                plan.append({
                    "zone_id": zone.zone_id,
                    "stress_type": zone.stress_type.value,
                    "priority": "High" if zone.intensity >= 7 else "Medium",
                    "remedies": zone.remedies,
                    "estimated_cost": self._estimate_remedy_cost(zone.remedies),
                    "professional_required": zone.intensity >= 7
                })
        
        # Add general recommendations
        plan.append({
            "zone_id": "GENERAL",
            "stress_type": "Prevention",
            "priority": "Low",
            "remedies": [
                "Place crystals at property corners",
                "Use copper pyramid in center",
                "Regular space clearing rituals"
            ],
            "estimated_cost": 5000,
            "professional_required": False
        })
        
        return sorted(plan, key=lambda x: x["priority"] == "High", reverse=True)
    
    def _calculate_energy_quality(self, geopathic_zones: List[GeopathicZone],
                                  ley_lines: List[LeyLine],
                                  underground_water: List[Dict]) -> Tuple[EnergyQuality, int]:
        """Calculate overall energy quality and score"""
        
        score = 100
        
        # Deduct for geopathic stress
        for zone in geopathic_zones:
            score -= zone.intensity * 2
        
        # Deduct for underground water
        score -= len(underground_water) * 10
        
        # Add for positive ley lines
        for ley in ley_lines:
            if ley.energy_type == "Positive":
                score += 10
        
        score = max(0, min(100, score))
        
        if score >= 80:
            quality = EnergyQuality.HIGHLY_POSITIVE
        elif score >= 60:
            quality = EnergyQuality.POSITIVE
        elif score >= 40:
            quality = EnergyQuality.NEUTRAL
        elif score >= 20:
            quality = EnergyQuality.NEGATIVE
        else:
            quality = EnergyQuality.HIGHLY_NEGATIVE
        
        return quality, score
    
    def _estimate_remediation_cost(self, plan: List[Dict]) -> float:
        """Estimate total remediation cost"""
        return sum(item.get("estimated_cost", 0) for item in plan)
    
    def _estimate_remedy_cost(self, remedies: List[str]) -> float:
        """Estimate cost of specific remedies"""
        costs = {
            "Cork mat": 2000,
            "Copper coil": 1500,
            "Crystal placement": 3000,
            "Orgonite pyramid": 2500,
            "Copper rods": 5000,
            "Professional shielding": 25000,
            "Move sleeping area": 0
        }
        
        total = 0
        for remedy in remedies:
            for key, cost in costs.items():
                if key.lower() in remedy.lower():
                    total += cost
                    break
        
        return total if total > 0 else 2000
    
    def _get_grid_recommendations(self, intensity: int) -> List[str]:
        """Get recommendations based on grid intensity"""
        if intensity <= 2:
            return ["Safe for most activities"]
        elif intensity <= 4:
            return ["Avoid long-term sleeping", "Short-term use okay"]
        else:
            return ["Avoid completely", "Use neutralizing devices"]


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    assessor = LandEnergyAssessor()
    
    property_data = {
        "id": "PROP-001",
        "width": 15,
        "length": 20,
        "near_water_body": False,
        "near_temple": True,
        "seismic_zone": 3,
        "water_table_depth": 25
    }
    
    report = assessor.assess_land_energy(property_data)
    
    print(f"Land Energy Assessment")
    print(f"=" * 50)
    print(f"Overall Quality: {report.overall_energy_quality.value}")
    print(f"Energy Score: {report.energy_score}/100")
    print(f"\nGeopathic Zones Found: {len(report.geopathic_zones)}")
    print(f"Ley Lines: {len(report.ley_lines)}")
    print(f"Safe Zones: {len(report.safe_zones)}")
    print(f"Danger Zones: {len(report.danger_zones)}")
    print(f"\nOptimal Bed Placement: {report.bed_placement['location']}")
    print(f"Estimated Remediation Cost: ₹{report.estimated_cost:,.0f}")
