import { useState, useEffect, useCallback } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { showToast } from '../utils/toast';

interface NetworkStatus {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: string;
}

/**
 * Hook for monitoring network connectivity status
 * Shows toast notifications when connectivity changes
 */
export function useNetworkStatus() {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
        isConnected: true,
        isInternetReachable: true,
        type: 'unknown',
    });
    const [wasOffline, setWasOffline] = useState(false);

    const handleNetworkChange = useCallback((state: NetInfoState) => {
        const newStatus: NetworkStatus = {
            isConnected: !!state.isConnected,
            isInternetReachable: state.isInternetReachable,
            type: state.type,
        };

        setNetworkStatus(newStatus);

        // Show toast when going offline
        if (!newStatus.isConnected && !wasOffline) {
            setWasOffline(true);
            showToast.error('No internet connection');
        }

        // Show toast when coming back online
        if (newStatus.isConnected && wasOffline) {
            setWasOffline(false);
            showToast.success('Back online!');
        }
    }, [wasOffline]);

    useEffect(() => {
        // Get initial state
        NetInfo.fetch().then(handleNetworkChange);

        // Subscribe to network state changes
        const unsubscribe = NetInfo.addEventListener(handleNetworkChange);

        return () => unsubscribe();
    }, [handleNetworkChange]);

    const refresh = useCallback(async () => {
        const state = await NetInfo.fetch();
        handleNetworkChange(state);
        return state.isConnected;
    }, [handleNetworkChange]);

    return {
        ...networkStatus,
        isOffline: !networkStatus.isConnected,
        refresh,
    };
}

/**
 * Hook for checking if app should use cached/offline data
 */
export function useOfflineMode() {
    const { isConnected, isInternetReachable } = useNetworkStatus();

    // Consider offline if not connected OR internet is not reachable
    const isOffline = !isConnected || isInternetReachable === false;

    return {
        isOffline,
        shouldUseCachedData: isOffline,
    };
}

export default useNetworkStatus;
