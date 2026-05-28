export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        neon: '0 0 40px rgba(32, 255, 180, 0.18)',
      },
      colors: {
        brand: {
          900: '#041205',
          800: '#071f0d',
          700: '#0d3419',
          500: '#2ef1a6',
          300: '#8cffc6',
        },
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at top, rgba(58, 255, 177, 0.18), transparent 40%)',
      },
    },
  },
  plugins: [],
}
