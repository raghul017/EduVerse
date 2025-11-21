export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Use CSS variables so light/dark themes share the same Tailwind tokens
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        textPrimary: 'var(--color-text-primary)',
        textSecondary: 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        accentHover: 'var(--color-accent-hover)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        // Legacy aliases for compatibility
        primary: 'var(--color-accent)',
        bg: 'var(--color-background)',
        text: 'var(--color-text-primary)',
        muted: 'var(--color-text-secondary)',
        error: 'var(--color-danger)'
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.3)',
        hover: '0 6px 20px rgba(0,0,0,0.4)'
      },
      maxWidth: {
        layout: '1280px'
      }
    }
  },
  plugins: []
};
