import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import a simple navigation component
const Navigation = () => (
  <nav>
    <div className="nav-container">
      <div className="logo">KoKoroMichi</div>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/commands">Commands</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>
    </div>
  </nav>
);

// Simple page components
const CommandsPage = () => (
  <div style={{ padding: '6rem 2rem 2rem', minHeight: '100vh' }}>
    <div className="container">
      <h1>📚 Bot Commands</h1>
      <div className="card">
        <h2>⚔️ Battle Commands</h2>
        <div className="command-grid">
          <div className="command-card">
            <div className="command-name">!battle [character]</div>
            <div className="command-description">Fight NPCs with your characters</div>
          </div>
          <div className="command-card">
            <div className="command-name">!duel @user</div>
            <div className="command-description">Challenge another player</div>
          </div>
          <div className="command-card">
            <div className="command-name">!arena</div>
            <div className="command-description">Enter arena tournaments</div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <h2>❤️ Collection Commands</h2>
        <div className="command-grid">
          <div className="command-card">
            <div className="command-name">!summon</div>
            <div className="command-description">Summon new characters</div>
          </div>
          <div className="command-card">
            <div className="command-name">!profile</div>
            <div className="command-description">View your character collection</div>
          </div>
          <div className="command-card">
            <div className="command-name">!inspect [character]</div>
            <div className="command-description">View character details</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeaturesPage = () => (
  <div style={{ padding: '6rem 2rem 2rem', minHeight: '100vh' }}>
    <div className="container">
      <h1>🌟 Game Features</h1>
      <div className="card-grid">
        <div className="card">
          <h2>⚔️ Combat System</h2>
          <p>Strategic turn-based battles with elemental advantages, skills, and comprehensive buff systems.</p>
        </div>
        <div className="card">
          <h2>👑 Guild System</h2>
          <p>Join guilds for collaborative gameplay, bonuses, and team-based activities.</p>
        </div>
        <div className="card">
          <h2>🎯 Character Collection</h2>
          <p>Collect over 50+ unique characters with different rarities from N to Mythic.</p>
        </div>
        <div className="card">
          <h2>🎮 Mini-Games</h2>
          <p>Enjoy blackjack, slots, lottery, trivia, and more for daily rewards.</p>
        </div>
      </div>
    </div>
  </div>
);

const FAQPage = () => (
  <div style={{ padding: '6rem 2rem 2rem', minHeight: '100vh' }}>
    <div className="container">
      <h1>❓ Frequently Asked Questions</h1>
      <div className="card">
        <h3>How do I start playing?</h3>
        <p>Simply invite the bot to your server and use !help to see all available commands!</p>
      </div>
      <div className="card">
        <h3>How do I get new characters?</h3>
        <p>Use the !summon command to get new characters with gems. You earn gems through daily rewards and activities.</p>
      </div>
      <div className="card">
        <h3>What's the rarity system?</h3>
        <p>Characters range from N (common) to Mythic (ultra rare): N → R → SR → SSR → UR → LR → Mythic</p>
      </div>
    </div>
  </div>
);

// Simple Footer
const Footer = () => (
  <footer>
    <div className="container">
      <p>&copy; 2025 KoKoroMichi. Made with ❤️ for Discord communities.</p>
    </div>
  </footer>
);

// Import HomePage
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Navigation />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/commands" element={<CommandsPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;