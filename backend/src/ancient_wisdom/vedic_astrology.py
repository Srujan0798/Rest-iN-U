"""
=============================================================================
SPRINT 7-8: VEDIC ASTROLOGY ENGINE
Dharma Realty - Ancient Wisdom Module
=============================================================================

Muhurta Timing, 27 Nakshatras, Panchang Integration, Planetary Periods
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass
from enum import Enum
import math


class Nakshatra(Enum):
    """27 Lunar Mansions (Nakshatras)"""
    ASHWINI = ("Ashwini", "Ketu", "Horse", "Healing, speed")
    BHARANI = ("Bharani", "Venus", "Yoni", "Transformation")
    KRITTIKA = ("Krittika", "Sun", "Razor", "Purification")
    ROHINI = ("Rohini", "Moon", "Chariot", "Growth, beauty")
    MRIGASHIRA = ("Mrigashira", "Mars", "Deer", "Seeking")
    ARDRA = ("Ardra", "Rahu", "Teardrop", "Destruction, renewal")
    PUNARVASU = ("Punarvasu", "Jupiter", "Bow", "Return, restoration")
    PUSHYA = ("Pushya", "Saturn", "Flower", "Nourishment")
    ASHLESHA = ("Ashlesha", "Mercury", "Serpent", "Binding")
    MAGHA = ("Magha", "Ketu", "Throne", "Authority")
    PURVA_PHALGUNI = ("Purva Phalguni", "Venus", "Hammock", "Pleasure")
    UTTARA_PHALGUNI = ("Uttara Phalguni", "Sun", "Bed", "Patronage")
    HASTA = ("Hasta", "Moon", "Hand", "Skill")
    CHITRA = ("Chitra", "Mars", "Pearl", "Creativity")
    SWATI = ("Swati", "Rahu", "Coral", "Independence")
    VISHAKHA = ("Vishakha", "Jupiter", "Gateway", "Purpose")
    ANURADHA = ("Anuradha", "Saturn", "Lotus", "Devotion")
    JYESHTHA = ("Jyeshtha", "Mercury", "Earring", "Seniority")
    MULA = ("Mula", "Ketu", "Root", "Foundation")
    PURVA_ASHADHA = ("Purva Ashadha", "Venus", "Fan", "Invincibility")
    UTTARA_ASHADHA = ("Uttara Ashadha", "Sun", "Tusk", "Final victory")
    SHRAVANA = ("Shravana", "Moon", "Ear", "Learning")
    DHANISHTA = ("Dhanishta", "Mars", "Drum", "Wealth")
    SHATABHISHA = ("Shatabhisha", "Rahu", "Circle", "Healing")
    PURVA_BHADRAPADA = ("Purva Bhadrapada", "Jupiter", "Sword", "Intensity")
    UTTARA_BHADRAPADA = ("Uttara Bhadrapada", "Saturn", "Twins", "Depth")
    REVATI = ("Revati", "Mercury", "Fish", "Completion")
    
    def __init__(self, name: str, ruler: str, symbol: str, meaning: str):
        self.nakshatra_name = name
        self.ruler = ruler
        self.symbol = symbol
        self.meaning = meaning


class Tithi(Enum):
    """30 Lunar Days (Tithis)"""
    PRATIPADA = (1, "Pratipada", "Auspicious for beginnings")
    DWITIYA = (2, "Dwitiya", "Good for journeys")
    TRITIYA = (3, "Tritiya", "Auspicious")
    CHATURTHI = (4, "Chaturthi", "Avoid new ventures")
    PANCHAMI = (5, "Panchami", "Good for learning")
    SHASHTHI = (6, "Shashthi", "Good for travel")
    SAPTAMI = (7, "Saptami", "Good for vehicles")
    ASHTAMI = (8, "Ashtami", "Avoid buying")
    NAVAMI = (9, "Navami", "Mixed")
    DASHAMI = (10, "Dashami", "Auspicious")
    EKADASHI = (11, "Ekadashi", "Spiritual activities")
    DWADASHI = (12, "Dwadashi", "Good for rituals")
    TRAYODASHI = (13, "Trayodashi", "Auspicious")
    CHATURDASHI = (14, "Chaturdashi", "Avoid major activities")
    PURNIMA = (15, "Purnima", "Full Moon - highly auspicious")
    AMAVASYA = (30, "Amavasya", "New Moon - introspection")


class Vara(Enum):
    """7 Days of the Week (Varas)"""
    RAVIVARA = ("Sunday", "Sun", "Authority, government")
    SOMAVARA = ("Monday", "Moon", "Home, emotions")
    MANGALAVARA = ("Tuesday", "Mars", "Property, land")
    BUDHAVARA = ("Wednesday", "Mercury", "Business, communication")
    GURUVARA = ("Thursday", "Jupiter", "Auspicious, education")
    SHUKRAVARA = ("Friday", "Venus", "Luxury, marriage")
    SHANIVARA = ("Saturday", "Saturn", "Labor, avoid new")


class Yoga(Enum):
    """27 Yogas (Sun-Moon combinations)"""
    VISHKUMBHA = (1, "Vishkumbha", "Inauspicious")
    PRITI = (2, "Priti", "Auspicious")
    AYUSHMAN = (3, "Ayushman", "Auspicious")
    SAUBHAGYA = (4, "Saubhagya", "Highly Auspicious")
    SHOBHANA = (5, "Shobhana", "Auspicious")
    ATIGANDA = (6, "Atiganda", "Inauspicious")
    SUKARMA = (7, "Sukarma", "Auspicious")
    DHRITI = (8, "Dhriti", "Auspicious")
    SHULA = (9, "Shula", "Inauspicious")
    GANDA = (10, "Ganda", "Inauspicious")


@dataclass
class Panchang:
    """Daily Panchang (5 elements)"""
    date: datetime
    tithi: Tithi
    nakshatra: Nakshatra
    yoga: str
    karana: str
    vara: Vara
    sunrise: str
    sunset: str
    moonrise: str
    rahu_kaal: str
    gulika_kaal: str
    yamaganda: str
    abhijit_muhurta: str


@dataclass
class Muhurta:
    """Auspicious timing window"""
    start_time: datetime
    end_time: datetime
    quality: str  # Excellent, Good, Average, Avoid
    suitable_for: List[str]
    avoid_for: List[str]
    nakshatra: Nakshatra
    tithi: Tithi
    special_notes: str


@dataclass
class PropertyAstrologyReport:
    """Complete astrology report for property"""
    property_id: str
    analysis_date: datetime
    current_panchang: Panchang
    auspicious_muhurtas: List[Muhurta]
    griha_pravesh_dates: List[Dict]
    property_purchase_dates: List[Dict]
    registration_dates: List[Dict]
    renovation_dates: List[Dict]
    buyer_compatibility: Optional[Dict]
    planetary_influences: Dict
    recommendations: List[str]


class VedicAstrologyEngine:
    """
    Vedic Astrology Engine for Property Activities
    Implements: Muhurta, Nakshatras, Panchang, Planetary timing
    """
    
    # Nakshatras suitable for property activities
    PROPERTY_PURCHASE_NAKSHATRAS = [
        Nakshatra.ROHINI, Nakshatra.MRIGASHIRA, Nakshatra.PUSHYA,
        Nakshatra.UTTARA_PHALGUNI, Nakshatra.HASTA, Nakshatra.CHITRA,
        Nakshatra.SWATI, Nakshatra.ANURADHA, Nakshatra.UTTARA_ASHADHA,
        Nakshatra.SHRAVANA, Nakshatra.DHANISHTA, Nakshatra.UTTARA_BHADRAPADA,
        Nakshatra.REVATI
    ]
    
    GRIHA_PRAVESH_NAKSHATRAS = [
        Nakshatra.ROHINI, Nakshatra.MRIGASHIRA, Nakshatra.PUNARVASU,
        Nakshatra.PUSHYA, Nakshatra.UTTARA_PHALGUNI, Nakshatra.HASTA,
        Nakshatra.SWATI, Nakshatra.ANURADHA, Nakshatra.UTTARA_ASHADHA,
        Nakshatra.SHRAVANA, Nakshatra.DHANISHTA, Nakshatra.UTTARA_BHADRAPADA,
        Nakshatra.REVATI
    ]
    
    # Tithis to avoid
    AVOID_TITHIS = [
        Tithi.CHATURTHI, Tithi.ASHTAMI, Tithi.NAVAMI, 
        Tithi.CHATURDASHI, Tithi.AMAVASYA
    ]
    
    # Days suitable for property
    PROPERTY_DAYS = [Vara.SOMAVARA, Vara.BUDHAVARA, Vara.GURUVARA, Vara.SHUKRAVARA]
    
    def __init__(self):
        self.current_date = datetime.now()
    
    def get_panchang(self, date: datetime = None) -> Panchang:
        """Get Panchang for a specific date"""
        
        if date is None:
            date = self.current_date
        
        # Calculate lunar day (simplified)
        day_of_month = date.day
        tithi = self._calculate_tithi(date)
        nakshatra = self._calculate_nakshatra(date)
        vara = self._get_vara(date)
        yoga = self._calculate_yoga(date)
        karana = self._calculate_karana(date)
        
        # Calculate timings (simplified - would use ephemeris in production)
        sunrise = "06:15"
        sunset = "18:30"
        moonrise = self._calculate_moonrise(date)
        
        # Calculate inauspicious periods
        rahu_kaal = self._calculate_rahu_kaal(vara, sunrise)
        gulika_kaal = self._calculate_gulika_kaal(vara, sunrise)
        yamaganda = self._calculate_yamaganda(vara, sunrise)
        abhijit = self._calculate_abhijit_muhurta(sunrise, sunset)
        
        return Panchang(
            date=date,
            tithi=tithi,
            nakshatra=nakshatra,
            yoga=yoga,
            karana=karana,
            vara=vara,
            sunrise=sunrise,
            sunset=sunset,
            moonrise=moonrise,
            rahu_kaal=rahu_kaal,
            gulika_kaal=gulika_kaal,
            yamaganda=yamaganda,
            abhijit_muhurta=abhijit
        )
    
    def find_auspicious_muhurtas(self, purpose: str, 
                                 start_date: datetime,
                                 days: int = 30) -> List[Muhurta]:
        """Find auspicious timings for a specific purpose"""
        
        muhurtas = []
        
        for i in range(days):
            date = start_date + timedelta(days=i)
            panchang = self.get_panchang(date)
            
            quality = self._evaluate_muhurta_quality(panchang, purpose)
            
            if quality in ["Excellent", "Good"]:
                suitable, avoid = self._get_suitable_activities(panchang)
                
                muhurta = Muhurta(
                    start_time=datetime.combine(date.date(), datetime.strptime("09:00", "%H:%M").time()),
                    end_time=datetime.combine(date.date(), datetime.strptime("12:00", "%H:%M").time()),
                    quality=quality,
                    suitable_for=suitable,
                    avoid_for=avoid,
                    nakshatra=panchang.nakshatra,
                    tithi=panchang.tithi,
                    special_notes=self._get_special_notes(panchang)
                )
                muhurtas.append(muhurta)
        
        return sorted(muhurtas, key=lambda x: (x.quality != "Excellent", x.start_time))
    
    def get_griha_pravesh_dates(self, start_date: datetime, 
                               months: int = 3) -> List[Dict]:
        """Get auspicious dates for Griha Pravesh (housewarming)"""
        
        dates = []
        current = start_date
        end_date = start_date + timedelta(days=months * 30)
        
        while current < end_date:
            panchang = self.get_panchang(current)
            
            # Check all conditions
            is_good_nakshatra = panchang.nakshatra in self.GRIHA_PRAVESH_NAKSHATRAS
            is_good_tithi = panchang.tithi not in self.AVOID_TITHIS
            is_good_day = panchang.vara in self.PROPERTY_DAYS
            
            # Additional: Check for specific months (avoid Adhik Maas, etc.)
            is_good_month = current.month not in [7]  # Simplified
            
            if is_good_nakshatra and is_good_tithi and is_good_day and is_good_month:
                quality = "Excellent" if panchang.tithi == Tithi.PURNIMA else "Good"
                
                dates.append({
                    "date": current,
                    "quality": quality,
                    "nakshatra": panchang.nakshatra.nakshatra_name,
                    "tithi": panchang.tithi.name,
                    "day": panchang.vara.value[0],
                    "auspicious_time": panchang.abhijit_muhurta,
                    "avoid_time": panchang.rahu_kaal
                })
            
            current += timedelta(days=1)
        
        return dates[:10]  # Return top 10
    
    def get_property_purchase_dates(self, start_date: datetime,
                                   months: int = 3) -> List[Dict]:
        """Get auspicious dates for property purchase/agreement"""
        
        dates = []
        current = start_date
        end_date = start_date + timedelta(days=months * 30)
        
        while current < end_date:
            panchang = self.get_panchang(current)
            
            is_good_nakshatra = panchang.nakshatra in self.PROPERTY_PURCHASE_NAKSHATRAS
            is_good_tithi = panchang.tithi not in self.AVOID_TITHIS
            is_good_day = panchang.vara in [Vara.GURUVARA, Vara.SHUKRAVARA, Vara.BUDHAVARA]
            
            if is_good_nakshatra and is_good_tithi and is_good_day:
                dates.append({
                    "date": current,
                    "quality": "Excellent" if panchang.vara == Vara.GURUVARA else "Good",
                    "nakshatra": panchang.nakshatra.nakshatra_name,
                    "tithi": panchang.tithi.name,
                    "day": panchang.vara.value[0],
                    "auspicious_time": panchang.abhijit_muhurta,
                    "avoid_time": panchang.rahu_kaal,
                    "notes": f"Good for: {panchang.nakshatra.meaning}"
                })
            
            current += timedelta(days=1)
        
        return dates[:10]
    
    def analyze_property(self, property_data: Dict,
                        owner_birth_date: datetime = None) -> PropertyAstrologyReport:
        """Complete astrological analysis for a property"""
        
        panchang = self.get_panchang()
        
        # Find auspicious muhurtas
        muhurtas = self.find_auspicious_muhurtas("property", datetime.now(), 30)
        
        # Find dates for various activities
        griha_pravesh = self.get_griha_pravesh_dates(datetime.now())
        purchase_dates = self.get_property_purchase_dates(datetime.now())
        registration_dates = self._get_registration_dates(datetime.now())
        renovation_dates = self._get_renovation_dates(datetime.now())
        
        # Buyer compatibility (if birth date provided)
        compatibility = None
        if owner_birth_date:
            compatibility = self._calculate_compatibility(property_data, owner_birth_date)
        
        # Planetary influences
        planetary = self._get_planetary_influences()
        
        # Recommendations
        recommendations = self._generate_recommendations(panchang, planetary)
        
        return PropertyAstrologyReport(
            property_id=property_data.get("id", "unknown"),
            analysis_date=datetime.now(),
            current_panchang=panchang,
            auspicious_muhurtas=muhurtas,
            griha_pravesh_dates=griha_pravesh,
            property_purchase_dates=purchase_dates,
            registration_dates=registration_dates,
            renovation_dates=renovation_dates,
            buyer_compatibility=compatibility,
            planetary_influences=planetary,
            recommendations=recommendations
        )
    
    def _calculate_tithi(self, date: datetime) -> Tithi:
        """Calculate Tithi for a date (simplified)"""
        day = date.day
        if day <= 15:
            tithi_num = day
        else:
            tithi_num = day - 15
        
        tithis = list(Tithi)
        return tithis[(tithi_num - 1) % len(tithis)]
    
    def _calculate_nakshatra(self, date: datetime) -> Nakshatra:
        """Calculate Nakshatra for a date (simplified)"""
        day_of_year = date.timetuple().tm_yday
        nakshatra_index = (day_of_year + date.year) % 27
        return list(Nakshatra)[nakshatra_index]
    
    def _get_vara(self, date: datetime) -> Vara:
        """Get day of week (Vara)"""
        weekday = date.weekday()
        varas = [Vara.SOMAVARA, Vara.MANGALAVARA, Vara.BUDHAVARA, 
                 Vara.GURUVARA, Vara.SHUKRAVARA, Vara.SHANIVARA, Vara.RAVIVARA]
        return varas[weekday]
    
    def _calculate_yoga(self, date: datetime) -> str:
        """Calculate Yoga (simplified)"""
        yogas = ["Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
                 "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda"]
        return yogas[(date.day + date.month) % len(yogas)]
    
    def _calculate_karana(self, date: datetime) -> str:
        """Calculate Karana (simplified)"""
        karanas = ["Bava", "Balava", "Kaulava", "Taitila", "Gara", 
                   "Vanija", "Vishti", "Shakuni", "Chatushpada", "Nagava", "Kimstughna"]
        return karanas[(date.day * 2) % len(karanas)]
    
    def _calculate_moonrise(self, date: datetime) -> str:
        """Calculate moonrise time (simplified)"""
        base_hour = 17 + (date.day % 12)
        return f"{base_hour % 24:02d}:{(date.day * 2) % 60:02d}"
    
    def _calculate_rahu_kaal(self, vara: Vara, sunrise: str) -> str:
        """Calculate Rahu Kaal (inauspicious period)"""
        rahu_order = {
            Vara.RAVIVARA: 8, Vara.SOMAVARA: 2, Vara.MANGALAVARA: 7,
            Vara.BUDHAVARA: 5, Vara.GURUVARA: 6, Vara.SHUKRAVARA: 4,
            Vara.SHANIVARA: 3
        }
        slot = rahu_order[vara]
        start_hour = 6 + (slot - 1) * 1.5
        return f"{int(start_hour):02d}:{int((start_hour % 1) * 60):02d} - {int(start_hour + 1.5):02d}:{int(((start_hour + 1.5) % 1) * 60):02d}"
    
    def _calculate_gulika_kaal(self, vara: Vara, sunrise: str) -> str:
        """Calculate Gulika Kaal"""
        return "13:30 - 15:00"  # Simplified
    
    def _calculate_yamaganda(self, vara: Vara, sunrise: str) -> str:
        """Calculate Yamaganda"""
        return "09:00 - 10:30"  # Simplified
    
    def _calculate_abhijit_muhurta(self, sunrise: str, sunset: str) -> str:
        """Calculate Abhijit Muhurta (most auspicious time)"""
        return "11:48 - 12:36"
    
    def _evaluate_muhurta_quality(self, panchang: Panchang, purpose: str) -> str:
        """Evaluate quality of muhurta for a purpose"""
        score = 0
        
        if panchang.nakshatra in self.PROPERTY_PURCHASE_NAKSHATRAS:
            score += 30
        if panchang.tithi not in self.AVOID_TITHIS:
            score += 25
        if panchang.vara in self.PROPERTY_DAYS:
            score += 25
        if panchang.yoga in ["Priti", "Ayushman", "Saubhagya", "Shobhana"]:
            score += 20
        
        if score >= 80:
            return "Excellent"
        elif score >= 60:
            return "Good"
        elif score >= 40:
            return "Average"
        else:
            return "Avoid"
    
    def _get_suitable_activities(self, panchang: Panchang) -> Tuple[List[str], List[str]]:
        """Get suitable and unsuitable activities"""
        suitable = ["Property viewing", "Agreement signing"]
        avoid = []
        
        if panchang.vara == Vara.GURUVARA:
            suitable.extend(["Griha Pravesh", "Major purchases"])
        if panchang.vara == Vara.MANGALAVARA:
            suitable.append("Land purchase")
        
        if panchang.tithi in self.AVOID_TITHIS:
            avoid.append("New beginnings")
        
        return suitable, avoid
    
    def _get_special_notes(self, panchang: Panchang) -> str:
        """Get special notes for the day"""
        notes = []
        
        if panchang.tithi == Tithi.PURNIMA:
            notes.append("Full Moon - highly auspicious")
        if panchang.nakshatra == Nakshatra.PUSHYA:
            notes.append("Pushya Nakshatra - excellent for purchases")
        
        return "; ".join(notes) if notes else "Standard day"
    
    def _get_registration_dates(self, start_date: datetime) -> List[Dict]:
        """Get dates for property registration"""
        return self.get_property_purchase_dates(start_date, 2)
    
    def _get_renovation_dates(self, start_date: datetime) -> List[Dict]:
        """Get dates for renovation/construction"""
        dates = []
        current = start_date
        
        for i in range(60):
            date = current + timedelta(days=i)
            panchang = self.get_panchang(date)
            
            # Tuesday is good for construction
            if panchang.vara == Vara.MANGALAVARA and panchang.tithi not in self.AVOID_TITHIS:
                dates.append({
                    "date": date,
                    "purpose": "Ground breaking, construction",
                    "nakshatra": panchang.nakshatra.nakshatra_name
                })
        
        return dates[:5]
    
    def _calculate_compatibility(self, property_data: Dict, 
                                birth_date: datetime) -> Dict:
        """Calculate property-owner compatibility"""
        birth_nakshatra = self._calculate_nakshatra(birth_date)
        
        return {
            "birth_nakshatra": birth_nakshatra.nakshatra_name,
            "ruler": birth_nakshatra.ruler,
            "compatibility_score": 75,  # Simplified
            "recommendations": [
                f"Enhance {birth_nakshatra.ruler} energy in home",
                f"Focus on {birth_nakshatra.meaning}"
            ]
        }
    
    def _get_planetary_influences(self) -> Dict:
        """Get current planetary influences"""
        return {
            "Jupiter": {"status": "Direct", "effect": "Favorable for property"},
            "Saturn": {"status": "Retrograde", "effect": "Delays possible"},
            "Mars": {"status": "Direct", "effect": "Good for construction"},
            "Venus": {"status": "Direct", "effect": "Good for purchases"},
            "Mercury": {"status": "Direct", "effect": "Good for agreements"}
        }
    
    def _generate_recommendations(self, panchang: Panchang, 
                                  planetary: Dict) -> List[str]:
        """Generate astrological recommendations"""
        recommendations = []
        
        if panchang.vara in self.PROPERTY_DAYS:
            recommendations.append("Today is favorable for property activities")
        
        if planetary.get("Saturn", {}).get("status") == "Retrograde":
            recommendations.append("Saturn retrograde - avoid major commitments")
        
        recommendations.append("Consult a Pandit for personalized Muhurta")
        recommendations.append("Perform Vastu puja before moving in")
        
        return recommendations


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    engine = VedicAstrologyEngine()
    
    # Get today's Panchang
    panchang = engine.get_panchang()
    print(f"Today's Panchang:")
    print(f"  Tithi: {panchang.tithi.name}")
    print(f"  Nakshatra: {panchang.nakshatra.nakshatra_name}")
    print(f"  Day: {panchang.vara.value[0]}")
    print(f"  Rahu Kaal: {panchang.rahu_kaal}")
    print(f"  Abhijit Muhurta: {panchang.abhijit_muhurta}")
    
    # Find Griha Pravesh dates
    dates = engine.get_griha_pravesh_dates(datetime.now())
    print(f"\nUpcoming Griha Pravesh Dates:")
    for d in dates[:3]:
        print(f"  {d['date'].strftime('%Y-%m-%d')} ({d['day']}) - {d['quality']}")
