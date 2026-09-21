import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-elevated': 'hsl(var(--surface-elevated) / <alpha-value>)',
        border: 'hsl(var(--border) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        gold: 'hsl(var(--gold) / <alpha-value>)',
        'gold-bright': 'hsl(var(--gold-bright) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['"Clash Display"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        'gold-sm': '0 0 12px hsl(var(--gold) / 0.2)',
        'gold-md': '0 0 24px hsl(var(--gold) / 0.25), 0 0 60px hsl(var(--gold) / 0.1)',
        'gold-lg': '0 0 40px hsl(var(--gold) / 0.35), 0 0 90px hsl(var(--gold) / 0.15)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, hsl(var(--gold)) 0%, hsl(var(--gold-bright)) 50%, hsl(var(--gold)) 100%)',
        'gold-radial': 'radial-gradient(circle at 50% 50%, hsl(var(--gold) / 0.15) 0%, transparent 70%)',
      },
      keyframes: {
        'gold-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 hsl(var(--gold) / 0.4)' },
          '50%': { opacity: '0.9', boxShadow: '0 0 0 8px hsl(var(--gold) / 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'gold-pulse': 'gold-pulse 2s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
} satisfies Config
