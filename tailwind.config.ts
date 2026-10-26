import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF2',
          100: '#FAF4DE',
          200: '#F4E7B3',
          300: '#EED688',
          400: '#E5C253',
          500: '#D4AF37', // Brand Primary Gold
          600: '#B89326',
          700: '#8E701B',
          800: '#644D12',
          900: '#3D2D09',
          accent: '#F5D76E',
        },
        obsidian: {
          950: '#050505',
          900: '#080808', // Deep brand black
          850: '#0e0e0e',
          800: '#141414', // Card background
          700: '#1c1c1c', // Card hover / border
          600: '#282828',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FFFDF9',
          200: '#FFF8E8', // Warm brand cream
          300: '#F6EBD1',
          400: '#E5D6B4',
          500: '#B9B2A3', // Muted warm grey
        },
        brandGreen: '#218838',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'marquee-slow': 'marquee 45s linear infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.8s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.6' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
