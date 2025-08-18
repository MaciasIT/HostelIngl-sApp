import React, { createContext, useContext, useState, useEffect } from 'react';
import { LS_THEME_KEY, LS_DENSITY_KEY } from '../utils/helpers';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(LS_THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch {
      return 'light';
    }
  });
  const [density, setDensity] = useState(() => {
    try {
      return localStorage.getItem(LS_DENSITY_KEY) || 'comfortable';
    } catch {
      return 'comfortable';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_THEME_KEY, theme);
    } catch {}
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_DENSITY_KEY, density);
    } catch {}
  }, [density]);

  const value = {
    theme,
    setTheme,
    density,
    setDensity,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
