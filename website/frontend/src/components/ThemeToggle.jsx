import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentTheme, themes, changeTheme } = useTheme();

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Palette size={18} style={{ color: themes[currentTheme].colors.primary }} />
        <span className="hidden sm:inline text-sm font-medium">
          {themes[currentTheme].icon}
        </span>
      </motion.button>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              className="absolute top-full right-0 mt-2 w-48 bg-slate-800/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-xl z-50"
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">
                  Choose Theme
                </div>
                
                {Object.entries(themes).map(([key, theme]) => (
                  <motion.button
                    key={key}
                    onClick={() => {
                      changeTheme(key);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                      currentTheme === key
                        ? 'bg-white/20 text-white'
                        : 'hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <span className="text-lg">{theme.icon}</span>
                    <div className="flex-1">
                      <span className="font-medium">{theme.name}</span>
                    </div>
                    <div 
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  </motion.button>
                ))}
              </div>
              
              <div className="border-t border-slate-700/50 p-2">
                <div className="text-xs text-gray-400 px-3 py-1">
                  Themes change colors and animations
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;