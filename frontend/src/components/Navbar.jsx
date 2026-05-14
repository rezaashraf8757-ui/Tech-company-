import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, LayoutDashboard, History, FileUp, Zap } from 'lucide-react';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/interview', icon: Zap, label: 'Interview' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/resume', icon: FileUp, label: 'Resume' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/60 backdrop-blur-2xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shadow-lg group-hover:shadow-primary-500/30 transition-shadow">
                <svg viewBox="0 0 64 64" className="w-6 h-6" fill="none">
                  <path d="M32 4L58 18V46L32 60L6 46V18L32 4Z" stroke="url(#navLogoGrad)" strokeWidth="2.5" fill="rgba(14,165,233,0.1)" />
                  <path d="M32 12L50 22V42L32 52L14 42V22L32 12Z" stroke="url(#navLogoGrad)" strokeWidth="1.5" opacity="0.5" />
                  <text x="32" y="39" textAnchor="middle" fill="url(#navLogoGrad)" fontSize="20" fontWeight="bold" fontFamily="system-ui">T</text>
                  <defs>
                    <linearGradient id="navLogoGrad" x1="0" y1="0" x2="64" y2="64">
                      <stop stopColor="#0ea5e9" />
                      <stop offset="1" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="absolute inset-0 w-9 h-9 rounded-xl bg-primary-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold text-black text-3d tracking-wide">
              Tech Company Interview
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {token ? (
              <>
                {navItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm transition-all ${
                      location.pathname === item.to
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    {location.pathname === item.to && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-xl bg-primary-500/10 border border-primary-500/20"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all ml-1"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition">Login</Link>
                <Link to="/signup" className="px-5 py-2 text-sm bg-gradient-to-r from-primary-600 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 rounded-xl font-medium transition-all hover:shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
