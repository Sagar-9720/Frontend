// Size Constants for UI Components
export const SIZES = {
  // Spacing
  SPACING: {
    XS: '0.25rem',    // 4px
    SM: '0.5rem',     // 8px
    MD: '1rem',       // 16px
    LG: '1.5rem',     // 24px
    XL: '2rem',       // 32px
    XXL: '3rem',      // 48px
    XXXL: '4rem'      // 64px
  },
  
  // Font Sizes
  FONT: {
    XS: '0.75rem',    // 12px
    SM: '0.875rem',   // 14px
    BASE: '1rem',     // 16px
    LG: '1.125rem',   // 18px
    XL: '1.25rem',    // 20px
    XXL: '1.5rem',    // 24px
    XXXL: '1.875rem', // 30px
    XXXXL: '2.25rem'  // 36px
  },
  
  // Border Radius
  RADIUS: {
    NONE: '0',
    SM: '0.125rem',   // 2px
    BASE: '0.25rem',  // 4px
    MD: '0.375rem',   // 6px
    LG: '0.5rem',     // 8px
    XL: '0.75rem',    // 12px
    XXL: '1rem',      // 16px
    FULL: '9999px'
  },
  
  // Component Sizes
  BUTTON: {
    HEIGHT: {
      SM: '2rem',     // 32px
      MD: '2.5rem',   // 40px
      LG: '3rem'      // 48px
    },
    PADDING: {
      SM: '0.5rem 1rem',
      MD: '0.75rem 1.5rem',
      LG: '1rem 2rem'
    }
  },
  
  INPUT: {
    HEIGHT: {
      SM: '2rem',     // 32px
      MD: '2.5rem',   // 40px
      LG: '3rem'      // 48px
    },
    PADDING: {
      SM: '0.5rem',
      MD: '0.75rem',
      LG: '1rem'
    }
  },
  
  // Container Sizes
  CONTAINER: {
    MAX_WIDTH: {
      SM: '640px',
      MD: '768px',
      LG: '1024px',
      XL: '1280px',
      XXL: '1536px'
    }
  },
  
  // Sidebar
  SIDEBAR: {
    WIDTH: '16rem',           // 256px
    WIDTH_COLLAPSED: '4rem'   // 64px
  },
  
  // Navbar
  NAVBAR: {
    HEIGHT: '4rem'            // 64px
  },
  
  // Modal
  MODAL: {
    MAX_WIDTH: {
      SM: '28rem',    // 448px
      MD: '32rem',    // 512px
      LG: '42rem',    // 672px
      XL: '48rem',    // 768px
      XXL: '56rem'    // 896px
    }
  },
  
  // Table
  TABLE: {
    ROW_HEIGHT: '3rem',       // 48px
    HEADER_HEIGHT: '3.5rem'   // 56px
  },
  
  // Card
  CARD: {
    PADDING: {
      SM: '1rem',
      MD: '1.5rem',
      LG: '2rem'
    }
  },
  
  // Avatar
  AVATAR: {
    SIZE: {
      XS: '1.5rem',   // 24px
      SM: '2rem',     // 32px
      MD: '2.5rem',   // 40px
      LG: '3rem',     // 48px
      XL: '4rem',     // 64px
      XXL: '6rem'     // 96px
    }
  },
  
  // Icon
  ICON: {
    SIZE: {
      XS: '1rem',     // 16px
      SM: '1.25rem',  // 20px
      MD: '1.5rem',   // 24px
      LG: '2rem',     // 32px
      XL: '2.5rem'    // 40px
    }
  }
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px'
} as const;

// Z-Index values
export const Z_INDEX = {
  BACKDROP: 40,
  MODAL: 50,
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  TOOLTIP: 1070,
  POPOVER: 1080
} as const;

// Animation Durations
export const ANIMATION = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '200ms',
    SLOW: '300ms',
    SLOWER: '500ms'
  },
  EASING: {
    EASE_IN: 'ease-in',
    EASE_OUT: 'ease-out',
    EASE_IN_OUT: 'ease-in-out',
    EASE: 'ease'
  }
} as const;

export type SpacingSize = keyof typeof SIZES.SPACING;
export type FontSize = keyof typeof SIZES.FONT;
export type RadiusSize = keyof typeof SIZES.RADIUS;
export type BreakpointSize = keyof typeof BREAKPOINTS;
