/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['projects/**/*.{ts,scss}', './src/app/**/*.{ts,scss}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'hsl(155, 81%, 96%)',
          100: 'hsl(154, 80%, 90%)',
          200: 'hsl(157, 76%, 80%)',
          300: 'hsl(161, 72%, 67%)',
          400: 'hsl(163, 64%, 52%)',
          500: 'hsl(165, 84%, 39%)',
          600: 'hsl(166, 94%, 30%)',
          700: 'hsl(168, 94%, 26%)',
          800: 'hsl(169, 88%, 20%)',
          900: 'hsl(169, 86%, 16%)',
          950: 'hsl(171, 91%, 9%)',
        },
      },
    },
  },
  plugins: [],
};
