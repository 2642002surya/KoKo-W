import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Home, Command, Users, BarChart3, Image, Info, Crown, Gamepad2 } from 'lucide-react'
import { useBotData } from '@/contexts/BotDataContext'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { botStats } = useBotData()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/commands', label: 'Commands', icon: Command },
    { path: '/characters', label: 'Characters', icon: Users },
    { path: '/systems', label: 'Game Systems', icon: Gamepad2 },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/leaderboard', label: 'Leaderboard', icon: Crown },
    { path: '/gallery', label: 'Gallery', icon: Image },
    { path: '/about', label: 'About', icon: Info }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-lg border-b border-pink-500/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.span
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="text-2xl"
              >
                🌸
              </motion.span>
              <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform">
                KoKoroMichi
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 ${
                      isActive 
                        ? 'text-pink-400 bg-pink-500/10' 
                        : 'text-gray-300 hover:text-pink-400 hover:bg-pink-500/5'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-pink-500/20 rounded-lg border border-pink-500/30"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* Bot Status & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Bot Status */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${botStats.isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                <span className="text-sm text-gray-400">
                  {botStats.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Invite Button */}
              <motion.a
                href="https://discord.com/api/oauth2/authorize?client_id=1344603209829974016&permissions=8&scope=bot"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:inline-flex items-center space-x-2 px-6 py-3 btn-primary rounded-xl font-semibold text-white shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
              >
                <Crown size={18} />
                <span>Invite Bot</span>
              </motion.a>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-pink-400 hover:bg-pink-500/10 transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-black/95 backdrop-blur-lg border-t border-pink-500/20"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'text-pink-400 bg-pink-500/20 border border-pink-500/30' 
                          : 'text-gray-300 hover:text-pink-400 hover:bg-pink-500/10'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
                
                {/* Mobile Bot Status */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${botStats.isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-sm text-gray-400">
                      Bot Status: {botStats.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                
                {/* Mobile Invite Button */}
                <motion.a
                  href="https://discord.com/api/oauth2/authorize?client_id=1344603209829974016&permissions=8&scope=bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 w-full px-6 py-4 btn-primary rounded-xl font-semibold text-white shadow-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <Crown size={20} />
                  <span>Invite Bot to Server</span>
                </motion.a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      
      {/* Spacer */}
      <div className="h-16" />
    </>
  )
}

export default Navigation