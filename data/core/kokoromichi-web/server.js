import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}))
app.use(compression())
app.use(cors({
  origin: [
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    'http://0.0.0.0:5000',
    'https://*.replit.app',
    'https://*.replit.dev',
    /\.replit\.app$/,
    /\.replit\.dev$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
})
app.use('/api/', limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Mock Discord Bot Data
const mockBotData = {
  stats: {
    isOnline: true,
    guilds: 1,
    users: 5,
    commands: 98,
    uptime: Date.now() - (24 * 60 * 60 * 1000), // 24 hours ago
    lastUpdated: new Date().toISOString()
  },
  commands: [
    {
      category: 'Profile & Collection',
      icon: '👤',
      color: '#FF69B4',
      description: 'Manage your profile and character collection',
      commands: [
        { name: '!profile', description: 'Display your user profile with detailed stats and achievements', usage: '!profile [member]', cooldown: 5 },
        { name: '!collection', description: 'View your character collection with filtering options', usage: '!collection [page] [rarity]', cooldown: 3 },
        { name: '!inspect', description: 'Get detailed character information including stats and abilities', usage: '!inspect <character>', cooldown: 2 },
        { name: '!inventory', description: 'View your items, equipment, and resources', usage: '!inventory [category]', cooldown: 3 },
        { name: '!gallery', description: 'Browse your character gallery and achievements', usage: '!gallery [character]', cooldown: 2 }
      ]
    },
    {
      category: 'Combat & Battles',
      icon: '⚔️',
      color: '#FF4444',
      description: 'Engage in strategic battles and combat',
      commands: [
        { name: '!battle', description: 'Start strategic battles against NPCs with turn-based combat', usage: '!battle [character] [difficulty]', cooldown: 30 },
        { name: '!arena', description: 'Enter competitive arena battles for rankings and rewards', usage: '!arena [character] [tier]', cooldown: 60 },
        { name: '!duel', description: 'Challenge another player to PvP combat', usage: '!duel @user [character]', cooldown: 120 },
        { name: '!boss', description: 'Fight powerful raid bosses with guild members', usage: '!boss [boss_name]', cooldown: 300 },
        { name: '!pvp_queue', description: 'Join the PvP matchmaking queue', usage: '!pvp_queue [rank_type]', cooldown: 60 }
      ]
    },
    {
      category: 'Character Management',
      icon: '👥',
      color: '#9400D3',
      description: 'Summon, train, and upgrade your characters',
      commands: [
        { name: '!summon', description: 'Summon new characters using various gacha mechanics', usage: '!summon [banner] [amount]', cooldown: 10 },
        { name: '!upgrade', description: 'Upgrade character levels, stats, and abilities', usage: '!upgrade <character> [stat]', cooldown: 5 },
        { name: '!train', description: 'Train characters to improve their combat effectiveness', usage: '!train <character> [hours]', cooldown: 30 },
        { name: '!evolve', description: 'Evolve characters to higher rarities with materials', usage: '!evolve <character>', cooldown: 60 },
        { name: '!traits', description: 'Manage character traits and passive abilities', usage: '!traits <character> [action]', cooldown: 10 }
      ]
    },
    {
      category: 'Economy & Trading',
      icon: '💰',
      color: '#FFD700',
      description: 'Manage resources, trading, and economy',
      commands: [
        { name: '!store', description: 'Browse and purchase items from the in-game store', usage: '!store [category] [item]', cooldown: 3 },
        { name: '!sell', description: 'Sell characters or items for gold and resources', usage: '!sell <item> [amount]', cooldown: 5 },
        { name: '!trade', description: 'Trade characters and items with other players', usage: '!trade @user', cooldown: 60 },
        { name: '!auction', description: 'Participate in character and item auctions', usage: '!auction [bid/list] [item]', cooldown: 30 },
        { name: '!invest', description: 'Invest gold in various financial instruments', usage: '!invest [type] [amount]', cooldown: 120 }
      ]
    },
    {
      category: 'Guild System',
      icon: '🏰',
      color: '#4169E1',
      description: 'Guild management and collaborative features',
      commands: [
        { name: '!guild', description: 'Access guild information and management options', usage: '!guild [action]', cooldown: 5 },
        { name: '!guild_create', description: 'Create a new guild with custom settings', usage: '!guild_create <name> [description]', cooldown: 86400 },
        { name: '!guild_join', description: 'Join an existing guild or respond to invitations', usage: '!guild_join <guild_name>', cooldown: 300 },
        { name: '!guild_raid', description: 'Participate in guild raids and cooperative battles', usage: '!guild_raid [boss]', cooldown: 600 },
        { name: '!guild_donate', description: 'Donate resources to support your guild', usage: '!guild_donate <resource> [amount]', cooldown: 60 }
      ]
    },
    {
      category: 'Social & Relationships',
      icon: '❤️',
      color: '#FF1493',
      description: 'Character relationships and social features',
      commands: [
        { name: '!affection', description: 'Manage character affection levels and relationships', usage: '!affection <character> [action]', cooldown: 30 },
        { name: '!intimate', description: 'Engage in intimate interactions with high-affection characters', usage: '!intimate <character>', cooldown: 300 },
        { name: '!fan_club', description: 'Join or manage character fan clubs', usage: '!fan_club <character> [action]', cooldown: 60 },
        { name: '!gift', description: 'Give gifts to characters to increase affection', usage: '!gift <character> <item>', cooldown: 120 },
        { name: '!date', description: 'Take characters on dates for bonuses and interactions', usage: '!date <character> [location]', cooldown: 600 }
      ]
    }
  ],
  characters: [
    {
      id: 1,
      name: 'Sakura Warrior',
      rarity: 'Mythic',
      element: 'Nature',
      hp: 1200,
      atk: 180,
      def: 90,
      description: 'A legendary warrior blessed by the cherry blossoms with incredible nature magic.',
      image: '🌸',
      skills: ['Cherry Blossom Storm', 'Nature\'s Embrace', 'Petal Dance'],
      level: 50
    },
    {
      id: 2,
      name: 'Lightning Empress',
      rarity: 'LR',
      element: 'Electric',
      hp: 800,
      atk: 220,
      def: 60,
      description: 'Master of storms and electrical magic, capable of devastating lightning attacks.',
      image: '⚡',
      skills: ['Thunder Strike', 'Chain Lightning', 'Storm Lord'],
      level: 45
    },
    {
      id: 3,
      name: 'Fire Knight',
      rarity: 'UR',
      element: 'Fire',
      hp: 1000,
      atk: 160,
      def: 120,
      description: 'A noble knight wielding flames of justice against the forces of darkness.',
      image: '🔥',
      skills: ['Flame Slash', 'Phoenix Rising', 'Inferno Shield'],
      level: 40
    },
    {
      id: 4,
      name: 'Ice Queen',
      rarity: 'SSR',
      element: 'Ice',
      hp: 900,
      atk: 140,
      def: 80,
      description: 'Ruler of the frozen realm with complete mastery over ice and snow.',
      image: '❄️',
      skills: ['Frost Nova', 'Ice Prison', 'Absolute Zero'],
      level: 35
    },
    {
      id: 5,
      name: 'Shadow Assassin',
      rarity: 'SSR',
      element: 'Dark',
      hp: 600,
      atk: 200,
      def: 40,
      description: 'A deadly assassin who strikes from the shadows with precision and stealth.',
      image: '🌙',
      skills: ['Shadow Strike', 'Vanish', 'Death Mark'],
      level: 38
    }
  ],
  leaderboard: {
    level: [
      { rank: 1, username: 'DragonSlayer99', level: 87, guild: 'Shadow Legion' },
      { rank: 2, username: 'SakuraMaster', level: 82, guild: 'Cherry Blossoms' },
      { rank: 3, username: 'LightningLord', level: 79, guild: 'Storm Riders' },
      { rank: 4, username: 'IceQueen2024', level: 76, guild: 'Frozen Kingdom' },
      { rank: 5, username: 'FireWarrior', level: 74, guild: 'Flame Guardians' }
    ],
    power: [
      { rank: 1, username: 'DragonSlayer99', power: 15420, guild: 'Shadow Legion' },
      { rank: 2, username: 'SakuraMaster', power: 14880, guild: 'Cherry Blossoms' },
      { rank: 3, username: 'LightningLord', power: 14356, guild: 'Storm Riders' },
      { rank: 4, username: 'IceQueen2024', power: 13982, guild: 'Frozen Kingdom' },
      { rank: 5, username: 'FireWarrior', power: 13654, guild: 'Flame Guardians' }
    ]
  }
}

// API Routes
app.get('/api/bot/stats', (req, res) => {
  res.json(mockBotData.stats)
})

app.get('/api/commands', (req, res) => {
  res.json({ commands: mockBotData.commands })
})

app.get('/api/characters', (req, res) => {
  const { rarity, element, search } = req.query
  let filteredCharacters = mockBotData.characters

  if (rarity && rarity !== 'all') {
    filteredCharacters = filteredCharacters.filter(char => char.rarity === rarity)
  }

  if (element && element !== 'all') {
    filteredCharacters = filteredCharacters.filter(char => char.element === element)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredCharacters = filteredCharacters.filter(char =>
      char.name.toLowerCase().includes(searchLower) ||
      char.description.toLowerCase().includes(searchLower)
    )
  }

  res.json({ characters: filteredCharacters })
})

app.get('/api/leaderboard/:type', (req, res) => {
  const { type } = req.params
  const leaderboard = mockBotData.leaderboard[type] || mockBotData.leaderboard.level
  res.json({ leaderboard })
})

app.get('/api/server/stats', (req, res) => {
  res.json({
    memberCount: 5,
    onlineCount: 2,
    serverName: 'KoKoroMichi Development Server',
    lastUpdated: new Date().toISOString()
  })
})

// FAQ submission endpoint
app.post('/api/submit-faq', async (req, res) => {
  try {
    const { email, discord, question } = req.body
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    
    if (!webhookUrl) {
      return res.status(500).json({ error: 'Webhook not configured' })
    }

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' })
    }

    const discordEmbed = {
      embeds: [{
        title: '❓ New FAQ Submission',
        color: 0x0ea5e9,
        fields: [
          { name: '📧 Email/Contact', value: email || 'Not provided', inline: true },
          { name: '🎮 Discord', value: discord || 'Not provided', inline: true },
          { name: '❓ Question', value: question.substring(0, 1000), inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'KoKoroMichi FAQ System' }
      }]
    }

    const fetch = (await import('node-fetch')).default
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordEmbed)
    })

    if (response.ok) {
      res.json({ success: true, message: 'Question submitted successfully' })
    } else {
      throw new Error(`Discord webhook failed with status: ${response.status}`)
    }
  } catch (error) {
    console.error('FAQ submission error:', error)
    res.status(500).json({ error: 'Failed to submit question' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    uptime: process.uptime()
  })
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', message: 'The requested resource was not found.' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KoKoroMichi API Server running on port ${PORT}`)
  console.log(`🌐 API available at http://localhost:${PORT}/api`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
})