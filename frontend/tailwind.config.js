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
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif']
      },
      fontWeight: {
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
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
  plugins: [
    // 3D Transform utilities from NovaPulse template
    function({ addUtilities }) {
      const rotateXUtilities = {};
      const rotateYUtilities = {};
      const rotateZUtilities = {};
      const rotateValues = [0, 5, 10, 15, 20, 30, 45, 75];

      // Generate rotate-x utilities
      rotateValues.forEach((value) => {
        rotateXUtilities[`.rotate-x-${value}`] = {
          '--tw-rotate-x': `${value}deg`,
          transform: `
            translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0))
            rotateX(var(--tw-rotate-x, 0))
            rotateY(var(--tw-rotate-y, 0))
            rotateZ(var(--tw-rotate-z, 0))
            skewX(var(--tw-skew-x, 0))
            skewY(var(--tw-skew-y, 0))
            scaleX(var(--tw-scale-x, 1))
            scaleY(var(--tw-scale-y, 1))
          `.replace(/\s+/g, ' ').trim(),
        };
        if (value !== 0) {
          rotateXUtilities[`.-rotate-x-${value}`] = {
            '--tw-rotate-x': `-${value}deg`,
            transform: `
              translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0))
              rotateX(var(--tw-rotate-x, 0))
              rotateY(var(--tw-rotate-y, 0))
              rotateZ(var(--tw-rotate-z, 0))
              skewX(var(--tw-skew-x, 0))
              skewY(var(--tw-skew-y, 0))
              scaleX(var(--tw-scale-x, 1))
              scaleY(var(--tw-scale-y, 1))
            `.replace(/\s+/g, ' ').trim(),
          };
        }
      });

      // Generate rotate-y utilities
      rotateValues.forEach((value) => {
        rotateYUtilities[`.rotate-y-${value}`] = {
          '--tw-rotate-y': `${value}deg`,
          transform: `
            translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0))
            rotateX(var(--tw-rotate-x, 0))
            rotateY(var(--tw-rotate-y, 0))
            rotateZ(var(--tw-rotate-z, 0))
            skewX(var(--tw-skew-x, 0))
            skewY(var(--tw-skew-y, 0))
            scaleX(var(--tw-scale-x, 1))
            scaleY(var(--tw-scale-y, 1))
          `.replace(/\s+/g, ' ').trim(),
        };
        if (value !== 0) {
          rotateYUtilities[`.-rotate-y-${value}`] = {
            '--tw-rotate-y': `-${value}deg`,
            transform: `
              translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0))
              rotateX(var(--tw-rotate-x, 0))
              rotateY(var(--tw-rotate-y, 0))
              rotateZ(var(--tw-rotate-z, 0))
              skewX(var(--tw-skew-x, 0))
              skewY(var(--tw-skew-y, 0))
              scaleX(var(--tw-scale-x, 1))
              scaleY(var(--tw-scale-y, 1))
            `.replace(/\s+/g, ' ').trim(),
          };
        }
      });

      // Generate rotate-z utilities
      rotateValues.forEach((value) => {
        rotateZUtilities[`.rotate-z-${value}`] = {
          '--tw-rotate-z': `${value}deg`,
          transform: `
            translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0))
            rotateX(var(--tw-rotate-x, 0))
            rotateY(var(--tw-rotate-y, 0))
            rotateZ(var(--tw-rotate-z, 0))
            skewX(var(--tw-skew-x, 0))
            skewY(var(--tw-skew-y, 0))
            scaleX(var(--tw-scale-x, 1))
            scaleY(var(--tw-scale-y, 1))
          `.replace(/\s+/g, ' ').trim(),
        };
        if (value !== 0) {
          rotateZUtilities[`.-rotate-z-${value}`] = {
            '--tw-rotate-z': `-${value}deg`,
            transform: `
              translate3d(var(--tw-translate-x, 0), var(--tw-translate-y, 0), var(--tw-translate-z, 0))
              rotateX(var(--tw-rotate-x, 0))
              rotateY(var(--tw-rotate-y, 0))
              rotateZ(var(--tw-rotate-z, 0))
              skewX(var(--tw-skew-x, 0))
              skewY(var(--tw-skew-y, 0))
              scaleX(var(--tw-scale-x, 1))
              scaleY(var(--tw-scale-y, 1))
            `.replace(/\s+/g, ' ').trim(),
          };
        }
      });

      addUtilities({
        ...rotateXUtilities,
        ...rotateYUtilities,
        ...rotateZUtilities,
      });
    }
  ]
};
