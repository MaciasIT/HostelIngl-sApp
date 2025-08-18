/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        'text-base': 'var(--color-text-base)',
        'text-muted': 'var(--color-text-muted)',
        border: 'var(--color-border)',
        'card-background': 'var(--color-card-background)',
      },
    },
  },
  plugins: [],
}
