"""
=============================================================================
SPRINT 11-13: BLOCKCHAIN & NFT SYSTEM
Dharma Realty - Blockchain Module
=============================================================================

Smart Contracts, NFT Certificates, Fractional Ownership, DAO Governance
"""

from datetime import datetime
from typing import Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from enum import Enum
import hashlib
import json


class ContractType(Enum):
    """Types of smart contracts"""
    PROPERTY_REGISTRY = "PropertyRegistry"
    FRACTIONAL_OWNERSHIP = "FractionalOwnership"
    ESCROW = "Escrow"
    DAO_GOVERNANCE = "DAOGovernance"
    NFT_CERTIFICATE = "NFTCertificate"


class TransactionType(Enum):
    """Types of blockchain transactions"""
    MINT = "Mint"
    TRANSFER = "Transfer"
    PURCHASE = "Purchase"
    VOTE = "Vote"
    DIVIDEND = "Dividend"
    REGISTRY = "Registry"


class ProposalStatus(Enum):
    """DAO proposal status"""
    PENDING = "Pending"
    ACTIVE = "Active"
    PASSED = "Passed"
    REJECTED = "Rejected"
    EXECUTED = "Executed"


@dataclass
class SmartContract:
    """Deployed smart contract"""
    contract_id: str
    contract_type: ContractType
    address: str
    network: str
    deployed_at: datetime
    deployer: str
    abi: str
    bytecode_hash: str
    verified: bool


@dataclass
class PropertyNFT:
    """NFT Property Certificate"""
    token_id: str
    property_id: str
    contract_address: str
    owner_address: str
    metadata_uri: str
    minted_at: datetime
    attributes: Dict
    transfer_history: List[Dict]


@dataclass
class FractionalShare:
    """Fractional ownership share"""
    share_id: str
    property_id: str
    owner_address: str
    share_percentage: float
    purchase_price: float
    purchase_date: datetime
    dividends_earned: float
    voting_power: float


@dataclass
class DAOProposal:
    """DAO governance proposal"""
    proposal_id: str
    property_id: str
    title: str
    description: str
    proposer: str
    proposal_type: str
    created_at: datetime
    voting_ends: datetime
    status: ProposalStatus
    votes_for: float
    votes_against: float
    quorum_required: float
    execution_data: Optional[Dict]


@dataclass
class Transaction:
    """Blockchain transaction record"""
    tx_hash: str
    tx_type: TransactionType
    from_address: str
    to_address: str
    value: float
    gas_used: int
    timestamp: datetime
    block_number: int
    status: str
    data: Dict


class BlockchainManager:
    """
    Complete Blockchain Management System
    Implements: Smart Contracts, NFTs, Fractional Ownership, DAO
    """
    
    NETWORKS = {
        "polygon": {"chain_id": 137, "name": "Polygon Mainnet"},
        "polygon_mumbai": {"chain_id": 80001, "name": "Polygon Mumbai Testnet"},
        "ethereum": {"chain_id": 1, "name": "Ethereum Mainnet"}
    }
    
    def __init__(self, network: str = "polygon"):
        self.network = network
        self.contracts: Dict[str, SmartContract] = {}
        self.nfts: Dict[str, PropertyNFT] = {}
        self.shares: Dict[str, List[FractionalShare]] = {}
        self.proposals: Dict[str, DAOProposal] = {}
        self.transactions: List[Transaction] = []
        self._nonce = 0
    
    # =========================================================================
    # SMART CONTRACT MANAGEMENT
    # =========================================================================
    
    def deploy_contract(self, contract_type: ContractType, 
                       deployer: str,
                       constructor_args: Dict = None) -> SmartContract:
        """Deploy a new smart contract"""
        
        contract_id = f"CONTRACT-{len(self.contracts) + 1:04d}"
        address = self._generate_address()
        
        # Generate contract-specific ABI
        abi = self._generate_abi(contract_type)
        bytecode_hash = self._hash(f"{contract_type.value}{datetime.now()}")
        
        contract = SmartContract(
            contract_id=contract_id,
            contract_type=contract_type,
            address=address,
            network=self.network,
            deployed_at=datetime.now(),
            deployer=deployer,
            abi=json.dumps(abi),
            bytecode_hash=bytecode_hash,
            verified=False
        )
        
        self.contracts[contract_id] = contract
        
        # Record deployment transaction
        self._record_transaction(
            TransactionType.REGISTRY,
            deployer,
            address,
            0,
            {"action": "deploy", "contract_type": contract_type.value}
        )
        
        return contract
    
    def verify_contract(self, contract_id: str) -> bool:
        """Verify contract on block explorer"""
        if contract_id in self.contracts:
            self.contracts[contract_id].verified = True
            return True
        return False
    
    # =========================================================================
    # NFT PROPERTY CERTIFICATES
    # =========================================================================
    
    def mint_property_nft(self, property_id: str, owner_address: str,
                         property_data: Dict) -> PropertyNFT:
        """Mint NFT certificate for a property"""
        
        token_id = f"NFT-{len(self.nfts) + 1:06d}"
        contract_address = self._get_nft_contract_address()
        
        # Create metadata
        metadata = {
            "name": property_data.get("title", f"Property {property_id}"),
            "description": property_data.get("description", ""),
            "image": property_data.get("image_uri", ""),
            "external_url": f"https://dharmarealty.com/property/{property_id}",
            "attributes": [
                {"trait_type": "Location", "value": property_data.get("city", "")},
                {"trait_type": "Type", "value": property_data.get("type", "")},
                {"trait_type": "Area", "value": property_data.get("area", 0)},
                {"trait_type": "Vastu Score", "value": property_data.get("vastu_score", 0)},
                {"trait_type": "Year Built", "value": property_data.get("year_built", 2024)}
            ]
        }
        
        metadata_uri = f"ipfs://{self._hash(json.dumps(metadata))}"
        
        nft = PropertyNFT(
            token_id=token_id,
            property_id=property_id,
            contract_address=contract_address,
            owner_address=owner_address,
            metadata_uri=metadata_uri,
            minted_at=datetime.now(),
            attributes=metadata["attributes"],
            transfer_history=[{
                "from": "0x0000000000000000000000000000000000000000",
                "to": owner_address,
                "timestamp": datetime.now().isoformat(),
                "type": "mint"
            }]
        )
        
        self.nfts[token_id] = nft
        
        # Record transaction
        self._record_transaction(
            TransactionType.MINT,
            "0x0000000000000000000000000000000000000000",
            owner_address,
            0,
            {"token_id": token_id, "property_id": property_id}
        )
        
        return nft
    
    def transfer_nft(self, token_id: str, from_address: str,
                    to_address: str) -> bool:
        """Transfer NFT to new owner"""
        
        if token_id not in self.nfts:
            return False
        
        nft = self.nfts[token_id]
        if nft.owner_address != from_address:
            return False
        
        # Update ownership
        nft.owner_address = to_address
        nft.transfer_history.append({
            "from": from_address,
            "to": to_address,
            "timestamp": datetime.now().isoformat(),
            "type": "transfer"
        })
        
        # Record transaction
        self._record_transaction(
            TransactionType.TRANSFER,
            from_address,
            to_address,
            0,
            {"token_id": token_id}
        )
        
        return True
    
    def get_nft_by_property(self, property_id: str) -> Optional[PropertyNFT]:
        """Get NFT by property ID"""
        for nft in self.nfts.values():
            if nft.property_id == property_id:
                return nft
        return None
    
    # =========================================================================
    # FRACTIONAL OWNERSHIP
    # =========================================================================
    
    def create_fractional_property(self, property_id: str, 
                                   total_shares: int,
                                   price_per_share: float) -> Dict:
        """Create fractional ownership for a property"""
        
        self.shares[property_id] = []
        
        return {
            "property_id": property_id,
            "total_shares": total_shares,
            "price_per_share": price_per_share,
            "total_value": total_shares * price_per_share,
            "shares_available": total_shares,
            "shares_sold": 0,
            "created_at": datetime.now().isoformat()
        }
    
    def purchase_shares(self, property_id: str, buyer_address: str,
                       num_shares: int, price_per_share: float) -> FractionalShare:
        """Purchase fractional shares"""
        
        if property_id not in self.shares:
            self.shares[property_id] = []
        
        share_id = f"SHARE-{len(self.shares[property_id]) + 1:06d}"
        
        # Calculate percentage (assuming 100 total shares)
        total_shares = 100
        share_percentage = (num_shares / total_shares) * 100
        
        share = FractionalShare(
            share_id=share_id,
            property_id=property_id,
            owner_address=buyer_address,
            share_percentage=share_percentage,
            purchase_price=num_shares * price_per_share,
            purchase_date=datetime.now(),
            dividends_earned=0,
            voting_power=share_percentage
        )
        
        self.shares[property_id].append(share)
        
        # Record transaction
        self._record_transaction(
            TransactionType.PURCHASE,
            buyer_address,
            property_id,
            num_shares * price_per_share,
            {"share_id": share_id, "shares": num_shares}
        )
        
        return share
    
    def distribute_dividends(self, property_id: str, total_amount: float) -> List[Dict]:
        """Distribute dividends to shareholders"""
        
        if property_id not in self.shares:
            return []
        
        distributions = []
        
        for share in self.shares[property_id]:
            dividend = (share.share_percentage / 100) * total_amount
            share.dividends_earned += dividend
            
            distributions.append({
                "share_id": share.share_id,
                "owner": share.owner_address,
                "percentage": share.share_percentage,
                "dividend": dividend
            })
            
            # Record transaction
            self._record_transaction(
                TransactionType.DIVIDEND,
                property_id,
                share.owner_address,
                dividend,
                {"share_id": share.share_id}
            )
        
        return distributions
    
    def get_shareholder_summary(self, property_id: str) -> Dict:
        """Get summary of shareholders for a property"""
        
        if property_id not in self.shares:
            return {"error": "Property not found"}
        
        shares = self.shares[property_id]
        
        return {
            "property_id": property_id,
            "total_shareholders": len(shares),
            "total_percentage_sold": sum(s.share_percentage for s in shares),
            "total_investment": sum(s.purchase_price for s in shares),
            "total_dividends_distributed": sum(s.dividends_earned for s in shares),
            "shareholders": [
                {
                    "address": s.owner_address[:10] + "...",
                    "percentage": s.share_percentage,
                    "voting_power": s.voting_power
                }
                for s in shares
            ]
        }
    
    # =========================================================================
    # DAO GOVERNANCE
    # =========================================================================
    
    def create_proposal(self, property_id: str, proposer: str,
                       title: str, description: str,
                       proposal_type: str,
                       voting_period_days: int = 7) -> DAOProposal:
        """Create a new DAO proposal"""
        
        proposal_id = f"PROP-{len(self.proposals) + 1:04d}"
        
        # Calculate quorum (50% of shares)
        quorum = 50.0
        
        proposal = DAOProposal(
            proposal_id=proposal_id,
            property_id=property_id,
            title=title,
            description=description,
            proposer=proposer,
            proposal_type=proposal_type,
            created_at=datetime.now(),
            voting_ends=datetime.now() + timedelta(days=voting_period_days),
            status=ProposalStatus.ACTIVE,
            votes_for=0,
            votes_against=0,
            quorum_required=quorum,
            execution_data=None
        )
        
        self.proposals[proposal_id] = proposal
        return proposal
    
    def vote_on_proposal(self, proposal_id: str, voter_address: str,
                        vote_for: bool) -> Dict:
        """Vote on a proposal"""
        
        if proposal_id not in self.proposals:
            return {"error": "Proposal not found"}
        
        proposal = self.proposals[proposal_id]
        
        if proposal.status != ProposalStatus.ACTIVE:
            return {"error": "Voting is not active"}
        
        if datetime.now() > proposal.voting_ends:
            return {"error": "Voting period has ended"}
        
        # Get voter's voting power
        voting_power = self._get_voting_power(proposal.property_id, voter_address)
        
        if voting_power == 0:
            return {"error": "No voting power"}
        
        if vote_for:
            proposal.votes_for += voting_power
        else:
            proposal.votes_against += voting_power
        
        # Record vote transaction
        self._record_transaction(
            TransactionType.VOTE,
            voter_address,
            proposal_id,
            0,
            {"vote": "for" if vote_for else "against", "power": voting_power}
        )
        
        return {
            "proposal_id": proposal_id,
            "vote": "for" if vote_for else "against",
            "voting_power": voting_power,
            "current_votes_for": proposal.votes_for,
            "current_votes_against": proposal.votes_against
        }
    
    def finalize_proposal(self, proposal_id: str) -> Dict:
        """Finalize proposal after voting period"""
        
        if proposal_id not in self.proposals:
            return {"error": "Proposal not found"}
        
        proposal = self.proposals[proposal_id]
        
        if datetime.now() < proposal.voting_ends:
            return {"error": "Voting period not ended"}
        
        total_votes = proposal.votes_for + proposal.votes_against
        
        # Check quorum
        if total_votes < proposal.quorum_required:
            proposal.status = ProposalStatus.REJECTED
            return {"status": "Rejected - Quorum not met"}
        
        # Check majority
        if proposal.votes_for > proposal.votes_against:
            proposal.status = ProposalStatus.PASSED
            return {
                "status": "Passed",
                "votes_for": proposal.votes_for,
                "votes_against": proposal.votes_against
            }
        else:
            proposal.status = ProposalStatus.REJECTED
            return {
                "status": "Rejected",
                "votes_for": proposal.votes_for,
                "votes_against": proposal.votes_against
            }
    
    def get_active_proposals(self, property_id: str) -> List[DAOProposal]:
        """Get active proposals for a property"""
        return [
            p for p in self.proposals.values()
            if p.property_id == property_id and p.status == ProposalStatus.ACTIVE
        ]
    
    # =========================================================================
    # TRANSACTION HISTORY
    # =========================================================================
    
    def get_transaction_history(self, address: str = None,
                               property_id: str = None,
                               limit: int = 50) -> List[Transaction]:
        """Get transaction history with optional filters"""
        
        txs = self.transactions
        
        if address:
            txs = [t for t in txs if t.from_address == address or t.to_address == address]
        
        if property_id:
            txs = [t for t in txs if property_id in str(t.data)]
        
        return sorted(txs, key=lambda x: x.timestamp, reverse=True)[:limit]
    
    # =========================================================================
    # HELPER METHODS
    # =========================================================================
    
    def _generate_address(self) -> str:
        """Generate a random Ethereum-style address"""
        import random
        return "0x" + "".join(random.choices("0123456789abcdef", k=40))
    
    def _hash(self, data: str) -> str:
        """Generate hash of data"""
        return hashlib.sha256(data.encode()).hexdigest()
    
    def _generate_abi(self, contract_type: ContractType) -> List[Dict]:
        """Generate ABI for contract type"""
        
        base_abi = [
            {"type": "constructor", "inputs": []},
            {"type": "function", "name": "owner", "inputs": [], "outputs": [{"type": "address"}]}
        ]
        
        if contract_type == ContractType.PROPERTY_REGISTRY:
            base_abi.extend([
                {"type": "function", "name": "registerProperty", "inputs": [{"type": "string"}, {"type": "address"}]},
                {"type": "function", "name": "getProperty", "inputs": [{"type": "string"}], "outputs": [{"type": "tuple"}]}
            ])
        elif contract_type == ContractType.NFT_CERTIFICATE:
            base_abi.extend([
                {"type": "function", "name": "mint", "inputs": [{"type": "address"}, {"type": "string"}]},
                {"type": "function", "name": "transferFrom", "inputs": [{"type": "address"}, {"type": "address"}, {"type": "uint256"}]}
            ])
        
        return base_abi
    
    def _get_nft_contract_address(self) -> str:
        """Get or create NFT contract address"""
        for contract in self.contracts.values():
            if contract.contract_type == ContractType.NFT_CERTIFICATE:
                return contract.address
        
        # Deploy new contract
        contract = self.deploy_contract(ContractType.NFT_CERTIFICATE, "admin")
        return contract.address
    
    def _get_voting_power(self, property_id: str, address: str) -> float:
        """Get voting power for an address"""
        if property_id not in self.shares:
            return 0
        
        for share in self.shares[property_id]:
            if share.owner_address == address:
                return share.voting_power
        return 0
    
    def _record_transaction(self, tx_type: TransactionType, 
                           from_addr: str, to_addr: str,
                           value: float, data: Dict):
        """Record a blockchain transaction"""
        
        self._nonce += 1
        
        tx = Transaction(
            tx_hash="0x" + self._hash(f"{self._nonce}{datetime.now()}")[:64],
            tx_type=tx_type,
            from_address=from_addr,
            to_address=to_addr,
            value=value,
            gas_used=21000 + len(json.dumps(data)) * 68,
            timestamp=datetime.now(),
            block_number=self._nonce * 10,
            status="Success",
            data=data
        )
        
        self.transactions.append(tx)


# Needed import
from datetime import timedelta


# =============================================================================
# USAGE EXAMPLE
# =============================================================================

if __name__ == "__main__":
    manager = BlockchainManager("polygon")
    
    # Mint NFT
    nft = manager.mint_property_nft(
        "PROP-001",
        "0x1234567890abcdef1234567890abcdef12345678",
        {
            "title": "Vastu Villa",
            "city": "Mumbai",
            "type": "Villa",
            "area": 2500,
            "vastu_score": 92
        }
    )
    print(f"Minted NFT: {nft.token_id}")
    
    # Create fractional ownership
    fractional = manager.create_fractional_property("PROP-001", 100, 100000)
    print(f"\nFractional Property: {fractional['total_value']} total value")
    
    # Purchase shares
    share = manager.purchase_shares(
        "PROP-001",
        "0xabcdef1234567890abcdef1234567890abcdef12",
        10,
        100000
    )
    print(f"Purchased: {share.share_percentage}% ownership")
    
    # Create DAO proposal
    proposal = manager.create_proposal(
        "PROP-001",
        "0xabcdef1234567890abcdef1234567890abcdef12",
        "Renovate Common Areas",
        "Proposal to renovate lobby and garden",
        "renovation"
    )
    print(f"\nProposal Created: {proposal.proposal_id}")
    
    # Vote
    vote_result = manager.vote_on_proposal(
        proposal.proposal_id,
        "0xabcdef1234567890abcdef1234567890abcdef12",
        True
    )
    print(f"Voted: {vote_result}")
