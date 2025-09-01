import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check, Droplets, Flame, Globe, Leaf, Sword } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const getThemeIcon = (themeKey) => {
  const icons = {
    water: Droplets,
    fire: Flame,
    earth: Globe,
    wood: Leaf,
    metal: Sword
  }
  return icons[themeKey] || Palette
}

const ThemeManager = () => {
  const { currentTheme, themes, changeTheme } = useTheme()

  return (
    <>
      {/* Elemental Theme Toggles - Fixed Bottom Left */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-3">
        {Object.entries(themes).map(([key, themeData]) => {
          const isActive = currentTheme === key
          const IconComponent = getThemeIcon(key)
          
          return (
            <motion.button
              key={key}
              onClick={() => changeTheme(key)}
              whileHover={{ scale: 1.15, x: 5 }}
              whileTap={{ scale: 0.9 }}
              className={`relative p-3 rounded-full shadow-xl transition-all duration-300 group ${
                isActive 
                  ? 'shadow-lg border-2 border-white/50' 
                  : 'hover:shadow-lg border border-white/20'
              }`}
              style={{
                backgroundColor: themeData.primary,
                boxShadow: isActive 
                  ? `0 0 20px ${themeData.primary}40, 0 0 40px ${themeData.primary}20`
                  : `0 4px 20px ${themeData.primary}30`
              }}
              title={`${themeData.name} Theme`}
            >
              <IconComponent 
                size={20} 
                color="white" 
                className={`transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`}
              />
              
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border border-gray-800"
                />
              )}
              
              {/* Hover tooltip */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200"
              >
                {themeData.emoji} {themeData.name}
              </motion.div>
            </motion.button>
          )
        })}
      </div>

    </>
  )
}

export default ThemeManager