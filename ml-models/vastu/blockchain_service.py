# ml-models/vastu/blockchain_service.py
from web3 import Web3
from datetime import datetime
import json
import os

class BlockchainService:
    def __init__(self):
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('ETHEREUM_RPC_URL')))
        self.contract_address = os.getenv('VASTU_CONTRACT_ADDRESS')
        
        # Load contract ABI
        # Mocking ABI loading if file doesn't exist
        try:
            with open('contracts/VastuRegistry.json', 'r') as f:
                contract_json = json.load(f)
                self.contract = self.w3.eth.contract(
                    address=self.contract_address,
                    abi=contract_json['abi']
                )
        except FileNotFoundError:
            print("Warning: VastuRegistry.json not found. Blockchain service running in mock mode.")
            self.contract = None
        
        self.platform_account = os.getenv('PLATFORM_WALLET_ADDRESS')
        self.platform_key = os.getenv('PLATFORM_PRIVATE_KEY')
    
    async def record_vastu_analysis(
        self,
        property_id: str,
        analysis_id: str,
        score: int,
        grade: str,
        timestamp: datetime
    ) -> str:
        """Record Vastu analysis on blockchain"""
        
        if not self.contract:
            print("Mocking blockchain transaction...")
            return "0x" + "0" * 64
            
        try:
            # Prepare transaction
            tx = self.contract.functions.recordVastuAnalysis(
                property_id,
                analysis_id,
                score,
                grade,
                int(timestamp.timestamp())
            ).buildTransaction({
                'from': self.platform_account,
                'nonce': self.w3.eth.get_transaction_count(self.platform_account),
                'gas': 200000,
                'gasPrice': self.w3.eth.gas_price
            })
            
            # Sign transaction
            signed_tx = self.w3.eth.account.sign_transaction(tx, self.platform_key)
            
            # Send transaction
            tx_hash = self.w3.eth.send_raw_transaction(signed_tx.rawTransaction)
            
            # Wait for confirmation
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            return receipt.transactionHash.hex()
            
        except Exception as e:
            print(f"Blockchain recording failed: {str(e)}")
            raise
