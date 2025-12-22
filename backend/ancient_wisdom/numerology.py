"""
=============================================================================
SPRINT 7-8: NUMEROLOGY CALCULATOR
Dharma Realty - Ancient Wisdom Module
=============================================================================

Pythagorean & Chaldean Systems, Property-Owner Compatibility, Lucky Dates
"""

from datetime import datetime, date
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum


class NumerologySystem(Enum):
    """Numerology calculation systems"""
    PYTHAGOREAN = "Pythagorean"
    CHALDEAN = "Chaldean"


@dataclass
class NumerologyProfile:
    """Complete numerology profile"""
    name: str
    birth_date: date
    life_path_number: int
    destiny_number: int
    soul_urge_number: int
    personality_number: int
    maturity_number: int
    personal_year: int
    lucky_numbers: List[int]
    challenging_numbers: List[int]
    interpretation: Dict


@dataclass
class PropertyNumerology:
    """Property numerology analysis"""
    property_number: str
    address_number: int
    reduced_number: int
    energy: str
    suitable_for: List[str]
    challenges: List[str]
    enhancements: List[str]
    color_recommendations: List[str]


@dataclass
class CompatibilityReport:
    """Owner-Property compatibility report"""
    compatibility_score: int
    life_path_match: bool
    energy_alignment: str
    strengths: List[str]
    challenges: List[str]
    recommendations: List[str]
    lucky_days: List[int]
    lucky_months: List[int]


class NumerologyCalculator:
    """
    Complete Numerology System for Property Analysis
    Implements: Pythagorean, Chaldean, Compatibility, Lucky Dates
    """
    
    # Pythagorean letter values (A-Z = 1-9 repeating)
    PYTHAGOREAN_VALUES = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
        'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8
    }
    
    # Chaldean letter values (different from Pythagorean)
    CHALDEAN_VALUES = {
        'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 8, 'G': 3, 'H': 5, 'I': 1,
        'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 7, 'P': 8, 'Q': 1, 'R': 2,
        'S': 3, 'T': 4, 'U': 6, 'V': 6, 'W': 6, 'X': 5, 'Y': 1, 'Z': 7
    }
    
    # Vowels for soul urge calculation
    VOWELS = set('AEIOU')
    
    # Number meanings
    NUMBER_MEANINGS = {
        1: {
            "energy": "Leadership, Independence, New Beginnings",
            "suitable": ["Entrepreneurs", "Leaders", "Independent professionals"],
            "color": "Red",
            "element": "Fire"
        },
        2: {
            "energy": "Partnership, Balance, Diplomacy",
            "suitable": ["Couples", "Counselors", "Mediators"],
            "color": "Orange",
            "element": "Water"
        },
        3: {
            "energy": "Creativity, Expression, Joy",
            "suitable": ["Artists", "Writers", "Entertainers"],
            "color": "Yellow",
            "element": "Fire"
        },
        4: {
            "energy": "Stability, Structure, Hard Work",
            "suitable": ["Families", "Builders", "Managers"],
            "color": "Green",
            "element": "Earth"
        },
        5: {
            "energy": "Change, Freedom, Adventure",
            "suitable": ["Travelers", "Adventurers", "Salespeople"],
            "color": "Light Blue",
            "element": "Air"
        },
        6: {
            "energy": "Home, Family, Responsibility",
            "suitable": ["Families", "Healers", "Teachers"],
            "color": "Blue",
            "element": "Earth"
        },
        7: {
            "energy": "Spirituality, Wisdom, Introspection",
            "suitable": ["Scholars", "Spiritual seekers", "Researchers"],
            "color": "Purple",
            "element": "Water"
        },
        8: {
            "energy": "Abundance, Power, Achievement",
            "suitable": ["Business owners", "Executives", "Investors"],
            "color": "Brown/Pink",
            "element": "Earth"
        },
        9: {
            "energy": "Completion, Humanitarianism, Wisdom",
            "suitable": ["Philanthropists", "Healers", "Teachers"],
            "color": "White/Gold",
            "element": "Fire"
        },
        11: {
            "energy": "Master Number - Intuition, Inspiration",
            "suitable": ["Spiritual leaders", "Visionaries"],
            "color": "Silver",
            "element": "Air"
        },
        22: {
            "energy": "Master Number - Master Builder",
            "suitable": ["Large-scale builders", "Visionary leaders"],
            "color": "Gold",
            "element": "Earth"
        }
    }
    
    def __init__(self, system: NumerologySystem = NumerologySystem.PYTHAGOREAN):
        self.system = system
        self.values = self.PYTHAGOREAN_VALUES if system == NumerologySystem.PYTHAGOREAN else self.CHALDEAN_VALUES
    
    def calculate_person_profile(self, name: str, 
                                birth_date: date) -> NumerologyProfile:
        """Calculate complete numerology profile for a person"""
        
        life_path = self.calculate_life_path(birth_date)
        destiny = self.calculate_destiny_number(name)
        soul_urge = self.calculate_soul_urge(name)
        personality = self.calculate_personality_number(name)
        maturity = self.calculate_maturity_number(life_path, destiny)
        personal_year = self.calculate_personal_year(birth_date)
        
        lucky = self._get_lucky_numbers(life_path, destiny)
        challenging = self._get_challenging_numbers(life_path)
        
        interpretation = self._interpret_profile(
            life_path, destiny, soul_urge, personality
        )
        
        return NumerologyProfile(
            name=name,
            birth_date=birth_date,
            life_path_number=life_path,
            destiny_number=destiny,
            soul_urge_number=soul_urge,
            personality_number=personality,
            maturity_number=maturity,
            personal_year=personal_year,
            lucky_numbers=lucky,
            challenging_numbers=challenging,
            interpretation=interpretation
        )
    
    def analyze_property_number(self, address: str) -> PropertyNumerology:
        """Analyze property/address numerology"""
        
        # Extract house number
        numbers = ''.join(filter(str.isdigit, address.split()[0] if address else "0"))
        property_number = numbers if numbers else "0"
        
        # Calculate address number
        address_number = self._sum_digits(property_number)
        reduced_number = self.reduce_to_single(address_number)
        
        meaning = self.NUMBER_MEANINGS.get(reduced_number, self.NUMBER_MEANINGS[1])
        
        return PropertyNumerology(
            property_number=property_number,
            address_number=address_number,
            reduced_number=reduced_number,
            energy=meaning["energy"],
            suitable_for=meaning["suitable"],
            challenges=self._get_number_challenges(reduced_number),
            enhancements=self._get_number_enhancements(reduced_number),
            color_recommendations=[meaning["color"]]
        )
    
    def calculate_compatibility(self, person_profile: NumerologyProfile,
                               property_numerology: PropertyNumerology) -> CompatibilityReport:
        """Calculate compatibility between person and property"""
        
        life_path = person_profile.life_path_number
        property_num = property_numerology.reduced_number
        
        # Calculate compatibility score
        score = self._calculate_compatibility_score(life_path, property_num)
        
        # Check life path match
        life_path_match = self._check_life_path_match(life_path, property_num)
        
        # Determine energy alignment
        alignment = self._determine_energy_alignment(life_path, property_num)
        
        # Get strengths and challenges
        strengths = self._get_compatibility_strengths(life_path, property_num)
        challenges = self._get_compatibility_challenges(life_path, property_num)
        
        # Recommendations
        recommendations = self._get_compatibility_recommendations(
            life_path, property_num, score
        )
        
        # Lucky days and months
        lucky_days = self._get_lucky_days(life_path, property_num)
        lucky_months = self._get_lucky_months(life_path)
        
        return CompatibilityReport(
            compatibility_score=score,
            life_path_match=life_path_match,
            energy_alignment=alignment,
            strengths=strengths,
            challenges=challenges,
            recommendations=recommendations,
            lucky_days=lucky_days,
            lucky_months=lucky_months
        )
    
    def get_lucky_dates(self, life_path: int, 
                       start_date: date,
                       days: int = 30) -> List[Dict]:
        """Find lucky dates based on numerology"""
        
        lucky_dates = []
        
        for i in range(days):
            current = start_date + timedelta(days=i)
            day_number = self.reduce_to_single(current.day)
            month_number = self.reduce_to_single(current.month)
            universal_day = self.reduce_to_single(
                current.day + current.month + current.year
            )
            
            # Check if it's a lucky day
            is_lucky = (
                day_number in [life_path, 1, 8] or
                universal_day == life_path or
                day_number + month_number == life_path
            )
            
            if is_lucky:
                lucky_dates.append({
                    "date": current,
                    "day_number": day_number,
                    "universal_day": universal_day,
                    "strength": "Strong" if universal_day == life_path else "Moderate",
                    "good_for": self._get_day_activities(day_number)
                })
        
        return lucky_dates
    
    def calculate_life_path(self, birth_date: date) -> int:
        """Calculate Life Path number from birth date"""
        day = self.reduce_to_single(birth_date.day)
        month = self.reduce_to_single(birth_date.month)
        year = self.reduce_to_single(birth_date.year)
        
        total = day + month + year
        return self.reduce_to_single(total, keep_master=True)
    
    def calculate_destiny_number(self, name: str) -> int:
        """Calculate Destiny/Expression number from full name"""
        clean_name = name.upper().replace(" ", "")
        total = sum(self.values.get(char, 0) for char in clean_name)
        return self.reduce_to_single(total, keep_master=True)
    
    def calculate_soul_urge(self, name: str) -> int:
        """Calculate Soul Urge/Heart's Desire from vowels"""
        clean_name = name.upper().replace(" ", "")
        vowel_sum = sum(self.values.get(char, 0) for char in clean_name if char in self.VOWELS)
        return self.reduce_to_single(vowel_sum, keep_master=True)
    
    def calculate_personality_number(self, name: str) -> int:
        """Calculate Personality number from consonants"""
        clean_name = name.upper().replace(" ", "")
        consonant_sum = sum(self.values.get(char, 0) for char in clean_name if char not in self.VOWELS)
        return self.reduce_to_single(consonant_sum, keep_master=True)
    
    def calculate_maturity_number(self, life_path: int, destiny: int) -> int:
        """Calculate Maturity number"""
        return self.reduce_to_single(life_path + destiny, keep_master=True)
    
    def calculate_personal_year(self, birth_date: date, 
                               year: int = None) -> int:
        """Calculate Personal Year number"""
        if year is None:
            year = datetime.now().year
        
        day = self.reduce_to_single(birth_date.day)
        month = self.reduce_to_single(birth_date.month)
        year_num = self.reduce_to_single(year)
        
        return self.reduce_to_single(day + month + year_num)
    
    def reduce_to_single(self, number: int, keep_master: bool = False) -> int:
        """Reduce number to single digit (or master number)"""
        while number > 9:
            if keep_master and number in [11, 22, 33]:
                return number
            number = sum(int(d) for d in str(number))
        return number
    
    def _sum_digits(self, number_str: str) -> int:
        """Sum all digits in a string"""
        return sum(int(d) for d in number_str if d.isdigit())
    
    def _get_lucky_numbers(self, life_path: int, destiny: int) -> List[int]:
        """Get lucky numbers for a person"""
        compatible = {
            1: [1, 3, 5, 7], 2: [2, 4, 6, 8], 3: [1, 3, 5, 9],
            4: [2, 4, 6, 8], 5: [1, 3, 5, 7], 6: [2, 4, 6, 9],
            7: [1, 3, 5, 7], 8: [2, 4, 6, 8], 9: [3, 6, 9]
        }
        return compatible.get(life_path, [1, 5, 7])
    
    def _get_challenging_numbers(self, life_path: int) -> List[int]:
        """Get challenging numbers for a person"""
        challenges = {
            1: [4, 8], 2: [1, 5], 3: [4, 8], 4: [1, 5],
            5: [2, 4], 6: [1, 5], 7: [2, 4], 8: [1, 3, 5],
            9: [4, 8]
        }
        return challenges.get(life_path, [])
    
    def _interpret_profile(self, life_path: int, destiny: int,
                          soul_urge: int, personality: int) -> Dict:
        """Interpret numerology profile"""
        return {
            "life_purpose": self.NUMBER_MEANINGS.get(life_path, {}).get("energy", ""),
            "expression": self.NUMBER_MEANINGS.get(destiny, {}).get("energy", ""),
            "inner_desire": self.NUMBER_MEANINGS.get(soul_urge, {}).get("energy", ""),
            "outer_image": self.NUMBER_MEANINGS.get(personality, {}).get("energy", "")
        }
    
    def _get_number_challenges(self, number: int) -> List[str]:
        """Get challenges associated with a number"""
        challenges = {
            1: ["Loneliness", "Ego issues"],
            2: ["Over-sensitivity", "Dependency"],
            3: ["Scattered energy", "Superficiality"],
            4: ["Rigidity", "Workaholism"],
            5: ["Restlessness", "Overindulgence"],
            6: ["Over-responsibility", "Worry"],
            7: ["Isolation", "Skepticism"],
            8: ["Power struggles", "Material focus"],
            9: ["Detachment", "Unfinished projects"]
        }
        return challenges.get(number, [])
    
    def _get_number_enhancements(self, number: int) -> List[str]:
        """Get enhancements for a number"""
        enhancements = {
            1: ["Sunlight", "Bold decor", "Leadership symbols"],
            2: ["Soft lighting", "Pairs of objects", "Water features"],
            3: ["Bright colors", "Art", "Music"],
            4: ["Structure", "Earth tones", "Solid furniture"],
            5: ["Movement", "Variety", "Windows"],
            6: ["Family photos", "Comfortable seating", "Gardens"],
            7: ["Quiet spaces", "Books", "Spiritual symbols"],
            8: ["Luxury items", "Success symbols", "Quality materials"],
            9: ["Global art", "Open spaces", "Universal symbols"]
        }
        return enhancements.get(number, [])
    
    def _calculate_compatibility_score(self, life_path: int, 
                                       property_num: int) -> int:
        """Calculate compatibility score"""
        compatibility_matrix = {
            (1, 1): 90, (1, 5): 85, (1, 7): 80, (1, 9): 75,
            (2, 2): 90, (2, 6): 85, (2, 8): 80,
            (3, 3): 90, (3, 5): 85, (3, 9): 85,
            (4, 4): 90, (4, 6): 85, (4, 8): 80,
            (5, 5): 85, (5, 1): 85, (5, 3): 80,
            (6, 6): 90, (6, 2): 85, (6, 4): 85,
            (7, 7): 90, (7, 1): 80, (7, 5): 75,
            (8, 8): 85, (8, 4): 85, (8, 2): 80,
            (9, 9): 85, (9, 3): 85, (9, 6): 80
        }
        
        score = compatibility_matrix.get((life_path, property_num), 
                compatibility_matrix.get((property_num, life_path), 65))
        
        return score
    
    def _check_life_path_match(self, life_path: int, property_num: int) -> bool:
        """Check if life path matches property number"""
        compatible_pairs = {
            1: [1, 3, 5, 7, 9], 2: [2, 4, 6, 8], 3: [1, 3, 5, 9],
            4: [2, 4, 6, 8], 5: [1, 3, 5, 7, 9], 6: [2, 4, 6, 9],
            7: [1, 5, 7], 8: [2, 4, 6, 8], 9: [1, 3, 6, 9]
        }
        return property_num in compatible_pairs.get(life_path, [])
    
    def _determine_energy_alignment(self, life_path: int, 
                                    property_num: int) -> str:
        """Determine energy alignment"""
        if life_path == property_num:
            return "Perfect alignment"
        elif abs(life_path - property_num) <= 2:
            return "Harmonious"
        elif life_path + property_num == 10:
            return "Complementary"
        else:
            return "Requiring adjustment"
    
    def _get_compatibility_strengths(self, life_path: int, 
                                     property_num: int) -> List[str]:
        """Get compatibility strengths"""
        strengths = []
        if life_path == property_num:
            strengths.append("Natural resonance with property energy")
        if life_path in [1, 5, 7, 9] and property_num in [1, 5, 7, 9]:
            strengths.append("Dynamic energy flow")
        if life_path in [2, 4, 6, 8] and property_num in [2, 4, 6, 8]:
            strengths.append("Stable and grounded energy")
        return strengths if strengths else ["Neutral compatibility"]
    
    def _get_compatibility_challenges(self, life_path: int, 
                                      property_num: int) -> List[str]:
        """Get compatibility challenges"""
        if life_path in [1, 5] and property_num in [4, 8]:
            return ["May feel restricted", "Need for more freedom"]
        if life_path in [2, 6] and property_num in [1, 5]:
            return ["Energy may be too intense", "Need for calm spaces"]
        return []
    
    def _get_compatibility_recommendations(self, life_path: int,
                                          property_num: int,
                                          score: int) -> List[str]:
        """Get recommendations"""
        recommendations = []
        
        if score < 70:
            recommendations.append("Add your personal number's color to decor")
            recommendations.append("Create a personal space aligned with your number")
        
        recommendations.append(f"Enhance with {self.NUMBER_MEANINGS.get(life_path, {}).get('color', 'neutral')} colors")
        
        return recommendations
    
    def _get_lucky_days(self, life_path: int, property_num: int) -> List[int]:
        """Get lucky days of the month"""
        return [life_path, property_num, life_path + property_num if life_path + property_num <= 28 else 1]
    
    def _get_lucky_months(self, life_path: int) -> List[int]:
        """Get lucky months"""
        return [life_path, 12 - life_path if 12 - life_path > 0 else 1]
    
    def _get_day_activities(self, day_number: int) -> List[str]:
        """Get activities suitable for a day number"""
        activities = {
            1: ["New beginnings", "Signing contracts"],
            2: ["Partnerships", "Negotiations"],
            3: ["Creative projects", "Marketing"],
            4: ["Construction", "Organization"],
            5: ["Travel", "Changes"],
            6: ["Family matters", "Home improvements"],
            7: ["Planning", "Research"],
            8: ["Financial decisions", "Business"],
            9: ["Completion", "Charitable acts"]
        }
        return activities.get(day_number, ["General activities"])


# Needed import
from datetime import timedelta


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    calculator = NumerologyCalculator()
    
    # Calculate person profile
    profile = calculator.calculate_person_profile(
        "Rajesh Kumar",
        date(1985, 7, 15)
    )
    
    print(f"Numerology Profile for {profile.name}:")
    print(f"  Life Path: {profile.life_path_number}")
    print(f"  Destiny: {profile.destiny_number}")
    print(f"  Soul Urge: {profile.soul_urge_number}")
    print(f"  Lucky Numbers: {profile.lucky_numbers}")
    
    # Analyze property
    property_num = calculator.analyze_property_number("42 Harmony Lane")
    print(f"\nProperty Analysis:")
    print(f"  Number: {property_num.reduced_number}")
    print(f"  Energy: {property_num.energy}")
    
    # Compatibility
    compatibility = calculator.calculate_compatibility(profile, property_num)
    print(f"\nCompatibility Score: {compatibility.compatibility_score}/100")
