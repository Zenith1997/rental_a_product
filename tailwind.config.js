import { heroui } from '@heroui/react';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        logoFont: ["Playfair Display", "serif"]
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(to bottom, #CCD2D9 50%, #E6E8EC 50%)',
      },
    },
  },
  plugins: [heroui()],
}