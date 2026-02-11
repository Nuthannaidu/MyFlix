/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- Make sure this line is exactly here!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}