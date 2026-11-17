/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0px',
      DEFAULT: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '9999px',
    },
    extend: {
      fontFamily: {
        'chivo-mono': ['"Chivo Mono"', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
        'roboto-mono': ['Roboto Mono', 'monospace'],
        'maname': ['Maname', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'barlow': ['Barlow', 'sans-serif'],
      },
      colors: {
        tga: {
          bg: '#09090B',
          surface: '#141416',
          'surface-alt': '#1C1C20',
          accent: '#FF641A',
          'accent-hover': '#E8550F',
          text: '#F5F5F5',
          muted: '#A1A1AA',
        },
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

