// Tailwind CSS Configuration for Browser Use
/** @type {import('tailwindcss').Config} */
export const content = [
  "./**/*.html",           // This will catch ALL HTML files in any subdirectory
  "./src/**/*.{html,js,ts,jsx,tsx}",
  "./*.html"
];
export const theme = {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#3b82f6',
        light: '#60a5fa',
        dark: '#1d4ed8',
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
        950: '#172554'
      },
      background: '#fafbfc',
      surface: '#ffffff',
      border: '#e5e7eb',
      text: {
        primary: '#1f2937',
        secondary: '#6b7280',
        muted: '#9ca3af'
      }
    },
    fontFamily: {
      primary: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      mono: ['"SF Mono"', 'Monaco', '"Cascadia Code"', 'monospace'],
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif']
    },
    fontSize: {
      'xs': ['clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem)', { lineHeight: '1.25' }],
      'sm': ['clamp(0.875rem, 0.8rem + 0.3vw, 1rem)', { lineHeight: '1.25' }],
      'base': ['clamp(1rem, 0.9rem + 0.4vw, 1.125rem)', { lineHeight: '1.5' }],
      'lg': ['clamp(1.125rem, 1rem + 0.5vw, 1.25rem)', { lineHeight: '1.5' }],
      'xl': ['clamp(1.25rem, 1.1rem + 0.6vw, 1.5rem)', { lineHeight: '1.25' }],
      '2xl': ['clamp(1.5rem, 1.3rem + 0.8vw, 2rem)', { lineHeight: '1.25' }]
    },
    lineHeight: {
      'none': '1',
      'tight': '1.25',
      'normal': '1.5',
      'relaxed': '1.75'
    },
    spacing: {
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '8': '2rem',
      '10': '2.5rem',
      '12': '3rem',
      '16': '4rem'
    },
    maxWidth: {
      'container-sm': '640px',
      'container-md': '768px',
      'container-lg': '1024px',
      'container-xl': '1280px'
    },
    gridTemplateColumns: {
      'auto-fit-280': 'repeat(auto-fit, minmax(280px, 1fr))'
    },
    // NEW: Added background gradients for the footer pattern
    backgroundImage: {
      'gradient-radial-blue': 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)'
    },
    keyframes: {
      'subtle-pulse': {
        '0%, 100%': {
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(0, 0, 0, 0.1)'
        },
        '50%': {
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4), 0 2px 6px rgba(0, 0, 0, 0.15)'
        }
      },
      'pulse': {
        '0%, 100%': {
          transform: 'scale(1)'
        },
        '50%': {
          transform: 'scale(1.05)'
        }
      }
    },
    animation: {
      'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
      'pulse': 'pulse 300ms ease-in-out infinite'
    },
    boxShadow: {
      'custom-blue': '0 4px 12px rgba(59, 130, 246, 0.3), 0 2px 6px rgba(0, 0, 0, 0.1)',
      'custom-dark-blue': '0 6px 16px rgba(59, 130, 246, 0.4), 0 4px 8px rgba(0, 0, 0, 0.15)'
    }
  }
};
export const plugins = [];