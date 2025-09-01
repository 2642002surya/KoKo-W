import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Users, Activity, Server, Zap, Heart, Sword, Crown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const HomePage = () => {
  const { theme } = useTheme();
  const [serverStats, setServerStats] = useState({
    memberCount: 0,
    onlineCount: 0,
    serverName: 'Tenshi no Yami Kyōkai',
    lastUpdated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServerStats();
    const interval = setInterval(fetchServerStats, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const fetchServerStats = async () => {
    try {
      const response = await axios.get('/api/server-stats');
      setServerStats(response.data);
    } catch (error) {
      console.error('Failed to fetch server stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Heart,
      title: 'Waifu Collection',
      description: 'Collect over 50+ unique characters with gacha mechanics'
    },
    {
      icon: Sword,
      title: 'Strategic Combat',
      description: 'Engage in turn-based battles with skills and elements'
    },
    {
      icon: Crown,
      title: 'Guild System',
      description: 'Join guilds for bonuses and collaborative gameplay'
    },
    {
      icon: Zap,
      title: '98 Commands',
      description: 'Comprehensive RPG experience with extensive features'
    }
  ];

  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=1344603209829974016&permissions=8&scope=bot`;

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-width">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-gaming font-bold mb-6">
                <span 
                  className="text-gradient bg-gradient-to-r"
                  style={{ 
                    backgroundImage: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.accent})` 
                  }}
                >
                  KoKoroMichi
                </span>
              </h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-8 font-elegant"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                The Ultimate Discord RPG Experience
              </motion.p>
              
              <motion.p 
                className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Immerse yourself in a comprehensive RPG world featuring waifu collection, strategic battles, 
                guild management, and over 98 commands across 33 specialized modules.
              </motion.p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  boxShadow: `0 10px 30px ${theme.colors.primary}40` 
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Add to Discord</span>
                <ExternalLink size={20} />
              </motion.a>
              
              <motion.a
                href="/commands"
                className="inline-flex items-center space-x-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-lg font-semibold text-white backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-105"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View Commands</span>
              </motion.a>
            </motion.div>

            {/* Server Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <div className="card text-center group hover:scale-105 transition-transform duration-300">
                <Users size={24} className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoading ? '...' : serverStats.memberCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Members</div>
              </div>
              
              <div className="card text-center group hover:scale-105 transition-transform duration-300">
                <Activity size={24} className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                <div className="text-2xl font-bold text-white mb-1">
                  {isLoading ? '...' : serverStats.onlineCount}
                </div>
                <div className="text-sm text-gray-400">Online</div>
              </div>
              
              <div className="card text-center group hover:scale-105 transition-transform duration-300">
                <Server size={24} className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                <div className="text-2xl font-bold text-white mb-1">98</div>
                <div className="text-sm text-gray-400">Commands</div>
              </div>
              
              <div className="card text-center group hover:scale-105 transition-transform duration-300">
                <Zap size={24} className="mx-auto mb-2" style={{ color: theme.colors.primary }} />
                <div className="text-2xl font-bold text-white mb-1">33</div>
                <div className="text-sm text-gray-400">Modules</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-slate-800/30">
        <div className="container-width">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-gaming font-bold mb-6 text-white">
              Epic Game Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Discover the comprehensive RPG experience that awaits you
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className="card text-center group hover:scale-105 transition-all duration-300 cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${theme.colors.primary}20` }}
                  >
                    <Icon size={32} style={{ color: theme.colors.primary }} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Discord Widget Section */}
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
              Join Our Community
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Connect with thousands of players in our Discord server
            </p>
            
            <div className="card max-w-md mx-auto">
              <iframe
                src="https://discord.com/widget?id=1344604154429046817&theme=dark"
                width="100%"
                height="500"
                allowTransparency="true"
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="rounded-lg"
                title="Discord Server Widget"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;