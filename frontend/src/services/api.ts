/**
 * =============================================================================
 * DHARMA REALTY PLATFORM - API SERVICE LAYER
 * TypeScript API Client for All Sprint Modules
 * =============================================================================
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// =============================================================================
// API CLIENT
// =============================================================================

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

async function apiCall<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}


// =============================================================================
// ANCIENT WISDOM API
// =============================================================================

export const AncientWisdomAPI = {
    // Feng Shui
    analyzeFengShui: (propertyData: any) =>
        apiCall('/api/ancient-wisdom/feng-shui/analyze', 'POST', propertyData),

    getDirections: () =>
        apiCall('/api/ancient-wisdom/feng-shui/directions'),

    // Vedic Astrology
    getPanchang: (date?: string) =>
        apiCall(`/api/ancient-wisdom/astrology/panchang${date ? `?date=${date}` : ''}`),

    getGrihaPraveshDates: (months: number = 3) =>
        apiCall(`/api/ancient-wisdom/astrology/griha-pravesh?months=${months}`),

    getPurchaseDates: (months: number = 3) =>
        apiCall(`/api/ancient-wisdom/astrology/purchase-dates?months=${months}`),

    // Numerology
    calculateNumerologyProfile: (name: string, birthDate: string, system?: string) =>
        apiCall('/api/ancient-wisdom/numerology/profile', 'POST', { name, birth_date: birthDate, system }),

    analyzePropertyNumerology: (address: string) =>
        apiCall('/api/ancient-wisdom/numerology/property', 'POST', { address }),

    calculateCompatibility: (name: string, birthDate: string, address: string) =>
        apiCall('/api/ancient-wisdom/numerology/compatibility', 'POST', { name, birth_date: birthDate, address }),

    // Land Energy
    assessLandEnergy: (propertyData: any) =>
        apiCall('/api/ancient-wisdom/land-energy/assess', 'POST', propertyData),

    // Complete Analysis
    getCompleteAncientWisdomAnalysis: (property: any, owner: any) =>
        apiCall('/api/ancient-wisdom/complete-analysis', 'POST', { property, owner }),
};


// =============================================================================
// CLIMATE & IOT API
// =============================================================================

export const ClimateIoTAPI = {
    // Climate Risk
    assessClimateRisk: (propertyData: any, scenario?: string) =>
        apiCall('/api/climate-iot/climate-risk/assess', 'POST', { ...propertyData, scenario }),

    getClimateScenarios: () =>
        apiCall('/api/climate-iot/climate-risk/scenarios'),

    // IoT Sensors
    registerSensor: (propertyId: string, sensorType: string, location: string, room: string) =>
        apiCall('/api/climate-iot/iot/sensors', 'POST', { property_id: propertyId, sensor_type: sensorType, location, room }),

    getSensors: (propertyId: string) =>
        apiCall(`/api/climate-iot/iot/sensors/${propertyId}`),

    ingestReading: (propertyId: string, sensorId: string, value: number) =>
        apiCall('/api/climate-iot/iot/readings', 'POST', { property_id: propertyId, sensor_id: sensorId, value }),

    getCurrentReadings: (propertyId: string) =>
        apiCall(`/api/climate-iot/iot/readings/${propertyId}`),

    getAlerts: (propertyId: string) =>
        apiCall(`/api/climate-iot/iot/alerts/${propertyId}`),

    getComfortScore: (propertyId: string) =>
        apiCall(`/api/climate-iot/iot/comfort/${propertyId}`),

    getNetworkStatus: (propertyId: string) =>
        apiCall(`/api/climate-iot/iot/network/${propertyId}`),
};


// =============================================================================
// BLOCKCHAIN API
// =============================================================================

export const BlockchainAPI = {
    // Contracts
    deployContract: (contractType: string, deployerAddress: string) =>
        apiCall('/api/blockchain/contracts', 'POST', { contract_type: contractType, deployer_address: deployerAddress }),

    getContracts: () =>
        apiCall('/api/blockchain/contracts'),

    // NFTs
    mintNFT: (propertyId: string, ownerAddress: string, propertyData: any) =>
        apiCall('/api/blockchain/nft/mint', 'POST', { property_id: propertyId, owner_address: ownerAddress, property_data: propertyData }),

    transferNFT: (tokenId: string, fromAddress: string, toAddress: string) =>
        apiCall('/api/blockchain/nft/transfer', 'POST', { token_id: tokenId, from_address: fromAddress, to_address: toAddress }),

    getNFT: (tokenId: string) =>
        apiCall(`/api/blockchain/nft/${tokenId}`),

    getNFTByProperty: (propertyId: string) =>
        apiCall(`/api/blockchain/nft/property/${propertyId}`),

    // Fractional Ownership
    createFractionalProperty: (propertyId: string, totalShares: number, pricePerShare: number) =>
        apiCall('/api/blockchain/fractional/create', 'POST', { property_id: propertyId, total_shares: totalShares, price_per_share: pricePerShare }),

    purchaseShares: (propertyId: string, buyerAddress: string, numShares: number, pricePerShare: number) =>
        apiCall('/api/blockchain/fractional/purchase', 'POST', { property_id: propertyId, buyer_address: buyerAddress, num_shares: numShares, price_per_share: pricePerShare }),

    distributeDividends: (propertyId: string, totalAmount: number) =>
        apiCall('/api/blockchain/fractional/dividends', 'POST', { property_id: propertyId, total_amount: totalAmount }),

    getShareholderSummary: (propertyId: string) =>
        apiCall(`/api/blockchain/fractional/${propertyId}`),

    // DAO
    createProposal: (propertyId: string, proposerAddress: string, title: string, description: string, proposalType: string) =>
        apiCall('/api/blockchain/dao/proposals', 'POST', { property_id: propertyId, proposer_address: proposerAddress, title, description, proposal_type: proposalType }),

    voteOnProposal: (proposalId: string, voterAddress: string, voteFor: boolean) =>
        apiCall('/api/blockchain/dao/vote', 'POST', { proposal_id: proposalId, voter_address: voterAddress, vote_for: voteFor }),

    getActiveProposals: (propertyId: string) =>
        apiCall(`/api/blockchain/dao/proposals/${propertyId}`),

    finalizeProposal: (proposalId: string) =>
        apiCall(`/api/blockchain/dao/finalize/${proposalId}`, 'POST'),

    // Transactions
    getTransactions: (address?: string, propertyId?: string, limit?: number) => {
        const params = new URLSearchParams();
        if (address) params.append('address', address);
        if (propertyId) params.append('property_id', propertyId);
        if (limit) params.append('limit', limit.toString());
        return apiCall(`/api/blockchain/transactions?${params.toString()}`);
    },
};


// =============================================================================
// AI/ML API
// =============================================================================

export const AIMLAPI = {
    // Price Prediction
    predictPrice: (propertyData: any, marketData?: any) =>
        apiCall('/api/ai-ml/price-prediction', 'POST', { ...propertyData, market_data: marketData }),

    batchPredictPrices: (properties: any[]) =>
        apiCall('/api/ai-ml/price-prediction/batch', 'POST', { properties }),

    // Property Inspection
    inspectProperty: (propertyId: string, images: any[]) =>
        apiCall('/api/ai-ml/inspect', 'POST', { property_id: propertyId, images }),

    // Negotiation
    analyzeNegotiation: (propertyData: any, buyerProfile?: any) =>
        apiCall('/api/ai-ml/negotiation/analyze', 'POST', { ...propertyData, buyer_profile: buyerProfile }),

    getCounterOffer: (property: any, currentOffer: number, rejectionReason?: string) =>
        apiCall('/api/ai-ml/negotiation/counter-offer', 'POST', { property, current_offer: currentOffer, rejection_reason: rejectionReason }),

    // Sentiment
    getMarketSentiment: (location: string, propertyType?: string) =>
        apiCall(`/api/ai-ml/sentiment/${location}${propertyType ? `?property_type=${propertyType}` : ''}`),

    compareSentiments: (locations: string[]) =>
        apiCall('/api/ai-ml/sentiment/compare', 'POST', { locations }),

    // Complete Analysis
    getCompleteAIAnalysis: (property: any, images?: any[], buyerProfile?: any) =>
        apiCall('/api/ai-ml/complete-analysis', 'POST', { property, images, buyer_profile: buyerProfile }),
};


// =============================================================================
// AGENT CRM API
// =============================================================================

export const AgentCRMAPI = {
    // Leads
    createLead: (agentId: string, leadData: any) =>
        apiCall('/api/crm/leads', 'POST', { agent_id: agentId, ...leadData }),

    getLeads: (agentId: string, status?: string) =>
        apiCall(`/api/crm/leads/${agentId}${status ? `?status=${status}` : ''}`),

    updateLeadStatus: (agentId: string, leadId: string, status: string, note?: string) =>
        apiCall(`/api/crm/leads/${agentId}/${leadId}`, 'PUT', { status, note }),

    addLeadActivity: (agentId: string, leadId: string, type: string, description: string, outcome?: string) =>
        apiCall(`/api/crm/leads/${agentId}/${leadId}/activity`, 'POST', { type, description, outcome }),

    getPipeline: (agentId: string) =>
        apiCall(`/api/crm/pipeline/${agentId}`),

    getAgentMetrics: (agentId: string, period?: string) =>
        apiCall(`/api/crm/metrics/${agentId}${period ? `?period=${period}` : ''}`),

    // Messaging
    createConversation: (participants: string[], propertyId?: string) =>
        apiCall('/api/crm/conversations', 'POST', { participants, property_id: propertyId }),

    sendMessage: (conversationId: string, senderId: string, content: string, messageType?: string) =>
        apiCall('/api/crm/messages', 'POST', { conversation_id: conversationId, sender_id: senderId, content, message_type: messageType }),

    getMessages: (conversationId: string, limit?: number) =>
        apiCall(`/api/crm/messages/${conversationId}${limit ? `?limit=${limit}` : ''}`),

    getUserConversations: (userId: string) =>
        apiCall(`/api/crm/conversations/${userId}`),

    shareProperty: (conversationId: string, senderId: string, property: any) =>
        apiCall('/api/crm/messages/share-property', 'POST', { conversation_id: conversationId, sender_id: senderId, property }),

    // Video Consultation
    scheduleVideoCall: (consultationType: string, agentId: string, customerId: string, scheduledAt: string, durationMinutes?: number, propertyId?: string) =>
        apiCall('/api/crm/video/schedule', 'POST', { consultation_type: consultationType, agent_id: agentId, customer_id: customerId, scheduled_at: scheduledAt, duration_minutes: durationMinutes, property_id: propertyId }),

    startVideoSession: (sessionId: string) =>
        apiCall(`/api/crm/video/${sessionId}/start`, 'POST'),

    endVideoSession: (sessionId: string, notes?: string) =>
        apiCall(`/api/crm/video/${sessionId}/end`, 'POST', { notes }),

    getUpcomingVideoSessions: (agentId: string) =>
        apiCall(`/api/crm/video/upcoming/${agentId}`),

    // Commission
    calculateCommission: (propertyId: string, salePrice: number, structure?: string, customRate?: number) =>
        apiCall('/api/crm/commission/calculate', 'POST', { property_id: propertyId, sale_price: salePrice, structure, custom_rate: customRate }),

    estimateAnnualEarnings: (monthlySales: number, dealsPerMonth?: number, structure?: string) =>
        apiCall('/api/crm/commission/estimate', 'POST', { monthly_sales: monthlySales, deals_per_month: dealsPerMonth, structure }),
};


// =============================================================================
// UNIFIED API EXPORTS
// =============================================================================

export const DharmaRealtyAPI = {
    ancientWisdom: AncientWisdomAPI,
    climateIoT: ClimateIoTAPI,
    blockchain: BlockchainAPI,
    aiml: AIMLAPI,
    agentCRM: AgentCRMAPI,

    // Health check
    healthCheck: () => apiCall('/health'),

    // API docs
    getDocs: () => apiCall('/api/docs'),
};

export default DharmaRealtyAPI;
