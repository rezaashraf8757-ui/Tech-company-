const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// Upload and parse resume
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const data = await pdf(req.file.buffer);
    const text = data.text;

    // Extract skills using simple keyword matching
    const skillsList = [
      'javascript', 'python', 'java', 'c++', 'c#', 'react', 'angular', 'vue',
      'node.js', 'express', 'mongodb', 'sql', 'mysql', 'postgresql',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp',
      'html', 'css', 'typescript', 'git', 'linux',
      'machine learning', 'deep learning', 'nlp', 'data science',
      'leadership', 'communication', 'project management', 'agile', 'scrum'
    ];

    const foundSkills = skillsList.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );

    await User.findByIdAndUpdate(req.user.userId, {
      resumeText: text,
      skills: foundSkills
    });

    res.json({
      message: 'Resume uploaded successfully',
      skills: foundSkills,
      textPreview: text.substring(0, 500)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user's skills
router.get('/skills', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('skills resumeText');
    res.json({ skills: user.skills || [], resumeText: user.resumeText || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
