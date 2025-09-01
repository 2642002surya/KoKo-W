import React, { useEffect, useRef } from 'react';

const ParticleBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    
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
        this.life = Math.random() * 1000;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 2 + 1;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 200;
        this.size = Math.random() * 8 + 2;
        this.opacity = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Fade in and out
        if (this.life < this.maxLife * 0.3) {
          this.opacity = this.life / (this.maxLife * 0.3);
        } else if (this.life > this.maxLife * 0.7) {
          this.opacity = (this.maxLife - this.life) / (this.maxLife * 0.3);
        } else {
          this.opacity = 1;
        }

        // Reset when out of bounds or too old
        if (this.y > canvas.height + 10 || this.life > this.maxLife || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.8;
        
        if (theme === 'fire') {
          // Fire particles - flames and embers
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          gradient.addColorStop(0, '#FF4500');
          gradient.addColorStop(0.5, '#FF6347');
          gradient.addColorStop(1, '#FF0000');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add flame effect
          ctx.fillStyle = '#FFD700';
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          
        } else if (theme === 'water') {
          // Water particles - bubbles and droplets
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          gradient.addColorStop(0, 'rgba(135, 206, 250, 0.8)');
          gradient.addColorStop(0.7, 'rgba(0, 191, 255, 0.4)');
          gradient.addColorStop(1, 'rgba(0, 100, 200, 0.1)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add shine effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
          
        } else if (theme === 'earth') {
          // Earth particles - planets and cosmic dust
          const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
          gradient.addColorStop(0, '#D4AF37');
          gradient.addColorStop(0.6, '#B8860B');
          gradient.addColorStop(1, '#8B4513');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Add ring effect for some particles
          if (Math.random() > 0.7) {
            ctx.strokeStyle = 'rgba(218, 165, 32, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.stroke();
          }
          
        } else if (theme === 'metal') {
          // Metal particles - weapons and armor pieces
          const gradient = ctx.createLinearGradient(this.x - this.size, this.y - this.size, this.x + this.size, this.y + this.size);
          gradient.addColorStop(0, '#C0C0C0');
          gradient.addColorStop(0.5, '#A9A9A9');
          gradient.addColorStop(1, '#708090');
          
          // Draw weapon shapes
          const shapes = ['sword', 'shield', 'armor'];
          const shape = shapes[Math.floor(this.life / 50) % shapes.length];
          
          ctx.fillStyle = gradient;
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.life * 0.02);
          
          if (shape === 'sword') {
            ctx.fillRect(-this.size * 0.2, -this.size, this.size * 0.4, this.size * 2);
            ctx.fillRect(-this.size * 0.5, -this.size * 0.2, this.size, this.size * 0.4);
          } else if (shape === 'shield') {
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.fillRect(-this.size * 0.6, -this.size * 0.6, this.size * 1.2, this.size * 1.2);
          }
          
          ctx.restore();
          
        } else if (theme === 'wood') {
          // Wood particles - leaves
          const colors = ['#228B22', '#32CD32', '#90EE90', '#FF6347', '#FF4500', '#FFD700'];
          const color = colors[Math.floor(this.life / 30) % colors.length];
          
          ctx.fillStyle = color;
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.life * 0.03);
          
          // Draw leaf shape
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size * 1.5, 0, 0, Math.PI * 2);
          ctx.fill();
          
          // Add leaf vein
          ctx.strokeStyle = 'rgba(0, 100, 0, 0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -this.size * 1.5);
          ctx.lineTo(0, this.size * 1.5);
          ctx.stroke();
          
          ctx.restore();
        }
        
        ctx.restore();
      }
    }

    // Create particles
    const particles = [];
    const particleCount = theme === 'fire' ? 150 : theme === 'water' ? 100 : theme === 'earth' ? 80 : theme === 'metal' ? 60 : 120;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticleBackground;