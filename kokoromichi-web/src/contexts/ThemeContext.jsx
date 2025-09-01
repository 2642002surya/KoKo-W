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
  const [currentTheme, setCurrentTheme] = useState('cyber')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const themes = {
    cyber: {
      name: 'Cyber',
      primary: '#ff69b4',
      secondary: '#9400d3',
      accent: '#ff1493',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%)',
      particle: '#ff69b4'
    },
    neon: {
      name: 'Neon',
      primary: '#00ffff',
      secondary: '#ff00ff',
      accent: '#ffff00',
      background: 'linear-gradient(135deg, #000011 0%, #000033 50%, #000011 100%)',
      particle: '#00ffff'
    },
    fire: {
      name: 'Fire',
      primary: '#ff4500',
      secondary: '#ff6347',
      accent: '#ffd700',
      background: 'linear-gradient(135deg, #1a0000 0%, #330000 50%, #1a0000 100%)',
      particle: '#ff4500'
    },
    ocean: {
      name: 'Ocean',
      primary: '#0ea5e9',
      secondary: '#0284c7',
      accent: '#38bdf8',
      background: 'linear-gradient(135deg, #000a1a 0%, #001a33 50%, #000a1a 100%)',
      particle: '#0ea5e9'
    },
    forest: {
      name: 'Forest',
      primary: '#22c55e',
      secondary: '#16a34a',
      accent: '#84cc16',
      background: 'linear-gradient(135deg, #0a1a0a 0%, #1a331a 50%, #0a1a0a 100%)',
      particle: '#22c55e'
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