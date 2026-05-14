import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import {
  Calendar, Award, Zap, MessageSquare, FileText, Trash2,
  ChevronDown, ChevronUp, CheckCircle, XCircle, Lightbulb,
  User, BookOpen, Target, Clock, TrendingUp, BarChart2
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

function scoreColor(score) {
  if (score >= 8) return 'text-green-600';
  if (score >= 5) return 'text-yellow-600';
  return 'text-red-500';
}
function scoreBg(score) {
  if (score >= 8) return 'bg-green-50 border-green-200 text-green-700';
  if (score >= 5) return 'bg-yellow-50 border-yellow-200 text-yellow-700';
  return 'bg-red-50 border-red-200 text-red-600';
}
function scoreBar(score) {
  if (score >= 8) return 'bg-green-500';
  if (score >= 5) return 'bg-yellow-500';
  return 'bg-red-500';
}

// ── Single Q&A Card ─────────────────────────────────────────────────────────
function QACard({ answer, index }) {
  const [open, setOpen] = useState(false);
  const score = answer.score ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="border border-gray-200 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Question header — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left p-4 flex items-start justify-between gap-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex gap-3 flex-1 min-w-0">
          {/* Q number + score */}
          <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border ${scoreBg(score)}`}>
            {score}/10
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Q{index + 1}</span>
            <p className="text-sm font-semibold text-gray-800 leading-snug mt-0.5 line-clamp-2">{answer.question}</p>
          </div>
        </div>
        {/* Score bar */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${scoreBar(score)}`} style={{ width: `${score * 10}%` }} />
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-50 border-t border-gray-200 p-4 space-y-4">

              {/* Scores row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Overall', val: answer.score },
                  { label: 'Technical', val: answer.technicalScore },
                  { label: 'Communication', val: answer.communicationScore },
                  { label: 'Confidence', val: answer.confidenceScore },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                    <p className={`text-xl font-extrabold ${scoreColor(s.val ?? 0)}`}>{s.val ?? '-'}<span className="text-xs font-normal text-gray-400">/10</span></p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* User Answer */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Aapka Answer</span>
                  {answer.timeTaken > 0 && (
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="w-3 h-3" /> {answer.timeTaken}s
                    </span>
                  )}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                  {answer.userAnswer || <span className="italic text-gray-400">No answer recorded</span>}
                </div>
              </div>

              {/* Suggested Answer */}
              {answer.suggestedAnswer && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-amber-600 uppercase tracking-wide">Ideal Answer</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
                    {answer.suggestedAnswer}
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {answer.strengths?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Strengths</span>
                    </div>
                    <ul className="space-y-1">
                      {answer.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-2 items-start">
                          <span className="text-green-400 mt-0.5">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {answer.weaknesses?.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span className="text-xs font-semibold text-red-500 uppercase tracking-wide">Improve Karein</span>
                    </div>
                    <ul className="space-y-1">
                      {answer.weaknesses.map((w, i) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-2 items-start">
                          <span className="text-red-400 mt-0.5">✗</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Feedback */}
              {answer.feedback && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                  <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-wide mb-1">AI Feedback</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{answer.feedback}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main History Page ────────────────────────────────────────────────────────
export default function History() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.get('/dashboard/history').then(r => {
      setInterviews(r.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleDelete = async (sessionId) => {
    if (!window.confirm('Kya aap is interview record ko delete karna chahte hain?')) return;
    setDeletingId(sessionId);
    try {
      await api.delete(`/dashboard/history/${sessionId}`);
      setInterviews(prev => prev.filter(i => i.sessionId !== sessionId));
      if (expandedId === sessionId) setExpandedId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Delete nahi ho saka');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 border-2 border-blue-400/40 border-t-blue-500 rounded-full animate-spin mb-4" />
      <p className="text-gray-500 text-sm animate-pulse">History load ho rahi hai...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Interview History</h1>
          <p className="text-gray-500 text-sm">Har interview ka question, answer, aur score yahan dekho</p>
        </motion.div>

        {interviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-500 mb-4">Abhi koi interview nahi hai.</p>
            <Link to="/interview" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-sm">
              <Zap className="w-4 h-4" /> Pehla Interview Start Karo
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {interviews.map((interview, idx) => {
              const isExpanded = expandedId === interview.sessionId;
              const answers = interview.answers || [];

              return (
                <motion.div
                  key={interview.sessionId}
                  variants={fadeUp} initial="hidden" animate="visible"
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden"
                >
                  {/* ── Interview Summary Row ── */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
                          interview.status === 'completed'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                          {interview.status === 'completed' ? '✓ Completed' : '⏳ In Progress'}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {interview.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{interview.role}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(interview.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>

                    {/* Score + Questions + Controls */}
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className={`text-2xl font-extrabold ${scoreColor(interview.overallScore ?? 0)}`}>
                          {interview.overallScore ?? '-'}<span className="text-sm font-normal text-gray-400">/10</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Score</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-extrabold text-gray-700">
                          {interview.totalQuestions ?? answers.length}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5">Questions</p>
                      </div>

                      {/* Expand Q&A */}
                      {answers.length > 0 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : interview.sessionId)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 transition-all"
                        >
                          <BarChart2 className="w-3.5 h-3.5" />
                          {isExpanded ? 'Band karo' : 'Q&A dekho'}
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(interview.sessionId)}
                        disabled={deletingId === interview.sessionId}
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 transition-all disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === interview.sessionId
                          ? <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                          : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* ── Q&A Detail Panel ── */}
                  <AnimatePresence>
                    {isExpanded && answers.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-gray-200"
                      >
                        <div className="bg-gray-50 p-5 space-y-3">
                          {/* Section header */}
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-bold text-gray-700">
                                {answers.length} Questions &amp; Answers
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              Click karo expand karne ke liye
                            </span>
                          </div>

                          {/* Individual Q&A cards */}
                          {answers.map((answer, i) => (
                            <QACard key={i} answer={answer} index={i} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
