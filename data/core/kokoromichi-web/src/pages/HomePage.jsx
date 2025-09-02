import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Crown, Users, Sword, Heart, Sparkles, ArrowRight, Play, Shield, Star, Zap, Trophy, Gift } from 'lucide-react'
import { useBotData } from '@/contexts/BotDataContext'
import { useTheme } from '@/contexts/ThemeContext'

const HomePage = () => {
  const { botStats, loading } = useBotData()
  const { theme } = useTheme()

  const features = [
    {
      icon: Sword,
      title: 'Epic Combat System',
      description: 'Strategic turn-based battles with advanced mechanics, elemental advantages, and character synergies',
      color: 'from-red-500 to-pink-500',
      stats: '98+ Commands'
    },
    {
      icon: Crown,
      title: 'Character Collection',
      description: 'Collect legendary characters across 7 rarity tiers with unique abilities and evolution paths',
      color: 'from-yellow-500 to-orange-500',
      stats: '50+ Characters'
    },
    {
      icon: Users,
      title: 'Guild Warfare',
      description: 'Team up with friends, form powerful guilds, and compete in large-scale collaborative battles',
      color: 'from-blue-500 to-purple-500',
      stats: 'Guild System'
    },
    {
      icon: Heart,
      title: 'Relationship System',
      description: 'Build deep bonds with characters, unlock intimate interactions, and gain powerful combat bonuses',
      color: 'from-pink-500 to-red-500',
      stats: 'Affection System'
    },
    {
      icon: Zap,
      title: 'Advanced Economy',
      description: 'Complex trading system, investments, auctions, and multiple currencies for strategic gameplay',
      color: 'from-green-500 to-blue-500',
      stats: 'Multi-Currency'
    },
    {
      icon: Trophy,
      title: 'Competitive Arena',
      description: 'Ranked battles, tournaments, leaderboards, and seasonal events with exclusive rewards',
      color: 'from-purple-500 to-pink-500',
      stats: 'Ranked System'
    }
  ]

  const gameplayHighlights = [
    {
      title: 'Strategic Depth',
      description: 'Every decision matters with complex battle mechanics, character synergies, and tactical positioning',
      icon: '🧠'
    },
    {
      title: 'Rich Progression',
      description: 'Multiple progression paths through character levels, equipment, traits, and relationship building',
      icon: '📈'
    },
    {
      title: 'Social Experience',
      description: 'Guild systems, PvP duels, collaborative raids, and community events bring players together',
      icon: '👥'
    },
    {
      title: 'Regular Updates',
      description: 'Continuous content updates with new characters, features, events, and quality of life improvements',
      icon: '🔄'
    }
  ]

  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=1344603209829974016&permissions=8&scope=bot`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-pink-500 rounded-full opacity-30"
              animate={{
                y: [0, -1000],
                x: [0, Math.sin(i) * 100],
                opacity: [0, 0.6, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: i * 0.5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%'
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            {/* Main Title */}
            <motion.h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-bold mb-6"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ color: theme.primary }}
            >
              🌸 KoKoroMichi
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl sm:text-3xl lg:text-4xl mb-8 text-gray-200"
            >
              The Ultimate Discord RPG Experience
            </motion.p>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl mb-12 max-w-4xl mx-auto leading-relaxed text-gray-300"
            >
              Embark on an epic journey with <span className="text-pink-400 font-semibold">98+ commands</span>, 
              strategic battles, character collection, guild warfare, and endless adventures in the most 
              advanced Discord RPG bot ever created.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white hover:shadow-pink-500/30 flex items-center space-x-3"
            >
              <Crown size={24} />
              <span>Invite to Discord</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            
            <Link to="/commands">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 border-2 border-pink-500 text-pink-400 hover:bg-pink-500/10 hover:shadow-lg hover:shadow-pink-500/20 flex items-center space-x-3"
              >
                <Play size={20} />
                <span>View Commands</span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Live Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { 
                number: loading ? '...' : botStats.commands || '98+', 
                label: 'Commands',
                icon: '⚡',
                color: 'from-yellow-400 to-orange-500'
              },
              { 
                number: '33', 
                label: 'Modules',
                icon: '🧩',
                color: 'from-blue-400 to-purple-500'
              },
              { 
                number: '50+', 
                label: 'Characters',
                icon: '👥',
                color: 'from-green-400 to-blue-500'
              },
              { 
                number: loading ? '...' : (botStats.isOnline ? 'Online' : 'Offline'), 
                label: 'Bot Status',
                icon: '🤖',
                color: botStats.isOnline ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
              }
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 hover:border-pink-500/50 transition-all duration-300"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div 
                  className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                >
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6" style={{ color: theme.primary }}>
              🎮 Game Features
            </h2>
            <p className="text-xl max-w-3xl mx-auto text-gray-300">
              Experience the most comprehensive Discord RPG with advanced features 
              designed for both casual players and hardcore strategists.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group p-8 rounded-2xl border border-gray-700 backdrop-blur-sm bg-gradient-to-br from-gray-800/50 to-gray-900/30 hover:border-pink-500/50 transition-all duration-500"
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={32} color="white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-pink-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="text-sm font-semibold text-pink-400">
                    {feature.stats}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gameplay Highlights */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900/50 to-black/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold mb-6" style={{ color: theme.primary }}>
              ✨ Why Choose KoKoroMichi?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gameplayHighlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex items-start space-x-6 p-8 rounded-2xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700 hover:border-pink-500/30 transition-all duration-300"
              >
                <div className="text-4xl">{highlight.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-3 text-white">{highlight.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{highlight.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl border border-pink-500/20 backdrop-blur-lg bg-gradient-to-br from-gray-800/40 to-gray-900/40"
        >
          <div className="text-7xl mb-6">⚔️</div>
          <h3 className="text-4xl font-bold mb-6" style={{ color: theme.primary }}>
            Ready to Begin Your Epic Adventure?
          </h3>
          <p className="text-xl mb-8 text-gray-300 leading-relaxed">
            Join thousands of players in the ultimate Discord RPG experience. 
            Build your collection, master strategic combat, form powerful alliances, 
            and become a legend in the world of KoKoroMichi!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-pink-500/30"
            >
              <Shield size={24} />
              <span>Invite KoKoroMichi</span>
              <ArrowRight size={20} />
            </motion.a>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg border-2 border-pink-500 text-pink-400 hover:bg-pink-500/10 transition-all duration-200"
              >
                <Gift size={20} />
                <span>Learn More</span>
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>
    </motion.div>
  )
}

export default HomePage