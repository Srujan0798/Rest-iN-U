// Utility Functions for Frontend

import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

/**
 * Format currency
 */
export function formatPrice(price: number, options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        ...options,
    }).format(price);
}

/**
 * Format compact price (e.g., $1.5M)
 */
export function formatCompactPrice(price: number): string {
    if (price >= 1000000) {
        return `$${(price / 1000000).toFixed(1)}M`;
    }
    if (price >= 1000) {
        return `$${(price / 1000).toFixed(0)}K`;
    }
    return formatPrice(price);
}

/**
 * Format date
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
    const d = new Date(date);

    if (format === 'relative') {
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return 'just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
    }

    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: format === 'long' ? 'long' : 'short',
        day: 'numeric',
    });
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Get Vastu grade from score
 */
export function getVastuGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
}

/**
 * Get Vastu color class from score
 */
export function getVastuColorClass(score: number): string {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
}

/**
 * Get climate risk grade from score
 */
export function getClimateGrade(score: number): string {
    if (score <= 20) return 'A';
    if (score <= 40) return 'B';
    if (score <= 60) return 'C';
    if (score <= 80) return 'D';
    return 'F';
}

/**
 * Get climate color class from score
 */
export function getClimateColorClass(score: number): string {
    if (score <= 30) return 'text-green-600 bg-green-50';
    if (score <= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length).trim() + '...';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Generate random ID
 */
export function generateId(length: number = 8): string {
    return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Pluralize word
 */
export function pluralize(count: number, singular: string, plural?: string): string {
    return count === 1 ? singular : (plural || `${singular}s`);
}

/**
 * Get initials from name
 */
export function getInitials(firstName?: string, lastName?: string): string {
    const first = firstName?.[0]?.toUpperCase() || '';
    const last = lastName?.[0]?.toUpperCase() || '';
    return first + last || '?';
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validate phone
 */
export function isValidPhone(phone: string): boolean {
    return /^\+?[\d\s-()]{10,}$/.test(phone);
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
        return JSON.parse(json);
    } catch {
        return fallback;
    }
}

/**
 * Get cookie value
 */
export function getCookie(name: string): string | undefined {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
    return match ? decodeURIComponent(match[2]) : undefined;
}

/**
 * Set cookie
 */
export function setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

/**
 * Storage helpers
 */
export const storage = {
    get: <T>(key: string, fallback?: T): T | undefined => {
        if (typeof window === 'undefined') return fallback;
        const item = localStorage.getItem(key);
        return item ? safeJsonParse(item, fallback as T) : fallback;
    },
    set: (key: string, value: any): void => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(key, JSON.stringify(value));
    },
    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(key);
    },
};

