require('dotenv').config();
const mongoose = require('mongoose');
const QuestionBank = require('./models/QuestionBank');

const questions = [
  // ════════ ENGINEERING ════════
  { question: "What is the difference between RCC and pre-stressed concrete?", category: "Civil Engineering", difficulty: "medium", suggestedAnswer: "RCC uses mild steel/HYSD bars to take tension. Pre-stressed concrete has high-strength steel wires tensioned before loading, keeping the concrete entirely in compression, preventing cracks and allowing longer spans." },
  { question: "Explain the concept of bending moment and shear force in beams.", category: "Civil Engineering", difficulty: "medium", suggestedAnswer: "Shear force is the algebraic sum of vertical forces acting on a section. Bending moment is the algebraic sum of moments of forces about a section. They determine the structural strength required." },
  { question: "What are the types of foundations and when is each used?", category: "Civil Engineering", difficulty: "easy", suggestedAnswer: "Shallow (isolated, strip, raft) used when hard strata is near the surface. Deep (pile, drilled shafts) used when soil bearing capacity is low and loads are heavy." },
  { question: "Explain the laws of thermodynamics and their engineering applications.", category: "Mechanical Engineering", difficulty: "medium", suggestedAnswer: "1st Law: Energy conservation (used in engine cycles). 2nd Law: Entropy increases, heat flows hot to cold (limits engine efficiency). 3rd Law: Entropy of a perfect crystal at absolute zero is zero." },
  { question: "What is the difference between stress and strain? Define Young's modulus.", category: "Mechanical Engineering", difficulty: "easy", suggestedAnswer: "Stress is force per unit area. Strain is deformation per unit length. Young's modulus is the ratio of tensile stress to tensile strain, representing material stiffness." },
  { question: "Explain Kirchhoff's Voltage and Current Laws with examples.", category: "Electrical Engineering", difficulty: "easy", suggestedAnswer: "KCL: Sum of currents entering a node equals sum leaving. KVL: Sum of voltage drops around a closed loop is zero. Used in circuit analysis to find unknown currents/voltages." },
  { question: "What is the difference between AC and DC circuits?", category: "Electrical Engineering", difficulty: "easy", suggestedAnswer: "AC (Alternating Current) periodically reverses direction, used for long-distance power transmission. DC (Direct Current) flows in one direction, used in batteries and electronics." },
  { question: "Describe the working principle of a transformer.", category: "Electrical Engineering", difficulty: "medium", suggestedAnswer: "Works on Faraday's law of electromagnetic induction. Alternating current in the primary coil creates a changing magnetic field, which induces a voltage in the secondary coil to step up/down voltage." },
  { question: "What is power factor and why is it important in power systems?", category: "Electrical Engineering", difficulty: "hard", suggestedAnswer: "Power factor is the ratio of real power (kW) to apparent power (kVA). A low power factor means higher currents for the same useful power, leading to higher line losses and equipment costs." },
  { question: "Explain the difference between amplitude modulation (AM) and frequency modulation (FM).", category: "Electronics & Communication", difficulty: "medium", suggestedAnswer: "AM changes the amplitude of the carrier wave based on the signal, susceptible to noise. FM changes the frequency, providing better sound quality and noise immunity." },
  { question: "Explain OFDM and its use in modern wireless communication.", category: "Electronics & Communication", difficulty: "hard", suggestedAnswer: "Orthogonal Frequency-Division Multiplexing splits data across multiple orthogonal sub-carriers. It mitigates multi-path fading and inter-symbol interference, used in Wi-Fi and 4G/5G." },
  { question: "Explain the difference between process and thread.", category: "Computer Science", difficulty: "easy", suggestedAnswer: "A process is an executing program with its own memory space. A thread is a lightweight unit of execution within a process, sharing the same memory and resources. Context switching is faster for threads." },
  { question: "What is a binary search tree? Explain insertion and deletion.", category: "Computer Science", difficulty: "medium", suggestedAnswer: "A tree where left child < parent and right child > parent. Insertion traverses down comparing values. Deletion handles 3 cases: leaf node, 1 child (replace with child), 2 children (replace with inorder successor)." },
  { question: "Describe the OSI model and the function of each layer.", category: "Computer Science", difficulty: "medium", suggestedAnswer: "7 layers: Physical (bits), Data Link (frames/MAC), Network (packets/IP routing), Transport (segments/TCP/UDP), Session (connections), Presentation (formatting/encryption), Application (HTTP/FTP)." },
  { question: "Explain the difference between supervised, unsupervised, and reinforcement learning.", category: "Data Science & AI", difficulty: "easy", suggestedAnswer: "Supervised: labeled data (classification/regression). Unsupervised: unlabeled data (clustering/associations). Reinforcement: learning via rewards/punishments in an environment." },
  { question: "What is overfitting and how do you prevent it?", category: "Data Science & AI", difficulty: "medium", suggestedAnswer: "Overfitting occurs when a model learns training noise instead of patterns. Prevent via cross-validation, regularization (L1/L2), dropout (NNs), early stopping, and getting more data." },
  { question: "Explain the concept of material and energy balance in chemical processes.", category: "Chemical Engineering", difficulty: "medium", suggestedAnswer: "Based on conservation of mass and energy. Input + Generation = Output + Accumulation + Consumption. Crucial for designing and scaling chemical reactors and separation units." },
  { question: "Explain Bernoulli's principle and how it generates lift.", category: "Aerospace Engineering", difficulty: "medium", suggestedAnswer: "States that an increase in fluid speed occurs simultaneously with a decrease in pressure. Air travels faster over the curved top of an airfoil, creating low pressure and thus upward lift." },
  { question: "What is PCR and what are its applications in biotechnology?", category: "Biotechnology", difficulty: "medium", suggestedAnswer: "Polymerase Chain Reaction amplifies small DNA segments into millions of copies. Applications include genetic testing, forensics, disease diagnosis, and research." },

  // ════════ MEDICAL ════════
  { question: "Explain the cardiac cycle and the events associated with each phase.", category: "MBBS / General Medicine", difficulty: "medium", suggestedAnswer: "Includes atrial systole (atria contract, filling ventricles), ventricular systole (ventricles contract, pumping blood out), and complete cardiac diastole (relaxation and passive filling of all chambers)." },
  { question: "Describe the pathophysiology of Type 2 Diabetes Mellitus.", category: "MBBS / General Medicine", difficulty: "hard", suggestedAnswer: "Characterized by insulin resistance in peripheral tissues (muscle, fat) and a progressive decline in pancreatic beta-cell insulin secretion, leading to chronic hyperglycemia and subsequent complications." },
  { question: "What is the mechanism of action of beta-blockers?", category: "MBBS / General Medicine", difficulty: "medium", suggestedAnswer: "They competitively block beta-adrenergic receptors, reducing heart rate, myocardial contractility, and blood pressure. Used for hypertension, angina, and heart failure management." },
  { question: "Describe the structure and composition of tooth enamel.", category: "Dentistry (BDS)", difficulty: "easy", suggestedAnswer: "The hardest substance in the human body, highly mineralized (96% hydroxyapatite crystals), with the rest being water and organic material (enamelins). It lacks living cells and cannot regenerate." },
  { question: "Explain the concept of bioavailability and the factors affecting it.", category: "Pharmacy", difficulty: "medium", suggestedAnswer: "The fraction of an administered drug that reaches systemic circulation unchanged. Affected by route of administration, first-pass metabolism, drug solubility, and formulation characteristics." },
  { question: "What is the nursing process? Explain each step.", category: "Nursing", difficulty: "easy", suggestedAnswer: "ADPIE: Assessment (data collection), Diagnosis (identifying patient's problem), Planning (setting goals), Implementation (nursing actions), and Evaluation (assessing outcomes)." },
  { question: "Explain the physiotherapy management of a stroke patient.", category: "Physiotherapy", difficulty: "hard", suggestedAnswer: "Focuses on neuroplasticity. Includes passive/active range of motion, task-specific training, balance training, constraint-induced movement therapy (CIMT), and gait training to maximize independence." },
  { question: "Explain the working principle of an ECG machine.", category: "Biomedical Engineering", difficulty: "medium", suggestedAnswer: "Detects and amplifies the tiny electrical changes on the skin that arise from the heart muscle's electrophysiologic pattern of depolarizing and repolarizing during each heartbeat." }
];

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_interview');
    console.log('Connected. Inserting questions...');
    const inserted = await QuestionBank.insertMany(questions);
    console.log(`Successfully added ${inserted.length} engineering & medical questions!`);
  } catch (e) {
    console.error('Error seeding data:', e);
  } finally {
    mongoose.disconnect();
  }
}

seed();
