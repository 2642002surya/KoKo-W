import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('water')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const themes = {
    water: {
      name: 'Water',
      emoji: '🌊',
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: 'linear-gradient(135deg, #001122 0%, #002244 50%, #001122 100%)',
      particle: '#0ea5e9',
      animationType: 'waves'
    },
    fire: {
      name: 'Fire',
      emoji: '🔥',
      primary: '#ef4444',
      secondary: '#dc2626',
      accent: '#f97316',
      background: 'linear-gradient(135deg, #220000 0%, #441100 50%, #220000 100%)',
      particle: '#ef4444',
      animationType: 'flames'
    },
    earth: {
      name: 'Earth',
      emoji: '🌍',
      primary: '#a16207',
      secondary: '#92400e',
      accent: '#d97706',
      background: 'linear-gradient(135deg, #1a1000 0%, #332200 50%, #1a1000 100%)',
      particle: '#a16207',
      animationType: 'planets'
    },
    wood: {
      name: 'Wood',
      emoji: '🌳',
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#f59e0b',
      background: 'linear-gradient(135deg, #0a1a0a 0%, #1a331a 50%, #0a1a0a 100%)',
      particle: '#22c55e',
      animationType: 'leaves'
    },
    metal: {
      name: 'Metal',
      emoji: '⚔️',
      primary: '#6b7280',
      secondary: '#4b5563',
      accent: '#9ca3af',
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
      particle: '#6b7280',
      animationType: 'weapons'
    }
  }

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName)
    localStorage.setItem('kokoromichi-theme', themeName)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('kokoromichi-dark-mode', !isDarkMode)
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('kokoromichi-theme')
    const savedDarkMode = localStorage.getItem('kokoromichi-dark-mode')
    
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
    
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true')
    }
  }, [])

  useEffect(() => {
    const theme = themes[currentTheme]
    document.documentElement.style.setProperty('--theme-primary', theme.primary)
    document.documentElement.style.setProperty('--theme-secondary', theme.secondary)
    document.documentElement.style.setProperty('--theme-accent', theme.accent)
    document.documentElement.style.setProperty('--theme-particle', theme.particle)
  }, [currentTheme, themes])

  const value = {
    currentTheme,
    themes,
    theme: themes[currentTheme],
    isDarkMode,
    changeTheme,
    toggleDarkMode
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}