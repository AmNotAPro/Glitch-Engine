/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          violet: '#7B61FF',
          'violet-dark': '#6B51E6',
        },
        accent: {
          yellow: '#FFD500',
          'yellow-dark': '#E6C000',
        },
        background: {
          white: '#FFFFFF',
          beige: '#FAF9F6',
        },
        text: {
          primary: '#111111',
          secondary: '#555555',
        },
        border: {
          light: '#E5E5E5',
        },
        gray: {
          50: '#FAF9F6',
          100: '#F4F4F4',
          200: '#E5E5E5',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#555555',
          700: '#374151',
          800: '#1F2937',
          900: '#111111',
        }
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
      boxShadow: {
        'card': '0px 4px 12px rgba(0, 0, 0, 0.05)',
        'card-hover': '0px 8px 24px rgba(0, 0, 0, 0.08)',
      },
      spacing: {
        'section-desktop': '80px',
        'section-mobile': '48px',
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'button': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      maxWidth: {
        'container': '1280px',
      },
      gap: {
        'desktop': '40px',
        'mobile': '24px',
      }
    },
  },
  plugins: [],
};