// Custom Themes Utility - Theme management and customization
import { storageUtility } from "./storage-utility";
import { THEME_CONSTANTS } from "./constants";

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
  border: string;
  shadow: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  sidebar: {
    background: string;
    header: string;
    text: string;
    textSecondary: string;
    hover: string;
  };
}

export interface Theme {
  id: string;
  name: string;
  mode: "light" | "dark";
  colors: ThemeColors;
  fonts: {
    primary: string;
    secondary: string;
    monospace: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export class CustomThemes {
  private static instance: CustomThemes;
  private currentTheme: Theme | undefined;
  private availableThemes: Map<string, Theme> = new Map();
  private customThemes: Map<string, Theme> = new Map();
  private themeChangeListeners: Array<(theme: Theme) => void> = [];

  private constructor() {
    this.initializeDefaultThemes();
    this.loadSavedTheme();
    this.applySystemThemeListener();
  }

  public static getInstance(): CustomThemes {
    if (!CustomThemes.instance) {
      CustomThemes.instance = new CustomThemes();
    }
    return CustomThemes.instance;
  }

  private initializeDefaultThemes(): void {
    // Light theme
    const lightTheme: Theme = {
      id: "light",
      name: "Light",
      mode: "light",
      colors: {
        primary: "#3B82F6",
        secondary: "#6B7280",
        accent: "#10B981",
        background: "#FFFFFF",
        surface: "#F9FAFB",
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          disabled: "#9CA3AF",
        },
        border: "#E5E7EB",
        shadow: "rgba(0, 0, 0, 0.1)",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        sidebar: {
          background: "#1E293B",
          header: "#0F172A",
          text: "#F8FAFC",
          textSecondary: "#94A3B8",
          hover: "#334155",
        },
      },
      fonts: {
        primary:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        secondary: 'Georgia, "Times New Roman", serif',
        monospace:
          '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        full: "9999px",
      },
      shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
    };

    // Dark theme
    const darkTheme: Theme = {
      id: "dark",
      name: "Dark",
      mode: "dark",
      colors: {
        primary: "#60A5FA",
        secondary: "#9CA3AF",
        accent: "#34D399",
        background: "#111827",
        surface: "#1F2937",
        text: {
          primary: "#F9FAFB",
          secondary: "#D1D5DB",
          disabled: "#6B7280",
        },
        border: "#374151",
        shadow: "rgba(0, 0, 0, 0.3)",
        success: "#34D399",
        warning: "#FBBF24",
        error: "#F87171",
        info: "#60A5FA",
        sidebar: {
          background: "#0F172A",
          header: "#020617",
          text: "#F8FAFC",
          textSecondary: "#94A3B8",
          hover: "#1E293B",
        },
      },
      fonts: {
        primary:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        secondary: 'Georgia, "Times New Roman", serif',
        monospace:
          '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace',
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        full: "9999px",
      },
      shadows: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.4)",
      },
    };

    // Blue theme
    const blueTheme: Theme = {
      ...lightTheme,
      id: "blue",
      name: "Ocean Blue",
      colors: {
        ...lightTheme.colors,
        primary: "#0EA5E9",
        accent: "#06B6D4",
        surface: "#F0F9FF",
      },
    };

    // Green theme
    const greenTheme: Theme = {
      ...lightTheme,
      id: "green",
      name: "Forest Green",
      colors: {
        ...lightTheme.colors,
        primary: "#059669",
        accent: "#10B981",
        surface: "#F0FDF4",
      },
    };

    this.availableThemes.set("light", lightTheme);
    this.availableThemes.set("dark", darkTheme);
    this.availableThemes.set("blue", blueTheme);
    this.availableThemes.set("green", greenTheme);

    this.currentTheme = lightTheme;
  }

  private loadSavedTheme(): void {
    const savedThemeId = storageUtility.getTheme();
    if (savedThemeId) {
      const theme = this.getTheme(savedThemeId);
      if (theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
      }
    } else {
      // Auto-detect system preference
      this.detectSystemTheme();
    }
  }

  private detectSystemTheme(): void {
    if (typeof window !== "undefined" && window.matchMedia) {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const themeId = prefersDark ? "dark" : "light";
      const theme = this.availableThemes.get(themeId);
      if (theme) {
        this.setTheme(themeId);
      }
    }
  }

  private applySystemThemeListener(): void {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (e) => {
        const savedTheme = storageUtility.getTheme();
        if (!savedTheme || savedTheme === THEME_CONSTANTS.SYSTEM) {
          const themeId = e.matches ? "dark" : "light";
          const theme = this.availableThemes.get(themeId);
          if (theme) {
            this.applyTheme(theme);
            this.currentTheme = theme;
          }
        }
      });
    }
  }

  // Public methods
  public getCurrentTheme(): Theme {
    if (this.currentTheme) {
      return this.currentTheme;
    }
    // Fallback to light theme if currentTheme is undefined
    const fallbackTheme = this.availableThemes.get("light");
    if (!fallbackTheme) {
      throw new Error("No theme available");
    }
    return fallbackTheme;
  }

  public getTheme(id: string): Theme | undefined {
    return this.availableThemes.get(id) || this.customThemes.get(id);
  }

  public getAllThemes(): Theme[] {
    return [
      ...Array.from(this.availableThemes.values()),
      ...Array.from(this.customThemes.values()),
    ];
  }

  public getAvailableThemes(): Theme[] {
    return Array.from(this.availableThemes.values());
  }

  public getCustomThemes(): Theme[] {
    return Array.from(this.customThemes.values());
  }

  public setTheme(themeId: string): boolean {
    const theme = this.getTheme(themeId);
    if (!theme) {
      return false;
    }

    this.currentTheme = theme;
    this.applyTheme(theme);
    storageUtility.setTheme(themeId);
    this.notifyThemeChange(theme);

    return true;
  }

  public createCustomTheme(
    baseThemeId: string,
    customizations: Partial<Theme>
  ): Theme | null {
    const baseTheme = this.getTheme(baseThemeId);
    if (!baseTheme) {
      return null;
    }

    const customTheme: Theme = {
      ...baseTheme,
      ...customizations,
      id: customizations.id || `custom-${Date.now()}`,
      colors: {
        ...baseTheme.colors,
        ...customizations.colors,
      },
      fonts: {
        ...baseTheme.fonts,
        ...customizations.fonts,
      },
      spacing: {
        ...baseTheme.spacing,
        ...customizations.spacing,
      },
      borderRadius: {
        ...baseTheme.borderRadius,
        ...customizations.borderRadius,
      },
      shadows: {
        ...baseTheme.shadows,
        ...customizations.shadows,
      },
    };

    this.customThemes.set(customTheme.id, customTheme);
    this.saveCustomThemes();

    return customTheme;
  }

  public updateCustomTheme(themeId: string, updates: Partial<Theme>): boolean {
    const theme = this.customThemes.get(themeId);
    if (!theme) {
      return false;
    }

    const updatedTheme: Theme = {
      ...theme,
      ...updates,
      colors: {
        ...theme.colors,
        ...updates.colors,
      },
      fonts: {
        ...theme.fonts,
        ...updates.fonts,
      },
      spacing: {
        ...theme.spacing,
        ...updates.spacing,
      },
      borderRadius: {
        ...theme.borderRadius,
        ...updates.borderRadius,
      },
      shadows: {
        ...theme.shadows,
        ...updates.shadows,
      },
    };

    this.customThemes.set(themeId, updatedTheme);
    this.saveCustomThemes();

    // If this is the current theme, apply changes
    if (this.currentTheme && this.currentTheme.id === themeId) {
      this.currentTheme = updatedTheme;
      this.applyTheme(updatedTheme);
      this.notifyThemeChange(updatedTheme);
    }

    return true;
  }

  public deleteCustomTheme(themeId: string): boolean {
    if (!this.customThemes.has(themeId)) {
      return false;
    }

    this.customThemes.delete(themeId);
    this.saveCustomThemes();

    // If this was the current theme, switch to light theme
    if (this.currentTheme && this.currentTheme.id === themeId) {
      this.setTheme("light");
    }

    return true;
  }

  public exportTheme(themeId: string): string | null {
    const theme = this.getTheme(themeId);
    if (!theme) {
      return null;
    }

    return JSON.stringify(theme, null, 2);
  }

  public importTheme(themeData: string): Theme | null {
    try {
      const theme: Theme = JSON.parse(themeData);

      // Validate theme structure
      if (!this.isValidTheme(theme)) {
        return null;
      }

      // Ensure unique ID
      theme.id = `imported-${Date.now()}`;

      this.customThemes.set(theme.id, theme);
      this.saveCustomThemes();

      return theme;
    } catch {
      return null;
    }
  }

  public addThemeChangeListener(listener: (theme: Theme) => void): void {
    this.themeChangeListeners.push(listener);
  }

  public removeThemeChangeListener(listener: (theme: Theme) => void): void {
    const index = this.themeChangeListeners.indexOf(listener);
    if (index > -1) {
      this.themeChangeListeners.splice(index, 1);
    }
  }

  // Theme application
  private applyTheme(theme: Theme): void {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;

    // Apply CSS custom properties
    root.style.setProperty("--color-primary", theme.colors.primary);
    root.style.setProperty("--color-secondary", theme.colors.secondary);
    root.style.setProperty("--color-accent", theme.colors.accent);
    root.style.setProperty("--color-background", theme.colors.background);
    root.style.setProperty("--color-surface", theme.colors.surface);
    root.style.setProperty("--color-text-primary", theme.colors.text.primary);
    root.style.setProperty(
      "--color-text-secondary",
      theme.colors.text.secondary
    );
    root.style.setProperty("--color-text-disabled", theme.colors.text.disabled);
    root.style.setProperty("--color-border", theme.colors.border);
    root.style.setProperty("--color-shadow", theme.colors.shadow);
    root.style.setProperty("--color-success", theme.colors.success);
    root.style.setProperty("--color-warning", theme.colors.warning);
    root.style.setProperty("--color-error", theme.colors.error);
    root.style.setProperty("--color-info", theme.colors.info);

    // Sidebar colors
    root.style.setProperty(
      "--color-sidebar-bg",
      theme.colors.sidebar.background
    );
    root.style.setProperty(
      "--color-sidebar-header",
      theme.colors.sidebar.header
    );
    root.style.setProperty("--color-sidebar-text", theme.colors.sidebar.text);
    root.style.setProperty(
      "--color-sidebar-text-secondary",
      theme.colors.sidebar.textSecondary
    );
    root.style.setProperty("--color-sidebar-hover", theme.colors.sidebar.hover);

    root.style.setProperty("--font-primary", theme.fonts.primary);
    root.style.setProperty("--font-secondary", theme.fonts.secondary);
    root.style.setProperty("--font-monospace", theme.fonts.monospace);

    root.style.setProperty("--spacing-xs", theme.spacing.xs);
    root.style.setProperty("--spacing-sm", theme.spacing.sm);
    root.style.setProperty("--spacing-md", theme.spacing.md);
    root.style.setProperty("--spacing-lg", theme.spacing.lg);
    root.style.setProperty("--spacing-xl", theme.spacing.xl);

    root.style.setProperty("--radius-sm", theme.borderRadius.sm);
    root.style.setProperty("--radius-md", theme.borderRadius.md);
    root.style.setProperty("--radius-lg", theme.borderRadius.lg);
    root.style.setProperty("--radius-full", theme.borderRadius.full);

    root.style.setProperty("--shadow-sm", theme.shadows.sm);
    root.style.setProperty("--shadow-md", theme.shadows.md);
    root.style.setProperty("--shadow-lg", theme.shadows.lg);
    root.style.setProperty("--shadow-xl", theme.shadows.xl);

    // Apply theme mode class
    root.classList.remove("light", "dark");
    root.classList.add(theme.mode);
  }

  private notifyThemeChange(theme: Theme): void {
    this.themeChangeListeners.forEach((listener) => {
      try {
        listener(theme);
      } catch (error) {
        console.error("Error in theme change listener:", error);
      }
    });
  }

  private saveCustomThemes(): void {
    const customThemesArray = Array.from(this.customThemes.values());
    storageUtility.setItem("custom_themes", customThemesArray);
  }

  // private loadCustomThemes(): void {
  //   const customThemesArray = storageUtility.getItem('custom_themes') || [];
  //   customThemesArray.forEach((theme: Theme) => {
  //     this.customThemes.set(theme.id, theme);
  //   });
  // }

  private isValidTheme(theme: any): theme is Theme {
    return (
      theme &&
      typeof theme.id === "string" &&
      typeof theme.name === "string" &&
      (theme.mode === "light" || theme.mode === "dark") &&
      theme.colors &&
      typeof theme.colors.primary === "string" &&
      theme.fonts &&
      typeof theme.fonts.primary === "string"
    );
  }

  // Utility methods
  public generateColorPalette(baseColor: string): Partial<ThemeColors> {
    // This would generate a color palette based on a base color
    // Implementation would use color theory to create harmonious colors
    return {
      primary: baseColor,
      secondary: this.adjustColorBrightness(baseColor, -20),
      accent: this.adjustColorHue(baseColor, 60),
    };
  }

  private adjustColorBrightness(hex: string, percent: number): string {
    // Simple brightness adjustment (in production, use a proper color library)
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  }

  private adjustColorHue(hex: string, _degree: number): string {
    // Simple hue adjustment (in production, use a proper color library)
    // This is a placeholder implementation
    return hex;
  }
}

// Export singleton instance
export const customThemes = CustomThemes.getInstance();

// Helper functions
export const getCurrentTheme = () => customThemes.getCurrentTheme();
export const setTheme = (themeId: string) => customThemes.setTheme(themeId);
export const getAllThemes = () => customThemes.getAllThemes();
export const createCustomTheme = (
  baseThemeId: string,
  customizations: Partial<Theme>
) => customThemes.createCustomTheme(baseThemeId, customizations);
