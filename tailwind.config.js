/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",      // px-4
        sm: "1.5rem",         // sm:px-6
        lg: "2rem",           // lg:px-8
      },
    },
    extend: {},
  },
  plugins: [],
}