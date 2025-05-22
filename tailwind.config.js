// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,ts}', // <== Make sure this is present
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        zain: ['Zain', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
