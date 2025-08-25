import { useState, useEffect } from 'react';
import { customThemes, type Theme } from '../utils';

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(customThemes.getCurrentTheme());
  const [isDark, setIsDark] = useState<boolean>(currentTheme.mode === 'dark');

  useEffect(() => {
    // Listen for theme changes
    const handleThemeChange = (theme: Theme) => {
      setCurrentTheme(theme);
      setIsDark(theme.mode === 'dark');
    };

    customThemes.addThemeChangeListener(handleThemeChange);

    return () => {
      customThemes.removeThemeChangeListener(handleThemeChange);
    };
  }, []);

  const setTheme = (themeId: string) => {
    return customThemes.setTheme(themeId);
  };

  const toggleTheme = () => {
    const newThemeId = isDark ? 'light' : 'dark';
    return setTheme(newThemeId);
  };

  const createCustomTheme = (baseThemeId: string, customizations: Partial<Theme>) => {
    return customThemes.createCustomTheme(baseThemeId, customizations);
  };

  const getAllThemes = () => {
    return customThemes.getAllThemes();
  };

  const getAvailableThemes = () => {
    return customThemes.getAvailableThemes();
  };

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    createCustomTheme,
    getAllThemes,
    getAvailableThemes
  };
}
