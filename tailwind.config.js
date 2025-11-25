/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1d4ed8",
        secondary: "#059669",
        accent: "#e11d48",
        brand: {
          DEFAULT: "@2463eb",
          light: "#4f7cf3",
          dark: "#1a4cc0"
        }
      }
    },
  },
  plugins: [],
}

