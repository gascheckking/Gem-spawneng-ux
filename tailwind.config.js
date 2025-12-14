/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          base: '#0b1220',
          panel: '#111827',
          card: '#0f172a',
        },
        accent: {
          indigo: '#6366f1',
          purple: '#8b5cf6',
          cyan: '#22d3ee',
          green: '#22c55e',
          yellow: '#facc15',
          red: '#ef4444',
        },
      },
      boxShadow: {
        glow: '0 0 30px rgba(99,102,241,0.35)',
        panel: '0 10px 40px rgba(0,0,0,0.45)',
        inset: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        pulseSlow: 'pulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
