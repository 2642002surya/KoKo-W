import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Sword, Heart, Coins, Users, Hammer, Gamepad2, Calendar, Trophy, Sparkles, Settings, ChevronDown, ChevronUp } from 'lucide-react';

const CommandsPage = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState({});

  const commandCategories = {
    'Profile & Collection': {
      icon: Heart,
      color: '#FF69B4',
      description: 'Manage your profile and character collection',
      commands: [
        { name: '!profile', aliases: ['!profile'], description: 'Display your user profile with stats and collection overview', usage: '!profile [member]' },
        { name: '!collection', aliases: ['!waifus', '!characters'], description: 'View your complete character collection with pagination', usage: '!collection [page]' },
        { name: '!inspect', aliases: ['!char', '!character'], description: 'Get detailed information about a specific character', usage: '!inspect <character_name>' },
        { name: '!compare', aliases: [], description: 'Compare stats between two characters in your collection', usage: '!compare <char1> <char2>' },
        { name: '!top', aliases: ['!strongest', '!best'], description: 'Show your top characters sorted by various criteria', usage: '!top [sort_by]' },
        { name: '!stats', aliases: ['!mystats'], description: 'View detailed personal statistics and achievements', usage: '!stats' },
        { name: '!gallery', aliases: ['!images', '!pics'], description: 'View character gallery with unlockable images', usage: '!gallery [character_name]' },
        { name: '!unlock', aliases: ['!unlocks'], description: 'View image unlock progress for characters', usage: '!unlock' }
      ]
    },
    'Battle & Combat': {
      icon: Sword,
      color: '#FF4444',
      description: 'Engage in strategic battles and combat systems',
      commands: [
        { name: '!battle', aliases: ['!combat'], description: 'Start battles against NPCs or other players with advanced combat mechanics', usage: '!battle [character_name] [target]' },
        { name: '!arena', aliases: ['!fight', '!duel'], description: 'Enter competitive arena battles for rankings and rewards', usage: '!arena [character_name]' },
        { name: '!quick_arena', aliases: ['!quick_battle'], description: 'Quick arena battle against random opponents', usage: '!quick_arena' },
        { name: '!pvp_duel', aliases: ['!pvp', '!challenge'], description: 'Challenge another player to a strategic duel', usage: '!pvp_duel [opponent]' },
        { name: '!bosses', aliases: ['!world_boss', '!raid'], description: 'View and join world boss raids with your guild', usage: '!bosses' },
        { name: '!join_raid', aliases: ['!attack_boss'], description: 'Join an active world boss raid battle', usage: '!join_raid <boss_id>' },
        { name: '!arenastats', aliases: ['!arenareport'], description: 'View arena statistics and leaderboard rankings', usage: '!arenastats' }
      ]
    },
    'Economy & Trading': {
      icon: Coins,
      color: '#FFD700',
      description: 'Build wealth through investments, auctions, and trading',
      commands: [
        { name: '!invest', aliases: [], description: 'Invest in businesses for passive income generation', usage: '!invest [business_type]' },
        { name: '!businesses', aliases: ['!portfolio'], description: 'View your business portfolio and accumulated profits', usage: '!businesses' },
        { name: '!collect', aliases: [], description: 'Collect accumulated income from all your businesses', usage: '!collect' },
        { name: '!auction create', aliases: [], description: 'Create auction listings to sell items to other players', usage: '!auction create <item> <price>' },
        { name: '!auction list', aliases: [], description: 'Browse available auctions and find great deals', usage: '!auction list [category]' },
        { name: '!auction bid', aliases: [], description: 'Place bids on auction items you want to acquire', usage: '!auction bid <id> <amount>' },
        { name: '!store', aliases: ['!shop', '!market'], description: 'Browse the store for items, upgrades, and materials', usage: '!store [category]' },
        { name: '!buy', aliases: ['!purchase'], description: 'Purchase items from the store using your currency', usage: '!buy <item_id> <quantity>' },
        { name: '!daily', aliases: ['!claim', '!login'], description: 'Claim daily login rewards and maintain streaks', usage: '!daily' },
        { name: '!streak', aliases: ['!dailystreak'], description: 'View your current daily login streak status', usage: '!streak' }
      ]
    },
    'Guilds & Social': {
      icon: Users,
      color: '#4169E1',
      description: 'Join guilds and participate in collaborative gameplay',
      commands: [
        { name: '!guild', aliases: [], description: 'View guild information, members, and statistics', usage: '!guild' },
        { name: '!guild create', aliases: [], description: 'Create your own guild and become a guild master', usage: '!guild create <name> [faction]' },
        { name: '!guild join', aliases: [], description: 'Join an existing guild to gain bonuses and friends', usage: '!guild join <id>' },
        { name: '!guild leave', aliases: [], description: 'Leave your current guild (cannot be undone)', usage: '!guild leave' },
        { name: '!guild bank', aliases: [], description: 'Manage guild bank deposits and withdrawals', usage: '!guild bank [deposit/withdraw] [amount]' },
        { name: '!factions', aliases: [], description: 'View all available factions and their unique bonuses', usage: '!factions' },
        { name: '!fanclubs', aliases: ['!clubs', '!fan_club'], description: 'View active fan clubs and your memberships', usage: '!fanclubs' },
        { name: '!join_club', aliases: ['!join_fanclub'], description: 'Join a character fan club for special bonuses', usage: '!join_club <character>' },
        { name: '!vote', aliases: ['!fan_vote'], description: 'Vote for characters in fan club competitions', usage: '!vote <character>' }
      ]
    }
  };

  const simulateHelpCommand = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    const expanded = {};
    Object.keys(commandCategories).forEach(category => {
      expanded[category] = true;
    });
    setExpandedCategories(expanded);
  };

  const filteredCategories = Object.entries(commandCategories).reduce((acc, [categoryName, categoryData]) => {
    if (selectedCategory !== 'all' && selectedCategory !== categoryName) {
      return acc;
    }

    const filteredCommands = categoryData.commands.filter(command => {
      const searchLower = searchTerm.toLowerCase();
      return (
        command.name.toLowerCase().includes(searchLower) ||
        command.description.toLowerCase().includes(searchLower) ||
        command.aliases.some(alias => alias.toLowerCase().includes(searchLower))
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
            <button
              onClick={simulateHelpCommand}
              className="px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ 
                backgroundColor: theme.colors.primary,
                color: theme.colors.text 
              }}
            >
              !help
            </button>
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
        </motion.div>

        <div className="space-y-6">
          {Object.entries(filteredCategories).map(([categoryName, categoryData], index) => {
            const Icon = categoryData.icon;
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
                        {categoryData.description} • {categoryData.commands.length} commands
                      </p>
                    </div>
                  </div>
                  {isExpanded ? 
                    <ChevronUp size={24} style={{ color: theme.colors.textSecondary }} /> : 
                    <ChevronDown size={24} style={{ color: theme.colors.textSecondary }} />
                  }
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-6 space-y-4">
                        {categoryData.commands.map((command, cmdIndex) => (
                          <motion.div
                            key={command.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: cmdIndex * 0.05 }}
                            className="p-4 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-200"
                            style={{ backgroundColor: `${theme.colors.background}40` }}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                              <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                                <code 
                                  className="px-3 py-1 rounded-md font-mono font-bold text-sm"
                                  style={{ 
                                    backgroundColor: categoryData.color,
                                    color: 'white'
                                  }}
                                >
                                  {command.name}
                                </code>
                                {command.aliases.length > 0 && (
                                  <div className="flex space-x-1">
                                    {command.aliases.slice(0, 2).map((alias, i) => (
                                      <code 
                                        key={i}
                                        className="px-2 py-1 rounded text-xs font-mono"
                                        style={{ 
                                          backgroundColor: `${categoryData.color}30`,
                                          color: theme.colors.textSecondary
                                        }}
                                      >
                                        {alias}
                                      </code>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <code 
                                className="text-xs font-mono px-2 py-1 rounded"
                                style={{ 
                                  backgroundColor: `${theme.colors.surface}60`,
                                  color: theme.colors.textSecondary
                                }}
                              >
                                {command.usage}
                              </code>
                            </div>
                            <p 
                              className="text-sm leading-relaxed"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {command.description}
                            </p>
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

        {Object.keys(filteredCategories).length === 0 && (
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
              Try adjusting your search terms or filters
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default CommandsPage;