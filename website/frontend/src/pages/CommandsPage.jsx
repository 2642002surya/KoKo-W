import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sword, Heart, Coins, Users, Hammer, Gamepad2, Calendar, Trophy, Sparkles, Settings, ChevronDown, ChevronUp, Crown, Star, Shield, Zap } from 'lucide-react';

const CommandsPage = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [commandsData, setCommandsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showHelpSimulation, setShowHelpSimulation] = useState(false);

  // Load commands from API with comprehensive fallback
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const response = await fetch('/api/commands');
        const data = await response.json();
        if (data.success) {
          setCommandsData(data.categoriesData);
        }
      } catch (error) {
        console.log('Using local command data (backend not available)');
        // Comprehensive fallback data
        setCommandsData({
          'Profile & Collection': {
            icon: '👤',
            color: '#FF69B4',
            description: 'Manage your profile and character collection',
            commands: [
              { name: '!profile', aliases: ['!p'], description: 'Display your user profile with stats and collection overview', usage: '!profile [member]', cooldown: 5 },
              { name: '!collection', aliases: ['!waifus', '!characters'], description: 'View your complete character collection with pagination', usage: '!collection [page]', cooldown: 3 },
              { name: '!inspect', aliases: ['!char', '!character'], description: 'Get detailed information about a specific character', usage: '!inspect <character_name>', cooldown: 2 },
              { name: '!compare', aliases: [], description: 'Compare stats between two characters', usage: '!compare <char1> <char2>', cooldown: 5 },
              { name: '!top', aliases: ['!strongest'], description: 'Show your top characters by stats', usage: '!top [sort_by]', cooldown: 3 },
              { name: '!gallery', aliases: ['!images'], description: 'View character gallery with unlockable images', usage: '!gallery [character]', cooldown: 3 }
            ]
          },
          'Combat & Battles': {
            icon: '⚔️',
            color: '#FF4444',
            description: 'Engage in strategic battles and combat systems',
            commands: [
              { name: '!battle', aliases: ['!combat'], description: 'Start battles with advanced combat mechanics', usage: '!battle [character] [target]', cooldown: 30 },
              { name: '!arena', aliases: ['!fight'], description: 'Enter competitive arena battles', usage: '!arena [character]', cooldown: 60 },
              { name: '!pvp_duel', aliases: ['!pvp'], description: 'Challenge another player to a duel', usage: '!pvp_duel [opponent]', cooldown: 120 },
              { name: '!bosses', aliases: ['!raids'], description: 'View and join world boss raids', usage: '!bosses', cooldown: 10 },
              { name: '!arenastats', aliases: [], description: 'View arena statistics and rankings', usage: '!arenastats', cooldown: 5 }
            ]
          },
          'Summoning & Gacha': {
            icon: '🎲',
            color: '#9400D3',
            description: 'Acquire new characters through the gacha system',
            commands: [
              { name: '!summon', aliases: ['!pull', '!gacha'], description: 'Summon new characters using gems', usage: '!summon [amount]', cooldown: 10 },
              { name: '!rates', aliases: [], description: 'View current summoning rates', usage: '!rates', cooldown: 5 },
              { name: '!pity', aliases: [], description: 'Check your pity counter status', usage: '!pity', cooldown: 3 }
            ]
          },
          'Economy & Trading': {
            icon: '💰',
            color: '#FFD700',
            description: 'Build wealth through investments and trading',
            commands: [
              { name: '!invest', aliases: [], description: 'Invest in businesses for passive income', usage: '!invest [type]', cooldown: 300 },
              { name: '!businesses', aliases: ['!portfolio'], description: 'View your business portfolio', usage: '!businesses', cooldown: 5 },
              { name: '!daily', aliases: ['!claim'], description: 'Claim daily login rewards', usage: '!daily', cooldown: 86400 },
              { name: '!store', aliases: ['!shop'], description: 'Browse the store for items', usage: '!store [category]', cooldown: 5 },
              { name: '!auction list', aliases: [], description: 'Browse available auctions', usage: '!auction list', cooldown: 5 }
            ]
          },
          'Guilds & Social': {
            icon: '🏰',
            color: '#4169E1',
            description: 'Join guilds and participate in collaborative gameplay',
            commands: [
              { name: '!guild', aliases: [], description: 'View guild information and statistics', usage: '!guild', cooldown: 5 },
              { name: '!guild create', aliases: [], description: 'Create your own guild', usage: '!guild create <name>', cooldown: 86400 },
              { name: '!guild join', aliases: [], description: 'Join an existing guild', usage: '!guild join <id>', cooldown: 300 },
              { name: '!fanclubs', aliases: ['!clubs'], description: 'View active fan clubs', usage: '!fanclubs', cooldown: 5 }
            ]
          },
          'Crafting & Items': {
            icon: '🔨',
            color: '#8B4513',
            description: 'Create items and manage equipment',
            commands: [
              { name: '!craft', aliases: ['!create'], description: 'Craft items using materials', usage: '!craft <recipe>', cooldown: 60 },
              { name: '!gather', aliases: [], description: 'Gather materials from locations', usage: '!gather [location]', cooldown: 1800 },
              { name: '!relics', aliases: [], description: 'View and manage your relics', usage: '!relics [character]', cooldown: 5 },
              { name: '!inventory', aliases: ['!inv'], description: 'View your item inventory', usage: '!inventory', cooldown: 3 }
            ]
          },
          'Pets & Companions': {
            icon: '🐾',
            color: '#32CD32',
            description: 'Adopt and care for loyal companions',
            commands: [
              { name: '!pets', aliases: [], description: 'View your pet collection', usage: '!pets', cooldown: 5 },
              { name: '!adopt_pet', aliases: ['!adopt'], description: 'Adopt a new pet companion', usage: '!adopt_pet <species>', cooldown: 86400 },
              { name: '!feed_pet', aliases: ['!feed'], description: 'Feed your pets to maintain happiness', usage: '!feed_pet <pet>', cooldown: 3600 },
              { name: '!petrace', aliases: ['!race'], description: 'Enter pets in racing competitions', usage: '!petrace <pet>', cooldown: 3600 }
            ]
          },
          'Mini Games & Fun': {
            icon: '🎮',
            color: '#00CED1',
            description: 'Enjoy various mini-games and entertainment',
            commands: [
              { name: '!games', aliases: [], description: 'View available mini-games', usage: '!games', cooldown: 5 },
              { name: '!rps', aliases: [], description: 'Play rock paper scissors', usage: '!rps <choice>', cooldown: 60 },
              { name: '!slots', aliases: [], description: 'Try the slot machine', usage: '!slots [bet]', cooldown: 300 },
              { name: '!8ball', aliases: [], description: 'Ask the magic 8-ball', usage: '!8ball <question>', cooldown: 60 }
            ]
          },
          'Administration': {
            icon: '🛡️',
            color: '#DC143C',
            description: 'Administrative commands for server management',
            commands: [
              { name: '!admin', aliases: [], description: 'Access admin panel (DM only)', usage: '!admin', cooldown: 5 },
              { name: '!server_setup', aliases: ['!setup'], description: 'Auto-setup bot channels', usage: '!server_setup', cooldown: 86400 },
              { name: '!admin stats', aliases: [], description: 'View bot statistics', usage: '!admin stats', cooldown: 30 }
            ]
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommands();
  }, []);

  const simulateHelpCommand = () => {
    setShowHelpSimulation(true);
    setSearchTerm('');
    setSelectedCategory('all');
    const expanded = {};
    Object.keys(commandsData).forEach(category => {
      expanded[category] = true;
    });
    setExpandedCategories(expanded);
    
    // Show simulation effect
    setTimeout(() => setShowHelpSimulation(false), 2000);
  };

  const filteredCategories = Object.entries(commandsData).reduce((acc, [categoryName, categoryData]) => {
    if (selectedCategory !== 'all' && selectedCategory !== categoryName) {
      return acc;
    }

    const filteredCommands = (categoryData.commands || []).filter(command => {
      const searchLower = searchTerm.toLowerCase();
      return (
        command.name.toLowerCase().includes(searchLower) ||
        command.description.toLowerCase().includes(searchLower) ||
        (command.aliases || []).some(alias => alias.toLowerCase().includes(searchLower))
      );
    });

    if (filteredCommands.length > 0) {
      acc[categoryName] = {
        ...categoryData,
        commands: filteredCommands
      };
    }

    return acc;
  }, {});

  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Icon mapping for emoji icons
  const iconMap = {
    '👤': Heart,
    '⚔️': Sword,
    '🎲': Sparkles,
    '💰': Coins,
    '🏰': Users,
    '🔨': Hammer,
    '🌟': Star,
    '🐾': Heart,
    '🎉': Calendar,
    '🏆': Trophy,
    '💖': Heart,
    '🎮': Gamepad2,
    '🗺️': Settings,
    '🔧': Settings,
    '🛡️': Shield
  };

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
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: theme.colors.text }}
          >
            📚 Bot Commands
          </h1>
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: theme.colors.textSecondary }}
          >
            Discover all 98+ commands across 11 categories. Master the art of character collection, 
            strategic battles, guild cooperation, and so much more!
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-4"
        >
          <div 
            className="p-4 rounded-lg border border-white/20 text-center"
            style={{ backgroundColor: `${theme.colors.surface}80` }}
          >
            <p 
              className="text-sm mb-3"
              style={{ color: theme.colors.textSecondary }}
            >
              Type !help and press enter
            </p>
            <motion.button
              onClick={simulateHelpCommand}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={showHelpSimulation ? { 
                backgroundColor: [theme.colors.primary, theme.colors.accent, theme.colors.primary],
                scale: [1, 1.1, 1]
              } : {}}
              transition={{ duration: 0.5, repeat: showHelpSimulation ? 3 : 0 }}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg flex items-center space-x-2 mx-auto"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.text 
              }}
            >
              <Zap size={16} />
              <span>!help</span>
              {showHelpSimulation && <span className="animate-pulse">✨</span>}
            </motion.button>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Search 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2" 
              style={{ color: theme.colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search commands by name, alias, or description..."
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

          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === 'all' ? 'ring-2' : ''
              }`}
              style={{ 
                backgroundColor: selectedCategory === 'all' ? theme.colors.primary : `${theme.colors.surface}80`,
                color: theme.colors.text,
                ringColor: theme.colors.accent
              }}
            >
              All Categories
            </button>
            {Object.keys(commandsData).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category ? 'ring-2' : ''
                }`}
                style={{ 
                  backgroundColor: selectedCategory === category ? theme.colors.primary : `${theme.colors.surface}80`,
                  color: theme.colors.text,
                  ringColor: theme.colors.accent
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
              style={{ borderTopColor: theme.colors.primary }}
            />
            <p style={{ color: theme.colors.textSecondary }}>Loading commands...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredCategories).map(([categoryName, categoryData], index) => {
              const Icon = iconMap[categoryData.icon] || Settings;
              const isExpanded = expandedCategories[categoryName];
              
              return (
                <motion.div
                  key={categoryName}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-white/20 overflow-hidden backdrop-blur-md"
                  style={{ backgroundColor: `${theme.colors.surface}80` }}
                >
                  <button
                    onClick={() => toggleCategory(categoryName)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: categoryData.color }}
                      >
                        <Icon size={24} color="white" />
                      </div>
                      <div className="text-left">
                        <h3 
                          className="text-xl font-bold"
                          style={{ color: theme.colors.text }}
                        >
                          {categoryName}
                        </h3>
                        <p 
                          className="text-sm"
                          style={{ color: theme.colors.textSecondary }}
                        >
                          {categoryData.description} • {categoryData.commands?.length || 0} commands
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={24} style={{ color: theme.colors.textSecondary }} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="border-t border-white/10"
                      >
                        <div className="p-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {(categoryData.commands || []).map((command, cmdIndex) => (
                            <motion.div
                              key={command.name}
                              initial={{ y: 10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: cmdIndex * 0.05 }}
                              className="p-4 rounded-lg border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all duration-200"
                              style={{ backgroundColor: `${theme.colors.background}40` }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 
                                  className="font-mono font-bold text-sm"
                                  style={{ color: categoryData.color }}
                                >
                                  {command.name}
                                </h4>
                                {command.cooldown && (
                                  <span 
                                    className="text-xs px-2 py-1 rounded"
                                    style={{ 
                                      backgroundColor: `${theme.colors.accent}20`,
                                      color: theme.colors.accent 
                                    }}
                                  >
                                    {command.cooldown < 60 ? `${command.cooldown}s` : 
                                     command.cooldown < 3600 ? `${Math.floor(command.cooldown/60)}m` : 
                                     `${Math.floor(command.cooldown/3600)}h`}
                                  </span>
                                )}
                              </div>
                              
                              <p 
                                className="text-sm mb-3 leading-relaxed"
                                style={{ color: theme.colors.text }}
                              >
                                {command.description}
                              </p>
                              
                              <div className="space-y-2">
                                <div>
                                  <span 
                                    className="text-xs font-semibold"
                                    style={{ color: theme.colors.textSecondary }}
                                  >
                                    Usage:
                                  </span>
                                  <code 
                                    className="ml-2 text-xs px-2 py-1 rounded"
                                    style={{ 
                                      backgroundColor: `${theme.colors.primary}20`,
                                      color: theme.colors.primary 
                                    }}
                                  >
                                    {command.usage}
                                  </code>
                                </div>
                                
                                {command.aliases && command.aliases.length > 0 && (
                                  <div>
                                    <span 
                                      className="text-xs font-semibold"
                                      style={{ color: theme.colors.textSecondary }}
                                    >
                                      Aliases:
                                    </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {command.aliases.map(alias => (
                                        <span 
                                          key={alias}
                                          className="text-xs px-2 py-1 rounded"
                                          style={{ 
                                            backgroundColor: `${theme.colors.surface}60`,
                                            color: theme.colors.textSecondary 
                                          }}
                                        >
                                          {alias}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && Object.keys(filteredCategories).length === 0 && (
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
              No commands found
            </h3>
            <p 
              style={{ color: theme.colors.textSecondary }}
            >
              Try adjusting your search terms or use the !help button above
            </p>
          </motion.div>
        )}
        
        {/* Command Statistics */}
        {!loading && Object.keys(commandsData).length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 text-center p-8 rounded-xl border border-white/20 backdrop-blur-md"
            style={{ backgroundColor: `${theme.colors.surface}80` }}
          >
            <h3 
              className="text-2xl font-bold mb-4"
              style={{ color: theme.colors.text }}
            >
              📊 Command Database Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Commands', value: Object.values(commandsData).reduce((sum, cat) => sum + (cat.commands?.length || 0), 0), icon: Crown },
                { label: 'Categories', value: Object.keys(commandsData).length, icon: Users },
                { label: 'Admin Commands', value: commandsData['Administration']?.commands?.length || 0, icon: Shield },
                { label: 'Fun Commands', value: commandsData['Mini Games & Fun']?.commands?.length || 0, icon: Gamepad2 }
              ].map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div 
                      className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <StatIcon size={20} color={theme.colors.text} />
                    </div>
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: theme.colors.accent }}
                    >
                      {stat.value}
                    </div>
                    <div 
                      className="text-sm"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Enhanced Help Guide */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 p-8 rounded-xl border border-white/20 backdrop-blur-md"
          style={{ backgroundColor: `${theme.colors.surface}80` }}
        >
          <h3 
            className="text-xl font-bold mb-4 flex items-center"
            style={{ color: theme.colors.text }}
          >
            <Sparkles size={24} className="mr-2" style={{ color: theme.colors.accent }} />
            Getting Started Guide
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>
                🌟 New Player Path
              </h4>
              <div className="space-y-1 text-sm" style={{ color: theme.colors.textSecondary }}>
                <div>1. Use <code className="bg-black/20 px-1 rounded">!daily</code> for login rewards</div>
                <div>2. Try <code className="bg-black/20 px-1 rounded">!summon</code> to get your first characters</div>
                <div>3. Check <code className="bg-black/20 px-1 rounded">!profile</code> to see your progress</div>
                <div>4. Use <code className="bg-black/20 px-1 rounded">!battle</code> for your first combat</div>
                <div>5. Join a guild with <code className="bg-black/20 px-1 rounded">!guild join</code></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-2" style={{ color: theme.colors.accent }}>
                💡 Pro Tips
              </h4>
              <div className="space-y-1 text-sm" style={{ color: theme.colors.textSecondary }}>
                <div>• Most commands have shorter aliases (e.g., !p for !profile)</div>
                <div>• Use angle brackets &lt;&gt; for required parameters</div>
                <div>• Square brackets [] indicate optional parameters</div>
                <div>• Admin commands only work in DMs for security</div>
                <div>• Some commands have cooldowns to prevent spam</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommandsPage;