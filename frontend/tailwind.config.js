/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {
      colors:{
        'main-background': '#FDF5E9',
        'dark-textcolor': '#581A0F',
        'section-background': '#FDF6EA',
        'light-textcolor': '#882B1D',
      }
    },
  },
  plugins: [],
}

