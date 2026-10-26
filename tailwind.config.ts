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
        warm: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F4EFEA',
          300: '#EAE2D8',
          400: '#D6C8B8',
          500: '#B09C88',
        },
        charcoal: {
          950: '#0F0F10',
          900: '#18181B',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          400: '#A1A1AA',
        },
        brandGreen: '#16A34A',
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
