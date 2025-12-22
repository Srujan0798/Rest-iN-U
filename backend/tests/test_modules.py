"""
=============================================================================
DHARMA REALTY PLATFORM - TEST SUITE
Unit Tests for All Sprint Modules
=============================================================================
"""

import pytest
from datetime import datetime, date, timedelta
import sys
sys.path.insert(0, '..')


# =============================================================================
# ANCIENT WISDOM TESTS
# =============================================================================

class TestFengShui:
    """Tests for Feng Shui Calculator"""
    
    def test_feng_shui_calculator_init(self):
        from ancient_wisdom import FengShuiCalculator
        
        calculator = FengShuiCalculator()
        assert calculator is not None
        assert calculator.current_year == datetime.now().year
    
    def test_feng_shui_analysis(self):
        from ancient_wisdom import FengShuiCalculator, Direction
        
        calculator = FengShuiCalculator()
        property_data = {
            "id": "TEST-001",
            "wood_score": 25,
            "fire_score": 15,
            "earth_score": 20,
            "metal_score": 22,
            "water_score": 18
        }
        
        report = calculator.analyze_property(property_data, Direction.SOUTH)
        
        assert report.property_id == "TEST-001"
        assert 0 <= report.overall_score <= 100
        assert len(report.element_balance) == 5
        assert len(report.directional_analysis) == 8
        assert len(report.annual_afflictions) > 0
    
    def test_feng_shui_directions(self):
        from ancient_wisdom import Direction, Element
        from ancient_wisdom import FengShuiCalculator
        
        calculator = FengShuiCalculator()
        
        assert calculator.DIRECTION_ELEMENTS[Direction.NORTH] == Element.WATER
        assert calculator.DIRECTION_ELEMENTS[Direction.SOUTH] == Element.FIRE
        assert calculator.DIRECTION_ELEMENTS[Direction.EAST] == Element.WOOD


class TestVedicAstrology:
    """Tests for Vedic Astrology Engine"""
    
    def test_panchang(self):
        from ancient_wisdom import VedicAstrologyEngine
        
        engine = VedicAstrologyEngine()
        panchang = engine.get_panchang()
        
        assert panchang is not None
        assert panchang.tithi is not None
        assert panchang.nakshatra is not None
        assert panchang.vara is not None
    
    def test_griha_pravesh_dates(self):
        from ancient_wisdom import VedicAstrologyEngine
        
        engine = VedicAstrologyEngine()
        dates = engine.get_griha_pravesh_dates(datetime.now(), 2)
        
        assert isinstance(dates, list)
        if len(dates) > 0:
            assert "date" in dates[0]
            assert "quality" in dates[0]
    
    def test_property_purchase_dates(self):
        from ancient_wisdom import VedicAstrologyEngine
        
        engine = VedicAstrologyEngine()
        dates = engine.get_property_purchase_dates(datetime.now(), 2)
        
        assert isinstance(dates, list)


class TestNumerology:
    """Tests for Numerology Calculator"""
    
    def test_life_path_calculation(self):
        from ancient_wisdom import NumerologyCalculator
        
        calculator = NumerologyCalculator()
        
        life_path = calculator.calculate_life_path(date(1990, 5, 15))
        
        assert 1 <= life_path <= 22  # Including master numbers
    
    def test_person_profile(self):
        from ancient_wisdom import NumerologyCalculator
        
        calculator = NumerologyCalculator()
        profile = calculator.calculate_person_profile("Test Person", date(1990, 5, 15))
        
        assert profile.name == "Test Person"
        assert profile.life_path_number is not None
        assert profile.destiny_number is not None
        assert len(profile.lucky_numbers) > 0
    
    def test_property_numerology(self):
        from ancient_wisdom import NumerologyCalculator
        
        calculator = NumerologyCalculator()
        analysis = calculator.analyze_property_number("42 Test Street")
        
        assert analysis.property_number == "42"
        assert 1 <= analysis.reduced_number <= 9
        assert len(analysis.energy) > 0


class TestLandEnergy:
    """Tests for Land Energy Assessor"""
    
    def test_land_energy_assessment(self):
        from ancient_wisdom import LandEnergyAssessor
        
        assessor = LandEnergyAssessor()
        property_data = {
            "id": "TEST-001",
            "width": 15,
            "length": 20
        }
        
        report = assessor.assess_land_energy(property_data)
        
        assert report.property_id == "TEST-001"
        assert 0 <= report.energy_score <= 100
        assert len(report.geopathic_zones) >= 0


# =============================================================================
# CLIMATE & IOT TESTS
# =============================================================================

class TestClimateRisk:
    """Tests for Climate Risk Modeler"""
    
    def test_climate_risk_assessment(self):
        from climate_iot import ClimateRiskModeler, ClimateScenario
        
        modeler = ClimateRiskModeler(ClimateScenario.SSP2_45)
        property_data = {
            "id": "TEST-001",
            "latitude": 19.076,
            "longitude": 72.877,
            "elevation": 15,
            "distance_to_coast": 5
        }
        
        assessment = modeler.assess_property_risk(property_data)
        
        assert assessment.property_id == "TEST-001"
        assert 0 <= assessment.overall_risk_score <= 100
        assert len(assessment.projections) == 4  # 2030, 2050, 2070, 2100
    
    def test_climate_scenarios(self):
        from climate_iot import ClimateScenario
        
        assert ClimateScenario.SSP1_19.temp_rise == 1.5
        assert ClimateScenario.SSP5_85.temp_rise == 4.4


class TestIoTSensors:
    """Tests for IoT Sensor Manager"""
    
    def test_sensor_registration(self):
        from climate_iot import IoTSensorManager, SensorType
        
        manager = IoTSensorManager("TEST-PROP")
        sensor = manager.register_sensor(SensorType.TEMPERATURE, "Main Hall", "Living Room")
        
        assert sensor.sensor_id is not None
        assert sensor.sensor_type == SensorType.TEMPERATURE
        assert sensor.status == "Online"
    
    def test_sensor_reading(self):
        from climate_iot import IoTSensorManager, SensorType
        
        manager = IoTSensorManager("TEST-PROP")
        sensor = manager.register_sensor(SensorType.TEMPERATURE, "Hall", "Living Room")
        
        reading = manager.ingest_reading(sensor.sensor_id, 25.5)
        
        assert reading.value == 25.5
        assert reading.quality in ["Good", "Fair", "Poor"]
    
    def test_comfort_score(self):
        from climate_iot import IoTSensorManager, SensorType
        
        manager = IoTSensorManager("TEST-PROP")
        manager.register_sensor(SensorType.TEMPERATURE, "Hall", "Living Room")
        
        comfort = manager.calculate_comfort_score()
        
        assert "overall_score" in comfort


# =============================================================================
# BLOCKCHAIN TESTS
# =============================================================================

class TestBlockchain:
    """Tests for Blockchain Manager"""
    
    def test_contract_deployment(self):
        from blockchain import BlockchainManager, ContractType
        
        manager = BlockchainManager("polygon")
        contract = manager.deploy_contract(ContractType.NFT_CERTIFICATE, "0x123")
        
        assert contract.contract_id is not None
        assert contract.address.startswith("0x")
        assert contract.network == "polygon"
    
    def test_nft_minting(self):
        from blockchain import BlockchainManager
        
        manager = BlockchainManager("polygon")
        
        nft = manager.mint_property_nft("PROP-001", "0x123", {
            "title": "Test Property",
            "city": "Mumbai"
        })
        
        assert nft.token_id is not None
        assert nft.property_id == "PROP-001"
        assert nft.owner_address == "0x123"
    
    def test_fractional_ownership(self):
        from blockchain import BlockchainManager
        
        manager = BlockchainManager("polygon")
        
        fractional = manager.create_fractional_property("PROP-001", 100, 100000)
        
        assert fractional["total_shares"] == 100
        assert fractional["price_per_share"] == 100000
        
        share = manager.purchase_shares("PROP-001", "0x456", 10, 100000)
        
        assert share.share_percentage == 10.0
        assert share.voting_power == 10.0


# =============================================================================
# AI/ML TESTS
# =============================================================================

class TestAIML:
    """Tests for AI/ML System"""
    
    def test_price_prediction(self):
        from ai_ml import MLPricePrediction
        
        predictor = MLPricePrediction()
        prediction = predictor.predict_price({
            "id": "TEST-001",
            "price": 10000000,
            "location_score": 85
        })
        
        assert prediction.property_id == "TEST-001"
        assert prediction.current_price == 10000000
        assert "1_year" in prediction.predictions
        assert prediction.predictions["1_year"] > prediction.current_price
    
    def test_negotiation_agent(self):
        from ai_ml import AINegotiationAgent
        
        agent = AINegotiationAgent()
        result = agent.analyze_negotiation({
            "id": "TEST-001",
            "price": 10000000,
            "days_on_market": 60
        })
        
        assert result.asking_price == 10000000
        assert result.recommended_offer < result.asking_price
        assert 0 <= result.success_probability <= 1
    
    def test_sentiment_analyzer(self):
        from ai_ml import MarketSentimentAnalyzer
        
        analyzer = MarketSentimentAnalyzer()
        result = analyzer.analyze_sentiment("Mumbai")
        
        assert result.location == "Mumbai"
        assert result.overall_sentiment in ["Bullish", "Neutral", "Bearish"]


# =============================================================================
# AGENT CRM TESTS
# =============================================================================

class TestAgentCRM:
    """Tests for Agent CRM System"""
    
    def test_lead_creation(self):
        from agent_crm import AgentCRM, LeadSource, LeadStatus
        
        crm = AgentCRM("AGENT-001")
        lead = crm.create_lead(
            "Test Customer",
            "test@email.com",
            "+91-9876543210",
            LeadSource.WEBSITE,
            5000000,
            10000000
        )
        
        assert lead.lead_id is not None
        assert lead.name == "Test Customer"
        assert lead.status == LeadStatus.NEW
        assert 0 <= lead.score <= 100
    
    def test_lead_status_update(self):
        from agent_crm import AgentCRM, LeadSource, LeadStatus
        
        crm = AgentCRM("AGENT-001")
        lead = crm.create_lead("Test", "test@email.com", "123", LeadSource.WEBSITE)
        
        updated = crm.update_lead_status(lead.lead_id, LeadStatus.CONTACTED, "Called customer")
        
        assert updated.status == LeadStatus.CONTACTED
        assert len(updated.notes) > 0
    
    def test_pipeline_summary(self):
        from agent_crm import AgentCRM, LeadSource
        
        crm = AgentCRM("AGENT-001")
        crm.create_lead("Test 1", "t1@email.com", "111", LeadSource.WEBSITE)
        crm.create_lead("Test 2", "t2@email.com", "222", LeadSource.REFERRAL)
        
        pipeline = crm.get_pipeline_summary()
        
        assert pipeline["total_leads"] == 2


class TestMessaging:
    """Tests for Messaging System"""
    
    def test_conversation_creation(self):
        from agent_crm import MessagingSystem
        
        messaging = MessagingSystem()
        conv = messaging.create_conversation(["AGENT-001", "CUSTOMER-001"], "PROP-001")
        
        assert conv.conversation_id is not None
        assert len(conv.participants) == 2
    
    def test_message_sending(self):
        from agent_crm import MessagingSystem, MessageType
        
        messaging = MessagingSystem()
        conv = messaging.create_conversation(["AGENT-001", "CUSTOMER-001"])
        
        msg = messaging.send_message(conv.conversation_id, "AGENT-001", "Hello!")
        
        assert msg.message_id is not None
        assert msg.content == "Hello!"
        assert msg.message_type == MessageType.TEXT


class TestCommission:
    """Tests for Commission Calculator"""
    
    def test_commission_calculation(self):
        from agent_crm import CommissionCalculator
        
        calc = CommissionCalculator("standard")
        commission = calc.calculate("PROP-001", 10000000)
        
        assert commission.sale_price == 10000000
        assert commission.gross_commission == 200000  # 2%
        assert commission.agent_amount == 120000  # 60% of gross
        assert commission.net_agent_amount < commission.agent_amount  # After TDS
    
    def test_annual_earnings_estimate(self):
        from agent_crm import CommissionCalculator
        
        calc = CommissionCalculator("standard")
        estimate = calc.estimate_annual_earnings(20000000, 2)
        
        assert estimate["annual_deals"] == 24
        assert estimate["annual_sales_volume"] == 240000000


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
