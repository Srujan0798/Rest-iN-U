def calculate_vastu_score(property_data):
    """
    Calculate Vastu compliance score for a property based on traditional principles.

    Args:
        property_data (dict): Dictionary containing property information including:
            - entrance_direction: Direction of main entrance (N, NE, E, SE, S, SW, W, NW)
            - rooms: List of dictionaries with room type and location information

    Returns:
        dict: {score: 0-100, grade: 'A+' to 'F', defects: [], remedies: []}
    """
    score = 0
    defects = []
    remedies = []

    # Check entrance direction (North and Northeast get high scores in Vastu)
    entrance_direction = property_data.get('entrance_direction', '').upper()
    if entrance_direction in ['N', 'NE']:
        score += 20  # High score for favorable directions
    elif entrance_direction in ['E', 'SE']:
        score += 15  # Good score
    elif entrance_direction in ['NW', 'W']:
        score += 10  # Moderate score
    else:  # S, SW
        score += 5   # Lower score for less favorable directions
        if entrance_direction == 'SW':
            defects.append("Main entrance in Southwest direction is considered inauspicious")
            remedies.append("Install wind chimes or place a pair of lions/dogs near entrance. Keep this area clutter-free.")
        elif entrance_direction == 'S':
            defects.append("South-facing entrance may bring challenges")
            remedies.append("Paint the entrance door in bright colors like red or yellow. Place a pyramid or crystal near the entrance.")

    # Initialize rooms if not provided
    rooms = property_data.get('rooms', [])

    # Apply 5 basic room placement rules
    room_rules_results = apply_room_placement_rules(rooms, defects, remedies)
    score += room_rules_results['points']
    defects.extend(room_rules_results['defects'])
    remedies.extend(room_rules_results['remedies'])

    # Additional checks for common Vastu defects
    additional_defects = check_additional_vastu_principles(property_data, defects, remedies)
    score += additional_defects['points']
    defects.extend(additional_defects['defects'])
    remedies.extend(additional_defects['remedies'])

    # Ensure score doesn't exceed 100
    score = min(score, 100)

    # Ensure minimum score is 0
    score = max(score, 0)

    return {
        'score': score,
        'grade': get_grade_from_score(score),
        'defects': defects,
        'remedies': remedies
    }


def apply_room_placement_rules(rooms, existing_defects, existing_remedies):
    """Apply 5 basic Vastu room placement rules"""
    points = 0
    defects = []
    remedies = []
    
    # Convert rooms to a dictionary for easier lookup by direction
    room_locations = {}
    for room in rooms:
        room_type = room.get('type', '').lower()
        direction = room.get('direction', '').upper()
        if direction:
            room_locations[direction] = room_type
    
    # Rule 1: Kitchen in Southeast (best) or Northwest (acceptable)
    kitchen_direction = None
    for direction, room_type in room_locations.items():
        if room_type == 'kitchen':
            kitchen_direction = direction
            break
    
    if kitchen_direction == 'SE':
        points += 15  # Best position for kitchen
    elif kitchen_direction == 'NW':
        points += 10  # Acceptable position
    elif kitchen_direction:
        points -= 5   # Penalty for wrong placement
        defects.append(f"Kitchen in {kitchen_direction} direction is not ideal (should be SE or NW)")
        remedies.append("Place the cooking area/stove facing East while cooking, and keep kitchen clean and well-lit")
    
    # Rule 2: Master bedroom in Southwest (best) or South (good)
    master_bedroom_direction = None
    for direction, room_type in room_locations.items():
        if 'bedroom' in room_type and 'master' in room_type:
            master_bedroom_direction = direction
            break
    
    # If no specific master bedroom marked, look for any bedroom in SW/S
    if not master_bedroom_direction:
        for direction, room_type in room_locations.items():
            if room_type == 'bedroom':
                if direction in ['SW', 'S']:
                    master_bedroom_direction = direction  # Assume this is master if in good position
                    break
    
    if master_bedroom_direction == 'SW':
        points += 15  # Best position for master bedroom
    elif master_bedroom_direction == 'S':
        points += 10  # Good position
    elif master_bedroom_direction:
        points -= 5   # Penalty for wrong placement
        defects.append(f"Master bedroom in {master_bedroom_direction} direction is not ideal (should be SW or S)")
        remedies.append("Use heavy furniture in the Southwest corner of the bedroom to enhance stability")
    
    # Rule 3: Living room in North, East, or Northeast
    living_room_direction = None
    for direction, room_type in room_locations.items():
        if room_type in ['living room', 'lounge', 'sitting room', 'drawing room']:
            living_room_direction = direction
            break
    
    if living_room_direction in ['N', 'E', 'NE']:
        points += 12  # Good positions for living room
    elif living_room_direction:
        points -= 5   # Penalty for wrong placement
        defects.append(f"Living room in {living_room_direction} direction is not ideal (should be N, E, or NE)")
        remedies.append("Keep the living room well-lit with natural light and use light colors to enhance positive energy")
    
    # Rule 4: Children's rooms in North or East
    children_rooms = []
    for direction, room_type in room_locations.items():
        if 'child' in room_type or 'kids' in room_type:
            children_rooms.append((direction, room_type))
    
    for direction, room_type in children_rooms:
        if direction in ['N', 'E']:
            points += 8  # Good positions for children's rooms
        else:
            points -= 3  # Minor penalty
            defects.append(f"{room_type} in {direction} direction is not ideal (should be N or E)")
            remedies.append(f"Use bright and cheerful colors in {room_type} to promote positive energy for children")
    
    # Rule 5: Bathroom/Washroom in Northwest or West (avoid Southeast and Northeast)
    bathroom_directions = []
    for direction, room_type in room_locations.items():
        if 'bathroom' in room_type or 'toilet' in room_type or 'washroom' in room_type:
            bathroom_directions.append((direction, room_type))
    
    for direction, room_type in bathroom_directions:
        if direction in ['NW', 'W']:
            points += 5  # Acceptable positions for bathrooms
        elif direction in ['SE', 'NE']:
            points -= 8  # Major penalty for bad placement
            defects.append(f"{room_type} in {direction} direction is inauspicious (avoid SE and NE)")
            remedies.append(f"Ensure {room_type} is kept clean and dry, with proper ventilation and lighting")
        else:
            points -= 3  # Minor penalty
            defects.append(f"{room_type} in {direction} direction is not optimal (prefer NW or W)")
            remedies.append(f"Avoid placing {room_type} in center of house or in corners")
    
    return {
        'points': points,
        'defects': defects,
        'remedies': remedies
    }


def check_additional_vastu_principles(property_data, existing_defects, existing_remedies):
    """Check additional Vastu principles beyond room placement"""
    points = 0
    defects = []
    remedies = []

    # Check if there's a central courtyard or open space in center (Brahmasthan)
    has_center_space = property_data.get('has_center_space', False)
    if not has_center_space:
        defects.append("Lack of open space in center (Brahmasthan) affects positive energy flow")
        remedies.append("Keep the center of the house empty or use it as a meditation/clean space. Avoid placing heavy objects here.")

    # Check building shape
    building_shape = property_data.get('shape', 'rectangular').lower()
    if building_shape not in ['square', 'rectangular']:
        defects.append(f"Building shape ({building_shape}) is not ideal according to Vastu")
        remedies.append("Consider adding Vastu pyramids or crystals in corners to balance energies in irregular shapes")

    # Check if kitchen has proper elements
    rooms = property_data.get('rooms', [])
    kitchen_proper_elements = False
    for room in rooms:
        if room.get('type', '').lower() == 'kitchen':
            if room.get('gas_stove_present', True) and room.get('proper_ventilation', True):
                kitchen_proper_elements = True
                break

    if not kitchen_proper_elements:
        defects.append("Kitchen lacks proper elements (gas stove, ventilation) for positive energy")
        remedies.append("Ensure kitchen has a gas stove, proper ventilation, and keep it clean and organized")

    # Check if bedrooms have mirrors facing beds
    mirror_issues = 0
    for room in rooms:
        if 'bedroom' in room.get('type', '').lower():
            if room.get('mirror_facing_bed', False):
                mirror_issues += 1
                defects.append("Mirror facing bed in bedroom disrupts peaceful sleep")
                remedies.append("Reposition or cover the mirror so it doesn't reflect the bed during sleep")

    if mirror_issues > 0:
        points -= mirror_issues * 3  # Deduct points for each mirror issue

    # Check if water bodies are in proper direction
    water_bodies = property_data.get('water_bodies', [])  # List of dicts with 'type' and 'direction'
    for water_body in water_bodies:
        wb_direction = water_body.get('direction', '').upper()
        wb_type = water_body.get('type', '').lower()

        if wb_type in ['well', 'pond', 'tank'] and wb_direction in ['N', 'NE']:
            points += 8  # Good placement for water sources
        elif wb_type in ['well', 'pond', 'tank'] and wb_direction in ['SW', 'S']:
            defects.append(f"{wb_type.title()} in {wb_direction} direction is not recommended")
            remedies.append(f"Consider relocating {wb_type} to North or Northeast if possible")

    return {
        'points': points,
        'defects': defects,
        'remedies': remedies
    }


def get_grade_from_score(score):
    """Convert numerical score to letter grade"""
    if score >= 90:
        return 'A+'
    elif score >= 80:
        return 'A'
    elif score >= 70:
        return 'B+'
    elif score >= 60:
        return 'B'
    elif score >= 50:
        return 'C'
    elif score >= 40:
        return 'D'
    else:
        return 'F'


# Example usage and testing
if __name__ == "__main__":
    # Example property data
    sample_property = {
        'entrance_direction': 'NE',
        'shape': 'rectangular',
        'has_center_space': True,
        'rooms': [
            {'type': 'kitchen', 'direction': 'SE', 'gas_stove_present': True, 'proper_ventilation': True},
            {'type': 'master bedroom', 'direction': 'SW'},
            {'type': 'living room', 'direction': 'NE'},
            {'type': 'child bedroom', 'direction': 'N'},
            {'type': 'bathroom', 'direction': 'NW'}
        ],
        'water_bodies': [
            {'type': 'well', 'direction': 'NE'}
        ]
    }

    result = calculate_vastu_score(sample_property)
    print(f"Vastu Score: {result['score']}")
    print(f"Grade: {result['grade']}")
    print(f"Defects: {result['defects']}")
    print(f"Remedies: {result['remedies']}")