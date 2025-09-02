import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, Key, Save, AlertTriangle, CheckCircle, Settings } from 'lucide-react'

const TokenManager = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [token, setToken] = useState('')
  const [showToken, setShowToken] = useState(false)
  const [status, setStatus] = useState('idle') // idle, saving, saved, error
  const [message, setMessage] = useState('')

  // Load existing token on mount
  useEffect(() => {
    fetch('/api/config/token')
      .then(res => res.json())
      .then(data => {
        if (data.hasToken) {
          setStatus('saved')
          setMessage('Bot token is configured and secure')
        }
      })
      .catch(() => {
        setMessage('Unable to check token status')
      })
  }, [])

  const handleSaveToken = async () => {
    if (!token.trim()) {
      setStatus('error')
      setMessage('Please enter a valid bot token')
      return
    }

    setStatus('saving')
    setMessage('Securing bot token...')

    try {
      const response = await fetch('/api/config/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() })
      })

      const result = await response.json()
      
      if (response.ok) {
        setStatus('saved')
        setMessage('Bot token saved securely!')
        setToken('')
        setShowToken(false)
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setMessage('Bot token is configured and secure')
        }, 3000)
      } else {
        setStatus('error')
        setMessage(result.error || 'Failed to save token')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Network error - unable to save token')
    }
  }

  const handleTestToken = async () => {
    if (!token.trim()) {
      setStatus('error')
      setMessage('Please enter a token to test')
      return
    }

    setStatus('saving')
    setMessage('Testing bot token...')

    try {
      const response = await fetch('/api/config/test-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: token.trim() })
      })

      const result = await response.json()
      
      if (response.ok) {
        setStatus('saved')
        setMessage(`Token valid! Bot: ${result.botName}`)
      } else {
        setStatus('error')
        setMessage(result.error || 'Invalid token')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Unable to test token')
    }
  }

  if (!isVisible) {
    return (
      <motion.button
        onClick={() => setIsVisible(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 p-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full shadow-lg hover:shadow-pink-500/30 transition-all duration-300 z-50"
        title="Configure Bot Token"
      >
        <Settings size={24} color="white" />
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 max-w-md w-full shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield size={24} color="white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Bot Configuration</h3>
            <p className="text-gray-400 text-sm">Secure token storage</p>
          </div>
        </div>

        {/* Token Input */}
        <div className="mb-6">
          <label className="block text-gray-300 font-medium mb-3">
            <Key size={16} className="inline mr-2" />
            Discord Bot Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Discord bot token..."
              className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-900/50 border border-gray-600 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all duration-300"
            />
            <button
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-400 transition-colors"
            >
              {showToken ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-3 rounded-lg flex items-center space-x-2 ${
              status === 'saved' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : status === 'error'
                ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
            }`}
          >
            {status === 'saved' && <CheckCircle size={16} />}
            {status === 'error' && <AlertTriangle size={16} />}
            {status === 'saving' && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            <span className="text-sm">{message}</span>
          </motion.div>
        )}

        {/* Security Notice */}
        <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <div className="flex items-start space-x-3">
            <Shield size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-200">
              <strong>Security:</strong> Your token is encrypted and stored securely. 
              Never share your token with anyone else.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-4">
          <motion.button
            onClick={handleTestToken}
            disabled={!token.trim() || status === 'saving'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium transition-all duration-300"
          >
            Test Token
          </motion.button>
          
          <motion.button
            onClick={handleSaveToken}
            disabled={!token.trim() || status === 'saving'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg hover:shadow-pink-500/30 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Save size={16} />
            <span>Save Securely</span>
          </motion.button>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="w-full py-3 px-4 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-300"
        >
          Close
        </button>

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          Need help? Get your bot token from the{' '}
          <a 
            href="https://discord.com/developers/applications" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-400 hover:text-pink-300 underline"
          >
            Discord Developer Portal
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default TokenManager