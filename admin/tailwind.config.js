/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      colors:{
        'primary-color': '#F8F9FA',
        'clean-bg': '#F5F6F7',
        'color-light': '#C6CAD0',
        'color-medium': '#B0B4BC',
        'color-heavy': '#374151'
      }
    },
  },
  plugins: [],
}

