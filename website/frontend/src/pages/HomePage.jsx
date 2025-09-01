import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, Sword, Heart, Sparkles, ArrowRight, Play, Shield, Star } from 'lucide-react';

const HomePage = ({ theme }) => {
  const features = [
    {
      icon: Sword,
      title: 'Epic Battles',
      description: 'Strategic turn-based combat with 98+ commands',
      color: '#FF4444'
    },
    {
      icon: Crown,
      title: '50+ Characters',
      description: 'Collect legendary characters across 7 rarity tiers',
      color: '#FFD700'
    },
    {
      icon: Users,
      title: 'Guild System',
      description: 'Team up with friends for collaborative gameplay',
      color: '#4169E1'
    },
    {
      icon: Heart,
      title: 'Character Bonds',
      description: 'Build relationships and unlock special abilities',
      color: '#FF69B4'
    }
  ];

  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=1344603209829974016&permissions=8&scope=bot`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6"
              style={{ color: theme.colors.text }}
            >
              🌸 KoKoroMichi
            </h1>
            <p 
              className="text-xl sm:text-2xl lg:text-3xl mb-8 max-w-4xl mx-auto"
              style={{ color: theme.colors.textSecondary }}
            >
              The Ultimate Discord RPG Experience
            </p>
            <p 
              className="text-lg mb-12 max-w-3xl mx-auto leading-relaxed"
              style={{ color: theme.colors.textSecondary }}
            >
              Embark on an epic journey with 98+ commands, strategic battles, character collection, 
              guild warfare, and endless adventures in the most advanced Discord RPG bot.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.a
              href={inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg flex items-center space-x-2"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.text 
              }}
            >
              <Crown size={24} />
              <span>Invite to Discord</span>
            </motion.a>
            
            <motion.a
              href="/commands"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 border-2 flex items-center space-x-2"
              style={{ 
                borderColor: theme.colors.primary,
                color: theme.colors.primary,
                backgroundColor: 'transparent'
              }}
            >
              <Play size={20} />
              <span>View Commands</span>
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: '98+', label: 'Commands' },
              { number: '33', label: 'Modules' },
              { number: '50+', label: 'Characters' },
              { number: '7', label: 'Rarities' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div 
                  className="text-3xl font-bold mb-2"
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
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 
              className="text-4xl font-bold mb-6"
              style={{ color: theme.colors.text }}
            >
              🎮 Game Features
            </h2>
            <p 
              className="text-lg max-w-3xl mx-auto"
              style={{ color: theme.colors.textSecondary }}
            >
              Experience the most comprehensive Discord RPG with advanced combat, 
              character collection, and social gameplay features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="text-center p-8 rounded-xl border border-white/20 backdrop-blur-md"
                  style={{ backgroundColor: `${theme.colors.surface}80` }}
                >
                  <div 
                    className="w-16 h-16 mx-auto mb-6 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: feature.color }}
                  >
                    <Icon size={32} color="white" />
                  </div>
                  <h3 
                    className="text-xl font-bold mb-4"
                    style={{ color: theme.colors.text }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-white/20 backdrop-blur-md"
          style={{ backgroundColor: `${theme.colors.surface}90` }}
        >
          <div className="text-6xl mb-6">⚔️</div>
          <h3 
            className="text-3xl font-bold mb-4"
            style={{ color: theme.colors.text }}
          >
            Ready to Begin Your Adventure?
          </h3>
          <p 
            className="text-lg mb-8"
            style={{ color: theme.colors.textSecondary }}
          >
            Join thousands of players in the ultimate Discord RPG experience. 
            Build your collection, form alliances, and become a legend!
          </p>
          <motion.a
            href={inviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
            style={{ 
              backgroundColor: theme.colors.primary,
              color: theme.colors.text 
            }}
          >
            <Shield size={24} />
            <span>Invite KoKoroMichi</span>
            <ArrowRight size={20} />
          </motion.a>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default HomePage;