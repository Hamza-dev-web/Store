/** @type {import('tailwindcss').Config} */
const {fontFamily} = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
      colors: {
        brand: '#3b82f6', 
        'light-100': '#f3f4f6', 
        'dark-900': '#111827', 
      },
    },
  },
  plugins: [],
};