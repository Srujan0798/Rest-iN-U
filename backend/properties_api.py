"""
=============================================================================
PROPERTIES API ROUTES - B1 Backend
Core Property Listings and Search Endpoints for ESTATE Mode
=============================================================================
"""

from flask import Blueprint, request, jsonify
from datetime import datetime
import sys
import random
import string

sys.path.append("..")

# Create blueprint
properties_bp = Blueprint("properties", __name__, url_prefix="/api/v1")

# Sample data - in production this would come from database
SAMPLE_PROPERTIES = [
    {
        "id": "PROP-001",
        "title": "Modern 3BR Villa in Koramangala",
        "streetAddress": "7th Block, Koramangala",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560095",
        "price": 15000000,
        "bedrooms": 3,
        "bathrooms": 2,
        "squareFeet": 1850,
        "propertyType": "Villa",
        "status": "Active",
        "photos": [
            {"url": "https://picsum.photos/seed/prop1a/400/300.jpg", "isPrimary": True},
            {
                "url": "https://picsum.photos/seed/prop1b/400/300.jpg",
                "isPrimary": False,
            },
        ],
        "vastuAnalysis": [{"overallScore": 85, "grade": "A+"}],
        "climateAnalysis": {"overallRiskScore": 25, "riskGrade": "Low"},
        "latitude": 12.9279,
        "longitude": 77.6271,
    },
    {
        "id": "PROP-002",
        "title": "Luxury 2BR Apartment in Indiranagar",
        "streetAddress": "12th Main, Indiranagar",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560038",
        "price": 12000000,
        "bedrooms": 2,
        "bathrooms": 2,
        "squareFeet": 1450,
        "propertyType": "Apartment",
        "status": "Active",
        "photos": [
            {"url": "https://picsum.photos/seed/prop2a/400/300.jpg", "isPrimary": True},
            {
                "url": "https://picsum.photos/seed/prop2b/400/300.jpg",
                "isPrimary": False,
            },
        ],
        "vastuAnalysis": [{"overallScore": 78, "grade": "A"}],
        "climateAnalysis": {"overallRiskScore": 35, "riskGrade": "Medium"},
        "latitude": 12.9784,
        "longitude": 77.6408,
    },
    {
        "id": "PROP-003",
        "title": "Spacious 4BR House in Whitefield",
        "streetAddress": "EPIP Zone, Whitefield",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560066",
        "price": 25000000,
        "bedrooms": 4,
        "bathrooms": 3,
        "squareFeet": 2400,
        "propertyType": "House",
        "status": "Active",
        "photos": [
            {"url": "https://picsum.photos/seed/prop3a/400/300.jpg", "isPrimary": True}
        ],
        "vastuAnalysis": [{"overallScore": 92, "grade": "A++"}],
        "climateAnalysis": {"overallRiskScore": 20, "riskGrade": "Low"},
        "latitude": 12.9698,
        "longitude": 77.7499,
    },
    {
        "id": "PROP-004",
        "title": "Cozy 1BR Studio in HSR Layout",
        "streetAddress": "Sector 2, HSR Layout",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560102",
        "price": 8000000,
        "bedrooms": 1,
        "bathrooms": 1,
        "squareFeet": 950,
        "propertyType": "Apartment",
        "status": "Active",
        "photos": [
            {"url": "https://picsum.photos/seed/prop4a/400/300.jpg", "isPrimary": True}
        ],
        "vastuAnalysis": [{"overallScore": 70, "grade": "B+"}],
        "climateAnalysis": {"overallRiskScore": 40, "riskGrade": "Medium"},
        "latitude": 12.9116,
        "longitude": 77.6371,
    },
    {
        "id": "PROP-005",
        "title": "Premium 3BR Condo in Jayanagar",
        "streetAddress": "4th Block, Jayanagar",
        "city": "Bangalore",
        "state": "Karnataka",
        "zipCode": "560041",
        "price": 18000000,
        "bedrooms": 3,
        "bathrooms": 2,
        "squareFeet": 1650,
        "propertyType": "Condo",
        "status": "Active",
        "photos": [
            {"url": "https://picsum.photos/seed/prop5a/400/300.jpg", "isPrimary": True}
        ],
        "vastuAnalysis": [{"overallScore": 88, "grade": "A+"}],
        "climateAnalysis": {"overallRiskScore": 30, "riskGrade": "Low"},
        "latitude": 12.9307,
        "longitude": 77.5803,
    },
]


def filter_properties(properties, filters):
    """Apply search filters to properties"""
    filtered = properties.copy()

    # City filter
    if filters.get("city"):
        city = filters["city"].lower()
        filtered = [p for p in filtered if city in p["city"].lower()]

    # Property type filter
    if filters.get("propertyType"):
        prop_type = filters["propertyType"].lower()
        filtered = [p for p in filtered if prop_type in p["propertyType"].lower()]

    # Price range filters
    if filters.get("minPrice") is not None:
        filtered = [p for p in filtered if p["price"] >= filters["minPrice"]]

    if filters.get("maxPrice") is not None:
        filtered = [p for p in filtered if p["price"] <= filters["maxPrice"]]

    # Bedroom filter
    if filters.get("minBedrooms") is not None:
        filtered = [p for p in filtered if p["bedrooms"] >= filters["minBedrooms"]]

    # Bathroom filter
    if filters.get("minBathrooms") is not None:
        filtered = [p for p in filtered if p["bathrooms"] >= filters["minBathrooms"]]

    # Vastu score filter
    if filters.get("minVastuScore") is not None:
        filtered = [
            p
            for p in filtered
            if p["vastuAnalysis"][0]["overallScore"] >= filters["minVastuScore"]
        ]

    return filtered


@properties_bp.route("/properties", methods=["GET"])
def get_properties():
    """
    Get properties with optional search filters

    Query Parameters:
    - city: Filter by city
    - propertyType: Filter by property type
    - minPrice, maxPrice: Price range filter
    - minBedrooms: Minimum bedrooms
    - minBathrooms: Minimum bathrooms
    - minVastuScore: Minimum Vastu score
    - page: Page number (default: 1)
    - limit: Results per page (default: 12)
    - includeAnalysis: Include Vastu and climate analysis (default: true)
    """
    try:
        # Get query parameters
        filters = {
            "city": request.args.get("city"),
            "propertyType": request.args.get("propertyType"),
            "minPrice": request.args.get("minPrice", type=int),
            "maxPrice": request.args.get("maxPrice", type=int),
            "minBedrooms": request.args.get("minBedrooms", type=int),
            "minBathrooms": request.args.get("minBathrooms", type=int),
            "minVastuScore": request.args.get("minVastuScore", type=int),
        }

        # Remove None values
        filters = {k: v for k, v in filters.items() if v is not None}

        # Pagination
        page = request.args.get("page", 1, type=int)
        limit = request.args.get("limit", 12, type=int)
        include_analysis = request.args.get("includeAnalysis", "true").lower() == "true"

        # Apply filters
        filtered_properties = filter_properties(SAMPLE_PROPERTIES, filters)

        # Calculate pagination
        total = len(filtered_properties)
        total_pages = (total + limit - 1) // limit
        offset = (page - 1) * limit

        # Get paginated results
        paginated_properties = filtered_properties[offset : offset + limit]

        # Optionally remove analysis data
        if not include_analysis:
            for prop in paginated_properties:
                prop.pop("vastuAnalysis", None)
                prop.pop("climateAnalysis", None)

        return jsonify(
            {
                "success": True,
                "data": {
                    "properties": paginated_properties,
                    "pagination": {
                        "page": page,
                        "limit": limit,
                        "total": total,
                        "totalPages": total_pages,
                    },
                    "filters_applied": filters,
                    "timestamp": datetime.now().isoformat(),
                },
            }
        )

    except Exception as e:
        return jsonify(
            {"success": False, "error": {"message": str(e), "type": "search_error"}}
        ), 400


@properties_bp.route("/properties/<property_id>", methods=["GET"])
def get_property(property_id):
    """Get detailed information for a specific property"""
    try:
        # Find property by ID
        property_data = next(
            (p for p in SAMPLE_PROPERTIES if p["id"] == property_id), None
        )

        if not property_data:
            return jsonify(
                {
                    "success": False,
                    "error": {"message": "Property not found", "type": "not_found"},
                }
            ), 404

        # Include additional details for single property view
        detailed_property = property_data.copy()
        detailed_property.update(
            {
                "description": f"Beautiful {property_data['bedrooms']}BR {property_data['propertyType'].lower()} located in the prime area of {property_data['streetAddress']}. This property offers excellent Vastu compliance and modern amenities.",
                "yearBuilt": random.randint(2010, 2022),
                "parking": random.choice(["Car", "Bike", "Both"]),
                "furnishing": random.choice(
                    ["Furnished", "Semi-Furnished", "Unfurnished"]
                ),
                "amenities": [
                    "24/7 Security",
                    "Power Backup",
                    "Rain Water Harvesting",
                    "Gym",
                    "Swimming Pool",
                    "Children's Play Area",
                ],
                "nearbyPlaces": [
                    {
                        "type": "School",
                        "name": "National Public School",
                        "distance": "1.2 km",
                    },
                    {
                        "type": "Hospital",
                        "name": "Manipal Hospital",
                        "distance": "2.5 km",
                    },
                    {"type": "Shopping", "name": "Garuda Mall", "distance": "3.0 km"},
                ],
            }
        )

        return jsonify({"success": True, "data": detailed_property})

    except Exception as e:
        return jsonify(
            {"success": False, "error": {"message": str(e), "type": "property_error"}}
        ), 400


@properties_bp.route("/properties/<property_id>/favorite", methods=["POST"])
def favorite_property(property_id):
    """Toggle favorite status for a property"""
    try:
        # In a real implementation, this would update user's favorites in database
        # For now, just return success
        favorited = random.choice([True, False])

        return jsonify(
            {
                "success": True,
                "data": {
                    "propertyId": property_id,
                    "favorited": favorited,
                    "timestamp": datetime.now().isoformat(),
                },
            }
        )

    except Exception as e:
        return jsonify(
            {"success": False, "error": {"message": str(e), "type": "favorite_error"}}
        ), 400


@properties_bp.route("/search/advanced", methods=["POST"])
def advanced_search():
    """Advanced property search with complex filters"""
    try:
        search_data = request.get_json()

        # Convert POST data to filter format
        filters = {
            "city": search_data.get("city"),
            "propertyType": search_data.get("propertyType"),
            "minPrice": search_data.get("minPrice"),
            "maxPrice": search_data.get("maxPrice"),
            "minBedrooms": search_data.get("bedrooms"),
            "minBathrooms": search_data.get("bathrooms"),
            "minVastuScore": search_data.get("minVastuScore"),
        }

        # Apply filters
        filtered_properties = filter_properties(SAMPLE_PROPERTIES, filters)

        return jsonify(
            {
                "success": True,
                "data": {
                    "properties": filtered_properties,
                    "total": len(filtered_properties),
                    "search_criteria": search_data,
                    "timestamp": datetime.now().isoformat(),
                },
            }
        )

    except Exception as e:
        return jsonify(
            {"success": False, "error": {"message": str(e), "type": "search_error"}}
        ), 400


def register_properties_routes(app):
    """Register properties routes with Flask app"""
    app.register_blueprint(properties_bp)
    return app
