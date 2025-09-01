const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs').promises;
const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://kokoromichi.replit.app', 'https://*.replit.app'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Discord client setup (for server stats)
const discord = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

// Global variables
let serverStats = {
  memberCount: 0,
  onlineCount: 0,
  serverName: 'Tenshi no Yami Kyōkai',
  lastUpdated: new Date().toISOString()
};

// Login to Discord (optional for stats)
if (process.env.DISCORD_TOKEN) {
  discord.login(process.env.DISCORD_TOKEN).catch(console.error);
  
  discord.on('ready', async () => {
    console.log(`🤖 Discord client logged in as ${discord.user.tag}`);
    await updateServerStats();
    // Update stats every 5 minutes
    setInterval(updateServerStats, 5 * 60 * 1000);
  });
}

// Update server statistics
async function updateServerStats() {
  try {
    const guild = discord.guilds.cache.first();
    if (guild) {
      await guild.members.fetch();
      const members = guild.members.cache;
      const onlineMembers = members.filter(member => 
        member.presence?.status === 'online' || 
        member.presence?.status === 'idle' || 
        member.presence?.status === 'dnd'
      );
      
      serverStats = {
        memberCount: members.size,
        onlineCount: onlineMembers.size,
        serverName: guild.name,
        lastUpdated: new Date().toISOString()
      };
      
      console.log(`📊 Updated server stats: ${serverStats.memberCount} members, ${serverStats.onlineCount} online`);
    }
  } catch (error) {
    console.error('Error updating server stats:', error);
  }
}

// API Routes

// Get server statistics
app.get('/api/server-stats', (req, res) => {
  res.json(serverStats);
});

// Get waifu/character data
app.get('/api/waifus', async (req, res) => {
  try {
    const charactersPath = path.join(__dirname, '../../assets/characters');
    const files = await fs.readdir(charactersPath);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const characters = [];
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(charactersPath, file);
        const data = await fs.readFile(filePath, 'utf8');
        const character = JSON.parse(data);
        characters.push({
          ...character,
          id: file.replace('.json', ''),
          filename: file
        });
      } catch (error) {
        console.error(`Error reading character file ${file}:`, error);
      }
    }
    
    // Sort by rarity and name
    characters.sort((a, b) => {
      const rarityOrder = { 'N': 1, 'R': 2, 'SR': 3, 'SSR': 4, 'UR': 5, 'LR': 6, 'Mythic': 7 };
      const aRarity = rarityOrder[a.rarity] || 0;
      const bRarity = rarityOrder[b.rarity] || 0;
      if (aRarity !== bRarity) return bRarity - aRarity;
      return a.name.localeCompare(b.name);
    });
    
    res.json({
      success: true,
      count: characters.length,
      characters: characters
    });
  } catch (error) {
    console.error('Error fetching waifus:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch character data'
    });
  }
});

// Get commands data with usage stats
app.get('/api/commands', async (req, res) => {
  try {
    // Read command modules to build commands list
    const commandsPath = path.join(__dirname, '../../commands');
    const files = await fs.readdir(commandsPath);
    const pyFiles = files.filter(file => file.endsWith('.py') && file !== '__init__.py');
    
    const commands = [];
    const categories = {
      'admin': { name: 'Administration', description: 'Bot management and server setup', icon: '🛡️' },
      'profile': { name: 'Profile & Collection', description: 'Character management and viewing', icon: '👤' },
      'summon': { name: 'Summoning', description: 'Gacha and character acquisition', icon: '🎲' },
      'battle': { name: 'Combat', description: 'Battle system and PvP', icon: '⚔️' },
      'arena': { name: 'Arena', description: 'Tournament and competitive battles', icon: '🏟️' },
      'guild': { name: 'Guilds', description: 'Team management and collaboration', icon: '🏰' },
      'economy': { name: 'Economy', description: 'Trading, investments, and marketplace', icon: '💰' },
      'crafting': { name: 'Crafting', description: 'Item creation and enhancement', icon: '🔨' },
      'pets': { name: 'Pets', description: 'Companion management and care', icon: '🐾' },
      'intimate': { name: 'Relationships', description: 'Character affection and interactions', icon: '💖' },
      'events': { name: 'Events', description: 'Seasonal activities and special content', icon: '🎉' },
      'mini_games': { name: 'Mini Games', description: 'Fun activities and challenges', icon: '🎮' },
      'misc': { name: 'Miscellaneous', description: 'Utility and general commands', icon: '🔧' }
    };
    
    // Generate command data based on file names
    for (const file of pyFiles) {
      const category = file.replace('.py', '');
      const categoryData = categories[category] || { 
        name: category.charAt(0).toUpperCase() + category.slice(1), 
        description: `${category} related commands`,
        icon: '📋'
      };
      
      // Simulate command data (in real implementation, parse Python files)
      const commandCount = Math.floor(Math.random() * 10) + 1;
      for (let i = 0; i < commandCount; i++) {
        commands.push({
          name: `${category}_command_${i + 1}`,
          description: `A ${category} command that performs specific functionality`,
          category: category,
          categoryData: categoryData,
          cooldown: Math.floor(Math.random() * 300) + 5,
          usageCount: Math.floor(Math.random() * 1000),
          restricted: category === 'admin'
        });
      }
    }
    
    res.json({
      success: true,
      count: commands.length,
      categories: Object.keys(categories).length,
      commands: commands
    });
  } catch (error) {
    console.error('Error fetching commands:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch commands data'
    });
  }
});

// Submit FAQ to Discord webhook
app.post('/api/faq', async (req, res) => {
  try {
    const { question, email, name } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Question is required'
      });
    }
    
    // Discord webhook URL for FAQ channel
    const webhookUrl = process.env.DISCORD_FAQ_WEBHOOK;
    
    if (!webhookUrl) {
      console.error('Discord webhook URL not configured');
      return res.status(500).json({
        success: false,
        error: 'FAQ submission not configured'
      });
    }
    
    const embed = {
      title: '❓ New FAQ Submission',
      description: question.trim(),
      color: 0x5865F2,
      fields: [
        {
          name: '👤 Submitted by',
          value: name && name.trim() ? name.trim() : 'Anonymous',
          inline: true
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'KoKoroMichi Website FAQ'
      }
    };
    
    if (email && email.trim()) {
      embed.fields.push({
        name: '📧 Contact',
        value: email.trim(),
        inline: true
      });
    }
    
    await axios.post(webhookUrl, {
      embeds: [embed]
    });
    
    res.json({
      success: true,
      message: 'FAQ submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit FAQ'
    });
  }
});

// Get FAQ data
app.get('/api/faq', (req, res) => {
  const faqData = [
    {
      id: 1,
      question: 'How do I summon waifus?',
      answer: 'Use the !summon command to get random characters. You can earn summon currency through daily rewards, battles, and completing quests.',
      category: 'summoning'
    },
    {
      id: 2,
      question: 'What are the character rarities?',
      answer: 'Characters have rarities: N (Normal), R (Rare), SR (Super Rare), SSR (Super Super Rare), UR (Ultra Rare), LR (Legendary Rare), and Mythic (highest tier).',
      category: 'characters'
    },
    {
      id: 3,
      question: 'How does the battle system work?',
      answer: 'Battles use turn-based combat with ATK, DEF, HP stats. Characters have skills, elements, and traits that affect combat. Guild bonuses, pet abilities, and relics provide additional effects.',
      category: 'combat'
    },
    {
      id: 4,
      question: 'How do I join a guild?',
      answer: 'Use !guild join [guild_name] to join an existing guild, or !guild create [name] to start your own. Guilds provide bonuses and collaborative activities.',
      category: 'guilds'
    },
    {
      id: 5,
      question: 'What can I do with pets?',
      answer: 'Pets provide passive bonuses in battle, can be trained to increase their stats, and participate in special pet events and races.',
      category: 'pets'
    },
    {
      id: 6,
      question: 'How does crafting work?',
      answer: 'Collect materials through battles and events, then use !craft to create items and relics. Higher tier recipes require rare materials.',
      category: 'crafting'
    }
  ];
  
  res.json({
    success: true,
    faqs: faqData
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 KoKoroMichi Backend running on port ${PORT}`);
  console.log(`📊 Server stats will be available at http://localhost:${PORT}/api/server-stats`);
  console.log(`🎭 Waifus data available at http://localhost:${PORT}/api/waifus`);
  console.log(`⚡ Commands data available at http://localhost:${PORT}/api/commands`);
});

module.exports = app;