/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        px: '1px',
        0: '0px',
        1: '4px',
        2: '5px',
        3: '6px',
        4: '10px',
        5: '13px',
        6: '20px',
        7: '40px',
        8: '32px',
        10: '40px', 
        12: '48px',
        16: '64px',
        32: '128px',
      },
      fontFamily: {
        primary: ['Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        base: ['14px', '16.8px'],
        xs: '12px',
        sm: '13px',
        md: '14px',
        lg: '17px',
      },
      colors: {
        surface: {
          base: '#0f172a',
          muted: '#ffffff',
          raised: '#f8fafc',
          subtle: '#f1f5f9',
        },
        text: {
          secondary: '#0284c7',
          inverse: '#ffffff',
        },
        border: {
          strong: 'rgba(15, 23, 42, 0.15)',
          light: '#e2e8f0',
        },
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Sky blue chính
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: '#0284c7',
        },
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7', // Sky blue chính
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: '#0284c7',
        }
      },
      transitionDuration: {
        instant: '100ms',
        fast: '200ms',
      }
    },
  },
  plugins: [],
}

