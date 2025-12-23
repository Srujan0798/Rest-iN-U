import { useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

export function useToast() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, title: string, message?: string) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => removeToast(id), 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = (title: string, message?: string) => addToast('success', title, message);
    const error = (title: string, message?: string) => addToast('error', title, message);
    const warning = (title: string, message?: string) => addToast('warning', title, message);
    const info = (title: string, message?: string) => addToast('info', title, message);

    return { toasts, addToast, removeToast, success, error, warning, info };
}
