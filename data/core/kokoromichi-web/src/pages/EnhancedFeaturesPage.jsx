import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sword, Users, Crown, Heart, Zap, Shield, Star, Gift, 
  Sparkles, Flame, Droplets, Globe, Leaf, ChevronRight,
  Target, Trophy, Coins, Bot, Code, Database, Gamepad2
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const EnhancedFeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(null)
  const { theme } = useTheme()

  // Comprehensive features based on actual bot analysis
  const gameFeatures = [
    {
      id: 'collection',
      icon: Crown,
      title: 'Advanced Character Collection',
      subtitle: '7-Tier Rarity System',
      description: 'Collect legendary characters across 7 rarity tiers with unique abilities and evolution paths',
      color: '#ffd700',
      stats: '50+ Characters',
      details: {
        overview: 'KoKoroMichi features one of the most sophisticated character collection systems in Discord gaming.',
        features: [
          'Seven rarity tiers: N, R, SR, SSR, UR, LR, Mythic',
          'Each character has unique stats, skills, and growth potential',
          'Character affection system for deeper relationships',
          'Evolution and awakening mechanics for massive power increases',
          'Gallery system with unlockable character art',
          'Character-specific fan clubs and social features'
        ],
        commands: ['!summon', '!collection', '!inspect', '!gallery', '!upgrade', '!potential'],
        technical: 'Individual JSON files for each character with detailed stats, skills, and progression systems. Advanced caching for optimized performance.'
      }
    },
    {
      id: 'combat',
      icon: Sword,
      title: 'Strategic Combat Engine',
      subtitle: 'Turn-based with 12+ Buff Systems',
      description: 'Advanced RPG battles with comprehensive buff system incorporating guild bonuses, pet abilities, dream buffs, and more',
      color: '#ef4444',
      stats: '98+ Combat Commands',
      details: {
        overview: 'The most advanced combat system ever built for Discord, featuring strategic depth rivaling traditional RPGs.',
        features: [
          'Turn-based combat with elemental advantages',
          'Guild bonuses and team-based strategies',
          'Pet companion abilities and synergies',
          'Dream buffs from story sequences',
          'Affection bonuses from character relationships',
          'Trait effects and relic powers',
          'Arena rankings and tournament systems',
          'World boss raids requiring team coordination',
          'PvP dueling with skill-based matchmaking'
        ],
        commands: ['!battle', '!arena', '!pvp_duel', '!bosses', '!join_raid'],
        technical: 'Advanced combat engine in utils/advanced_combat.py with comprehensive buff calculation system and real-time battle state management.'
      }
    },
    {
      id: 'social',
      icon: Users,
      title: 'Guild & Social Systems',
      subtitle: 'Team-based Collaborative Gameplay',
      description: 'Team up with friends, form powerful guilds, and compete in large-scale collaborative battles',
      color: '#3b82f6',
      stats: 'Guild System',
      details: {
        overview: 'Rich social features that bring players together through guilds, fan clubs, and community events.',
        features: [
          'Guild creation and management systems',
          'Guild wars and competitive events',
          'Shared guild bonuses and resources',
          'Character-specific fan clubs',
          'Community contests and competitions',
          'Mood polls and interactive events',
          'Pet racing championships',
          'Social achievement tracking'
        ],
        commands: ['!guild', '!fanclubs', '!contests', '!moodpoll', '!fancontest', '!petrace'],
        technical: 'Comprehensive guild manager in utils/guild_manager.py with role-based permissions and collaborative features.'
      }
    },
    {
      id: 'relationships',
      icon: Heart,
      title: 'Character Relationships',
      subtitle: 'Deep Affection & Intimacy System',
      description: 'Build deep bonds with characters, unlock intimate interactions, and gain powerful combat bonuses',
      color: '#ec4899',
      stats: 'Affection System',
      details: {
        overview: 'Revolutionary relationship system that creates emotional bonds between players and their characters.',
        features: [
          'Multi-tier affection levels (0-100)',
          'Intimate interaction commands',
          'Relationship bonuses affecting combat',
          'Character loyalty and trust mechanics',
          'Special unlockable content at high affection',
          'Valentine and seasonal relationship events',
          'Character-specific dialogue and responses'
        ],
        commands: ['!intimate', '!relationship', '!affection'],
        technical: 'Sophisticated affection manager in utils/affinity_manager.py tracking relationship progression and unlockable content.'
      }
    },
    {
      id: 'economy',
      icon: Coins,
      title: 'Advanced Economy',
      subtitle: 'Multi-Currency Trading System',
      description: 'Complex trading system with investments, auctions, and multiple currencies for strategic gameplay',
      color: '#10b981',
      stats: 'Multi-Currency',
      details: {
        overview: 'Sophisticated economic simulation with multiple currencies, investment opportunities, and trading mechanics.',
        features: [
          'Multiple currencies: Gold, Gems, Materials, Event Tokens',
          'Investment system with virtual businesses',
          'Auction house for rare item trading',
          'Daily rewards and login streaks',
          'Economic events and market fluctuations',
          'Player-to-player trading systems',
          'Store with dynamic pricing'
        ],
        commands: ['!store', '!invest', '!auction', '!daily', '!businesses', '!collect'],
        technical: 'Advanced economy manager in utils/economy_manager.py with investment tracking and market simulation.'
      }
    },
    {
      id: 'crafting',
      icon: Shield,
      title: 'Crafting & Equipment',
      subtitle: 'Powerful Relic System',
      description: 'Item creation and enhancement with recipes, material gathering, and legendary relic forging',
      color: '#f59e0b',
      stats: 'Relic Powers',
      details: {
        overview: 'Deep crafting system allowing players to create powerful equipment and enhance their characters.',
        features: [
          'Recipe-based crafting system',
          'Material gathering and resource management',
          'Legendary relic forging',
          'Equipment enhancement and upgrading',
          'Character-specific equipment bonuses',
          'Crafting achievements and mastery levels',
          'Rare material discovery through exploration'
        ],
        commands: ['!craft', '!gather', '!materials', '!relics', '!equip_relic', '!forge_relic'],
        technical: 'Comprehensive crafting manager in utils/crafting_manager.py with recipe systems and material tracking.'
      }
    },
    {
      id: 'events',
      icon: Star,
      title: 'Dynamic Events System',
      subtitle: 'Seasonal & Dream Events',
      description: 'Seasonal events, dream sequences, daily quests, and limited-time content with exclusive rewards',
      color: '#6366f1',
      stats: 'Live Events',
      details: {
        overview: 'Rich event system providing constantly refreshing content and seasonal experiences.',
        features: [
          'Seasonal events with unique themes',
          'Dream sequences with immersive storytelling',
          'Daily quest and mission systems',
          'Random world events and mishaps',
          'Achievement tracking and rewards',
          'Limited-time exclusive content',
          'Community-wide participation events'
        ],
        commands: ['!events', '!dreams', '!quests', '!daily', '!achievements', '!lore'],
        technical: 'Dynamic event manager in utils/seasonal_manager.py with automated event cycling and reward distribution.'
      }
    },
    {
      id: 'minigames',
      icon: Gamepad2,
      title: 'Mini-Games & Entertainment',
      subtitle: '10+ Interactive Games',
      description: 'Various mini-games, trivia, gambling, and entertainment features for casual fun',
      color: '#8b5cf6',
      stats: '10+ Games',
      details: {
        overview: 'Diverse collection of mini-games providing entertainment and additional ways to earn rewards.',
        features: [
          'Slot machine gambling with progressive jackpots',
          'Rock Paper Scissors tournaments',
          'Number guessing with difficulty levels',
          'Trivia challenges across multiple topics',
          'Magic 8-ball for decision making',
          'Dice rolling with custom sides',
          'Choice randomizer for group decisions'
        ],
        commands: ['!games', '!slots', '!rps', '!trivia', '!8ball', '!roll', '!choose'],
        technical: 'Mini-game collection in commands/mini_games.py with scoring systems and leaderboard integration.'
      }
    }
  ]

  const technicalFeatures = [
    {
      icon: Bot,
      title: 'Enterprise Architecture',
      description: '31 command modules with modular design for scalability and maintainability',
      color: theme.primary
    },
    {
      icon: Database,
      title: 'Advanced Data Management',
      description: 'JSON-based storage with caching, backup systems, and data integrity protection',
      color: theme.secondary
    },
    {
      icon: Code,
      title: 'Discord.py Framework',
      description: 'Built on Discord.py with advanced UI components, embeds, and interactive features',
      color: theme.accent
    },
    {
      icon: Target,
      title: 'Channel Management',
      description: 'Smart channel restrictions with automatic setup and emoji-aware matching',
      color: theme.primary
    }
  ]

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ color: theme.textColor }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6" style={{ color: theme.primary }}>
            🎮 Game Features
          </h1>
          <p className="text-xl opacity-90 max-w-4xl mx-auto">
            Discover the most advanced Discord RPG bot ever created. With 31 command modules, 
            98+ commands, and revolutionary game systems, KoKoroMichi offers unparalleled depth 
            and strategic gameplay.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {gameFeatures.map((feature, index) => {
            const Icon = feature.icon
            const isActive = activeFeature === feature.id

            return (
              <motion.div
                key={feature.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setActiveFeature(isActive ? null : feature.id)}
              >
                <div 
                  className="p-8 rounded-2xl border transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: isActive ? feature.color : theme.borderColor,
                    boxShadow: isActive ? `0 0 30px ${feature.color}20` : 'none'
                  }}
                >
                  {/* Feature Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: feature.color }}
                      >
                        <Icon size={32} color="white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold" style={{ color: theme.primary }}>
                          {feature.title}
                        </h3>
                        <p className="opacity-80 font-medium">{feature.subtitle}</p>
                        <span 
                          className="text-sm px-3 py-1 rounded-full"
                          style={{
                            backgroundColor: feature.color + '20',
                            color: feature.color
                          }}
                        >
                          {feature.stats}
                        </span>
                      </div>
                    </div>
                    <ChevronRight 
                      size={24} 
                      className={`transition-transform duration-300 ${isActive ? 'rotate-90' : ''}`}
                      style={{ color: feature.color }}
                    />
                  </div>

                  <p className="text-lg leading-relaxed opacity-90 mb-4">
                    {feature.description}
                  </p>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 border-t space-y-6" style={{ borderColor: theme.borderColor }}>
                          <div>
                            <h4 className="text-lg font-bold mb-3" style={{ color: feature.color }}>
                              📋 Overview
                            </h4>
                            <p className="opacity-80 leading-relaxed">
                              {feature.details.overview}
                            </p>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold mb-3" style={{ color: feature.color }}>
                              ✨ Key Features
                            </h4>
                            <ul className="space-y-2">
                              {feature.details.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start space-x-3">
                                  <span style={{ color: feature.color }}>•</span>
                                  <span className="opacity-80">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold mb-3" style={{ color: feature.color }}>
                              ⚡ Related Commands
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {feature.details.commands.map(cmd => (
                                <code 
                                  key={cmd}
                                  className="px-3 py-1 rounded text-sm font-mono"
                                  style={{
                                    backgroundColor: feature.color + '20',
                                    color: feature.color
                                  }}
                                >
                                  {cmd}
                                </code>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-lg font-bold mb-3" style={{ color: feature.color }}>
                              🛠️ Technical Implementation
                            </h4>
                            <p className="opacity-70 text-sm leading-relaxed font-mono">
                              {feature.details.technical}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Technical Features */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-8" style={{ color: theme.primary }}>
            🛠️ Technical Excellence
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl border text-center hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.borderColor
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-lg mx-auto mb-4 flex items-center justify-center"
                    style={{ backgroundColor: feature.color }}
                  >
                    <Icon size={24} color="white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.primary }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm opacity-80 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: <Bot size={32} />, number: '98+', label: 'Total Commands' },
            { icon: <Code size={32} />, number: '31', label: 'Bot Modules' },
            { icon: <Crown size={32} />, number: '50+', label: 'Characters' },
            { icon: <Trophy size={32} />, number: '7', label: 'Rarity Tiers' }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 rounded-xl border"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor
              }}
            >
              <div className="flex justify-center mb-4" style={{ color: theme.primary }}>
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2" style={{ color: theme.primary }}>
                {stat.number}
              </div>
              <div className="opacity-70 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default EnhancedFeaturesPage