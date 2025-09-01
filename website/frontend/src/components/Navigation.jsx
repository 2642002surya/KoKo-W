import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Sword, Users, BookOpen, HelpCircle, Crown } from 'lucide-react';

const Navigation = ({ theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Crown },
    { path: '/commands', label: 'Commands', icon: Sword },
    { path: '/features', label: 'Features', icon: BookOpen },
    { path: '/waifus', label: 'Characters', icon: Users },
    { path: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/10"
      style={{ backgroundColor: `${theme.colors.surface}CC` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-2xl font-bold"
              style={{ color: theme.colors.accent }}
            >
              🌸 KoKoroMichi
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'shadow-lg' 
                        : 'hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: isActive ? theme.colors.primary : 'transparent',
                      color: isActive ? theme.colors.text : theme.colors.textSecondary
                    }}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ backgroundColor: theme.colors.accent }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg"
              style={{ color: theme.colors.text }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4"
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive ? 'shadow-lg' : 'hover:shadow-md'
                    }`}
                    style={{
                      backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                      color: isActive ? theme.colors.text : theme.colors.textSecondary
                    }}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;