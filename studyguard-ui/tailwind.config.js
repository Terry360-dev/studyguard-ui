/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        studyblue: '#1a73e8',
        studyamber: '#f9ab00',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(26, 115, 232, 0.12)',
      },
    },
  },
  plugins: [],
};
