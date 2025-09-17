import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

const THEME_STORAGE_KEY = 'app_theme_preference';
const FONT_STORAGE_KEY = 'app_font_preference';
const THEME_TRANSITION_DURATION = 250;

export const ThemeContext = createContext({
  theme: 'system',
  darkModeEnabled: false,
  fontSize: 'normal',
  setTheme: () => {},
  setFontSize: () => {},
});

function isSystemDark() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeProvider({ children, initialTheme }) {
  const [theme, setThemeState] = useState(() => {
    try {
      return initialTheme || localStorage.getItem(THEME_STORAGE_KEY) || 'system';
    } catch {
      return 'system';
    }
  });
  
  const [fontSize, setFontSizeState] = useState(() => {
    try {
      return localStorage.getItem(FONT_STORAGE_KEY) || 'normal';
    } catch {
      return 'normal';
    }
  });

  const darkModeEnabled = useMemo(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    return isSystemDark();
  }, [theme]);

  const applyTheme = useCallback((nextTheme) => {
    const root = document.documentElement;
    const effectiveDark = nextTheme === 'dark' || (nextTheme === 'system' && isSystemDark());
    root.classList.toggle('dark', effectiveDark);
    root.classList.add('theme-transition');
    window.setTimeout(() => root.classList.remove('theme-transition'), THEME_TRANSITION_DURATION);
  }, []);

  const applyFontSize = useCallback((size) => {
    if (!['small', 'normal', 'large'].includes(size)) {
      console.warn('Invalid font size:', size);
      return;
    }
    
    const root = document.documentElement;
    root.classList.remove('font-size-small', 'font-size-normal', 'font-size-large');
    root.classList.add(`font-size-${size}`);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize, applyFontSize]);

  const setTheme = useCallback((nextTheme) => {
    if (!['light', 'dark', 'system'].includes(nextTheme)) {
      console.warn('Invalid theme:', nextTheme);
      return;
    }
    
    setThemeState(nextTheme);
    try { localStorage.setItem(THEME_STORAGE_KEY, nextTheme); } catch { /* ignore */ }
  }, []);

  const setFontSize = useCallback((size) => {
    if (!['small', 'normal', 'large'].includes(size)) {
      console.warn('Invalid font size:', size);
      return;
    }
    
    setFontSizeState(size);
    try { localStorage.setItem(FONT_STORAGE_KEY, size); } catch { /* ignore */ }
  }, []);

  const value = useMemo(() => ({ theme, darkModeEnabled, fontSize, setTheme, setFontSize }), [theme, darkModeEnabled, fontSize, setTheme, setFontSize]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

