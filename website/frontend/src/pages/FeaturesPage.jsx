import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sword, Crown, Coins, Hammer, Users, Zap, Trophy, Gift, Star, Shield, Gamepad2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const FeaturesPage = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: Heart,
      title: 'Gacha System',
      description: 'Summon unique characters with different rarities',
      details: [
        'Multiple rarity tiers: N, R, SR, SSR, UR, LR, Mythic',
        'Pity system ensures guaranteed rare pulls',
        'Daily summon bonuses and special events',
        'Over 50+ unique characters to collect'
      ],
      color: '#ec4899'
    },
    {
      icon: Sword,
      title: 'Battle System',
      description: 'Engage in strategic turn-based combat',
      details: [
        'Turn-based RPG combat with skills and elements',
        'Character abilities and ultimate attacks',
        'Elemental advantages and weaknesses',
        'Guild bonuses and pet assistance in battles'
      ],
      color: '#ef4444'
    },
    {
      icon: Crown,
      title: 'Guild System',
      description: 'Team up with other players for collaborative gameplay',
      details: [
        'Create or join guilds with role-based management',
        'Guild bonuses that enhance battle performance',
        'Collaborative guild events and challenges',
        'Guild leaderboards and competitive rankings'
      ],
      color: '#f59e0b'
    },
    {
      icon: Coins,
      title: 'Economy',
      description: 'Manage resources and trade in the marketplace',
      details: [
        'Multi-currency system with gold and gems',
        'Investment opportunities and daily rewards',
        'Auction house for trading rare items',
        'Economic strategies for wealth building'
      ],
      color: '#22c55e'
    },
    {
      icon: Hammer,
      title: 'Crafting',
      description: 'Create and enhance powerful items and relics',
      details: [
        'Craft weapons, armor, and magical relics',
        'Material gathering from battles and events',
        'Recipe discovery and upgrade systems',
        'Enhancement and stat improvement mechanics'
      ],
      color: '#8b5cf6'
    },
    {
      icon: Users,
      title: 'Social Features',
      description: 'Build relationships and interact with characters',
      details: [
        'Character affection and intimacy systems',
        'Fan clubs for favorite characters',
        'Social events and community activities',
        'Player interactions and friend systems'
      ],
      color: '#06b6d4'
    },
    {
      icon: Trophy,
      title: 'Achievements',
      description: 'Track progress and unlock special rewards',
      details: [
        'Comprehensive achievement system',
        'Progress tracking across all game features',
        'Special titles and cosmetic rewards',
        'Milestone celebrations and bonuses'
      ],
      color: '#f97316'
    },
    {
      icon: Gift,
      title: 'Events',
      description: 'Participate in seasonal and special events',
      details: [
        'Seasonal events with unique rewards',
        'Limited-time characters and items',
        'Community challenges and competitions',
        'Holiday celebrations and special activities'
      ],
      color: '#84cc16'
    },
    {
      icon: Gamepad2,
      title: 'Mini Games',
      description: 'Enjoy various fun activities and challenges',
      details: [
        'Treasure hunts and exploration games',
        'Pet races and training competitions',
        'Puzzle games and brain teasers',
        'Skill-based challenges with rewards'
      ],
      color: '#e11d48'
    }
  ];

  const unlockFeatures = [
    {
      title: 'Character Progression',
      description: 'Level up characters through battles and training',
      icon: Star
    },
    {
      title: 'Skill Evolution',
      description: 'Unlock new abilities as characters grow stronger',
      icon: Zap
    },
    {
      title: 'Equipment Mastery',
      description: 'Master weapons and unlock special techniques',
      icon: Shield
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-width">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-gaming font-bold mb-6 text-white">
              Game Features
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the comprehensive RPG experience with extensive game mechanics, 
              strategic gameplay, and endless possibilities for adventure and growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-width">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="card group hover:scale-105 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  {/* Icon and Title */}
                  <div className="flex items-center space-x-4 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${feature.color}20` }}
                      whileHover={{ rotate: 5 }}
                    >
                      <Icon size={24} style={{ color: feature.color }} />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mb-4">
                    {feature.description}
                  </p>

                  {/* Details List */}
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.li
                        key={detailIndex}
                        className="flex items-start space-x-2 text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.1) + (detailIndex * 0.05), duration: 0.3 }}
                        viewport={{ once: true }}
                      >
                        <div 
                          className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: feature.color }}
                        />
                        <span>{detail}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Hover Effect */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div 
                      className="h-1 rounded-full bg-gradient-to-r from-transparent via-current to-transparent"
                      style={{ color: feature.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Unlock System */}
      <section className="section-padding">
        <div className="container-width">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-gaming font-bold mb-6 text-white">
              Progressive Unlocks
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advance through the game to unlock new features, abilities, and content
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {unlockFeatures.map((unlock, index) => {
              const Icon = unlock.icon;
              return (
                <motion.div
                  key={unlock.title}
                  className="text-center group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <motion.div 
                    className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${theme.colors.primary}20` }}
                    whileHover={{ y: -5 }}
                  >
                    <Icon size={32} style={{ color: theme.colors.primary }} />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {unlock.title}
                  </h3>
                  <p className="text-gray-400">
                    {unlock.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-width">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-gaming font-bold mb-6 text-white">
              By the Numbers
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Commands', value: '98+', icon: Zap },
              { label: 'Characters', value: '50+', icon: Heart },
              { label: 'Modules', value: '33', icon: Shield },
              { label: 'Features', value: '20+', icon: Star }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="text-center card group hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Icon size={24} className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                  <div className="text-3xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;