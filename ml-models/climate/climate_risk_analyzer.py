import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
import xgboost as xgb
from datetime import datetime, timedelta
import requests
import pickle
from typing import Dict, List, Tuple
import json
import os

class ClimateRiskAnalyzer:
    def __init__(self):
        self.flood_model = self.load_flood_model()
        self.wildfire_model = self.load_wildfire_model()
        self.hurricane_model = self.load_hurricane_model()
        self.heat_model = self.load_heat_model()
        self.drought_model = self.load_drought_model()
        
        # Data sources
        self.noaa_api_key = os.getenv('NOAA_API_KEY')
        self.nasa_api_key = os.getenv('NASA_API_KEY')
        
    def analyze_100_year_risk(
        self,
        latitude: float,
        longitude: float,
        elevation: float,
        property_data: Dict
    ) -> Dict:
        """
        Generate 100-year climate risk projection
        
        Uses multiple data sources:
        - NOAA climate models (RCP 4.5, RCP 8.5)
        - NASA sea level projections
        - FEMA flood maps
        - Historical weather data
        - IPCC climate scenarios
        """
        
        print(f"Analyzing climate risk for ({latitude}, {longitude})...")
        
        # Fetch historical data
        historical_data = self.fetch_historical_data(latitude, longitude)
        
        # Fetch current climate projections
        climate_projections = self.fetch_climate_projections(latitude, longitude)
        
        # Analyze each risk type for multiple time periods
        timeline_risks = {}
        
        for year in [2030, 2050, 2075, 2100]:
            timeline_risks[str(year)] = {
                'flood_risk': self.predict_flood_risk(
                    latitude, longitude, elevation, year, historical_data, climate_projections
                ),
                'wildfire_risk': self.predict_wildfire_risk(
                    latitude, longitude, year, historical_data, climate_projections
                ),
                'hurricane_risk': self.predict_hurricane_risk(
                    latitude, longitude, elevation, year, historical_data, climate_projections
                ),
                'extreme_heat_days': self.predict_extreme_heat(
                    latitude, longitude, year, historical_data, climate_projections
                ),
                'drought_probability': self.predict_drought(
                    latitude, longitude, year, historical_data, climate_projections
                ),
                'sea_level_rise_cm': self.predict_sea_level_rise(
                    latitude, longitude, elevation, year
                )
            }
            
            # Calculate overall risk for this period
            timeline_risks[str(year)]['overall_risk'] = self.calculate_overall_risk(
                timeline_risks[str(year)]
            )
        
        # Calculate current overall risk
        overall_score = timeline_risks['2030']['overall_risk']
        
        # Determine grade
        grade = self.calculate_risk_grade(overall_score)
        
        # Generate specific risk details
        specific_risks = self.generate_specific_risk_details(
            latitude, longitude, elevation, historical_data
        )
        
        # Project insurance costs
        insurance_projections = self.project_insurance_costs(
            timeline_risks, property_data
        )
        
        # Generate mitigation strategies
        mitigation_strategies = self.generate_mitigation_strategies(
            timeline_risks, specific_risks, property_data
        )
        
        # Find safer alternatives
        safer_alternatives = self.find_safer_locations(
            latitude, longitude, overall_score
        )
        
        return {
            'overall_risk_score': overall_score,
            'grade': grade,
            'timeline': timeline_risks,
            'specific_risks': specific_risks,
            'insurance_projections': insurance_projections,
            'mitigation_strategies': mitigation_strategies,
            'safer_alternatives': safer_alternatives,
            'data_sources': self.list_data_sources(),
            'confidence_score': self.calculate_confidence(historical_data),
            'last_updated': datetime.utcnow().isoformat()
        }
    
    def predict_flood_risk(
        self,
        lat: float,
        lng: float,
        elevation: float,
        year: int,
        historical: pd.DataFrame,
        projections: Dict
    ) -> int:
        """
        Predict flood risk score (0-100) for given year
        
        Factors:
        - Current FEMA flood zone
        - Elevation
        - Sea level rise projections
        - Rainfall patterns
        - River/stream proximity
        - Storm surge probability
        """
        
        # Get FEMA zone
        fema_zone = self.get_fema_zone(lat, lng)
        
        # Base risk from FEMA zone
        zone_risk = {
            'A': 80,  # High risk
            'AE': 75,
            'AH': 70,
            'AO': 65,
            'V': 90,  # Coastal high hazard
            'VE': 85,
            'X': 20,  # Moderate to low
            'B': 30,
            'C': 15
        }.get(fema_zone, 50)
        
        # Adjust for elevation
        if elevation < 10:  # Very low elevation
            zone_risk += 20
        elif elevation < 50:
            zone_risk += 10
        elif elevation > 500:
            zone_risk -= 20
        
        # Adjust for sea level rise
        years_from_now = year - 2025
        sea_level_rise = self.predict_sea_level_rise(lat, lng, elevation, year)
        
        if sea_level_rise > 100:  # Over 1 meter
            zone_risk += 30
        elif sea_level_rise > 50:
            zone_risk += 15
        
        # Adjust for rainfall trends
        rainfall_trend = self.analyze_rainfall_trend(historical, projections, year)
        zone_risk += rainfall_trend * 10
        
        # Check proximity to water bodies
        water_distance = self.get_nearest_water_body_distance(lat, lng)
        if water_distance < 1000:  # Within 1km
            zone_risk += 15
        elif water_distance < 5000:  # Within 5km
            zone_risk += 5
        
        # Machine learning prediction
        features = self.prepare_flood_features(
            lat, lng, elevation, year, fema_zone, sea_level_rise,
            rainfall_trend, water_distance, historical
        )
        ml_prediction = self.flood_model.predict([features])[0]
        
        # Combine rule-based and ML prediction
        final_risk = int(0.6 * zone_risk + 0.4 * ml_prediction * 100)
        
        return max(0, min(100, final_risk))
    
    def predict_wildfire_risk(
        self,
        lat: float,
        lng: float,
        year: int,
        historical: pd.DataFrame,
        projections: Dict
    ) -> int:
        """
        Predict wildfire risk score (0-100)
        
        Factors:
        - Historical fire perimeters
        - Vegetation density (NDVI)
        - Temperature trends
        - Drought conditions
        - Wind patterns
        - Fire season length
        """
        
        base_risk = 30  # Baseline
        
        # Check historical fires within 10 miles
        fire_history = self.get_fire_history(lat, lng, radius_miles=10)
        fires_10yr = len([f for f in fire_history if f['year'] >= 2015])
        
        if fires_10yr >= 3:
            base_risk += 30
        elif fires_10yr >= 1:
            base_risk += 15
        
        # Vegetation density (from satellite data)
        ndvi = self.get_ndvi(lat, lng)  # Normalized Difference Vegetation Index
        if ndvi > 0.6:  # Dense vegetation = more fuel
            base_risk += 20
        elif ndvi > 0.4:
            base_risk += 10
        
        # Temperature increase projection
        years_from_now = year - 2025
        temp_increase = projections.get('temperature_increase', 0) * years_from_now / 75
        
        if temp_increase > 3:  # More than 3°C increase
            base_risk += 25
        elif temp_increase > 2:
            base_risk += 15
        elif temp_increase > 1:
            base_risk += 10
        
        # Fire season extension
        fire_season_days = 180 + (temp_increase * 20)  # Longer fire season with warming
        if fire_season_days > 240:
            base_risk += 15
        
        # Drought conditions
        drought_prob = projections.get('drought_probability', 0.2)
        base_risk += int(drought_prob * 20)
        
        # Topography (slopes increase fire spread)
        slope = self.get_terrain_slope(lat, lng)
        if slope > 30:  # Steep slope
            base_risk += 10
        
        # ML prediction
        features = self.prepare_wildfire_features(
            lat, lng, year, fires_10yr, ndvi, temp_increase,
            fire_season_days, drought_prob, slope
        )
        ml_prediction = self.wildfire_model.predict([features])[0]
        
        final_risk = int(0.5 * base_risk + 0.5 * ml_prediction * 100)
        
        return max(0, min(100, final_risk))
    
    def predict_hurricane_risk(
        self,
        lat: float,
        lng: float,
        elevation: float,
        year: int,
        historical: pd.DataFrame,
        projections: Dict
    ) -> int:
        """
        Predict hurricane/tropical cyclone risk
        
        Factors:
        - Distance from coast
        - Historical storm tracks
        - Ocean temperature trends
        - Storm intensity projections
        """
        
        # Check if coastal
        coast_distance = self.get_coast_distance(lat, lng)
        
        if coast_distance > 200000:  # More than 200km inland
            return 5  # Minimal risk
        
        base_risk = 40
        
        # Historical hurricane tracks
        hurricanes = self.get_hurricane_tracks(lat, lng, radius_miles=50)
        hurricanes_20yr = len([h for h in hurricanes if h['year'] >= 2005])
        
        if hurricanes_20yr >= 5:
            base_risk += 30
        elif hurricanes_20yr >= 2:
            base_risk += 20
        elif hurricanes_20yr >= 1:
            base_risk += 10
        
        # Category 4/5 hurricanes
        major_hurricanes = [h for h in hurricanes if h['category'] >= 4]
        if len(major_hurricanes) > 0:
            base_risk += 15
        
        # Ocean warming (warmer water = stronger hurricanes)
        years_from_now = year - 2025
        ocean_temp_increase = projections.get('sst_increase', 0) * years_from_now / 75
        
        if ocean_temp_increase > 2:
            base_risk += 20
        elif ocean_temp_increase > 1:
            base_risk += 10
        
        # Storm surge risk (elevation + coast distance)
        if coast_distance < 10000 and elevation < 5:  # Within 10km, low elevation
            base_risk += 25
        
        # ML prediction
        features = self.prepare_hurricane_features(
            lat, lng, year, coast_distance, hurricanes_20yr,
            ocean_temp_increase, len(major_hurricanes)
        )
        ml_prediction = self.hurricane_model.predict([features])[0]
        
        final_risk = int(0.6 * base_risk + 0.4 * ml_prediction * 100)
        
        return max(0, min(100, final_risk))
    
    def predict_extreme_heat(
        self,
        lat: float,
        lng: float,
        year: int,
        historical: pd.DataFrame,
        projections: Dict
    ) -> int:
        """
        Predict number of days exceeding 95°F (35°C)
        """
        
        # Current extreme heat days
        current_heat_days = historical['days_over_95F'].mean() if 'days_over_95F' in historical.columns else 30
        
        # Temperature increase projection
        years_from_now = year - 2025
        temp_increase_celsius = projections.get('temperature_increase', 1.5) * years_from_now / 75
        
        # Urban heat island effect
        urban_factor = self.get_urban_heat_island_factor(lat, lng)
        temp_increase_celsius += urban_factor
        
        # Project future heat days (exponential relationship)
        projected_heat_days = current_heat_days * (1 + temp_increase_celsius * 0.5) ** 2
        
        # Add uncertainty
        uncertainty = np.random.normal(0, 5)
        projected_heat_days += uncertainty
        
        return int(max(0, projected_heat_days))
    
    def predict_drought(
        self,
        lat: float,
        lng: float,
        year: int,
        historical: pd.DataFrame,
        projections: Dict
    ) -> float:
        """
        Predict drought probability (0-1)
        """
        
        # Current drought frequency
        current_drought_years = historical['drought'].sum() if 'drought' in historical.columns else 5
        historical_probability = current_drought_years / len(historical) if len(historical) > 0 else 0.2
        
        # Precipitation change projection
        years_from_now = year - 2025
        precip_change = projections.get('precipitation_change', -0.1) * years_from_now / 75
        
        # Temperature increase (higher temp = more evaporation)
        temp_increase = projections.get('temperature_increase', 1.5) * years_from_now / 75
        
        # Project future probability
        drought_probability = historical_probability * (1 - precip_change) * (1 + temp_increase * 0.15)
        
        return max(0, min(1, drought_probability))
    
    def predict_sea_level_rise(
        self,
        lat: float,
        lng: float,
        elevation: float,
        year: int
    ) -> float:
        """
        Predict sea level rise in centimeters
        
        Uses NASA projections based on IPCC scenarios
        """
        
        # Check if coastal
        coast_distance = self.get_coast_distance(lat, lng)
        
        if coast_distance > 100000:  # More than 100km inland
            return 0
        
        years_from_now = year - 2025
        
        # NASA/NOAA projections (RCP 8.5 - high emissions scenario)
        # Base rate: ~3.3mm/year currently, accelerating
        base_rate_cm_per_year = 0.33
        acceleration = 0.01  # cm/year increase per year
        
        # Calculate cumulative rise
        cumulative_rise = 0
        for y in range(years_from_now):
            annual_rate = base_rate_cm_per_year + (acceleration * y)
            cumulative_rise += annual_rate
        
        return cumulative_rise
    
    def calculate_overall_risk(self, year_risks: Dict) -> int:
        """Calculate weighted overall risk score"""
        
        weights = {
            'flood_risk': 0.25,
            'wildfire_risk': 0.20,
            'hurricane_risk': 0.20,
            'extreme_heat_days': 0.15,  # Normalized to 0-100
            'drought_probability': 0.15,  # Normalized to 0-100
            'sea_level_rise_cm': 0.05  # Normalized to 0-100
        }
        
        # Normalize heat days (0-365 -> 0-100)
        normalized_heat = min(100, year_risks['extreme_heat_days'] / 3.65)
        
        # Normalize drought (0-1 -> 0-100)
        normalized_drought = year_risks['drought_probability'] * 100
        
        # Normalize sea level (0-200cm -> 0-100)
        normalized_sea_level = min(100, year_risks['sea_level_rise_cm'] / 2)
        
        overall = (
            weights['flood_risk'] * year_risks['flood_risk'] +
            weights['wildfire_risk'] * year_risks['wildfire_risk'] +
            weights['hurricane_risk'] * year_risks['hurricane_risk'] +
            weights['extreme_heat_days'] * normalized_heat +
            weights['drought_probability'] * normalized_drought +
            weights['sea_level_rise_cm'] * normalized_sea_level
        )
        
        return int(overall)
    
    def calculate_risk_grade(self, score: int) -> str:
        """Convert risk score to grade"""
        if score <= 20:
            return 'Excellent (Very Low Risk)'
        elif score <= 40:
            return 'Good (Low Risk)'
        elif score <= 60:
            return 'Moderate Risk'
        elif score <= 80:
            return 'High Risk'
        else:
            return 'Severe Risk'
    
    def generate_specific_risk_details(
        self,
        lat: float,
        lng: float,
        elevation: float,
        historical: pd.DataFrame
    ) -> Dict:
        """Generate detailed risk breakdown"""
        
        return {
            'flood': {
                'fema_zone': self.get_fema_zone(lat, lng),
                'elevation_advantage': f"{elevation}ft above sea level",
                'nearest_water_body': f"{self.get_nearest_water_body_distance(lat, lng) / 1000:.1f} miles",
                '100yr_flood_probability': self.calculate_100yr_flood_prob(lat, lng, elevation)
            },
            'wildfire': {
                'fire_history_10mi': len(self.get_fire_history(lat, lng, 10)),
                'vegetation_density': self.get_ndvi(lat, lng),
                'defensible_space': 'Assess on-site',
                'fire_season_length': self.calculate_fire_season_length(historical)
            },
            'hurricane': {
                'historical_tracks': len(self.get_hurricane_tracks(lat, lng, 50)),
                'coast_distance': f"{self.get_coast_distance(lat, lng) / 1000:.1f} km",
                'storm_surge_zone': self.determine_storm_surge_zone(lat, lng, elevation)
            },
            'heat': {
                'current_extreme_days': int(historical['days_over_95F'].mean()) if 'days_over_95F' in historical.columns else 'N/A',
                'urban_heat_island': self.get_urban_heat_island_factor(lat, lng) > 0.5
            }
        }
    
    def project_insurance_costs(
        self,
        timeline: Dict,
        property_data: Dict
    ) -> Dict:
        """Project future insurance costs"""
        
        current_premium = property_data.get('current_insurance', 2000)
        property_value = property_data.get('price', 500000)
        
        projections = {}
        
        for year, risks in timeline.items():
            # Calculate risk multiplier
            risk_multiplier = 1 + (risks['overall_risk'] / 100) * 2
            
            # Account for market hardening
            years_from_now = int(year) - 2025
            market_factor = 1 + (years_from_now * 0.03)  # 3% annual increase baseline
            
            projected_premium = current_premium * risk_multiplier * market_factor
            
            projections[year] = int(projected_premium)
        
        # Determine insurability
        insurability = 'Insurable'
        if timeline['2050']['overall_risk'] > 85:
            insurability = 'Difficult to insure by 2050'
        if timeline['2075']['overall_risk'] > 90:
            insurability = 'Likely uninsurable by 2075'
        
        return {
            'current_annual': current_premium,
            **{f'{year}_projected': premium for year, premium in projections.items()},
            'insurability_outlook': insurability
        }
    
    def generate_mitigation_strategies(
        self,
        timeline: Dict,
        specific_risks: Dict,
        property_data: Dict
    ) -> List[Dict]:
        """Generate actionable mitigation strategies"""
        
        strategies = []
        
        # Flood mitigation
        if timeline['2050']['flood_risk'] > 50:
            strategies.append({
                'type': 'Flood Protection',
                'actions': [
                    {
                        'improvement': 'Elevate structure',
                        'cost': 75000,
                        'risk_reduction': 35,
                        'insurance_savings_annual': 1200,
                        'roi_years': 12.5,
                        'priority': 'high'
                    },
                    {
                        'improvement': 'Install flood barriers',
                        'cost': 15000,
                        'risk_reduction': 15,
                        'insurance_savings_annual': 400,
                        'roi_years': 8.3,
                        'priority': 'medium'
                    }
                ]
            })
        
        # Wildfire mitigation
        if timeline['2050']['wildfire_risk'] > 40:
            strategies.append({
                'type': 'Wildfire Protection',
                'actions': [
                    {
                        'improvement': 'Create defensible space (100ft)',
                        'cost': 5000,
                        'risk_reduction': 25,
                        'insurance_savings_annual': 500,
                        'roi_years': 10,
                        'priority': 'high'
                    },
                    {
                        'improvement': 'Install ember-resistant vents',
                        'cost': 2000,
                        'risk_reduction': 10,
                        'insurance_savings_annual': 200,
                        'roi_years': 10,
                        'priority': 'medium'
                    },
                    {
                        'improvement': 'Upgrade to Class A fire-rated roofing',
                        'cost': 15000,
                        'risk_reduction': 15,
                        'insurance_savings_annual': 400,
                        'roi_years': 9.4,
                        'priority': 'medium'
                    }
                ]
            })
        
        # Hurricane mitigation
        if timeline['2050']['hurricane_risk'] > 50:
            strategies.append({
                'type': 'Hurricane Protection',
                'actions': [
                    {
                        'improvement': 'Install impact windows',
                        'cost': 25000,
                        'risk_reduction': 20,
                        'insurance_savings_annual': 800,
                        'roi_years': 7.8,
                        'priority': 'high'
                    },
                    {
                        'improvement': 'Roof bracing/hurricane straps',
                        'cost': 5000,
                        'risk_reduction': 15,
                        'insurance_savings_annual': 300,
                        'roi_years': 16.7,
                        'priority': 'medium'
                    }
                ]
            })
        
        # Heat mitigation
        if timeline['2050']['extreme_heat_days'] > 90:
            strategies.append({
                'type': 'Heat Management',
                'actions': [
                    {
                        'improvement': 'Cool roof coating',
                        'cost': 3000,
                        'risk_reduction': 5,
                        'insurance_savings_annual': 0,
                        'energy_savings_annual': 400,
                        'roi_years': 7.5,
                        'priority': 'medium'
                    },
                    {
                        'improvement': 'Enhanced insulation',
                        'cost': 8000,
                        'risk_reduction': 10,
                        'energy_savings_annual': 800,
                        'roi_years': 10,
                        'priority': 'medium'
                    }
                ]
            })
        
        return strategies
    
    def find_safer_locations(
        self,
        lat: float,
        lng: float,
        current_risk: int
    ) -> List[Dict]:
        """Find nearby locations with lower climate risk"""
        
        # This would query a database of pre-calculated risks
        # Simplified implementation
        safer = []
        
        # Search within 50 mile radius
        for offset_lat in [-0.5, 0, 0.5]:
            for offset_lng in [-0.5, 0, 0.5]:
                if offset_lat == 0 and offset_lng == 0:
                    continue
                
                new_lat = lat + offset_lat
                new_lng = lng + offset_lng
                
                # Quick risk estimate
                estimated_risk = self.quick_risk_estimate(new_lat, new_lng)
                
                if estimated_risk < current_risk - 20:  # At least 20 points lower
                    safer.append({
                        'location': f"({new_lat:.2f}, {new_lng:.2f})",
                        'risk_score': estimated_risk,
                        'risk_reduction': current_risk - estimated_risk,
                        'distance_miles': self.calculate_distance(lat, lng, new_lat, new_lng)
                    })
        
        return sorted(safer, key=lambda x: x['risk_score'])[:5]
    
    # Data fetching methods
    def fetch_historical_data(self, lat: float, lng: float) -> pd.DataFrame:
        """Fetch 30 years of historical weather data"""
        # Implementation would call NOAA API
        # Simplified placeholder
        years = list(range(1994, 2024))
        return pd.DataFrame({
            'year': years,
            'avg_temp': np.random.normal(60, 5, len(years)),
            'days_over_95F': np.random.poisson(30, len(years)),
            'annual_precip': np.random.normal(40, 10, len(years)),
            'drought': np.random.choice([0, 1], len(years), p=[0.8, 0.2])
        })
    
    def fetch_climate_projections(self, lat: float, lng: float) -> Dict:
        """Fetch climate model projections"""
        # Would call NASA, NOAA APIs
        return {
            'temperature_increase': 2.5,  # Celsius by 2100
            'precipitation_change': -0.15,  # -15% by 2100
            'sst_increase': 2.0,  # Sea surface temperature
            'drought_probability': 0.3
        }
    
    # Helper methods for ML models
    def load_flood_model(self):
        """Load trained flood prediction model"""
        # In production, load from file
        # For now, create simple model
        return RandomForestRegressor(n_estimators=100, random_state=42)
    
    def load_wildfire_model(self):
        return GradientBoostingRegressor(n_estimators=100, random_state=42)
    
    def load_hurricane_model(self):
        return xgb.XGBRegressor(n_estimators=100, random_state=42)
    
    def load_heat_model(self):
        return keras.models.Sequential([
            keras.layers.Dense(64, activation='relu', input_shape=(10,)),
            keras.layers.Dense(32, activation='relu'),
            keras.layers.Dense(1)
        ])
    
    def load_drought_model(self):
        return RandomForestRegressor(n_estimators=50, random_state=42)
    
    # Geospatial helper methods
    def get_fema_zone(self, lat: float, lng: float) -> str:
        """Get FEMA flood zone"""
        # Would query FEMA API/database
        # Simplified: assume based on elevation
        return 'X'  # Moderate risk
    
    def get_fire_history(self, lat: float, lng: float, radius_miles: int) -> List[Dict]:
        """Get historical fire perimeters"""
        # Would query NIFC/CalFire database
        return []
    
    def get_hurricane_tracks(self, lat: float, lng: float, radius_miles: int) -> List[Dict]:
        """Get historical hurricane tracks"""
        # Would query NOAA hurricane database
        return []
    
    def get_ndvi(self, lat: float, lng: float) -> float:
        """Get vegetation density from satellite"""
        # Would query NASA/USGS Landsat data
        return 0.5
    
    def get_coast_distance(self, lat: float, lng: float) -> float:
        """Calculate distance to nearest coast in meters"""
        # Would use spatial database
        return 50000  # 50km
    
    def get_nearest_water_body_distance(self, lat: float, lng: float) -> float:
        """Distance to nearest river/lake in meters"""
        return 5000  # 5km
    
    def get_terrain_slope(self, lat: float, lng: float) -> float:
        """Get terrain slope in degrees"""
        # Would query DEM (Digital Elevation Model)
        return 10
    
    def get_urban_heat_island_factor(self, lat: float, lng: float) -> float:
        """Get urban heat island effect (0-1)"""
        # Would analyze satellite imagery and development density
        return 0.3
    
    def calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance in miles using Haversine formula"""
        from math import radians, sin, cos, sqrt, atan2
        
        R = 3959  # Earth radius in miles
        
        lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
        dlat = lat2 - lat1
        dlng = lng2 - lng1
        
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
        c = 2 * atan2(sqrt(a), sqrt(1-a))
        
        return R * c
    
    def list_data_sources(self) -> List[str]:
        """List all data sources used"""
        return [
            'NOAA Climate Prediction Center',
            'NASA Sea Level Change Portal',
            'FEMA National Flood Hazard Layer',
            'IPCC Climate Models (RCP 4.5, 8.5)',
            'NIFC Fire Perimeter Database',
            'NHC Hurricane Database (HURDAT2)',
            'USGS Digital Elevation Model',
            'Landsat Vegetation Index'
        ]
    
    def calculate_confidence(self, historical: pd.DataFrame) -> float:
        """Calculate confidence score for predictions"""
        # Based on data quality and quantity
        if len(historical) >= 30:
            return 0.85
        elif len(historical) >= 20:
            return 0.75
        else:
            return 0.65
    
    def quick_risk_estimate(self, lat: float, lng: float) -> int:
        """Quick risk estimate without full analysis"""
        # Simplified calculation
        base = 40
        # Add random variation
        return base + np.random.randint(-20, 20)
        
    def analyze_rainfall_trend(self, historical: pd.DataFrame, projections: Dict, year: int) -> float:
        """Analyze rainfall trend"""
        # Simplified implementation
        return projections.get('precipitation_change', 0)

    def prepare_flood_features(self, lat, lng, elevation, year, fema_zone, sea_level_rise, rainfall_trend, water_distance, historical):
        # Simplified feature vector
        return [elevation, sea_level_rise, rainfall_trend, water_distance]

    def prepare_wildfire_features(self, lat, lng, year, fires_10yr, ndvi, temp_increase, fire_season_days, drought_prob, slope):
        return [fires_10yr, ndvi, temp_increase, fire_season_days, drought_prob, slope]

    def prepare_hurricane_features(self, lat, lng, year, coast_distance, hurricanes_20yr, ocean_temp_increase, major_hurricanes):
        return [coast_distance, hurricanes_20yr, ocean_temp_increase, major_hurricanes]
        
    def calculate_100yr_flood_prob(self, lat, lng, elevation):
        return 0.01

    def calculate_fire_season_length(self, historical):
        return 180

    def determine_storm_surge_zone(self, lat, lng, elevation):
        return "Zone X"
