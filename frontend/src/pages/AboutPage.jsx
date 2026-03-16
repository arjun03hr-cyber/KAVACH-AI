import { motion } from 'framer-motion';
import { Activity, Cpu, BrainCircuit, Database } from 'lucide-react';

const steps = [
  { icon: Activity, title: '1. Secure Input', desc: 'Password is typed on-device. It never leaves your browser.' },
  { icon: Cpu, title: '2. Feature Extraction', desc: 'Raw text is converted into vectors — length, entropy, character classes.' },
  { icon: BrainCircuit, title: '3. AI Evaluation', desc: 'Pre-trained ML model analyses the vectors for structural weaknesses.' },
  { icon: Database, title: '4. Actionable Results', desc: 'A score and targeted tips are presented instantly.' },
];

function StepCard({ step, idx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: idx * 0.15 }}
      className="relative flex flex-col items-center text-center group"
    >
      <div className="w-16 h-16 rounded-2xl glass-card border border-white/10 flex items-center justify-center mb-5 group-hover:border-primary/50 transition-colors relative z-10">
        <step.icon className="w-8 h-8 text-white group-hover:text-accent transition-colors" />
      </div>
      {idx < steps.length - 1 && (
        <div className="hidden md:block absolute top-8 left-[60%] w-[80%] lg:w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent z-0" />
      )}
      <h3 className="text-lg font-bold text-white mb-1">{step.title}</h3>
      <p className="text-gray-400 text-sm max-w-[200px] leading-relaxed">{step.desc}</p>
    </motion.div>
  );
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto relative z-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black text-white mb-6"
        >
          Behind the <span className="neon-text">Magic</span>
        </motion.h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Discover how our system uses deep learning to classify password strength—securely and in real-time.
        </p>
      </div>

      {/* Pipeline */}
      <section className="mb-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-14">
          How it <span className="neon-text">Works</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-4">
          {steps.map((s, i) => <StepCard key={i} step={s} idx={i} />)}
        </div>
      </section>

      {/* Project Info */}
      <section className="glass-panel rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            About the <span className="neon-text">Project</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-400 text-sm leading-relaxed">
          <div>
            <h3 className="text-white font-semibold text-base mb-3">What is Kavach AI?</h3>
            <p>
              Kavach AI is an intelligent password strength classifier that uses machine learning models trained on millions of real-world passwords. Unlike simple rule-based checkers, our system understands contextual patterns, character distributions, and entropy levels to provide accurate strength evaluation.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-base mb-3">Privacy First</h3>
            <p>
              Your passwords are never transmitted to any server. All analysis runs entirely on the client side using pre-trained models. We believe security tools should never compromise your privacy — so we built Kavach AI to work 100% offline after the initial page load.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
