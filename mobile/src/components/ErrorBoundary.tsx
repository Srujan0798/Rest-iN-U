import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

const colors = {
    background: '#0f0f23',
    surface: '#1a1a2e',
    text: '#ffffff',
    textSecondary: '#a1a1aa',
    error: '#ef4444',
    primary: '#6366f1',
};

/**
 * Error Boundary component for graceful error handling in React Native
 * Catches JavaScript errors in child component tree and displays fallback UI
 */
export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });

        // Log error to analytics/monitoring service
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // TODO: Send to error tracking service like Sentry
        // if (typeof global.Sentry !== 'undefined') {
        //     global.Sentry.captureException(error, { extra: errorInfo });
        // }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.content}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="warning" size={64} color={colors.error} />
                        </View>

                        <Text style={styles.title}>Oops! Something went wrong</Text>

                        <Text style={styles.message}>
                            We apologize for the inconvenience. The app encountered an unexpected error.
                        </Text>

                        <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                            <Ionicons name="refresh" size={20} color={colors.text} />
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>

                        {__DEV__ && this.state.error && (
                            <View style={styles.debugContainer}>
                                <Text style={styles.debugTitle}>Debug Info:</Text>
                                <Text style={styles.debugText}>{this.state.error.toString()}</Text>
                                {this.state.errorInfo && (
                                    <Text style={styles.debugStack}>
                                        {this.state.errorInfo.componentStack?.substring(0, 500)}
                                    </Text>
                                )}
                            </View>
                        )}
                    </ScrollView>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.error + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    retryButtonText: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    debugContainer: {
        marginTop: 32,
        padding: 16,
        backgroundColor: colors.surface,
        borderRadius: 12,
        width: '100%',
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.error,
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontFamily: 'monospace',
    },
    debugStack: {
        fontSize: 10,
        color: colors.textSecondary,
        fontFamily: 'monospace',
        marginTop: 8,
    },
});
