import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Terminal, ChevronDown, ChevronRight, Crown, Sword, Users, Heart, Sparkles, Zap, Shield, Star, Gift, Command } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const CommandSearchSystem = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategories, setExpandedCategories] = useState(new Set())
  const [simulateHelp, setSimulateHelp] = useState(false)
  const [typingText, setTypingText] = useState('')
  const { theme } = useTheme()

  // Complete command database based on actual bot structure
  const commandDatabase = [
    {
      category: 'Profile & Collection',
      icon: Crown,
      color: theme.primary,
      description: 'Manage your profile and character collection',
      commands: [
        { name: '!profile', description: 'Display your user profile with comprehensive stats and achievements', usage: '!profile [member]', cooldown: 5, aliases: ['!p'] },
        { name: '!collection', description: 'View your complete character collection with filters', usage: '!collection [page]', cooldown: 3, aliases: ['!waifus', '!characters'] },
        { name: '!inspect', description: 'Get detailed character information including stats and abilities', usage: '!inspect <character>', cooldown: 2, aliases: ['!char', '!character'] },
        { name: '!stats', description: 'View your personal gameplay statistics', usage: '!stats', cooldown: 5, aliases: ['!mystats'] },
        { name: '!gallery', description: 'Browse character art and unlock galleries', usage: '!gallery [character]', cooldown: 3, aliases: ['!images', '!pics'] },
        { name: '!unlock', description: 'View unlock progress and requirements', usage: '!unlock [type]', cooldown: 2, aliases: ['!unlocks'] }
      ]
    },
    {
      category: 'Combat & Battles',
      icon: Sword,
      color: '#ef4444',
      description: 'Engage in strategic battles and combat',
      commands: [
        { name: '!battle', description: 'Start battles against NPCs or challenge other players', usage: '!battle [character] [target]', cooldown: 30, aliases: ['!combat'] },
        { name: '!arena', description: 'Enter competitive arena battles for glory', usage: '!arena [character]', cooldown: 60, aliases: ['!fight', '!duel'] },
        { name: '!pvp_duel', description: 'Challenge another player to PvP combat', usage: '!pvp_duel @user', cooldown: 120, aliases: ['!pvp', '!challenge'] },
        { name: '!quick_arena', description: 'Quick arena battle with strongest character', usage: '!quick_arena', cooldown: 45, aliases: ['!qa'] },
        { name: '!arenastats', description: 'View your arena performance statistics', usage: '!arenastats', cooldown: 5, aliases: ['!arenastat'] },
        { name: '!bosses', description: 'Face legendary world bosses in epic raids', usage: '!bosses', cooldown: 300, aliases: ['!world_boss', '!raid'] },
        { name: '!join_raid', description: 'Join an active boss raid battle', usage: '!join_raid', cooldown: 60, aliases: ['!attack_boss'] }
      ]
    },
    {
      category: 'Character Summoning',
      icon: Sparkles,
      color: '#8b5cf6',
      description: 'Summon new characters and manage gacha',
      commands: [
        { name: '!summon', description: 'Summon new characters through the gacha system', usage: '!summon [amount]', cooldown: 10, aliases: ['!pull', '!gacha'] },
        { name: '!rates', description: 'View current summon rates and probabilities', usage: '!rates', cooldown: 3, aliases: ['!summon_rates'] },
        { name: '!upgrade', description: 'Upgrade and enhance your characters', usage: '!upgrade <character>', cooldown: 15, aliases: ['!levelup', '!enhance'] },
        { name: '!train', description: 'Train characters to improve their abilities', usage: '!train <character>', cooldown: 20, aliases: ['!training'] },
        { name: '!potential', description: 'Awaken character potential for massive power', usage: '!potential <character>', cooldown: 30, aliases: ['!awaken'] }
      ]
    },
    {
      category: 'Economy & Trading',
      icon: Zap,
      color: '#10b981',
      description: 'Manage your wealth and trade with others',
      commands: [
        { name: '!store', description: 'Browse the shop for items and equipment', usage: '!store [category]', cooldown: 5, aliases: ['!shop', '!market'] },
        { name: '!buy', description: 'Purchase items from the store', usage: '!buy <item> [amount]', cooldown: 3, aliases: ['!purchase'] },
        { name: '!inventory', description: 'View your items and equipment', usage: '!inventory [type]', cooldown: 3, aliases: ['!inv', '!items'] },
        { name: '!use', description: 'Use consumable items from your inventory', usage: '!use <item>', cooldown: 5, aliases: ['!consume'] },
        { name: '!give', description: 'Give items to other players', usage: '!give @user <item> [amount]', cooldown: 10, aliases: ['!gift'] },
        { name: '!invest', description: 'Invest in businesses and manage portfolio', usage: '!invest <business> <amount>', cooldown: 60, aliases: ['!investment'] },
        { name: '!businesses', description: 'View your investment portfolio', usage: '!businesses', cooldown: 5, aliases: ['!portfolio'] },
        { name: '!collect', description: 'Collect returns from your investments', usage: '!collect', cooldown: 10, aliases: ['!claim'] },
        { name: '!auction', description: 'Participate in auctions for rare items', usage: '!auction <action>', cooldown: 30, aliases: ['!bid'] }
      ]
    },
    {
      category: 'Guild & Social',
      icon: Users,
      color: '#3b82f6',
      description: 'Team up with friends and join guilds',
      commands: [
        { name: '!guild', description: 'Manage guild operations and view information', usage: '!guild [action]', cooldown: 10, aliases: ['!g'] },
        { name: '!fanclubs', description: 'Join and manage character fan clubs', usage: '!fanclubs', cooldown: 5, aliases: ['!clubs'] },
        { name: '!join_club', description: 'Join a specific character fan club', usage: '!join_club <character>', cooldown: 10, aliases: ['!join_fanclub'] },
        { name: '!vote', description: 'Vote in fan club events and polls', usage: '!vote <option>', cooldown: 3, aliases: ['!fan_vote'] },
        { name: '!club_events', description: 'View upcoming fan club events', usage: '!club_events', cooldown: 5, aliases: ['!fan_events'] },
        { name: '!create_club', description: 'Start a new fan club for characters', usage: '!create_club <character>', cooldown: 60, aliases: ['!start_club'] }
      ]
    },
    {
      category: 'Relationships & Affection',
      icon: Heart,
      color: '#ec4899',
      description: 'Build bonds with your characters',
      commands: [
        { name: '!intimate', description: 'Interact with characters to build affection', usage: '!intimate <character>', cooldown: 30, aliases: ['!interact', '!affection'] },
        { name: '!relationship', description: 'Check relationship status with characters', usage: '!relationship <character>', cooldown: 5, aliases: ['!bond', '!affection_status'] }
      ]
    },
    {
      category: 'Crafting & Equipment',
      icon: Shield,
      color: '#f59e0b',
      description: 'Craft items and manage equipment',
      commands: [
        { name: '!craft', description: 'Craft items using recipes and materials', usage: '!craft <recipe>', cooldown: 15, aliases: ['!create'] },
        { name: '!gather', description: 'Gather crafting materials from the world', usage: '!gather', cooldown: 20, aliases: ['!collect_materials'] },
        { name: '!materials', description: 'View your crafting materials inventory', usage: '!materials', cooldown: 3, aliases: ['!mats'] },
        { name: '!relics', description: 'Manage powerful relics and equipment', usage: '!relics', cooldown: 5, aliases: ['!equipment', '!gear'] },
        { name: '!equip_relic', description: 'Equip relics to boost character power', usage: '!equip_relic <relic> <character>', cooldown: 10, aliases: ['!equip'] },
        { name: '!forge_relic', description: 'Forge new relics using materials', usage: '!forge_relic <recipe>', cooldown: 30, aliases: ['!forge'] },
        { name: '!relic_recipes', description: 'View available relic forging recipes', usage: '!relic_recipes', cooldown: 3, aliases: ['!forge_list'] }
      ]
    },
    {
      category: 'Events & Activities',
      icon: Star,
      color: '#6366f1',
      description: 'Participate in events and activities',
      commands: [
        { name: '!daily', description: 'Claim daily rewards and bonuses', usage: '!daily', cooldown: 5, aliases: ['!daily_reward'] },
        { name: '!streak', description: 'View your daily login streak', usage: '!streak', cooldown: 3, aliases: ['!login_streak'] },
        { name: '!rewards', description: 'View reward schedule and upcoming bonuses', usage: '!rewards', cooldown: 5, aliases: ['!schedule'] },
        { name: '!events', description: 'View active seasonal events', usage: '!events', cooldown: 5, aliases: ['!seasonal'] },
        { name: '!dreams', description: 'Manage dream events and experiences', usage: '!dreams', cooldown: 10, aliases: ['!dreamstatus'] },
        { name: '!complete_dream', description: 'Complete active dream sequences', usage: '!complete_dream', cooldown: 15, aliases: ['!collect_dream'] },
        { name: '!dream_buffs', description: 'View active dream buffs and bonuses', usage: '!dream_buffs', cooldown: 3, aliases: ['!buffs'] },
        { name: '!quests', description: 'View and manage your active quests', usage: '!quests', cooldown: 5, aliases: ['!missions', '!tasks'] },
        { name: '!complete_quest', description: 'Complete and claim quest rewards', usage: '!complete_quest <quest_id>', cooldown: 10, aliases: ['!claim_quest'] }
      ]
    },
    {
      category: 'Community & Contests',
      icon: Gift,
      color: '#f97316',
      description: 'Join contests and community events',
      commands: [
        { name: '!contests', description: 'View active contests and competitions', usage: '!contests', cooldown: 5, aliases: ['!contest'] },
        { name: '!moodpoll', description: 'Participate in daily mood polls', usage: '!moodpoll', cooldown: 10, aliases: ['!mood'] },
        { name: '!fancontest', description: 'Join fan contests for creative expression', usage: '!fancontest [type]', cooldown: 15, aliases: ['!fanart'] },
        { name: '!petrace', description: 'Organize and join pet racing events', usage: '!petrace', cooldown: 20, aliases: ['!race'] },
        { name: '!achievements', description: 'View your achievement progress', usage: '!achievements [category]', cooldown: 5, aliases: ['!achieve'] },
        { name: '!lore', description: 'Read lore books and unlock stories', usage: '!lore <book>', cooldown: 10, aliases: ['!story'] },
        { name: '!lorebooks', description: 'Browse available lore books', usage: '!lorebooks', cooldown: 3, aliases: ['!books', '!library'] }
      ]
    },
    {
      category: 'Mini Games & Fun',
      icon: Command,
      color: '#8b5cf6',
      description: 'Play games and have fun',
      commands: [
        { name: '!games', description: 'View available mini-games', usage: '!games', cooldown: 5, aliases: ['!minigames', '!play'] },
        { name: '!guess_number', description: 'Play the number guessing game', usage: '!guess_number', cooldown: 10, aliases: ['!number_game'] },
        { name: '!rps', description: 'Play rock paper scissors', usage: '!rps <choice>', cooldown: 5, aliases: ['!rockpaperscissors'] },
        { name: '!slots', description: 'Try your luck at the slot machine', usage: '!slots [bet]', cooldown: 15, aliases: ['!slot_machine'] },
        { name: '!trivia', description: 'Test your knowledge with trivia questions', usage: '!trivia', cooldown: 10, aliases: ['!quiz'] },
        { name: '!8ball', description: 'Ask the magic 8-ball a question', usage: '!8ball <question>', cooldown: 3, aliases: ['!eightball', '!ask'] },
        { name: '!roll', description: 'Roll dice for random numbers', usage: '!roll [sides]', cooldown: 3, aliases: ['!dice'] },
        { name: '!choose', description: 'Let the bot choose between options', usage: '!choose <option1> <option2> ...', cooldown: 3, aliases: ['!pick'] }
      ]
    },
    {
      category: 'Information & Help',
      icon: Command,
      color: '#64748b',
      description: 'Get help and information',
      commands: [
        { name: '!help', description: 'Get comprehensive help and command information', usage: '!help [command]', cooldown: 5, aliases: ['!h', '!help_info'] },
        { name: '!quickstart', description: 'Get started with the bot quickly', usage: '!quickstart', cooldown: 5, aliases: ['!start', '!guide'] },
        { name: '!features', description: 'Learn about bot features and capabilities', usage: '!features', cooldown: 5, aliases: ['!abilities'] },
        { name: '!list_commands', description: 'List all available commands by category', usage: '!list_commands', cooldown: 5, aliases: ['!commands'] },
        { name: '!about', description: 'Learn about the bot and its creator', usage: '!about', cooldown: 5, aliases: ['!info', '!botinfo'] },
        { name: '!ping', description: 'Check bot latency and connection', usage: '!ping', cooldown: 3, aliases: ['!latency'] },
        { name: '!serverinfo', description: 'Get information about the current server', usage: '!serverinfo', cooldown: 5, aliases: ['!server'] }
      ]
    }
  ]

  // Simulate typing effect for !help command
  useEffect(() => {
    if (simulateHelp) {
      const helpText = '!help'
      let currentText = ''
      let index = 0
      
      const typeInterval = setInterval(() => {
        if (index < helpText.length) {
          currentText += helpText[index]
          setTypingText(currentText)
          index++
        } else {
          clearInterval(typeInterval)
          setTimeout(() => {
            setSearchTerm('!help')
            setSimulateHelp(false)
            setTypingText('')
            // Expand the Information & Help category
            setExpandedCategories(new Set(['Information & Help']))
          }, 500)
        }
      }, 150)

      return () => clearInterval(typeInterval)
    }
  }, [simulateHelp])

  const filteredCommands = useMemo(() => {
    if (!searchTerm && !simulateHelp) return commandDatabase

    const searchLower = searchTerm.toLowerCase()
    return commandDatabase.map(category => ({
      ...category,
      commands: category.commands.filter(cmd =>
        cmd.name.toLowerCase().includes(searchLower) ||
        cmd.description.toLowerCase().includes(searchLower) ||
        cmd.aliases?.some(alias => alias.toLowerCase().includes(searchLower)) ||
        cmd.usage.toLowerCase().includes(searchLower)
      )
    })).filter(category => category.commands.length > 0)
  }, [searchTerm, simulateHelp])

  const toggleCategory = (categoryName) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryName)) {
      newExpanded.delete(categoryName)
    } else {
      newExpanded.add(categoryName)
    }
    setExpandedCategories(newExpanded)
  }

  const totalCommands = commandDatabase.reduce((acc, cat) => acc + cat.commands.length, 0)

  return (
    <div className="max-w-7xl mx-auto p-6" style={{ color: theme.textColor }}>
      {/* Header Section */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-bold mb-4" style={{ color: theme.primary }}>
          ⚡ Advanced Command Center
        </h1>
        <p className="text-xl opacity-90 max-w-3xl mx-auto">
          Discover all {totalCommands}+ commands across {commandDatabase.length} categories. 
          Master the complete power of KoKoroMichi!
        </p>
      </motion.div>

      {/* Search Simulation Section */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="max-w-2xl mx-auto mb-6">
          <div className="text-center mb-4">
            <p className="text-lg opacity-80">Try the interactive command search!</p>
            <button
              onClick={() => setSimulateHelp(true)}
              disabled={simulateHelp}
              className="mt-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: theme.primary,
                color: 'white',
                boxShadow: `0 4px 20px ${theme.primary}30`
              }}
            >
              {simulateHelp ? 'Typing...' : 'Simulate "!help" Command'}
            </button>
          </div>
          
          {/* Terminal Simulation */}
          <div 
            className="p-4 rounded-lg border font-mono text-sm"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor
            }}
          >
            <div className="flex items-center mb-2">
              <Terminal size={16} className="mr-2" style={{ color: theme.primary }} />
              <span style={{ color: theme.primary }}>KoKoroMichi Terminal</span>
            </div>
            <div className="flex items-center">
              <span style={{ color: theme.accent }}>{'>'}</span>
              <span className="ml-2">{simulateHelp ? typingText : searchTerm || 'Type !help and press enter'}</span>
              {simulateHelp && <span className="animate-pulse">|</span>}
            </div>
          </div>
        </div>

        {/* Main Search Bar */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
          <input
            type="text"
            placeholder="Search commands... (try typing !help, !battle, !summon, etc.)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor,
              color: theme.textColor,
              '--placeholder-color': theme.textColor + '80'
            }}
          />
        </div>
      </motion.div>

      {/* Results Section */}
      <div className="space-y-6">
        {filteredCommands.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No commands found</h3>
            <p className="opacity-70">Try searching for battle, summon, guild, or help</p>
          </motion.div>
        ) : (
          filteredCommands.map((category, categoryIndex) => {
            const isExpanded = expandedCategories.has(category.category)
            const Icon = category.icon

            return (
              <motion.div
                key={category.category}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="rounded-xl border overflow-hidden"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.borderColor
                }}
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.category)}
                  className="w-full p-6 flex items-center justify-between hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: category.color }}
                    >
                      <Icon size={24} color="white" />
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>
                        {category.category}
                      </h2>
                      <p className="opacity-70">{category.description}</p>
                      <p className="text-sm opacity-60">{category.commands.length} commands</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: category.color + '20',
                        color: category.color
                      }}
                    >
                      {category.commands.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={20} style={{ color: theme.primary }} />
                    ) : (
                      <ChevronRight size={20} style={{ color: theme.primary }} />
                    )}
                  </div>
                </button>

                {/* Commands List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 pt-0">
                        {category.commands.map((command, commandIndex) => (
                          <motion.div
                            key={command.name}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: commandIndex * 0.05 }}
                            className="p-4 rounded-lg border hover:scale-[1.02] transition-all duration-200"
                            style={{
                              backgroundColor: theme.cardBg,
                              borderColor: theme.borderColor + '60'
                            }}
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 
                                className="text-lg font-bold"
                                style={{ color: category.color }}
                              >
                                {command.name}
                              </h3>
                              <div className="flex items-center space-x-2 text-xs opacity-60">
                                <span>⏰ {command.cooldown}s</span>
                              </div>
                            </div>
                            
                            <p className="text-sm leading-relaxed mb-3 opacity-80">
                              {command.description}
                            </p>
                            
                            <div className="space-y-2">
                              <div>
                                <span className="text-xs uppercase tracking-wide font-semibold opacity-60">
                                  Usage
                                </span>
                                <code 
                                  className="block text-sm px-3 py-2 rounded font-mono"
                                  style={{
                                    backgroundColor: theme.primary + '20',
                                    color: category.color
                                  }}
                                >
                                  {command.usage}
                                </code>
                              </div>
                              
                              {command.aliases && command.aliases.length > 0 && (
                                <div>
                                  <span className="text-xs uppercase tracking-wide font-semibold opacity-60">
                                    Aliases
                                  </span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {command.aliases.map(alias => (
                                      <span
                                        key={alias}
                                        className="text-xs px-2 py-1 rounded font-mono"
                                        style={{
                                          backgroundColor: theme.accent + '20',
                                          color: theme.accent
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
            )
          })
        )}
      </div>

      {/* Command Statistics */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { icon: <Command size={24} />, number: totalCommands, label: 'Total Commands' },
          { icon: <Users size={24} />, number: commandDatabase.length, label: 'Categories' },
          { icon: <Zap size={24} />, number: '31', label: 'Bot Modules' },
          { icon: <Star size={24} />, number: 'Live', label: 'Status' }
        ].map((stat, index) => (
          <div
            key={index}
            className="text-center p-6 rounded-xl border"
            style={{
              backgroundColor: theme.cardBg,
              borderColor: theme.borderColor
            }}
          >
            <div className="flex justify-center mb-3" style={{ color: theme.primary }}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>
              {stat.number}
            </div>
            <div className="opacity-70">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default CommandSearchSystem