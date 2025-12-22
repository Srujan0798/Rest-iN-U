"""
=============================================================================
SPRINT 9-10: CLIMATE RISK MODELER
Dharma Realty - Climate & IoT Module
=============================================================================

100-Year Projections, IPCC Scenarios, Flood/Drought/Heat Analysis
"""

from datetime import datetime, date
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import math


class ClimateScenario(Enum):
    """IPCC Climate Scenarios (SSP - Shared Socioeconomic Pathways)"""
    SSP1_19 = ("SSP1-1.9", "Sustainability", 1.5, "Best case - Paris Agreement")
    SSP1_26 = ("SSP1-2.6", "Sustainability", 1.8, "Sustainable development")
    SSP2_45 = ("SSP2-4.5", "Middle Road", 2.7, "Moderate emissions")
    SSP3_70 = ("SSP3-7.0", "Regional Rivalry", 3.6, "High emissions")
    SSP5_85 = ("SSP5-8.5", "Fossil Development", 4.4, "Worst case")
    
    def __init__(self, code: str, pathway: str, temp_rise: float, description: str):
        self.code = code
        self.pathway = pathway
        self.temp_rise = temp_rise
        self.description = description


class HazardType(Enum):
    """Climate hazard types"""
    FLOOD = "Flood"
    DROUGHT = "Drought"
    HEAT_WAVE = "Heat Wave"
    CYCLONE = "Cyclone"
    SEA_LEVEL_RISE = "Sea Level Rise"
    WATER_SCARCITY = "Water Scarcity"
    WILDFIRE = "Wildfire"
    LANDSLIDE = "Landslide"


@dataclass
class ClimateProjection:
    """Climate projection for a specific year"""
    year: int
    scenario: ClimateScenario
    temperature_change: float  # °C from baseline
    precipitation_change: float  # % from baseline
    sea_level_rise: float  # mm
    extreme_heat_days: int
    drought_probability: float
    flood_probability: float
    cyclone_risk: float


@dataclass
class HazardRisk:
    """Risk assessment for a specific hazard"""
    hazard_type: HazardType
    current_risk: str  # Low/Medium/High/Extreme
    future_risk_2050: str
    future_risk_2100: str
    probability: float
    potential_damage: str
    mitigation_measures: List[str]
    insurance_implications: str


@dataclass
class AdaptationMeasure:
    """Adaptation measure recommendation"""
    measure_id: str
    category: str
    description: str
    effectiveness: str  # Low/Medium/High
    implementation_cost: float
    annual_savings: float
    payback_period: float  # years
    priority: str


@dataclass
class ClimateRiskAssessment:
    """Complete climate risk assessment for a property"""
    property_id: str
    assessment_date: datetime
    location: Dict  # lat, lng, region
    baseline: Dict  # current climate data
    projections: Dict[int, ClimateProjection]  # year -> projection
    hazard_risks: List[HazardRisk]
    overall_risk_score: int  # 0-100
    investment_rating: str
    insurance_risk_class: str
    adaptation_measures: List[AdaptationMeasure]
    resilience_score: int  # 0-100
    estimated_climate_premium: float  # annual insurance adjustment


class ClimateRiskModeler:
    """
    100-Year Climate Risk Modeling System
    Implements: IPCC Scenarios, Multi-hazard Assessment, Adaptation Planning
    """
    
    # Regional baseline data (India)
    REGIONAL_BASELINES = {
        "coastal_west": {
            "avg_temp": 27.5, "rainfall": 2500, "elevation": 10,
            "cyclone_prone": True, "flood_prone": True
        },
        "coastal_east": {
            "avg_temp": 28.0, "rainfall": 1400, "elevation": 15,
            "cyclone_prone": True, "flood_prone": True
        },
        "northern_plains": {
            "avg_temp": 25.0, "rainfall": 800, "elevation": 200,
            "cyclone_prone": False, "flood_prone": True
        },
        "southern_plateau": {
            "avg_temp": 26.5, "rainfall": 900, "elevation": 500,
            "cyclone_prone": False, "flood_prone": False
        },
        "himalayan": {
            "avg_temp": 15.0, "rainfall": 1500, "elevation": 2000,
            "cyclone_prone": False, "flood_prone": True
        },
        "desert": {
            "avg_temp": 30.0, "rainfall": 300, "elevation": 300,
            "cyclone_prone": False, "flood_prone": False
        }
    }
    
    # Temperature increase by scenario and decade
    TEMP_INCREASE = {
        ClimateScenario.SSP1_19: {2030: 0.5, 2050: 1.0, 2070: 1.2, 2100: 1.4},
        ClimateScenario.SSP1_26: {2030: 0.6, 2050: 1.2, 2070: 1.5, 2100: 1.8},
        ClimateScenario.SSP2_45: {2030: 0.7, 2050: 1.5, 2070: 2.1, 2100: 2.7},
        ClimateScenario.SSP3_70: {2030: 0.8, 2050: 1.8, 2070: 2.8, 2100: 3.6},
        ClimateScenario.SSP5_85: {2030: 0.9, 2050: 2.2, 2070: 3.4, 2100: 4.4}
    }
    
    # Sea level rise projections (mm)
    SEA_LEVEL_RISE = {
        ClimateScenario.SSP1_19: {2030: 100, 2050: 200, 2070: 300, 2100: 400},
        ClimateScenario.SSP1_26: {2030: 110, 2050: 240, 2070: 380, 2100: 520},
        ClimateScenario.SSP2_45: {2030: 120, 2050: 280, 2070: 450, 2100: 660},
        ClimateScenario.SSP3_70: {2030: 130, 2050: 320, 2070: 550, 2100: 830},
        ClimateScenario.SSP5_85: {2030: 140, 2050: 360, 2070: 650, 2100: 1010}
    }
    
    def __init__(self, scenario: ClimateScenario = ClimateScenario.SSP2_45):
        self.scenario = scenario
        self.projection_years = [2030, 2050, 2070, 2100]
    
    def assess_property_risk(self, property_data: Dict) -> ClimateRiskAssessment:
        """
        Complete climate risk assessment for a property
        
        Args:
            property_data: Property details including location, elevation
        
        Returns:
            ClimateRiskAssessment with 100-year projections
        """
        
        # Determine region
        region = self._determine_region(property_data)
        baseline = self.REGIONAL_BASELINES.get(region, self.REGIONAL_BASELINES["northern_plains"])
        
        # Generate projections
        projections = {}
        for year in self.projection_years:
            projections[year] = self._generate_projection(year, baseline, property_data)
        
        # Assess hazard risks
        hazard_risks = self._assess_hazards(property_data, baseline, projections)
        
        # Calculate overall risk score
        overall_score = self._calculate_risk_score(hazard_risks, projections)
        
        # Determine investment rating
        investment_rating = self._get_investment_rating(overall_score)
        
        # Determine insurance risk class
        insurance_class = self._get_insurance_class(overall_score, hazard_risks)
        
        # Generate adaptation measures
        adaptation = self._generate_adaptation_measures(hazard_risks, property_data)
        
        # Calculate resilience score
        resilience = self._calculate_resilience(property_data, adaptation)
        
        # Estimate climate premium
        premium = self._estimate_climate_premium(overall_score, hazard_risks)
        
        return ClimateRiskAssessment(
            property_id=property_data.get("id", "unknown"),
            assessment_date=datetime.now(),
            location={
                "latitude": property_data.get("latitude", 0),
                "longitude": property_data.get("longitude", 0),
                "region": region,
                "elevation": property_data.get("elevation", 0)
            },
            baseline=baseline,
            projections=projections,
            hazard_risks=hazard_risks,
            overall_risk_score=overall_score,
            investment_rating=investment_rating,
            insurance_risk_class=insurance_class,
            adaptation_measures=adaptation,
            resilience_score=resilience,
            estimated_climate_premium=premium
        )
    
    def _determine_region(self, property_data: Dict) -> str:
        """Determine climate region based on location"""
        lat = property_data.get("latitude", 20)
        lng = property_data.get("longitude", 78)
        elevation = property_data.get("elevation", 100)
        
        # Coastal detection
        distance_to_coast = property_data.get("distance_to_coast", 100)  # km
        
        if distance_to_coast < 50:
            if lng < 77:
                return "coastal_west"
            else:
                return "coastal_east"
        elif elevation > 1500:
            return "himalayan"
        elif lat < 20 and elevation > 300:
            return "southern_plateau"
        elif property_data.get("rainfall", 800) < 400:
            return "desert"
        else:
            return "northern_plains"
    
    def _generate_projection(self, year: int, baseline: Dict,
                            property_data: Dict) -> ClimateProjection:
        """Generate climate projection for a specific year"""
        
        temp_increase = self.TEMP_INCREASE[self.scenario].get(year, 2.0)
        sea_rise = self.SEA_LEVEL_RISE[self.scenario].get(year, 500)
        
        # Calculate precipitation change (varies by region and scenario)
        precip_factor = 1.0 + (temp_increase * 0.03)  # 3% per degree
        if baseline.get("rainfall", 1000) > 1500:
            precip_factor *= 1.1  # Wet areas get wetter
        else:
            precip_factor *= 0.9  # Dry areas get drier
        
        precip_change = (precip_factor - 1) * 100
        
        # Calculate extreme heat days
        baseline_heat_days = 20 if baseline["avg_temp"] > 26 else 10
        extreme_heat_days = baseline_heat_days + int(temp_increase * 15)
        
        # Calculate probabilities
        drought_prob = min(0.8, 0.2 + (temp_increase * 0.1))
        flood_prob = 0.3 if baseline.get("flood_prone", False) else 0.1
        flood_prob = min(0.9, flood_prob + (temp_increase * 0.05))
        
        cyclone_risk = 0.4 if baseline.get("cyclone_prone", False) else 0.05
        cyclone_risk = min(0.8, cyclone_risk + (temp_increase * 0.03))
        
        return ClimateProjection(
            year=year,
            scenario=self.scenario,
            temperature_change=temp_increase,
            precipitation_change=precip_change,
            sea_level_rise=sea_rise,
            extreme_heat_days=extreme_heat_days,
            drought_probability=drought_prob,
            flood_probability=flood_prob,
            cyclone_risk=cyclone_risk
        )
    
    def _assess_hazards(self, property_data: Dict, baseline: Dict,
                       projections: Dict) -> List[HazardRisk]:
        """Assess individual hazard risks"""
        
        hazards = []
        
        # Flood risk
        if baseline.get("flood_prone", False) or property_data.get("elevation", 100) < 30:
            hazards.append(HazardRisk(
                hazard_type=HazardType.FLOOD,
                current_risk="High" if baseline.get("flood_prone") else "Medium",
                future_risk_2050=self._scale_risk(projections[2050].flood_probability),
                future_risk_2100=self._scale_risk(projections[2100].flood_probability),
                probability=projections[2050].flood_probability,
                potential_damage="₹10-50 Lakh structural damage",
                mitigation_measures=[
                    "Elevate electrical systems",
                    "Install sump pump",
                    "Waterproof basement",
                    "Flood barriers"
                ],
                insurance_implications="Flood insurance required, 20-40% premium increase"
            ))
        
        # Heat wave risk
        hazards.append(HazardRisk(
            hazard_type=HazardType.HEAT_WAVE,
            current_risk="Medium" if baseline["avg_temp"] > 26 else "Low",
            future_risk_2050="High",
            future_risk_2100="Extreme" if projections[2100].extreme_heat_days > 60 else "High",
            probability=0.7,
            potential_damage="Increased cooling costs, health risks",
            mitigation_measures=[
                "Install solar panels for AC",
                "White/reflective roofing",
                "Cross-ventilation design",
                "Heat-resistant materials"
            ],
            insurance_implications="Consider heat damage coverage"
        ))
        
        # Drought/water scarcity
        if baseline.get("rainfall", 1000) < 700:
            hazards.append(HazardRisk(
                hazard_type=HazardType.WATER_SCARCITY,
                current_risk="High",
                future_risk_2050="Extreme",
                future_risk_2100="Extreme",
                probability=projections[2050].drought_probability,
                potential_damage="Water sourcing costs, property value decline",
                mitigation_measures=[
                    "Rainwater harvesting",
                    "Greywater recycling",
                    "Water-efficient fixtures",
                    "Borewell with backup"
                ],
                insurance_implications="May affect property valuation"
            ))
        
        # Cyclone risk
        if baseline.get("cyclone_prone", False):
            hazards.append(HazardRisk(
                hazard_type=HazardType.CYCLONE,
                current_risk="High",
                future_risk_2050="High",
                future_risk_2100="Extreme",
                probability=projections[2050].cyclone_risk,
                potential_damage="₹20 Lakh - Total loss possible",
                mitigation_measures=[
                    "Wind-resistant construction",
                    "Impact-resistant windows",
                    "Secure roof with hurricane straps",
                    "Storm shutters"
                ],
                insurance_implications="Cyclone insurance mandatory, 30-50% premium"
            ))
        
        # Sea level rise
        if property_data.get("distance_to_coast", 100) < 20:
            slr_2100 = projections[2100].sea_level_rise / 1000  # convert to meters
            hazards.append(HazardRisk(
                hazard_type=HazardType.SEA_LEVEL_RISE,
                current_risk="Low",
                future_risk_2050="Medium",
                future_risk_2100="High" if slr_2100 > 0.5 else "Medium",
                probability=0.9,  # Sea level rise is highly certain
                potential_damage="Property inundation, saltwater intrusion",
                mitigation_measures=[
                    "Elevation assessment",
                    "Salt-resistant materials",
                    "Consider long-term viability"
                ],
                insurance_implications="May become uninsurable by 2070"
            ))
        
        return hazards
    
    def _scale_risk(self, probability: float) -> str:
        """Convert probability to risk category"""
        if probability >= 0.7:
            return "Extreme"
        elif probability >= 0.5:
            return "High"
        elif probability >= 0.3:
            return "Medium"
        else:
            return "Low"
    
    def _calculate_risk_score(self, hazards: List[HazardRisk],
                             projections: Dict) -> int:
        """Calculate overall climate risk score (0-100, higher = more risk)"""
        
        score = 0
        
        # Add hazard scores
        risk_values = {"Low": 5, "Medium": 15, "High": 25, "Extreme": 35}
        for hazard in hazards:
            score += risk_values.get(hazard.current_risk, 10)
            score += risk_values.get(hazard.future_risk_2050, 15) * 0.5
        
        # Add temperature factor
        temp_2050 = projections[2050].temperature_change
        score += temp_2050 * 5
        
        # Cap at 100
        return min(100, int(score))
    
    def _get_investment_rating(self, risk_score: int) -> str:
        """Get investment rating based on risk score"""
        if risk_score <= 25:
            return "A - Excellent (Low climate risk)"
        elif risk_score <= 40:
            return "B - Good (Moderate risk, manageable)"
        elif risk_score <= 60:
            return "C - Fair (Significant risk, mitigation needed)"
        elif risk_score <= 80:
            return "D - Poor (High risk, major mitigation required)"
        else:
            return "F - Avoid (Extreme risk, not recommended)"
    
    def _get_insurance_class(self, risk_score: int, hazards: List) -> str:
        """Get insurance risk classification"""
        if risk_score <= 30:
            return "Standard"
        elif risk_score <= 50:
            return "Preferred (with mitigation)"
        elif risk_score <= 70:
            return "Substandard (premium loading)"
        else:
            return "High Risk (specialized coverage needed)"
    
    def _generate_adaptation_measures(self, hazards: List[HazardRisk],
                                      property_data: Dict) -> List[AdaptationMeasure]:
        """Generate adaptation recommendations"""
        
        measures = []
        measure_id = 0
        
        # Based on hazards identified
        for hazard in hazards:
            if hazard.hazard_type == HazardType.FLOOD:
                measure_id += 1
                measures.append(AdaptationMeasure(
                    measure_id=f"ADAPT-{measure_id:03d}",
                    category="Flood Protection",
                    description="Install flood barriers and sump pump system",
                    effectiveness="High",
                    implementation_cost=150000,
                    annual_savings=30000,  # insurance savings
                    payback_period=5.0,
                    priority="High"
                ))
            
            if hazard.hazard_type == HazardType.HEAT_WAVE:
                measure_id += 1
                measures.append(AdaptationMeasure(
                    measure_id=f"ADAPT-{measure_id:03d}",
                    category="Heat Resilience",
                    description="Solar panels + cool roof coating",
                    effectiveness="High",
                    implementation_cost=500000,
                    annual_savings=80000,  # energy savings
                    payback_period=6.25,
                    priority="High"
                ))
            
            if hazard.hazard_type == HazardType.WATER_SCARCITY:
                measure_id += 1
                measures.append(AdaptationMeasure(
                    measure_id=f"ADAPT-{measure_id:03d}",
                    category="Water Security",
                    description="Rainwater harvesting + greywater recycling",
                    effectiveness="Medium",
                    implementation_cost=200000,
                    annual_savings=40000,
                    payback_period=5.0,
                    priority="High"
                ))
        
        # General measures
        measure_id += 1
        measures.append(AdaptationMeasure(
            measure_id=f"ADAPT-{measure_id:03d}",
            category="General Resilience",
            description="Energy-efficient HVAC with backup power",
            effectiveness="Medium",
            implementation_cost=300000,
            annual_savings=50000,
            payback_period=6.0,
            priority="Medium"
        ))
        
        return sorted(measures, key=lambda x: x.priority == "High", reverse=True)
    
    def _calculate_resilience(self, property_data: Dict,
                             adaptation: List[AdaptationMeasure]) -> int:
        """Calculate property resilience score"""
        
        base_score = 50
        
        # Add for existing features
        if property_data.get("solar_panels", False):
            base_score += 10
        if property_data.get("rainwater_harvesting", False):
            base_score += 10
        if property_data.get("elevated_construction", False):
            base_score += 15
        
        # Add for adaptation measures (potential)
        high_priority = sum(1 for m in adaptation if m.priority == "High")
        base_score += high_priority * 5
        
        return min(100, base_score)
    
    def _estimate_climate_premium(self, risk_score: int,
                                  hazards: List[HazardRisk]) -> float:
        """Estimate annual climate-related insurance premium adjustment"""
        
        base_premium = 50000  # Base annual premium
        
        # Add climate loading
        loading = risk_score / 100 * 0.5  # Up to 50% loading
        
        # Add hazard-specific loadings
        for hazard in hazards:
            if hazard.current_risk in ["High", "Extreme"]:
                loading += 0.1
        
        return base_premium * loading


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    modeler = ClimateRiskModeler(ClimateScenario.SSP2_45)
    
    property_data = {
        "id": "PROP-001",
        "latitude": 19.076,
        "longitude": 72.877,
        "elevation": 15,
        "distance_to_coast": 5,
        "rainfall": 2400
    }
    
    assessment = modeler.assess_property_risk(property_data)
    
    print(f"Climate Risk Assessment")
    print(f"=" * 50)
    print(f"Region: {assessment.location['region']}")
    print(f"Overall Risk Score: {assessment.overall_risk_score}/100")
    print(f"Investment Rating: {assessment.investment_rating}")
    print(f"Insurance Class: {assessment.insurance_risk_class}")
    print(f"\nProjections (2050 - {assessment.projections[2050].scenario.code}):")
    print(f"  Temperature Rise: +{assessment.projections[2050].temperature_change}°C")
    print(f"  Sea Level Rise: {assessment.projections[2050].sea_level_rise}mm")
    print(f"  Extreme Heat Days: {assessment.projections[2050].extreme_heat_days}")
    print(f"\nHazards Identified: {len(assessment.hazard_risks)}")
    for h in assessment.hazard_risks:
        print(f"  - {h.hazard_type.value}: {h.current_risk} → {h.future_risk_2050}")
