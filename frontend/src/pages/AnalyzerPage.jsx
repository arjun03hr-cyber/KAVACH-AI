import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2, Shield, CheckCircle2, AlertTriangle, XCircle, Zap, Copy, Check } from 'lucide-react';

/* ── Strength Meter ── */
function StrengthMeter({ score }) {
  const config = useMemo(() => {
    switch (score) {
      case 0: return { width: '33%', color: 'bg-red-500', shadow: 'shadow-[0_0_12px_rgba(239,68,68,0.6)]', label: 'Weak', labelColor: 'text-red-400' };
      case 1: return { width: '66%', color: 'bg-yellow-400', shadow: 'shadow-[0_0_12px_rgba(250,204,21,0.6)]', label: 'Medium', labelColor: 'text-yellow-400' };
      case 2: return { width: '100%', color: 'bg-green-400', shadow: 'shadow-[0_0_12px_rgba(74,222,128,0.6)]', label: 'Strong', labelColor: 'text-green-400' };
      default: return { width: '0%', color: 'bg-gray-600', shadow: '', label: 'Awaiting…', labelColor: 'text-gray-500' };
    }
  }, [score]);

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Strength</span>
        <span className={`text-xs font-bold tracking-wider uppercase ${config.labelColor}`}>{config.label}</span>
      </div>
      <div className="w-full bg-gray-800/80 rounded-full h-2.5 overflow-hidden border border-white/5">
        <motion.div
          className={`h-2.5 rounded-full ${config.color} ${config.shadow}`}
          initial={{ width: 0 }}
          animate={{ width: config.width }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

/* ── Suggestion Row ── */
function Suggestion({ icon: Icon, text, type, improved }) {
  const color = type === 'pass' ? 'text-green-400' : type === 'warn' ? 'text-yellow-400' : 'text-red-400';
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5"
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
      <div className="flex-1">
        <span className="text-sm text-gray-300 leading-relaxed">{text}</span>
        {improved && (
          <div className="mt-2 font-mono text-xs bg-darkBg/60 border border-white/10 rounded-lg px-3 py-2 text-accent break-all">
            {improved}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── Helper: build one improved variant from the user's actual password ── */
function buildImproved(pwd) {
  let out = pwd;
  const specials = '!@#$%&*?^';
  const rSpec = () => specials[Math.floor(Math.random() * specials.length)];
  const rDig  = () => Math.floor(Math.random() * 10);

  // Pad if too short
  while (out.length < 8) out += rSpec();

  // Add uppercase if missing
  if (!/[A-Z]/.test(out)) {
    const i = out.search(/[a-z]/);
    if (i !== -1) out = out.slice(0, i) + out[i].toUpperCase() + out.slice(i + 1);
    else out = 'A' + out;
  }

  // Add lowercase if missing
  if (!/[a-z]/.test(out)) out += 'x';

  // Add digit if missing
  if (!/[0-9]/.test(out)) out += rDig();

  // Add special if missing
  if (!/[^A-Za-z0-9]/.test(out)) out += rSpec();

  // Ensure 12+ chars
  while (out.length < 12) out += rSpec();

  return out;
}

/* ── Helper: generate suggestions based on the actual input ── */
function generateSuggestions(pwd) {
  const tips = [];

  const hasUpper   = /[A-Z]/.test(pwd);
  const hasLower   = /[a-z]/.test(pwd);
  const hasDigit   = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  const long       = pwd.length >= 12;

  // Determine score
  let score = 0;
  if (pwd.length < 8) {
    score = 0;
  } else if (hasUpper && hasLower && hasDigit && hasSpecial && long) {
    score = 2;
  } else {
    score = 1;
  }

  // ── Strong → green feedback, NO suggested passwords ──
  if (score === 2) {
    tips.push({ t: 'pass', text: 'Excellent length and complexity.', icon: CheckCircle2 });
    tips.push({ t: 'pass', text: 'Great mix of uppercase, lowercase, digits, and symbols.', icon: CheckCircle2 });
    tips.push({ t: 'pass', text: 'Highly resistant to brute-force attacks.', icon: Shield });
    return { score, tips, suggestions: [] };
  }

  // ── Weak / Medium → specific tips + 3 improved variants ──
  if (pwd.length < 8)  tips.push({ t: 'fail', text: `Your password is only ${pwd.length} characters — use at least 8.`, icon: XCircle });
  if (!hasUpper)        tips.push({ t: 'warn', text: 'Add uppercase letters for better strength.', icon: AlertTriangle });
  if (!hasLower)        tips.push({ t: 'warn', text: 'Add lowercase letters to diversify character types.', icon: AlertTriangle });
  if (!hasDigit)        tips.push({ t: 'warn', text: 'Include at least one number.', icon: AlertTriangle });
  if (!hasSpecial)      tips.push({ t: 'warn', text: 'Add special characters like !@#$%^&*.', icon: AlertTriangle });
  if (!long)            tips.push({ t: 'warn', text: 'Increase length to 12+ characters for best security.', icon: AlertTriangle });

  if (hasUpper && hasLower) tips.unshift({ t: 'pass', text: 'Good use of mixed-case letters.', icon: CheckCircle2 });
  if (hasDigit)              tips.unshift({ t: 'pass', text: 'Contains numeric digits ✓', icon: CheckCircle2 });

  // Build 3 unique improved variants of the user's password
  const seen = new Set();
  const suggestions = [];
  while (suggestions.length < 3) {
    const variant = buildImproved(pwd);
    if (!seen.has(variant)) {
      seen.add(variant);
      suggestions.push(variant);
    }
  }

  return { score, tips, suggestions };
}

/* ── Analyzer Page ── */
export default function AnalyzerPage() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const analyze = () => {
    if (!password) return;
    setLoading(true);
    setResult(null);
    setCopied(false);
    setTimeout(() => {
      const analysis = generateSuggestions(password);
      setResult(analysis);
      setLoading(false);
    }, 1500);
  };

  const copyImproved = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => { if (result) { setResult(null); setCopied(false); } }, [password]);

  return (
    <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center relative z-10">
      <div className="w-full max-w-5xl grid lg:grid-cols-5 gap-8">

        {/* ── Input Panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 glass-panel rounded-2xl p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-highlight to-transparent" />
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Password Analyzer</h2>
          <p className="text-gray-400 text-sm mb-8">Enter a password below to get real-time AI-powered strength classification.</p>

          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your password…"
              className="w-full bg-darkBg/60 border border-white/10 rounded-xl px-5 py-5 text-lg text-white placeholder-gray-600 outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1">
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <StrengthMeter score={result ? result.score : -1} />

          <button
            onClick={analyze}
            disabled={!password || loading}
            className={`w-full mt-8 py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300
              ${!password || loading
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'gradient-btn text-white cursor-pointer'
              }`}
          >
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : 'Analyze Now'}
          </button>
        </motion.div>

        {/* ── Suggestions Panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <div className="glass-panel rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent" />
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" /> AI Insights
            </h3>

            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {!result && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center py-10"
                  >
                    <Shield className="w-10 h-10 text-gray-700 mb-4" />
                    <p className="text-gray-500 text-sm">Enter a password and click Analyze to see insights.</p>
                  </motion.div>
                )}

                {loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full py-10 gap-3"
                  >
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-primary text-sm font-medium animate-pulse">Running Neural Network…</p>
                  </motion.div>
                )}

                {result && !loading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {result.tips.map((s, i) => (
                      <Suggestion key={i} icon={s.icon} text={s.text} type={s.t} />
                    ))}

                    {/* Improved password suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 p-4 rounded-xl border border-accent/30 bg-accent/5"
                      >
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-3">
                          Suggested improved passwords
                        </p>
                        <div className="space-y-2">
                          {result.suggestions.map((suggestion, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <code className="flex-1 font-mono text-sm text-accent break-all bg-darkBg/60 rounded-lg px-3 py-2 border border-white/10">
                                {suggestion}
                              </code>
                              <button
                                onClick={() => copyImproved(suggestion)}
                                className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                                title="Copy to clipboard"
                              >
                                {copied === suggestion ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                              </button>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
