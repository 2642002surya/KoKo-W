import React from 'react'
import { motion } from 'framer-motion'
import CommandSearchSystem from '@/components/CommandSearchSystem'

const CommandsPage = () => {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <CommandSearchSystem />
    </motion.div>
  )
}

export default CommandsPage