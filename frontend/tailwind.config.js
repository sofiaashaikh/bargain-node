/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
        },
        lavender: {
          300: '#D8B4FE',
          400: '#C084FC',
        },
        sage: {
          400: '#4ADE80',
          500: '#22C55E',
        }
      }
    },
  },
  plugins: [],
}