import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Mic, TrendingUp, Award, FileUp, Activity, Zap, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then(r => {
      setStats(r.data);
      setRecent(r.data.recentScores || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const roles = [
    { name: 'Software Developer', icon: Mic, color: 'from-blue-500 to-cyan-400', glow: 'glow-cyan' },
    { name: 'HR Round', icon: Activity, color: 'from-purple-500 to-pink-400', glow: 'glow-purple' },
    { name: 'Managerial Round', icon: Award, color: 'from-orange-500 to-yellow-400', glow: 'glow-amber' },
  ];

  const chartData = recent.map((r, i) => ({
    name: `Q${i + 1}`,
    score: r.score
  }));

  if (loading) return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-2 border-primary-500/30 border-t-primary-400 rounded-full animate-spin mb-4" />
        <p className="text-black animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-black mb-1">Dashboard</h1>
          <p className="text-black/60 text-sm">Track your interview performance and start new sessions</p>
        </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          variants={fadeUp}
          whileHover={{ rotateY: 8, rotateX: -4, translateZ: 30, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="glass-strong p-6 relative"
          style={{ transformStyle: 'preserve-3d', boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.4) inset, 0 4px 8px rgba(14,165,233,0.1)' }}
        >
          <div className="flex items-center gap-3 mb-3" style={{ transform: 'translateZ(20px)' }}>
            <div className="p-2 bg-primary-500/20 rounded-lg"><Activity className="w-5 h-5 text-primary-600" /></div>
            <span className="text-black text-sm font-semibold">Total Interviews</span>
          </div>
          <p className="text-4xl font-bold text-black" style={{ transform: 'translateZ(40px)', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{stats?.totalInterviews || 0}</p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          whileHover={{ rotateY: -8, rotateX: -4, translateZ: 30, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="glass-strong p-6 relative"
          style={{ transformStyle: 'preserve-3d', boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.4) inset, 0 4px 8px rgba(34,197,94,0.1)' }}
        >
          <div className="flex items-center gap-3 mb-3" style={{ transform: 'translateZ(20px)' }}>
            <div className="p-2 bg-green-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-green-600" /></div>
            <span className="text-black text-sm font-semibold">Average Score</span>
          </div>
          <p className="text-4xl font-bold text-black" style={{ transform: 'translateZ(40px)', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{stats?.avgScore || 0}<span className="text-lg text-black/40">/10</span></p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          whileHover={{ rotateY: 8, rotateX: -4, translateZ: 30, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="glass-strong p-6 relative"
          style={{ transformStyle: 'preserve-3d', boxShadow: '0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.4) inset, 0 4px 8px rgba(139,92,246,0.1)' }}
        >
          <div className="flex items-center gap-3 mb-3" style={{ transform: 'translateZ(20px)' }}>
            <div className="p-2 bg-purple-500/20 rounded-lg"><Award className="w-5 h-5 text-purple-600" /></div>
            <span className="text-black text-sm font-semibold">Best Role</span>
          </div>
          <p className="text-xl font-bold text-black truncate" style={{ transform: 'translateZ(40px)', textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            {stats?.roleBreakdown?.sort((a,b) => b.avgScore - a.avgScore)[0]?.role || 'N/A'}
          </p>
        </motion.div>
      </motion.div>

      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="glass-strong p-6 mb-8 relative"
          style={{ transformStyle: 'preserve-3d', boxShadow: '0 25px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.5) inset' }}
          whileHover={{ rotateX: -2, translateZ: 15, scale: 1.01 }}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 opacity-60" style={{ transform: 'translateZ(10px)' }} />
          <h2 className="text-lg font-semibold text-black mb-4 flex items-center gap-2" style={{ transform: 'translateZ(20px)' }}>
            <TrendingUp className="w-4 h-4 text-primary-600" /> Recent Scores
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis domain={[0, 10]} stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(14,165,233,0.3)', borderRadius: '12px', boxShadow: '0 0 20px rgba(14,165,233,0.1)' }} />
                <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][i % 5]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-black flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary-400" /> Start New Interview
        </h2>
      </div>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        style={{ perspective: '1200px' }}
      >
        {roles.map((role, idx) => (
          <motion.div
            key={role.name}
            variants={fadeUp}
            whileHover={{ rotateY: idx === 1 ? 0 : (idx === 0 ? 10 : -10), rotateX: -3, translateZ: 40, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Link
              to="/interview"
              state={{ role: role.name }}
              className="glass-strong p-6 block group relative overflow-hidden"
              style={{
                transformStyle: 'preserve-3d',
                boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.4) inset'
              }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg`} style={{ transform: 'translateZ(30px)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <role.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-black" style={{ transform: 'translateZ(25px)' }}>{role.name}</h3>
              <p className="text-black/60 text-sm mt-1" style={{ transform: 'translateZ(20px)' }}>Practice {role.name.toLowerCase()} questions</p>
              <div className="mt-4 flex items-center gap-1 text-primary-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ transform: 'translateZ(20px)' }}>
                Start Now <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        whileHover={{ rotateX: -3, translateZ: 20, scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
      >
        <Link
          to="/resume"
          className="inline-flex items-center gap-2 px-5 py-3 glass-strong rounded-xl transition text-sm text-black font-medium group"
          style={{ transformStyle: 'preserve-3d', boxShadow: '0 15px 30px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.4) inset' }}
        >
          <FileUp className="w-4 h-4 text-primary-600" style={{ transform: 'translateZ(15px)' }} /> Upload Resume for Personalized Questions
        </Link>
      </motion.div>
      </div>
    </div>
  );
}
