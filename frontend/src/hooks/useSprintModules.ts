/**
 * =============================================================================
 * DHARMA REALTY PLATFORM - REACT HOOKS
 * Custom Hooks for All Sprint Module APIs
 * =============================================================================
 */

import { useState, useEffect, useCallback } from 'react';
import {
    AncientWisdomAPI,
    ClimateIoTAPI,
    BlockchainAPI,
    AIMLAPI,
    AgentCRMAPI,
} from '../services/api';


// =============================================================================
// GENERIC HOOKS
// =============================================================================

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

function useApi<T>(
    apiCall: () => Promise<any>,
    dependencies: any[] = []
): UseApiState<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall();
            if (response.success) {
                setData(response.data);
            } else {
                setError(response.error || 'Unknown error');
            }
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setLoading(false);
        }
    }, dependencies);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}


// =============================================================================
// ANCIENT WISDOM HOOKS
// =============================================================================

export function useFengShuiAnalysis(propertyData: any) {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = useCallback(async () => {
        if (!propertyData) return;
        setLoading(true);
        const response = await AncientWisdomAPI.analyzeFengShui(propertyData);
        if (response.success) {
            setResult(response.data);
        } else {
            setError(response.error || 'Failed to analyze');
        }
        setLoading(false);
    }, [propertyData]);

    return { result, loading, error, analyze };
}

export function usePanchang(date?: string) {
    return useApi(() => AncientWisdomAPI.getPanchang(date), [date]);
}

export function useGrihaPraveshDates(months: number = 3) {
    return useApi(() => AncientWisdomAPI.getGrihaPraveshDates(months), [months]);
}

export function useNumerologyProfile(name: string, birthDate: string) {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const calculate = useCallback(async () => {
        if (!name || !birthDate) return;
        setLoading(true);
        const response = await AncientWisdomAPI.calculateNumerologyProfile(name, birthDate);
        if (response.success) {
            setProfile(response.data);
        }
        setLoading(false);
    }, [name, birthDate]);

    return { profile, loading, calculate };
}

export function useLandEnergyAssessment(propertyData: any) {
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const assess = useCallback(async () => {
        if (!propertyData) return;
        setLoading(true);
        const response = await AncientWisdomAPI.assessLandEnergy(propertyData);
        if (response.success) {
            setResult(response.data);
        }
        setLoading(false);
    }, [propertyData]);

    return { result, loading, assess };
}


// =============================================================================
// CLIMATE & IOT HOOKS
// =============================================================================

export function useClimateRiskAssessment(propertyData: any, scenario?: string) {
    const [assessment, setAssessment] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const assess = useCallback(async () => {
        if (!propertyData) return;
        setLoading(true);
        const response = await ClimateIoTAPI.assessClimateRisk(propertyData, scenario);
        if (response.success) {
            setAssessment(response.data);
        } else {
            setError(response.error || 'Failed to assess');
        }
        setLoading(false);
    }, [propertyData, scenario]);

    return { assessment, loading, error, assess };
}

export function useClimateScenarios() {
    return useApi(() => ClimateIoTAPI.getClimateScenarios(), []);
}

export function useIoTSensors(propertyId: string) {
    return useApi(() => ClimateIoTAPI.getSensors(propertyId), [propertyId]);
}

export function useIoTReadings(propertyId: string) {
    const [readings, setReadings] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchReadings = useCallback(async () => {
        setLoading(true);
        const response = await ClimateIoTAPI.getCurrentReadings(propertyId);
        if (response.success) {
            setReadings(response.data);
        }
        setLoading(false);
    }, [propertyId]);

    useEffect(() => {
        fetchReadings();
        // Poll every 30 seconds
        const interval = setInterval(fetchReadings, 30000);
        return () => clearInterval(interval);
    }, [fetchReadings]);

    return { readings, loading, refetch: fetchReadings };
}

export function useIoTAlerts(propertyId: string) {
    return useApi(() => ClimateIoTAPI.getAlerts(propertyId), [propertyId]);
}

export function useComfortScore(propertyId: string) {
    return useApi(() => ClimateIoTAPI.getComfortScore(propertyId), [propertyId]);
}


// =============================================================================
// BLOCKCHAIN HOOKS
// =============================================================================

export function usePropertyNFT(propertyId: string) {
    return useApi(() => BlockchainAPI.getNFTByProperty(propertyId), [propertyId]);
}

export function useFractionalOwnership(propertyId: string) {
    return useApi(() => BlockchainAPI.getShareholderSummary(propertyId), [propertyId]);
}

export function useDAOProposals(propertyId: string) {
    return useApi(() => BlockchainAPI.getActiveProposals(propertyId), [propertyId]);
}

export function useTransactionHistory(address?: string, propertyId?: string) {
    return useApi(() => BlockchainAPI.getTransactions(address, propertyId, 50), [address, propertyId]);
}

export function useMintNFT() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const mint = useCallback(async (propertyId: string, ownerAddress: string, propertyData: any) => {
        setLoading(true);
        setError(null);
        const response = await BlockchainAPI.mintNFT(propertyId, ownerAddress, propertyData);
        if (response.success) {
            setResult(response.data);
        } else {
            setError(response.error || 'Minting failed');
        }
        setLoading(false);
        return response;
    }, []);

    return { mint, loading, result, error };
}

export function usePurchaseShares() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const purchase = useCallback(async (propertyId: string, buyerAddress: string, numShares: number, pricePerShare: number) => {
        setLoading(true);
        const response = await BlockchainAPI.purchaseShares(propertyId, buyerAddress, numShares, pricePerShare);
        if (response.success) {
            setResult(response.data);
        }
        setLoading(false);
        return response;
    }, []);

    return { purchase, loading, result };
}


// =============================================================================
// AI/ML HOOKS
// =============================================================================

export function usePricePrediction(propertyData: any) {
    const [prediction, setPrediction] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const predict = useCallback(async () => {
        if (!propertyData) return;
        setLoading(true);
        const response = await AIMLAPI.predictPrice(propertyData);
        if (response.success) {
            setPrediction(response.data);
        } else {
            setError(response.error || 'Prediction failed');
        }
        setLoading(false);
    }, [propertyData]);

    return { prediction, loading, error, predict };
}

export function usePropertyInspection(propertyId: string, images: any[]) {
    const [report, setReport] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const inspect = useCallback(async () => {
        if (!propertyId || !images.length) return;
        setLoading(true);
        const response = await AIMLAPI.inspectProperty(propertyId, images);
        if (response.success) {
            setReport(response.data);
        }
        setLoading(false);
    }, [propertyId, images]);

    return { report, loading, inspect };
}

export function useNegotiationAnalysis(propertyData: any, buyerProfile?: any) {
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const analyze = useCallback(async () => {
        if (!propertyData) return;
        setLoading(true);
        const response = await AIMLAPI.analyzeNegotiation(propertyData, buyerProfile);
        if (response.success) {
            setAnalysis(response.data);
        }
        setLoading(false);
    }, [propertyData, buyerProfile]);

    return { analysis, loading, analyze };
}

export function useMarketSentiment(location: string) {
    return useApi(() => AIMLAPI.getMarketSentiment(location), [location]);
}


// =============================================================================
// AGENT CRM HOOKS
// =============================================================================

export function useLeads(agentId: string, status?: string) {
    return useApi(() => AgentCRMAPI.getLeads(agentId, status), [agentId, status]);
}

export function usePipeline(agentId: string) {
    return useApi(() => AgentCRMAPI.getPipeline(agentId), [agentId]);
}

export function useAgentMetrics(agentId: string, period?: string) {
    return useApi(() => AgentCRMAPI.getAgentMetrics(agentId, period), [agentId, period]);
}

export function useConversations(userId: string) {
    return useApi(() => AgentCRMAPI.getUserConversations(userId), [userId]);
}

export function useMessages(conversationId: string) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        const response = await AgentCRMAPI.getMessages(conversationId);
        if (response.success) {
            setMessages(response.data);
        }
        setLoading(false);
    }, [conversationId]);

    const sendMessage = useCallback(async (senderId: string, content: string) => {
        const response = await AgentCRMAPI.sendMessage(conversationId, senderId, content);
        if (response.success) {
            await fetchMessages();
        }
        return response;
    }, [conversationId, fetchMessages]);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 5 seconds
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    return { messages, loading, sendMessage, refetch: fetchMessages };
}

export function useUpcomingVideoSessions(agentId: string) {
    return useApi(() => AgentCRMAPI.getUpcomingVideoSessions(agentId), [agentId]);
}

export function useCommissionCalculator() {
    const [commission, setCommission] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const calculate = useCallback(async (propertyId: string, salePrice: number, structure?: string) => {
        setLoading(true);
        const response = await AgentCRMAPI.calculateCommission(propertyId, salePrice, structure);
        if (response.success) {
            setCommission(response.data);
        }
        setLoading(false);
        return response;
    }, []);

    return { commission, loading, calculate };
}


// =============================================================================
// COMBINED ANALYSIS HOOKS
// =============================================================================

export function useCompletePropertyAnalysis(property: any, owner?: any, images?: any[]) {
    const [analysis, setAnalysis] = useState<any>({
        ancientWisdom: null,
        climate: null,
        ai: null,
    });
    const [loading, setLoading] = useState(false);

    const runAnalysis = useCallback(async () => {
        if (!property) return;
        setLoading(true);

        // Run all analyses in parallel
        const [ancientWisdom, climate, ai] = await Promise.all([
            AncientWisdomAPI.getCompleteAncientWisdomAnalysis(property, owner),
            ClimateIoTAPI.assessClimateRisk(property),
            AIMLAPI.getCompleteAIAnalysis(property, images),
        ]);

        setAnalysis({
            ancientWisdom: ancientWisdom.success ? ancientWisdom.data : null,
            climate: climate.success ? climate.data : null,
            ai: ai.success ? ai.data : null,
        });

        setLoading(false);
    }, [property, owner, images]);

    return { analysis, loading, runAnalysis };
}


export default {
    // Ancient Wisdom
    useFengShuiAnalysis,
    usePanchang,
    useGrihaPraveshDates,
    useNumerologyProfile,
    useLandEnergyAssessment,
    // Climate & IoT
    useClimateRiskAssessment,
    useClimateScenarios,
    useIoTSensors,
    useIoTReadings,
    useIoTAlerts,
    useComfortScore,
    // Blockchain
    usePropertyNFT,
    useFractionalOwnership,
    useDAOProposals,
    useTransactionHistory,
    useMintNFT,
    usePurchaseShares,
    // AI/ML
    usePricePrediction,
    usePropertyInspection,
    useNegotiationAnalysis,
    useMarketSentiment,
    // Agent CRM
    useLeads,
    usePipeline,
    useAgentMetrics,
    useConversations,
    useMessages,
    useUpcomingVideoSessions,
    useCommissionCalculator,
    // Combined
    useCompletePropertyAnalysis,
};
