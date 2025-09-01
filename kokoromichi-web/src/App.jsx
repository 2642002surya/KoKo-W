import React, { useState, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import BackgroundEffects from '@/components/BackgroundEffects'
import ThemeManager from '@/components/ThemeManager'
import TokenManager from '@/components/TokenManager'

// Pages (Lazy loaded for better performance)
const HomePage = React.lazy(() => import('@/pages/HomePage'))
const CommandsPage = React.lazy(() => import('@/pages/CommandsPage'))
const CharactersPage = React.lazy(() => import('@/pages/CharactersPage'))
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'))
const LeaderboardPage = React.lazy(() => import('@/pages/LeaderboardPage'))
const GalleryPage = React.lazy(() => import('@/pages/GalleryPage'))
const GameSystemsPage = React.lazy(() => import('@/pages/GameSystemsPage'))
const AboutPage = React.lazy(() => import('@/pages/AboutPage'))

// Contexts
import { ThemeProvider } from '@/contexts/ThemeContext'
import { BotDataProvider } from '@/contexts/BotDataContext'

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Simulate loading and initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Online/offline detection
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <BotDataProvider>
        <Router>
          <div className="relative min-h-screen bg-cyber overflow-x-hidden">
            {/* Background Effects */}
            <BackgroundEffects />
            
            {/* Navigation */}
            <Navigation />
            
            {/* Main Content */}
            <main className="relative z-10">
              {/* Offline Indicator */}
              <AnimatePresence>
                {!isOnline && (
                  <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
                  >
                    🔴 You're offline. Some features may not work.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Page Routes */}
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
                  />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/commands" element={<CommandsPage />} />
                  <Route path="/characters" element={<CharactersPage />} />
                  <Route path="/systems" element={<GameSystemsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </Suspense>
            </main>

            {/* Footer */}
            <Footer />
            
            {/* Theme Manager */}
            <ThemeManager />
            
            {/* Token Manager */}
            <TokenManager />
          </div>
        </Router>
      </BotDataProvider>
    </ThemeProvider>
  )
}

export default App