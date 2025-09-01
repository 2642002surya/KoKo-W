import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Eye, Shuffle, TrendingUp, Heart, Zap, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const WaifusPage = () => {
  const { theme } = useTheme();
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [sortBy, setSortBy] = useState('rarity');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [summonMode, setSummonMode] = useState(false);
  const [currentSummon, setCurrentSummon] = useState(null);

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      const response = await axios.get('/api/waifus');
      setCharacters(response.data.characters);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const rarityColors = {
    N: '#9ca3af',
    R: '#3b82f6',
    SR: '#8b5cf6',
    SSR: '#f59e0b',
    UR: '#ef4444',
    LR: '#ec4899',
    Mythic: '#06b6d4'
  };

  const filteredCharacters = characters
    .filter(char => {
      const matchesSearch = char.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           char.origin?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRarity = selectedRarity === 'all' || char.rarity === selectedRarity;
      return matchesSearch && matchesRarity;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'level':
          return (b.level || 1) - (a.level || 1);
        case 'attack':
          return (b.attack || 0) - (a.attack || 0);
        default: // rarity
          const rarityOrder = { 'Mythic': 7, 'LR': 6, 'UR': 5, 'SSR': 4, 'SR': 3, 'R': 2, 'N': 1 };
          return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
      }
    });

  const handleSummon = () => {
    setSummonMode(true);
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    setCurrentSummon(randomCharacter);
    
    setTimeout(() => {
      setSummonMode(false);
    }, 3000);
  };

  const getStatIcon = (statName) => {
    switch (statName.toLowerCase()) {
      case 'attack':
      case 'atk':
        return <Zap size={16} className="text-red-400" />;
      case 'defense':
      case 'def':
        return <Shield size={16} className="text-blue-400" />;
      case 'hp':
      case 'health':
        return <Heart size={16} className="text-green-400" />;
      default:
        return <TrendingUp size={16} className="text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="section-padding">
        <div className="container-width">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-gaming font-bold mb-6 text-white">
              Character Database
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Discover {characters.length} unique characters with different rarities, stats, and abilities
            </p>
            
            {/* Summon Button */}
            <motion.button
              onClick={handleSummon}
              disabled={summonMode}
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{ 
                backgroundColor: theme.colors.primary,
                boxShadow: `0 10px 30px ${theme.colors.primary}40` 
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Shuffle size={20} />
              <span>{summonMode ? 'Summoning...' : 'Random Summon'}</span>
            </motion.button>
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="card mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search characters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Rarity Filter */}
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedRarity}
                  onChange={(e) => setSelectedRarity(e.target.value)}
                  className="input-field pl-10 appearance-none"
                >
                  <option value="all">All Rarities</option>
                  <option value="N">N - Normal</option>
                  <option value="R">R - Rare</option>
                  <option value="SR">SR - Super Rare</option>
                  <option value="SSR">SSR - Super Super Rare</option>
                  <option value="UR">UR - Ultra Rare</option>
                  <option value="LR">LR - Legendary Rare</option>
                  <option value="Mythic">Mythic</option>
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <TrendingUp size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field pl-10 appearance-none"
                >
                  <option value="rarity">Sort by Rarity</option>
                  <option value="name">Sort by Name</option>
                  <option value="level">Sort by Level</option>
                  <option value="attack">Sort by Attack</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Characters Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-600 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              layout
            >
              <AnimatePresence>
                {filteredCharacters.map((character, index) => (
                  <motion.div
                    key={character.id || character.name}
                    className="card cursor-pointer group hover:scale-105 transition-all duration-300 border-l-4"
                    style={{ borderLeftColor: rarityColors[character.rarity] || '#9ca3af' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    layout
                    onClick={() => setSelectedCharacter(character)}
                  >
                    {/* Character Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {character.name || 'Unknown Character'}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {character.origin || character.series || 'Unknown Origin'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={16} style={{ color: rarityColors[character.rarity] }} fill="currentColor" />
                        <span 
                          className="text-sm font-bold"
                          style={{ color: rarityColors[character.rarity] }}
                        >
                          {character.rarity}
                        </span>
                      </div>
                    </div>

                    {/* Stats Preview */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-xs">
                        <div className="flex items-center space-x-1 text-gray-400">
                          {getStatIcon('attack')}
                          <span>ATK</span>
                        </div>
                        <div className="text-white font-semibold">
                          {character.attack || character.atk || '???'}
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center space-x-1 text-gray-400">
                          {getStatIcon('defense')}
                          <span>DEF</span>
                        </div>
                        <div className="text-white font-semibold">
                          {character.defense || character.def || '???'}
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center space-x-1 text-gray-400">
                          {getStatIcon('hp')}
                          <span>HP</span>
                        </div>
                        <div className="text-white font-semibold">
                          {character.hp || character.health || '???'}
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <TrendingUp size={16} className="text-purple-400" />
                          <span>LVL</span>
                        </div>
                        <div className="text-white font-semibold">
                          {character.level || 1}
                        </div>
                      </div>
                    </div>

                    {/* Element/Attribute */}
                    {character.element && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Element:</span>
                        <span 
                          className="text-sm font-medium px-2 py-1 rounded"
                          style={{ 
                            backgroundColor: `${theme.colors.primary}20`,
                            color: theme.colors.primary 
                          }}
                        >
                          {character.element}
                        </span>
                      </div>
                    )}

                    {/* Details Button */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-full text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center space-x-1">
                        <Eye size={14} />
                        <span>View Details</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* No Results */}
          {!isLoading && filteredCharacters.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg">
                No characters found matching your criteria.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Character Details Modal */}
      <AnimatePresence>
        {selectedCharacter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCharacter(null)}
            />
            <motion.div
              className="relative bg-slate-800 rounded-xl p-6 max-w-lg w-full border border-slate-700 max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedCharacter.name}
                  </h3>
                  <p className="text-gray-400">
                    {selectedCharacter.origin || selectedCharacter.series}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={20} style={{ color: rarityColors[selectedCharacter.rarity] }} fill="currentColor" />
                  <span 
                    className="text-lg font-bold"
                    style={{ color: rarityColors[selectedCharacter.rarity] }}
                  >
                    {selectedCharacter.rarity}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(selectedCharacter).map(([key, value]) => {
                  if (['attack', 'atk', 'defense', 'def', 'hp', 'health', 'level', 'speed', 'luck'].includes(key.toLowerCase())) {
                    return (
                      <div key={key} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-center space-x-2 text-gray-400 mb-1">
                          {getStatIcon(key)}
                          <span className="text-sm uppercase">{key}</span>
                        </div>
                        <div className="text-xl font-bold text-white">{value}</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* Additional Info */}
              <div className="space-y-3 mb-6">
                {selectedCharacter.element && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Element:</span>
                    <span className="text-white">{selectedCharacter.element}</span>
                  </div>
                )}
                {selectedCharacter.weapon && (
                  <div className="flex justify-between">
                    <span className="text-gray-300">Weapon:</span>
                    <span className="text-white">{selectedCharacter.weapon}</span>
                  </div>
                )}
                {selectedCharacter.skills && (
                  <div>
                    <span className="text-gray-300">Skills:</span>
                    <div className="mt-1 text-white text-sm">
                      {Array.isArray(selectedCharacter.skills) 
                        ? selectedCharacter.skills.join(', ') 
                        : selectedCharacter.skills}
                    </div>
                  </div>
                )}
                {selectedCharacter.description && (
                  <div>
                    <span className="text-gray-300">Description:</span>
                    <p className="mt-1 text-white text-sm">{selectedCharacter.description}</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedCharacter(null)}
                className="w-full btn-primary"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Summon Animation Modal */}
      <AnimatePresence>
        {summonMode && currentSummon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              className="fixed inset-0"
              style={{ backgroundColor: rarityColors[currentSummon.rarity] + '20' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative text-center text-white"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                ⭐
              </motion.div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: rarityColors[currentSummon.rarity] }}>
                {currentSummon.rarity} SUMMON!
              </h2>
              <h3 className="text-2xl font-semibold">
                {currentSummon.name}
              </h3>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaifusPage;