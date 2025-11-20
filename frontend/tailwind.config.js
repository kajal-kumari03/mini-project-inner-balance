/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'calm-blue': '#6B9BD1',
        'calm-green': '#7FB3A3',
        'calm-lavender': '#B8A9D9',
        'soft-pink': '#F5D7DA',
        'warm-beige': '#F5F1E8',
      },
    },
  },
  plugins: [],
}

