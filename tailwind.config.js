/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f3ff',
          100: '#ede4ff',
          200: '#d9c7ff',
          300: '#c0a0ff',
          400: '#a675ff',
          500: '#8c46ff',
          600: '#792bff',
          700: '#5e1bd5',
          800: '#4411a1',
          900: '#2b0b66',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        ink: {
          50: '#f6f7fb',
          100: '#e2e7f0',
          200: '#c5cfe0',
          300: '#9faec8',
          400: '#7c8dad',
          500: '#5b6c91',
          600: '#425072',
          700: '#2f3954',
          800: '#1f2739',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', '"DM Sans"', 'sans-serif'],
        display: ['"Clash Display"', '"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 10px 30px rgba(124, 58, 237, 0.35)',
        soft: '0 20px 60px rgba(15, 23, 42, 0.45)',
      },
      backgroundImage: {
        'grid-radial': 'radial-gradient(circle at center, rgba(255,255,255,0.08) 0, transparent 55%)',
      },
      animation: {
        'float-slow': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
}
