import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navigation from './components/Navigation';
import ParticleBackground from './components/ParticleBackground';
import ScrollToTop from './components/ScrollToTop';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import CommandsPage from './pages/CommandsPage';
import WaifusPage from './pages/WaifusPage';
import FeaturesPage from './pages/FeaturesPage';
import FAQPage from './pages/FAQPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-900 text-white relative overflow-x-hidden">
          {/* Particle Background */}
          <ParticleBackground />
          
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/commands" element={<CommandsPage />} />
              <Route path="/waifus" element={<WaifusPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
          
          {/* Scroll to Top */}
          <ScrollToTop />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;