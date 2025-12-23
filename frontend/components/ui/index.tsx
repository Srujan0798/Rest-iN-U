'use client';

import React from 'react';
import Link from 'next/link';

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 focus:ring-amber-500',
        secondary: 'border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-500',
        ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-5 py-2.5 gap-2',
        lg: 'px-8 py-3.5 text-lg gap-3',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {icon && !loading && icon}
            {children}
        </button>
    );
}

// Card Component
interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', hover = false, padding = 'md' }: CardProps) {
    const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
    return (
        <div className={`bg-white rounded-2xl shadow-md ${hover ? 'hover:shadow-xl transition' : ''} ${paddings[padding]} ${className}`}>
            {children}
        </div>
    );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
    return (
        <div className="space-y-1">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
                <input
                    className={`w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:border-transparent transition ${icon ? 'pl-10' : ''} ${error ? 'border-red-500' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

// Badge Component
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };
    const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm' };

    return (
        <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
            {children}
        </span>
    );
}

// Avatar Component
interface AvatarProps {
    src?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
    const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10', lg: 'w-14 h-14 text-xl', xl: 'w-20 h-20 text-2xl' };
    const initials = name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

    if (src) {
        return <img src={src} alt={name || 'Avatar'} className={`${sizes[size]} rounded-full object-cover ${className}`} />;
    }

    return (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold ${className}`}>
            {initials}
        </div>
    );
}

// Spinner Component
interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
    return (
        <div className={`${sizes[size]} border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin ${className}`} />
    );
}

// Modal Component
interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
    if (!open) return null;

    const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative w-full ${sizes[size]} bg-white rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto`}>
                {title && (
                    <div className="flex items-center justify-between p-6 border-b">
                        <h3 className="text-xl font-semibold">{title}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// Tabs Component
interface TabsProps {
    tabs: { id: string; label: string; icon?: string }[];
    activeTab: string;
    onChange: (id: string) => void;
}

export function Tabs({ tabs, activeTab, onChange }: TabsProps) {
    return (
        <div className="flex border-b">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium transition ${activeTab === tab.id
                            ? 'text-amber-600 border-b-2 border-amber-500 bg-amber-50'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {tab.icon && <span>{tab.icon}</span>}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

// Progress Bar Component
interface ProgressProps {
    value: number;
    max?: number;
    color?: 'amber' | 'green' | 'red' | 'blue';
    showLabel?: boolean;
}

export function Progress({ value, max = 100, color = 'amber', showLabel = false }: ProgressProps) {
    const percentage = Math.min(100, (value / max) * 100);
    const colors = {
        amber: 'bg-amber-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        blue: 'bg-blue-500',
    };

    return (
        <div className="space-y-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${colors[color]} transition-all duration-300`} style={{ width: `${percentage}%` }} />
            </div>
            {showLabel && <div className="text-xs text-gray-500 text-right">{percentage.toFixed(0)}%</div>}
        </div>
    );
}

// Tooltip Component
interface TooltipProps {
    content: string;
    children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className="relative group inline-block">
            {children}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition whitespace-nowrap">
                {content}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
        </div>
    );
}

// Empty State Component
interface EmptyStateProps {
    icon: string;
    title: string;
    description?: string;
    action?: { label: string; href: string };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-12">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">{title}</h3>
            {description && <p className="text-gray-500 mb-6">{description}</p>}
            {action && (
                <Link href={action.href} className="inline-block px-6 py-3 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition">
                    {action.label}
                </Link>
            )}
        </div>
    );
}

// Stat Card Component
interface StatCardProps {
    label: string;
    value: string | number;
    icon?: string;
    trend?: { value: number; label?: string };
    color?: 'amber' | 'green' | 'red' | 'blue' | 'purple';
}

export function StatCard({ label, value, icon, trend, color = 'amber' }: StatCardProps) {
    const colors = {
        amber: 'from-amber-500 to-orange-500',
        green: 'from-green-500 to-emerald-500',
        red: 'from-red-500 to-rose-500',
        blue: 'from-blue-500 to-indigo-500',
        purple: 'from-purple-500 to-violet-500',
    };

    return (
        <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-6 text-white`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-white/70 text-sm">{label}</span>
                {icon && <span className="text-2xl">{icon}</span>}
            </div>
            <div className="text-3xl font-bold">{value}</div>
            {trend && (
                <div className={`text-sm mt-2 ${trend.value >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                    {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
                </div>
            )}
        </div>
    );
}

