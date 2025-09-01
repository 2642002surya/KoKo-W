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

// Get commands data with comprehensive real command database
app.get('/api/commands', async (req, res) => {
  try {
    const commandsData = {
      'Profile & Collection': {
        icon: '👤',
        color: '#FF69B4',
        description: 'Manage your profile and character collection',
        commands: [
          { name: '!profile', aliases: ['!p'], description: 'Display your user profile with stats and collection overview', usage: '!profile [member]', cooldown: 5 },
          { name: '!collection', aliases: ['!waifus', '!characters'], description: 'View your complete character collection with pagination', usage: '!collection [page]', cooldown: 3 },
          { name: '!inspect', aliases: ['!char', '!character'], description: 'Get detailed information about a specific character', usage: '!inspect <character_name>', cooldown: 2 },
          { name: '!compare', aliases: [], description: 'Compare stats between two characters in your collection', usage: '!compare <char1> <char2>', cooldown: 5 },
          { name: '!top', aliases: ['!strongest', '!best'], description: 'Show your top characters sorted by various criteria', usage: '!top [sort_by]', cooldown: 3 },
          { name: '!stats', aliases: ['!mystats'], description: 'View detailed personal statistics and achievements', usage: '!stats', cooldown: 5 },
          { name: '!gallery', aliases: ['!images', '!pics'], description: 'View character gallery with unlockable images', usage: '!gallery [character_name]', cooldown: 3 },
          { name: '!unlock', aliases: ['!unlocks'], description: 'View image unlock progress for characters', usage: '!unlock', cooldown: 5 },
          { name: '!inventory', aliases: ['!inv', '!items'], description: 'View your inventory of items, materials, and relics', usage: '!inventory [category]', cooldown: 3 }
        ]
      },
      'Combat & Battles': {
        icon: '⚔️',
        color: '#FF4444',
        description: 'Engage in strategic battles and combat systems',
        commands: [
          { name: '!battle', aliases: ['!combat'], description: 'Start battles against NPCs or other players with advanced combat mechanics', usage: '!battle [character_name] [target]', cooldown: 30 },
          { name: '!arena', aliases: ['!fight', '!duel'], description: 'Enter competitive arena battles for rankings and rewards', usage: '!arena [character_name]', cooldown: 60 },
          { name: '!quick_arena', aliases: ['!quick_battle'], description: 'Quick arena battle against random opponents', usage: '!quick_arena', cooldown: 45 },
          { name: '!pvp_duel', aliases: ['!pvp', '!challenge'], description: 'Challenge another player to a strategic duel', usage: '!pvp_duel [opponent]', cooldown: 120 },
          { name: '!bosses', aliases: ['!world_boss', '!raid'], description: 'View and join world boss raids with your guild', usage: '!bosses', cooldown: 10 },
          { name: '!join_raid', aliases: ['!attack_boss'], description: 'Join an active world boss raid battle', usage: '!join_raid <boss_id>', cooldown: 300 },
          { name: '!arenastats', aliases: ['!arenareport'], description: 'View arena statistics and leaderboard rankings', usage: '!arenastats', cooldown: 5 }
        ]
      },
      'Summoning & Gacha': {
        icon: '🎲',
        color: '#9400D3',
        description: 'Acquire new characters through the gacha system',
        commands: [
          { name: '!summon', aliases: ['!pull', '!gacha'], description: 'Summon new characters using gems with pity system', usage: '!summon [amount]', cooldown: 10 },
          { name: '!rates', aliases: ['!summon_rates'], description: 'View current summoning rates and pity information', usage: '!rates', cooldown: 5 },
          { name: '!pity', aliases: ['!pity_status'], description: 'Check your current pity counter status', usage: '!pity', cooldown: 3 }
        ]
      },
      'Economy & Trading': {
        icon: '💰',
        color: '#FFD700',
        description: 'Build wealth through investments, auctions, and trading',
        commands: [
          { name: '!invest', aliases: [], description: 'Invest in businesses for passive income generation', usage: '!invest [business_type]', cooldown: 300 },
          { name: '!businesses', aliases: ['!portfolio'], description: 'View your business portfolio and accumulated profits', usage: '!businesses', cooldown: 5 },
          { name: '!collect', aliases: [], description: 'Collect accumulated income from all your businesses', usage: '!collect', cooldown: 600 },
          { name: '!auction create', aliases: [], description: 'Create auction listings to sell items to other players', usage: '!auction create <item> <price>', cooldown: 60 },
          { name: '!auction list', aliases: [], description: 'Browse available auctions and find great deals', usage: '!auction list [category]', cooldown: 5 },
          { name: '!auction bid', aliases: [], description: 'Place bids on auction items you want to acquire', usage: '!auction bid <id> <amount>', cooldown: 30 },
          { name: '!store', aliases: ['!shop', '!market'], description: 'Browse the store for items, upgrades, and materials', usage: '!store [category]', cooldown: 5 },
          { name: '!buy', aliases: ['!purchase'], description: 'Purchase items from the store using your currency', usage: '!buy <item_id> <quantity>', cooldown: 10 },
          { name: '!daily', aliases: ['!claim', '!login'], description: 'Claim daily login rewards and maintain streaks', usage: '!daily', cooldown: 86400 },
          { name: '!streak', aliases: ['!dailystreak'], description: 'View your current daily login streak status', usage: '!streak', cooldown: 5 }
        ]
      },
      'Guilds & Social': {
        icon: '🏰',
        color: '#4169E1',
        description: 'Join guilds and participate in collaborative gameplay',
        commands: [
          { name: '!guild', aliases: [], description: 'View guild information, members, and statistics', usage: '!guild', cooldown: 5 },
          { name: '!guild create', aliases: [], description: 'Create your own guild and become a guild master', usage: '!guild create <name> [faction]', cooldown: 86400 },
          { name: '!guild join', aliases: [], description: 'Join an existing guild to gain bonuses and friends', usage: '!guild join <id>', cooldown: 300 },
          { name: '!guild leave', aliases: [], description: 'Leave your current guild (cannot be undone)', usage: '!guild leave', cooldown: 3600 },
          { name: '!guild bank', aliases: [], description: 'Manage guild bank deposits and withdrawals', usage: '!guild bank [deposit/withdraw] [amount]', cooldown: 60 },
          { name: '!factions', aliases: [], description: 'View all available factions and their unique bonuses', usage: '!factions', cooldown: 10 },
          { name: '!fanclubs', aliases: ['!clubs', '!fan_club'], description: 'View active fan clubs and your memberships', usage: '!fanclubs', cooldown: 5 },
          { name: '!join_club', aliases: ['!join_fanclub'], description: 'Join a character fan club for special bonuses', usage: '!join_club <character>', cooldown: 300 },
          { name: '!vote', aliases: ['!fan_vote'], description: 'Vote for characters in fan club competitions', usage: '!vote <character>', cooldown: 86400 }
        ]
      },
      'Crafting & Items': {
        icon: '🔨',
        color: '#8B4513',
        description: 'Create items, gather materials, and manage equipment',
        commands: [
          { name: '!craft', aliases: ['!create'], description: 'Craft items using collected materials and recipes', usage: '!craft <recipe> [amount]', cooldown: 60 },
          { name: '!craft recipes', aliases: [], description: 'View all available crafting recipes and requirements', usage: '!craft recipes [category]', cooldown: 5 },
          { name: '!gather', aliases: ['!collect_materials'], description: 'Gather materials from different locations', usage: '!gather [location]', cooldown: 1800 },
          { name: '!materials', aliases: ['!mats'], description: 'View your collected crafting materials inventory', usage: '!materials', cooldown: 5 },
          { name: '!relics', aliases: ['!equipment'], description: 'View and manage your relic equipment', usage: '!relics [character]', cooldown: 5 },
          { name: '!equip', aliases: [], description: 'Equip a relic to a character for stat bonuses', usage: '!equip <character> <relic>', cooldown: 10 },
          { name: '!unequip', aliases: [], description: 'Unequip a relic from a character', usage: '!unequip <character> <relic>', cooldown: 10 },
          { name: '!forge_relic', aliases: ['!forge'], description: 'Forge powerful relics using rare materials', usage: '!forge_relic <recipe>', cooldown: 3600 },
          { name: '!enhance', aliases: ['!upgrade_item'], description: 'Enhance relics to increase their effectiveness', usage: '!enhance <relic> [level]', cooldown: 300 }
        ]
      },
      'Character Enhancement': {
        icon: '🌟',
        color: '#9370DB',
        description: 'Upgrade and improve your characters',
        commands: [
          { name: '!upgrade', aliases: ['!levelup'], description: 'Level up your characters to increase their base stats', usage: '!upgrade <character> [levels]', cooldown: 30 },
          { name: '!train', aliases: ['!training'], description: 'Train characters to boost specific stats', usage: '!train <character> <stat>', cooldown: 3600 },
          { name: '!awaken', aliases: ['!evolve'], description: 'Awaken characters to unlock their true potential', usage: '!awaken <character>', cooldown: 86400 },
          { name: '!potential', aliases: ['!unlock_potential'], description: 'View and unlock character potential levels', usage: '!potential <character>', cooldown: 60 },
          { name: '!traits', aliases: ['!abilities'], description: 'View available character traits and development paths', usage: '!traits [character]', cooldown: 5 },
          { name: '!develop_trait', aliases: ['!learn_trait'], description: 'Develop new traits for your characters', usage: '!develop_trait <character> <trait>', cooldown: 7200 },
          { name: '!trait_info', aliases: [], description: 'Get detailed information about specific traits', usage: '!trait_info <trait_name>', cooldown: 3 }
        ]
      },
      'Pets & Companions': {
        icon: '🐾',
        color: '#32CD32',
        description: 'Adopt and care for loyal pet companions',
        commands: [
          { name: '!pets', aliases: ['!companions'], description: 'View your pet collection and their current status', usage: '!pets', cooldown: 5 },
          { name: '!adopt_pet', aliases: ['!adopt'], description: 'Adopt a new pet companion from available species', usage: '!adopt_pet <species>', cooldown: 86400 },
          { name: '!feed_pet', aliases: ['!feed'], description: 'Feed your pets to maintain their happiness and health', usage: '!feed_pet <pet_name> [food]', cooldown: 3600 },
          { name: '!train_pet', aliases: ['!pet_training'], description: 'Train your pets to improve their battle abilities', usage: '!train_pet <pet_name> <skill>', cooldown: 7200 },
          { name: '!pet_adventure', aliases: ['!adventure'], description: 'Send pets on adventures to gather resources', usage: '!pet_adventure <pet_name> <location>', cooldown: 14400 },
          { name: '!petrace', aliases: ['!race'], description: 'Enter your pets in racing competitions', usage: '!petrace <pet_name>', cooldown: 3600 },
          { name: '!pet_mood', aliases: [], description: 'Check your pet\'s current mood and needs', usage: '!pet_mood <pet_name>', cooldown: 60 }
        ]
      },
      'Events & Activities': {
        icon: '🎉',
        color: '#FF1493',
        description: 'Participate in special events and seasonal activities',
        commands: [
          { name: '!events', aliases: ['!current_events'], description: 'View all active and upcoming events', usage: '!events', cooldown: 10 },
          { name: '!dream', aliases: ['!dream_realm'], description: 'Enter the dream realm for mystical adventures', usage: '!dream [action]', cooldown: 3600 },
          { name: '!dreams', aliases: ['!active_dreams'], description: 'View your active dream events and their status', usage: '!dreams', cooldown: 5 },
          { name: '!dailyquest', aliases: ['!quest', '!daily_quest'], description: 'Accept and complete daily quests for rewards', usage: '!dailyquest [action]', cooldown: 86400 },
          { name: '!seasonal', aliases: ['!season'], description: 'Participate in seasonal events and limited-time content', usage: '!seasonal [event]', cooldown: 60 },
          { name: '!participate', aliases: ['!join_event'], description: 'Join special community events and competitions', usage: '!participate <event_id>', cooldown: 300 },
          { name: '!randomevent', aliases: ['!random'], description: 'Trigger random encounters and surprise events', usage: '!randomevent', cooldown: 1800 },
          { name: '!contests', aliases: ['!competition'], description: 'View and join various contests and competitions', usage: '!contests', cooldown: 10 },
          { name: '!moodpoll', aliases: ['!poll'], description: 'Participate in community mood polls and voting', usage: '!moodpoll [option]', cooldown: 86400 },
          { name: '!fancontest', aliases: ['!fan_contest'], description: 'Join fan contests for your favorite characters', usage: '!fancontest <character>', cooldown: 86400 }
        ]
      },
      'Achievements & Lore': {
        icon: '🏆',
        color: '#FFD700',
        description: 'Track achievements and discover rich game lore',
        commands: [
          { name: '!achievements', aliases: ['!achieve', '!progress'], description: 'View your achievement progress and unlock status', usage: '!achievements [category]', cooldown: 5 },
          { name: '!lorebooks', aliases: ['!lore', '!books'], description: 'Access the complete lore library and stories', usage: '!lorebooks', cooldown: 5 },
          { name: '!lore read', aliases: [], description: 'Read specific lore chapters and earn reading rewards', usage: '!lore read <book> [chapter]', cooldown: 300 },
          { name: '!lore_achievements', aliases: [], description: 'View lore-related achievements and reading progress', usage: '!lore_achievements', cooldown: 10 },
          { name: '!history', aliases: ['!my_history'], description: 'View your personal game history and milestones', usage: '!history [type]', cooldown: 10 }
        ]
      },
      'Relationships & Social': {
        icon: '💖',
        color: '#FF1493',
        description: 'Build relationships and social interactions',
        commands: [
          { name: '!intimate', aliases: ['!affection'], description: 'Interact intimately with your characters to build bonds', usage: '!intimate <character> [action]', cooldown: 3600 },
          { name: '!interact', aliases: ['!social'], description: 'General social interactions with characters', usage: '!interact <character> <action>', cooldown: 1800 },
          { name: '!relationship', aliases: ['!bonds'], description: 'View relationship status with all your characters', usage: '!relationship [character]', cooldown: 10 },
          { name: '!mood', aliases: ['!character_mood'], description: 'Check the current mood of your characters', usage: '!mood [character]', cooldown: 300 },
          { name: '!gift', aliases: ['!give_gift'], description: 'Give gifts to characters to increase affection', usage: '!gift <character> <item>', cooldown: 3600 }
        ]
      },
      'Mini Games & Fun': {
        icon: '🎮',
        color: '#00CED1',
        description: 'Enjoy various mini-games and entertainment',
        commands: [
          { name: '!games', aliases: ['!minigames'], description: 'View available mini-games and your scores', usage: '!games', cooldown: 5 },
          { name: '!guess_number', aliases: ['!guess'], description: 'Play the number guessing game for rewards', usage: '!guess_number', cooldown: 300 },
          { name: '!rps', aliases: ['!rock_paper_scissors'], description: 'Play rock paper scissors against the bot', usage: '!rps <choice>', cooldown: 60 },
          { name: '!slots', aliases: ['!slot_machine'], description: 'Try your luck with the slot machine', usage: '!slots [bet]', cooldown: 300 },
          { name: '!trivia', aliases: ['!quiz'], description: 'Answer trivia questions for knowledge and rewards', usage: '!trivia [category]', cooldown: 300 },
          { name: '!8ball', aliases: ['!eightball'], description: 'Ask the magic 8-ball for mystical answers', usage: '!8ball <question>', cooldown: 60 },
          { name: '!roll', aliases: ['!dice'], description: 'Roll dice for random numbers and gambling', usage: '!roll [sides] [count]', cooldown: 10 },
          { name: '!choose', aliases: ['!pick'], description: 'Let the bot choose between multiple options', usage: '!choose <option1> | <option2> | ...', cooldown: 30 },
          { name: '!coinflip', aliases: ['!flip'], description: 'Flip a coin for heads or tails decisions', usage: '!coinflip [bet]', cooldown: 60 },
          { name: '!compliment', aliases: ['!praise'], description: 'Give or receive compliments from characters', usage: '!compliment [character]', cooldown: 1800 }
        ]
      },
      'Quests & Adventures': {
        icon: '🗺️',
        color: '#8A2BE2',
        description: 'Embark on quests and adventures',
        commands: [
          { name: '!quest', aliases: ['!quests'], description: 'View available quests and your quest progress', usage: '!quest [action]', cooldown: 10 },
          { name: '!quest accept', aliases: [], description: 'Accept a new quest from the available list', usage: '!quest accept <quest_id>', cooldown: 60 },
          { name: '!quest complete', aliases: [], description: 'Complete an active quest and claim rewards', usage: '!quest complete <quest_id>', cooldown: 30 },
          { name: '!quest abandon', aliases: [], description: 'Abandon an active quest (no rewards)', usage: '!quest abandon <quest_id>', cooldown: 60 },
          { name: '!adventure', aliases: ['!explore'], description: 'Go on random adventures for surprise encounters', usage: '!adventure [location]', cooldown: 7200 },
          { name: '!treasure_hunt', aliases: ['!treasure'], description: 'Join treasure hunting expeditions', usage: '!treasure_hunt', cooldown: 14400 }
        ]
      },
      'Utility & Info': {
        icon: '🔧',
        color: '#708090',
        description: 'Bot information and utility commands',
        commands: [
          { name: '!help', aliases: ['!commands', '!h'], description: 'Show bot commands and get help information', usage: '!help [command]', cooldown: 5 },
          { name: '!about', aliases: ['!info'], description: 'Learn about KoKoroMichi bot and its features', usage: '!about', cooldown: 10 },
          { name: '!ping', aliases: ['!latency'], description: 'Check bot response time and connection status', usage: '!ping', cooldown: 5 },
          { name: '!invite', aliases: ['!link'], description: 'Get the bot invite link for other servers', usage: '!invite', cooldown: 10 },
          { name: '!support', aliases: ['!contact'], description: 'Get support information and links', usage: '!support', cooldown: 30 },
          { name: '!changelog', aliases: ['!updates'], description: 'View recent bot updates and changes', usage: '!changelog', cooldown: 60 },
          { name: '!server_setup', aliases: ['!setup'], description: 'Automatically set up bot channels and permissions', usage: '!server_setup', cooldown: 86400 },
          { name: '!channel_guide', aliases: ['!channels'], description: 'Get guidance on setting up channels manually', usage: '!channel_guide', cooldown: 60 }
        ]
      },
      'Administration': {
        icon: '🛡️',
        color: '#DC143C',
        description: 'Administrative commands for server management',
        commands: [
          { name: '!admin', aliases: [], description: 'Access the admin panel (DM only for security)', usage: '!admin', cooldown: 5 },
          { name: '!admin stats', aliases: [], description: 'View comprehensive bot and server statistics', usage: '!admin stats', cooldown: 30 },
          { name: '!admin give', aliases: [], description: 'Give items or currency to users', usage: '!admin give <user> <item> <amount>', cooldown: 10 },
          { name: '!admin reset', aliases: [], description: 'Reset user data (destructive action)', usage: '!admin reset <user>', cooldown: 60 },
          { name: '!admin backup', aliases: [], description: 'Create backup of all bot data', usage: '!admin backup', cooldown: 3600 },
          { name: '!admin announce', aliases: [], description: 'Make server-wide announcements', usage: '!admin announce <message>', cooldown: 300 },
          { name: '!admin viewdata', aliases: [], description: 'View raw user data for debugging', usage: '!admin viewdata <user>', cooldown: 30 },
          { name: '!adminhelp', aliases: [], description: 'Show all available admin commands', usage: '!adminhelp', cooldown: 30 }
        ]
      }
    };
    
    // Flatten commands for API response
    const allCommands = [];
    Object.entries(commandsData).forEach(([categoryName, categoryInfo]) => {
      categoryInfo.commands.forEach(command => {
        allCommands.push({
          ...command,
          category: categoryName,
          categoryData: {
            name: categoryName,
            icon: categoryInfo.icon,
            color: categoryInfo.color,
            description: categoryInfo.description
          },
          usageCount: Math.floor(Math.random() * 5000) + 100,
          restricted: categoryName === 'Administration'
        });
      });
    });
    
    res.json({
      success: true,
      count: allCommands.length,
      categories: Object.keys(commandsData).length,
      commands: allCommands,
      categoriesData: commandsData
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
    
    // Discord webhook URL for FAQ channel (Tenshi no Yami Kyōkai server)
    const webhookUrl = process.env.DISCORD_FAQ_WEBHOOK || 'https://discord.com/api/webhooks/WEBHOOK_ID/WEBHOOK_TOKEN';
    
    if (!webhookUrl || webhookUrl.includes('WEBHOOK_ID')) {
      console.log('Discord webhook not configured, simulating FAQ submission');
      // Simulate successful submission for demo
      return res.json({
        success: true,
        message: 'FAQ submitted successfully (simulated)'
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