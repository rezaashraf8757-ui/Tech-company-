import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import { Eye, EyeOff, LogIn, Zap } from 'lucide-react';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(148,163,184,0.08),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(226,232,240,0.6),_transparent_60%)]" />
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-slate-300/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gray-200/30 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-strong p-10 relative z-10"
      >
        <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500" />
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-400 flex items-center justify-center glow-cyan">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-black">Welcome Back</h1>
          <p className="text-black/70 text-sm mt-1">Sign in to continue your AI interview journey</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-sm"
          >
            <p className="font-semibold">{error}</p>
            <p className="text-xs mt-1 text-red-500">Don't have an account? <Link to="/signup" className="underline font-bold">Sign up here</Link></p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-black font-semibold mb-2 ml-1">Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-dark-700/50 border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/50 focus:bg-dark-700 focus:shadow-[0_0_15px_rgba(14,165,233,0.1)] transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-black font-semibold mb-2 ml-1">Password</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'} required value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-700/50 border border-white/[0.08] rounded-xl focus:outline-none focus:border-primary-500/50 focus:bg-dark-700 focus:shadow-[0_0_15px_rgba(14,165,233,0.1)] transition-all pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black transition">
                {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-600 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 disabled:opacity-50 rounded-xl font-semibold transition-all hover:shadow-[0_0_25px_rgba(14,165,233,0.3)] hover:scale-[1.02]"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-black/70 mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black hover:text-black/70 font-bold underline transition">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
