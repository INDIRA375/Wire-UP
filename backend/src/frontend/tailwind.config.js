/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        ash: '#f5f5f5',
        softBlack: '#111111',
        accent: '#2563eb'
      }
    }
  },
  plugins: []
};
