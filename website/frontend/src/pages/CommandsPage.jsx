import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Clock, BarChart3, Lock, Unlock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const CommandsPage = () => {
  const { theme } = useTheme();
  const [commands, setCommands] = useState([]);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCommand, setSelectedCommand] = useState(null);

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    try {
      const response = await axios.get('/api/commands');
      setCommands(response.data.commands);
      
      // Build categories map
      const categoriesMap = {};
      response.data.commands.forEach(cmd => {
        if (!categoriesMap[cmd.category]) {
          categoriesMap[cmd.category] = cmd.categoryData;
        }
      });
      setCategories(categoriesMap);
    } catch (error) {
      console.error('Failed to fetch commands:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCommands = commands
    .filter(cmd => {
      const matchesSearch = cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cmd.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || cmd.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'cooldown':
          return a.cooldown - b.cooldown;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const formatCooldown = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
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
              Bot Commands
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Explore all {commands.length} available commands across {Object.keys(categories).length} categories
            </p>
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
                  placeholder="Search commands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field pl-10 appearance-none"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="relative">
                <BarChart3 size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field pl-10 appearance-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="usage">Sort by Usage</option>
                  <option value="cooldown">Sort by Cooldown</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Commands Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-4 bg-gray-600 rounded mb-4"></div>
                  <div className="h-3 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              <AnimatePresence>
                {filteredCommands.map((command, index) => (
                  <motion.div
                    key={command.name}
                    className="card cursor-pointer group hover:scale-105 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    layout
                    onClick={() => setSelectedCommand(command)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{categories[command.category]?.icon}</span>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {command.name}
                        </h3>
                      </div>
                      {command.restricted ? (
                        <Lock size={16} className="text-red-400" />
                      ) : (
                        <Unlock size={16} className="text-green-400" />
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {command.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatCooldown(command.cooldown)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 size={12} />
                        <span>{command.usageCount.toLocaleString()} uses</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="mt-3">
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          backgroundColor: `${theme.colors.primary}20`,
                          color: theme.colors.primary 
                        }}
                      >
                        {categories[command.category]?.name}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {/* No Results */}
          {!isLoading && filteredCommands.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 text-lg">
                No commands found matching your criteria.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Command Details Modal */}
      <AnimatePresence>
        {selectedCommand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCommand(null)}
            />
            <motion.div
              className="relative bg-slate-800 rounded-xl p-6 max-w-md w-full border border-slate-700"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {selectedCommand.name}
              </h3>
              <p className="text-gray-400 mb-4">
                {selectedCommand.description}
              </p>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Category:</span>
                  <span className="text-white">
                    {categories[selectedCommand.category]?.icon} {categories[selectedCommand.category]?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cooldown:</span>
                  <span className="text-white">{formatCooldown(selectedCommand.cooldown)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Usage Count:</span>
                  <span className="text-white">{selectedCommand.usageCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Access:</span>
                  <span className={selectedCommand.restricted ? 'text-red-400' : 'text-green-400'}>
                    {selectedCommand.restricted ? 'Admin Only' : 'Everyone'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCommand(null)}
                className="mt-6 w-full btn-primary"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandsPage;