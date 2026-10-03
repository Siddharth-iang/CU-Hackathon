/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          50: '#FBFBFE',
          100: '#F6F7FB',
          200: '#EAEBF2',
          300: '#D7D9E4',
        },
        ink: {
          DEFAULT: '#0B0F19',
          muted: '#4B5565',
          subtle: '#6B7280',
          faint: '#9CA3AF',
        },
        accent: {
          blue: '#0284C7',
          'blue-light': '#E0F2FE',
          'blue-glow': 'rgba(2, 132, 199, 0.15)',
          emerald: '#10B981',
          'emerald-light': '#ECFDF5',
          crimson: '#EF4444',
          'crimson-light': '#FEF2F2',
          amber: '#F59E0B',
          'amber-light': '#FFFBEB',
        },
        // Compatibility tokens for console views
        "canvas": "var(--bg-canvas)",
        "surface": "var(--bg-surface)",
        "surface-base": "var(--bg-canvas)",
        "surface-primary": "var(--bg-surface)",
        "surface-secondary": "var(--bg-surface-subtle)",
        "surface-elevated": "var(--bg-surface-elevated)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        "text-disabled": "var(--text-disabled)",
        "status-safe": "rgb(var(--color-safe-rgb) / <alpha-value>)",
        "status-critical": "rgb(var(--color-critical-rgb) / <alpha-value>)",
        "status-warning": "rgb(var(--color-warning-rgb) / <alpha-value>)",
        "status-info": "rgb(var(--color-info-rgb) / <alpha-value>)",
        "primary": "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "on-primary": "var(--color-on-primary)",
        "primary-container": "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "on-primary-container": "var(--text-primary)",
        "error": "rgb(var(--color-critical-rgb) / <alpha-value>)",
        "error-container": "rgb(var(--color-critical-rgb) / <alpha-value>)",
        "on-error": "#ffffff",
        "secondary": "rgb(var(--color-safe-rgb) / <alpha-value>)",
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 24px -2px rgba(11, 15, 25, 0.04), 0 2px 6px -1px rgba(11, 15, 25, 0.02)',
        'float': '0 20px 40px -15px rgba(2, 132, 199, 0.12), 0 0 0 1px rgba(226, 232, 240, 0.8)',
      },
      fontFamily: {
        sans: ['Geist', '"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"Geist Mono"', '"JetBrains Mono"', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      }
    }
  },
  plugins: [],
}
