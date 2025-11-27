/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'chivo-mono': ['"Chivo Mono"', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'maname': ['Maname', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'barlow': ['Barlow', 'sans-serif'],
      },
      backgroundImage: {
        'fiery': "url('/imgs/bg.png')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

