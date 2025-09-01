import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const ThemeManager = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { currentTheme, themes, changeTheme } = useTheme()

  return (
    <>
      {/* Theme Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-pink-500/25 transition-all duration-200"
      >
        <Palette size={24} />
      </motion.button>

      {/* Theme Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-6 z-50 p-6 rounded-xl bg-black/90 backdrop-blur-lg border border-pink-500/20 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Choose Theme</h3>
            
            <div className="space-y-3">
              {Object.entries(themes).map(([key, theme]) => (
                <motion.button
                  key={key}
                  onClick={() => {
                    changeTheme(key)
                    setIsOpen(false)
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                    currentTheme === key
                      ? 'border-pink-500 bg-pink-500/10'
                      : 'border-gray-700 bg-gray-800/50 hover:border-pink-500/50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white/20"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <span className="text-white font-medium">{theme.name}</span>
                  </div>
                  {currentTheme === key && (
                    <Check size={20} className="text-pink-400" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Theme Preview */}
            <div className="mt-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <div className="text-sm text-gray-400 mb-2">Preview</div>
              <div className="flex space-x-2">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: themes[currentTheme].primary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: themes[currentTheme].secondary }}
                />
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: themes[currentTheme].accent }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default ThemeManager