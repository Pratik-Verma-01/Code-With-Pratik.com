/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: '#00f3ff', // Neon Cyan
          glow: 'rgba(0, 243, 255, 0.5)',
          dark: '#00c2cc'
        },
        secondary: {
          DEFAULT: '#bd00ff', // Neon Purple
          glow: 'rgba(189, 0, 255, 0.5)',
          dark: '#9500cc'
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px var(--tw-shadow-color)' },
          '100%': { boxShadow: '0 0 20px var(--tw-shadow-color), 0 0 10px var(--tw-shadow-color)' },
        }
      }
    },
  },
  plugins: [],
}
