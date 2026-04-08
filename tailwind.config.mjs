/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5A2B',
          dark: '#6B3E1A',
          light: '#A87B4A',
        },
        secondary: {
          DEFAULT: '#4A7C59',
          dark: '#3A6348',
          light: '#6B9C7A',
        },
        accent: {
          DEFAULT: '#FFB347',
          dark: '#E69A2E',
        },
      },
      fontFamily: {
        bengali: ['Hind Siliguri', 'SolaimanLipi', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
