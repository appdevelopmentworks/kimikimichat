import type { Config } from 'tailwindcss'

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#FAF7F2',
          fg: '#4A3F3A',
        },
        sakura: {
          DEFAULT: '#F6C6D0',
          soft: '#FBE3E8',
        },
        lavender: {
          DEFAULT: '#CDB4DB',
          soft: '#E9D8FD',
        },
        accent: {
          DEFAULT: '#5B8DEF',
        },
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(0,0,0,0.05)'
      }
    },
  },
  plugins: [],
} satisfies Config
