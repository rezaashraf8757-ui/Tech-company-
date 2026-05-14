const express = require('express');
const router = express.Router();
const QuestionBank = require('../models/QuestionBank');

// ─── Admin Secret Key Middleware ────────────────────────────────────────────
// Sirf aap (host) access kar sakte ho — header mein x-admin-key bhejna hoga
const adminOnly = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin key required.'
    });
  }
  next();
};

// ─── GET: Saare questions lao (filter by category/difficulty) ──────────────
// Admin only — users ko yeh nahi dikhega
router.get('/', adminOnly, async (req, res) => {
  try {
    const { category, difficulty, topic } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (topic) filter.topic = new RegExp(topic, 'i');

    const questions = await QuestionBank.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── POST: Naya question add karo (admin only) ──────────────────────────────
router.post('/add', adminOnly, async (req, res) => {
  try {
    const { question, category, difficulty, topic, suggestedAnswer } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ success: false, message: 'Question field is required' });
    }

    const newQuestion = new QuestionBank({
      question: question.trim(),
      category: category || 'General',
      difficulty: difficulty || 'medium',
      topic: topic || '',
      suggestedAnswer: suggestedAnswer || ''
    });

    await newQuestion.save();
    res.status(201).json({
      success: true,
      message: 'Question add ho gaya!',
      question: newQuestion
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── POST: Bulk questions add karo (admin only) ─────────────────────────────
router.post('/bulk', adminOnly, async (req, res) => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Questions array required' });
    }

    const docs = questions.map(q => ({
      question: q.question.trim(),
      category: q.category || 'General',
      difficulty: q.difficulty || 'medium',
      topic: q.topic || '',
      suggestedAnswer: q.suggestedAnswer || ''
    }));

    const inserted = await QuestionBank.insertMany(docs);
    res.status(201).json({
      success: true,
      message: `${inserted.length} questions add ho gaye!`,
      count: inserted.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── PUT: Question update karo (admin only) ─────────────────────────────────
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const updated = await QuestionBank.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Question nahi mila' });
    }

    res.json({ success: true, message: 'Question update ho gaya!', question: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── DELETE: Question delete karo (admin only) ──────────────────────────────
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const deleted = await QuestionBank.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Question nahi mila' });
    }

    res.json({ success: true, message: 'Question delete ho gaya!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── DELETE ALL: Saare questions hatao (admin only) ─────────────────────────
router.delete('/clear/all', adminOnly, async (req, res) => {
  try {
    const result = await QuestionBank.deleteMany({});
    res.json({ success: true, message: `${result.deletedCount} questions delete ho gaye!` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── GET Stats (admin only) ──────────────────────────────────────────────────
router.get('/stats', adminOnly, async (req, res) => {
  try {
    const stats = await QuestionBank.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          easy: { $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] } },
          hard: { $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] } }
        }
      }
    ]);

    const total = await QuestionBank.countDocuments({ isActive: true });
    res.json({ success: true, total, byCategory: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ─── INTERNAL: Interview mein use hone wala route (no admin key needed) ─────
// Yeh sirf backend services ke liye hai — interview generation mein use hoga
router.get('/internal/random', async (req, res) => {
  try {
    const { category, difficulty, limit = 10 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    const total = await QuestionBank.countDocuments(filter);
    if (total === 0) {
      return res.json({ success: true, questions: [], fromDB: false });
    }

    // Random questions fetch karo
    const questions = await QuestionBank.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } },
      { $project: { question: 1, category: 1, difficulty: 1, topic: 1, suggestedAnswer: 1 } }
    ]);

    res.json({ success: true, questions, fromDB: true, total });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;
