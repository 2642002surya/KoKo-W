import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Flame, Waves, Globe, Shield, Leaf } from 'lucide-react';

const ThemeSelector = ({ themes, currentTheme, onThemeChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const themeIcons = {
    water: Waves,
    fire: Flame,
    earth: Globe,
    metal: Shield,
    wood: Leaf
  };

  const themeDescriptions = {
    water: 'Ocean depths and flowing waves',
    fire: 'Blazing flames and molten energy',
    earth: 'Cosmic planets and stellar bodies',
    metal: 'Forged weapons and ancient armor',
    wood: 'Living forests and dancing leaves'
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center"
        style={{ backgroundColor: `${themes[currentTheme].colors.primary}CC` }}
      >
        <Palette size={24} color={themes[currentTheme].colors.text} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-16 left-0 space-y-2 min-w-64"
          >
            {Object.entries(themes).map(([themeKey, themeData], index) => {
              const Icon = themeIcons[themeKey];
              const isActive = currentTheme === themeKey;
              
              return (
                <motion.button
                  key={themeKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  onClick={() => {
                    onThemeChange(themeKey);
                    setIsOpen(false);
                  }}
                  className={`w-full p-4 rounded-lg backdrop-blur-md border transition-all duration-300 flex items-center space-x-3 group ${
                    isActive 
                      ? 'border-white/40 shadow-lg' 
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  style={{ 
                    backgroundColor: `${themeData.colors.surface}CC`,
                    borderColor: isActive ? themeData.colors.accent : undefined
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: themeData.colors.primary }}
                  >
                    <Icon size={20} color={themeData.colors.text} />
                  </div>
                  <div className="flex-1 text-left">
                    <div 
                      className="font-bold text-sm"
                      style={{ color: themeData.colors.text }}
                    >
                      {themeData.name}
                    </div>
                    <div 
                      className="text-xs opacity-75"
                      style={{ color: themeData.colors.textSecondary }}
                    >
                      {themeDescriptions[themeKey]}
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeTheme"
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: themeData.colors.accent }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          style={{ zIndex: -1 }}
        />
      )}
    </div>
  );
};

export default ThemeSelector;