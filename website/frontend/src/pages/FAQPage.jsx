import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Search, Send, ChevronDown, ChevronUp, MessageCircle, Mail, User, BookOpen } from 'lucide-react';

const FAQPage = ({ theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState({});
  const [formData, setFormData] = useState({
    email: '',
    question: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Comprehensive FAQ database
  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I invite KoKoroMichi to my Discord server?',
          answer: 'Click the "Invite Bot" button on our homepage, select your server, and grant the necessary permissions. The bot will automatically set up channels and send a welcome guide.'
        },
        {
          question: 'What permissions does KoKoroMichi need?',
          answer: 'KoKoroMichi needs permissions to read/send messages, manage channels, add reactions, attach files, and use external emojis for full functionality.'
        },
        {
          question: 'How do I start playing after inviting the bot?',
          answer: 'Use !help to see all commands, then try !summon to get your first character. Use !daily to claim login rewards and !profile to view your progress.'
        },
        {
          question: 'What are the basic commands I should know?',
          answer: '!help (show commands), !summon (get characters), !profile (view stats), !battle (fight), !daily (claim rewards), !guild (join/create guilds)'
        }
      ]
    },
    {
      category: 'Character System',
      questions: [
        {
          question: 'How does the rarity system work?',
          answer: 'Characters have 7 rarity tiers: N (60.4%), R (25%), SR (10%), SSR (3%), UR (1%), LR (0.5%), Mythic (0.1%). Higher rarities have better stats and abilities.'
        },
        {
          question: 'How do I get new characters?',
          answer: 'Use !summon with gems. You get gems from daily rewards, battles, quests, and events. Each summon costs gems but guarantees a character.'
        },
        {
          question: 'Can I upgrade my characters?',
          answer: 'Yes! Use !upgrade to level them up, !train to boost stats, !potential to awaken abilities, and !develop_trait to unlock new traits.'
        },
        {
          question: 'What are character traits and how do they work?',
          answer: 'Traits are special abilities that characters can develop. Use !traits to view available traits and !develop_trait to unlock them using materials.'
        },
        {
          question: 'How does the affection system work?',
          answer: 'Build relationships with characters using !intimate commands. Higher affection levels provide combat bonuses and unlock special interactions.'
        }
      ]
    },
    {
      category: 'Combat & Battles',
      questions: [
        {
          question: 'How do battles work?',
          answer: 'Battles are turn-based with strategic elements. Use !battle for PvE or !arena for competitive PvP. Consider elemental advantages, character traits, and equipment.'
        },
        {
          question: 'What affects battle performance?',
          answer: 'Character level, rarity, equipped relics, guild bonuses, pet abilities, dream buffs, affection levels, and elemental advantages all impact combat.'
        },
        {
          question: 'How do I join arena tournaments?',
          answer: 'Use !arena to enter competitive battles. Rankings determine rewards, and seasonal tournaments offer exclusive prizes.'
        },
        {
          question: 'What are world boss raids?',
          answer: 'Collaborative battles where guild members work together to defeat powerful bosses. Use !bosses to view active raids and !join_raid to participate.'
        }
      ]
    },
    {
      category: 'Guild System',
      questions: [
        {
          question: 'How do I join or create a guild?',
          answer: 'Use !guild create <name> to start your own guild or !guild join <id> to join an existing one. Guilds provide bonuses and collaborative gameplay.'
        },
        {
          question: 'What are guild benefits?',
          answer: 'Guild members get combat bonuses, access to guild banks, exclusive quests, collaborative events, and faction warfare opportunities.'
        },
        {
          question: 'How does the guild bank work?',
          answer: 'Use !guild bank deposit <amount> to contribute resources or !guild bank withdraw <amount> to take resources (with proper permissions).'
        },
        {
          question: 'What are factions and how do they work?',
          answer: 'Factions provide unique bonuses to all guild members. Use !factions to view available options and their benefits.'
        }
      ]
    },
    {
      category: 'Economy & Trading',
      questions: [
        {
          question: 'How does the economy system work?',
          answer: 'The game uses Gold and Gems as currencies. Earn them through battles, daily rewards, businesses, and trading. Manage your wealth wisely!'
        },
        {
          question: 'What are business investments?',
          answer: 'Use !invest to buy businesses that generate passive income. Use !businesses to view your portfolio and !collect to gather profits.'
        },
        {
          question: 'How does the auction house work?',
          answer: 'Players can auction items using !auction create. Browse with !auction list and bid with !auction bid. Great for rare item trading!'
        },
        {
          question: 'What are daily rewards and streaks?',
          answer: 'Use !daily to claim login rewards. Consecutive days increase rewards. Use !streak to check your current streak status.'
        }
      ]
    },
    {
      category: 'Crafting & Items',
      questions: [
        {
          question: 'How does crafting work?',
          answer: 'Gather materials with !gather, view recipes with !craft recipes, then craft items with !craft <recipe>. Different locations yield different materials.'
        },
        {
          question: 'What are relics and how do I get them?',
          answer: 'Relics are powerful equipment that boost character abilities. Craft them with !forge_relic or find them in battles and events.'
        },
        {
          question: 'How do I manage my inventory?',
          answer: 'Use !inventory to view items, !use <item> to consume items, and !give @user <item> to trade with other players.'
        }
      ]
    },
    {
      category: 'Events & Activities',
      questions: [
        {
          question: 'What types of events are available?',
          answer: 'Seasonal events, dream realm activities, daily quests, contests, fan clubs, pet races, and random treasure hunts offer variety and rewards.'
        },
        {
          question: 'How do dream events work?',
          answer: 'Use !dream to experience mystical events that provide temporary buffs. View active dreams with !dreams and collect rewards when ready.'
        },
        {
          question: 'What are contests and how do I participate?',
          answer: 'Join mood polls (!moodpoll), fan contests (!fancontest), and pet races (!petrace) for community engagement and rewards.'
        }
      ]
    },
    {
      category: 'Pets & Companions',
      questions: [
        {
          question: 'How do I get and care for pets?',
          answer: 'Adopt pets with !adopt_pet, feed them with !feed_pet, train them with !train_pet, and send them on adventures with !pet_adventure.'
        },
        {
          question: 'What benefits do pets provide?',
          answer: 'Pets assist in battles, gather resources while you\'re away, provide mood bonuses, and can participate in racing competitions.'
        }
      ]
    },
    {
      category: 'Technical & Setup',
      questions: [
        {
          question: 'Why aren\'t commands working in my server?',
          answer: 'Commands have channel restrictions. Use !server_setup to auto-create proper channels or check !channel_guide for manual setup.'
        },
        {
          question: 'How do I set up channels manually?',
          answer: 'Create channels like #combat-calls, #guild-hall, #mini-games, etc. Use !assign_channel to link them to specific features.'
        },
        {
          question: 'Can I customize bot settings for my server?',
          answer: 'Server admins can use admin commands to configure settings, create announcements, and manage user data. Contact support for advanced customization.'
        },
        {
          question: 'What should I do if I encounter bugs?',
          answer: 'Report bugs through this FAQ form or contact our support team. Include the command used, error message, and steps to reproduce the issue.'
        }
      ]
    },
    {
      category: 'Advanced Features',
      questions: [
        {
          question: 'How do achievements work?',
          answer: 'Complete various activities to unlock achievements and earn titles. Use !achievements to track progress and !lore to read achievement stories.'
        },
        {
          question: 'What is the lore system?',
          answer: 'Read rich storylines with !lore read <book> [chapter]. Reading grants rewards and unlocks deeper understanding of the game world.'
        },
        {
          question: 'How do I access admin features?',
          answer: 'Server administrators have access to special commands for user management, data viewing, and bot configuration. Admin commands work in DMs for security.'
        }
      ]
    }
  ];

  // Filter FAQs based on search
  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const toggleFAQ = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedFAQ(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.question) return;

    setIsSubmitting(true);
    try {
      // Send to Discord webhook (faq-section channel)
      const webhookData = {
        embeds: [{
          title: '📝 New FAQ Submission',
          color: parseInt(theme.colors.primary.replace('#', ''), 16),
          fields: [
            {
              name: '👤 User Email/Discord',
              value: formData.email,
              inline: false
            },
            {
              name: '❓ Question',
              value: formData.question,
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: 'KoKoroMichi Website FAQ Form'
          }
        }]
      };

      // Send to backend API which forwards to Discord webhook
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.email,
          email: formData.email,
          question: formData.question
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
      }
      setFormData({ email: '', question: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ color: theme.colors.text }}
          >
            ❓ Frequently Asked Questions
          </h1>
          <p 
            className="text-lg max-w-3xl mx-auto"
            style={{ color: theme.colors.textSecondary }}
          >
            Find answers to common questions about KoKoroMichi, or submit your own question 
            to our support team through the Discord integration below.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2" 
              style={{ color: theme.colors.textSecondary }}
            />
            <input
              type="text"
              placeholder="Search FAQs..."
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

        {/* FAQ Categories */}
        <div className="space-y-6 mb-12">
          {filteredFAQs.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="rounded-xl border border-white/20 overflow-hidden backdrop-blur-md"
              style={{ backgroundColor: `${theme.colors.surface}80` }}
            >
              {/* Category Header */}
              <div className="p-6 border-b border-white/10">
                <h3 
                  className="text-xl font-bold flex items-center space-x-2"
                  style={{ color: theme.colors.text }}
                >
                  <BookOpen size={20} style={{ color: theme.colors.accent }} />
                  <span>{category.category}</span>
                  <span 
                    className="text-sm font-medium px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: `${theme.colors.primary}30`,
                      color: theme.colors.textSecondary 
                    }}
                  >
                    {category.questions.length} questions
                  </span>
                </h3>
              </div>

              {/* Questions */}
              <div className="divide-y divide-white/10">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isExpanded = expandedFAQ[key];
                  
                  return (
                    <div key={questionIndex}>
                      <button
                        onClick={() => toggleFAQ(categoryIndex, questionIndex)}
                        className="w-full p-6 text-left hover:bg-white/5 transition-all duration-200 flex items-center justify-between"
                      >
                        <span 
                          className="font-medium pr-4"
                          style={{ color: theme.colors.text }}
                        >
                          {faq.question}
                        </span>
                        {isExpanded ? 
                          <ChevronUp size={20} style={{ color: theme.colors.textSecondary }} /> : 
                          <ChevronDown size={20} style={{ color: theme.colors.textSecondary }} />
                        }
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div 
                              className="px-6 pb-6 leading-relaxed"
                              style={{ color: theme.colors.textSecondary }}
                            >
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Question Submission Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl border border-white/20 backdrop-blur-md p-8"
          style={{ backgroundColor: `${theme.colors.surface}90` }}
        >
          <div className="text-center mb-6">
            <h3 
              className="text-2xl font-bold mb-2"
              style={{ color: theme.colors.text }}
            >
              Still Have Questions?
            </h3>
            <p 
              style={{ color: theme.colors.textSecondary }}
            >
              Submit your question and our team will respond in the Discord #faq-section channel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text }}
              >
                <User size={16} className="inline mr-2" />
                Email / Discord Username:
              </label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your.email@example.com or YourDiscord#1234"
                className="w-full p-4 rounded-lg border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-200"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  color: theme.colors.text 
                }}
                required
              />
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: theme.colors.text }}
              >
                <MessageCircle size={16} className="inline mr-2" />
                Your Question:
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Describe your question about KoKoroMichi bot features, gameplay, or technical issues..."
                rows={4}
                className="w-full p-4 rounded-lg border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 transition-all duration-200 resize-none"
                style={{ 
                  backgroundColor: `${theme.colors.surface}60`,
                  color: theme.colors.text 
                }}
                required
              />
            </div>

            <div className="text-center">
              <motion.button
                type="submit"
                disabled={isSubmitting || !formData.email || !formData.question}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: theme.colors.text 
                }}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>SEND</span>
                  </>
                )}
              </motion.button>

              {/* Status Messages */}
              <AnimatePresence>
                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mt-4 p-3 rounded-lg ${
                      submitStatus === 'success' 
                        ? 'bg-green-500/20 border border-green-500/30' 
                        : 'bg-red-500/20 border border-red-500/30'
                    }`}
                  >
                    <p style={{ color: submitStatus === 'success' ? '#10B981' : '#EF4444' }}>
                      {submitStatus === 'success' 
                        ? '✅ Question sent successfully! Check #faq-section in our Discord server.'
                        : '❌ Failed to send question. Please try again later.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* Discord Info */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Questions are sent to <strong style={{ color: theme.colors.accent }}>Tenshi no Yami Kyōkai</strong> Discord server 
              in the #faq-section channel where our team will respond.
            </p>
          </div>
        </motion.div>

        {/* No Results */}
        {searchTerm && filteredFAQs.length === 0 && (
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
              No FAQs found
            </h3>
            <p 
              style={{ color: theme.colors.textSecondary }}
            >
              Try different search terms or submit your question below
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FAQPage;