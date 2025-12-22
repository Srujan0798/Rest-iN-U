"""
=============================================================================
SPRINT 7-8: FENG SHUI CALCULATOR
Dharma Realty - Ancient Wisdom Module
=============================================================================

8 Bagua Directions, 5 Elements, Flying Stars, Annual Afflictions
"""

from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import math


class Direction(Enum):
    """8 Compass Directions (Bagua)"""
    NORTH = "North"
    NORTHEAST = "Northeast"
    EAST = "East"
    SOUTHEAST = "Southeast"
    SOUTH = "South"
    SOUTHWEST = "Southwest"
    WEST = "West"
    NORTHWEST = "Northwest"


class Element(Enum):
    """5 Chinese Elements"""
    WOOD = "Wood"
    FIRE = "Fire"
    EARTH = "Earth"
    METAL = "Metal"
    WATER = "Water"


class BaguaArea(Enum):
    """8 Life Aspects (Bagua Map)"""
    CAREER = "Career"
    KNOWLEDGE = "Knowledge"
    FAMILY = "Family"
    WEALTH = "Wealth"
    FAME = "Fame"
    RELATIONSHIPS = "Relationships"
    CHILDREN = "Children"
    HELPFUL_PEOPLE = "Helpful People"
    HEALTH = "Health"


@dataclass
class FlyingStar:
    """Flying Star attributes"""
    number: int
    element: Element
    nature: str  # Auspicious/Inauspicious
    affects: str
    remedies: List[str]


@dataclass
class DirectionalAnalysis:
    """Analysis for a specific direction"""
    direction: Direction
    element: Element
    bagua_area: BaguaArea
    flying_star: FlyingStar
    score: int
    recommendations: List[str]
    colors: List[str]
    objects: List[str]


@dataclass
class FengShuiReport:
    """Complete Feng Shui Analysis Report"""
    property_id: str
    analysis_date: datetime
    overall_score: int
    element_balance: Dict[Element, float]
    directional_analysis: Dict[Direction, DirectionalAnalysis]
    annual_afflictions: List[Dict]
    remedies: List[Dict]
    enhancements: List[Dict]
    favorable_rooms: Dict[str, Direction]
    wealth_sectors: List[Direction]
    health_concerns: List[str]


class FengShuiCalculator:
    """
    Complete Feng Shui Analysis System
    Implements: Bagua Map, Flying Stars, 5 Elements, Annual Afflictions
    """
    
    # Direction to Element mapping
    DIRECTION_ELEMENTS = {
        Direction.NORTH: Element.WATER,
        Direction.NORTHEAST: Element.EARTH,
        Direction.EAST: Element.WOOD,
        Direction.SOUTHEAST: Element.WOOD,
        Direction.SOUTH: Element.FIRE,
        Direction.SOUTHWEST: Element.EARTH,
        Direction.WEST: Element.METAL,
        Direction.NORTHWEST: Element.METAL
    }
    
    # Direction to Bagua Area mapping
    DIRECTION_BAGUA = {
        Direction.NORTH: BaguaArea.CAREER,
        Direction.NORTHEAST: BaguaArea.KNOWLEDGE,
        Direction.EAST: BaguaArea.FAMILY,
        Direction.SOUTHEAST: BaguaArea.WEALTH,
        Direction.SOUTH: BaguaArea.FAME,
        Direction.SOUTHWEST: BaguaArea.RELATIONSHIPS,
        Direction.WEST: BaguaArea.CHILDREN,
        Direction.NORTHWEST: BaguaArea.HELPFUL_PEOPLE
    }
    
    # Element colors
    ELEMENT_COLORS = {
        Element.WOOD: ["green", "brown", "teal"],
        Element.FIRE: ["red", "orange", "pink", "purple"],
        Element.EARTH: ["yellow", "beige", "tan", "terracotta"],
        Element.METAL: ["white", "gray", "silver", "gold"],
        Element.WATER: ["black", "blue", "navy"]
    }
    
    # Element productive cycle
    PRODUCTIVE_CYCLE = {
        Element.WOOD: Element.FIRE,
        Element.FIRE: Element.EARTH,
        Element.EARTH: Element.METAL,
        Element.METAL: Element.WATER,
        Element.WATER: Element.WOOD
    }
    
    # Element destructive cycle
    DESTRUCTIVE_CYCLE = {
        Element.WOOD: Element.EARTH,
        Element.FIRE: Element.METAL,
        Element.EARTH: Element.WATER,
        Element.METAL: Element.WOOD,
        Element.WATER: Element.FIRE
    }
    
    # Flying Stars (1-9)
    FLYING_STARS = {
        1: FlyingStar(1, Element.WATER, "Auspicious", "Career, wisdom", 
                     ["Enhance with metal", "Water features"]),
        2: FlyingStar(2, Element.EARTH, "Inauspicious", "Illness", 
                     ["Metal wind chimes", "Wu Lou gourd"]),
        3: FlyingStar(3, Element.WOOD, "Inauspicious", "Arguments, litigation", 
                     ["Red objects", "Fire element"]),
        4: FlyingStar(4, Element.WOOD, "Auspicious", "Romance, education", 
                     ["Water features", "Fresh flowers"]),
        5: FlyingStar(5, Element.EARTH, "Highly Inauspicious", "Misfortune", 
                     ["Metal cure", "Salt water cure", "6-rod wind chime"]),
        6: FlyingStar(6, Element.METAL, "Auspicious", "Authority, heaven luck", 
                     ["Earth crystals", "Ceramics"]),
        7: FlyingStar(7, Element.METAL, "Inauspicious", "Violence, theft", 
                     ["Water feature", "Blue objects"]),
        8: FlyingStar(8, Element.EARTH, "Most Auspicious", "Wealth, prosperity", 
                     ["Fire element", "Red and purple"]),
        9: FlyingStar(9, Element.FIRE, "Auspicious", "Future prosperity", 
                     ["Wood element", "Plants"])
    }
    
    def __init__(self):
        self.current_year = datetime.now().year
    
    def analyze_property(self, property_data: Dict, 
                        facing_direction: Direction) -> FengShuiReport:
        """
        Complete Feng Shui analysis of a property
        
        Args:
            property_data: Property details
            facing_direction: Front door facing direction
        
        Returns:
            FengShuiReport with complete analysis
        """
        
        # Analyze each direction
        directional_analysis = {}
        for direction in Direction:
            analysis = self._analyze_direction(direction, facing_direction)
            directional_analysis[direction] = analysis
        
        # Calculate element balance
        element_balance = self._calculate_element_balance(property_data)
        
        # Get annual afflictions
        annual_afflictions = self._get_annual_afflictions(self.current_year)
        
        # Generate remedies
        remedies = self._generate_remedies(directional_analysis, annual_afflictions)
        
        # Generate enhancements
        enhancements = self._generate_enhancements(directional_analysis)
        
        # Calculate favorable rooms
        favorable_rooms = self._calculate_favorable_rooms(directional_analysis)
        
        # Identify wealth sectors
        wealth_sectors = self._identify_wealth_sectors(directional_analysis)
        
        # Identify health concerns
        health_concerns = self._identify_health_concerns(directional_analysis, annual_afflictions)
        
        # Calculate overall score
        overall_score = self._calculate_overall_score(
            directional_analysis, element_balance, annual_afflictions
        )
        
        return FengShuiReport(
            property_id=property_data.get("id", "unknown"),
            analysis_date=datetime.now(),
            overall_score=overall_score,
            element_balance=element_balance,
            directional_analysis=directional_analysis,
            annual_afflictions=annual_afflictions,
            remedies=remedies,
            enhancements=enhancements,
            favorable_rooms=favorable_rooms,
            wealth_sectors=wealth_sectors,
            health_concerns=health_concerns
        )
    
    def _analyze_direction(self, direction: Direction, 
                          facing: Direction) -> DirectionalAnalysis:
        """Analyze a specific direction sector"""
        
        element = self.DIRECTION_ELEMENTS[direction]
        bagua_area = self.DIRECTION_BAGUA[direction]
        
        # Get flying star for this sector (simplified - based on facing)
        star_number = self._get_sector_star(direction, facing)
        flying_star = self.FLYING_STARS[star_number]
        
        # Calculate score
        score = self._calculate_sector_score(flying_star, element)
        
        # Get recommendations
        recommendations = self._get_sector_recommendations(
            direction, element, flying_star, bagua_area
        )
        
        # Get colors
        colors = self.ELEMENT_COLORS[element]
        
        # Get recommended objects
        objects = self._get_recommended_objects(element, bagua_area)
        
        return DirectionalAnalysis(
            direction=direction,
            element=element,
            bagua_area=bagua_area,
            flying_star=flying_star,
            score=score,
            recommendations=recommendations,
            colors=colors,
            objects=objects
        )
    
    def _get_sector_star(self, direction: Direction, facing: Direction) -> int:
        """Get Flying Star number for a sector based on facing direction"""
        
        # Simplified Flying Star calculation
        direction_values = {
            Direction.NORTH: 1, Direction.NORTHEAST: 8, Direction.EAST: 3,
            Direction.SOUTHEAST: 4, Direction.SOUTH: 9, Direction.SOUTHWEST: 2,
            Direction.WEST: 7, Direction.NORTHWEST: 6
        }
        
        base = direction_values[facing]
        offset = direction_values[direction]
        
        star = ((base + offset - 2) % 9) + 1
        return star
    
    def _calculate_sector_score(self, star: FlyingStar, element: Element) -> int:
        """Calculate sector score based on Flying Star and element"""
        
        base_scores = {
            "Most Auspicious": 95,
            "Auspicious": 80,
            "Inauspicious": 40,
            "Highly Inauspicious": 20
        }
        
        score = base_scores.get(star.nature, 50)
        
        # Adjust for element harmony
        if self.PRODUCTIVE_CYCLE.get(element) == star.element:
            score += 10
        elif self.DESTRUCTIVE_CYCLE.get(element) == star.element:
            score -= 10
        
        return max(0, min(100, score))
    
    def _get_sector_recommendations(self, direction: Direction, element: Element,
                                   star: FlyingStar, bagua: BaguaArea) -> List[str]:
        """Get recommendations for a sector"""
        
        recommendations = []
        
        # Element-based recommendations
        recommendations.append(f"Use {', '.join(self.ELEMENT_COLORS[element])} colors")
        
        # Star-based recommendations
        if star.nature in ["Inauspicious", "Highly Inauspicious"]:
            recommendations.extend(star.remedies)
        else:
            recommendations.append(f"Enhance with {element.value} element items")
        
        # Bagua-based recommendations
        bagua_tips = {
            BaguaArea.CAREER: "Place water feature or mirror",
            BaguaArea.KNOWLEDGE: "Add books and study materials",
            BaguaArea.FAMILY: "Display family photos, wood elements",
            BaguaArea.WEALTH: "Place wealth symbols, plants, purple decor",
            BaguaArea.FAME: "Use bright lighting, awards display",
            BaguaArea.RELATIONSHIPS: "Use pairs of objects, pink/red colors",
            BaguaArea.CHILDREN: "Add playful art, metal objects",
            BaguaArea.HELPFUL_PEOPLE: "Display travel photos, metal items"
        }
        
        if bagua in bagua_tips:
            recommendations.append(bagua_tips[bagua])
        
        return recommendations
    
    def _get_recommended_objects(self, element: Element, bagua: BaguaArea) -> List[str]:
        """Get recommended objects for element and bagua area"""
        
        element_objects = {
            Element.WOOD: ["Plants", "Wooden furniture", "Bamboo", "Paper art"],
            Element.FIRE: ["Candles", "Lamps", "Fireplace", "Sun symbols"],
            Element.EARTH: ["Crystals", "Ceramics", "Stones", "Square shapes"],
            Element.METAL: ["Metal sculptures", "Wind chimes", "Coins", "Clocks"],
            Element.WATER: ["Fountains", "Aquariums", "Mirrors", "Glass"]
        }
        
        return element_objects.get(element, [])
    
    def _calculate_element_balance(self, property_data: Dict) -> Dict[Element, float]:
        """Calculate current element balance in property"""
        
        # In production, analyze actual property features
        # For now, return estimated balance
        
        balance = {
            Element.WOOD: property_data.get("wood_score", 20),
            Element.FIRE: property_data.get("fire_score", 15),
            Element.EARTH: property_data.get("earth_score", 25),
            Element.METAL: property_data.get("metal_score", 20),
            Element.WATER: property_data.get("water_score", 20)
        }
        
        # Normalize to percentages
        total = sum(balance.values())
        return {k: (v / total) * 100 for k, v in balance.items()}
    
    def _get_annual_afflictions(self, year: int) -> List[Dict]:
        """Get annual feng shui afflictions for the year"""
        
        # Calculate Tai Sui (Grand Duke Jupiter) position
        tai_sui_cycle = ["North", "North-Northeast", "East-Northeast", "East",
                        "East-Southeast", "South-Southeast", "South",
                        "South-Southwest", "West-Southwest", "West",
                        "West-Northwest", "North-Northwest"]
        
        tai_sui_position = tai_sui_cycle[(year - 4) % 12]
        
        # Calculate 5 Yellow position (simplified)
        five_yellow_cycle = ["Center", "Northwest", "West", "Northeast", 
                            "South", "North", "Southwest", "East", "Southeast"]
        five_yellow_position = five_yellow_cycle[(year - 2004) % 9]
        
        # Calculate 3 Killings position
        three_killings = {0: "South", 1: "East", 2: "North", 3: "West"}
        three_killings_position = three_killings[(year % 4)]
        
        return [
            {
                "name": "Tai Sui (Grand Duke)",
                "position": tai_sui_position,
                "severity": "High",
                "avoid": ["Major renovations", "Disturbing this sector"],
                "remedy": ["Pi Yao facing Tai Sui", "Avoid sitting facing this direction"]
            },
            {
                "name": "5 Yellow (Wu Wang)",
                "position": five_yellow_position,
                "severity": "Highest",
                "avoid": ["Renovations", "Noise", "Ground breaking"],
                "remedy": ["6-rod metal wind chime", "Salt water cure", "Wu Lou"]
            },
            {
                "name": "3 Killings (San Sha)",
                "position": three_killings_position,
                "severity": "High",
                "avoid": ["Sitting with back to this direction"],
                "remedy": ["3 celestial guardians", "Face this direction"]
            }
        ]
    
    def _generate_remedies(self, directional: Dict, afflictions: List) -> List[Dict]:
        """Generate remedies for problematic areas"""
        
        remedies = []
        
        # Remedies for inauspicious sectors
        for direction, analysis in directional.items():
            if analysis.score < 50:
                remedies.append({
                    "location": direction.value,
                    "issue": f"{analysis.flying_star.affects}",
                    "remedies": analysis.flying_star.remedies,
                    "priority": "High" if analysis.score < 30 else "Medium"
                })
        
        # Remedies for annual afflictions
        for affliction in afflictions:
            remedies.append({
                "location": affliction["position"],
                "issue": affliction["name"],
                "remedies": affliction["remedy"],
                "priority": "Critical" if affliction["severity"] == "Highest" else "High"
            })
        
        return remedies
    
    def _generate_enhancements(self, directional: Dict) -> List[Dict]:
        """Generate enhancements for auspicious areas"""
        
        enhancements = []
        
        for direction, analysis in directional.items():
            if analysis.score >= 70:
                enhancements.append({
                    "location": direction.value,
                    "bagua_area": analysis.bagua_area.value,
                    "current_score": analysis.score,
                    "enhance_with": analysis.objects[:3],
                    "colors": analysis.colors[:2],
                    "benefit": analysis.flying_star.affects
                })
        
        return sorted(enhancements, key=lambda x: x["current_score"], reverse=True)
    
    def _calculate_favorable_rooms(self, directional: Dict) -> Dict[str, Direction]:
        """Calculate best directions for each room type"""
        
        room_bagua_mapping = {
            "bedroom": [BaguaArea.RELATIONSHIPS, BaguaArea.HEALTH],
            "office": [BaguaArea.CAREER, BaguaArea.WEALTH],
            "kitchen": [BaguaArea.FAMILY, BaguaArea.HEALTH],
            "living_room": [BaguaArea.FAME, BaguaArea.FAMILY],
            "meditation": [BaguaArea.KNOWLEDGE, BaguaArea.HELPFUL_PEOPLE]
        }
        
        favorable = {}
        
        for room, preferred_baguas in room_bagua_mapping.items():
            best_direction = None
            best_score = 0
            
            for direction, analysis in directional.items():
                if analysis.bagua_area in preferred_baguas and analysis.score > best_score:
                    best_score = analysis.score
                    best_direction = direction
            
            if best_direction:
                favorable[room] = best_direction
        
        return favorable
    
    def _identify_wealth_sectors(self, directional: Dict) -> List[Direction]:
        """Identify wealth-enhancing sectors"""
        
        wealth_sectors = []
        
        for direction, analysis in directional.items():
            if analysis.bagua_area == BaguaArea.WEALTH and analysis.score >= 60:
                wealth_sectors.append(direction)
            elif analysis.flying_star.number == 8:  # Wealth star
                wealth_sectors.append(direction)
        
        return wealth_sectors
    
    def _identify_health_concerns(self, directional: Dict, 
                                 afflictions: List) -> List[str]:
        """Identify health-related feng shui concerns"""
        
        concerns = []
        
        # Check for illness star (2)
        for direction, analysis in directional.items():
            if analysis.flying_star.number == 2:
                concerns.append(f"Illness star 2 in {direction.value} - use metal cure")
        
        # Check for 5 Yellow
        for affliction in afflictions:
            if affliction["name"] == "5 Yellow (Wu Wang)":
                concerns.append(f"5 Yellow in {affliction['position']} - major health risk")
        
        return concerns
    
    def _calculate_overall_score(self, directional: Dict, 
                                element_balance: Dict,
                                afflictions: List) -> int:
        """Calculate overall Feng Shui score"""
        
        # Average directional scores
        directional_avg = sum(a.score for a in directional.values()) / len(directional)
        
        # Element balance score (ideal is 20% each)
        balance_variance = sum(abs(v - 20) for v in element_balance.values())
        balance_score = max(0, 100 - balance_variance)
        
        # Affliction penalty
        affliction_penalty = len(afflictions) * 5
        
        overall = (directional_avg * 0.5) + (balance_score * 0.3) - affliction_penalty
        
        return max(0, min(100, int(overall)))


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    calculator = FengShuiCalculator()
    
    property_data = {
        "id": "PROP-001",
        "name": "Harmony Villa",
        "wood_score": 25,
        "fire_score": 15,
        "earth_score": 20,
        "metal_score": 22,
        "water_score": 18
    }
    
    report = calculator.analyze_property(property_data, Direction.SOUTH)
    
    print(f"Overall Feng Shui Score: {report.overall_score}/100")
    print(f"\nElement Balance:")
    for element, percentage in report.element_balance.items():
        print(f"  {element.value}: {percentage:.1f}%")
    
    print(f"\nWealth Sectors: {[d.value for d in report.wealth_sectors]}")
    print(f"\nTop Remedies:")
    for remedy in report.remedies[:3]:
        print(f"  - {remedy['location']}: {remedy['issue']}")
