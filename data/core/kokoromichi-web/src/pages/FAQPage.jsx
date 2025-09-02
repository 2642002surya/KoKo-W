import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronRight, Send, Mail, MessageCircle, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

const FAQPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState(new Set())
  const [formData, setFormData] = useState({ email: '', discord: '', question: '' })
  const [submissionStatus, setSubmissionStatus] = useState(null)
  const formRef = useRef(null)
  const { theme } = useTheme()

  // Comprehensive FAQ database
  const faqData = [
    {
      category: '🚀 Getting Started',
      items: [
        {
          question: 'How do I start using KoKoroMichi?',
          answer: 'Welcome to KoKoroMichi! Start by using `!quickstart` to get a comprehensive beginner guide. Then use `!summon` to get your first characters and `!daily` to claim daily rewards. Check `!help` for a complete command list!'
        },
        {
          question: 'What are the basic commands I should know?',
          answer: 'Essential commands: `!profile` (view stats), `!summon` (get characters), `!collection` (view characters), `!daily` (claim rewards), `!help` (get help), `!battle` (start fighting), `!store` (buy items). Use `!list_commands` to see all available commands organized by category.'
        },
        {
          question: 'How do I get my first characters?',
          answer: 'Use the `!summon` command to pull characters from the gacha system. You start with some gems to get your first summons. Check `!rates` to see summon probabilities for different rarity tiers (N, R, SR, SSR, UR, LR, Mythic).'
        },
        {
          question: 'What currencies does the bot use?',
          answer: 'KoKoroMichi uses multiple currencies: **Gold** (main currency for basic purchases), **Gems** (premium currency for summons), **Materials** (for crafting), and **Event Tokens** (seasonal currencies). Earn them through battles, daily rewards, and events.'
        }
      ]
    },
    {
      category: '⚔️ Combat & Battles',
      items: [
        {
          question: 'How does the battle system work?',
          answer: 'KoKoroMichi features a strategic turn-based combat system. Use `!battle` for PvE fights or `!arena` for competitive battles. Combat includes elemental advantages, character skills, equipment bonuses, guild buffs, dream buffs, pet abilities, and relationship bonuses for deep tactical gameplay.'
        },
        {
          question: 'What affects my battle performance?',
          answer: 'Multiple factors influence combat: Character level, equipped relics, affection levels, guild bonuses, pet companions, dream buffs, traits, elemental advantages, and active events. Higher affection with characters provides significant combat bonuses!'
        },
        {
          question: 'Can I battle other players?',
          answer: 'Yes! Use `!pvp_duel @username` to challenge other players. There are also guild wars, arena tournaments, and world boss raids where you can compete or cooperate with other players for amazing rewards.'
        },
        {
          question: 'What are world bosses and raids?',
          answer: 'World bosses are powerful enemies that require multiple players to defeat. Use `!bosses` to see active raids and `!join_raid` to participate. Successful raids provide exclusive rewards and rare materials for the entire server.'
        }
      ]
    },
    {
      category: '🎮 Character Management',
      items: [
        {
          question: 'How do I make my characters stronger?',
          answer: 'Strengthen characters through: `!upgrade` (level up), `!train` (improve stats), `!potential` (awaken for massive power), `!intimate` (build affection for bonuses), and `!equip_relic` (add powerful equipment). Each method provides different types of improvements.'
        },
        {
          question: 'What is character affection and why is it important?',
          answer: 'Affection represents your bond with characters. Higher affection provides combat bonuses, unlocks special interactions, grants access to intimate commands, and improves their loyalty. Use `!intimate` to interact and build stronger relationships.'
        },
        {
          question: 'How do character rarities work?',
          answer: 'Characters have 7 rarity tiers: N (Common), R (Rare), SR (Super Rare), SSR (Super Super Rare), UR (Ultra Rare), LR (Legendary Rare), and Mythic (Ultimate). Higher rarities have better base stats, more skills, and greater potential for growth.'
        },
        {
          question: 'Can I trade or give characters to other players?',
          answer: 'Direct character trading is not available to prevent exploitation, but you can gift items, gold, and materials using `!give @user <item>`. Focus on building your own collection through summons, events, and achievements.'
        }
      ]
    },
    {
      category: '🏰 Guilds & Social Features',
      items: [
        {
          question: 'How do guilds work?',
          answer: 'Guilds are groups of players working together! Use `!guild` commands to join or create guilds. Guild members get shared bonuses, participate in guild wars, share resources, and compete in special events. Guild level and activity provide powerful buffs to all members.'
        },
        {
          question: 'What are fan clubs?',
          answer: 'Fan clubs are communities dedicated to specific characters. Use `!fanclubs` to see available clubs and `!join_club <character>` to join. Fan clubs offer exclusive events, character-specific bonuses, and social activities with other fans.'
        },
        {
          question: 'How do I participate in community events?',
          answer: 'Check `!events` for active seasonal events, `!contests` for competitions, `!moodpoll` for daily polls, and `!fancontest` for creative contests. Community events offer exclusive rewards and limited-time content.'
        }
      ]
    },
    {
      category: '💰 Economy & Trading',
      items: [
        {
          question: 'How do I earn gold and gems?',
          answer: 'Earn currencies through: `!daily` rewards, winning battles, completing quests, participating in events, using `!invest` for passive income, auction sales, and achievement rewards. The `!businesses` system provides steady income over time.'
        },
        {
          question: 'What can I buy in the store?',
          answer: 'The `!store` offers consumables, equipment, crafting materials, summon tickets, and special items. Different categories include battle items, character enhancement materials, cosmetics, and limited-time event items.'
        },
        {
          question: 'How does the auction system work?',
          answer: 'Use `!auction` to bid on rare items put up by other players or the system. Auctions feature exclusive equipment, limited characters, and special materials. Timing and strategy are key to winning valuable items!'
        },
        {
          question: 'What is the investment system?',
          answer: 'Invest in virtual businesses using `!invest` to earn passive income. Use `!businesses` to manage your portfolio and `!collect` to claim returns. Different businesses have varying risk/reward ratios and payout schedules.'
        }
      ]
    },
    {
      category: '🎯 Events & Activities',
      items: [
        {
          question: 'What types of events are available?',
          answer: 'KoKoroMichi features seasonal events, dream sequences, daily quests, community contests, pet races, mini-games, and special celebrations. Each event type offers unique rewards and gameplay mechanics.'
        },
        {
          question: 'How do dream events work?',
          answer: 'Dreams are special story sequences that provide powerful temporary buffs. Use `!dreams` to check active dreams, `!complete_dream` to finish sequences, and `!dream_buffs` to see active bonuses. Dreams offer immersive storytelling and significant gameplay benefits.'
        },
        {
          question: 'What are achievements and how do I unlock them?',
          answer: 'Achievements track your progress across all game systems. Use `!achievements` to view progress and `!lore` to read unlocked stories. Achievements provide permanent bonuses, titles, and unlock access to exclusive content.'
        }
      ]
    },
    {
      category: '⚙️ Advanced Features',
      items: [
        {
          question: 'How does the crafting system work?',
          answer: 'Craft powerful items using `!craft` with recipes and materials gathered through `!gather`. View available recipes with `!craft recipes` and check materials with `!materials`. Crafting creates equipment, consumables, and rare items.'
        },
        {
          question: 'What are relics and how do I get them?',
          answer: 'Relics are powerful equipment that dramatically boost character abilities. Obtain them through `!forge_relic`, rare drops, events, or special achievements. Use `!equip_relic` to attach them to characters for massive stat boosts.'
        },
        {
          question: 'How do traits work?',
          answer: 'Traits are special abilities that characters can develop. Use `!traits` to see available traits and `!develop_trait` to unlock them. Traits provide unique passive abilities, combat bonuses, and special interactions.'
        },
        {
          question: 'What are pets and companions?',
          answer: 'Pets are loyal companions that fight alongside your characters. They provide combat bonuses, special abilities, and can participate in pet races. Pets level up, evolve, and can be trained to become more powerful.'
        }
      ]
    },
    {
      category: '🎲 Mini Games & Entertainment',
      items: [
        {
          question: 'What mini-games are available?',
          answer: 'Enjoy various mini-games: `!slots` (slot machine), `!rps` (rock paper scissors), `!trivia` (knowledge quiz), `!guess_number` (number guessing), and `!8ball` (magic 8-ball). Each game offers different rewards and entertainment.'
        },
        {
          question: 'How do I participate in trivia and quizzes?',
          answer: 'Use `!trivia` to start knowledge challenges covering anime, gaming, and general topics. Correct answers provide rewards and contribute to your knowledge achievement progress. Difficulty varies from basic to expert level.'
        }
      ]
    },
    {
      category: '🔧 Technical & Support',
      items: [
        {
          question: 'The bot is not responding to my commands. What should I do?',
          answer: 'Check if: 1) You\'re using the correct command prefix (!), 2) The command is spelled correctly, 3) You\'re in the right channel (some commands have channel restrictions), 4) The bot has proper permissions. If issues persist, contact administrators.'
        },
        {
          question: 'How do channel restrictions work?',
          answer: 'Some commands are restricted to specific channels for organization: battles in combat channels, summons in gacha channels, guild commands in guild halls. The bot will notify you if you use a command in the wrong channel.'
        },
        {
          question: 'Can I use the bot in DMs?',
          answer: 'Yes! Most commands work in DMs with the bot, especially useful for private activities like checking your profile, collection, or using admin commands. Some social features require server channels.'
        },
        {
          question: 'How often is the bot updated?',
          answer: 'KoKoroMichi receives regular updates with new features, balance changes, seasonal content, and bug fixes. Major updates introduce new game systems, while minor updates fine-tune existing features and add quality-of-life improvements.'
        }
      ]
    },
    {
      category: '📞 Getting More Help',
      items: [
        {
          question: 'Where can I get more detailed help?',
          answer: 'Use `!help <command>` for specific command help, `!quickstart` for beginner guides, `!features` to learn about game systems, or ask questions in our community channels. The help system is comprehensive and regularly updated.'
        },
        {
          question: 'How do I report bugs or suggest features?',
          answer: 'Use the contact form below to report bugs, suggest features, or ask questions. Our development team actively reviews feedback and implements community suggestions to improve the bot experience.'
        },
        {
          question: 'Is there a community Discord server?',
          answer: 'Yes! Join our main community server "Tenshi no Yami Kyōkai" for discussions, events, announcements, and direct support. Connect with other players, share strategies, and participate in community events.'
        }
      ]
    }
  ]

  const filteredFAQ = faqData.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  const toggleItem = (categoryIndex, itemIndex) => {
    const id = `${categoryIndex}-${itemIndex}`
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmissionStatus('sending')

    try {
      // Discord webhook URL for the FAQ channel
      const webhookUrl = `https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_TOKEN`
      
      const discordEmbed = {
        embeds: [{
          title: '❓ New FAQ Submission',
          color: parseInt(theme.primary.replace('#', ''), 16),
          fields: [
            { name: '📧 Email/Contact', value: formData.email || 'Not provided', inline: true },
            { name: '🎮 Discord', value: formData.discord || 'Not provided', inline: true },
            { name: '❓ Question', value: formData.question, inline: false }
          ],
          timestamp: new Date().toISOString(),
          footer: { text: 'KoKoroMichi FAQ System' }
        }]
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordEmbed)
      })

      if (response.ok) {
        setSubmissionStatus('success')
        setFormData({ email: '', discord: '', question: '' })
        setTimeout(() => setSubmissionStatus(null), 5000)
      } else {
        throw new Error('Failed to send')
      }
    } catch (error) {
      setSubmissionStatus('error')
      setTimeout(() => setSubmissionStatus(null), 5000)
    }
  }

  const totalQuestions = faqData.reduce((acc, cat) => acc + cat.items.length, 0)

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ color: theme.textColor }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-6" style={{ color: theme.primary }}>
            ❓ Frequently Asked Questions
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Find answers to {totalQuestions}+ common questions about KoKoroMichi. 
            Can't find what you're looking for? Ask us directly below!
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-60" size={20} />
            <input
              type="text"
              placeholder="Search FAQ... (try 'battle', 'summon', 'guild', etc.)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border transition-all duration-300 focus:outline-none focus:ring-2"
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
                color: theme.textColor
              }}
            />
          </div>
        </motion.div>

        {/* FAQ Content */}
        <div className="space-y-6 mb-12">
          {filteredFAQ.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-2xl font-bold mb-2">No questions found</h3>
              <p className="opacity-70">Try different search terms or browse all categories</p>
            </motion.div>
          ) : (
            filteredFAQ.map((category, categoryIndex) => (
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
                <div className="p-6 border-b" style={{ borderColor: theme.borderColor }}>
                  <h2 className="text-2xl font-bold" style={{ color: theme.primary }}>
                    {category.category}
                  </h2>
                  <p className="text-sm opacity-60 mt-1">{category.items.length} questions</p>
                </div>

                {/* Questions */}
                <div className="divide-y" style={{ borderColor: theme.borderColor }}>
                  {category.items.map((item, itemIndex) => {
                    const isExpanded = expandedItems.has(`${categoryIndex}-${itemIndex}`)
                    
                    return (
                      <div key={itemIndex}>
                        <button
                          onClick={() => toggleItem(categoryIndex, itemIndex)}
                          className="w-full p-6 text-left hover:opacity-80 transition-opacity flex items-center justify-between"
                        >
                          <span className="font-medium pr-4">{item.question}</span>
                          {isExpanded ? (
                            <ChevronDown size={20} style={{ color: theme.primary }} />
                          ) : (
                            <ChevronRight size={20} style={{ color: theme.primary }} />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6 leading-relaxed opacity-80">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border p-8"
          style={{
            backgroundColor: theme.cardBg,
            borderColor: theme.borderColor
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-2" style={{ color: theme.primary }}>
              Still Have Questions?
            </h2>
            <p className="opacity-80">
              Ask us directly! Your question will be sent to our FAQ section in the 
              <strong> Tenshi no Yami Kyōkai</strong> Discord server.
            </p>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">
                  <Mail size={16} className="inline mr-2" />
                  Email/Contact (optional)
                </label>
                <input
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your-email@example.com"
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.borderColor,
                    color: theme.textColor
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 opacity-80">
                  <MessageCircle size={16} className="inline mr-2" />
                  Discord Username (optional)
                </label>
                <input
                  type="text"
                  value={formData.discord}
                  onChange={(e) => setFormData({...formData, discord: e.target.value})}
                  placeholder="YourUsername#1234"
                  className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: theme.cardBg,
                    borderColor: theme.borderColor,
                    color: theme.textColor
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                Your Question *
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({...formData, question: e.target.value})}
                placeholder="Describe your question in detail... (e.g., How do I increase my character's power? What's the best strategy for arena battles?)"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 resize-none"
                style={{
                  backgroundColor: theme.cardBg,
                  borderColor: theme.borderColor,
                  color: theme.textColor
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm opacity-60">
                <strong>Server:</strong> Tenshi no Yami Kyōkai (ID: 1344604154429046817)
              </div>
              
              <button
                type="submit"
                disabled={!formData.question.trim() || submissionStatus === 'sending'}
                className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                style={{
                  backgroundColor: theme.primary,
                  color: 'white',
                  boxShadow: `0 4px 20px ${theme.primary}30`
                }}
              >
                {submissionStatus === 'sending' ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Question</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            <AnimatePresence>
              {submissionStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 text-green-500 bg-green-500/10 p-4 rounded-lg"
                >
                  <CheckCircle2 size={20} />
                  <span>Question sent successfully! We'll review it and add it to our FAQ if helpful.</span>
                </motion.div>
              )}
              
              {submissionStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center space-x-2 text-red-500 bg-red-500/10 p-4 rounded-lg"
                >
                  <AlertTriangle size={20} />
                  <span>Failed to send question. Please try again or contact us directly on Discord.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default FAQPage