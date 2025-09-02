import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Github, Twitter, MessageCircle, Crown } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: MessageCircle, href: '#', label: 'Discord Server' }
  ]

  const quickLinks = [
    { name: 'Commands', href: '/commands' },
    { name: 'Characters', href: '/characters' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' }
  ]

  return (
    <footer className="relative z-10 bg-black/50 backdrop-blur-lg border-t border-pink-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🌸</span>
              <span className="text-2xl font-bold text-gradient">KoKoroMichi</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              The ultimate Discord RPG experience featuring 98+ commands, strategic battles, 
              character collection, and endless adventures in a rich anime-inspired world.
            </p>
            <motion.a
              href="https://discord.com/api/oauth2/authorize?client_id=1344603209829974016&permissions=8&scope=bot"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium text-white hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-200"
            >
              <Crown size={18} />
              <span>Add to Discord</span>
            </motion.a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-pink-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-pink-400 hover:bg-gray-700 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
            <p className="text-sm text-gray-500">
              Join our community for updates, support, and exclusive content!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-pink-500 animate-pulse" />
            <span>for the Discord community</span>
          </div>
          
          <div className="text-gray-400 text-sm mt-4 md:mt-0">
            <p>&copy; {currentYear} KoKoroMichi. All rights reserved.</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Commands', value: '98+' },
              { label: 'Modules', value: '33' },
              { label: 'Characters', value: '50+' },
              { label: 'Active Users', value: '1K+' }
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-lg bg-gray-800/50">
                <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer