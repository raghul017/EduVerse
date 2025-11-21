export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        muted: "var(--muted)",
        border: "var(--border)",
        divider: "var(--divider)",
        
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        textDisabled: "var(--text-disabled)",
        
        void: "var(--void)",
        accent: "var(--accent)",
        
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",
        ring: 'var(--color-ring)'
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        heading: ['Lato', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        glow: 'var(--shadow-glow)'
      },
      maxWidth: {
        layout: 'var(--layout-max-width)'
      }
    }
  },
  plugins: []
};
