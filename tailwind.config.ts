import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8E7',
        'cream-soft': '#FBF3E4',
        yellow: {
          DEFAULT: '#F4C542',
          light: '#F8E7A1',
        },
        mustard: {
          DEFAULT: '#D98E4A',
          hover: '#C27C3B',
          dark: '#B06E30',
        },
        terracotta: '#C8795A',
        sage: {
          DEFAULT: '#7A8B5A',
          light: '#E8EEDF',
          dark: '#526139',
        },
        coffee: {
          DEFAULT: '#6B4F3A',
          dark: '#3F2E22',
        },
        ink: {
          DEFAULT: '#2F2A25',
          muted: '#686058',
          subtle: '#8C827A',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Fraunces', 'serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        button: '14px',
        input: '14px',
      },
      boxShadow: {
        warm: '0 4px 20px -2px rgba(107, 79, 58, 0.08), 0 2px 6px -1px rgba(107, 79, 58, 0.04)',
        'warm-lg': '0 12px 30px -4px rgba(107, 79, 58, 0.12), 0 4px 10px -2px rgba(107, 79, 58, 0.06)',
        'warm-hover': '0 16px 36px -6px rgba(107, 79, 58, 0.16), 0 6px 14px -3px rgba(107, 79, 58, 0.08)',
      },
      keyframes: {
        'ken-burns': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'gentle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 15s ease-in-out infinite',
        'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
