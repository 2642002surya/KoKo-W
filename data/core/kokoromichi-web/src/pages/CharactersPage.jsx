import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Heart, Sword, Shield } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const CharactersPage = () => {
  const { theme } = useTheme()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRarity, setSelectedRarity] = useState('all')

  // Mock character data
  const characters = [
    {
      id: 1,
      name: 'Sakura Warrior',
      rarity: 'Mythic',
      element: 'Nature',
      hp: 1200,
      atk: 180,
      def: 90,
      description: 'A legendary warrior blessed by the cherry blossoms.',
      image: '🌸'
    },
    {
      id: 2,
      name: 'Lightning Mage',
      rarity: 'LR',
      element: 'Electric',
      hp: 800,
      atk: 220,
      def: 60,
      description: 'Master of storms and electrical magic.',
      image: '⚡'
    },
    {
      id: 3,
      name: 'Fire Knight',
      rarity: 'UR',
      element: 'Fire',
      hp: 1000,
      atk: 160,
      def: 120,
      description: 'A noble knight wielding flames of justice.',
      image: '🔥'
    },
    {
      id: 4,
      name: 'Ice Queen',
      rarity: 'SSR',
      element: 'Ice',
      hp: 900,
      atk: 140,
      def: 80,
      description: 'Ruler of the frozen realm.',
      image: '❄️'
    }
  ]

  const rarities = {
    'Mythic': { color: 'from-rainbow-400 to-rainbow-600', emoji: '🌈✨✨' },
    'LR': { color: 'from-yellow-400 to-orange-500', emoji: '⚡' },
    'UR': { color: 'from-purple-400 to-pink-500', emoji: '🌟' },
    'SSR': { color: 'from-red-400 to-pink-500', emoji: '🔥' },
    'SR': { color: 'from-blue-400 to-purple-500', emoji: '💎' },
    'R': { color: 'from-green-400 to-blue-500', emoji: '🔧' },
    'N': { color: 'from-gray-400 to-gray-600', emoji: '🌿' }
  }

  const elements = {
    'Nature': { color: 'text-green-400', emoji: '🌿' },
    'Electric': { color: 'text-yellow-400', emoji: '⚡' },
    'Fire': { color: 'text-red-400', emoji: '🔥' },
    'Ice': { color: 'text-blue-400', emoji: '❄️' },
    'Dark': { color: 'text-purple-400', emoji: '🌙' },
    'Light': { color: 'text-yellow-300', emoji: '☀️' }
  }

  const filteredCharacters = characters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRarity = selectedRarity === 'all' || char.rarity === selectedRarity
    return matchesSearch && matchesRarity
  })

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
          <h1 className="text-5xl font-bold mb-6" style={{ color: theme.primary }}>
            👥 Character Collection
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover legendary characters across 7 rarity tiers. Collect, train, and battle 
            with your favorite heroes in epic adventures.
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
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
            />
          </div>

          {/* Rarity Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {['all', ...Object.keys(rarities)].map((rarity) => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                  selectedRarity === rarity
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/25'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-pink-400'
                }`}
              >
                {rarity !== 'all' && <span>{rarities[rarity].emoji}</span>}
                <span>{rarity === 'all' ? 'All Rarities' : rarity}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCharacters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.03 }}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700 hover:border-pink-500/50 transition-all duration-500"
            >
              {/* Rarity Glow */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${rarities[character.rarity].color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
              />
              
              {/* Character Image */}
              <div className="relative p-8 text-center">
                <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {character.image}
                </div>
                
                {/* Rarity Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r ${rarities[character.rarity].color} text-white text-sm font-bold`}>
                  {character.rarity}
                </div>
              </div>

              {/* Character Info */}
              <div className="p-6 pt-0">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
                  {character.name}
                </h3>
                
                <div className={`flex items-center space-x-2 mb-4 ${elements[character.element].color}`}>
                  <span>{elements[character.element].emoji}</span>
                  <span className="font-medium">{character.element}</span>
                </div>

                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {character.description}
                </p>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart size={16} className="text-red-400" />
                      <span className="text-sm text-gray-400">HP</span>
                    </div>
                    <span className="font-bold text-white">{character.hp}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sword size={16} className="text-yellow-400" />
                      <span className="text-sm text-gray-400">ATK</span>
                    </div>
                    <span className="font-bold text-white">{character.atk}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield size={16} className="text-blue-400" />
                      <span className="text-sm text-gray-400">DEF</span>
                    </div>
                    <span className="font-bold text-white">{character.def}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300">
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredCharacters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-6">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">No characters found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or selecting a different rarity.
            </p>
          </motion.div>
        )}

        {/* Character Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { icon: '👥', number: '50+', label: 'Total Characters' },
            { icon: '🌈', number: '7', label: 'Rarity Tiers' },
            { icon: '⚡', number: '6', label: 'Elements' },
            { icon: '🏆', number: 'Daily', label: 'New Releases' }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/30 to-gray-900/30 border border-gray-700"
            >
              <div className="text-3xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}

export default CharactersPage