import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  water: {
    name: 'Water',
    icon: '🌊',
    primary: 'water',
    colors: {
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: 'from-blue-900/20 to-cyan-900/20'
    },
    particles: 'bubbles'
  },
  fire: {
    name: 'Fire',
    icon: '🔥',
    primary: 'fire',
    colors: {
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f87171',
      background: 'from-red-900/20 to-orange-900/20'
    },
    particles: 'flames'
  },
  earth: {
    name: 'Earth',
    icon: '🌍',
    primary: 'earth',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fcd34d',
      background: 'from-yellow-900/20 to-orange-900/20'
    },
    particles: 'leaves'
  },
  metal: {
    name: 'Metal',
    icon: '⚔️',
    primary: 'metal',
    colors: {
      primary: '#64748b',
      secondary: '#475569',
      accent: '#94a3b8',
      background: 'from-slate-900/20 to-gray-900/20'
    },
    particles: 'sparks'
  },
  wood: {
    name: 'Wood',
    icon: '🌲',
    primary: 'wood',
    colors: {
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#4ade80',
      background: 'from-green-900/20 to-emerald-900/20'
    },
    particles: 'petals'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('water');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('kokoromichi-theme');
    const savedDarkMode = localStorage.getItem('kokoromichi-dark-mode');
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
    
    if (savedDarkMode !== null) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    // Remove all theme classes
    Object.keys(themes).forEach(themeKey => {
      root.classList.remove(`theme-${themeKey}`);
    });
    
    // Add current theme class
    root.classList.add(`theme-${currentTheme}`);
    
    // Apply dark mode
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('kokoromichi-theme', currentTheme);
    localStorage.setItem('kokoromichi-dark-mode', JSON.stringify(isDarkMode));
  }, [currentTheme, isDarkMode]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getThemeColor = (shade = 500) => {
    const theme = themes[currentTheme];
    return theme.colors.primary;
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    themes,
    changeTheme,
    isDarkMode,
    toggleDarkMode,
    getThemeColor
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};