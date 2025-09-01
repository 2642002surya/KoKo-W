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
        'Elemental advantages for tactical depth'
      ],
      color: '#FF4444',
      gradient: 'from-red-500 to-orange-500'
    },
    {
      icon: Heart,
      title: 'Character Collection & Rarity System',
      description: 'Collect 50+ unique characters across 7 rarity tiers',
      details: [
        'N (Normal) - Common characters, great for beginners',
        'R (Rare) - Solid characters with decent abilities', 
        'SR (Super Rare) - Strong characters with unique skills',
        'SSR (Super Super Rare) - Powerful characters with special traits',
        'UR (Ultra Rare) - Elite characters with exceptional abilities',
        'LR (Legendary Rare) - Legendary characters with ultimate power',
        'Mythic - The rarest and most powerful characters in existence'
      ],
      color: '#FF69B4',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Guild System & Faction Warfare',
      description: 'Team-based gameplay with collaborative activities',
      details: [
        'Create or join guilds with up to 50 members',
        'Guild banks for shared resource management',
        'Faction bonuses that affect all guild members',
        'Guild vs Guild warfare events',
        'Collaborative boss raids requiring teamwork',
        'Guild-exclusive quests and challenges',
        'Leadership roles with special privileges'
      ],
      color: '#4169E1',
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Coins,
      title: 'Advanced Economy System',
      description: 'Multi-currency system with investments and trading',
      details: [
        'Gold and Gems as primary currencies',
        'Business investments for passive income',
        'Auction house for player-to-player trading',
        'Daily rewards and login streaks',
        'Portfolio management for multiple businesses',
        'Market fluctuations affecting prices',
        'Economic events that impact the entire server'
      ],
      color: '#FFD700',
      gradient: 'from-yellow-500 to-amber-500'
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