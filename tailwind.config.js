// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'], // <- wichtig
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        panel: 'var(--panel)',
        'panel-elev': 'var(--panel-elev)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        primary: 'var(--primary)',
        ring: 'var(--ring)',
        border: 'var(--border)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        mid: 'var(--motion-mid)',
        slow: 'var(--motion-slow)',
      },
    },
  },
  plugins: [],
}
