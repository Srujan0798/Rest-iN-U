import sys
import os
sys.path.append('/Applications/Rest-iN-U-1')
from ml_models.vastu.scoring import calculate_vastu_score

# Test with a property that has several Vastu violations
def test_with_defects():
    problematic_property = {
        'entrance_direction': 'SW',  # Bad entrance direction
        'shape': 'triangular',       # Bad shape
        'has_center_space': False,   # No Brahmasthan
        'rooms': [
            {'type': 'kitchen', 'direction': 'NW', 'gas_stove_present': True, 'proper_ventilation': True},
            {'type': 'master bedroom', 'direction': 'NE'},  # Bad placement for master bedroom
            {'type': 'living room', 'direction': 'SW'},      # Bad placement for living room
            {'type': 'child bedroom', 'direction': 'SW'},    # Bad placement for child bedroom
            {'type': 'bathroom', 'direction': 'NE'},         # Very bad placement for bathroom
            {'type': 'bedroom', 'mirror_facing_bed': True}   # Mirror facing bed
        ],
        'water_bodies': [
            {'type': 'well', 'direction': 'SW'}              # Bad placement for water body
        ]
    }
    
    result = calculate_vastu_score(problematic_property)
    print(f"Vastu Score: {result['score']}")
    print(f"Grade: {result['grade']}")
    print(f"Defects: {result['defects']}")
    print(f"Remedies: {result['remedies']}")
    print()

# Test with a good property
def test_good_property():
    good_property = {
        'entrance_direction': 'NE',      # Good entrance direction
        'shape': 'rectangular',          # Good shape
        'has_center_space': True,        # Has Brahmasthan
        'rooms': [
            {'type': 'kitchen', 'direction': 'SE', 'gas_stove_present': True, 'proper_ventilation': True},
            {'type': 'master bedroom', 'direction': 'SW'},   # Good placement for master bedroom
            {'type': 'living room', 'direction': 'NE'},      # Good placement for living room
            {'type': 'child bedroom', 'direction': 'N'},     # Good placement for child bedroom
            {'type': 'bathroom', 'direction': 'NW'},         # Good placement for bathroom
        ],
        'water_bodies': [
            {'type': 'well', 'direction': 'NE'}              # Good placement for water body
        ]
    }
    
    result = calculate_vastu_score(good_property)
    print(f"Vastu Score: {result['score']}")
    print(f"Grade: {result['grade']}")
    print(f"Defects: {result['defects']}")
    print(f"Remedies: {result['remedies']}")
    print()

if __name__ == "__main__":
    print("Testing property with defects:")
    test_with_defects()
    
    print("Testing good property:")
    test_good_property()