import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import pages
import HomePage from './pages/HomePage';
import CommandsPage from './pages/CommandsPage';
import FeaturesPage from './pages/FeaturesPage';
import FAQPage from './pages/FAQPage';
import WaifusPage from './pages/WaifusPage';

// Import components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ThemeSelector from './components/ThemeSelector';
import ParticleBackground from './components/ParticleBackground';

function App() {
  const [theme, setTheme] = useState('water'); // Default theme
  const [isLoading, setIsLoading] = useState(false);

  // Theme configurations
  const themes = {
    water: {
      name: 'Water',
      colors: {
        primary: '#0EA5E9',
        secondary: '#0284C7',
        accent: '#38BDF8',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F1F5F9',
        textSecondary: '#94A3B8'
      },
      gradient: 'from-blue-900 via-blue-800 to-slate-900'
    },
    fire: {
      name: 'Fire',
      colors: {
        primary: '#EF4444',
        secondary: '#DC2626',
        accent: '#F97316',
        background: '#0F0A0A',
        surface: '#2D1B1B',
        text: '#FEF2F2',
        textSecondary: '#FCA5A5'
      },
      gradient: 'from-red-900 via-orange-800 to-slate-900'
    },
    earth: {
      name: 'Earth',
      colors: {
        primary: '#A16207',
        secondary: '#92400E',
        accent: '#D97706',
        background: '#1C1917',
        surface: '#292524',
        text: '#FEF7ED',
        textSecondary: '#D6D3D1'
      },
      gradient: 'from-amber-900 via-yellow-800 to-slate-900'
    },
    metal: {
      name: 'Metal',
      colors: {
        primary: '#6B7280',
        secondary: '#4B5563',
        accent: '#9CA3AF',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
        textSecondary: '#D1D5DB'
      },
      gradient: 'from-gray-800 via-slate-700 to-gray-900'
    },
    wood: {
      name: 'Wood',
      colors: {
        primary: '#16A34A',
        secondary: '#15803D',
        accent: '#22C55E',
        background: '#0F1F0F',
        surface: '#1B2E1B',
        text: '#F0FDF4',
        textSecondary: '#BBF7D0'
      },
      gradient: 'from-green-900 via-emerald-800 to-slate-900'
    }
  };

  const currentTheme = themes[theme];

  // Apply theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    root.style.setProperty('--gradient', currentTheme.gradient);
  }, [currentTheme]);

  // Initialize without loading screen
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Router>
      <div 
        className={`min-h-screen bg-gradient-to-br ${currentTheme.gradient} relative overflow-hidden`}
        style={{ backgroundColor: currentTheme.colors.background }}
      >
        {/* Particle Background */}
        <ParticleBackground theme={theme} />
        
        {/* Main Content */}
        <div className="relative z-10">
          <Navigation theme={currentTheme} />
          
          <main>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage theme={currentTheme} />} />
                <Route path="/commands" element={<CommandsPage theme={currentTheme} />} />
                <Route path="/features" element={<FeaturesPage theme={currentTheme} />} />
                <Route path="/waifus" element={<WaifusPage theme={currentTheme} />} />
                <Route path="/faq" element={<FAQPage theme={currentTheme} />} />
              </Routes>
            </AnimatePresence>
          </main>
          
          <Footer theme={currentTheme} />
        </div>
        
        {/* Theme Selector */}
        <ThemeSelector 
          themes={themes}
          currentTheme={theme}
          onThemeChange={setTheme}
        />
      </div>
    </Router>
  );
}

export default App;