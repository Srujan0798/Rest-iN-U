"""
=============================================================================
API ROUTES: BLOCKCHAIN MODULE
Dharma Realty Platform - Sprint 11-13 API
=============================================================================
"""

from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import sys
sys.path.append('..')

from blockchain import (
    BlockchainManager, ContractType, TransactionType, ProposalStatus
)


blockchain_bp = Blueprint('blockchain', __name__, url_prefix='/api/blockchain')

# Global blockchain manager (in production, use database)
_blockchain_manager = BlockchainManager("polygon")


# =============================================================================
# SMART CONTRACT ENDPOINTS
# =============================================================================

@blockchain_bp.route('/contracts', methods=['POST'])
def deploy_contract():
    """Deploy a new smart contract"""
    try:
        data = request.get_json()
        
        contract_type_str = data.get('contract_type')
        deployer = data.get('deployer_address')
        
        type_map = {
            "property_registry": ContractType.PROPERTY_REGISTRY,
            "fractional_ownership": ContractType.FRACTIONAL_OWNERSHIP,
            "escrow": ContractType.ESCROW,
            "dao_governance": ContractType.DAO_GOVERNANCE,
            "nft_certificate": ContractType.NFT_CERTIFICATE
        }
        
        contract_type = type_map.get(contract_type_str.lower())
        if not contract_type:
            return jsonify({"success": False, "error": "Invalid contract type"}), 400
        
        contract = _blockchain_manager.deploy_contract(contract_type, deployer)
        
        return jsonify({
            "success": True,
            "data": {
                "contract_id": contract.contract_id,
                "contract_type": contract.contract_type.value,
                "address": contract.address,
                "network": contract.network,
                "deployed_at": contract.deployed_at.isoformat(),
                "verified": contract.verified
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/contracts', methods=['GET'])
def get_contracts():
    """Get all deployed contracts"""
    contracts = [{
        "contract_id": c.contract_id,
        "contract_type": c.contract_type.value,
        "address": c.address,
        "network": c.network,
        "verified": c.verified
    } for c in _blockchain_manager.contracts.values()]
    
    return jsonify({"success": True, "data": contracts})


# =============================================================================
# NFT ENDPOINTS
# =============================================================================

@blockchain_bp.route('/nft/mint', methods=['POST'])
def mint_nft():
    """Mint NFT certificate for a property"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        owner_address = data.get('owner_address')
        property_data = data.get('property_data', {})
        
        if not property_id or not owner_address:
            return jsonify({"success": False, "error": "property_id and owner_address required"}), 400
        
        nft = _blockchain_manager.mint_property_nft(property_id, owner_address, property_data)
        
        return jsonify({
            "success": True,
            "data": {
                "token_id": nft.token_id,
                "property_id": nft.property_id,
                "contract_address": nft.contract_address,
                "owner_address": nft.owner_address,
                "metadata_uri": nft.metadata_uri,
                "minted_at": nft.minted_at.isoformat(),
                "attributes": nft.attributes
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/nft/transfer', methods=['POST'])
def transfer_nft():
    """Transfer NFT to new owner"""
    try:
        data = request.get_json()
        
        token_id = data.get('token_id')
        from_address = data.get('from_address')
        to_address = data.get('to_address')
        
        success = _blockchain_manager.transfer_nft(token_id, from_address, to_address)
        
        if success:
            return jsonify({"success": True, "message": "NFT transferred successfully"})
        else:
            return jsonify({"success": False, "error": "Transfer failed"}), 400
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/nft/<token_id>', methods=['GET'])
def get_nft(token_id):
    """Get NFT details"""
    nft = _blockchain_manager.nfts.get(token_id)
    
    if not nft:
        return jsonify({"success": False, "error": "NFT not found"}), 404
    
    return jsonify({
        "success": True,
        "data": {
            "token_id": nft.token_id,
            "property_id": nft.property_id,
            "owner_address": nft.owner_address,
            "metadata_uri": nft.metadata_uri,
            "transfer_history": nft.transfer_history
        }
    })


@blockchain_bp.route('/nft/property/<property_id>', methods=['GET'])
def get_nft_by_property(property_id):
    """Get NFT by property ID"""
    nft = _blockchain_manager.get_nft_by_property(property_id)
    
    if not nft:
        return jsonify({"success": False, "error": "NFT not found for property"}), 404
    
    return jsonify({
        "success": True,
        "data": {
            "token_id": nft.token_id,
            "owner_address": nft.owner_address,
            "metadata_uri": nft.metadata_uri
        }
    })


# =============================================================================
# FRACTIONAL OWNERSHIP ENDPOINTS
# =============================================================================

@blockchain_bp.route('/fractional/create', methods=['POST'])
def create_fractional_property():
    """Create fractional ownership for a property"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        total_shares = data.get('total_shares', 100)
        price_per_share = data.get('price_per_share')
        
        result = _blockchain_manager.create_fractional_property(
            property_id, total_shares, price_per_share
        )
        
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/fractional/purchase', methods=['POST'])
def purchase_shares():
    """Purchase fractional shares"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        buyer_address = data.get('buyer_address')
        num_shares = data.get('num_shares')
        price_per_share = data.get('price_per_share')
        
        share = _blockchain_manager.purchase_shares(
            property_id, buyer_address, num_shares, price_per_share
        )
        
        return jsonify({
            "success": True,
            "data": {
                "share_id": share.share_id,
                "property_id": share.property_id,
                "owner_address": share.owner_address,
                "share_percentage": share.share_percentage,
                "purchase_price": share.purchase_price,
                "voting_power": share.voting_power
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/fractional/dividends', methods=['POST'])
def distribute_dividends():
    """Distribute dividends to shareholders"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        total_amount = data.get('total_amount')
        
        distributions = _blockchain_manager.distribute_dividends(property_id, total_amount)
        
        return jsonify({
            "success": True,
            "data": {
                "distributions": distributions,
                "total_distributed": total_amount
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/fractional/<property_id>', methods=['GET'])
def get_shareholder_summary(property_id):
    """Get shareholder summary for a property"""
    summary = _blockchain_manager.get_shareholder_summary(property_id)
    
    return jsonify({"success": True, "data": summary})


# =============================================================================
# DAO GOVERNANCE ENDPOINTS
# =============================================================================

@blockchain_bp.route('/dao/proposals', methods=['POST'])
def create_proposal():
    """Create a new DAO proposal"""
    try:
        data = request.get_json()
        
        property_id = data.get('property_id')
        proposer = data.get('proposer_address')
        title = data.get('title')
        description = data.get('description')
        proposal_type = data.get('proposal_type')
        voting_days = data.get('voting_period_days', 7)
        
        proposal = _blockchain_manager.create_proposal(
            property_id, proposer, title, description, proposal_type, voting_days
        )
        
        return jsonify({
            "success": True,
            "data": {
                "proposal_id": proposal.proposal_id,
                "property_id": proposal.property_id,
                "title": proposal.title,
                "status": proposal.status.value,
                "voting_ends": proposal.voting_ends.isoformat(),
                "quorum_required": proposal.quorum_required
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/dao/vote', methods=['POST'])
def vote_on_proposal():
    """Vote on a proposal"""
    try:
        data = request.get_json()
        
        proposal_id = data.get('proposal_id')
        voter_address = data.get('voter_address')
        vote_for = data.get('vote_for', True)
        
        result = _blockchain_manager.vote_on_proposal(proposal_id, voter_address, vote_for)
        
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@blockchain_bp.route('/dao/proposals/<property_id>', methods=['GET'])
def get_active_proposals(property_id):
    """Get active proposals for a property"""
    proposals = _blockchain_manager.get_active_proposals(property_id)
    
    return jsonify({
        "success": True,
        "data": [{
            "proposal_id": p.proposal_id,
            "title": p.title,
            "description": p.description,
            "status": p.status.value,
            "votes_for": p.votes_for,
            "votes_against": p.votes_against,
            "voting_ends": p.voting_ends.isoformat()
        } for p in proposals]
    })


@blockchain_bp.route('/dao/finalize/<proposal_id>', methods=['POST'])
def finalize_proposal(proposal_id):
    """Finalize a proposal after voting period"""
    result = _blockchain_manager.finalize_proposal(proposal_id)
    
    return jsonify({"success": True, "data": result})


# =============================================================================
# TRANSACTION HISTORY ENDPOINTS
# =============================================================================

@blockchain_bp.route('/transactions', methods=['GET'])
def get_transactions():
    """Get transaction history"""
    address = request.args.get('address')
    property_id = request.args.get('property_id')
    limit = int(request.args.get('limit', 50))
    
    transactions = _blockchain_manager.get_transaction_history(address, property_id, limit)
    
    return jsonify({
        "success": True,
        "data": [{
            "tx_hash": tx.tx_hash,
            "tx_type": tx.tx_type.value,
            "from_address": tx.from_address,
            "to_address": tx.to_address,
            "value": tx.value,
            "gas_used": tx.gas_used,
            "timestamp": tx.timestamp.isoformat(),
            "status": tx.status
        } for tx in transactions]
    })


def register_routes(app):
    """Register all blockchain routes with Flask app"""
    app.register_blueprint(blockchain_bp)
    return app
