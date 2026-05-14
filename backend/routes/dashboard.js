const express = require('express');
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's interview history (with full Q&A details)
router.get('/history', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select('sessionId role difficulty status overallScore totalQuestions createdAt completedAt answers');
    res.json(interviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get interview details
router.get('/interview/:sessionId', auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({ sessionId: req.params.sessionId, userId: req.user.userId });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get stats for dashboard
router.get('/stats', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.userId, status: 'completed' });

    const totalInterviews = interviews.length;
    const avgScore = totalInterviews > 0
      ? Math.round(interviews.reduce((a, b) => a + (b.overallScore || 0), 0) / totalInterviews * 10) / 10
      : 0;

    const roleStats = {};
    interviews.forEach(i => {
      if (!roleStats[i.role]) roleStats[i.role] = { count: 0, totalScore: 0 };
      roleStats[i.role].count += 1;
      roleStats[i.role].totalScore += i.overallScore || 0;
    });

    const roleBreakdown = Object.keys(roleStats).map(role => ({
      role,
      count: roleStats[role].count,
      avgScore: Math.round(roleStats[role].totalScore / roleStats[role].count * 10) / 10
    }));

    const recentScores = interviews
      .slice(-5)
      .map(i => ({ date: i.completedAt, score: i.overallScore, role: i.role }));

    res.json({ totalInterviews, avgScore, roleBreakdown, recentScores });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete an interview record
router.delete('/history/:sessionId', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      sessionId: req.params.sessionId,
      userId: req.user.userId
    });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json({ message: 'Interview deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
