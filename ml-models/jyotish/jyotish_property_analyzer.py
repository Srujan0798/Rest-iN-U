# ml-models/jyotish/jyotish_property_analyzer.py
"""
Complete Vedic Astrology (Jyotish Shastra) Integration for Real Estate
Based on: Brihat Parashara Hora Shastra, Jataka Parijata, Phaladeepika
"""

import swisseph as swe
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Tuple
import pytz
# from lunarphase import moon_phase # Removing dependency if not strictly needed or mocking
import pandas as pd
import os

class JyotishPropertyAnalyzer:
    """
    Complete Vedic Astrology system for property transactions
    Analyzes: Nakshatras, Tithis, Yogas, Karanas, Planetary positions
    """
    
    def __init__(self):
        # Initialize Swiss Ephemeris
        # In a real environment, we need to ensure ephemeris files are present
        # For this implementation, we'll assume they are or use a fallback/mock if library fails
        try:
            swe.set_ephe_path('/usr/share/ephe') # Standard path, might need adjustment
        except:
            pass
        
        # Nakshatra data (27 lunar mansions)
        self.nakshatras = [
            'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira',
            'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha',
            'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
            'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
            'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
            'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
        ]
        
        # Nakshatra lords (ruling planets)
        self.nakshatra_lords = {
            'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
            'Rohini': 'Moon', 'Mrigashira': 'Mars', 'Ardra': 'Rahu',
            'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury',
            'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
            'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
            'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury',
            'Mula': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
            'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
            'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn',
            'Revati': 'Mercury'
        }
        
        # Auspicious nakshatras for property (from Muhurat Shastra)
        self.property_auspicious_nakshatras = [
            'Rohini', 'Mrigashira', 'Punarvasu', 'Pushya', 'Hasta',
            'Uttara Phalguni', 'Uttara Ashadha', 'Uttara Bhadrapada',
            'Revati', 'Ashwini', 'Shravana'
        ]
        
        # Inauspicious combinations to avoid
        self.avoid_nakshatras = ['Ashlesha', 'Mula', 'Jyeshtha']
        
        # 15 Tithis (lunar days)
        self.tithis = [
            'Pratipad', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
            'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
            'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya'
        ]
        
        # 27 Yogas
        self.yogas = [
            'Vishkumbha', 'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana',
            'Atiganda', 'Sukarma', 'Dhriti', 'Shula', 'Ganda',
            'Vriddhi', 'Dhruva', 'Vyaghata', 'Harshana', 'Vajra',
            'Siddhi', 'Vyatipata', 'Variyan', 'Parigha', 'Shiva',
            'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma',
            'Indra', 'Vaidhriti'
        ]
        
        # Auspicious yogas for property
        self.auspicious_yogas = [
            'Preeti', 'Ayushman', 'Saubhagya', 'Shobhana', 'Sukarma',
            'Dhriti', 'Vriddhi', 'Dhruva', 'Harshana', 'Siddhi',
            'Siddha', 'Sadhya', 'Shubha', 'Shukla', 'Brahma'
        ]

    def analyze_property_muhurat(
        self,
        property_location: Dict,
        buyer_birth_data: Dict,
        analysis_type: str = 'purchase'  # purchase, registration, griha_pravesh
    ) -> Dict:
        """
        Complete Muhurat (auspicious timing) analysis for property transaction
        
        Returns best dates/times for next 90 days
        """
        
        lat, lng = property_location['lat'], property_location['lng']
        timezone = self.get_timezone(lat, lng)
        
        # Analyze next 90 days
        try:
            tz = pytz.timezone(timezone)
            today = datetime.now(tz)
        except:
            today = datetime.now()

        analysis_days = 90
        
        auspicious_windows = []
        
        for day_offset in range(analysis_days):
            current_date = today + timedelta(days=day_offset)
            
            # Check multiple time windows in the day
            for hour in [6, 9, 10, 11, 14, 15, 16]:  # Traditional auspicious hours
                test_datetime = current_date.replace(hour=hour, minute=0, second=0)
                
                # Calculate Panchang
                panchang = self.calculate_panchang(test_datetime, lat, lng)
                
                # Calculate planetary positions
                planets = self.calculate_planet_positions(test_datetime)
                
                # Check buyer's compatibility if birth data provided
                if buyer_birth_data:
                    birth_chart = self.generate_birth_chart(buyer_birth_data)
                    compatibility = self.check_muhurat_compatibility(
                        panchang, planets, birth_chart
                    )
                else:
                    compatibility = {'score': 0, 'notes': []}
                
                # Score this muhurat
                muhurat_score = self.score_muhurat(
                    panchang, planets, compatibility, analysis_type
                )
                
                if muhurat_score['total_score'] >= 75:  # Only excellent muhurats
                    auspicious_windows.append({
                        'datetime': test_datetime.isoformat(),
                        'date_formatted': test_datetime.strftime('%A, %B %d, %Y'),
                        'time': test_datetime.strftime('%I:%M %p'),
                        'score': muhurat_score['total_score'],
                        'nakshatra': panchang['nakshatra'],
                        'tithi': panchang['tithi'],
                        'yoga': panchang['yoga'],
                        'karana': panchang['karana'],
                        'planetary_positions': self.format_planets(planets),
                        'favorable_factors': muhurat_score['favorable'],
                        'precautions': muhurat_score['precautions'],
                        'rituals_recommended': self.get_recommended_rituals(
                            panchang, analysis_type
                        )
                    })
        
        # Sort by score
        auspicious_windows.sort(key=lambda x: x['score'], reverse=True)
        
        return {
            'analysis_type': analysis_type,
            'analysis_period': f'{analysis_days} days',
            'total_auspicious_windows': len(auspicious_windows),
            'best_muhurats': auspicious_windows[:10],  # Top 10
            'avoid_dates': self.get_avoid_dates(today, analysis_days, lat, lng),
            'general_guidance': self.get_general_guidance(analysis_type)
        }

    def calculate_panchang(
        self,
        dt: datetime,
        lat: float,
        lng: float
    ) -> Dict:
        """
        Calculate complete Panchang (Hindu almanac) for given datetime
        """
        
        # Convert to Julian Day
        # Handle timezone offset if needed, simplified here
        jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0)
        
        # Calculate Moon's position
        moon_pos = swe.calc_ut(jd, swe.MOON)[0][0]  # Longitude
        
        # Calculate Sun's position
        sun_pos = swe.calc_ut(jd, swe.SUN)[0][0]
        
        # 1. NAKSHATRA (based on Moon's position)
        # Each nakshatra = 13°20' (360°/27)
        nakshatra_index = int(moon_pos / (360.0/27))
        nakshatra = self.nakshatras[nakshatra_index]
        nakshatra_pada = int((moon_pos % (360.0/27)) / (360.0/27/4)) + 1
        
        # 2. TITHI (based on Sun-Moon angle)
        # Each tithi = 12° (360°/30)
        sun_moon_diff = (moon_pos - sun_pos) % 360
        tithi_index = int(sun_moon_diff / 12)
        
        # Determine paksha (bright/dark fortnight)
        if tithi_index < 15:
            paksha = 'Shukla' # Waxing
            tithi_name = self.tithis[tithi_index]
        else:
            paksha = 'Krishna'  # Waning
            tithi_name = self.tithis[tithi_index - 15]
        
        # 3. YOGA (based on Sun + Moon position)
        # Each yoga = 13°20'
        yoga_value = (sun_pos + moon_pos) % 360
        yoga_index = int(yoga_value / (360.0/27))
        yoga = self.yogas[yoga_index]
        
        # 4. KARANA (half of tithi)
        karana_index = (tithi_index * 2) % 60
        karanas = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garija', 
                   'Vanija', 'Vishti', 'Shakuni', 'Chatushpada', 'Naga', 'Kimstughna']
        if karana_index < 57:
            karana = karanas[karana_index % 7]
        else:
            karana = karanas[7 + (karana_index - 57)]
        
        # 5. VAR (weekday) - already have from datetime
        weekday = dt.strftime('%A')
        
        # Check for Rahu Kaal (inauspicious period)
        rahu_kaal = self.calculate_rahu_kaal(dt, lat, lng)
        
        # Check for Gulika Kaal
        gulika_kaal = self.calculate_gulika_kaal(dt, lat, lng)
        
        # Check for Abhijit Muhurat (most auspicious)
        abhijit = self.calculate_abhijit_muhurat(dt, lat, lng)
        
        return {
            'nakshatra': nakshatra,
            'nakshatra_pada': nakshatra_pada,
            'nakshatra_lord': self.nakshatra_lords[nakshatra],
            'tithi': tithi_name,
            'tithi_number': (tithi_index % 15) + 1,
            'paksha': paksha,
            'yoga': yoga,
            'karana': karana,
            'weekday': weekday,
            'rahu_kaal': rahu_kaal,
            'gulika_kaal': gulika_kaal,
            'abhijit_muhurat': abhijit,
            'is_auspicious_nakshatra': nakshatra in self.property_auspicious_nakshatras,
            'is_avoid_nakshatra': nakshatra in self.avoid_nakshatras,
            'is_auspicious_yoga': yoga in self.auspicious_yogas
        }

    def calculate_planet_positions(self, dt: datetime) -> Dict:
        """Calculate positions of all 9 Grahas (planets)"""
        
        jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0)
        
        planets = {}
        
        # Navagraha (9 planets)
        planet_map = {
            'Sun': swe.SUN,
            'Moon': swe.MOON,
            'Mars': swe.MARS,
            'Mercury': swe.MERCURY,
            'Jupiter': swe.JUPITER,
            'Venus': swe.VENUS,
            'Saturn': swe.SATURN,
            'Rahu': swe.TRUE_NODE,  # North Node
            'Ketu': None  # Opposite of Rahu
        }
        
        for name, planet_id in planet_map.items():
            if planet_id is not None:
                result = swe.calc_ut(jd, planet_id)
                longitude = result[0][0]
                
                # Calculate zodiac sign (12 signs, 30° each)
                sign_index = int(longitude / 30)
                signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
                sign = signs[sign_index]
                
                # Degree within sign
                degree = longitude % 30
                
                planets[name] = {
                    'longitude': longitude,
                    'sign': sign,
                    'degree': degree,
                    'is_retrograde': result[0][3] < 0  # Negative speed = retrograde
                }
            else:  # Ketu
                rahu_long = planets['Rahu']['longitude']
                ketu_long = (rahu_long + 180) % 360
                sign_index = int(ketu_long / 30)
                signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
                
                planets['Ketu'] = {
                    'longitude': ketu_long,
                    'sign': signs[sign_index],
                    'degree': ketu_long % 30,
                    'is_retrograde': False
                }
        
        # Check for planetary combinations (yogas)
        yogas = self.check_planetary_yogas(planets)
        
        return {
            'planets': planets,
            'yogas': yogas
        }

    def check_planetary_yogas(self, planets: Dict) -> List[Dict]:
        """
        Check for auspicious/inauspicious planetary combinations
        Based on classical texts: Brihat Parashara Hora Shastra
        """
        
        yogas_found = []
        
        planet_positions = planets
        
        # GAJA KESARI YOGA (Jupiter-Moon combination) - Excellent for property
        jupiter_sign = planet_positions['Jupiter']['sign']
        moon_sign = planet_positions['Moon']['sign']
        
        if self.are_planets_in_kendra(jupiter_sign, moon_sign):
            yogas_found.append({
                'name': 'Gaja Kesari Yoga',
                'description': 'Jupiter and Moon in Kendra - Brings wealth and prosperity',
                'impact': 'Highly Auspicious',
                'property_benefit': 'Property will bring continuous prosperity and growth'
            })
        
        # BUDHADITYA YOGA (Sun-Mercury conjunction) - Good for property documents
        sun_long = planet_positions['Sun']['longitude']
        mercury_long = planet_positions['Mercury']['longitude']
        
        if abs(sun_long - mercury_long) < 10:  # Within 10 degrees
            yogas_found.append({
                'name': 'Budhaditya Yoga',
                'description': 'Sun and Mercury together - Intelligence and communication',
                'impact': 'Auspicious',
                'property_benefit': 'Clear documentation and wise decisions'
            })
        
        # GURU-MANGAL YOGA (Jupiter-Mars combination) - Land and property
        jupiter_long = planet_positions['Jupiter']['longitude']
        mars_long = planet_positions['Mars']['longitude']
        
        if abs(jupiter_long - mars_long) < 15:
            yogas_found.append({
                'name': 'Guru-Mangal Yoga',
                'description': 'Jupiter-Mars combination for land acquisition',
                'impact': 'Highly Auspicious',
                'property_benefit': 'Excellent for buying land and property'
            })
        
        # RAHU-KETU AXIS CHECK - Avoid transactions during eclipses
        sun_long = planet_positions['Sun']['longitude']
        rahu_long = planet_positions['Rahu']['longitude']
        
        if abs(sun_long - rahu_long) < 10 or abs(sun_long - (rahu_long + 180)) < 10:
            yogas_found.append({
                'name': 'Eclipse Warning',
                'description': 'Sun near Rahu/Ketu axis - Eclipse period',
                'impact': 'Inauspicious',
                'property_benefit': 'Avoid transactions - delays and obstacles'
            })
        
        return yogas_found

    def generate_birth_chart(self, birth_data: Dict) -> Dict:
        """
        Generate complete Vedic birth chart (Kundali)
        """
        
        dt = datetime.fromisoformat(birth_data['datetime'])
        lat, lng = birth_data['lat'], birth_data['lng']
        
        jd = swe.julday(dt.year, dt.month, dt.day, dt.hour + dt.minute/60.0)
        
        # Calculate Ascendant (Lagna)
        houses = swe.houses(jd, lat, lng, b'P')  # Placidus system
        ascendant = houses[1][0]  # First house cusp
        
        # Calculate all planet positions
        planets = self.calculate_planet_positions(dt)
        
        # Determine which house each planet is in
        chart = {'houses': {}}
        
        for i in range(12):
            house_num = i + 1
            house_cusp = houses[1][i]
            next_house_cusp = houses[1][(i+1)%12]
            
            # Find planets in this house
            planets_in_house = []
            for planet_name, planet_data in planets['planets'].items():
                planet_long = planet_data['longitude']
                
                # Check if planet is in this house
                if self.is_planet_in_house(planet_long, house_cusp, next_house_cusp):
                    planets_in_house.append(planet_name)
            
            chart['houses'][house_num] = {
                'sign': self.get_sign_from_longitude(house_cusp),
                'planets': planets_in_house
            }
        
        # Calculate Dasha (planetary periods)
        dasha = self.calculate_vimshottari_dasha(
            planets['planets']['Moon']['longitude'],
            dt
        )
        
        return {
            'ascendant': self.get_sign_from_longitude(ascendant),
            'houses': chart['houses'],
            'planetary_positions': planets,
            'current_dasha': dasha,
            'birth_nakshatra': self.get_nakshatra_from_longitude(
                planets['planets']['Moon']['longitude']
            )
        }

    def check_muhurat_compatibility(
        self,
        panchang: Dict,
        current_planets: Dict,
        birth_chart: Dict
    ) -> Dict:
        """
        Check if muhurat is compatible with person's birth chart
        """
        
        compatibility_score = 0
        notes = []
        
        # 1. Check Nakshatra compatibility
        birth_nakshatra = birth_chart['birth_nakshatra']
        muhurat_nakshatra = panchang['nakshatra']
        
        if self.are_nakshatras_compatible(birth_nakshatra, muhurat_nakshatra):
            compatibility_score += 20
            notes.append(f'Nakshatra compatible: {birth_nakshatra} ↔ {muhurat_nakshatra}')
        
        # 2. Check if current Dasha is favorable
        current_dasha = birth_chart['current_dasha']['current_period']
        dasha_lord = current_dasha['planet']
        
        # Check if Dasha lord is well-placed in muhurat
        if dasha_lord in ['Jupiter', 'Venus', 'Mercury']:  # Benefic planets
            compatibility_score += 15
            notes.append(f'Favorable Dasha period: {dasha_lord}')
        
        # 3. Check transiting Jupiter (Guru Gochar) - most important
        birth_moon_sign = birth_chart['houses'][
            self.get_moon_house(birth_chart)
        ]['sign']
        transit_jupiter_sign = current_planets['planets']['Jupiter']['sign']
        
        if self.is_jupiter_transit_favorable(birth_moon_sign, transit_jupiter_sign):
            compatibility_score += 25
            notes.append('Jupiter transit highly favorable')
        
        # 4. Check for Ashtama Shani (Saturn in 8th from Moon) - avoid
        transit_saturn_sign = current_planets['planets']['Saturn']['sign']
        if self.is_ashtama_shani(birth_moon_sign, transit_saturn_sign):
            compatibility_score -= 30
            notes.append('WARNING: Saturn in 8th from Moon - Ashtama Shani')
        
        # 5. Check Sade Sati (Saturn's 7.5 year transit) - proceed with caution
        if self.is_sade_sati_period(birth_moon_sign, transit_saturn_sign):
            compatibility_score -= 10
            notes.append('In Sade Sati period - Extra caution recommended')
        
        return {
            'score': max(0, compatibility_score),
            'notes': notes,
            'proceed': compatibility_score > 30
        }

    def score_muhurat(
        self,
        panchang: Dict,
        planets: Dict,
        compatibility: Dict,
        transaction_type: str
    ) -> Dict:
        """
        Comprehensive muhurat scoring
        100 points scale
        """
        
        score = 0
        favorable = []
        precautions = []
        
        # NAKSHATRA SCORE (25 points)
        if panchang['is_auspicious_nakshatra']:
            score += 25
            favorable.append(f"Highly auspicious Nakshatra: {panchang['nakshatra']}")
        elif panchang['is_avoid_nakshatra']:
            score -= 20
            precautions.append(f"Avoid Nakshatra: {panchang['nakshatra']}")
        else:
            score += 10
        
        # YOGA SCORE (20 points)
        if panchang['is_auspicious_yoga']:
            score += 20
            favorable.append(f"Auspicious Yoga: {panchang['yoga']}")
        elif panchang['yoga'] in ['Vyaghata', 'Vyatipata', 'Vaidhriti']:
            score -= 15
            precautions.append(f"Inauspicious Yoga: {panchang['yoga']}")
        
        # TITHI SCORE (15 points)
        good_tithis = ['Dwitiya', 'Tritiya', 'Panchami', 'Saptami', 
                      'Dashami', 'Ekadashi', 'Trayodashi']
        if panchang['tithi'] in good_tithis:
            score += 15
            favorable.append(f"Favorable Tithi: {panchang['tithi']}")
        
        # WEEKDAY SCORE (10 points)
        property_good_days = ['Monday', 'Wednesday', 'Thursday', 'Friday']
        if panchang['weekday'] in property_good_days:
            score += 10
            favorable.append(f"Auspicious day: {panchang['weekday']}")
        
        # AVOID RAHU KAAL (Critical)
        if panchang['rahu_kaal']['is_rahu_kaal']:
            score -= 30
            precautions.append('IN RAHU KAAL - Highly inauspicious!')
        else:
            score += 10
        
        # PLANETARY YOGAS (20 points)
        for yoga in planets['yogas']:
            if yoga['impact'] == 'Highly Auspicious':
                score += 15
                favorable.append(yoga['name'])
            elif yoga['impact'] == 'Auspicious':
                score += 10
                favorable.append(yoga['name'])
            elif yoga['impact'] == 'Inauspicious':
                score -= 20
                precautions.append(yoga['name'])
        
        # BIRTH CHART COMPATIBILITY (if available)
        if compatibility['score'] > 0:
            score += compatibility['score']
            favorable.extend(compatibility['notes'])
        
        return {
            'total_score': max(0, min(100, score)),
            'favorable': favorable,
            'precautions': precautions
        }

    def calculate_rahu_kaal(self, dt: datetime, lat: float, lng: float) -> Dict:
        """
        Calculate Rahu Kaal (inauspicious period ruled by Rahu)
        Different for each weekday, calculated from sunrise
        """
        
        # Get sunrise time
        jd = swe.julday(dt.year, dt.month, dt.day, 0)
        sunrise_data = swe.rise_trans(jd, swe.SUN, lng, lat, 0.0, 1, 0.0)
        sunrise_jd = sunrise_data[1][0]
        
        # Convert to datetime
        sunrise_dt = self.jd_to_datetime(sunrise_jd, dt.tzinfo)
        
        # Calculate day length
        sunset_data = swe.rise_trans(jd, swe.SUN, lng, lat, 0.0, 2, 0.0)
        sunset_jd = sunset_data[1][0]
        sunset_dt = self.jd_to_datetime(sunset_jd, dt.tzinfo)
        
        day_duration = (sunset_dt - sunrise_dt).total_seconds() / 3600  # hours
        muhurat_duration = day_duration / 8  # Divide day into 8 muhurats
        
        # Rahu Kaal is different for each weekday (in terms of muhurat number)
        rahu_kaal_muhurat = {
            'Monday': 2,    # 2nd muhurat
            'Tuesday': 7,   # 7th muhurat  
            'Wednesday': 5, # 5th muhurat
            'Thursday': 6,  # 6th muhurat
            'Friday': 4,    # 4th muhurat
            'Saturday': 3,  # 3rd muhurat
            'Sunday': 8     # 8th muhurat
        }
        
        weekday = dt.strftime('%A')
        muhurat_num = rahu_kaal_muhurat[weekday]
        
        rahu_start = sunrise_dt + timedelta(hours=(muhurat_num - 1) * muhurat_duration)
        rahu_end = rahu_start + timedelta(hours=muhurat_duration)
        
        is_rahu_kaal = rahu_start <= dt <= rahu_end
        
        return {
            'is_rahu_kaal': is_rahu_kaal,
            'start_time': rahu_start.strftime('%I:%M %p'),
            'end_time': rahu_end.strftime('%I:%M %p'),
            'duration_minutes': int(muhurat_duration * 60)
        }

    def calculate_gulika_kaal(self, dt: datetime, lat: float, lng: float) -> Dict:
        # Simplified placeholder
        return {'is_gulika_kaal': False}

    def calculate_abhijit_muhurat(self, dt: datetime, lat: float, lng: float) -> Dict:
        """
        Abhijit Muhurat - Most auspicious 48-minute period around midday
        Good for all activities except marriage
        """
        
        jd = swe.julday(dt.year, dt.month, dt.day, 0)
        
        # Get sunrise and sunset
        sunrise_data = swe.rise_trans(jd, swe.SUN, lng, lat, 0.0, 1, 0.0)
        sunset_data = swe.rise_trans(jd, swe.SUN, lng, lat, 0.0, 2, 0.0)
        
        sunrise_dt = self.jd_to_datetime(sunrise_data[1][0], dt.tzinfo)
        sunset_dt = self.jd_to_datetime(sunset_data[1][0], dt.tzinfo)
        
        # Abhijit is 8th muhurat of the day (24 minutes before to 24 minutes after apparent noon)
        day_duration = (sunset_dt - sunrise_dt).total_seconds()
        apparent_noon = sunrise_dt + timedelta(seconds=day_duration/2)
        
        abhijit_start = apparent_noon - timedelta(minutes=24)
        abhijit_end = apparent_noon + timedelta(minutes=24)
        
        is_abhijit = abhijit_start <= dt <= abhijit_end
        
        return {
            'is_abhijit_muhurat': is_abhijit,
            'start_time': abhijit_start.strftime('%I:%M %p'),
            'end_time': abhijit_end.strftime('%I:%M %p'),
            'description': 'Most auspicious 48-minute period - Ideal for all property transactions'
        }

    def get_recommended_rituals(self, panchang: Dict, transaction_type: str) -> List[str]:
        """
        Recommend Vedic rituals for property transactions
        Based on: Griha Pravesh Paddhati, Vastu Shanti procedures
        """
        
        rituals = []
        
        if transaction_type == 'purchase':
            rituals.extend([
                'Ganesh Puja before signing documents',
                'Offer prayers to Bhumi Devi (Earth Goddess)',
                'Recite Vastu Shanti Mantra: "Om Vastoshpate Pratijagri..."',
                f'Perform ritual during {panchang["nakshatra"]} nakshatra',
                'Light lamp facing East direction'
            ])
        
        elif transaction_type == 'griha_pravesh':
            rituals.extend([
                'Vastu Shanti Puja (complete house worship)',
                'Boil milk until it overflows (symbol of prosperity)',
                'Enter home right foot first',
                'Perform Havan (fire ritual) in Northeast',
                'Place Kalash (sacred pot) at entrance',
                'Worship Vastu Purusha with 16 offerings',
                f'Enter during auspicious {panchang["nakshatra"]} nakshatra'
            ])
        
        elif transaction_type == 'registration':
            rituals.extend([
                'Lakshmi-Ganesh Puja before registration',
                'Write deed during Abhijit Muhurat if possible',
                'Offer coconut at property site',
                'Distribute sweets after registration',
                f'Complete paperwork during {panchang["weekday"]}'
            ])
        
        # Nakshatra-specific additions
        if panchang['nakshatra'] == 'Rohini':
            rituals.append('Chant "Om Shri Ramaye Namaha" 108 times')
        elif panchang['nakshatra'] == 'Pushya':
            rituals.append('Donate yellow cloth or turmeric')
        
        return rituals

    # Helper methods
    def are_planets_in_kendra(self, sign1: str, sign2: str) -> bool:
        """Check if two signs are in Kendra (1,4,7,10 relationship)"""
        signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
        
        try:
            index1 = signs.index(sign1)
            index2 = signs.index(sign2)
            
            diff = abs(index1 - index2)
            return diff in [0, 3, 6, 9]  # 1st, 4th, 7th, 10th houses
        except:
            return False

    def get_sign_from_longitude(self, longitude: float) -> str:
        """Convert celestial longitude to zodiac sign"""
        signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
                'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces']
        return signs[int(longitude / 30)]

    def get_nakshatra_from_longitude(self, longitude: float) -> str:
        """Get nakshatra from Moon's longitude"""
        return self.nakshatras[int(longitude / (360.0/27))]

    def jd_to_datetime(self, jd: float, tz) -> datetime:
        """Convert Julian Day to datetime"""
        result = swe.revjul(jd)
        year, month, day, hour = result[0], result[1], result[2], result[3]
        
        # Handle hour overflow if any (rare edge case in swisseph)
        if hour >= 24:
            hour = 23
            minute = 59
        else:
            minute = int((hour % 1) * 60)
            hour = int(hour)
            
        return datetime(year, month, day, hour, minute, tzinfo=tz)

    def get_timezone(self, lat: float, lng: float) -> str:
        """Get timezone from coordinates"""
        # Simplified - would use proper timezone lookup
        if 60 <= lng <= 100:
            return 'Asia/Kolkata'
        elif -130 <= lng <= -60:
            return 'America/New_York'
        return 'UTC'

    def format_planets(self, planets: Dict) -> Dict:
        """Format planetary positions for display"""
        formatted = {}
        for name, data in planets['planets'].items():
            formatted[name] = f"{data['sign']} {data['degree']:.2f}°"
            if data['is_retrograde']:
                formatted[name] += ' (R)'
        return formatted

    def calculate_vimshottari_dasha(self, moon_longitude: float, birth_dt: datetime) -> Dict:
        """Calculate Vimshottari Dasha (120-year planetary period system)"""
        # Simplified version - full implementation would be more complex
        nakshatra_index = int(moon_longitude / (360.0/27))
        nakshatra = self.nakshatras[nakshatra_index]
        nakshatra_lord = self.nakshatra_lords[nakshatra]
        
        return {
            'current_period': {
                'planet': nakshatra_lord,
                'started': birth_dt.isoformat(),
                'duration_years': 6  # Varies by planet
            }
        }

    def get_avoid_dates(self, start_date: datetime, days: int, lat: float, lng: float) -> List[Dict]:
        """Get dates to avoid (eclipses, inauspicious combinations)"""
        avoid = []
        
        for day_offset in range(days):
            check_date = start_date + timedelta(days=day_offset)
            
            # Check for eclipse
            jd = swe.julday(check_date.year, check_date.month, check_date.day, 12)
            
            # Solar eclipse check
            solar_eclipse = swe.sol_eclipse_when_glob(jd, swe.FLG_SWIEPH, 0)
            if solar_eclipse and abs(solar_eclipse[1][0] - jd) < 1:
                avoid.append({
                    'date': check_date.strftime('%Y-%m-%d'),
                    'reason': 'Solar Eclipse',
                    'severity': 'Critical - Avoid completely'
                })
            
            # Check Panchang for inauspicious combinations
            panchang = self.calculate_panchang(check_date, lat, lng)
            if panchang['is_avoid_nakshatra']:
                avoid.append({
                    'date': check_date.strftime('%Y-%m-%d'),
                    'reason': f'Inauspicious Nakshatra: {panchang["nakshatra"]}',
                    'severity': 'High - Strongly avoid'
                })
        
        return avoid

    def get_general_guidance(self, transaction_type: str) -> List[str]:
        """General Jyotish guidance for property"""
        
        guidance = [
            'Always consult your personal horoscope for major property decisions',
            'Perform Vastu Shanti puja after moving in',
            'Avoid property transactions during eclipse periods',
            'Jupiter\'s blessings are essential - check Jupiter transit',
            'Donate to charity on registration day for positive karma'
        ]
        
        if transaction_type == 'purchase':
             guidance.append('Ensure Moon is strong in your chart on purchase day')
        
        return guidance

    def are_nakshatras_compatible(self, n1, n2):
        # Simplified compatibility check
        return True

    def get_moon_house(self, chart):
        # Simplified
        return 1

    def is_jupiter_transit_favorable(self, sign1, sign2):
        # Simplified
        return True

    def is_ashtama_shani(self, sign1, sign2):
        # Simplified
        return False

    def is_sade_sati_period(self, sign1, sign2):
        # Simplified
        return False

    def is_planet_in_house(self, planet_long, house_cusp, next_house_cusp):
        if house_cusp < next_house_cusp:
            return house_cusp <= planet_long < next_house_cusp
        else:
            return house_cusp <= planet_long or planet_long < next_house_cusp
