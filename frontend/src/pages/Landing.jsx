import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, Brain, BarChart3, Shield, Zap, ChevronDown, Globe, Cpu, Lock, AlertCircle } from 'lucide-react';
import VoiceWave from '../components/VoiceWave';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-64px)] relative bg-white text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            {/* Tech Company Logo */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-purple-500 rounded-2xl rotate-3 opacity-20 blur-lg" />
                <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg viewBox="0 0 64 64" className="w-12 h-12 md:w-14 md:h-14" fill="none">
                    <path d="M32 4L58 18V46L32 60L6 46V18L32 4Z" stroke="url(#logoGrad)" strokeWidth="2" fill="rgba(14,165,233,0.08)" />
                    <path d="M32 12L50 22V42L32 52L14 42V22L32 12Z" stroke="url(#logoGrad)" strokeWidth="1.5" opacity="0.6" />
                    <text x="32" y="38" textAnchor="middle" fill="url(#logoGrad)" fontSize="18" fontWeight="bold" fontFamily="system-ui">T</text>
                    <defs>
                      <linearGradient id="logoGrad" x1="0" y1="0" x2="64" y2="64">
                        <stop stopColor="#0ea5e9" />
                        <stop offset="1" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold text-black text-3d tracking-tight">Tech Company</h1>
                <p className="text-lg md:text-2xl font-bold text-slate-400 tracking-wide uppercase">Interview</p>
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Practice with an AI interviewer that{' '}
            <span className="text-primary-400 font-medium">speaks naturally</span>, analyzes your answers{' '}
            <span className="text-purple-400 font-medium">in real-time</span>, and adapts questions to your skill level.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex gap-4 justify-center mb-16"
          >
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-cyan-500 rounded-2xl font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(14,165,233,0.4)] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Get Started Free
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 glass hover:bg-white/[0.08] hover:border-primary-500/40 rounded-2xl font-semibold transition-all hover:scale-105"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Live Voice Wave Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="max-w-3xl mx-auto glass-strong p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500" />
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-50" />
              </div>
              <span className="text-sm text-gray-400 font-mono">AI INTERVIEWER ACTIVE</span>
            </div>
            <VoiceWave active={true} color="cyan" />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 border-t border-white/[0.04] relative">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-3 text-black text-3d">Core Features</h2>
            <p className="text-gray-400">Everything you need to ace your next interview</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Mic, title: 'Voice Interview', desc: 'AI speaks questions and listens to your answers via microphone in real-time.', color: 'cyan', glow: 'glow-cyan' },
              { icon: Brain, title: 'Smart Analysis', desc: 'Get scored on technical, communication, and confidence levels instantly.', color: 'purple', glow: 'glow-purple' },
              { icon: BarChart3, title: 'Performance Dashboard', desc: 'Track progress with detailed analytics, charts, and improvement reports.', color: 'green', glow: 'glow-green' },
              { icon: Shield, title: 'Resume Based', desc: 'Upload your resume for personalized skill-based interview questions.', color: 'cyan', glow: 'glow-cyan' },
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative glass p-7 overflow-hidden"
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40 ${f.color === 'purple' ? 'bg-purple-500' : f.color === 'green' ? 'bg-green-500' : 'bg-primary-500'}`} />
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all group-hover:scale-110 ${f.glow} bg-gradient-to-br ${f.color === 'purple' ? 'from-purple-500 to-pink-500' : f.color === 'green' ? 'from-green-500 to-emerald-400' : 'from-primary-500 to-cyan-400'}`}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Showcase */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-black text-3d">Powered By Modern Tech</h2>
            <p className="text-gray-400">Cutting-edge stack for cutting-edge interviews</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {['React 18', 'Vite', 'Tailwind CSS', 'Node.js', 'MongoDB', 'OpenAI GPT', 'Web Speech API', 'Recharts'].map((tech, i) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="px-5 py-2.5 glass hover:bg-white/[0.08] hover:border-primary-500/30 transition-all cursor-default text-sm font-medium"
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Modes */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-2 text-black text-3d">Interview Modes</h2>
            <p className="text-gray-400">Choose your interview scenario</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              { icon: Cpu, title: 'Software Developer', desc: 'Technical coding, system design, and algorithm questions with adaptive difficulty.', color: 'from-blue-500 to-cyan-400' },
              { icon: Globe, title: 'HR Round', desc: 'Behavioral, situational, and culture-fit questions to polish your soft skills.', color: 'from-purple-500 to-pink-400' },
              { icon: Lock, title: 'Managerial Round', desc: 'Leadership, conflict resolution, and strategic decision-making scenarios.', color: 'from-orange-500 to-yellow-400' },
            ].map((m, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -5 }}
                className="glass-strong p-8 text-center group cursor-pointer transition-all"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${m.color} flex items-center justify-center mb-5 shadow-lg group-hover:shadow-xl transition-shadow`}>
                  <m.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                <p className="text-gray-400 text-sm">{m.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Limitations */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-2xl font-bold text-center mb-8 text-yellow-400/80 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5" /> Limitations
            </h2>
            <div className="glass p-8 space-y-4 text-gray-400 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 mt-2 shrink-0" />
                <p>Cannot fully judge real human emotions or body language.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 mt-2 shrink-0" />
                <p>Speech recognition accuracy may decrease in noisy environments.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 mt-2 shrink-0" />
                <p>Requires a stable internet connection for AI analysis and voice features.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/60 mt-2 shrink-0" />
                <p>Analysis quality depends on the clarity and length of your spoken answers.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 border-t border-white/[0.04]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h2 className="text-4xl font-bold mb-4 text-black text-3d">Ready to Ace Your Interview?</h2>
            <p className="text-gray-400 mb-8">Join thousands of candidates who practice daily with our AI interviewer.</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-cyan-500 rounded-2xl font-semibold hover:shadow-[0_0_40px_rgba(14,165,233,0.4)] transition-all hover:scale-105"
            >
              <Zap className="w-5 h-5" /> Start Practicing Now — It's Free
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
