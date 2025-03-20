/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/globals.css', // ensure your CSS file is scanned
  ],
  safelist: [
    {
      pattern: /^py-/, // safelist any py-* classes
    },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
      },
      borderColor: {
        DEFAULT: 'var(--glass-border)',
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '6': '1.5rem',
      },
    },
  },
  plugins: [],
};
