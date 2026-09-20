/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        loop: {
          neon: 'rgb(var(--loop-neon) / <alpha-value>)',
          deep: 'rgb(var(--loop-deep) / <alpha-value>)',
          pastel: 'rgb(var(--loop-pastel) / <alpha-value>)',
          ink: 'rgb(var(--loop-ink) / <alpha-value>)',
          surface: 'rgb(var(--loop-surface) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Avenir Next"', 'Nunito', '"Segoe UI"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
