import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sword, Heart, Coins, Users, Hammer, Calendar, 
  Trophy, Sparkles, Shield, Zap, Crown, Star,
  Gamepad2, BookOpen, Gift, Target, Gem, Flame
} from 'lucide-react';

const FeaturesPage = ({ theme }) => {
  const features = [
    {
      icon: Sword,
      title: 'Advanced Combat System',
      description: 'Strategic turn-based battles with comprehensive buff systems',
      details: [
        'Guild bonuses that enhance your battle performance',
        'Pet abilities that provide unique combat advantages',
        'Dream buffs for temporary power boosts',
        'Affinity bonuses based on character relationships',
        'Trait effects that unlock special abilities',
        'Relic powers that dramatically increase stats',
        'Elemental advantages for tactical depth',
        'Arena tournaments with seasonal rankings',
        'World boss raids requiring guild coordination'
      ],
      color: '#FF4444',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      icon: Heart,
      title: 'Character Collection & Progression',
      description: 'Collect 328+ unique characters across 7 rarity tiers with deep progression',
      details: [
        'N (Normal 60.4%) - Common characters, great for beginners',
        'R (Rare 25%) - Solid characters with decent abilities', 
        'SR (Super Rare 10%) - Strong characters with unique skills',
        'SSR (Super Super Rare 3%) - Powerful characters with special traits',
        'UR (Ultra Rare 1%) - Elite characters with exceptional abilities',
        'LR (Legendary Rare 0.5%) - Legendary characters with ultimate power',
        'Mythic (0.1%) - The rarest and most powerful characters in existence',
        'Character awakening and potential unlocking systems',
        'Trait development for specialized character builds'
      ],
      color: '#FF69B4',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Guild System & Social Features',
      description: 'Team-based gameplay with collaborative activities and social interactions',
      details: [
        'Create or join guilds with up to 50 members',
        'Guild banks for shared resource management',
        'Faction bonuses that affect all guild members',
        'Guild vs Guild warfare events',
        'Collaborative boss raids requiring teamwork',
        'Guild-exclusive quests and challenges',
        'Fan clubs for favorite characters',
        'Mood polls and community voting systems',
        'Character relationship and affection mechanics'
      ],
      color: '#4169E1',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Coins,
      title: 'Advanced Economy & Trading',
      description: 'Multi-currency system with investments, auctions, and business management',
      details: [
        'Gold and Gems as primary currencies',
        'Business investments for passive income generation',
        'Auction house for player-to-player trading',
        'Daily rewards and login streak bonuses',
        'Portfolio management for multiple businesses',
        'Market fluctuations affecting investment prices',
        'Economic events that impact the entire server',
        'Store system with rotating inventory',
        'Investment risk/reward balancing'
      ],
      color: '#FFD700',
      gradient: 'from-yellow-500 to-amber-500'
    },
    {
      icon: Hammer,
      title: 'Crafting & Equipment System',
      description: 'Create powerful items and relics through advanced crafting mechanics',
      details: [
        'Material gathering from multiple locations',
        'Recipe discovery and crafting progression',
        'Relic forging for powerful equipment',
        'Item enhancement and upgrade systems',
        'Resource management and inventory control',
        'Rare material trading and exchange',
        'Equipment optimization for character builds',
        'Seasonal crafting events with exclusive recipes'
      ],
      color: '#8B4513',
      gradient: 'from-amber-600 to-orange-600'
    },
    {
      icon: Sparkles,
      title: 'Events & Activities',
      description: 'Dynamic content with seasonal events, quests, and special activities',
      details: [
        'Seasonal events with exclusive rewards',
        'Dream realm mystical adventures',
        'Daily quest system with rotating objectives',
        'Random events for surprise encounters',
        'Contest participation and competitions',
        'Pet racing and companion activities',
        'Treasure hunting expeditions',
        'Achievement tracking and rewards',
        'Lore reading with story progression'
      ],
      color: '#9400D3',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Gamepad2,
      title: 'Mini Games & Entertainment',
      description: 'Variety of fun mini-games and entertainment features',
      details: [
        'Number guessing games with rewards',
        'Rock Paper Scissors tournaments',
        'Slot machine gambling mechanics',
        'Trivia questions across multiple categories',
        'Magic 8-ball mystical answers',
        'Dice rolling and random generation',
        'Choice making and decision games',
        'Coin flipping with betting options',
        'Character compliment and praise systems'
      ],
      color: '#00CED1',
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Shield,
      title: 'Administration & Security',
      description: 'Comprehensive admin tools and secure bot management',
      details: [
        'DM-only admin commands for enhanced security',
        'User data management and viewing tools',
        'Server-wide announcement capabilities',
        'Automated backup systems for data protection',
        'Channel setup and configuration automation',
        'Permission management and role integration',
        'Bot statistics and performance monitoring',
        'Error tracking and debugging tools'
      ],
      color: '#DC143C',
      gradient: 'from-red-600 to-pink-600'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-6"
            style={{ color: theme.colors.text }}
          >
            🌟 Game Features
          </h1>
          <p 
            className="text-lg max-w-4xl mx-auto leading-relaxed"
            style={{ color: theme.colors.textSecondary }}
          >
            KoKoroMichi is the most advanced Discord RPG bot, featuring 98+ commands across 33 modules. 
            Experience deep character collection, strategic combat, guild cooperation, and endless adventures 
            in this comprehensive gaming ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { number: '98+', label: 'Total Commands', icon: BookOpen },
            { number: '33', label: 'Command Modules', icon: Gem },
            { number: '50+', label: 'Unique Characters', icon: Crown },
            { number: '7', label: 'Rarity Tiers', icon: Star }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="text-center p-6 rounded-xl border border-white/20 backdrop-blur-md"
                style={{ backgroundColor: `${theme.colors.surface}80` }}
              >
                <div 
                  className="w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Icon size={24} color={theme.colors.text} />
                </div>
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: theme.colors.accent }}
                >
                  {stat.number}
                </div>
                <div 
                  className="text-sm font-medium"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid gap-8 md:gap-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative overflow-hidden rounded-2xl border border-white/20 backdrop-blur-md flex flex-col md:flex-row"
                style={{ backgroundColor: `${theme.colors.surface}90` }}
              >
                <div className="flex-1 p-8 md:p-12">
                  <div className="flex items-center space-x-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: feature.color }}
                    >
                      <Icon size={32} color="white" />
                    </div>
                    <div>
                      <h3 
                        className="text-2xl md:text-3xl font-bold mb-2"
                        style={{ color: theme.colors.text }}
                      >
                        {feature.title}
                      </h3>
                      <p 
                        className="text-lg"
                        style={{ color: theme.colors.textSecondary }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: (index * 0.1) + (detailIndex * 0.05) }}
                        className="flex items-start space-x-3"
                      >
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: feature.color }}
                        />
                        <p 
                          className="text-sm leading-relaxed"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {detail}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="md:w-80 h-64 md:h-auto relative overflow-hidden">
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Icon 
                        size={120} 
                        color={feature.color}
                        style={{ opacity: 0.6 }}
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 p-12 rounded-2xl border border-white/20 backdrop-blur-md"
          style={{ backgroundColor: `${theme.colors.surface}90` }}
        >
          <div className="text-6xl mb-6">🎮</div>
          <h3 
            className="text-3xl font-bold mb-4"
            style={{ color: theme.colors.text }}
          >
            Ready to Begin Your Adventure?
          </h3>
          <p 
            className="text-lg mb-8 max-w-2xl mx-auto"
            style={{ color: theme.colors.textSecondary }}
          >
            Join thousands of players in the ultimate Discord RPG experience. 
            Collect characters, build your guild, and become a legend!
          </p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.text 
            }}
          >
            <Crown size={24} />
            <span>Invite KoKoroMichi</span>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeaturesPage;