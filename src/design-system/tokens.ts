/**
 * Antigravity Design System Tokens
 */

export const tokens = {
  colors: {
    // Canvas & Surfacing
    bgApp: '#222222',        // Outer workspace app shell canvas background
    bgCard: '#292929',       // Main flush artifact sheet card background
    bgTube: '#202020',       // Dark tube capsules background
    bgGlass: 'rgba(32, 32, 36, 0.75)', // Glassmorphic floating action bar background
    borderGlass: 'rgba(255, 255, 255, 0.08)',

    // Typography
    textPrimary: '#D4D4D4',   // Primary crisp off-white body text
    textSecondary: '#A1A1AA', // Muted label text
    textDim: '#888888',       // Icon and subtle text color

    // Status Badges & Accents (Monochromatic Monochrome System)
    accentPrimary: '#ffffff', // Pure white primary action buttons
    accentPrimaryText: '#000000', // Black text on white primary action button
    badgeDraftBg: 'rgba(255, 255, 255, 0.08)',
    badgeDraftText: '#A1A1AA',
    
    // GitHub Line Diff Badges
    diffAddText: '#3fb950',
    diffAddBg: 'rgba(46, 160, 67, 0.15)',
    diffDelText: '#f85149',
    diffDelBg: 'rgba(248, 81, 73, 0.15)',

    // Wiki Link Badges
    wikiLinkText: '#38bdf8',
    wikiLinkBg: 'rgba(56, 189, 248, 0.1)',
  },

  radii: {
    none: '0px',
    sm: '6px',
    md: '10px',
    lg: '16px',
    pill: '28px',
    full: '9999px',
  },

  shadows: {
    glass: '0 8px 24px rgba(0, 0, 0, 0.3)',
    soft: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },

  layout: {
    railWidth: '140px',
    minSidebarWidth: 180,
    defaultSidebarWidth: 280,
    maxSidebarWidth: 480,
    readingMeasureWidth: '740px',
  },

  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontSize: '36px', fontWeight: '400', letterSpacing: '-0.5px' },
    h2: { fontSize: '24px', fontWeight: '500' },
    h3: { fontSize: '18px', fontWeight: '500' },
    body: { fontSize: '16px', lineHeight: '1.75' },
    caption: { fontSize: '13px', lineHeight: '1.5' },
  },
} as const;
