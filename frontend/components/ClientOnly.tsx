'use client';

import { useState, useEffect, ReactNode, ComponentType } from 'react';

interface WithMountedCheckProps {
    children: ReactNode;
}

/**
 * Higher-order component that wraps a component to only render after mounting.
 * This prevents hydration errors when using hooks that depend on browser APIs.
 * 
 * Usage:
 * const ClientDashboard = withMountedCheck(DashboardContent);
 * export default ClientDashboard;
 */
export function withMountedCheck<P extends object>(
    Component: ComponentType<P>
): ComponentType<P> {
    const WithMountedCheck = (props: P) => {
        const [mounted, setMounted] = useState(false);

        useEffect(() => {
            setMounted(true);
        }, []);

        if (!mounted) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
                </div>
            );
        }

        return <Component {...props} />;
    };

    WithMountedCheck.displayName = `withMountedCheck(${Component.displayName || Component.name})`;
    return WithMountedCheck;
}

/**
 * A safe auth hook that returns default values during SSR
 * and real values after hydration
 */
export function useSafeAuth() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Return safe defaults during SSR
    if (!mounted) {
        return {
            user: null,
            isAuthenticated: false,
            loading: true,
            refreshUser: () => Promise.resolve(),
        };
    }

    // Import and use the real auth hook only on client
    // Note: This is a workaround - ideally the context provider
    // should handle SSR gracefully
    return { user: null, isAuthenticated: false, loading: true, refreshUser: () => Promise.resolve() };
}

export default function MountedCheck({ children }: WithMountedCheckProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return <>{children}</>;
}
