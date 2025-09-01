import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, MessageCircle, Shield, Users } from 'lucide-react';

const Footer = ({ theme }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: MessageCircle, label: 'Discord Server', href: '#' },
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Shield, label: 'Privacy', href: '#' },
    { icon: Users, label: 'Community', href: '#' }
  ];

  const quickLinks = [
    { label: 'Getting Started', href: '/faq' },
    { label: 'Command List', href: '/commands' },
    { label: 'Bot Features', href: '/features' },
    { label: 'Character Gallery', href: '/waifus' }
  ];

  return (
    <footer 
      className="relative mt-20 border-t border-white/10 backdrop-blur-md"
      style={{ backgroundColor: `${theme.colors.surface}CC` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2"
            >
              <span className="text-2xl">🌸</span>
              <h3 
                className="text-xl font-bold"
                style={{ color: theme.colors.text }}
              >
                KoKoroMichi
              </h3>
            </motion.div>
            <p 
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              The ultimate Discord RPG bot featuring character collection, strategic battles, 
              guild systems, and endless adventures.
            </p>
            <div className="flex items-center space-x-1 text-sm">
              <span style={{ color: theme.colors.textSecondary }}>Made with</span>
              <Heart size={16} color={theme.colors.primary} fill={theme.colors.primary} />
              <span style={{ color: theme.colors.textSecondary }}>for Discord communities</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold"
              style={{ color: theme.colors.text }}
            >
              Quick Links
            </h4>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  whileHover={{ x: 5, color: theme.colors.accent }}
                  className="block text-sm transition-colors duration-200 hover:underline"
                  style={{ color: theme.colors.textSecondary }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 
              className="text-lg font-semibold"
              style={{ color: theme.colors.text }}
            >
              Connect With Us
            </h4>
            
            <div 
              className="p-4 rounded-lg border border-white/10"
              style={{ backgroundColor: `${theme.colors.background}40` }}
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div 
                    className="text-lg font-bold"
                    style={{ color: theme.colors.accent }}
                  >
                    98+
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Commands
                  </div>
                </div>
                <div>
                  <div 
                    className="text-lg font-bold"
                    style={{ color: theme.colors.accent }}
                  >
                    50+
                  </div>
                  <div 
                    className="text-xs"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    Characters
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={index}
                    href={link.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg border border-white/10 transition-all duration-200"
                    style={{ backgroundColor: `${theme.colors.surface}80` }}
                    title={link.label}
                  >
                    <Icon size={18} color={theme.colors.textSecondary} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div 
            className="text-sm"
            style={{ color: theme.colors.textSecondary }}
          >
            © {currentYear} KoKoroMichi. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <a 
              href="#" 
              className="transition-colors duration-200 hover:underline"
              style={{ color: theme.colors.textSecondary }}
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200 hover:underline"
              style={{ color: theme.colors.textSecondary }}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="transition-colors duration-200 hover:underline"
              style={{ color: theme.colors.textSecondary }}
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;