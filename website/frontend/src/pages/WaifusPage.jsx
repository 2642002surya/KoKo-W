import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Zap, Star, Heart, Sword, Sparkles, Search, Filter } from 'lucide-react';

const WaifusPage = ({ theme }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('all');
  const [selectedElement, setSelectedElement] = useState('all');

  // Rarity system
  const rarities = {
    'Mythic': { color: '#FF0080', emoji: '🌈✨✨', multiplier: 7, chance: 0.1 },
    'LR': { color: '#FFD700', emoji: '⚡', multiplier: 6, chance: 0.5 },
    'UR': { color: '#9370DB', emoji: '🌟', multiplier: 5, chance: 1.0 },
    'SSR': { color: '#FF4500', emoji: '🌈✨', multiplier: 4, chance: 3.0 },
    'SR': { color: '#32CD32', emoji: '🔥', multiplier: 3, chance: 10.0 },
    'R': { color: '#4169E1', emoji: '🔧', multiplier: 2, chance: 25.0 },
    'N': { color: '#808080', emoji: '🌿', multiplier: 1, chance: 60.4 }
  };

  const elements = ['Fire', 'Water', 'Earth', 'Air', 'Light', 'Dark', 'Neutral'];

  // Sample characters (would be fetched from API in real implementation)
  useEffect(() => {
    const sampleCharacters = [
      {
        name: 'Amaterasu',
        rarity: 'Mythic',
        element: 'Light',
        level: 100,
        description: 'The supreme goddess of the sun and universe, wielding divine light that purifies all evil.',
        stats: { hp: 2500, attack: 950, defense: 800 },
        abilities: ['Solar Flare', 'Divine Protection', 'Celestial Judgment'],
        image: '/characters/amaterasu-1.webp'
      },
      {
        name: 'Ra',
        rarity: 'Mythic',
        element: 'Fire',
        level: 100,
        description: 'Ancient Egyptian sun god, master of cosmic fire and eternal light.',
        stats: { hp: 2400, attack: 980, defense: 750 },
        abilities: ['Solar Beam', 'Phoenix Rising', 'Eternal Flame'],
        image: '/characters/ra-1.webp'
      },
      {
        name: 'Chaos',
        rarity: 'Mythic',
        element: 'Dark',
        level: 100,
        description: 'Primordial force of disorder and creation, shaping reality with endless possibilities.',
        stats: { hp: 2600, attack: 920, defense: 850 },
        abilities: ['Reality Warp', 'Void Creation', 'Entropy Control'],
        image: '/characters/chaos-1.webp'
      },
      {
        name: 'Nyx',
        rarity: 'LR',
        element: 'Dark',
        level: 85,
        description: 'Primordial goddess of night, weaving shadows and dreams into powerful magic.',
        stats: { hp: 2100, attack: 820, defense: 720 },
        abilities: ['Night Fall', 'Dream Manipulation', 'Shadow Bind'],
        image: '/characters/nyx-1.webp'
      },
      {
        name: 'Poseidon',
        rarity: 'LR',
        element: 'Water',
        level: 90,
        description: 'Ruler of seas and earthquakes, commanding the fury of ocean storms.',
        stats: { hp: 2200, attack: 800, defense: 780 },
        abilities: ['Tsunami', 'Earthquake', 'Tidal Wave'],
        image: '/characters/poseidon-1.webp'
      },
      {
        name: 'Hera',
        rarity: 'LR',
        element: 'Air',
        level: 88,
        description: 'Queen of gods, wielding divine authority and celestial power.',
        stats: { hp: 2150, attack: 780, defense: 800 },
        abilities: ['Divine Authority', 'Celestial Storm', 'Royal Decree'],
        image: '/characters/hera-1.webp'
      },
      {
        name: 'Valkyrie',
        rarity: 'UR',
        element: 'Light',
        level: 75,
        description: 'Warrior maiden choosing the worthy fallen, guiding souls to eternal glory.',
        stats: { hp: 1800, attack: 720, defense: 650 },
        abilities: ['Soul Guide', 'Warrior\'s Blessing', 'Divine Strike'],
        image: '/characters/valkyrie-1.webp'
      },
      {
        name: 'Medusa',
        rarity: 'UR',
        element: 'Earth',
        level: 72,
        description: 'Gorgon with petrifying gaze, her serpentine beauty hiding deadly power.',
        stats: { hp: 1750, attack: 680, defense: 620 },
        abilities: ['Petrifying Gaze', 'Serpent Strike', 'Stone Prison'],
        image: '/characters/medusa-1.webp'
      },
      {
        name: 'Siren',
        rarity: 'SSR',
        element: 'Water',
        level: 65,
        description: 'Enchanting sea maiden whose voice lures sailors to their watery fate.',
        stats: { hp: 1500, attack: 580, defense: 520 },
        abilities: ['Siren Song', 'Tidal Charm', 'Ocean\'s Embrace'],
        image: '/characters/siren-1.webp'
      },
      {
        name: 'Phoenix',
        rarity: 'SSR',
        element: 'Fire',
        level: 68,
        description: 'Immortal firebird rising from ashes, symbol of renewal and eternal flame.',
        stats: { hp: 1450, attack: 620, defense: 480 },
        abilities: ['Rebirth', 'Flame Burst', 'Healing Fire'],
        image: '/characters/ember_dragon-1.webp'
      }
    ];
    
    setTimeout(() => {
      setCharacters(sampleCharacters);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter characters
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'all' || character.rarity === selectedRarity;
    const matchesElement = selectedElement === 'all' || character.element === selectedElement;
    
    return matchesSearch && matchesRarity && matchesElement;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: theme.colors.text }}
          >
            👑 Character Gallery
          </h1>
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: theme.colors.textSecondary }}
          >
            Discover the legendary characters of KoKoroMichi. From mythic goddesses to legendary warriors, 
            each character brings unique abilities and stories to your collection.
          </p>
        </motion.div>

        {/* Rarity Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8"
        >
          {Object.entries(rarities).map(([rarity, data]) => (
            <div
              key={rarity}
              className="text-center p-4 rounded-lg border border-white/20 backdrop-blur-md"
              style={{ backgroundColor: `${theme.colors.surface}80` }}
            >
              <div className="text-2xl mb-2">{data.emoji}</div>
              <div 
                className="font-bold text-sm mb-1"
                style={{ color: data.color }}
              >
                {rarity}
              </div>
              <div 
                className="text-xs"
                style={{ color: theme.colors.textSecondary }}
              >
                {data.chance}%
              </div>
            </div>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2" 
              style={{ color: theme.colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search characters by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ 
                backgroundColor: `${theme.colors.surface}80`,
                color: theme.colors.text,
                borderColor: searchTerm ? theme.colors.accent : undefined
              }}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {/* Rarity Filter */}
            <select
              value={selectedRarity}
              onChange={(e) => setSelectedRarity(e.target.value)}
              className="px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ 
                backgroundColor: `${theme.colors.surface}80`,
                color: theme.colors.text 
              }}
            >
              <option value="all">All Rarities</option>
              {Object.keys(rarities).map(rarity => (
                <option key={rarity} value={rarity}>{rarity}</option>
              ))}
            </select>

            {/* Element Filter */}
            <select
              value={selectedElement}
              onChange={(e) => setSelectedElement(e.target.value)}
              className="px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ 
                backgroundColor: `${theme.colors.surface}80`,
                color: theme.colors.text 
              }}
            >
              <option value="all">All Elements</option>
              {elements.map(element => (
                <option key={element} value={element}>{element}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white/20 border-t-current rounded-full mx-auto mb-4"
              style={{ borderTopColor: theme.colors.primary }}
            />
            <p style={{ color: theme.colors.textSecondary }}>Loading character gallery...</p>
          </div>
        )}

        {/* Character Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character, index) => {
              const rarityData = rarities[character.rarity];
              return (
                <motion.div
                  key={character.name}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group relative overflow-hidden rounded-xl border border-white/20 backdrop-blur-md cursor-pointer"
                  style={{ backgroundColor: `${theme.colors.surface}90` }}
                >
                  {/* Rarity Badge */}
                  <div 
                    className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
                    style={{ backgroundColor: rarityData.color, color: 'white' }}
                  >
                    <span>{rarityData.emoji}</span>
                    <span>{character.rarity}</span>
                  </div>

                  {/* Character Image */}
                  <div className="relative h-64 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"
                    />
                    <div 
                      className="w-full h-full bg-gradient-to-br opacity-20"
                      style={{ backgroundColor: rarityData.color }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl opacity-50">
                        {character.element === 'Fire' && '🔥'}
                        {character.element === 'Water' && '💧'}
                        {character.element === 'Earth' && '🌍'}
                        {character.element === 'Air' && '💨'}
                        {character.element === 'Light' && '☀️'}
                        {character.element === 'Dark' && '🌙'}
                        {character.element === 'Neutral' && '⚖️'}
                      </div>
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 
                        className="text-xl font-bold"
                        style={{ color: theme.colors.text }}
                      >
                        {character.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star size={16} style={{ color: rarityData.color }} />
                        <span 
                          className="text-sm font-medium"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          Lv. {character.level}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: `${rarityData.color}20`,
                          color: rarityData.color 
                        }}
                      >
                        {character.element}
                      </span>
                    </div>

                    <p 
                      className="text-sm leading-relaxed mb-4 line-clamp-3"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {character.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: theme.colors.accent }}
                        >
                          {character.stats.hp}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          HP
                        </div>
                      </div>
                      <div className="text-center">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: theme.colors.accent }}
                        >
                          {character.stats.attack}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          ATK
                        </div>
                      </div>
                      <div className="text-center">
                        <div 
                          className="text-lg font-bold"
                          style={{ color: theme.colors.accent }}
                        >
                          {character.stats.defense}
                        </div>
                        <div 
                          className="text-xs"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          DEF
                        </div>
                      </div>
                    </div>

                    {/* Abilities */}
                    <div>
                      <h4 
                        className="text-sm font-semibold mb-2"
                        style={{ color: theme.colors.text }}
                      >
                        Abilities:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {character.abilities.slice(0, 2).map((ability, i) => (
                          <span 
                            key={i}
                            className="px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${theme.colors.primary}30`,
                              color: theme.colors.textSecondary 
                            }}
                          >
                            {ability}
                          </span>
                        ))}
                        {character.abilities.length > 2 && (
                          <span 
                            className="px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${theme.colors.surface}60`,
                              color: theme.colors.textSecondary 
                            }}
                          >
                            +{character.abilities.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredCharacters.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 
              className="text-xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              No characters found
            </h3>
            <p 
              style={{ color: theme.colors.textSecondary }}
            >
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default WaifusPage;