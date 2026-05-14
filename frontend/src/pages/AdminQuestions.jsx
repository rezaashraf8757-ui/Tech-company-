import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Trash2, Search, Filter, BookOpen,
  ChevronDown, CheckCircle, AlertCircle, X, RefreshCw, Database
} from 'lucide-react';

const API = 'http://localhost:5000/api/questions';
const token = () => localStorage.getItem('token');

const CATEGORIES = ['General', 'Software Developer', 'HR Round', 'Managerial Round'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

const diffColor = {
  easy: 'bg-green-500/15 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  hard: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const catColor = {
  General: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'Software Developer': 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  'HR Round': 'bg-pink-500/15 text-pink-400 border-pink-500/30',
  'Managerial Round': 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [stats, setStats] = useState({ total: 0, byCategory: [] });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Filters
  const [filterCat, setFilterCat] = useState('');
  const [filterDiff, setFilterDiff] = useState('');
  const [search, setSearch] = useState('');

  // Form
  const [form, setForm] = useState({
    question: '', category: 'General', difficulty: 'medium',
    topic: '', suggestedAnswer: ''
  });
  const [formOpen, setFormOpen] = useState(false);
  const [adding, setAdding] = useState(false);

  // ── Fetch questions ────────────────────────────────────────────────
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterCat) params.set('category', filterCat);
      if (filterDiff) params.set('difficulty', filterDiff);
      const res = await fetch(`${API}?${params}`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch {
      showToast('Fetch mein error aaya', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch stats ────────────────────────────────────────────────────
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API}/stats`, {
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  useEffect(() => { fetchQuestions(); fetchStats(); }, [filterCat, filterDiff]);

  // ── Toast helper ───────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Add question ───────────────────────────────────────────────────
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.question.trim()) return showToast('Question field khali hai!', 'error');
    setAdding(true);
    try {
      const res = await fetch(`${API}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token()}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        showToast('Question add ho gaya! ✓');
        setForm({ question: '', category: 'General', difficulty: 'medium', topic: '', suggestedAnswer: '' });
        setFormOpen(false);
        fetchQuestions();
        fetchStats();
      } else {
        showToast(data.message || 'Error aaya', 'error');
      }
    } catch {
      showToast('Server se connection nahi ho raha', 'error');
    } finally {
      setAdding(false);
    }
  };

  // ── Delete question ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Kya aap sure hain? Ye question delete ho jayega.')) return;
    try {
      const res = await fetch(`${API}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast('Question delete ho gaya!');
        fetchQuestions();
        fetchStats();
      }
    } catch {
      showToast('Delete nahi ho saka', 'error');
    }
  };

  // ── Client-side search ─────────────────────────────────────────────
  const filtered = questions.filter(q =>
    q.question.toLowerCase().includes(search.toLowerCase()) ||
    (q.topic || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Question Bank</h1>
              <p className="text-sm text-gray-400">MongoDB mein interview questions manage karo</p>
            </div>
          </div>
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium text-white text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
          >
            <Plus className="w-4 h-4" /> Naya Question Add Karo
          </button>
        </motion.div>

        {/* ── Stats cards ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          <div className="bg-dark-800/60 border border-white/[0.07] rounded-2xl p-4">
            <p className="text-3xl font-bold text-white">{stats.total || 0}</p>
            <p className="text-xs text-gray-400 mt-1">Total Questions</p>
          </div>
          {CATEGORIES.slice(1).map((cat, i) => {
            const s = (stats.byCategory || []).find(x => x._id === cat);
            return (
              <div key={cat} className="bg-dark-800/60 border border-white/[0.07] rounded-2xl p-4">
                <p className="text-3xl font-bold text-white">{s?.count || 0}</p>
                <p className="text-xs text-gray-400 mt-1">{cat}</p>
              </div>
            );
          })}
        </motion.div>

        {/* ── Filters & Search ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3 items-center bg-dark-800/60 border border-white/[0.07] rounded-2xl p-4"
        >
          {/* Search */}
          <div className="flex items-center gap-2 bg-dark-900/60 border border-white/10 rounded-xl px-3 py-2 flex-1 min-w-[180px]">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              type="text" placeholder="Question ya topic search karo..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-white placeholder-gray-500 outline-none w-full"
            />
            {search && <button onClick={() => setSearch('')}><X className="w-3 h-3 text-gray-500 hover:text-white" /></button>}
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={filterCat} onChange={e => setFilterCat(e.target.value)}
              className="appearance-none bg-dark-900/60 border border-white/10 rounded-xl px-4 py-2 pr-8 text-sm text-gray-300 outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Difficulty filter */}
          <div className="relative">
            <select
              value={filterDiff} onChange={e => setFilterDiff(e.target.value)}
              className="appearance-none bg-dark-900/60 border border-white/10 rounded-xl px-4 py-2 pr-8 text-sm text-gray-300 outline-none cursor-pointer"
            >
              <option value="">All Difficulties</option>
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
            </select>
            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            onClick={() => { setFilterCat(''); setFilterDiff(''); setSearch(''); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>

          <span className="text-xs text-gray-500 ml-auto">{filtered.length} results</span>
        </motion.div>

        {/* ── Questions List ────────────────────────────────────────── */}
        <div className="space-y-3">
          <AnimatePresence>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 gap-3"
              >
                <BookOpen className="w-12 h-12 text-gray-600" />
                <p className="text-gray-500 text-sm">
                  {questions.length === 0
                    ? 'Abhi koi question nahi hai. Pehla question add karo!'
                    : 'Koi match nahi mila'}
                </p>
                {questions.length === 0 && (
                  <button
                    onClick={() => setFormOpen(true)}
                    className="mt-2 px-4 py-2 text-sm bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl hover:bg-blue-600/30 transition"
                  >
                    + Question Add Karo
                  </button>
                )}
              </motion.div>
            ) : (
              filtered.map((q, i) => (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="group bg-dark-800/60 border border-white/[0.07] hover:border-white/[0.12] rounded-2xl p-5 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${catColor[q.category] || catColor['General']}`}>
                          {q.category}
                        </span>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${diffColor[q.difficulty]}`}>
                          {q.difficulty}
                        </span>
                        {q.topic && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                            📌 {q.topic}
                          </span>
                        )}
                      </div>

                      {/* Question text */}
                      <p className="text-white text-sm leading-relaxed font-medium">{q.question}</p>

                      {/* Suggested answer */}
                      {q.suggestedAnswer && (
                        <details className="mt-3">
                          <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300 transition select-none">
                            💡 Suggested answer dekho
                          </summary>
                          <p className="mt-2 text-xs text-gray-400 bg-dark-900/60 rounded-xl p-3 leading-relaxed border border-white/5">
                            {q.suggestedAnswer}
                          </p>
                        </details>
                      )}

                      <p className="text-xs text-gray-600 mt-3">
                        Added: {new Date(q.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDelete(q._id)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Add Question Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {formOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={e => { if (e.target === e.currentTarget) setFormOpen(false); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-[#0f1623] border border-white/[0.08] rounded-3xl p-6 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Naya Question Add Karo</h2>
                </div>
                <button
                  onClick={() => setFormOpen(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* Question */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Question <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Yahan interview question likhein..."
                    value={form.question}
                    onChange={e => setForm({ ...form, question: e.target.value })}
                    className="w-full bg-dark-900/60 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none resize-none transition"
                    required
                  />
                </div>

                {/* Category + Difficulty (side by side) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Category</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-dark-900/60 border border-white/10 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-sm text-white outline-none transition appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Difficulty</label>
                    <select
                      value={form.difficulty}
                      onChange={e => setForm({ ...form, difficulty: e.target.value })}
                      className="w-full bg-dark-900/60 border border-white/10 focus:border-blue-500/50 rounded-xl px-3 py-2.5 text-sm text-white outline-none transition appearance-none cursor-pointer"
                    >
                      {DIFFICULTIES.map(d => (
                        <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Topic */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Topic (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. React Hooks, System Design, Leadership..."
                    value={form.topic}
                    onChange={e => setForm({ ...form, topic: e.target.value })}
                    className="w-full bg-dark-900/60 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition"
                  />
                </div>

                {/* Suggested Answer */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Suggested Answer (optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Is question ka ideal answer kya hoga..."
                    value={form.suggestedAnswer}
                    onChange={e => setForm({ ...form, suggestedAnswer: e.target.value })}
                    className="w-full bg-dark-900/60 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none resize-none transition"
                  />
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-1">
                  <button
                    type="button" onClick={() => setFormOpen(false)}
                    className="flex-1 py-2.5 rounded-xl text-sm text-gray-400 border border-white/10 hover:border-white/20 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit" disabled={adding}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {adding ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
                    ) : (
                      <><Plus className="w-4 h-4" /> Question Add Karo</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium ${
              toast.type === 'error'
                ? 'bg-red-900/90 border border-red-500/40 text-red-200'
                : 'bg-green-900/90 border border-green-500/40 text-green-200'
            }`}
          >
            {toast.type === 'error'
              ? <AlertCircle className="w-4 h-4 text-red-400" />
              : <CheckCircle className="w-4 h-4 text-green-400" />
            }
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
