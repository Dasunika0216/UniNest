/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // 👈 This is important!
  ],
  theme: {
    extend: {
      colors: {
        navy: '#000957',      // deep navy
        white: '#ffffff',     // white
        ash: '#B0B3B8',       // ash gray
      },
    },
  },
  plugins: [],
}
