/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // ESTATE Mode - Blue/Purple theme
                estate: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                // INDU Mode - Saffron/Orange theme (dharma)
                dharma: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                // WEB3 Mode - Green/Teal theme
                web3: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                vedic: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8b5cf6',
                    600: '#7c3aed',
                    700: '#6d28d9',
                    800: '#5b21b6',
                    900: '#4c1d95',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                glow: {
                    from: { boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)' },
                    to: { boxShadow: '0 0 40px rgba(245, 158, 11, 0.5)' },
                },
                slideUp: {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                },
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'estate-gradient': 'linear-gradient(to right, #2563eb, #7c3aed)',
                'dharma-gradient': 'linear-gradient(to right, #f59e0b, #ea580c, #dc2626)',
                'web3-gradient': 'linear-gradient(to right, #10b981, #14b8a6, #06b6d4)',
                'vedic-gradient': 'linear-gradient(to right, #8b5cf6, #6366f1, #3b82f6)',
            },
            boxShadow: {
                'estate': '0 10px 40px -10px rgba(37, 99, 235, 0.4)',
                'dharma': '0 10px 40px -10px rgba(245, 158, 11, 0.4)',
                'web3': '0 10px 40px -10px rgba(16, 185, 129, 0.4)',
                'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 10px 40px rgba(0, 0, 0, 0.12)',
            },
        },
    },
    plugins: [],
};
