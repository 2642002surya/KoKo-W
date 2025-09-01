import React, { useState, useEffect, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import BackgroundEffects from '@/components/BackgroundEffects'
import ThemeManager from '@/components/ThemeManager'

// Pages (Lazy loaded for better performance)
const HomePage = React.lazy(() => import('@/pages/HomePage'))
const CommandsPage = React.lazy(() => import('@/pages/CommandsPage'))
const CharactersPage = React.lazy(() => import('@/pages/CharactersPage'))
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'))
const LeaderboardPage = React.lazy(() => import('@/pages/LeaderboardPage'))
const GalleryPage = React.lazy(() => import('@/pages/GalleryPage'))
const AboutPage = React.lazy(() => import('@/pages/AboutPage'))

// Contexts
import { ThemeProvider } from '@/contexts/ThemeContext'
import { BotDataProvider } from '@/contexts/BotDataContext'

function App() {
  const [isLoading, setIsLoading] = useState(true)
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
          <div className="min-h-screen bg-cyber text-white relative overflow-hidden">
            {/* Background Effects */}
            <BackgroundEffects />
            
            {/* Offline Banner */}
            <AnimatePresence>
              {!isOnline && (
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50"
                >
                  You are currently offline. Some features may not work properly.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <Navigation />

            {/* Main Content */}
            <main className="relative z-10">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-xl text-gradient">Loading page...</p>
                  </div>
                </div>
              }>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/commands" element={<CommandsPage />} />
                    <Route path="/characters" element={<CharactersPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/about" element={<AboutPage />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </main>

            {/* Footer */}
            <Footer />

            {/* Theme Manager */}
            <ThemeManager />
          </div>
        </Router>
      </BotDataProvider>
    </ThemeProvider>
  )
}

export default App