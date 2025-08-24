/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          'dark': "rgb(0,0,6)",
          'light-dark': "rgb(0,0,12)",
        }
      },
      fontFamily: {
        'playwrite': "Playwrite DE Grund, sans-serif",
      },
      boxShadow: {
        'dense':  "5px 5px 15px darkslategray",
      }
    },
  },
  plugins: [],
}