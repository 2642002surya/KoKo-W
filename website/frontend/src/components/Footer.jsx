import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Github, MessageCircle, Shield, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    community: [
      { name: 'Discord Server', href: '#', icon: MessageCircle },
      { name: 'GitHub', href: '#', icon: Github },
      { name: 'Support', href: '#', icon: Shield },
    ],
    resources: [
      { name: 'Commands Guide', href: '/commands' },
      { name: 'Character Database', href: '/waifus' },
      { name: 'Game Features', href: '/features' },
      { name: 'FAQ', href: '/faq' },
    ]
  };

  return (
    <footer className="relative mt-20 bg-slate-900/50 backdrop-blur-md border-t border-slate-700/50">
      <div className="container-width section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="font-gaming text-2xl font-bold text-gradient from-blue-400 to-purple-400">
                KoKoroMichi
              </span>
            </div>
            <p className="text-gray-400 max-w-md">
              Advanced Discord RPG bot featuring comprehensive waifu collection, strategic battles, guild systems, and extensive game mechanics.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users size={16} />
              <span>Serving thousands of players worldwide</span>
            </div>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
              <MessageCircle size={18} style={{ color: theme.colors.primary }} />
              <span>Community</span>
            </h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
                      whileHover={{ x: 2 }}
                    >
                      <Icon size={16} />
                      <span>{link.name}</span>
                    </motion.a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
              <Shield size={18} style={{ color: theme.colors.primary }} />
              <span>Resources</span>
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 block"
                    whileHover={{ x: 2 }}
                  >
                    {link.name}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-slate-700/50 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>© {currentYear} KoKoroMichi.</span>
            <span>Made with</span>
            <Heart size={14} className="text-red-400" />
            <span>for the Discord community</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Version 3.0.0</span>
            <span>•</span>
            <span>98 Commands</span>
            <span>•</span>
            <span>33 Modules</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;