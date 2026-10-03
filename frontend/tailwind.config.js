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
      borderRadius: {
        "DEFAULT": "0.375rem",
        "sm": "0.25rem",
        "md": "0.375rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "space-xl": "1.5rem",
        "space-md": "1rem",
        "space-2xs": "0.125rem",
        "space-xs": "0.25rem",
        "space-lg": "1.25rem",
        "space-sm": "0.5rem",
        "margin": "1rem",
        "gutter": "0.75rem"
      },
      fontFamily: {
        "sans": ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        "mono": ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        "headline-xl": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "headline-sm": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"],
        "code-block": ["JetBrains Mono", "monospace"]
      }
    }
  },
  plugins: [],
}
