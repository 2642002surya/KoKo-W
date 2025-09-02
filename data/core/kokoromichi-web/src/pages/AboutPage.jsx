import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sword, Crown, Users, Heart, Zap, Trophy, Shield, Star, 
  Target, Coins, Gem, Gamepad2, Swords, Crown as GuildIcon,
  Bot, Code, Database, Server
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const AboutPage = () => {
  const { theme } = useTheme()
  const gameFeatures = [
    {
      icon: Crown,
      title: 'Character Collection System',
      description: 'Summon and collect characters across 7 rarity tiers',
      details: [
        '🌿 N (Normal) - 60.4% chance - Base power characters',
        '🔧 R (Rare) - 25% chance - Enhanced abilities',
        '🔥 SR (Super Rare) - 10% chance - Strong combat prowess',
        '🌈✨ SSR (Super Super Rare) - 3% chance - Elite tier',
        '🌟 UR (Ultra Rare) - 1% chance - Legendary power',
        '⚡ LR (Legendary Rare) - 0.5% chance - Mythic abilities',
        '🌈✨✨ Mythic - 0.1% chance - Ultimate characters'
      ],
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Sword,
      title: 'Advanced Combat Engine',
      description: 'Strategic turn-based battles with deep mechanics',
      details: [
        '⚔️ Turn-based strategic combat with elemental advantages',
        '💪 Comprehensive buff system (guild, pet, dream, affinity)',
        '🎯 Critical hits, dodging, and special abilities',
        '🔥 Trait effects and relic powers enhance combat',
        '🏆 Battle rewards include XP, gold, and rare items',
        '🛡️ Defensive strategies and team synergies'
      ],
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Guild System & Factions',
      description: 'Team-based gameplay with collaborative features',
      details: [
        '🏰 Create or join guilds with up to 50 members',
        '☀️ Celestial Order - Light guardians (+20% battle XP)',
        '🌙 Shadow Covenant - Stealth masters (+30% crit chance)',
        '🌿 Elemental Harmony - Nature wielders (+25% elemental damage)',
        '🔮 Arcane Scholars - Magic seekers (+30% spell power)',
        '💰 Guild banks, territories, and collaborative quests'
      ],
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Heart,
      title: 'Relationship & Affinity System',
      description: 'Build deep bonds with characters for combat bonuses',
      details: [
        '💕 Develop affection through interactions and gifts',
        '🎁 Intimate moments unlock special character abilities',
        '✨ Affinity bonuses enhance battle performance',
        '🌟 Character loyalty affects their combat effectiveness',
        '💖 Romance system with multiple relationship levels',
        '🎭 Character personalities affect interaction outcomes'
      ],
      color: 'from-pink-500 to-red-500'
    },
    {
      icon: Zap,
      title: 'Economy & Trading',
      description: 'Complex economic system with multiple currencies',
      details: [
        '💰 Gold and Gem dual-currency system',
        '📈 Investment system with market fluctuations',
        '🏪 Player-driven auction house for rare items',
        '🎰 Daily rewards and login bonuses',
        '🔄 Trading system between players',
        '💎 Crafting materials and enhancement resources'
      ],
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Trophy,
      title: 'Competitive Features',
      description: 'Ranked battles, tournaments, and leaderboards',
      details: [
        '🏟️ Arena battles with ranking system',
        '👑 Global leaderboards for various categories',
        '🎪 Seasonal tournaments with exclusive rewards',
        '⚡ PvP duels between players',
        '🐉 World boss raids requiring team coordination',
        '🏅 Achievement system tracking player progress'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Gamepad2,
      title: 'Mini-Games & Activities',
      description: 'Diverse entertainment beyond combat',
      details: [
        '🃏 Blackjack, Slots, and Casino games',
        '🎲 Roulette and Lottery systems',
        '🧠 Trivia contests with knowledge rewards',
        '🏃 Pet races and companion adventures',
        '🎨 Fan art contests and creativity events',
        '🔍 Treasure hunts and exploration quests'
      ],
      color: 'from-indigo-500 to-cyan-500'
    },
    {
      icon: Star,
      title: 'Pet Companion System',
      description: 'Loyal companions that aid in battles and adventures',
      details: [
        '🐾 Adopt pets from multiple species with unique abilities',
        '🍖 Pet care system - feeding, training, and happiness',
        '⚡ Pets provide combat bonuses and special abilities',
        '🎯 Send pets on solo adventures for rewards',
        '💝 Pet loyalty affects their effectiveness',
        '🌟 Pet evolution and skill development'
      ],
      color: 'from-orange-500 to-pink-500'
    }
  ]

  const techSpecs = [
    {
      icon: Bot,
      title: 'Advanced Architecture',
      specs: ['33 Command Modules', '98+ Interactive Commands', 'Modular Design', 'Error Recovery']
    },
    {
      icon: Database,
      title: 'Data Management',
      specs: ['JSON-Based Storage', 'Automatic Backups', 'Real-time Updates', 'Performance Caching']
    },
    {
      icon: Server,
      title: 'Discord Integration',
      specs: ['Smart Channel Management', 'Auto-Setup Systems', 'Role-Based Access', 'Interactive UI']
    },
    {
      icon: Code,
      title: 'Game Systems',
      specs: ['11+ Major Systems', 'Cross-System Integration', 'Seasonal Events', 'Achievement Tracking']
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-20"
        >
          <h1 className="text-6xl font-bold mb-6" style={{ color: theme.primary }}>🌸 About KoKoroMichi</h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            The most advanced Discord RPG bot ever created, featuring comprehensive character collection, 
            strategic combat, guild systems, and endless adventures in a beautifully crafted anime-inspired world.
          </p>
        </motion.div>

        {/* Version Info */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center space-x-4 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-pink-500/20">
            <span className="text-lg font-semibold text-pink-400">Version 3.1.1</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-300">Latest Release</span>
            <span className="text-gray-400">•</span>
            <span className="text-green-400">✅ Fully Operational</span>
          </div>
        </motion.div>

        {/* Game Features Grid */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primary }}>🎮 Game Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {gameFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-8 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-pink-500/50 transition-all duration-300"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}>
                    <Icon size={32} color="white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-center mb-6">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <div key={idx} className="text-sm text-gray-300 flex items-start space-x-2">
                        <span className="flex-shrink-0 w-4 text-center">{detail.split(' ')[0]}</span>
                        <span>{detail.substring(detail.indexOf(' ') + 1)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Technical Specifications */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primary }}>⚙️ Technical Excellence</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techSpecs.map((spec, index) => {
              const Icon = spec.icon
              return (
                <motion.div
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="p-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800/40 to-gray-900/40 hover:border-pink-500/30 transition-all duration-300 text-center"
                >
                  <Icon size={24} className="mx-auto mb-4 text-pink-400" />
                  <h3 className="text-lg font-bold mb-3 text-white">{spec.title}</h3>
                  <div className="space-y-1">
                    {spec.specs.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-400">{item}</div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Command Categories */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-12" style={{ color: theme.primary }}>📋 Command Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { category: 'Profile & Collection', commands: ['profile', 'inspect', 'inventory', 'top', 'compare'], icon: '👤' },
              { category: 'Summoning & Gacha', commands: ['summon', 'pull', 'gacha', 'pity', 'rates'], icon: '🎰' },
              { category: 'Combat & Battles', commands: ['battle', 'duel', 'arena', 'tournament', 'pvp'], icon: '⚔️' },
              { category: 'Economy & Trading', commands: ['store', 'buy', 'auction', 'invest', 'daily'], icon: '💰' },
              { category: 'Guild & Social', commands: ['guild', 'faction', 'leaderboard', 'fan_club'], icon: '🏰' },
              { category: 'Character Growth', commands: ['upgrade', 'train', 'potential', 'traits', 'relics'], icon: '📈' },
              { category: 'Pets & Companions', commands: ['pets', 'adopt_pet', 'feed', 'pet_adventure'], icon: '🐾' },
              { category: 'Mini-Games & Fun', commands: ['blackjack', 'slots', 'trivia', 'lottery', 'contests'], icon: '🎮' },
              { category: 'Quests & Events', commands: ['quests', 'events', 'seasonal', 'dreams', 'lore'], icon: '📜' }
            ].map((cat, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-pink-500/30 transition-all duration-300"
              >
                <div className="text-3xl text-center mb-4">{cat.icon}</div>
                <h3 className="text-lg font-bold mb-3 text-center text-white">{cat.category}</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {cat.commands.map((cmd, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs bg-pink-500/20 text-pink-300 rounded">
                      !{cmd}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Key Statistics */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-12" style={{ color: theme.primary }}>📊 By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '98+', label: 'Commands', icon: '⚡' },
              { number: '33', label: 'Modules', icon: '🧩' },
              { number: '50+', label: 'Characters', icon: '👥' },
              { number: '11+', label: 'Game Systems', icon: '🎯' },
              { number: '7', label: 'Rarity Tiers', icon: '🌟' },
              { number: '4', label: 'Guild Factions', icon: '🏰' },
              { number: '5+', label: 'Pet Species', icon: '🐾' },
              { number: '∞', label: 'Adventures', icon: '🌍' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-pink-500/50 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>{stat.number}</div>
                <div className="text-sm font-medium text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AboutPage