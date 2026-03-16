import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, CheckCircle2, ArrowRight } from 'lucide-react';

/* ── Typewriter ── */
function Typewriter({ words }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const speed = deleting ? 40 : 90;
    const timer = setTimeout(() => {
      if (!deleting && charIdx === word.length) {
        setTimeout(() => setDeleting(true), 1500);
        return;
      }
      if (deleting && charIdx === 0) {
        setDeleting(false);
        setWordIdx((prev) => (prev + 1) % words.length);
        return;
      }
      setCharIdx((prev) => prev + (deleting ? -1 : 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words]);

  return (
    <span className="font-mono text-accent">
      {words[wordIdx].slice(0, charIdx)}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}

/* ── Feature Card ── */
function FeatureCard({ icon: Icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-2xl p-8 flex flex-col items-center text-center cursor-pointer group"
    >
      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary/40 group-hover:to-accent/40 transition-all duration-300">
        <Icon className="w-7 h-7 text-accent" />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ── Landing Page ── */
export default function LandingPage() {
  return (
    <div className="pt-20">
      {/* ──────────── Hero ──────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl z-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Powered by Neural Networks</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
            Next-Gen AI{' '}
            <span className="neon-text">Password Strength</span>{' '}
            Analyzer
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Evaluate your passwords against modern cyber threats using deep learning. Secure, private, and instant.
          </p>

          {/* Typewriter demo */}
          <div className="mt-10 glass-panel rounded-xl max-w-md mx-auto p-5 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
            <p className="text-left text-xs text-gray-500 mb-2 font-mono">Enter password…</p>
            <div className="text-2xl sm:text-3xl text-left h-10 flex items-center">
              <Typewriter words={['Str0ng!P@ss', 'qwerty123', 'T#r9$mK!2xL', 'password1']} />
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10"
          >
            <Link to="/analyze">
              <button className="gradient-btn text-white text-lg font-bold px-10 py-4 rounded-full inline-flex items-center gap-2">
                Analyze Password
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ──────────── Features ──────────── */}
      <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Use <span className="neon-text">AI</span> for Detection?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Traditional checkers rely on simple rules. Our model recognises contextual patterns from millions of real-world credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Zap}
            title="Real-Time Analysis"
            desc="15+ features processed in milliseconds — entirely in your browser, no server round-trip."
            delay={0.1}
          />
          <FeatureCard
            icon={Shield}
            title="Advanced Security"
            desc="Trained on millions of leaked and secure passwords to spot patterns humans miss."
            delay={0.25}
          />
          <FeatureCard
            icon={CheckCircle2}
            title="Actionable Insights"
            desc="Receive specific tips to dramatically raise your password entropy and resilience."
            delay={0.4}
          />
        </div>
      </section>
    </div>
  );
}
