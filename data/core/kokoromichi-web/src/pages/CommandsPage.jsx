import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Clock, Zap } from 'lucide-react'
import { useBotData } from '@/contexts/BotDataContext'

const CommandsPage = () => {
  const { commands, loading } = useBotData()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock data for demonstration
  const mockCommands = [
    {
      category: 'Profile & Collection',
      icon: '👤',
      color: '#FF69B4',
      description: 'Manage your profile and character collection',
      commands: [
        { name: '!profile', description: 'Display your user profile with stats', usage: '!profile [member]', cooldown: 5 },
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
        { name: '!duel', description: 'Challenge another player to PvP', usage: '!duel @user', cooldown: 120 }
      ]
    }
  ]

  const commandData = commands.length > 0 ? commands : mockCommands

  const filteredCommands = useMemo(() => {
    let filtered = commandData

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(cat => cat.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.map(category => ({
        ...category,
        commands: category.commands.filter(cmd =>
          cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cmd.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.commands.length > 0)
    }

    return filtered
  }, [commandData, searchTerm, selectedCategory])

  const categories = ['all', ...commandData.map(cat => cat.category)]

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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6 text-gradient">
            ⚡ Bot Commands
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover all {commandData.reduce((acc, cat) => acc + cat.commands.length, 0)}+ available commands 
            across {commandData.length} categories. Master the power of KoKoroMichi!
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search commands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-pink-400'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Commands Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-xl text-gradient">Loading commands...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCommands.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-6"
              >
                {/* Category Header */}
                <div className="flex items-center space-x-4 mb-8">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.category}</h2>
                    <p className="text-gray-400">{category.description}</p>
                  </div>
                </div>

                {/* Commands */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.commands.map((command, commandIndex) => (
                    <motion.div
                      key={command.name}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (categoryIndex * 0.1) + (commandIndex * 0.05) }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700 hover:border-pink-500/50 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-pink-400">{command.name}</h3>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{command.cooldown}s</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                        {command.description}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          Usage
                        </div>
                        <code className="text-sm bg-gray-900/50 px-3 py-2 rounded-lg text-green-400 block font-mono">
                          {command.usage}
                        </code>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCommands.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">No commands found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or selecting a different category.
            </p>
          </motion.div>
        )}

        {/* Command Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Zap className="text-yellow-400" size={24} />,
              number: commandData.reduce((acc, cat) => acc + cat.commands.length, 0),
              label: 'Total Commands'
            },
            {
              icon: <Filter className="text-blue-400" size={24} />,
              number: commandData.length,
              label: 'Categories'
            },
            {
              icon: <Clock className="text-green-400" size={24} />,
              number: 'Live',
              label: 'Status'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700"
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default CommandsPage