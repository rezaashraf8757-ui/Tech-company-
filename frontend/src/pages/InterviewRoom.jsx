import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import { Mic, MicOff, Volume2, VolumeX, ArrowRight, CheckCircle, TrendingUp, Award, RefreshCw, Brain, Zap, MessageSquare, Timer, FileText, Sparkles } from 'lucide-react';
import VoiceWave from '../components/VoiceWave';

const roleCategories = [
  {
    label: '🛠️ Engineering',
    color: 'blue',
    roles: [
      'Software Developer',
      'Computer Science',
      'Data Science & AI',
      'Civil Engineering',
      'Mechanical Engineering',
      'Electrical Engineering',
      'Electronics & Communication',
      'Chemical Engineering',
      'Aerospace Engineering',
      'Biotechnology',
      'Biomedical Engineering',
    ]
  },
  {
    label: '🏥 Medical',
    color: 'green',
    roles: [
      'MBBS / General Medicine',
      'Dentistry (BDS)',
      'Pharmacy',
      'Nursing',
      'Physiotherapy',
    ]
  },
  {
    label: '💼 HR & Management',
    color: 'purple',
    roles: [
      'HR Round',
      'Managerial Round',
    ]
  }
];
const allRoles = roleCategories.flatMap(c => c.roles);
const difficulties = ['easy', 'medium', 'hard'];


export default function InterviewRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const preselectedRole = location.state?.role;
  const [role, setRole] = useState(preselectedRole || allRoles[0]);
  const [difficulty, setDifficulty] = useState('medium');

  const [sessionId, setSessionId] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [overallScore, setOverallScore] = useState(0);
  const [answerCount, setAnswerCount] = useState(0);
  const [interimAnswer, setInterimAnswer] = useState('');
  const [started, setStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [useResume, setUseResume] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [hasResume, setHasResume] = useState(false);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = true; rec.interimResults = true; rec.lang = 'en-US';
      rec.onresult = (e) => {
        let f = '', i = '';
        for (let j = e.resultIndex; j < e.results.length; j++) {
          if (e.results[j].isFinal) f += e.results[j][0].transcript;
          else i += e.results[j][0].transcript;
        }
        if (f) setAnswer(p => p + ' ' + f.trim());
        setInterimAnswer(i);
      };
      rec.onend = () => setListening(false);
      recognitionRef.current = rec;
    }
    if ('speechSynthesis' in window) synthRef.current = window.speechSynthesis;
    // Fetch user's resume skills
    api.get('/resume/skills').then(r => {
      const skills = r.data.skills || [];
      const hasText = (r.data.resumeText || '').trim().length > 50;
      setUserSkills(skills);
      setHasResume(hasText);
    }).catch(() => {});
    return () => { recognitionRef.current?.stop(); synthRef.current?.cancel(); };
  }, []);

  useEffect(() => {
    if (started && !completed) {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [started, completed]);

  const speak = useCallback((text) => {
    if (!synthRef.current || muted) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    
    // Select a different voice (Prefer Indian English or Professional Male Voice)
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google UK English Male') || 
      v.name.includes('Microsoft Ravi') || 
      v.name.includes('Microsoft Heera') || 
      v.name.includes('Google US English Male') ||
      v.lang === 'en-IN'
    );
    
    if (preferredVoice) {
      u.voice = preferredVoice;
    }

    u.rate = 0.92; // Thoda slow aur clear
    u.pitch = 0.9; // Professional deep voice
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    synthRef.current.speak(u);
  }, [role, muted]);

  const startInterview = async () => {
    setLoading(true);
    try {
      const r = await api.post('/interview/start', { role, difficulty, useResume });
      setSessionId(r.data.sessionId); setQuestion(r.data.question);
      setStarted(true); setAnswer(''); setFeedback(null); setCompleted(false); setAnswerCount(0); setOverallScore(0); setElapsedTime(0);
      speak(r.data.question);
    } catch (e) { alert(e.response?.data?.message || 'Failed to start'); }
    setLoading(false);
  };

  const toggleListen = () => {
    if (!recognitionRef.current) { alert('Speech recognition not supported. Use Chrome.'); return; }
    if (listening) { recognitionRef.current.stop(); setListening(false); }
    else { setAnswer(''); setInterimAnswer(''); recognitionRef.current.start(); setListening(true); }
  };

  const submitAnswer = async () => {
    if (!answer.trim() || !sessionId) return;
    setLoading(true);
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
    try {
      const r = await api.post('/interview/answer', { sessionId, answer: answer.trim(), timeTaken: 0 });
      setFeedback(r.data.analysis); setOverallScore(r.data.overallScore); setAnswerCount(c => c + 1);
      if (r.data.completed) { setCompleted(true); setQuestion(''); }
      else { setQuestion(r.data.nextQuestion); setAnswer(''); setInterimAnswer(''); speak(r.data.nextQuestion); }
    } catch (e) { alert(e.response?.data?.message || 'Submit failed'); }
    setLoading(false);
  };

  const finishInterview = async () => {
    if (sessionId) await api.post('/interview/finish', { sessionId }).catch(() => {});
    navigate('/history');
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  if (!started) return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shadow-lg">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold mb-3 text-black text-3d">Start Interview</h1>
          <p className="text-black text-3d font-semibold">Configure your AI interview session</p>
        </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white shadow-md border border-gray-200 rounded-xl p-8 space-y-8"
        style={{ perspective: '1000px' }}
      >
        <div>
          <label className="block text-sm text-black/70 mb-3 font-semibold">Interview Role</label>
          <div className="space-y-4">
            {roleCategories.map(cat => {
              const catColors = {
                blue: { header: 'text-blue-700 bg-blue-50 border-blue-200', btn: 'border-blue-500/50 bg-blue-500/10 text-blue-700 shadow-[0_4px_20px_rgba(59,130,246,0.2)]', bar: 'from-blue-500 to-cyan-400' },
                green: { header: 'text-green-700 bg-green-50 border-green-200', btn: 'border-green-500/50 bg-green-500/10 text-green-700 shadow-[0_4px_20px_rgba(34,197,94,0.2)]', bar: 'from-green-500 to-emerald-400' },
                purple: { header: 'text-purple-700 bg-purple-50 border-purple-200', btn: 'border-purple-500/50 bg-purple-500/10 text-purple-700 shadow-[0_4px_20px_rgba(168,85,247,0.2)]', bar: 'from-purple-500 to-pink-400' },
              };
              const c = catColors[cat.color];
              return (
                <div key={cat.label}>
                  <p className={`text-xs font-bold px-2.5 py-1 rounded-lg border inline-block mb-2 ${c.header}`}>{cat.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {cat.roles.map(r => (
                      <motion.button
                        key={r}
                        onClick={() => setRole(r)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        className={`relative px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          role === r
                            ? c.btn
                            : 'border-black/10 hover:border-black/25 bg-white/60 hover:bg-white text-black'
                        }`}
                      >
                        {role === r && <div className={`absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r ${c.bar} rounded-full`} />}
                        {r}
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm text-black/70 mb-3 font-semibold">Difficulty Level</label>
          <div className="grid grid-cols-3 gap-3">
            {difficulties.map(d => (
              <motion.button
                key={d}
                onClick={() => setDifficulty(d)}
                whileHover={{ rotateX: -5, translateZ: 20, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ transformStyle: 'preserve-3d' }}
                className={`relative p-4 rounded-xl border text-sm font-medium transition-all capitalize ${difficulty === d ? 'border-primary-500/50 bg-primary-500/10 text-primary-700 shadow-[0_8px_30px_rgba(14,165,233,0.2)]' : 'border-black/10 hover:border-black/30 bg-white/60 hover:bg-white/90 text-black'}`}
              >
                {difficulty === d && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full" />}
                {d}
              </motion.button>
            ))}
          </div>
        </div>
        {/* Resume-Based Mode Toggle */}
        <div className={`rounded-xl border-2 p-4 transition-all ${useResume ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${useResume ? 'bg-purple-500' : 'bg-gray-300'}`}>
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className={`font-bold text-sm ${useResume ? 'text-purple-700' : 'text-gray-700'}`}>📄 Resume-Based Interview</p>
                <p className="text-xs text-gray-500">AI asks questions from YOUR resume content</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (!hasResume) { alert('Please upload your resume first from the Resume page!'); return; }
                setUseResume(v => !v);
              }}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${useResume ? 'bg-purple-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${useResume ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
          {useResume && userSkills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="text-xs text-purple-600 font-semibold w-full mb-1">✅ Detected skills from your resume:</span>
              {userSkills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 bg-purple-100 border border-purple-200 rounded-lg text-xs font-semibold text-purple-700">{s}</span>
              ))}
            </div>
          )}
          {!hasResume && (
            <p className="text-xs text-amber-600 mt-2 font-semibold">⚠️ No resume uploaded yet. <a href="/resume" className="underline">Upload here</a></p>
          )}
        </div>

        <button onClick={startInterview} disabled={loading} className="w-full py-4 bg-gradient-to-r from-primary-600 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 disabled:opacity-50 rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:scale-[1.02] flex items-center justify-center gap-3">
          {useResume ? <Sparkles className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
          {loading ? 'Initializing AI...' : useResume ? 'Launch Resume-Based Interview' : 'Launch Voice Interview'}
        </button>
        <p className="text-xs text-black/50 text-center flex items-center justify-center gap-1.5">
          <Mic className="w-3 h-3" /> Requires microphone access. Best experience in Chrome / Edge.
        </p>
      </motion.div>
      </div>
    </div>
  );

  if (completed) return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="bg-white shadow-md border border-gray-200 rounded-xl p-12 relative overflow-hidden"
          style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
        >
          <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-lg"
            style={{ transform: 'translateZ(30px)' }}
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-4xl font-extrabold mb-2 text-black text-3d" style={{ transform: 'translateZ(20px)' }}>Interview Complete!</h1>
          <p className="text-black text-3d font-semibold mb-8">You conquered {answerCount} AI-generated questions in {formatTime(elapsedTime)}</p>
          <div className="flex items-center justify-center gap-3 text-5xl font-extrabold text-amber-600 mb-10" style={{ transform: 'translateZ(40px)' }}>
            <TrendingUp className="w-10 h-10" />
            {overallScore}<span className="text-2xl text-black/40 font-bold">/10</span>
          </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => { setStarted(false); setCompleted(false); }} className="px-8 py-3 bg-gradient-to-r from-primary-600 to-cyan-500 hover:from-primary-500 hover:to-cyan-400 rounded-2xl font-semibold transition-all hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] hover:scale-105 flex items-center gap-2">
            <RefreshCw className="w-5 h-5" /> New Interview
          </button>
          <button onClick={finishInterview} className="px-8 py-3 glass hover:bg-white/[0.08] hover:border-primary-500/30 rounded-2xl font-semibold transition-all hover:scale-105 flex items-center gap-2">
            <ArrowRight className="w-5 h-5" /> View History
          </button>
        </div>
      </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Top Bar */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${role === 'Software Developer' ? 'border-blue-500/30 bg-blue-500/10 text-blue-700' : role === 'HR Round' ? 'border-purple-500/30 bg-purple-500/10 text-purple-700' : 'border-orange-500/30 bg-orange-500/10 text-orange-700'}`}>
            {role}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-black/60">
            <MessageSquare className="w-3.5 h-3.5" /> Q{answerCount + 1}/10
          </div>
          <div className="flex items-center gap-1.5 text-sm text-black/60">
            <Timer className="w-3.5 h-3.5" /> {formatTime(elapsedTime)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setMuted(!muted)} className="p-2.5 glass hover:bg-white rounded-xl transition-all hover:scale-105 border border-black/10">
            {muted ? <VolumeX className="w-4 h-4 text-black/50" /> : <Volume2 className="w-4 h-4 text-primary-600" />}
          </button>
          <div className="glass px-4 py-2 rounded-xl flex items-center gap-2 border-amber-500/30">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-amber-600">{overallScore}</span>
            <span className="text-xs text-black/50">/10</span>
          </div>
        </div>
      </motion.div>

      {/* AI Question Card */}
      <motion.div
        key={question}
        initial={{ opacity: 0, x: -20, rotateY: -5 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        className="bg-white shadow-md border border-gray-200 rounded-xl p-6 mb-6 relative overflow-hidden"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary-500 via-purple-500 to-primary-500 opacity-50" />
        <div className="flex items-start gap-4">
          <div className="relative" style={{ transform: 'translateZ(20px)' }}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            {speaking && (
              <>
                <div className="absolute inset-0 w-11 h-11 rounded-2xl bg-primary-500/30 blur-md animate-pulse" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </>
            )}
          </div>
          <div className="flex-1" style={{ transform: 'translateZ(15px)' }}>
            <p className="text-xs text-black/50 font-mono mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              AI INTERVIEWER
            </p>
            <p className="text-lg leading-relaxed text-black text-3d font-medium">{question}</p>
            <div className="mt-4">
              <VoiceWave active={speaking} color="cyan" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Answer Card */}
      <motion.div
        initial={{ opacity: 0, x: 20, rotateY: 5 }}
        animate={{ opacity: 1, x: 0, rotateY: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="bg-white shadow-md border border-gray-200 rounded-xl p-6 mb-6 relative"
        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
      >
        <div className="flex items-start gap-4">
          <div className="relative shrink-0" style={{ transform: 'translateZ(25px)' }}>
            <button
              onClick={toggleListen}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${listening ? 'bg-red-500/20 scale-110' : 'bg-slate-200 hover:bg-slate-300'} border-2 ${listening ? 'border-red-500/50 animate-pulse' : 'border-black/10'}`}
              style={listening ? { boxShadow: '0 0 20px rgba(239,68,68,0.3), 0 0 40px rgba(239,68,68,0.1)' } : {}}
            >
              {listening ? <MicOff className="w-6 h-6 text-red-500" /> : <Mic className="w-6 h-6 text-slate-700" />}
            </button>
            {listening && (
              <>
                <div className="absolute inset-0 w-14 h-14 rounded-full border border-red-500/30 pulse-ring" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-400 rounded-full border-2 border-white animate-pulse" />
              </>
            )}
          </div>
          <div className="flex-1 min-h-[80px]" style={{ transform: 'translateZ(15px)' }}>
            <p className="text-xs text-black/50 font-mono mb-2 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${listening ? 'bg-red-500 animate-pulse' : 'bg-black/30'}`} />
              {listening ? 'LISTENING...' : 'YOUR ANSWER'}
            </p>
            {answer || interimAnswer ? (
              <p className="text-black leading-relaxed">{answer} <span className="text-black/40 italic">{interimAnswer}</span></p>
            ) : (
              <p className="text-black/40 italic mt-2">{listening ? 'Speak clearly into your microphone...' : 'Click the glowing mic button to start speaking'}</p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-5 ml-[72px]">
          <button
            onClick={toggleListen}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 ${listening ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20' : 'bg-primary-600/80 hover:bg-primary-500 text-white border border-primary-500/30'}`}
          >
            {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {listening ? 'Stop Recording' : 'Start Recording'}
          </button>
          <button
            onClick={submitAnswer}
            disabled={loading || !answer.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 disabled:opacity-40 disabled:hover:scale-100 rounded-xl font-medium text-white transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:scale-105"
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Analyzing with AI...</>
            ) : (
              <><TrendingUp className="w-4 h-4" /> Submit & Analyze</>
            )}
          </button>
        </div>
      </motion.div>

      {/* Feedback Card */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="bg-white shadow-md border border-gray-200 rounded-xl p-6 mb-6 relative overflow-hidden"
            style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-purple-500" />
            <h3 className="text-lg font-bold text-black text-3d mb-5 flex items-center gap-2 ml-2" style={{ transform: 'translateZ(20px)' }}>
              <TrendingUp className="w-5 h-5 text-primary-600" /> AI Feedback Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ml-2">
              {[
                { label: 'Overall', val: feedback.score, color: 'text-primary-600', bg: 'bg-primary-500/10 border-primary-500/20' },
                { label: 'Technical', val: feedback.technicalScore, color: 'text-blue-600', bg: 'bg-blue-500/10 border-blue-500/20' },
                { label: 'Communication', val: feedback.communicationScore, color: 'text-purple-600', bg: 'bg-purple-500/10 border-purple-500/20' },
                { label: 'Confidence', val: feedback.confidenceScore, color: 'text-green-600', bg: 'bg-green-500/10 border-green-500/20' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`text-center p-4 rounded-xl border ${s.bg}`}
                  style={{ transform: 'translateZ(25px)' }}
                >
                  <p className="text-3xl font-extrabold text-black text-3d mb-1">{s.val}<span className="text-sm text-black/40 font-normal">/10</span></p>
                  <p className="text-xs text-black/60 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="space-y-4 ml-2">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-l-4 border-l-green-500 shadow-sm">
                <p className="text-sm font-bold text-green-600 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Strengths
                </p>
                <ul className="space-y-1.5">
                  {feedback.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-black flex items-start gap-2 font-medium">
                      <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-l-4 border-l-red-500 shadow-sm">
                <p className="text-sm font-bold text-red-500 mb-2 flex items-center gap-2">
                  <MicOff className="w-4 h-4" /> Weaknesses
                </p>
                <ul className="space-y-1.5">
                  {feedback.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-black flex items-start gap-2 font-medium">
                      <span className="w-1 h-1 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-l-4 border-l-primary-500 shadow-sm">
                <p className="text-sm font-bold text-primary-600 mb-2">Suggested Answer</p>
                <p className="text-sm text-black leading-relaxed font-medium">{feedback.suggestedAnswer}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-l-4 border-l-amber-500 shadow-sm">
                <p className="text-sm font-bold text-amber-600 mb-2">General Feedback</p>
                <p className="text-sm text-black leading-relaxed font-medium">{feedback.feedback}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
