import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Droplets, Flame, Globe, Leaf, Sword, ChevronDown, ChevronUp } from 'lucide-react'
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
  const [isExpanded, setIsExpanded] = useState(false)
  const { currentTheme, themes, changeTheme } = useTheme()

  return (
    <div className="fixed top-20 right-6 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/90 backdrop-blur-lg rounded-2xl border border-white/30 overflow-hidden shadow-2xl"
        style={{ boxShadow: `0 0 40px ${themes[currentTheme].primary}40` }}
      >
        {/* Header Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between text-white hover:bg-white/10 transition-colors min-w-[200px]"
        >
          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: themes[currentTheme].primary }}
            >
              {React.createElement(getThemeIcon(currentTheme), { size: 16, color: 'white' })}
            </div>
            <div className="text-left">
              <div className="font-bold text-sm">🎨 Themes</div>
              <div className="text-xs opacity-60">{themes[currentTheme].name} Active</div>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp size={20} style={{ color: themes[currentTheme].primary }} />
          ) : (
            <ChevronDown size={20} style={{ color: themes[currentTheme].primary }} />
          )}
        </button>

        {/* Theme Options */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/20"
            >
              <div className="p-4 space-y-2">
                {Object.entries(themes).map(([key, themeData]) => {
                  const isActive = currentTheme === key
                  const IconComponent = getThemeIcon(key)
                  
                  return (
                    <motion.button
                      key={key}
                      onClick={() => {
                        changeTheme(key)
                        setIsExpanded(false)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-3 rounded-lg flex items-center space-x-3 transition-all duration-200 ${
                        isActive 
                          ? 'bg-white/20 border border-white/40' 
                          : 'hover:bg-white/10 border border-transparent'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: themeData.primary }}
                      >
                        <IconComponent size={16} color="white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{themeData.emoji}</span>
                          <span className="font-medium text-white text-sm">{themeData.name}</span>
                        </div>
                      </div>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 rounded-full bg-white"
                        />
                      )}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ThemeManager