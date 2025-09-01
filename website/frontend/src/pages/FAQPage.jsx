import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Send, MessageCircle, HelpCircle, Search } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const FAQPage = () => {
  const { theme } = useTheme();
  const [faqs, setFaqs] = useState([]);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get('/api/faq');
      setFaqs(response.data.faqs);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await axios.post('/api/faq', formData);
      if (response.data.success) {
        setSubmitMessage('✅ Question submitted successfully! We\'ll review it and add it to our FAQ.');
        setFormData({ name: '', email: '', question: '' });
      }
    } catch (error) {
      setSubmitMessage('❌ Failed to submit question. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categoryIcons = {
    summoning: '🎲',
    characters: '👥',
    combat: '⚔️',
    guilds: '🏰',
    pets: '🐾',
    crafting: '🔨',
    general: '❓'
  };

  const categoryColors = {
    summoning: '#ec4899',
    characters: '#3b82f6',
    combat: '#ef4444',
    guilds: '#f59e0b',
    pets: '#22c55e',
    crafting: '#8b5cf6',
    general: '#64748b'
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="section-padding">
        <div className="container-width max-w-4xl">
          {/* Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-gaming font-bold mb-6 text-white">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about KoKoroMichi bot features and gameplay
            </p>
          </motion.div>

          {/* Search */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </motion.div>

          {/* FAQ List */}
          <motion.div 
            className="space-y-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card animate-pulse">
                    <div className="h-4 bg-gray-600 rounded mb-2"></div>
                    <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    className="card cursor-pointer transition-all duration-300 hover:shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    layout
                  >
                    <div
                      className="flex items-center justify-between"
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <span 
                          className="text-lg p-2 rounded-lg"
                          style={{ backgroundColor: `${categoryColors[faq.category] || theme.colors.primary}20` }}
                        >
                          {categoryIcons[faq.category] || '❓'}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {faq.question}
                          </h3>
                          <span 
                            className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ 
                              backgroundColor: `${categoryColors[faq.category] || theme.colors.primary}20`,
                              color: categoryColors[faq.category] || theme.colors.primary
                            }}
                          >
                            {faq.category.charAt(0).toUpperCase() + faq.category.slice(1)}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={20} className="text-gray-400" />
                      </motion.div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedFaq === faq.id && (
                        <motion.div
                          className="mt-4 pt-4 border-t border-slate-700"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            
            {!isLoading && filteredFAQs.length === 0 && (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <HelpCircle size={48} className="mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 text-lg">
                  No FAQs found matching your search.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Submit Question Form */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${theme.colors.primary}20` }}
              >
                <MessageCircle size={24} style={{ color: theme.colors.primary }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Submit a Question
                </h2>
                <p className="text-gray-400">
                  Can't find what you're looking for? Ask us directly!
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question *
                </label>
                <textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="What would you like to know about KoKoroMichi?"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  Your question will be sent to our Discord server for review.
                </p>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.question.trim()}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  <Send size={18} />
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Question'}</span>
                </button>
              </div>
              
              {submitMessage && (
                <motion.div
                  className="p-3 rounded-lg bg-slate-700/50 border border-slate-600"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-gray-300">{submitMessage}</p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;