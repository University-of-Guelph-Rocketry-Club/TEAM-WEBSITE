/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // The club's night-sky navy, so Tailwind-styled bits (the chat widget) match the rest of
        // the site.
        primary: {
          50: '#eef2f8',
          100: '#dbe3ef',
          200: '#b9c6da',
          500: '#2c3c54',
          600: '#14223a',
          700: '#0b1729',
          800: '#060e1c',
          900: '#060e1c'
        },
        rocket: {
          red: '#dc2626',
          gold: '#fbbf24',
          dark: '#1f2937'
        }
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif']
      }
    }
  },
  plugins: []
}
