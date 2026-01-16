export const induTheme = {
  colors: {
    primary: '#FF9933', // Saffron
    secondary: '#138808', // India Green
    accent: '#000080', // Ashoka Chakra Blue
    background: '#FFF5E6', // Light Saffron/Cream
    text: '#2D2D2D',
    surface: '#FFFFFF',
    border: '#E5E7EB',
    error: '#DC2626',
    success: '#059669',
    warning: '#D97706',
    info: '#3B82F6',
  },
  typography: {
    fontFamily: '"Noto Sans Devanagari", "Inter", sans-serif',
    headingFont: '"Noto Serif Devanagari", "Merriweather", serif',
  },
  patterns: {
    mandala: 'url("/patterns/mandala-bg.png")', // Placeholder
    lotus: 'url("/patterns/lotus-motif.svg")',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
};

export const tailwindConfig = {
  theme: {
    extend: {
      colors: {
        indu: induTheme.colors,
      },
      fontFamily: {
        indu: ['"Noto Sans Devanagari"', 'sans-serif'],
        induSerif: ['"Noto Serif Devanagari"', 'serif'],
      },
    },
  },
};
