/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        burmese: ['Pyidaungsu', 'Padauk', 'Inter', 'sans-serif'],
        padauk: ['Padauk', 'Pyidaungsu', 'sans-serif'],
        sans: ['Inter', 'Pyidaungsu', 'Padauk', 'sans-serif']
      },
      colors: {
        viber: {
          DEFAULT: '#7360f2',
          hover: '#5d48db',
          light: '#edeaff',
          dark: '#4f3bc4'
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'glass-hover': '0 12px 40px 0 rgba(31, 38, 135, 0.14)',
        'neumorph': '5px 5px 12px #d1d9e6, -5px -5px 12px #ffffff',
        'neumorph-dark': '5px 5px 15px #070c14, -5px -5px 15px #152238',
        'neumorph-inset': 'inset 2px 2px 5px #d1d9e6, inset -2px -2px 5px #ffffff',
        'neumorph-inset-dark': 'inset 2px 2px 5px #070c14, inset -2px -2px 5px #152238',
        'glow-blue': '0 0 20px -3px rgba(37, 99, 235, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-viber': '0 0 20px -3px rgba(115, 96, 242, 0.35)'
      }
    },
  },
  plugins: [],
}
