const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  question: { type: String, required: true },
  userAnswer: { type: String, required: true },
  score: { type: Number, min: 0, max: 10 },
  technicalScore: { type: Number, min: 0, max: 10 },
  communicationScore: { type: Number, min: 0, max: 10 },
  confidenceScore: { type: Number, min: 0, max: 10 },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestedAnswer: { type: String },
  feedback: { type: String },
  timeTaken: { type: Number },
  answeredAt: { type: Date, default: Date.now }
});

const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
  useResume: { type: Boolean, default: false },
  questions: [{ type: String }],
  answers: [answerSchema],
  overallScore: { type: Number, min: 0, max: 10 },
  totalQuestions: { type: Number, default: 0 },
  completedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Interview', interviewSchema);
