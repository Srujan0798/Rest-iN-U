import numpy as np
from typing import Dict, List, Any

class AyurvedicPropertyAnalyzer:
    def __init__(self):
        self.dosha_weights = {
            'Vata': {
                'climate': {'dry': 0.8, 'windy': 0.7, 'cold': 0.6},
                'elevation': {'high': 0.7},
                'features': {'open_plan': 0.5, 'high_ceilings': 0.4, 'glass': 0.3},
                'direction': {'northwest': 0.8}
            },
            'Pitta': {
                'climate': {'hot': 0.9, 'humid': 0.4},
                'features': {'south_facing': 0.7, 'fireplace': 0.3, 'metal': 0.4},
                'direction': {'south': 0.8, 'southeast': 0.7}
            },
            'Kapha': {
                'climate': {'cold': 0.5, 'damp': 0.8, 'rainy': 0.6},
                'elevation': {'low': 0.6},
                'features': {'basement': 0.5, 'thick_walls': 0.4, 'concrete': 0.4},
                'water': {'waterfront': 0.9, 'pool': 0.5},
                'direction': {'northeast': 0.6}
            }
        }

    def analyze_property(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a property based on Ayurvedic principles (Tridosha).
        """
        vata_score = self._calculate_vata(property_data)
        pitta_score = self._calculate_pitta(property_data)
        kapha_score = self._calculate_kapha(property_data)

        prakriti = self._determine_prakriti(vata_score, pitta_score, kapha_score)
        vikriti = self._determine_vikriti(vata_score, pitta_score, kapha_score)

        return {
            'scores': {
                'Vata': vata_score,
                'Pitta': pitta_score,
                'Kapha': kapha_score
            },
            'prakriti': prakriti,
            'vikriti': vikriti,
            'recommendations': self._generate_recommendations(prakriti, vikriti),
            'remedies': self._generate_remedies(vikriti)
        }

    def _calculate_vata(self, data: Dict) -> Dict:
        score = 0
        factors = []

        # Climate
        if data.get('humidity', 50) < 40:
            score += 20
            factors.append('Dry climate')
        if data.get('wind_speed', 0) > 15:
            score += 15
            factors.append('High wind')
        if data.get('temperature', 20) < 15:
            score += 15
            factors.append('Cold climate')

        # Elevation
        if data.get('elevation', 0) > 500:
            score += 10
            factors.append('High elevation')

        # Features
        if data.get('open_floor_plan'):
            score += 10
            factors.append('Open floor plan')
        if data.get('high_ceilings'):
            score += 10
            factors.append('High ceilings')
        
        # Direction
        if data.get('entrance_direction') == 'northwest':
            score += 15
            factors.append('Northwest entrance')

        return {
            'score': min(100, score),
            'factors': factors,
            'level': self._get_level_description(score)
        }

    def _calculate_pitta(self, data: Dict) -> Dict:
        score = 0
        factors = []

        # Climate
        if data.get('temperature', 20) > 30:
            score += 25
            factors.append('Hot climate')
        elif data.get('temperature', 20) > 25:
            score += 15
            factors.append('Warm climate')

        # Features
        if data.get('south_facing_windows', 0) > 5:
            score += 15
            factors.append('South facing windows')
        if data.get('has_fireplace'):
            score += 5
            factors.append('Fireplace')
        
        # Direction
        if data.get('entrance_direction') in ['south', 'southeast']:
            score += 20
            factors.append(f"{data.get('entrance_direction').capitalize()} entrance")

        return {
            'score': min(100, score),
            'factors': factors,
            'level': self._get_level_description(score)
        }

    def _calculate_kapha(self, data: Dict) -> Dict:
        score = 0
        factors = []

        # Climate
        if data.get('humidity', 50) > 70:
            score += 20
            factors.append('High humidity')
        if data.get('rainfall', 0) > 1500:
            score += 15
            factors.append('High rainfall')

        # Water
        if data.get('waterfront'):
            score += 20
            factors.append('Waterfront')
        if data.get('swimming_pool'):
            score += 10
            factors.append('Swimming pool')

        # Features
        if data.get('basement'):
            score += 10
            factors.append('Basement')
        if data.get('construction_material') == 'concrete':
            score += 10
            factors.append('Concrete construction')

        # Direction
        if data.get('entrance_direction') == 'northeast':
            score += 15
            factors.append('Northeast entrance')

        return {
            'score': min(100, score),
            'factors': factors,
            'level': self._get_level_description(score)
        }

    def _get_level_description(self, score: int) -> str:
        if score > 75: return 'Very High'
        if score > 60: return 'High'
        if score > 40: return 'Moderate'
        if score > 25: return 'Low'
        return 'Very Low'

    def _determine_prakriti(self, vata: Dict, pitta: Dict, kapha: Dict) -> Dict:
        scores = {'Vata': vata['score'], 'Pitta': pitta['score'], 'Kapha': kapha['score']}
        dominant = max(scores, key=scores.get)
        
        # Check for dual dosha
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        if sorted_scores[0][1] - sorted_scores[1][1] < 10:
            dominant = f"{sorted_scores[0][0]}-{sorted_scores[1][0]}"

        return {
            'dominant_dosha': dominant,
            'description': f"Property has a {dominant} constitution."
        }

    def _determine_vikriti(self, vata: Dict, pitta: Dict, kapha: Dict) -> Dict:
        imbalances = []
        if vata['score'] > 70: imbalances.append({'dosha': 'Vata', 'severity': 'High'})
        if pitta['score'] > 70: imbalances.append({'dosha': 'Pitta', 'severity': 'High'})
        if kapha['score'] > 70: imbalances.append({'dosha': 'Kapha', 'severity': 'High'})

        return {
            'imbalances': imbalances,
            'balanced': len(imbalances) == 0
        }

    def _generate_recommendations(self, prakriti: Dict, vikriti: Dict) -> List[str]:
        recommendations = []
        dominant = prakriti['dominant_dosha']

        if 'Vata' in dominant:
            recommendations.append("Use warm colors and heavy textures to ground the space.")
            recommendations.append("Ensure good insulation and draft protection.")
        if 'Pitta' in dominant:
            recommendations.append("Incorporate cooling elements like water features or shade plants.")
            recommendations.append("Use cooling colors like blues and greens.")
        if 'Kapha' in dominant:
            recommendations.append("Maximize natural light and ventilation.")
            recommendations.append("Use stimulating colors and declutter regularly.")

        return recommendations

    def _generate_remedies(self, vikriti: Dict) -> List[Dict]:
        remedies = []
        for imbalance in vikriti['imbalances']:
            dosha = imbalance['dosha']
            if dosha == 'Vata':
                remedies.append({'dosha': 'Vata', 'action': 'Add warmth and stability', 'items': ['Heavy curtains', 'Earth tones', 'Wind chimes']})
            elif dosha == 'Pitta':
                remedies.append({'dosha': 'Pitta', 'action': 'Cool and soothe', 'items': ['Indoor plants', 'Silver decor', 'Water fountain']})
            elif dosha == 'Kapha':
                remedies.append({'dosha': 'Kapha', 'action': 'Stimulate and energize', 'items': ['Bright lighting', 'Warm colors', 'Open space']})
        return remedies
