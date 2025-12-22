"""
=============================================================================
API ROUTES: AGENT CRM MODULE
Dharma Realty Platform - Sprint 17-20 API
=============================================================================
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import sys
sys.path.append('..')

from agent_crm import (
    AgentCRM, LeadStatus, LeadSource,
    MessagingSystem, MessageType,
    VideoConsultationSystem, ConsultationType,
    CommissionCalculator
)


agent_crm_bp = Blueprint('agent_crm', __name__, url_prefix='/api/crm')

# Store instances (in production, use proper dependency injection/database)
_crm_instances = {}
_messaging = MessagingSystem()
_video = VideoConsultationSystem()
_commission = CommissionCalculator()


def get_crm(agent_id: str) -> AgentCRM:
    if agent_id not in _crm_instances:
        _crm_instances[agent_id] = AgentCRM(agent_id)
    return _crm_instances[agent_id]


# =============================================================================
# LEAD MANAGEMENT ENDPOINTS
# =============================================================================

@agent_crm_bp.route('/leads', methods=['POST'])
def create_lead():
    """Create a new lead"""
    try:
        data = request.get_json()
        
        agent_id = data.get('agent_id', 'AGENT-001')
        name = data.get('name')
        email = data.get('email')
        phone = data.get('phone')
        source_str = data.get('source', 'website')
        budget_min = data.get('budget_min', 0)
        budget_max = data.get('budget_max', 0)
        requirements = data.get('requirements', {})
        
        source_map = {s.value.lower(): s for s in LeadSource}
        source = source_map.get(source_str.lower(), LeadSource.WEBSITE)
        
        crm = get_crm(agent_id)
        lead = crm.create_lead(name, email, phone, source, budget_min, budget_max, requirements)
        
        return jsonify({
            "success": True,
            "data": {
                "lead_id": lead.lead_id,
                "name": lead.name,
                "email": lead.email,
                "status": lead.status.value,
                "score": lead.score,
                "assigned_agent": lead.assigned_agent
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/leads/<agent_id>', methods=['GET'])
def get_leads(agent_id):
    """Get all leads for an agent"""
    try:
        status_filter = request.args.get('status')
        
        crm = get_crm(agent_id)
        leads = list(crm.leads.values())
        
        if status_filter:
            status_map = {s.value.lower(): s for s in LeadStatus}
            status = status_map.get(status_filter.lower())
            if status:
                leads = [l for l in leads if l.status == status]
        
        return jsonify({
            "success": True,
            "data": [{
                "lead_id": l.lead_id,
                "name": l.name,
                "email": l.email,
                "phone": l.phone,
                "status": l.status.value,
                "score": l.score,
                "budget_max": l.budget_max,
                "created_at": l.created_at.isoformat(),
                "last_contact": l.last_contact.isoformat()
            } for l in leads]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/leads/<agent_id>/<lead_id>', methods=['PUT'])
def update_lead_status(agent_id, lead_id):
    """Update lead status"""
    try:
        data = request.get_json()
        new_status_str = data.get('status')
        note = data.get('note')
        
        status_map = {s.value.lower(): s for s in LeadStatus}
        new_status = status_map.get(new_status_str.lower())
        
        if not new_status:
            return jsonify({"success": False, "error": "Invalid status"}), 400
        
        crm = get_crm(agent_id)
        lead = crm.update_lead_status(lead_id, new_status, note)
        
        return jsonify({
            "success": True,
            "data": {
                "lead_id": lead.lead_id,
                "status": lead.status.value,
                "last_contact": lead.last_contact.isoformat()
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/leads/<agent_id>/<lead_id>/activity', methods=['POST'])
def add_activity(agent_id, lead_id):
    """Add activity to a lead"""
    try:
        data = request.get_json()
        
        activity_type = data.get('type')
        description = data.get('description')
        outcome = data.get('outcome')
        
        crm = get_crm(agent_id)
        activity = crm.add_lead_activity(lead_id, activity_type, description, outcome)
        
        return jsonify({"success": True, "data": activity})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/pipeline/<agent_id>', methods=['GET'])
def get_pipeline(agent_id):
    """Get pipeline summary"""
    try:
        crm = get_crm(agent_id)
        summary = crm.get_pipeline_summary()
        
        return jsonify({"success": True, "data": summary})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/metrics/<agent_id>', methods=['GET'])
def get_agent_metrics(agent_id):
    """Get agent performance metrics"""
    try:
        period = request.args.get('period', 'month')
        
        crm = get_crm(agent_id)
        metrics = crm.get_agent_metrics(period)
        
        return jsonify({
            "success": True,
            "data": {
                "agent_id": metrics.agent_id,
                "period": metrics.period,
                "leads_assigned": metrics.leads_assigned,
                "leads_converted": metrics.leads_converted,
                "conversion_rate": metrics.conversion_rate,
                "total_sales": metrics.total_sales,
                "total_commission": metrics.total_commission,
                "avg_deal_size": metrics.avg_deal_size,
                "customer_rating": metrics.customer_rating
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# MESSAGING ENDPOINTS
# =============================================================================

@agent_crm_bp.route('/conversations', methods=['POST'])
def create_conversation():
    """Create a new conversation"""
    try:
        data = request.get_json()
        
        participants = data.get('participants', [])
        property_id = data.get('property_id')
        
        conv = _messaging.create_conversation(participants, property_id)
        
        return jsonify({
            "success": True,
            "data": {
                "conversation_id": conv.conversation_id,
                "participants": conv.participants,
                "property_id": conv.property_id,
                "created_at": conv.created_at.isoformat()
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/messages', methods=['POST'])
def send_message():
    """Send a message"""
    try:
        data = request.get_json()
        
        conversation_id = data.get('conversation_id')
        sender_id = data.get('sender_id')
        content = data.get('content')
        message_type = data.get('message_type', 'text')
        
        type_map = {t.value.lower(): t for t in MessageType}
        msg_type = type_map.get(message_type.lower(), MessageType.TEXT)
        
        message = _messaging.send_message(conversation_id, sender_id, content, msg_type)
        
        return jsonify({
            "success": True,
            "data": {
                "message_id": message.message_id,
                "conversation_id": message.conversation_id,
                "sender_id": message.sender_id,
                "content": message.content,
                "timestamp": message.timestamp.isoformat()
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/messages/<conversation_id>', methods=['GET'])
def get_messages(conversation_id):
    """Get messages from a conversation"""
    try:
        limit = int(request.args.get('limit', 50))
        
        messages = _messaging.get_conversation_messages(conversation_id, limit)
        
        return jsonify({
            "success": True,
            "data": [{
                "message_id": m.message_id,
                "sender_id": m.sender_id,
                "sender_type": m.sender_type,
                "content": m.content,
                "message_type": m.message_type.value,
                "timestamp": m.timestamp.isoformat(),
                "read": m.read
            } for m in messages]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/conversations/<user_id>', methods=['GET'])
def get_user_conversations(user_id):
    """Get all conversations for a user"""
    try:
        conversations = _messaging.get_user_conversations(user_id)
        
        return jsonify({
            "success": True,
            "data": [{
                "conversation_id": c.conversation_id,
                "participants": c.participants,
                "property_id": c.property_id,
                "last_message_at": c.last_message_at.isoformat(),
                "unread_count": c.unread_count
            } for c in conversations]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/messages/share-property', methods=['POST'])
def share_property():
    """Share property in conversation"""
    try:
        data = request.get_json()
        
        conversation_id = data.get('conversation_id')
        sender_id = data.get('sender_id')
        property_data = data.get('property')
        
        message = _messaging.share_property(conversation_id, sender_id, property_data)
        
        return jsonify({
            "success": True,
            "data": {
                "message_id": message.message_id,
                "content": message.content,
                "metadata": message.metadata
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


# =============================================================================
# VIDEO CONSULTATION ENDPOINTS
# =============================================================================

@agent_crm_bp.route('/video/schedule', methods=['POST'])
def schedule_video():
    """Schedule a video consultation"""
    try:
        data = request.get_json()
        
        consultation_type_str = data.get('consultation_type', 'initial_consultation')
        agent_id = data.get('agent_id')
        customer_id = data.get('customer_id')
        scheduled_at_str = data.get('scheduled_at')
        duration = data.get('duration_minutes', 30)
        property_id = data.get('property_id')
        
        type_map = {
            "property_tour": ConsultationType.PROPERTY_TOUR,
            "initial_consultation": ConsultationType.INITIAL_CONSULTATION,
            "negotiation": ConsultationType.NEGOTIATION,
            "document_review": ConsultationType.DOCUMENT_REVIEW,
            "closing": ConsultationType.CLOSING
        }
        consultation_type = type_map.get(consultation_type_str.lower(), ConsultationType.INITIAL_CONSULTATION)
        
        scheduled_at = datetime.fromisoformat(scheduled_at_str)
        
        session = _video.schedule_consultation(
            consultation_type, agent_id, customer_id,
            scheduled_at, duration, property_id
        )
        
        return jsonify({
            "success": True,
            "data": {
                "session_id": session.session_id,
                "consultation_type": session.consultation_type.value,
                "scheduled_at": session.scheduled_at.isoformat(),
                "duration_minutes": session.duration_minutes,
                "meeting_url": session.meeting_url,
                "status": session.status
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/video/<session_id>/start', methods=['POST'])
def start_video_session(session_id):
    """Start a video session"""
    result = _video.start_session(session_id)
    return jsonify({"success": True, "data": result})


@agent_crm_bp.route('/video/<session_id>/end', methods=['POST'])
def end_video_session(session_id):
    """End a video session"""
    data = request.get_json() or {}
    notes = data.get('notes')
    
    result = _video.end_session(session_id, notes)
    return jsonify({"success": True, "data": result})


@agent_crm_bp.route('/video/upcoming/<agent_id>', methods=['GET'])
def get_upcoming_sessions(agent_id):
    """Get upcoming video sessions for an agent"""
    sessions = _video.get_upcoming_sessions(agent_id)
    
    return jsonify({
        "success": True,
        "data": [{
            "session_id": s.session_id,
            "consultation_type": s.consultation_type.value,
            "customer_id": s.customer_id,
            "scheduled_at": s.scheduled_at.isoformat(),
            "meeting_url": s.meeting_url
        } for s in sessions]
    })


# =============================================================================
# COMMISSION ENDPOINTS
# =============================================================================

@agent_crm_bp.route('/commission/calculate', methods=['POST'])
def calculate_commission():
    """Calculate commission for a sale"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        sale_price = data.get('sale_price')
        structure = data.get('structure', 'standard')
        custom_rate = data.get('custom_rate')
        
        calc = CommissionCalculator(structure)
        commission = calc.calculate(property_id, sale_price, custom_rate)
        
        return jsonify({
            "success": True,
            "data": {
                "property_id": commission.property_id,
                "sale_price": commission.sale_price,
                "commission_rate": commission.commission_rate,
                "gross_commission": commission.gross_commission,
                "agent_split": commission.agent_split,
                "broker_split": commission.broker_split,
                "agent_amount": commission.agent_amount,
                "broker_amount": commission.broker_amount,
                "tax_amount": commission.tax_amount,
                "net_agent_amount": commission.net_agent_amount
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@agent_crm_bp.route('/commission/estimate', methods=['POST'])
def estimate_annual_earnings():
    """Estimate annual earnings"""
    try:
        data = request.get_json()
        
        monthly_sales = data.get('monthly_sales')
        deals_per_month = data.get('deals_per_month', 2)
        structure = data.get('structure', 'standard')
        
        calc = CommissionCalculator(structure)
        estimate = calc.estimate_annual_earnings(monthly_sales, deals_per_month)
        
        return jsonify({"success": True, "data": estimate})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


def register_routes(app):
    """Register all Agent CRM routes with Flask app"""
    app.register_blueprint(agent_crm_bp)
    return app
