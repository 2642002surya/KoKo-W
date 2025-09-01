import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Crown, Sword, Users, Heart, Zap, Trophy, Star, Gamepad2,
  Target, Coins, Gem, Shield, ArrowUp, Gift, Map, BookOpen,
  Sparkles, Flame, Droplet, Globe, Leaf, Wrench
} from 'lucide-react'

const GameSystemsPage = () => {
  const [activeSystem, setActiveSystem] = useState('summoning')

  const gameSystems = {
    summoning: {
      icon: Crown,
      title: 'Summoning & Gacha System',
      color: 'from-yellow-400 to-orange-500',
      description: 'Advanced character acquisition system with strategic mechanics',
      features: [
        {
          title: 'Rarity System',
          details: [
            '🌿 N (Normal) - 60.4% - Starter characters with basic abilities',
            '🔧 R (Rare) - 25% - Enhanced stats and special traits',
            '🔥 SR (Super Rare) - 10% - Strong combat abilities and unique skills',
            '🌈✨ SSR (Super Super Rare) - 3% - Elite tier with powerful abilities',
            '🌟 UR (Ultra Rare) - 1% - Legendary characters with game-changing skills',
            '⚡ LR (Legendary Rare) - 0.5% - Mythic-tier with ultimate abilities',
            '🌈✨✨ Mythic - 0.1% - Transcendent beings with reality-warping power'
          ]
        },
        {
          title: 'Gacha Mechanics',
          details: [
            '💎 50 gems per single summon',
            '💰 Bulk discount: 10% off for 10+ summons',
            '🎯 Pity system prevents bad luck streaks',
            '📊 Rate-up events for featured characters',
            '🔮 Guaranteed rare pulls every 10 summons',
            '✨ Special banners with exclusive characters'
          ]
        }
      ]
    },
    combat: {
      icon: Sword,
      title: 'Advanced Combat Engine',
      color: 'from-red-500 to-pink-500',
      description: 'Strategic turn-based battles with comprehensive mechanics',
      features: [
        {
          title: 'Battle Mechanics',
          details: [
            '⚔️ Turn-based strategic combat with positioning',
            '🎯 Critical hits, dodging, and counter-attacks',
            '🌪️ Elemental advantages and weaknesses',
            '🛡️ Defense skills and damage mitigation',
            '💥 Special abilities with cooldowns',
            '🔄 Combo systems and chain attacks'
          ]
        },
        {
          title: 'Buff Systems',
          details: [
            '🏰 Guild bonuses (+20% various stats)',
            '🐾 Pet companion abilities and support',
            '💭 Dream realm buffs and vision powers',
            '💖 Affinity bonuses from character relationships',
            '🧬 Trait effects enhancing combat performance',
            '🏺 Relic powers providing passive abilities'
          ]
        }
      ]
    },
    guilds: {
      icon: Users,
      title: 'Guild System & Factions',
      color: 'from-blue-500 to-purple-500',
      description: 'Team-based gameplay with collaborative features',
      features: [
        {
          title: 'Guild Mechanics',
          details: [
            '🏰 Create guilds with up to 50 members',
            '👑 Leadership roles: Leader, Officers, Members',
            '💰 Shared guild bank and resource management',
            '🗺️ Territory control and guild wars',
            '🎯 Collaborative quests and challenges',
            '📈 Guild leveling system with unlockable perks'
          ]
        },
        {
          title: 'Faction System',
          details: [
            '☀️ Celestial Order - Light guardians (+20% battle XP)',
            '🌙 Shadow Covenant - Stealth masters (+30% crit chance)',
            '🌿 Elemental Harmony - Nature wielders (+25% elemental damage)',
            '🔮 Arcane Scholars - Magic seekers (+30% spell power)',
            '⚖️ Faction conflicts and alliance politics',
            '🏆 Faction-based tournaments and rewards'
          ]
        }
      ]
    },
    relationships: {
      icon: Heart,
      title: 'Relationship & Affinity System',
      color: 'from-pink-500 to-red-500',
      description: 'Deep character bonds affecting gameplay',
      features: [
        {
          title: 'Affinity Mechanics',
          details: [
            '💕 Build relationships through interactions',
            '🎁 Gift system to increase affection levels',
            '💬 Dialogue choices affecting character mood',
            '🌟 Unlock special abilities through high affinity',
            '💒 Marriage system with exclusive benefits',
            '👥 Character compatibility and chemistry'
          ]
        },
        {
          title: 'Intimate System',
          details: [
            '🌹 Private moments with beloved characters',
            '💖 Affection levels unlock new interaction types',
            '✨ Intimate interactions provide combat bonuses',
            '🔐 Restricted to private channels for privacy',
            '🎭 Character personalities affect interactions',
            '💝 Special rewards for deep relationships'
          ]
        }
      ]
    },
    economy: {
      icon: Zap,
      title: 'Economy & Trading System',
      color: 'from-green-500 to-blue-500',
      description: 'Complex economic gameplay with multiple systems',
      features: [
        {
          title: 'Currency Systems',
          details: [
            '💰 Gold - Primary currency for basic purchases',
            '💎 Gems - Premium currency for summons and upgrades',
            '🏆 Arena Points - Earned through competitive battles',
            '🎭 Social Points - Gained from community participation',
            '⚡ Energy - Required for certain activities',
            '🔮 Essence - Rare resource for advanced crafting'
          ]
        },
        {
          title: 'Trading Features',
          details: [
            '🏪 Global marketplace with player auctions',
            '📈 Investment system with market fluctuations',
            '💱 Currency exchange and conversion rates',
            '🎁 Daily rewards and login bonuses',
            '🔄 Item trading between players',
            '📊 Economic statistics and market analysis'
          ]
        }
      ]
    },
    competitive: {
      icon: Trophy,
      title: 'Competitive Arena System',
      color: 'from-purple-500 to-pink-500',
      description: 'Ranked battles and tournaments',
      features: [
        {
          title: 'Arena Features',
          details: [
            '🏟️ Ranked battles with ELO rating system',
            '🥇 Global leaderboards across categories',
            '🏆 Seasonal tournaments with exclusive rewards',
            '⚔️ PvP duels between players',
            '👥 Team battles and group competitions',
            '🎪 Special event arenas with unique rules'
          ]
        },
        {
          title: 'Ranking System',
          details: [
            '🥉 Bronze → Silver → Gold → Platinum → Diamond',
            '👑 Master tier for elite players',
            '📊 Detailed statistics tracking',
            '🎯 Seasonal rank resets and rewards',
            '🏅 Title system based on achievements',
            '⭐ Prestige levels for dedicated players'
          ]
        }
      ]
    },
    pets: {
      icon: Star,
      title: 'Pet Companion System',
      color: 'from-orange-500 to-pink-500',
      description: 'Loyal companions enhancing your journey',
      features: [
        {
          title: 'Pet Management',
          details: [
            '🐾 Adopt from 5+ unique species with special traits',
            '🍖 Feed pets daily to maintain happiness',
            '🎾 Play and train to increase loyalty and stats',
            '💤 Pet mood affects their performance',
            '🌟 Pet evolution through care and experience',
            '🎒 Send pets on solo adventures for rewards'
          ]
        },
        {
          title: 'Combat Support',
          details: [
            '⚡ Active abilities: healing, damage, buffs',
            '🛡️ Passive bonuses: stat increases, resistances',
            '🎯 Special attacks available in battles',
            '🔄 Pet rotation strategies in team fights',
            '💕 Loyalty affects ability effectiveness',
            '🌈 Rare pets with unique ultimate abilities'
          ]
        }
      ]
    },
    progression: {
      icon: ArrowUp,
      title: 'Character Progression',
      color: 'from-indigo-500 to-cyan-500',
      description: 'Multiple paths to strengthen characters',
      features: [
        {
          title: 'Advancement Systems',
          details: [
            '📈 Level progression with stat growth',
            '🔧 Equipment and relic enhancement',
            '🧬 Trait development and specialization',
            '💎 Potential awakening for breakthrough power',
            '⚗️ Crafting system for custom equipment',
            '🌟 Prestige system for maximum level characters'
          ]
        },
        {
          title: 'Enhancement Features',
          details: [
            '🛠️ Upgrade materials from battles and quests',
            '🏺 Ancient relics with legendary powers',
            '🧙 Training modes for skill development',
            '🔬 Research system for new abilities',
            '⚖️ Stat allocation and character customization',
            '🎭 Personality development affecting interactions'
          ]
        }
      ]
    },
    events: {
      icon: Sparkles,
      title: 'Events & Activities',
      color: 'from-purple-400 to-pink-600',
      description: 'Dynamic content and seasonal activities',
      features: [
        {
          title: 'Event Types',
          details: [
            '🎃 Seasonal events with limited-time rewards',
            '💭 Dream realm adventures and visions',
            '🎨 Fan art contests and creativity challenges',
            '🏃 Pet races and companion competitions',
            '🔍 Treasure hunts and exploration quests',
            '🎭 Social events and community gatherings'
          ]
        },
        {
          title: 'Mini-Games',
          details: [
            '🃏 Blackjack with strategic card play',
            '🎰 Slot machines with jackpot systems',
            '🎲 Roulette with betting strategies',
            '🎫 Lottery with progressive jackpots',
            '🧠 Trivia contests testing knowledge',
            '🎯 Skill-based challenges and puzzles'
          ]
        }
      ]
    }
  }

  const systemKeys = Object.keys(gameSystems)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 text-gradient">
            🎮 Game Systems
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Explore the comprehensive game systems that make KoKoroMichi the most advanced Discord RPG. 
            Each system is designed to provide deep, engaging gameplay with strategic choices.
          </p>
        </motion.div>

        {/* System Tabs */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {systemKeys.map((key) => {
              const system = gameSystems[key]
              const Icon = system.icon
              const isActive = activeSystem === key
              
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveSystem(key)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r text-white shadow-lg'
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-pink-400 border border-gray-700 hover:border-pink-500/50'
                  }`}
                  style={isActive ? {
                    background: `linear-gradient(to right, ${system.color.split(' ')[1]}, ${system.color.split(' ')[3]})`
                  } : {}}
                >
                  <Icon size={20} />
                  <span>{system.title}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Active System Details */}
        <motion.div
          key={activeSystem}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-20"
        >
          {(() => {
            const system = gameSystems[activeSystem]
            const Icon = system.icon
            
            return (
              <div className="max-w-6xl mx-auto">
                {/* System Header */}
                <div className="text-center mb-12">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${system.color} flex items-center justify-center`}>
                    <Icon size={40} color="white" />
                  </div>
                  <h2 className="text-4xl font-bold mb-4 text-white">{system.title}</h2>
                  <p className="text-xl text-gray-300">{system.description}</p>
                </div>

                {/* Feature Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {system.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800/40 to-gray-900/30 hover:border-pink-500/50 transition-all duration-300"
                    >
                      <h3 className="text-2xl font-bold text-white mb-6">{feature.title}</h3>
                      <div className="space-y-3">
                        {feature.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start space-x-3">
                            <span className="flex-shrink-0 text-lg">{detail.split(' ')[0]}</span>
                            <span className="text-gray-300 leading-relaxed">
                              {detail.substring(detail.indexOf(' ') + 1)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )
          })()}
        </motion.div>

        {/* Integration Showcase */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-12 text-gradient">🔗 System Integration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Cross-System Synergy',
                description: 'All systems work together seamlessly',
                icon: '🔄',
                examples: ['Guild bonuses enhance combat', 'Pet abilities affect battles', 'Relationships unlock special content']
              },
              {
                title: 'Progressive Unlocks',
                description: 'Advancing in one system unlocks features in others',
                icon: '🔓',
                examples: ['High affinity unlocks intimate content', 'Guild rank grants access to exclusive areas', 'Combat victories unlock new pets']
              },
              {
                title: 'Balanced Economy',
                description: 'Multiple earning paths prevent grinding',
                icon: '⚖️',
                examples: ['Battle rewards complement daily bonuses', 'Trading provides alternative income', 'Events offer unique earning opportunities']
              }
            ].map((integration, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="p-8 rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800/30 to-gray-900/30 hover:border-pink-500/30 transition-all duration-300"
              >
                <div className="text-5xl mb-6">{integration.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{integration.title}</h3>
                <p className="text-gray-400 mb-6">{integration.description}</p>
                <div className="space-y-2">
                  {integration.examples.map((example, idx) => (
                    <div key={idx} className="text-sm text-gray-300 flex items-center space-x-2">
                      <span className="w-2 h-2 bg-pink-500 rounded-full flex-shrink-0"></span>
                      <span>{example}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default GameSystemsPage