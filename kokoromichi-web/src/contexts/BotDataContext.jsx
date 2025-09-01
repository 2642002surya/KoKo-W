import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchBotStats, fetchCommands, fetchCharacters } from '@/services/api'

const BotDataContext = createContext()

export const useBotData = () => {
  const context = useContext(BotDataContext)
  if (!context) {
    throw new Error('useBotData must be used within a BotDataProvider')
  }
  return context
}

export const BotDataProvider = ({ children }) => {
  const [botStats, setBotStats] = useState({
    isOnline: false,
    guilds: 0,
    users: 0,
    commands: 0,
    uptime: 0,
    lastUpdated: null
  })
  
  const [commands, setCommands] = useState([])
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [statsData, commandsData, charactersData] = await Promise.all([
        fetchBotStats(),
        fetchCommands(),
        fetchCharacters()
      ])
      
      setBotStats(statsData)
      setCommands(commandsData)
      setCharacters(charactersData)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching bot data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(refreshData, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const value = {
    botStats,
    commands,
    characters,
    loading,
    error,
    refreshData
  }

  return (
    <BotDataContext.Provider value={value}>
      {children}
    </BotDataContext.Provider>
  )
}