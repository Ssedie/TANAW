/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#5C7D92",
        secondary: "#475C68",
        accent: "#FF6404"
      }
    },
  },
  plugins: [],
}