import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import FloatingParticles from './components/FloatingParticles';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';
import History from './pages/History';
import ResumeUpload from './pages/ResumeUpload';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` }})
        .then(r => r.ok ? r.json() : null)
        .then(data => setUser(data))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen text-white relative">
        <FloatingParticles />
        <div className="relative z-10">
          <Navbar user={user} setUser={setUser} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup setUser={setUser} />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><InterviewRoom /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><ResumeUpload /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
