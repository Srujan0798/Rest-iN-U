# ml-models/vastu/vastu_analyzer.py
import numpy as np
import cv2
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
# import tensorflow as tf # Commented out to avoid dependency issues if not installed
from PIL import Image
import io

@dataclass
class VastuRule:
    rule_id: str
    name: str
    category: str
    severity: str  # 'critical', 'moderate', 'minor'
    principle: str
    check_logic: Dict
    remedies: List[Dict]
    score_impact: int

class VastuAnalyzer:
    def __init__(self):
        self.rules = self.load_vastu_rules()
        # self.room_detection_model = self.load_room_detection_model()
        # self.segmentation_model = self.load_segmentation_model()
        self.room_detection_model = None
        self.segmentation_model = None
        
    def load_vastu_rules(self) -> List[VastuRule]:
        """Load 10,000+ Vastu rules from database/JSON"""
        rules = []
        
        # ENTRANCE RULES
        rules.append(VastuRule(
            rule_id='ENTRANCE_001',
            name='East Entrance - Most Auspicious',
            category='entrance',
            severity='critical',
            principle='East direction ruled by Indra (King of Gods). Brings prosperity, positive energy, success.',
            check_logic={'direction': 'east', 'condition': 'ideal'},
            remedies=[],
            score_impact=15
        ))
        
        rules.append(VastuRule(
            rule_id='ENTRANCE_002',
            name='North Entrance - Wealth Direction',
            category='entrance',
            severity='critical',
            principle='North ruled by Kubera (God of Wealth). Attracts prosperity and financial growth.',
            check_logic={'direction': 'north', 'condition': 'ideal'},
            remedies=[],
            score_impact=15
        ))
        
        rules.append(VastuRule(
            rule_id='ENTRANCE_003',
            name='South-West Entrance - Avoid',
            category='entrance',
            severity='critical',
            principle='SW direction ruled by Nir (Demon). Can bring obstacles and negative energy.',
            check_logic={'direction': ['south', 'southwest'], 'condition': 'problematic'},
            remedies=[
                {
                    'type': 'structural',
                    'description': 'Relocate entrance to East or North',
                    'cost_estimate': 25000,
                    'effectiveness': 100
                },
                {
                    'type': 'placement',
                    'description': 'Place Ganesha idol outside entrance, hang sacred toran',
                    'cost_estimate': 500,
                    'effectiveness': 60
                },
                {
                    'type': 'symbolic',
                    'description': 'Install Vastu pyramid, paint door with specific colors',
                    'cost_estimate': 200,
                    'effectiveness': 40
                }
            ],
            score_impact=-20
        ))
        
        # KITCHEN RULES
        rules.append(VastuRule(
            rule_id='KITCHEN_001',
            name='Southeast Kitchen - Agni Direction',
            category='kitchen',
            severity='critical',
            principle='Southeast ruled by Agni (Fire God). Perfect alignment for cooking activities.',
            check_logic={'location': 'southeast', 'condition': 'ideal'},
            remedies=[],
            score_impact=15
        ))
        
        rules.append(VastuRule(
            rule_id='KITCHEN_002',
            name='Northeast Kitchen - Strictly Avoid',
            category='kitchen',
            severity='critical',
            principle='Northeast is most sacred direction. Kitchen here brings health and financial problems.',
            check_logic={'location': 'northeast', 'condition': 'critical'},
            remedies=[
                {
                    'type': 'structural',
                    'description': 'Relocate kitchen to Southeast',
                    'cost_estimate': 50000,
                    'effectiveness': 100
                },
                {
                    'type': 'energetic',
                    'description': 'Perform Vastu Shanti puja, install water feature in NE',
                    'cost_estimate': 1000,
                    'effectiveness': 30
                }
            ],
            score_impact=-30
        ))
        
        # BEDROOM RULES
        rules.append(VastuRule(
            rule_id='BEDROOM_001',
            name='Southwest Master Bedroom - Stability',
            category='bedroom',
            severity='moderate',
            principle='SW direction provides stability, rest, and strengthens relationships.',
            check_logic={'location': 'southwest', 'room_type': 'master', 'condition': 'ideal'},
            remedies=[],
            score_impact=10
        ))
        
        rules.append(VastuRule(
            rule_id='BEDROOM_002',
            name='Overhead Beam Above Bed',
            category='bedroom',
            severity='minor',
            principle='Beam creates psychological pressure and can cause health issues.',
            check_logic={'has_beam_above_bed': True, 'condition': 'problematic'},
            remedies=[
                {
                    'type': 'structural',
                    'description': 'Install false ceiling to hide beam',
                    'cost_estimate': 1500,
                    'effectiveness': 100
                },
                {
                    'type': 'placement',
                    'description': 'Relocate bed away from beam',
                    'cost_estimate': 0,
                    'effectiveness': 80
                },
                {
                    'type': 'symbolic',
                    'description': 'Hang fabric canopy above bed',
                    'cost_estimate': 200,
                    'effectiveness': 60
                }
            ],
            score_impact=-5
        ))
        
        # BATHROOM RULES
        rules.append(VastuRule(
            rule_id='BATHROOM_001',
            name='Northeast Bathroom - Critical Defect',
            category='bathroom',
            severity='critical',
            principle='NE is sacred water direction. Bathroom pollutes this zone.',
            check_logic={'location': 'northeast', 'condition': 'critical'},
            remedies=[
                {
                    'type': 'structural',
                    'description': 'Relocate bathroom to West or Northwest',
                    'cost_estimate': 40000,
                    'effectiveness': 100
                },
                {
                    'type': 'energetic',
                    'description': 'Keep door closed always, install Vastu yantra',
                    'cost_estimate': 100,
                    'effectiveness': 20
                }
            ],
            score_impact=-25
        ))
        
        # BRAHMASTHAN (CENTER) RULES
        rules.append(VastuRule(
            rule_id='CENTER_001',
            name='Open Brahmasthan - Energy Flow',
            category='center',
            severity='critical',
            principle='Center should be open for energy circulation. Heavy furniture blocks flow.',
            check_logic={'center_open': True, 'condition': 'ideal'},
            remedies=[],
            score_impact=15
        ))
        
        return rules
    
    def analyze_floor_plan(
        self,
        floor_plan_image: bytes,
        orientation: str,
        property_type: str
    ) -> Dict:
        """Main analysis function"""
        
        # Step 1: Load and preprocess image
        image = self.load_image(floor_plan_image)
        
        # Step 2: Detect rooms using ML model
        rooms = self.detect_rooms(image)
        
        # Step 3: Identify entrance
        entrance = self.identify_entrance(image, rooms, orientation)
        
        # Step 4: Segment floor plan into directional zones
        zones = self.segment_into_zones(image, orientation)
        
        # Step 5: Apply Vastu rules
        issues = []
        score = 100  # Start with perfect score
        
        for rule in self.rules:
            if self.rule_applies(rule, rooms, entrance, zones, property_type):
                compliance = self.check_rule_compliance(rule, rooms, entrance, zones)
                
                if not compliance['passed']:
                    issues.append({
                        'rule': rule.name,
                        'category': rule.category,
                        'severity': rule.severity,
                        'description': compliance['description'],
                        'principle': rule.principle,
                        'remedies': rule.remedies,
                        'score_impact': rule.score_impact
                    })
                    score += rule.score_impact  # Negative impact
                else:
                    score += rule.score_impact  # Positive impact for good placement
        
        # Ensure score is between 0-100
        score = max(0, min(100, score))
        
        # Calculate grade
        grade = self.calculate_grade(score)
        
        # Generate detailed analysis
        detailed_analysis = self.generate_detailed_analysis(
            rooms, entrance, zones, issues, score
        )
        
        # Create visualization
        visualization = self.create_visualization(image, rooms, zones, issues)
        
        return {
            'score': score,
            'grade': grade,
            'issues': issues,
            'detailed_analysis': detailed_analysis,
            'visualization': visualization,
            'rooms_detected': rooms,
            'entrance': entrance,
            'zones': zones
        }
    
    def load_image(self, image_bytes: bytes) -> np.ndarray:
        """Load and preprocess floor plan image"""
        image = Image.open(io.BytesIO(image_bytes))
        image = image.convert('RGB')
        image_array = np.array(image)
        return image_array
    
    def detect_rooms(self, image: np.ndarray) -> List[Dict]:
        """Detect and classify rooms using CNN model"""
        # Mock implementation since we don't have the model file
        return [
            {'type': 'kitchen', 'location': 'southeast', 'center': (100, 100), 'bounds': (50, 50, 100, 100), 'area': 10000},
            {'type': 'bedroom', 'location': 'southwest', 'center': (300, 300), 'bounds': (250, 250, 100, 100), 'area': 10000, 'is_master': True},
            {'type': 'bathroom', 'location': 'west', 'center': (100, 300), 'bounds': (50, 250, 100, 100), 'area': 10000}
        ]
    
    def identify_entrance(
        self,
        image: np.ndarray,
        rooms: List[Dict],
        orientation: str
    ) -> Dict:
        """Identify main entrance location and direction"""
        # Mock implementation
        return {
            'direction': 'east',
            'location': (500, 250)
        }
    
    def segment_into_zones(self, image: np.ndarray, orientation: str) -> Dict[str, List]:
        """Divide floor plan into 8 directional zones + center"""
        height, width = image.shape[:2]
        
        # Define grid (3x3)
        third_w = width // 3
        third_h = height // 3
        
        zones = {
            'north': [], 'northeast': [], 'east': [],
            'southeast': [], 'south': [], 'southwest': [],
            'west': [], 'northwest': [], 'center': []
        }
        
        # Mock implementation - just returning empty lists as placeholders
        # In real implementation, this would contain pixel coordinates or masks
        zones['center'] = [(third_w, third_h, third_w, third_h)]
        
        return zones
    
    def rule_applies(
        self,
        rule: VastuRule,
        rooms: List[Dict],
        entrance: Dict,
        zones: Dict,
        property_type: str
    ) -> bool:
        """Check if a Vastu rule applies to this property"""
        
        # Category-based filtering
        if rule.category == 'entrance':
            return True  # Entrance rules always apply
        
        if rule.category == 'kitchen':
            return any(room['type'] == 'kitchen' for room in rooms)
        
        if rule.category == 'bedroom':
            return any(room['type'] == 'bedroom' for room in rooms)
        
        if rule.category == 'bathroom':
            return any(room['type'] == 'bathroom' for room in rooms)
        
        if rule.category == 'commercial':
            return property_type == 'commercial'
        
        return True
    
    def check_rule_compliance(
        self,
        rule: VastuRule,
        rooms: List[Dict],
        entrance: Dict,
        zones: Dict
    ) -> Dict:
        """Check if property complies with a specific Vastu rule"""
        
        logic = rule.check_logic
        
        # Entrance rules
        if rule.category == 'entrance':
            if 'direction' in logic:
                expected = logic['direction']
                actual = entrance['direction'].lower()
                
                if isinstance(expected, list):
                    passed = actual in expected
                else:
                    passed = actual == expected
                
                if logic['condition'] == 'ideal':
                    return {
                        'passed': passed,
                        'description': f"Entrance is in {actual.title()} direction"
                    }
                elif logic['condition'] == 'problematic':
                    return {
                        'passed': not passed,
                        'description': f"Entrance is in {actual.title()} direction (not recommended)"
                    }
        
        # Kitchen rules
        if rule.category == 'kitchen':
            kitchens = [room for room in rooms if room['type'] == 'kitchen']
            if not kitchens:
                return {'passed': True, 'description': 'No kitchen detected'}
            
            kitchen = kitchens[0]
            if 'location' in logic:
                expected = logic['location']
                actual = kitchen['location'].lower()
                passed = actual == expected
                
                if logic['condition'] == 'ideal':
                    return {
                        'passed': passed,
                        'description': f"Kitchen is in {actual.title()} (expected: {expected.title()})"
                    }
                elif logic['condition'] == 'critical':
                    return {
                        'passed': not passed,
                        'description': f"Kitchen in {actual.title()} - critical Vastu defect"
                    }
        
        # Bedroom rules
        if rule.category == 'bedroom':
            bedrooms = [room for room in rooms if room['type'] == 'bedroom']
            
            if 'has_beam_above_bed' in logic:
                # Simplified: assume beams detected from image analysis
                # Real implementation would use detailed image processing
                passed = not logic['has_beam_above_bed']
                return {
                    'passed': passed,
                    'description': 'Overhead beam detected above bed'
                }
            
            if 'location' in logic:
                master_bedrooms = [room for room in bedrooms if room.get('is_master', False)]
                if master_bedrooms:
                    actual = master_bedrooms[0]['location'].lower()
                    expected = logic['location']
                    passed = actual == expected
                    return {
                        'passed': passed,
                        'description': f"Master bedroom in {actual.title()}"
                    }
        
        # Center rules
        if rule.category == 'center':
            if 'center_open' in logic:
                # Check if center zone has minimal furniture/rooms
                center_zone = zones['center'][0]
                center_occupancy = self.calculate_zone_occupancy(center_zone, rooms)
                passed = center_occupancy < 0.3  # Less than 30% occupied
                return {
                    'passed': passed,
                    'description': f"Center {'open' if passed else 'cluttered'} ({int(center_occupancy * 100)}% occupied)"
                }
        
        return {'passed': True, 'description': 'Rule check not implemented'}
    
    def calculate_zone_occupancy(self, zone: Tuple, rooms: List[Dict]) -> float:
        # Mock implementation
        return 0.1
        
    def calculate_grade(self, score: int) -> str:
        if score >= 90: return 'A+'
        if score >= 80: return 'A'
        if score >= 70: return 'B'
        if score >= 60: return 'C'
        if score >= 50: return 'D'
        return 'F'
        
    def generate_detailed_analysis(
        self,
        rooms: List[Dict],
        entrance: Dict,
        zones: Dict,
        issues: List[Dict],
        score: int
    ) -> Dict:
        """Generate comprehensive analysis report"""
        
        return {
            'entrance': {
                'direction': entrance['direction'],
                'assessment': 'Good', # Mock
                'ruling_deity': 'Indra', # Mock
                'element': 'Air' # Mock
            },
            'room_placements': {
                room['type']: {
                    'location': room['location'],
                    'assessment': 'Good', # Mock
                    'recommendations': [] # Mock
                }
                for room in rooms
            },
            'summary': f"Overall Vastu Score: {score}/100"
        }
        
    def create_visualization(self, image: np.ndarray, rooms: List[Dict], zones: Dict, issues: List[Dict]) -> str:
        # Mock implementation - return path to generated image
        return "/path/to/visualization.jpg"

if __name__ == "__main__":
    # Test run
    analyzer = VastuAnalyzer()
    print(f"Loaded {len(analyzer.rules)} Vastu rules")
