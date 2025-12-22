"""
Complete Puranic Land Analysis System
Based on Matsya Purana, Agni Purana, and Brihat Samhita

Analyzes land suitability (Bhumi Pariksha) based on:
1. Soil quality (color, smell, taste, touch)
2. Slope and declivity (Plavanam)
3. Surrounding environment (Vriksha, Jala)
4. Historical/Karmic background
"""

import numpy as np
from typing import Dict, List, Tuple
from datetime import datetime
import math

class PuranicLandAnalyzer:
    def __init__(self):
        self.puranic_landmarks = self.load_puranic_landmarks()
        self.vyasa_guidelines = self.load_vyasa_guidelines()
        
    def analyze_land_suitability(
        self,
        latitude: float,
        longitude: float,
        elevation: float,
        soil_data: Dict = None
    ) -> Dict:
        """
        Perform comprehensive Bhumi Pariksha (Land Examination)
        """
        print(f"Performing Puranic Land Analysis for ({latitude}, {longitude})...")
        
        # 1. Analyze Bhumi Tattva (Earth Element Quality)
        bhumi_tattva = self.analyze_bhumi_tattva(latitude, longitude, soil_data)
        
        # 2. Analyze Panchamahabhuta Balance
        elemental_balance = self.analyze_panchamahabhuta(latitude, longitude, elevation)
        
        # 3. Sacred Geography
        sacred_geo = self.analyze_sacred_geography(latitude, longitude)
        
        # 4. Land Classification (Uttama, Madhyama, Adhama)
        classification = self.determine_land_classification(
            bhumi_tattva, elemental_balance, sacred_geo
        )
        
        # 5. Karmic History (if available)
        karmic_history = self.analyze_karmic_history(latitude, longitude)
        
        # 6. Dharmic Suitability
        dharmic_suitability = self.assess_dharmic_suitability(
            classification, karmic_history
        )
        
        return {
            'classification': classification,
            'bhumi_tattva': bhumi_tattva,
            'elemental_balance': elemental_balance,
            'sacred_geography': sacred_geo,
            'karmic_history': karmic_history,
            'dharmic_suitability': dharmic_suitability,
            'overall_assessment': self.generate_overall_assessment(dharmic_suitability['score']),
            'scriptural_references': self.get_scriptural_references()
        }
    
    def analyze_bhumi_tattva(self, lat: float, lng: float, soil_data: Dict) -> Dict:
        """
        Analyze soil quality based on Puranic descriptions
        (Color, Smell, Taste, Touch, Sound)
        """
        if not soil_data:
            soil_data = self.get_soil_composition(lat, lng)
            
        # Interpret color (Varna)
        color_meaning = self.interpret_soil_color(soil_data.get('color'))
        
        # Assess qualities
        qualities = self.assess_soil_by_qualities(soil_data)
        
        # Determine Puranic soil type
        soil_type = self.get_puranic_soil_classification(soil_data)
        
        return {
            'soil_type': soil_type,
            'color_significance': color_meaning,
            'qualities': qualities,
            'fertility_score': soil_data.get('fertility', 0.5) * 100,
            'construction_suitability': self.get_construction_recommendations(soil_type)
        }
    
    def analyze_panchamahabhuta(self, lat: float, lng: float, elev: float) -> Dict:
        """
        Analyze balance of Five Elements (Earth, Water, Fire, Air, Ether)
        """
        elements = {
            'Prithvi': {'score': 0, 'status': ''},
            'Jala': {'score': 0, 'status': ''},
            'Agni': {'score': 0, 'status': ''},
            'Vayu': {'score': 0, 'status': ''},
            'Akasha': {'score': 0, 'status': ''}
        }
        
        # Prithvi (Earth) - Stability, Soil, Slope
        slope = self.get_terrain_slope(lat, lng)
        soil_quality = self.get_soil_composition(lat, lng)['fertility']
        elements['Prithvi']['score'] = int((soil_quality * 50) + (max(0, 50 - slope)))
        
        # Jala (Water) - Proximity, Quality, Flow
        water_bodies = self.find_nearby_water_bodies(lat, lng, radius_km=5)
        rainfall = self.get_annual_rainfall(lat, lng)
        elements['Jala']['score'] = min(100, int(len(water_bodies) * 10 + rainfall / 20))
        
        # Agni (Fire) - Temperature, Sunlight, Orientation
        sunshine = self.get_solar_exposure(lat, lng)
        temp = self.get_temperature_data(lat, lng)
        elements['Agni']['score'] = min(100, int(sunshine['annual_sunshine_hours'] / 30 + temp['annual_mean']))
        
        # Vayu (Air) - Wind, Air Quality, Openness
        wind = self.get_wind_patterns(lat, lng)
        aqi = self.get_air_quality_index(lat, lng)
        elements['Vayu']['score'] = min(100, int(wind['average_speed'] * 5 + (100 - aqi) / 2))
        
        # Akasha (Ether) - Space, Noise, Cosmic Energy
        open_space = self.calculate_open_space(lat, lng)
        noise = self.get_noise_level(lat, lng)
        elements['Akasha']['score'] = min(100, int(open_space * 100 - noise / 2))
        
        # Generate recommendations for each
        for el, data in elements.items():
            data['recommendations'] = self.get_element_recommendations(el, data['score'])
            
        return {
            'elements': elements,
            'dominant_element': max(elements.items(), key=lambda x: x[1]['score'])[0],
            'deficient_element': min(elements.items(), key=lambda x: x[1]['score'])[0],
            'balance_interpretation': self.interpret_panchamahabhuta_balance(elements)
        }
    
    def analyze_sacred_geography(self, lat: float, lng: float) -> Dict:
        """
        Analyze proximity to sacred sites (Tirthas) and rivers
        """
        nearby_sites = []
        
        for site in self.puranic_landmarks['Jyotirlingas']:
            dist = self.calculate_distance(lat, lng, site['lat'], site['lng'])
            if dist < 100:  # Within 100km
                nearby_sites.append({**site, 'distance_km': dist, 'type': 'Jyotirlinga'})
                
        for site in self.puranic_landmarks['Shakti Peethas']:
            dist = self.calculate_distance(lat, lng, site['lat'], site['lng'])
            if dist < 100:
                nearby_sites.append({**site, 'distance_km': dist, 'type': 'Shakti Peetha'})
        
        # Check sacred rivers
        river_proximity = self.check_sacred_water_proximity(lat, lng)
        
        return {
            'nearby_sacred_sites': nearby_sites,
            'sacred_river_proximity': river_proximity,
            'spiritual_significance_score': self.assess_spiritual_significance(nearby_sites),
            'recommended_practices': self.get_sacred_site_practices(nearby_sites)
        }
    
    def determine_land_classification(
        self,
        bhumi: Dict,
        elements: Dict,
        sacred: Dict
    ) -> str:
        """
        Classify land as Uttama, Madhyama, or Adhama
        """
        score = 0
        
        # Soil contribution (30%)
        if 'Uttama' in bhumi['soil_type']: score += 30
        elif 'Madhyama' in bhumi['soil_type']: score += 20
        else: score += 10
        
        # Elemental balance (40%)
        avg_element_score = sum(e['score'] for e in elements['elements'].values()) / 5
        score += (avg_element_score / 100) * 40
        
        # Sacred geography (30%)
        if sacred['nearby_sacred_sites']: score += 30
        elif sacred['sacred_river_proximity']['is_near_sacred_water']: score += 20
        else: score += 10
        
        if score >= 80: return 'Uttama (Excellent)'
        elif score >= 60: return 'Madhyama (Good)'
        else: return 'Adhama (Average/Low)'
        
    def analyze_karmic_history(self, lat: float, lng: float) -> Dict:
        """
        Analyze historical usage and karmic imprint
        """
        history = self.research_historical_land_use(lat, lng)
        indigenous = self.check_indigenous_history(lat, lng)
        
        karmic_score = 100
        issues = []
        
        if 'battlefield' in history:
            karmic_score -= 40
            issues.append('Historical conflict zone')
        if 'burial_ground' in history:
            karmic_score -= 50
            issues.append('Historical burial ground')
        if not indigenous['properly_acknowledged']:
            karmic_score -= 20
            issues.append('Unacknowledged indigenous land')
            
        return {
            'score': karmic_score,
            'historical_uses': history,
            'karmic_issues': issues,
            'interpretation': self.interpret_karmic_score(karmic_score),
            'purification_rituals': self.get_purification_rituals(karmic_score, issues)
        }
    
    def assess_dharmic_suitability(self, classification: str, karma: Dict) -> Dict:
        """
        Assess suitability for Dharmic living
        """
        base_score = 0
        if 'Uttama' in classification: base_score = 90
        elif 'Madhyama' in classification: base_score = 70
        else: base_score = 50
        
        final_score = (base_score + karma['score']) / 2
        
        return {
            'score': final_score,
            'suitability_level': 'High' if final_score > 80 else 'Moderate' if final_score > 60 else 'Low',
            'guidance': self.get_dharmic_guidance_for_karma(final_score),
            'enhancement_potential': self.assess_enhancement_potential(final_score)
        }
        
    def load_puranic_landmarks(self) -> Dict:
        """Load database of Puranic sites"""
        return {
            'Jyotirlingas': [
                {
                    'name': 'Somnath',
                    'lat': 20.8880, 'lng': 70.4012,
                    'deity': 'Shiva', 'significance': 'First Jyotirlinga',
                    'purana_reference': 'Skanda Purana',
                    'spiritual_benefits': 'Liberation from curse, healing'
                },
                {
                    'name': 'Kashi Vishwanath',
                    'lat': 25.3109, 'lng': 83.0107,
                    'deity': 'Shiva', 'significance': 'Moksha Puri',
                    'purana_reference': 'Kashi Khanda',
                    'spiritual_benefits': 'Moksha, wisdom'
                },
                {
                    'name': 'Kedarnath',
                    'lat': 30.7352, 'lng': 79.0669,
                    'deity': 'Vishnu', 'significance': 'Himalayan shrine',
                    'purana_reference': 'Skanda Purana',
                    'spiritual_benefits': 'Moksha, divine blessings'
                },
                # ... Dwarka, Puri, Rameswaram
            ],
            'Shakti Peethas': [
                # 51 sacred Devi sites
            ],
            # More categories...
        }
    
    def load_vyasa_guidelines(self) -> Dict:
        """Load Veda Vyasa's guidelines for land"""
        return {}  # Implement from texts
    
    def get_soil_composition(self, lat: float, lng: float) -> Dict:
        """Get soil data (would integrate with geological databases)"""
        return {
            'color': 'reddish',
            'fertility': 0.75,
            'rock_content': 0.2,
            'organic_matter': 0.05,
            'ph': 6.8
        }
    
    def interpret_soil_color(self, color: str) -> str:
        """Interpret soil color as per Brihat Samhita"""
        meanings = {
            'reddish': 'Most auspicious - brings prosperity (Rajasic quality)',
            'golden': 'Excellent - associated with royalty and wealth',
            'white': 'Good - associated with purity and peace',
            'yellow': 'Good - associated with knowledge',
            'black': 'Neutral - good for agriculture',
            'mixed': 'Check dominant color for interpretation'
        }
        return meanings.get(color, 'Consult Vastu expert')
    
    def assess_soil_by_qualities(self, soil: Dict) -> Dict:
        """Ancient method of soil testing by qualities"""
        return {
            'quality': 'Excellent' if soil['fertility'] > 0.7 else 'Good',
            'smell': 'Pleasant' if soil['organic_matter'] > 0.04 else 'Neutral',
            'touch': 'Soft and workable'
        }
    
    def get_puranic_soil_classification(self, soil: Dict) -> str:
        """Classify soil according to Puranic texts"""
        if soil['color'] == 'reddish' and soil['fertility'] > 0.7:
            return 'Uttama Bhumi (Best land)'
        elif soil['fertility'] > 0.5:
            return 'Madhyama Bhumi (Medium land)'
        else:
            return 'Adhama Bhumi (Lower land)'
    
    def get_construction_recommendations(self, bhumi_type: str) -> List[str]:
        """Get construction recommendations based on land type"""
        recommendations = {
            'Jangala': [
                'Ideal for residential construction',
                'Build foundation with stone for stability',
                'Ensure good drainage despite low water table',
                'Use local materials for harmony'
            ],
            'Anupa': [
                'Install proper drainage system first',
                'Elevate foundation above ground level',
                'Use waterproofing extensively',
                'Consider stilts or raised platforms'
            ],
            'Sadharana': [
                'Standard construction methods apply',
                'Follow normal Vastu guidelines',
                'Ensure proper ventilation',
                'Balance wet and dry areas'
            ]
        }
        return recommendations.get(bhumi_type, [])
    
    def get_element_recommendations(self, element: str, score: int) -> List[str]:
        """Recommendations to balance specific element"""
        if score > 80:
            return [f'{element} is well-balanced - maintain current state']
        
        recommendations = {
            'Prithvi': [
                'Add rocky garden features',
                'Use earthen pots and clay',
                'Build stone walls or boundaries',
                'Create raised garden beds'
            ],
            'Jala': [
                'Install water features (fountain, pond)',
                'Ensure proper water storage',
                'Create rainwater harvesting system',
                'Add aquatic plants'
            ],
            'Agni': [
                'Maximize south-facing windows',
                'Use warm colors in decor',
                'Install proper lighting',
                'Create fire pit or havan kund'
            ],
            'Vayu': [
                'Ensure cross-ventilation',
                'Plant trees for air circulation',
                'Install wind chimes',
                'Keep spaces open and airy'
            ],
            'Akasha': [
                'Create open meditation spaces',
                'Use mirrors to create spaciousness',
                'Minimize clutter',
                'Incorporate skylights'
            ]
        }
        return recommendations.get(element, [])
    
    def find_nearby_water_bodies(self, lat: float, lng: float, radius_km: float) -> List[Dict]:
        """Find water bodies within radius"""
        # Would integrate with geographic database
        return []
    
    def check_sacred_water_proximity(self, lat: float, lng: float) -> Dict:
        """Check proximity to sacred rivers/water bodies"""
        sacred_rivers = ['Ganga', 'Yamuna', 'Saraswati', 'Godavari', 'Krishna', 'Kaveri', 'Narmada']
        # Implementation would check actual distances
        return {
            'is_near_sacred_water': False,
            'nearest_sacred_water': None,
            'distance_km': None
        }
    
    def interpret_panchamahabhuta_balance(self, elements: Dict) -> str:
        """Interpret the balance of five elements"""
        dominant = max(elements.items(), key=lambda x: x[1]['score'])[0]
        deficient = min(elements.items(), key=lambda x: x[1]['score'])[0]
        
        return f"According to Puranic wisdom, this land shows {dominant} dominance. The element {deficient} requires strengthening through specific remedies. A balanced Panchamahabhuta creates harmony and prosperity."
    
    def assess_spiritual_significance(self, sacred_sites: List[Dict]) -> str:
        """Assess overall spiritual significance"""
        if not sacred_sites:
            return 'No major sacred sites nearby'
        
        closest = sacred_sites[0]
        if closest['distance_km'] < 10:
            return f"Highly significant - Very close to {closest['name']}"
        elif closest['distance_km'] < 50:
            return f"Significant - Within pilgrimage distance of {closest['name']}"
        else:
            return f"Moderate - Near {closest['name']}"
    
    def get_sacred_site_practices(self, sacred_sites: List[Dict]) -> List[str]:
        """Get recommended practices based on nearby sacred sites"""
        if not sacred_sites:
            return ['Establish home shrine', 'Daily puja', 'Weekend temple visits']
        
        practices = [
            f"Visit {sacred_sites[0]['name']} annually",
            'Offer prayers facing direction of sacred site',
            'Donate to temple maintenance',
            'Participate in sacred festivals'
        ]
        return practices
    
    def get_element_remedy(self, element: str) -> Dict:
        """Get specific remedy for weak element"""
        remedies = {
            'Prithvi': {
                'category': 'Element Enhancement',
                'remedy': 'Prithvi Tattva Strengthening',
                'description': 'Enhance Earth element through specific practices',
                'procedure': [
                    'Create terracotta garden with clay pots',
                    'Build stone pathway or rock garden',
                    'Use earth-toned colors in construction',
                    'Bury crystal in foundation (Prithvi Yantra)'
                ],
                'cost_estimate': '2000-10000 INR',
                'benefits': 'Increases stability and grounding energy'
            }
            # Similar for other elements
        }
        return remedies.get(element, {})
    
    def interpret_karmic_score(self, score: int) -> str:
        """Interpret karmic score"""
        if score >= 75:
            return 'Highly Positive Karma - Land carries beneficial energies'
        elif score >= 50:
            return 'Neutral to Positive - Standard purification sufficient'
        elif score >= 25:
            return 'Some negative influences - Extensive purification recommended'
        else:
            return 'Significant negative karma - Consider alternative location or major remediation'
    
    def get_purification_rituals(self, score: int, influences: List[Dict]) -> List[Dict]:
        """Get purification rituals based on karmic assessment"""
        rituals = []
        
        if score < 60:
            rituals.append({
                'name': 'Maha Sudarshan Homa',
                'purpose': 'Deep purification of negative energies',
                'duration': '3 days',
                'priest_required': True,
                'cost': '25000-50000 INR'
            })
        
        return rituals
    
    def get_dharmic_guidance_for_karma(self, score: int) -> List[str]:
        """Dharmic guidance based on karmic score"""
        return [
            'Perform good deeds on the land',
            'Feed animals and birds regularly',
            'Plant fruit trees for community',
            'Share water with travelers',
            'Maintain cleanliness and purity'
        ]
    
    def generate_overall_assessment(self, dharmic_score: int) -> str:
        """Generate overall Puranic assessment"""
        if dharmic_score >= 85:
            return "UTTAMA BHUMI (Excellent Land) - According to Puranic wisdom: This land carries highly positive energies suitable for spiritual practices, residential use, and prosperity. The Panchamahabhuta are well-balanced. Regular worship and maintenance will enhance these qualities further."
        elif dharmic_score >= 60:
            return "MADHYAMA BHUMI (Good Land) - According to Puranic wisdom: This land has moderate positive energies suitable for general habitation. Some remedial measures will optimize the environment. Regular spiritual practices and Vastu compliance will bring prosperity."
        else:
            return "ADHAMA BHUMI (Lower Quality) - According to Puranic wisdom: This land requires extensive purification and remedial measures before use. Consult with Vastu expert for specific corrections. With proper remedies and dedication, the land can be transformed."
    
    def get_scriptural_references(self) -> List[str]:
        """Provide scriptural references for analysis"""
        return [
            'Matsya Purana (Chapters 252-256) - Land Classification',
            'Agni Purana (Chapters 103-106) - Bhumi Pariksha',
            'Brihat Samhita (Chapters 53-55) - Vastu and Land',
            'Vishnu Dharmottara Purana - Land Selection',
            'Manu Smriti - Dharmic use of land',
            'Varahamihira\'s Vastu texts - Comprehensive land science'
        ]
    
    # More helper methods...
    def research_historical_land_use(self, lat: float, lng: float) -> List[str]:
        """Research historical use of land"""
        # Would integrate with historical databases, archaeological records
        return ['agricultural', 'forest']
    
    def check_indigenous_history(self, lat: float, lng: float) -> Dict:
        """Check if land has indigenous history requiring acknowledgment"""
        return {
            'is_indigenous_land': False,
            'indigenous_people': None,
            'properly_acknowledged': True
        }
    
    def get_vegetation_diversity(self, lat: float, lng: float) -> Dict:
        """Get vegetation diversity data"""
        return {'tree_species': 15, 'diversity_index': 0.75}
    
    def check_auspicious_wildlife(self, lat: float, lng: float) -> Dict:
        """Check for presence of auspicious animals"""
        return {'peacocks': False, 'cows': False, 'deer': True}
    
    def get_classification_references(self, classification: str) -> str:
        """Get Puranic references for classification"""
        refs = {
            'Uttama': 'Matsya Purana 252.3 - Best land for temples and sages',
            'Madhyama': 'Matsya Purana 252.8 - Good land for merchants',
            'Adhama': 'Matsya Purana 252.12 - Land for laborers'
        }
        return refs.get(classification, '')
    
    def assess_enhancement_potential(self, score: int) -> str:
        """Assess potential for land improvement"""
        if score >= 85:
            return 'Excellent - minimal enhancement needed'
        elif score >= 60:
            return 'Good - moderate enhancements will optimize'
        else:
            return 'Significant potential - extensive remedies can transform'
    
    # More stub implementations for completeness
    def estimate_water_table_depth(self, lat, lng, elev):
        return 25.0  # feet
    
    def get_vegetation_density(self, lat, lng):
        return 0.65
    
    def get_solar_exposure(self, lat, lng):
        return {'annual_sunshine_hours': 2800}
    
    def get_temperature_data(self, lat, lng):
        return {'annual_mean': 22}
    
    def get_wind_patterns(self, lat, lng):
        return {'average_speed': 8.5}
    
    def get_air_quality_index(self, lat, lng):
        return 35
    
    def calculate_open_space(self, lat, lng):
        return 0.7
    
    def get_light_pollution(self, lat, lng):
        return 0.25
    
    def get_noise_level(self, lat, lng):
        return 42
    
    def assess_water_quality(self, lat, lng):
        return {'taste': 'sweet', 'purity': 'high'}
    
    def get_annual_rainfall(self, lat, lng):
        return 1000  # mm
    
    def assess_vedic_agriculture(self, lat, lng, elev):
        """Agricultural potential using Vedic principles"""
        return {
            'suitability': 'High',
            'recommended_crops': ['Rice', 'Wheat', 'Vegetables'],
            'seasonal_guidance': 'Follow Panchang for planting',
            'cow_integration': 'Highly recommended for organic farming'
        }
    
    def analyze_geopathic_stress(self, lat, lng):
        """Analyze geopathic stress lines (from Vastu Puranas)"""
        return {
            'stress_lines_detected': False,
            'underground_water_flow': 'Normal',
            'electromagnetic_anomalies': 'None',
            'recommendation': 'No geopathic concerns'
        }
    
    def get_terrain_slope(self, lat: float, lng: float) -> float:
        """Get terrain slope in degrees"""
        # Would query DEM (Digital Elevation Model)
        return 10
        
    def calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance in km using Haversine formula"""
        R = 6371  # Earth radius in km
        
        dlat = math.radians(lat2 - lat1)
        dlng = math.radians(lng2 - lng1)
        a = math.sin(dlat/2) * math.sin(dlat/2) + \
            math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
            math.sin(dlng/2) * math.sin(dlng/2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        
        return R * c
