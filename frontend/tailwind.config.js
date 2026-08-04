export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        muted: "var(--muted)",
        border: "var(--border)",
        divider: "var(--divider)",
        
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        textDisabled: "var(--text-disabled)",
        
        void: "var(--void)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-glow": "var(--accent-glow)",
        
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
        info: "var(--info)",

        /* ===================================================================
           LANDING PAGE PALETTE
           Semantic classes for the landing redesign. Every value is
           contrast-verified; see src/styles/landing-system.css for the
           ratios and the hard rules.

           RULE 1: `accent` (#A1FF62) is 1.01:1 on cream. Use it as
           bg-accent ONLY on light surfaces, always with text-accentText.
           On bg-dark it is permitted as text (10.14:1).
           RULE 3: no raw hex in JSX. These classes are the whole vocabulary.
           =================================================================== */
        canvas:         "var(--lp-canvas)",
        canvasAlt:      "var(--lp-canvas-alt)",
        surfaceRaised:  "var(--lp-surface)",
        surfaceSunken:  "var(--lp-surface-sunken)",
        dark:           "var(--lp-dark)",

        primaryText:    "var(--lp-text-primary)",
        secondaryText:  "var(--lp-text-secondary)",
        mutedText:      "var(--lp-text-muted)",
        disabledText:   "var(--lp-text-disabled)", // LARGE TEXT ONLY (rule 4)
        onDark:         "var(--lp-text-on-dark)",
        onDark2:        "var(--lp-text-on-dark-2)",

        lime:           "var(--lp-accent)",        // background only on light
        accentText:     "var(--lp-accent-text)",   // only text colour on lime

        subtle:         "var(--lp-border)",
        strong:         "var(--lp-border-strong)",
        inputBorder:    "var(--lp-border-input)",

        // Illustration and section tints only. Never UI chrome.
        sage:           "var(--lp-sage)",
        bluePale:       "var(--lp-blue-pale)",
        blueSoft:       "var(--lp-blue-soft)",
        blueMid:        "var(--lp-blue-mid)",
        blueDeep:       "var(--lp-blue)",
        sand:           "var(--lp-sand)",

        okay:           "var(--lp-success)",
        caution:        "var(--lp-warning)",
        danger:         "var(--lp-error)",
        notice:         "var(--lp-info)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        heading: "var(--font-heading)",
        haffer: ["'Haffer XH'", "Arial", "sans-serif"],

        /* --- LANDING PAGE (see src/styles/landing-system.css) --- */
        display: "var(--lp-font-display)", // Anton. HEADLINE ONLY, 40px+.
        editorial: "var(--lp-font-serif)", // EB Garamond. Dark section only.
        body: "var(--lp-font-sans)",       // Inter. Everything below 40px.
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)",

        /* --- LANDING. Pills (lpFull) on buttons and chips ONLY. --- */
        lpSm:   "var(--lp-radius-sm)",
        lpMd:   "var(--lp-radius-md)",
        lpLg:   "var(--lp-radius-lg)",
        lpXl:   "var(--lp-radius-xl)",
        lpFull: "var(--lp-radius-full)",
      },

      /* ===================================================================
         LANDING TYPE SCALE
         RULE 2: `display` is the ONE Anton token and its clamp floor is
         40px. Anton must never render below it. Every step from `h2` down
         is Inter. Do not add a smaller display size.
         =================================================================== */
      fontSize: {
        display:  ["var(--lp-text-display)",  { lineHeight: "var(--lp-leading-display)", letterSpacing: "var(--lp-track-display)" }],
        serifLg:  ["var(--lp-text-serif-lg)", { lineHeight: "var(--lp-leading-serif)",   letterSpacing: "var(--lp-track-serif)" }],
        lpH2:     ["var(--lp-text-h2)",       { lineHeight: "var(--lp-leading-tight)" }],
        lpH3:     ["var(--lp-text-h3)",       { lineHeight: "var(--lp-leading-tight)" }],
        lpLead:   ["var(--lp-text-lead)",     { lineHeight: "var(--lp-leading-body)" }],
        lpBody:   ["var(--lp-text-body)",     { lineHeight: "var(--lp-leading-body)" }],
        lpSm:     ["var(--lp-text-sm)",       { lineHeight: "1.55" }],
        lpXs:     ["var(--lp-text-xs)",       { lineHeight: "1.5" }],
        eyebrow:  ["var(--lp-text-eyebrow)",  { lineHeight: "1.4", letterSpacing: "var(--lp-track-eyebrow)" }],
      },

      spacing: {
        lp1: "var(--lp-space-1)",   lp2: "var(--lp-space-2)",
        lp3: "var(--lp-space-3)",   lp4: "var(--lp-space-4)",
        lp5: "var(--lp-space-5)",   lp6: "var(--lp-space-6)",
        lp7: "var(--lp-space-7)",   lp8: "var(--lp-space-8)",
        lp9: "var(--lp-space-9)",   lp10: "var(--lp-space-10)",
        section: "var(--lp-section-y)",
        gutter:  "var(--lp-gutter)",
        /* SectionIntro rhythm. Deliberately unequal so the group reads as one
           unit: the eyebrow binds tight to the headline, the support copy
           breaks away. Ratio ~1:3.3. See landing-system.css. */
        introEyebrow: "var(--lp-intro-eyebrow-gap)",
        introSupport: "var(--lp-intro-support-gap)",
      },

      maxWidth: {
        measure: "var(--lp-measure)",  // 65ch body copy cap
        lp:      "1400px",
      },

      letterSpacing: {
        lpDisplay: "var(--lp-track-display)",
        lpSerif:   "var(--lp-track-serif)",
        lpEyebrow: "var(--lp-track-eyebrow)",
      },

      transitionTimingFunction: {
        lpOut: "var(--lp-ease-out)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        glow: "var(--shadow-glow)",
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
    }
  },
  plugins: [],
};
