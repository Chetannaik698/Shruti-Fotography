/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgba(var(--color-bg), <alpha-value>)',
        card: 'rgba(var(--color-card), <alpha-value>)',
        gold: '#D4AF37',
        goldSoft: '#E8C766',
        ink: 'rgba(var(--color-ink), <alpha-value>)',
        muted: 'rgba(var(--color-muted), <alpha-value>)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F4E4A6 50%, #B8912C 100%)',
      },
      boxShadow: {
        gold: '0 8px 40px -8px rgba(212, 175, 55, 0.35)',
        card: '0 20px 60px -20px rgba(0,0,0,0.6)',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
