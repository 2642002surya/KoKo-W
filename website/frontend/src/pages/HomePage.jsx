import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [serverStats, setServerStats] = useState({
    memberCount: 5,
    onlineCount: 3,
    serverName: 'Tenshi no Yami Kyōkai',
    lastUpdated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    {
      icon: '❤️',
      title: 'Waifu Collection',
      description: 'Collect over 50+ unique characters with gacha mechanics'
    },
    {
      icon: '⚔️',
      title: 'Strategic Combat',
      description: 'Engage in turn-based battles with skills and elements'
    },
    {
      icon: '👑',
      title: 'Guild System',
      description: 'Join guilds for bonuses and collaborative gameplay'
    },
    {
      icon: '⚡',
      title: '98 Commands',
      description: 'Comprehensive RPG experience with extensive features'
    }
  ];

  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=1344603209829974016&permissions=8&scope=bot`;

  return (
    <div style={{ minHeight: '100vh', paddingTop: '80px' }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="hero-title fade-in">
              KoKoroMichi
            </h1>
            
            <p className="hero-subtitle fade-in">
              The Ultimate Discord RPG Bot Experience
            </p>
            
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#cbd5e1' }}>
              Collect waifus, engage in strategic battles, build guilds, and explore 
              a comprehensive RPG world with over 98 commands!
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href={inviteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
              >
                📢 Invite to Server
              </a>
              <a href="/commands" className="btn btn-secondary">
                📚 View Commands
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Server Stats */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center' }}>
            <h2>🏰 Server Statistics</h2>
            {isLoading ? (
              <div className="loading"></div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                <div>
                  <div style={{ fontSize: '3rem', color: '#ff69b4' }}>👥</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                    {serverStats.memberCount.toLocaleString()}
                  </div>
                  <div style={{ color: '#cbd5e1' }}>Total Members</div>
                </div>
                <div>
                  <div style={{ fontSize: '3rem', color: '#10b981' }}>🟢</div>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                    {serverStats.onlineCount.toLocaleString()}
                  </div>
                  <div style={{ color: '#cbd5e1' }}>Online Now</div>
                </div>
                <div>
                  <div style={{ fontSize: '3rem', color: '#6366f1' }}>🏠</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>
                    {serverStats.serverName}
                  </div>
                  <div style={{ color: '#cbd5e1' }}>Server Name</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>
            🌟 Core Features
          </h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card fade-in">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(255, 105, 180, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
            <h2>🚀 Ready to Begin Your Adventure?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
              Join thousands of players in the ultimate Discord RPG experience!
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a 
                href={inviteUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ fontSize: '1.1rem', padding: '15px 30px' }}
              >
                🎮 Add KoKoroMichi Now
              </a>
              <a 
                href="/features" 
                className="btn"
                style={{ fontSize: '1.1rem', padding: '15px 30px' }}
              >
                🔍 Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;