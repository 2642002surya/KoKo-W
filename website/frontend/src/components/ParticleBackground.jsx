import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const particlesRef = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.life = Math.random() * 100;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = -Math.random() * 3 - 1;
        this.life = 100;
        this.decay = Math.random() * 2 + 1;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        // Apply different physics based on theme
        switch (theme.particles) {
          case 'bubbles':
            this.vy -= 0.02; // Float upward
            this.vx += (Math.random() - 0.5) * 0.1; // Gentle drift
            break;
          case 'flames':
            this.vy -= 0.05; // Rise faster
            this.vx += (Math.random() - 0.5) * 0.2; // Flicker
            this.size *= 0.995; // Shrink
            break;
          case 'leaves':
            this.vy += 0.02; // Fall down
            this.vx += Math.sin(this.y * 0.01) * 0.1; // Sway
            break;
          case 'sparks':
            this.vy += 0.1; // Fall with gravity
            this.vx *= 0.99; // Air resistance
            break;
          case 'petals':
            this.vy += 0.01; // Gentle fall
            this.vx += Math.sin(this.y * 0.02) * 0.05; // Gentle sway
            break;
          default:
            this.vy -= 0.02;
        }

        if (this.life <= 0 || this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        
        const alpha = Math.max(0, this.life / 100);
        const primaryColor = theme.colors.primary;
        
        // Convert hex to RGB
        const r = parseInt(primaryColor.slice(1, 3), 16);
        const g = parseInt(primaryColor.slice(3, 5), 16);
        const b = parseInt(primaryColor.slice(5, 7), 16);

        ctx.globalAlpha = alpha * 0.6;
        
        // Different particle shapes based on theme
        switch (theme.particles) {
          case 'bubbles':
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;
            
          case 'flames':
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${Math.min(255, g + 50)}, 0, ${alpha})`;
            ctx.fill();
            break;
            
          case 'leaves':
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, this.y * 0.01, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${Math.max(0, r - 50)}, ${g}, ${Math.max(0, b - 50)}, ${alpha})`;
            ctx.fill();
            break;
            
          case 'sparks':
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.size * 0.5, this.size * 2);
            ctx.fillStyle = `rgba(${Math.min(255, r + 100)}, ${Math.min(255, g + 100)}, ${Math.min(255, b + 100)}, ${alpha})`;
            ctx.fill();
            break;
            
          case 'petals':
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
              const angle = (i / 5) * Math.PI * 2;
              const x = this.x + Math.cos(angle) * this.size;
              const y = this.y + Math.sin(angle) * this.size;
              if (i === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fillStyle = `rgba(${r}, ${Math.min(255, g + 30)}, ${Math.min(255, b + 30)}, ${alpha})`;
            ctx.fill();
            break;
            
          default:
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.fill();
        }
        
        ctx.restore();
      }
    }

    // Initialize particles
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    particles = Array.from({ length: particleCount }, () => new Particle());
    particlesRef.current = particles;

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: `linear-gradient(135deg, ${theme.colors.background})` }}
    />
  );
};

export default ParticleBackground;