import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    console.error('API Error:', message)
    return Promise.reject(new Error(message))
  }
)

// Bot statistics
export const fetchBotStats = async () => {
  try {
    const data = await api.get('/bot/stats')
    return {
      isOnline: true,
      guilds: data.guilds || 1,
      users: data.users || 5,
      commands: 98,
      uptime: data.uptime || Date.now(),
      lastUpdated: new Date().toISOString()
    }
  } catch (error) {
    // Fallback data when API is not available
    return {
      isOnline: false,
      guilds: 1,
      users: 5,
      commands: 98,
      uptime: Date.now(),
      lastUpdated: new Date().toISOString()
    }
  }
}

// Commands data
export const fetchCommands = async () => {
  try {
    const data = await api.get('/commands')
    return data.commands || []
  } catch (error) {
    // Fallback command data
    return [
      {
        category: 'Profile & Collection',
        icon: '👤',
        color: '#FF69B4',
        description: 'Manage your profile and character collection',
        commands: [
          { name: '!profile', description: 'Display your user profile', usage: '!profile [member]', cooldown: 5 },
          { name: '!collection', description: 'View your character collection', usage: '!collection [page]', cooldown: 3 },
          { name: '!inspect', description: 'Get detailed character information', usage: '!inspect <character>', cooldown: 2 }
        ]
      },
      {
        category: 'Combat & Battles',
        icon: '⚔️',
        color: '#FF4444',
        description: 'Engage in strategic battles',
        commands: [
          { name: '!battle', description: 'Start battles against NPCs or players', usage: '!battle [character]', cooldown: 30 },
          { name: '!arena', description: 'Enter competitive arena battles', usage: '!arena [character]', cooldown: 60 },
          { name: '!duel', description: 'Challenge another player', usage: '!duel @user', cooldown: 120 }
        ]
      }
    ]
  }
}

// Characters data
export const fetchCharacters = async () => {
  try {
    const data = await api.get('/characters')
    return data.characters || []
  } catch (error) {
    // Fallback character data
    return [
      {
        id: 1,
        name: 'Minotaur',
        rarity: 'R',
        element: 'Neutral',
        hp: 500,
        atk: 50,
        def: 25,
        image: '/characters/minotaur.webp'
      },
      {
        id: 2,
        name: 'Sakura',
        rarity: 'SSR',
        element: 'Nature',
        hp: 800,
        atk: 120,
        def: 60,
        image: '/characters/sakura.webp'
      }
    ]
  }
}

// Server statistics
export const fetchServerStats = async () => {
  try {
    const data = await api.get('/server/stats')
    return data
  } catch (error) {
    return {
      memberCount: 5,
      onlineCount: 2,
      serverName: 'KoKoroMichi Server',
      lastUpdated: new Date().toISOString()
    }
  }
}

// Leaderboard data
export const fetchLeaderboard = async (type = 'level') => {
  try {
    const data = await api.get(`/leaderboard/${type}`)
    return data.leaderboard || []
  } catch (error) {
    return []
  }
}

export default api