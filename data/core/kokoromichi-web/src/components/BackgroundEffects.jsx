import React, { useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const BackgroundEffects = () => {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const animationRef = useRef()
  const particlesRef = useRef([])
  const waveOffsetRef = useRef(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles based on theme
    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(80, Math.floor(window.innerWidth / 15))
      
      for (let i = 0; i < particleCount; i++) {
        const particle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: theme.particle || '#0ea5e9',
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.5 + 0.2,
          life: Math.random() * 100 + 50
        }
        
        // Theme-specific particle properties
        switch (theme.animationType) {
          case 'waves':
            particle.waveOffset = Math.random() * Math.PI * 2
            break
          case 'flames':
            particle.vy = -Math.abs(particle.vy) - 0.5
            particle.flickerSpeed = Math.random() * 0.1 + 0.05
            break
          case 'planets':
            particle.orbitRadius = Math.random() * 50 + 20
            particle.orbitSpeed = Math.random() * 0.02 + 0.01
            break
          case 'leaves':
            particle.rotationSpeed = Math.random() * 0.05 + 0.01
            particle.swayAmount = Math.random() * 20 + 10
            break
          case 'weapons':
            particle.rotationSpeed = Math.random() * 0.03 + 0.01
            particle.metallic = Math.random() > 0.5
            break
        }
        
        particlesRef.current.push(particle)
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      timeRef.current += 0.016
      
      // Theme-specific background animations
      if (theme.animationType === 'waves') {
        drawWaveBackground(ctx, canvas.width, canvas.height)
      }
      
      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        updateParticleByTheme(particle)
        drawParticleByTheme(ctx, particle)
        
        // Subtle connections for some themes
        if (theme.animationType === 'water' || theme.animationType === 'metal') {
          drawConnections(ctx, particle, index)
        }
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }
    
    const updateParticleByTheme = (particle) => {
      switch (theme.animationType) {
        case 'waves':
          particle.x += particle.vx
          particle.y = particle.y + particle.vy + Math.sin(timeRef.current + particle.waveOffset) * 0.5
          break
        case 'flames':
          particle.x += particle.vx + Math.sin(timeRef.current * 2 + particle.angle) * 0.3
          particle.y += particle.vy
          particle.opacity = 0.3 + Math.sin(timeRef.current * particle.flickerSpeed) * 0.2
          break
        case 'planets':
          const centerX = canvas.width / 2
          const centerY = canvas.height / 2
          particle.angle += particle.orbitSpeed
          particle.x = centerX + Math.cos(particle.angle) * particle.orbitRadius
          particle.y = centerY + Math.sin(particle.angle) * particle.orbitRadius
          break
        case 'leaves':
          particle.x += particle.vx + Math.sin(timeRef.current + particle.angle) * 0.1
          particle.y += particle.vy
          particle.angle += particle.rotationSpeed
          break
        case 'weapons':
          particle.x += particle.vx
          particle.y += particle.vy
          particle.angle += particle.rotationSpeed
          break
        default:
          particle.x += particle.vx
          particle.y += particle.vy
      }
      
      // Wrap around edges
      if (particle.x < -50) particle.x = canvas.width + 50
      if (particle.x > canvas.width + 50) particle.x = -50
      if (particle.y < -50) particle.y = canvas.height + 50
      if (particle.y > canvas.height + 50) particle.y = -50
    }
    
    const drawParticleByTheme = (ctx, particle) => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      
      switch (theme.animationType) {
        case 'waves':
          ctx.beginPath()
          ctx.arc(0, 0, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
          // Add water ripple effect
          ctx.beginPath()
          ctx.arc(0, 0, particle.radius * 2, 0, Math.PI * 2)
          ctx.strokeStyle = `${particle.color}${Math.floor(particle.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`
          ctx.stroke()
          break
          
        case 'flames':
          ctx.rotate(particle.angle)
          ctx.beginPath()
          ctx.ellipse(0, 0, particle.radius, particle.radius * 1.5, 0, 0, Math.PI * 2)
          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.radius * 1.5)
          gradient.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`)
          gradient.addColorStop(1, `#ff6600${Math.floor(particle.opacity * 0.3 * 255).toString(16).padStart(2, '0')}`)
          ctx.fillStyle = gradient
          ctx.fill()
          break
          
        case 'planets':
          ctx.beginPath()
          ctx.arc(0, 0, particle.radius, 0, Math.PI * 2)
          const planetGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.radius)
          planetGrad.addColorStop(0, `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`)
          planetGrad.addColorStop(1, `#4a5568${Math.floor(particle.opacity * 0.5 * 255).toString(16).padStart(2, '0')}`)
          ctx.fillStyle = planetGrad
          ctx.fill()
          // Add orbit trail
          ctx.beginPath()
          ctx.arc(0, 0, particle.radius * 3, 0, Math.PI * 2)
          ctx.strokeStyle = `${particle.color}${Math.floor(particle.opacity * 0.1 * 255).toString(16).padStart(2, '0')}`
          ctx.stroke()
          break
          
        case 'leaves':
          ctx.rotate(particle.angle)
          ctx.beginPath()
          ctx.ellipse(0, 0, particle.radius * 1.5, particle.radius * 0.8, 0, 0, Math.PI * 2)
          const leafColors = ['#22c55e', '#f59e0b', '#dc2626']
          const leafColor = leafColors[Math.floor(timeRef.current + particle.x) % leafColors.length]
          ctx.fillStyle = `${leafColor}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
          break
          
        case 'weapons':
          ctx.rotate(particle.angle)
          ctx.beginPath()
          ctx.rect(-particle.radius * 2, -particle.radius * 0.3, particle.radius * 4, particle.radius * 0.6)
          ctx.fillStyle = particle.metallic ? 
            `#c0c0c0${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}` :
            `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
          // Add blade tip
          ctx.beginPath()
          ctx.moveTo(particle.radius * 2, 0)
          ctx.lineTo(particle.radius * 3, 0)
          ctx.lineTo(particle.radius * 2, -particle.radius * 0.3)
          ctx.closePath()
          ctx.fill()
          break
          
        default:
          ctx.beginPath()
          ctx.arc(0, 0, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
      }
      
      ctx.restore()
    }
    
    const drawWaveBackground = (ctx, width, height) => {
      if (theme.animationType !== 'waves') return
      
      waveOffsetRef.current += 0.02
      ctx.save()
      
      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath()
        ctx.moveTo(0, height)
        
        for (let x = 0; x <= width; x += 10) {
          const y = height - 50 - layer * 30 + Math.sin((x * 0.01) + waveOffsetRef.current + layer) * (20 - layer * 5)
          ctx.lineTo(x, y)
        }
        
        ctx.lineTo(width, height)
        ctx.closePath()
        
        const alpha = (0.1 - layer * 0.02)
        ctx.fillStyle = `${theme.primary}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      }
      
      ctx.restore()
    }
    
    const drawConnections = (ctx, particle, index) => {
      particlesRef.current.slice(index + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 80) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(otherParticle.x, otherParticle.y)
          ctx.strokeStyle = `${particle.color}${Math.floor((1 - distance / 80) * 0.2 * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      })
    }

    initParticles()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 1 }}
    />
  )
}

export default BackgroundEffects