"""
=============================================================================
SPRINT 17-20: AGENT CRM & PRODUCTION SYSTEM
Dharma Realty - Agent CRM Module
=============================================================================

Lead Management, Real-Time Messaging, Video Consultation, Commission Calculator
"""

from datetime import datetime, timedelta
from typing import Dict, List, Optional, Callable
from dataclasses import dataclass, field
from enum import Enum
import uuid


class LeadStatus(Enum):
    """Lead pipeline stages"""
    NEW = "New"
    CONTACTED = "Contacted"
    QUALIFIED = "Qualified"
    VIEWING_SCHEDULED = "Viewing Scheduled"
    VIEWED = "Viewed"
    NEGOTIATING = "Negotiating"
    OFFER_MADE = "Offer Made"
    CLOSED_WON = "Closed Won"
    CLOSED_LOST = "Closed Lost"


class LeadSource(Enum):
    """Lead acquisition sources"""
    WEBSITE = "Website"
    REFERRAL = "Referral"
    SOCIAL_MEDIA = "Social Media"
    PAID_ADS = "Paid Ads"
    WALK_IN = "Walk In"
    COLD_CALL = "Cold Call"
    PARTNER = "Partner"


class MessageType(Enum):
    """Message types"""
    TEXT = "Text"
    IMAGE = "Image"
    DOCUMENT = "Document"
    PROPERTY_SHARE = "Property Share"
    LOCATION = "Location"
    VOICE = "Voice"


class ConsultationType(Enum):
    """Video consultation types"""
    PROPERTY_TOUR = "Property Tour"
    INITIAL_CONSULTATION = "Initial Consultation"
    NEGOTIATION = "Negotiation"
    DOCUMENT_REVIEW = "Document Review"
    CLOSING = "Closing"


@dataclass
class Lead:
    """Lead/prospect information"""
    lead_id: str
    name: str
    email: str
    phone: str
    source: LeadSource
    status: LeadStatus
    assigned_agent: str
    budget_min: float
    budget_max: float
    preferred_locations: List[str]
    property_requirements: Dict
    score: int  # Lead quality score 0-100
    created_at: datetime
    last_contact: datetime
    notes: List[Dict]
    activities: List[Dict]


@dataclass
class Message:
    """Chat message"""
    message_id: str
    conversation_id: str
    sender_id: str
    sender_type: str  # agent/customer
    message_type: MessageType
    content: str
    metadata: Optional[Dict]
    timestamp: datetime
    read: bool
    delivered: bool


@dataclass
class Conversation:
    """Chat conversation"""
    conversation_id: str
    participants: List[str]
    property_id: Optional[str]
    created_at: datetime
    last_message_at: datetime
    unread_count: int
    messages: List[Message]


@dataclass
class VideoSession:
    """Video consultation session"""
    session_id: str
    consultation_type: ConsultationType
    agent_id: str
    customer_id: str
    property_id: Optional[str]
    scheduled_at: datetime
    duration_minutes: int
    meeting_url: str
    status: str  # scheduled/in-progress/completed/cancelled
    recording_url: Optional[str]
    notes: str


@dataclass
class Commission:
    """Commission calculation"""
    property_id: str
    sale_price: float
    commission_rate: float
    gross_commission: float
    agent_split: float
    broker_split: float
    agent_amount: float
    broker_amount: float
    tax_amount: float
    net_agent_amount: float


@dataclass
class AgentMetrics:
    """Agent performance metrics"""
    agent_id: str
    period: str  # month/quarter/year
    leads_assigned: int
    leads_converted: int
    conversion_rate: float
    total_sales: float
    total_commission: float
    avg_deal_size: float
    avg_days_to_close: int
    customer_rating: float
    properties_listed: int
    viewings_conducted: int


class AgentCRM:
    """
    Complete Agent CRM System
    Implements: Lead management, Pipeline, Activities, Performance tracking
    """
    
    LEAD_SCORE_FACTORS = {
        "budget_match": 20,
        "timeline_urgency": 15,
        "preapproved_finance": 15,
        "clear_requirements": 10,
        "engaged": 15,
        "source_quality": 10,
        "repeat_customer": 15
    }
    
    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.leads: Dict[str, Lead] = {}
        self.activities: List[Dict] = []
    
    def create_lead(self, name: str, email: str, phone: str,
                   source: LeadSource, budget_min: float = 0,
                   budget_max: float = 0,
                   requirements: Dict = None) -> Lead:
        """Create a new lead"""
        
        lead_id = f"LEAD-{len(self.leads) + 1:06d}"
        
        # Calculate initial score
        score = self._calculate_lead_score({
            "budget_min": budget_min,
            "budget_max": budget_max,
            "source": source,
            "requirements": requirements
        })
        
        lead = Lead(
            lead_id=lead_id,
            name=name,
            email=email,
            phone=phone,
            source=source,
            status=LeadStatus.NEW,
            assigned_agent=self.agent_id,
            budget_min=budget_min,
            budget_max=budget_max,
            preferred_locations=[],
            property_requirements=requirements or {},
            score=score,
            created_at=datetime.now(),
            last_contact=datetime.now(),
            notes=[],
            activities=[]
        )
        
        self.leads[lead_id] = lead
        self._log_activity("lead_created", lead_id, {"name": name, "source": source.value})
        
        return lead
    
    def update_lead_status(self, lead_id: str, new_status: LeadStatus,
                          note: str = None) -> Lead:
        """Update lead status"""
        
        if lead_id not in self.leads:
            raise ValueError(f"Lead {lead_id} not found")
        
        lead = self.leads[lead_id]
        old_status = lead.status
        lead.status = new_status
        lead.last_contact = datetime.now()
        
        if note:
            lead.notes.append({
                "date": datetime.now().isoformat(),
                "note": note,
                "status_change": f"{old_status.value} → {new_status.value}"
            })
        
        self._log_activity("status_change", lead_id, {
            "from": old_status.value,
            "to": new_status.value
        })
        
        return lead
    
    def add_lead_activity(self, lead_id: str, activity_type: str,
                         description: str, outcome: str = None) -> Dict:
        """Log an activity for a lead"""
        
        if lead_id not in self.leads:
            raise ValueError(f"Lead {lead_id} not found")
        
        lead = self.leads[lead_id]
        
        activity = {
            "type": activity_type,
            "description": description,
            "outcome": outcome,
            "timestamp": datetime.now().isoformat(),
            "agent": self.agent_id
        }
        
        lead.activities.append(activity)
        lead.last_contact = datetime.now()
        
        # Update score based on engagement
        lead.score = min(100, lead.score + 5)
        
        return activity
    
    def get_pipeline_summary(self) -> Dict:
        """Get pipeline summary by status"""
        
        pipeline = {status.value: [] for status in LeadStatus}
        
        for lead in self.leads.values():
            pipeline[lead.status.value].append({
                "lead_id": lead.lead_id,
                "name": lead.name,
                "budget_max": lead.budget_max,
                "score": lead.score,
                "days_since_contact": (datetime.now() - lead.last_contact).days
            })
        
        summary = {
            "total_leads": len(self.leads),
            "pipeline": pipeline,
            "pipeline_value": sum(l.budget_max for l in self.leads.values()),
            "hot_leads": len([l for l in self.leads.values() if l.score > 70]),
            "stale_leads": len([l for l in self.leads.values() 
                              if (datetime.now() - l.last_contact).days > 7])
        }
        
        return summary
    
    def get_agent_metrics(self, period: str = "month") -> AgentMetrics:
        """Calculate agent performance metrics"""
        
        # Filter leads by period
        if period == "month":
            cutoff = datetime.now() - timedelta(days=30)
        elif period == "quarter":
            cutoff = datetime.now() - timedelta(days=90)
        else:
            cutoff = datetime.now() - timedelta(days=365)
        
        period_leads = [l for l in self.leads.values() if l.created_at >= cutoff]
        closed_leads = [l for l in period_leads if l.status == LeadStatus.CLOSED_WON]
        
        total_sales = sum(l.budget_max for l in closed_leads)
        total_commission = total_sales * 0.02  # Assuming 2% commission
        
        return AgentMetrics(
            agent_id=self.agent_id,
            period=period,
            leads_assigned=len(period_leads),
            leads_converted=len(closed_leads),
            conversion_rate=len(closed_leads) / len(period_leads) * 100 if period_leads else 0,
            total_sales=total_sales,
            total_commission=total_commission,
            avg_deal_size=total_sales / len(closed_leads) if closed_leads else 0,
            avg_days_to_close=30,  # Simplified
            customer_rating=4.5,
            properties_listed=15,
            viewings_conducted=len([a for a in self.activities if a.get("type") == "viewing"])
        )
    
    def _calculate_lead_score(self, data: Dict) -> int:
        """Calculate lead quality score"""
        
        score = 30  # Base score
        
        if data.get("budget_max", 0) > 10000000:
            score += 15
        elif data.get("budget_max", 0) > 5000000:
            score += 10
        
        if data.get("source") in [LeadSource.REFERRAL, LeadSource.WEBSITE]:
            score += 15
        
        if data.get("requirements"):
            score += 10
        
        return min(100, score)
    
    def _log_activity(self, activity_type: str, lead_id: str, data: Dict):
        """Log agent activity"""
        self.activities.append({
            "type": activity_type,
            "lead_id": lead_id,
            "data": data,
            "timestamp": datetime.now().isoformat(),
            "agent_id": self.agent_id
        })


class MessagingSystem:
    """
    Real-Time Messaging System
    Features: Text, Image, Document sharing, Property sharing
    """
    
    def __init__(self):
        self.conversations: Dict[str, Conversation] = {}
        self.message_callbacks: List[Callable] = []
    
    def create_conversation(self, participants: List[str],
                           property_id: str = None) -> Conversation:
        """Create a new conversation"""
        
        conv_id = f"CONV-{uuid.uuid4().hex[:8].upper()}"
        
        conversation = Conversation(
            conversation_id=conv_id,
            participants=participants,
            property_id=property_id,
            created_at=datetime.now(),
            last_message_at=datetime.now(),
            unread_count=0,
            messages=[]
        )
        
        self.conversations[conv_id] = conversation
        return conversation
    
    def send_message(self, conversation_id: str, sender_id: str,
                    content: str, message_type: MessageType = MessageType.TEXT,
                    metadata: Dict = None) -> Message:
        """Send a message"""
        
        if conversation_id not in self.conversations:
            raise ValueError("Conversation not found")
        
        conv = self.conversations[conversation_id]
        
        message_id = f"MSG-{uuid.uuid4().hex[:12].upper()}"
        
        message = Message(
            message_id=message_id,
            conversation_id=conversation_id,
            sender_id=sender_id,
            sender_type="agent" if sender_id.startswith("AGENT") else "customer",
            message_type=message_type,
            content=content,
            metadata=metadata,
            timestamp=datetime.now(),
            read=False,
            delivered=True
        )
        
        conv.messages.append(message)
        conv.last_message_at = datetime.now()
        conv.unread_count += 1
        
        # Notify callbacks
        for callback in self.message_callbacks:
            try:
                callback(message)
            except Exception:
                pass
        
        return message
    
    def share_property(self, conversation_id: str, sender_id: str,
                      property_data: Dict) -> Message:
        """Share a property in conversation"""
        
        metadata = {
            "property_id": property_data.get("id"),
            "title": property_data.get("title"),
            "price": property_data.get("price"),
            "image": property_data.get("image"),
            "url": property_data.get("url")
        }
        
        return self.send_message(
            conversation_id,
            sender_id,
            f"Check out this property: {property_data.get('title')}",
            MessageType.PROPERTY_SHARE,
            metadata
        )
    
    def get_conversation_messages(self, conversation_id: str,
                                  limit: int = 50) -> List[Message]:
        """Get messages from a conversation"""
        
        if conversation_id not in self.conversations:
            return []
        
        return self.conversations[conversation_id].messages[-limit:]
    
    def mark_as_read(self, conversation_id: str, user_id: str):
        """Mark messages as read"""
        
        if conversation_id not in self.conversations:
            return
        
        conv = self.conversations[conversation_id]
        for msg in conv.messages:
            if msg.sender_id != user_id and not msg.read:
                msg.read = True
        conv.unread_count = 0
    
    def get_user_conversations(self, user_id: str) -> List[Conversation]:
        """Get all conversations for a user"""
        return [c for c in self.conversations.values() if user_id in c.participants]
    
    def register_message_callback(self, callback: Callable):
        """Register callback for new messages (WebSocket simulation)"""
        self.message_callbacks.append(callback)


class VideoConsultationSystem:
    """
    Video Consultation System
    Features: Scheduling, Meeting links, Recording management
    """
    
    MEETING_PROVIDERS = ["zoom", "google_meet", "teams"]
    
    def __init__(self, default_provider: str = "zoom"):
        self.provider = default_provider
        self.sessions: Dict[str, VideoSession] = {}
    
    def schedule_consultation(self, consultation_type: ConsultationType,
                             agent_id: str, customer_id: str,
                             scheduled_at: datetime,
                             duration_minutes: int = 30,
                             property_id: str = None) -> VideoSession:
        """Schedule a video consultation"""
        
        session_id = f"VIDEO-{uuid.uuid4().hex[:8].upper()}"
        
        # Generate meeting URL (would integrate with actual provider)
        meeting_url = self._generate_meeting_url(session_id)
        
        session = VideoSession(
            session_id=session_id,
            consultation_type=consultation_type,
            agent_id=agent_id,
            customer_id=customer_id,
            property_id=property_id,
            scheduled_at=scheduled_at,
            duration_minutes=duration_minutes,
            meeting_url=meeting_url,
            status="scheduled",
            recording_url=None,
            notes=""
        )
        
        self.sessions[session_id] = session
        return session
    
    def start_session(self, session_id: str) -> Dict:
        """Start a video session"""
        
        if session_id not in self.sessions:
            return {"error": "Session not found"}
        
        session = self.sessions[session_id]
        session.status = "in-progress"
        
        return {
            "session_id": session_id,
            "meeting_url": session.meeting_url,
            "status": "started"
        }
    
    def end_session(self, session_id: str, notes: str = None) -> Dict:
        """End a video session"""
        
        if session_id not in self.sessions:
            return {"error": "Session not found"}
        
        session = self.sessions[session_id]
        session.status = "completed"
        
        if notes:
            session.notes = notes
        
        # Generate recording URL (simulated)
        session.recording_url = f"https://recordings.dharmarealty.com/{session_id}"
        
        return {
            "session_id": session_id,
            "status": "completed",
            "recording_url": session.recording_url
        }
    
    def get_upcoming_sessions(self, agent_id: str) -> List[VideoSession]:
        """Get upcoming sessions for an agent"""
        now = datetime.now()
        return [
            s for s in self.sessions.values()
            if s.agent_id == agent_id and s.scheduled_at > now and s.status == "scheduled"
        ]
    
    def _generate_meeting_url(self, session_id: str) -> str:
        """Generate meeting URL based on provider"""
        
        if self.provider == "zoom":
            return f"https://zoom.us/j/{session_id.replace('-', '')}"
        elif self.provider == "google_meet":
            return f"https://meet.google.com/{session_id.lower()}"
        else:
            return f"https://meet.dharmarealty.com/{session_id}"


class CommissionCalculator:
    """
    Real Estate Commission Calculator
    Features: Multiple structures, Tax calculations, Split calculations
    """
    
    # Commission structures
    COMMISSION_STRUCTURES = {
        "standard": {"rate": 0.02, "agent_split": 0.60, "broker_split": 0.40},
        "premium": {"rate": 0.025, "agent_split": 0.65, "broker_split": 0.35},
        "luxury": {"rate": 0.015, "agent_split": 0.70, "broker_split": 0.30},
        "new_agent": {"rate": 0.02, "agent_split": 0.50, "broker_split": 0.50}
    }
    
    # Tax rates
    GST_RATE = 0.18
    TDS_RATE = 0.10
    
    def __init__(self, structure: str = "standard"):
        if structure not in self.COMMISSION_STRUCTURES:
            structure = "standard"
        self.structure = self.COMMISSION_STRUCTURES[structure]
    
    def calculate(self, property_id: str, sale_price: float,
                 custom_rate: float = None) -> Commission:
        """Calculate commission for a sale"""
        
        rate = custom_rate if custom_rate else self.structure["rate"]
        
        # Calculate gross commission
        gross = sale_price * rate
        
        # Calculate splits
        agent_split = self.structure["agent_split"]
        broker_split = self.structure["broker_split"]
        
        agent_amount = gross * agent_split
        broker_amount = gross * broker_split
        
        # Calculate taxes (GST on commission)
        tax = gross * self.GST_RATE
        
        # Net agent amount (after TDS)
        tds = agent_amount * self.TDS_RATE
        net_agent = agent_amount - tds
        
        return Commission(
            property_id=property_id,
            sale_price=sale_price,
            commission_rate=rate,
            gross_commission=gross,
            agent_split=agent_split,
            broker_split=broker_split,
            agent_amount=agent_amount,
            broker_amount=broker_amount,
            tax_amount=tax,
            net_agent_amount=net_agent
        )
    
    def estimate_annual_earnings(self, monthly_sales: float,
                                deals_per_month: int = 2) -> Dict:
        """Estimate annual earnings"""
        
        annual_sales = monthly_sales * 12
        annual_deals = deals_per_month * 12
        
        avg_commission = self.calculate("estimate", monthly_sales / deals_per_month)
        
        return {
            "annual_sales_volume": annual_sales,
            "annual_deals": annual_deals,
            "gross_commission": avg_commission.gross_commission * annual_deals,
            "agent_earnings": avg_commission.agent_amount * annual_deals,
            "net_after_tax": avg_commission.net_agent_amount * annual_deals,
            "monthly_average": avg_commission.net_agent_amount * deals_per_month
        }


# =============================================================================
# MODULE INIT
# =============================================================================

__all__ = [
    "AgentCRM",
    "Lead",
    "LeadStatus",
    "LeadSource",
    "AgentMetrics",
    "MessagingSystem",
    "Message",
    "Conversation",
    "MessageType",
    "VideoConsultationSystem",
    "VideoSession",
    "ConsultationType",
    "CommissionCalculator",
    "Commission"
]


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    # CRM
    crm = AgentCRM("AGENT-001")
    
    lead = crm.create_lead(
        "Rajesh Kumar",
        "rajesh@email.com",
        "+91-9876543210",
        LeadSource.WEBSITE,
        budget_min=5000000,
        budget_max=10000000,
        requirements={"bedrooms": 3, "location": "Mumbai"}
    )
    
    print(f"Lead Created: {lead.lead_id} (Score: {lead.score})")
    
    crm.update_lead_status(lead.lead_id, LeadStatus.CONTACTED, "Initial call completed")
    
    pipeline = crm.get_pipeline_summary()
    print(f"Total Leads: {pipeline['total_leads']}")
    print(f"Pipeline Value: ₹{pipeline['pipeline_value']:,.0f}")
    
    # Messaging
    messaging = MessagingSystem()
    conv = messaging.create_conversation(["AGENT-001", "CUSTOMER-001"], "PROP-001")
    
    msg = messaging.send_message(conv.conversation_id, "AGENT-001", "Hello! How can I help you?")
    print(f"\nMessage Sent: {msg.message_id}")
    
    # Commission
    calc = CommissionCalculator("standard")
    commission = calc.calculate("PROP-001", 10000000)
    
    print(f"\nCommission Calculation:")
    print(f"  Sale Price: ₹{commission.sale_price:,.0f}")
    print(f"  Gross Commission: ₹{commission.gross_commission:,.0f}")
    print(f"  Agent Amount: ₹{commission.agent_amount:,.0f}")
    print(f"  Net (after TDS): ₹{commission.net_agent_amount:,.0f}")
