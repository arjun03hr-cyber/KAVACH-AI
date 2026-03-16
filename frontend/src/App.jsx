import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';

// Lazy load pages for production build optimization
const LandingPage = lazy(() => import('./pages/LandingPage'));
const AnalyzerPage = lazy(() => import('./pages/AnalyzerPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-gray-400 text-sm animate-pulse">Loading interface...</p>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="relative min-h-screen flex flex-col font-sans">
        <ParticleBackground />
        <Navbar />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/analyze" element={<AnalyzerPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
