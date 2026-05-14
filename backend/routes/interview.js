const express = require('express');
const { v4: uuidv4 } = require('uuid');
const OpenAI = require('openai');
const Interview = require('../models/Interview');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const roleTemplates = {
  // General / HR
  'Software Developer': 'technical coding and software engineering',
  'HR Round': 'behavioral and situational HR',
  'Managerial Round': 'leadership, project management, and team handling',
  // Engineering branches
  'Civil Engineering': 'civil engineering concepts including structures, geotechnical, transportation, and construction management',
  'Mechanical Engineering': 'mechanical engineering topics including thermodynamics, fluid mechanics, manufacturing, and machine design',
  'Electrical Engineering': 'electrical engineering covering circuits, power systems, control systems, and electrical machines',
  'Electronics & Communication': 'electronics and communication engineering including signals, circuits, VLSI, and wireless communication',
  'Computer Science': 'computer science fundamentals including algorithms, data structures, operating systems, and computer networks',
  'Data Science & AI': 'data science and artificial intelligence including machine learning, statistics, Python, and deep learning',
  'Chemical Engineering': 'chemical engineering covering thermodynamics, reaction engineering, mass transfer, and process design',
  'Aerospace Engineering': 'aerospace engineering including aerodynamics, propulsion, flight mechanics, and aircraft structures',
  'Biotechnology': 'biotechnology including molecular biology, genetic engineering, bioprocess technology, and bioinformatics',
  // Medical branches
  'MBBS / General Medicine': 'medical sciences including anatomy, physiology, pathology, pharmacology, and clinical medicine',
  'Dentistry (BDS)': 'dental sciences including oral anatomy, dental materials, oral medicine, prosthodontics, and orthodontics',
  'Pharmacy': 'pharmaceutical sciences including pharmacology, medicinal chemistry, pharmaceutics, and clinical pharmacy',
  'Nursing': 'nursing sciences including patient care, medical-surgical nursing, pharmacology, and healthcare ethics',
  'Physiotherapy': 'physiotherapy including anatomy, kinesiology, rehabilitation, musculoskeletal assessment, and therapeutic exercises',
  'Biomedical Engineering': 'biomedical engineering covering medical devices, biosignals, imaging systems, and biomaterials'
};

function getFallbackQuestion(role, difficulty, index) {
  const questions = {
    'Software Developer': [
      'Explain the difference between let, const, and var in JavaScript.',
      'What are closures in JavaScript and how do they work?',
      'Describe REST API principles and HTTP methods.',
      'How does event delegation work in the DOM?',
      'Explain async/await and how it differs from Promises.',
      'What is the Virtual DOM and how does React use it?',
      'Describe database indexing and when to use it.',
      'Explain microservices architecture and its pros/cons.',
      'How would you optimize a slow database query?',
      'Design a scalable URL shortening service.'
    ],
    'HR Round': [
      'Tell me about yourself.',
      'Why do you want to work for our company?',
      'Describe a challenging situation you faced and how you handled it.',
      'What are your greatest strengths and weaknesses?',
      'Where do you see yourself in five years?',
      'Describe a time you worked with a difficult teammate.',
      'How do you handle stress and pressure?',
      'Tell me about a time you failed and what you learned.',
      'What motivates you in your work?',
      'How do you prioritize multiple deadlines?'
    ],
    'Managerial Round': [
      'Describe your leadership style.',
      'How do you handle team conflicts?',
      'Tell me about a time you had to make an unpopular decision.',
      'How do you delegate tasks effectively?',
      'Describe how you manage underperforming team members.',
      'How do you handle scope creep in a project?',
      'What metrics do you use to measure team success?',
      'Describe your approach to stakeholder management.',
      'How do you foster innovation in your team?',
      'Tell me about managing a project with tight deadlines.'
    ],
    'Civil Engineering': [
      'What is the difference between RCC and pre-stressed concrete?',
      'Explain the concept of bending moment and shear force in beams.',
      'What are the types of foundations and when is each used?',
      'Describe the water-cement ratio and its effect on concrete strength.',
      'What is bearing capacity of soil and how is it determined?',
      'Explain the critical path method (CPM) in project scheduling.',
      'What are the causes and prevention of cracks in concrete structures?',
      'Describe the design principles of a retaining wall.',
      'What is BOQ (Bill of Quantities) and how is it prepared?',
      'Explain IS code provisions for earthquake-resistant building design.'
    ],
    'Mechanical Engineering': [
      'Explain the laws of thermodynamics and their engineering applications.',
      'What is the difference between stress and strain? Define Young\'s modulus.',
      'Describe the working principle of a four-stroke internal combustion engine.',
      'What is the purpose of heat treatment in metals? Name common heat treatment processes.',
      'Explain the concept of CNC machining and its advantages over conventional machining.',
      'What is fluid viscosity and how does it affect pipeline flow?',
      'Describe the working of a refrigeration cycle.',
      'What are the differences between welding, brazing, and soldering?',
      'Explain the concept of fatigue failure in materials.',
      'What is CAD/CAM and how is it used in manufacturing?'
    ],
    'Electrical Engineering': [
      'Explain Kirchhoff\'s Voltage and Current Laws with examples.',
      'What is the difference between AC and DC circuits?',
      'Describe the working principle of a transformer.',
      'What is power factor and why is it important in power systems?',
      'Explain the operation of a three-phase induction motor.',
      'What are the types of circuit breakers and their applications?',
      'Describe PID control and its use in feedback control systems.',
      'What is the difference between a fuse and a circuit breaker?',
      'Explain the concept of earthing and grounding in electrical systems.',
      'What is a relay and how is it used in protection systems?'
    ],
    'Electronics & Communication': [
      'Explain the difference between amplitude modulation (AM) and frequency modulation (FM).',
      'What is a p-n junction diode and how does it work?',
      'Describe the working principle of a transistor as an amplifier.',
      'What is Fourier Transform and what is its significance in signal processing?',
      'Explain OFDM and its use in modern wireless communication.',
      'What is the difference between microprocessor and microcontroller?',
      'Describe the concept of impedance matching and its importance in RF circuits.',
      'What is VLSI design and what are the design flow stages?',
      'Explain Shannon\'s channel capacity theorem.',
      'What is the purpose of a phase-locked loop (PLL)?'
    ],
    'Computer Science': [
      'Explain the difference between process and thread.',
      'What is a binary search tree? Explain insertion and deletion.',
      'Describe the OSI model and the function of each layer.',
      'What is the difference between TCP and UDP?',
      'Explain dynamic programming with an example.',
      'What is virtual memory and how does paging work?',
      'Describe the concept of normalization in databases (1NF, 2NF, 3NF).',
      'What is Big-O notation? Analyze the time complexity of common sorting algorithms.',
      'Explain the difference between DFS and BFS graph traversal.',
      'What are design patterns? Explain the Singleton and Factory patterns.'
    ],
    'Data Science & AI': [
      'Explain the difference between supervised, unsupervised, and reinforcement learning.',
      'What is overfitting and how do you prevent it?',
      'Describe the working of a neural network and backpropagation.',
      'What is the difference between precision and recall? When would you prioritize each?',
      'Explain how a Random Forest algorithm works.',
      'What is gradient descent and what are its variants?',
      'Describe the bias-variance tradeoff.',
      'What is a confusion matrix and how do you interpret it?',
      'Explain the concept of transfer learning.',
      'How do you handle missing values and imbalanced datasets?'
    ],
    'Chemical Engineering': [
      'Explain the concept of material and energy balance in chemical processes.',
      'What is distillation and how is a distillation column designed?',
      'Describe the working of a heat exchanger.',
      'What is the Arrhenius equation and how is it used in reaction engineering?',
      'Explain HAZOP analysis and its importance in process safety.',
      'What is the difference between batch, continuous, and semi-batch reactors?',
      'Describe mass transfer and its significance in chemical processes.',
      'What is fluid catalytic cracking (FCC)?',
      'Explain Raoult\'s Law and its applications in vapor-liquid equilibrium.',
      'What are the types of pumps used in chemical plants and when is each selected?'
    ],
    'Aerospace Engineering': [
      'Explain Bernoulli\'s principle and how it generates lift.',
      'What is the difference between subsonic, transonic, and supersonic flow?',
      'Describe the working of a gas turbine engine.',
      'What is specific impulse and why is it important in rocket propulsion?',
      'Explain the concept of Mach number and its significance.',
      'What are the four forces acting on an aircraft in steady level flight?',
      'Describe the orbital mechanics of a satellite.',
      'What is flutter in aircraft structures and how is it prevented?',
      'Explain the difference between solid and liquid fuel rockets.',
      'What is the role of control surfaces (ailerons, elevator, rudder) in flight?'
    ],
    'Biotechnology': [
      'What is PCR and what are its applications in biotechnology?',
      'Explain the process of recombinant DNA technology.',
      'What is CRISPR-Cas9 and how is it used in gene editing?',
      'Describe the process of cell culture and its applications.',
      'What is fermentation and how is it used in industrial biotechnology?',
      'Explain the concept of monoclonal antibodies and their applications.',
      'What are stem cells and what is their therapeutic potential?',
      'Describe the process of protein purification using chromatography.',
      'What is bioinformatics and how is it used in genomics?',
      'Explain the difference between upstream and downstream processing in biotech.'
    ],
    'MBBS / General Medicine': [
      'Explain the cardiac cycle and the events associated with each phase.',
      'What is the mechanism of action of beta-blockers?',
      'Describe the pathophysiology of Type 2 Diabetes Mellitus.',
      'What are the clinical features and management of myocardial infarction?',
      'Explain the coagulation cascade and the drugs that affect it.',
      'What is the difference between pneumonia and tuberculosis clinically?',
      'Describe the Glasgow Coma Scale and its significance.',
      'What is sepsis? How is it diagnosed and managed?',
      'Explain the mechanism of antibiotic resistance.',
      'What are the causes and management of hypertensive emergency?'
    ],
    'Dentistry (BDS)': [
      'Describe the structure and composition of tooth enamel.',
      'What is dental caries? Explain its etiology and prevention.',
      'Describe the procedure for root canal treatment (RCT).',
      'What is the difference between gingivitis and periodontitis?',
      'Explain the properties of an ideal dental impression material.',
      'What are the types of local anesthesia used in dentistry?',
      'Describe the design principles of a complete denture.',
      'What is dental fluorosis and what are its causes?',
      'Explain the principles of orthodontic tooth movement.',
      'What are the complications of tooth extraction?'
    ],
    'Pharmacy': [
      'Explain the concept of bioavailability and the factors affecting it.',
      'What is the difference between pharmacokinetics and pharmacodynamics?',
      'Describe the mechanism of action of NSAIDs.',
      'What is the significance of the blood-brain barrier in drug delivery?',
      'Explain first-pass metabolism and its clinical implications.',
      'What are the types of drug interactions? Give examples.',
      'Describe the formulation and advantages of sustained-release tablets.',
      'What is GMP (Good Manufacturing Practice) in pharmaceutical production?',
      'Explain the role of pharmacist in patient counseling.',
      'What are antibiotics? Classify them based on mechanism of action.'
    ],
    'Nursing': [
      'What is the nursing process? Explain each step.',
      'Describe the procedure for administering intravenous medication safely.',
      'What are the vital signs and their normal ranges?',
      'Explain the Glasgow Coma Scale and its nursing significance.',
      'What is patient-centered care and why is it important?',
      'Describe the management of a patient with pressure ulcers.',
      'What are universal precautions and standard infection control measures?',
      'Explain the role of a nurse in pre-operative and post-operative care.',
      'What is medication reconciliation and why is it critical?',
      'Describe the signs of shock and the nursing interventions required.'
    ],
    'Physiotherapy': [
      'Explain the physiotherapy management of a stroke patient.',
      'What is the difference between RICE and PRICE protocols for acute injuries?',
      'Describe the muscles involved in shoulder joint abduction.',
      'What is manual muscle testing (MMT) and how is it graded?',
      'Explain the physiotherapy approach to low back pain management.',
      'What are the types of therapeutic exercises and their indications?',
      'Describe the principles of electrotherapy and the use of TENS.',
      'What is proprioception and why is it important in rehabilitation?',
      'Explain the physiotherapy management of Parkinson\'s disease.',
      'What are the phases of wound healing and how does physiotherapy support them?'
    ],
    'Biomedical Engineering': [
      'Explain the working principle of an ECG machine.',
      'What is the difference between MRI and CT scan in terms of technology and use?',
      'Describe the concept of biosensors and their medical applications.',
      'What are biomaterials? Give examples of their use in implants.',
      'Explain the working of a pulse oximeter.',
      'What is telemedicine and how does it use biomedical engineering?',
      'Describe the challenges in designing an artificial heart valve.',
      'What is the role of signal processing in medical imaging?',
      'Explain the working of a dialysis machine (hemodialysis).',
      'What are the regulatory standards for medical device approval (e.g., ISO 13485, FDA)?'
    ]
  };
  const roleQuestions = questions[role] || questions['Software Developer'];
  return roleQuestions[index % roleQuestions.length];
}

function getFallbackAnalysis(answer) {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const score = Math.min(10, Math.max(2, Math.floor(wordCount / 15)));

  // Varied strengths based on answer content
  const strengthOptions = [
    wordCount > 50 ? 'Provided a detailed and comprehensive response' : 'Made an attempt to address the question',
    answer.toLowerCase().includes('example') || answer.toLowerCase().includes('for instance') ? 'Used concrete examples to support your answer' : 'Showed willingness to engage with the question',
    answer.includes('.') || answer.includes(',') ? 'Answer is structured with proper sentence formation' : 'Communicated thoughts in a direct manner',
    wordCount > 30 ? 'Demonstrated understanding of the topic area' : 'Kept the response focused and concise',
  ];

  // Varied weaknesses based on actual gaps
  const weaknessOptions = [
    wordCount < 30 ? 'Answer is too brief — elaborate more with specific details' : 'Could include more technical depth and specific examples',
    !answer.toLowerCase().includes('because') && !answer.toLowerCase().includes('since') ? 'Missing reasoning — explain the "why" behind your points' : 'Could strengthen arguments with more supporting evidence',
    wordCount < 60 ? 'Try using the STAR method (Situation, Task, Action, Result) for structure' : 'Consider summarizing your key points at the end',
  ];

  const feedbackOptions = [
    `Your answer contained ${wordCount} words. ${wordCount < 20 ? 'Try to give more detailed responses with examples.' : wordCount < 50 ? 'Good start — expand with specific scenarios from your experience.' : 'Good length. Make sure each point is clearly supported.'}`,
    `Focus on structuring your answer: start with a clear statement, then provide supporting details and a concrete example.`,
    `Practice using the STAR method: describe the Situation, your Task, the Action you took, and the Result achieved.`,
  ];

  const feedbackIndex = wordCount % feedbackOptions.length;

  return {
    score,
    technicalScore: Math.max(2, score - 1),
    communicationScore: Math.min(10, score + 1),
    confidenceScore: Math.min(10, score),
    strengths: [strengthOptions[0], strengthOptions[1]],
    weaknesses: [weaknessOptions[0], weaknessOptions[1]],
    suggestedAnswer: 'Structure your answer clearly: begin with a direct response, follow with 2-3 supporting points backed by examples, and conclude with the outcome or lesson learned.',
    feedback: feedbackOptions[feedbackIndex]
  };
}

function getAverageScore(answers) {
  if (!answers.length) return 5;
  const sum = answers.reduce((a, b) => a + (b.score || 0), 0);
  return sum / answers.length;
}

const QuestionBank = require('../models/QuestionBank');

async function getQuestionFromDB(role, difficulty, usedQuestions = []) {
  try {
    const category = role;

    const filter = {
      isActive: true,
      category,
      question: { $nin: usedQuestions } // already poocha hua na poocho
    };
    if (difficulty) filter.difficulty = difficulty;

    const total = await QuestionBank.countDocuments(filter);
    if (total === 0) return null;

    // Random question
    const skip = Math.floor(Math.random() * total);
    const q = await QuestionBank.findOne(filter).skip(skip);
    return q ? { question: q.question, suggestedAnswer: q.suggestedAnswer } : null;
  } catch {
    return null;
  }
}

async function generateQuestion(role, difficulty, user, previousAnswers, useResume = false) {
  const usedQuestions = previousAnswers.map(a => a.question);

  // ── Step 1: Resume mode ke liye sirf OpenAI use karo ──────────────────────
  if (!useResume) {
    // ── Step 2: Pehle MongoDB QuestionBank check karo ──────────────────────
    const dbResult = await getQuestionFromDB(role, difficulty, usedQuestions);
    if (dbResult) {
      console.log('✅ Question from MongoDB QuestionBank:', dbResult.question.substring(0, 60));
      return dbResult.question;
    }
  }

  // ── Step 3: DB mein nahi mila — OpenAI try karo ────────────────────────
  const roleDesc = roleTemplates[role] || role;
  const skillsContext = user.skills?.length ? `Candidate skills: ${user.skills.join(', ')}.` : '';
  const adaptiveInstruction = previousAnswers.length > 0
    ? `Previous answers average score: ${getAverageScore(previousAnswers)}/10. Adjust difficulty ${getAverageScore(previousAnswers) >= 7 ? 'harder' : 'easier'} accordingly.`
    : '';

  let resumeContext = '';
  if (useResume && user.resumeText && user.resumeText.trim().length > 50) {
    const resumeSnippet = user.resumeText.substring(0, 1200);
    resumeContext = `
The candidate's resume content is as follows (use this to ask specific, targeted questions about their actual experience, projects, and skills mentioned):
---RESUME START---
${resumeSnippet}
---RESUME END---
Ask a question that directly relates to something mentioned in the resume (e.g., a specific project, technology, or experience listed). Make it feel like a real interviewer who has read their resume.`;
  }

  const prompt = useResume && resumeContext
    ? `You are an expert ${roleDesc} interviewer who has carefully read the candidate's resume. Generate one highly specific ${difficulty} difficulty interview question based on their actual resume content. ${adaptiveInstruction}${resumeContext} Return ONLY a JSON object: {"question": "your personalized question here"}`
    : `You are an expert interviewer conducting a ${roleDesc} interview. Generate one ${difficulty} difficulty interview question. ${skillsContext} ${adaptiveInstruction} Return ONLY a JSON object: {"question": "your question here"}`;

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return getFallbackQuestion(role, difficulty, previousAnswers.length);
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250
    });
    const content = completion.choices[0].message.content;
    const parsed = JSON.parse(content);
    return parsed.question || content;
  } catch (err) {
    return getFallbackQuestion(role, difficulty, previousAnswers.length);
  }
}

async function analyzeAnswer(question, answer, role) {
  const prompt = `You are an expert interview evaluator for a ${role} position.

Evaluate the following candidate answer and provide SPECIFIC, PERSONALIZED feedback based on the actual content of their response. Do NOT give generic feedback — reference what they actually said.

INTERVIEW QUESTION:
"${question}"

CANDIDATE'S ANSWER:
"${answer}"

Instructions:
- score (0-10): Rate the overall answer quality
- technicalScore (0-10): Rate technical accuracy and depth (for HR/Managerial, rate domain knowledge)
- communicationScore (0-10): Rate clarity, structure, and articulation
- confidenceScore (0-10): Rate certainty and assertiveness of the answer
- strengths: Array of 2-3 SPECIFIC strengths from their actual answer (mention what they said)
- weaknesses: Array of 2-3 SPECIFIC gaps or weaknesses in their answer
- suggestedAnswer: A model answer for this specific question (2-4 sentences)
- feedback: One paragraph of personalized coaching feedback referencing their actual response

Return ONLY a valid JSON object with no extra text. Example format:
{"score": 7, "technicalScore": 6, "communicationScore": 8, "confidenceScore": 7, "strengths": ["...", "..."], "weaknesses": ["...", "..."], "suggestedAnswer": "...", "feedback": "..."}`;

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return getFallbackAnalysis(answer);
    }
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert interview coach. Always return valid JSON only. Never wrap in markdown code blocks.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700,
      temperature: 0.7
    });
    let content = completion.choices[0].message.content.trim();
    // Strip markdown code blocks if present
    content = content.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(content);
    return {
      score: typeof parsed.score === 'number' ? parsed.score : 5,
      technicalScore: typeof parsed.technicalScore === 'number' ? parsed.technicalScore : 5,
      communicationScore: typeof parsed.communicationScore === 'number' ? parsed.communicationScore : 5,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 5,
      strengths: Array.isArray(parsed.strengths) && parsed.strengths.length ? parsed.strengths : ['Attempted to answer the question'],
      weaknesses: Array.isArray(parsed.weaknesses) && parsed.weaknesses.length ? parsed.weaknesses : ['Could provide more specific details'],
      suggestedAnswer: parsed.suggestedAnswer || 'Provide a structured answer with examples.',
      feedback: parsed.feedback || 'Keep practicing and focus on adding specific examples.'
    };
  } catch (err) {
    console.error('analyzeAnswer error:', err.message);
    return getFallbackAnalysis(answer);
  }
}

router.post('/start', auth, async (req, res) => {
  try {
    const { role, difficulty = 'medium', useResume = false } = req.body;
    const sessionId = uuidv4();
    const interview = new Interview({ userId: req.user.userId, sessionId, role, difficulty, status: 'in_progress', useResume });
    await interview.save();

    const user = await User.findById(req.user.userId);

    // If useResume but no resume uploaded, warn client
    if (useResume && (!user.resumeText || user.resumeText.trim().length < 50)) {
      return res.status(400).json({ message: 'Please upload your resume first to use Resume-Based mode.' });
    }

    const firstQuestion = await generateQuestion(role, difficulty, user, [], useResume);
    interview.questions.push(firstQuestion);
    await interview.save();

    res.json({ sessionId, question: firstQuestion, role, difficulty, useResume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/answer', auth, async (req, res) => {
  try {
    const { sessionId, answer, timeTaken } = req.body;
    const interview = await Interview.findOne({ sessionId, userId: req.user.userId });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.status === 'completed') return res.status(400).json({ message: 'Interview already completed' });

    const currentQuestion = interview.questions[interview.questions.length - 1];
    const analysis = await analyzeAnswer(currentQuestion, answer, interview.role);

    const answerRecord = {
      question: currentQuestion, userAnswer: answer, score: analysis.score,
      technicalScore: analysis.technicalScore, communicationScore: analysis.communicationScore,
      confidenceScore: analysis.confidenceScore, strengths: analysis.strengths,
      weaknesses: analysis.weaknesses, suggestedAnswer: analysis.suggestedAnswer,
      feedback: analysis.feedback, timeTaken: timeTaken || 0
    };

    interview.answers.push(answerRecord);
    interview.totalQuestions = interview.answers.length;
    interview.overallScore = Math.round(getAverageScore(interview.answers) * 10) / 10;

    const maxQuestions = 10;
    if (interview.answers.length >= maxQuestions) {
      interview.status = 'completed';
      interview.completedAt = new Date();
      await interview.save();
      return res.json({ analysis, overallScore: interview.overallScore, completed: true });
    }

    // Adaptive difficulty
    const avg = getAverageScore(interview.answers);
    let newDifficulty = interview.difficulty;
    if (avg >= 8) newDifficulty = 'hard';
    else if (avg <= 4) newDifficulty = 'easy';

    const user = await User.findById(req.user.userId);
    const nextQuestion = await generateQuestion(interview.role, newDifficulty, user, interview.answers, interview.useResume || false);
    interview.questions.push(nextQuestion);
    interview.difficulty = newDifficulty;
    await interview.save();

    res.json({ analysis, nextQuestion, overallScore: interview.overallScore, difficulty: newDifficulty, completed: false });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/finish', auth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const interview = await Interview.findOne({ sessionId, userId: req.user.userId });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    interview.status = 'completed';
    interview.completedAt = new Date();
    await interview.save();

    res.json({ message: 'Interview completed', overallScore: interview.overallScore, answers: interview.answers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/session/:sessionId', auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({ sessionId: req.params.sessionId, userId: req.user.userId });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.json(interview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
