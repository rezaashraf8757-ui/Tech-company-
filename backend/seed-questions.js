/**
 * SEED SCRIPT — Question Bank
 * ============================
 * Run: node seed-questions.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const QuestionBank = require('./models/QuestionBank');

const questions = [

  // ════════════════════════════════════════════════
  //   SOFTWARE DEVELOPER — EASY
  // ════════════════════════════════════════════════
  {
    question: "What is the difference between == and === in JavaScript?",
    category: "Software Developer", difficulty: "easy", topic: "JavaScript",
    suggestedAnswer: "'==' checks only value (type coercion hoti hai), '===' checks both value and type. Example: '5' == 5 is true lekin '5' === 5 is false. Always use === for reliable comparisons."
  },
  {
    question: "What is HTML and what are semantic HTML elements? Give examples.",
    category: "Software Developer", difficulty: "easy", topic: "HTML",
    suggestedAnswer: "HTML is the structure language of web pages. Semantic elements clearly describe their meaning: <header>, <footer>, <nav>, <article>, <section>, <main>. They improve accessibility and SEO."
  },
  {
    question: "What is the difference between let, var, and const in JavaScript?",
    category: "Software Developer", difficulty: "easy", topic: "JavaScript",
    suggestedAnswer: "'var' is function-scoped and hoisted. 'let' is block-scoped, can be reassigned. 'const' is block-scoped and cannot be reassigned (but object properties can still change). Prefer const > let > var."
  },
  {
    question: "What is CSS Box Model? Explain its components.",
    category: "Software Developer", difficulty: "easy", topic: "CSS",
    suggestedAnswer: "Every HTML element is a box with: Content (actual content), Padding (space inside border), Border (surrounds padding), Margin (space outside border). Total width = content + padding + border + margin."
  },
  {
    question: "What is Git? What is the difference between git pull and git fetch?",
    category: "Software Developer", difficulty: "easy", topic: "Version Control",
    suggestedAnswer: "Git is a distributed version control system. 'git fetch' downloads changes from remote but doesn't merge. 'git pull' fetches AND merges changes into current branch. Fetch is safer to check changes first."
  },
  {
    question: "What are data types in JavaScript?",
    category: "Software Developer", difficulty: "easy", topic: "JavaScript",
    suggestedAnswer: "Primitive: string, number, boolean, null, undefined, symbol, bigint. Non-primitive: object (including arrays and functions). typeof operator se type check kar sakte hain."
  },
  {
    question: "What is the difference between an array and a linked list?",
    category: "Software Developer", difficulty: "easy", topic: "Data Structures",
    suggestedAnswer: "Array: fixed size, contiguous memory, O(1) access by index, O(n) insert/delete. Linked List: dynamic size, non-contiguous memory, O(n) access, O(1) insert/delete at head. Arrays are cache-friendly."
  },

  // ════════════════════════════════════════════════
  //   SOFTWARE DEVELOPER — MEDIUM
  // ════════════════════════════════════════════════
  {
    question: "Explain the concept of closures in JavaScript with an example.",
    category: "Software Developer", difficulty: "medium", topic: "JavaScript",
    suggestedAnswer: "A closure is a function that remembers variables from its outer scope even after the outer function has returned. Example: function counter() { let count = 0; return function() { return ++count; }; } — the inner function 'closes over' the count variable."
  },
  {
    question: "What is the difference between REST and GraphQL APIs?",
    category: "Software Developer", difficulty: "medium", topic: "API Design",
    suggestedAnswer: "REST uses multiple endpoints, returns fixed data shapes, can over-fetch/under-fetch. GraphQL uses a single endpoint, client specifies exactly what data it needs, eliminates over/under-fetching. GraphQL is more flexible but adds complexity."
  },
  {
    question: "What is event loop in JavaScript? How does async/await work?",
    category: "Software Developer", difficulty: "medium", topic: "JavaScript",
    suggestedAnswer: "Event loop manages execution of synchronous and async code. Call stack runs sync code; Web APIs handle async tasks (setTimeout, fetch); Callback queue holds completed tasks; Event loop moves them to call stack when it's empty. async/await is syntactic sugar over Promises, making async code look synchronous."
  },
  {
    question: "Explain the SOLID principles in object-oriented programming.",
    category: "Software Developer", difficulty: "medium", topic: "OOP",
    suggestedAnswer: "S - Single Responsibility: one class, one job. O - Open/Closed: open for extension, closed for modification. L - Liskov Substitution: subclasses should replace parent classes. I - Interface Segregation: small focused interfaces. D - Dependency Inversion: depend on abstractions, not concretions."
  },
  {
    question: "What is the difference between SQL and NoSQL databases? When to use which?",
    category: "Software Developer", difficulty: "medium", topic: "Databases",
    suggestedAnswer: "SQL: relational, structured schema, ACID compliance, joins, great for financial/transactional data. NoSQL (MongoDB, Redis): flexible schema, horizontal scaling, great for unstructured data, real-time apps. Use SQL for complex queries/relations, NoSQL for scale and flexibility."
  },
  {
    question: "What are React hooks? Explain useState, useEffect, and useContext.",
    category: "Software Developer", difficulty: "medium", topic: "React",
    suggestedAnswer: "Hooks add state and lifecycle to functional components. useState: manages local state. useEffect: side effects after render (API calls, subscriptions, DOM updates) with cleanup. useContext: access context values without prop drilling. Rules: only call at top level, only in React functions."
  },
  {
    question: "What is memoization? How does it improve performance?",
    category: "Software Developer", difficulty: "medium", topic: "Performance",
    suggestedAnswer: "Memoization caches function results for given inputs. If same inputs come again, returns cached result instead of recomputing. In React: React.memo for components, useMemo for values, useCallback for functions. Useful for expensive calculations."
  },
  {
    question: "Explain the concept of promises in JavaScript.",
    category: "Software Developer", difficulty: "medium", topic: "JavaScript",
    suggestedAnswer: "A Promise represents a future value (pending, fulfilled, rejected). Created with new Promise(resolve, reject). Chained with .then() for success, .catch() for errors, .finally() always runs. Promise.all() runs multiple in parallel, Promise.race() returns first to resolve."
  },
  {
    question: "What is middleware in Express.js? Give examples.",
    category: "Software Developer", difficulty: "medium", topic: "Node.js",
    suggestedAnswer: "Middleware are functions that execute during request-response cycle. They have access to req, res, and next(). Examples: express.json() for parsing body, cors() for cross-origin, authentication middleware, error handlers. They can modify request, send response, or pass to next middleware."
  },

  // ════════════════════════════════════════════════
  //   SOFTWARE DEVELOPER — HARD
  // ════════════════════════════════════════════════
  {
    question: "Design a URL shortener system like bit.ly. What components would you include?",
    category: "Software Developer", difficulty: "hard", topic: "System Design",
    suggestedAnswer: "Components: API Gateway, App Servers, Hash generation (base62, 6-7 chars), Database (original URL + short code), Cache (Redis for popular URLs), Load Balancer, CDN. Considerations: collision handling, custom aliases, expiry, analytics, ~100:1 read:write ratio, partition by hash."
  },
  {
    question: "What are design patterns? Explain Singleton, Observer, and Factory patterns.",
    category: "Software Developer", difficulty: "hard", topic: "Design Patterns",
    suggestedAnswer: "Singleton: ensures only one instance of a class exists (DB connection pool). Observer: objects subscribe to events of another object (event listeners, Redux). Factory: creates objects without specifying exact class (React.createElement). They solve common design problems in reusable, proven ways."
  },
  {
    question: "Explain memory management in JavaScript. What is garbage collection?",
    category: "Software Developer", difficulty: "hard", topic: "JavaScript",
    suggestedAnswer: "JS automatically allocates and frees memory. Garbage collector (mark-and-sweep algorithm) finds unreachable objects and frees their memory. Common memory leaks: global variables, forgotten event listeners, closures holding references, detached DOM nodes. Use WeakMap/WeakRef for weak references."
  },
  {
    question: "What is the difference between authentication and authorization? How would you implement JWT auth?",
    category: "Software Developer", difficulty: "hard", topic: "Security",
    suggestedAnswer: "Authentication: verifying who you are (login). Authorization: what you're allowed to do (permissions). JWT: server creates token (header.payload.signature) signed with secret. Client stores it, sends in Authorization header. Server verifies signature. Stateless. Refresh tokens for longer sessions. Store in httpOnly cookies, not localStorage."
  },
  {
    question: "Explain database indexing. What are the trade-offs of adding too many indexes?",
    category: "Software Developer", difficulty: "hard", topic: "Databases",
    suggestedAnswer: "Indexes create separate data structures (B-tree, Hash) for faster lookups. Speed up SELECT dramatically, especially on WHERE, JOIN, ORDER BY columns. Trade-offs: slow down INSERT/UPDATE/DELETE (index must be updated), consume extra disk space, too many indexes confuse query optimizer. Index only frequently queried columns."
  },
  {
    question: "What is Docker and containerization? How is it different from a virtual machine?",
    category: "Software Developer", difficulty: "hard", topic: "DevOps",
    suggestedAnswer: "Docker packages app with its dependencies into a container. VMs include full OS (heavy, slow to start, GB in size). Containers share host OS kernel (lightweight, fast, MB in size). Docker: Dockerfile defines image, container is running instance, docker-compose for multi-container apps. Ensures 'works on my machine' problem is solved."
  },

  // ════════════════════════════════════════════════
  //   HR ROUND — EASY
  // ════════════════════════════════════════════════
  {
    question: "Tell me about yourself and your background.",
    category: "HR Round", difficulty: "easy", topic: "Introduction",
    suggestedAnswer: "Use Present-Past-Future formula: Start with current role/education, mention 1-2 key achievements, then past experience that's relevant, end with why you're excited about this role. Keep it under 2 minutes. Be confident and engaging — it's your elevator pitch."
  },
  {
    question: "Why are you looking for a new job / why do you want to leave your current position?",
    category: "HR Round", difficulty: "easy", topic: "Career Goals",
    suggestedAnswer: "Stay positive — never badmouth previous employer. Focus on growth: 'I've learned a lot there, but I'm looking for new challenges / bigger scope / opportunity to work on X technology / better alignment with my long-term goals.' Show you're moving towards something, not just running away."
  },
  {
    question: "What are your salary expectations?",
    category: "HR Round", difficulty: "easy", topic: "Compensation",
    suggestedAnswer: "Research market rates first (Glassdoor, LinkedIn, Naukri). Give a range, not a single number. 'Based on my research and experience, I'm looking for X to Y. I'm open to discussing the complete package.' Don't undersell yourself but be realistic. It's okay to ask what the budgeted range is."
  },
  {
    question: "What are your greatest strengths? Give an example.",
    category: "HR Round", difficulty: "easy", topic: "Self Assessment",
    suggestedAnswer: "Pick 2-3 strengths relevant to the job. For each, give a specific example (STAR: Situation, Task, Action, Result). Example: 'Problem solving — when our API was crashing in production, I traced it to a memory leak and fixed it within 2 hours, preventing customer impact.' Avoid generic answers."
  },
  {
    question: "What is your biggest weakness? How are you working on it?",
    category: "HR Round", difficulty: "easy", topic: "Self Assessment",
    suggestedAnswer: "Be genuine — don't say 'I work too hard.' Pick a real weakness that won't disqualify you, show self-awareness, and crucially — explain what you're doing to improve. Example: 'I used to struggle with public speaking, so I joined a Toastmasters club and now present in team meetings regularly.'"
  },
  {
    question: "Why should we hire you over other candidates?",
    category: "HR Round", difficulty: "easy", topic: "Value Proposition",
    suggestedAnswer: "Connect your unique combination of skills to their specific needs. 'I bring X years of experience in [specific tech], I've solved problems exactly like the ones in this role [example], and I'm highly motivated to contribute to [company goal]. I'll be productive from day one.'"
  },

  // ════════════════════════════════════════════════
  //   HR ROUND — MEDIUM
  // ════════════════════════════════════════════════
  {
    question: "Tell me about a time you failed at something. What did you learn?",
    category: "HR Round", difficulty: "medium", topic: "Behavioral",
    suggestedAnswer: "Use STAR method. Choose a real failure (not trivial), be honest about your role in it, focus most of your answer on what you learned and how you applied that learning. Shows maturity, self-awareness, and growth mindset. Hiring managers know everyone fails — they want to see how you respond."
  },
  {
    question: "Describe a situation where you had to work under pressure with tight deadlines.",
    category: "HR Round", difficulty: "medium", topic: "Behavioral",
    suggestedAnswer: "Use STAR. Describe the stakes and timeline, what steps you took (broke task down, prioritized, communicated proactively, focused on what mattered most), and the outcome. Show you stay calm, strategic, and effective under pressure. Avoid saying you just 'worked harder.'"
  },
  {
    question: "How do you handle feedback and criticism from your manager?",
    category: "HR Round", difficulty: "medium", topic: "Professionalism",
    suggestedAnswer: "Show you welcome feedback. 'I see feedback as a gift — it's data to improve. I listen actively without getting defensive, ask clarifying questions to fully understand, then create an action plan. I also proactively seek feedback, not just wait for annual reviews.' Give an example if possible."
  },
  {
    question: "Tell me about a time you had a conflict with a coworker. How did you resolve it?",
    category: "HR Round", difficulty: "medium", topic: "Behavioral",
    suggestedAnswer: "Choose a professional conflict (not personal). Use STAR. Show you addressed it directly (not avoiding), listened to their perspective, found common ground, focused on the work outcome. Example: disagreement on technical approach — explain how you discussed pros/cons objectively and reached a decision together."
  },
  {
    question: "Where do you see yourself in 5 years?",
    category: "HR Round", difficulty: "medium", topic: "Career Goals",
    suggestedAnswer: "Show ambition aligned with company's growth. 'I see myself having grown into a senior/lead role, taking on more ownership and possibly mentoring others. I want to deepen my expertise in [relevant area] and contribute to bigger, more impactful projects.' Make it realistic and connected to the role."
  },
  {
    question: "How do you stay updated with the latest trends in technology?",
    category: "HR Round", difficulty: "medium", topic: "Learning",
    suggestedAnswer: "Mention specific, genuine sources: newsletters (JavaScript Weekly, TLDR), YouTube channels, podcasts, online courses (Udemy, Coursera), GitHub trending, Twitter/X tech community, hackathons, building side projects. Show genuine curiosity and proactive learning — not just 'I read articles.'"
  },

  // ════════════════════════════════════════════════
  //   MANAGERIAL ROUND — MEDIUM
  // ════════════════════════════════════════════════
  {
    question: "How do you prioritize tasks when everything seems urgent?",
    category: "Managerial Round", difficulty: "medium", topic: "Time Management",
    suggestedAnswer: "Use Eisenhower Matrix (Urgent/Important grid). First: urgent + important (do now). Second: important but not urgent (schedule). Third: urgent but not important (delegate). Fourth: neither (eliminate). Also: align with stakeholders on actual priorities, batch similar tasks, block focused work time. Tools: Jira, Trello, Notion."
  },
  {
    question: "Describe your leadership style. Can you give an example?",
    category: "Managerial Round", difficulty: "medium", topic: "Leadership",
    suggestedAnswer: "Name your style (servant, democratic, transformational) but show flexibility. Example: 'I'm primarily a servant leader — I remove blockers for my team and invest in their growth. But I adapt — with a new team I give more direction, with experienced members I give more autonomy. Example: [specific situation showing impact].'"
  },
  {
    question: "How do you make decisions when you don't have all the information?",
    category: "Managerial Round", difficulty: "medium", topic: "Decision Making",
    suggestedAnswer: "Acknowledge uncertainty directly. Process: gather what data is available quickly, consult key stakeholders, use frameworks (pros/cons, first principles, reversibility), set a decision deadline (avoid analysis paralysis), make the best call, then monitor and adjust. 'I'd rather make a good decision now than a perfect decision too late.'"
  },
  {
    question: "How do you ensure your team meets deadlines without burnout?",
    category: "Managerial Round", difficulty: "medium", topic: "Team Management",
    suggestedAnswer: "Prevention: realistic estimation with buffer, clear scope definition, early risk identification. During: daily standups to catch blockers early, shield team from unplanned work, escalate scope creep quickly. Recognition: celebrate wins, encourage time off after intense sprints. Sustainable pace is better than sprinting constantly."
  },

  // ════════════════════════════════════════════════
  //   MANAGERIAL ROUND — HARD
  // ════════════════════════════════════════════════
  {
    question: "How would you handle a high-performing employee who has a negative attitude affecting the team?",
    category: "Managerial Round", difficulty: "hard", topic: "Team Management",
    suggestedAnswer: "Step 1: Private conversation — be direct and specific about the behavior and its impact (not personality). Step 2: Listen to their perspective — there may be an underlying issue (burnout, feeling undervalued). Step 3: Set clear expectations and agree on behavior changes. Step 4: Monitor with support. Step 5: If no improvement, escalate with HR. Performance and culture both matter."
  },
  {
    question: "Tell me about a project that failed. What would you do differently?",
    category: "Managerial Round", difficulty: "hard", topic: "Project Management",
    suggestedAnswer: "Be honest and specific. Structure: what was the project, what went wrong (scope creep, poor communication, technical debt, unrealistic timeline), what was the impact, what you learned, and specifically what you'd do differently. Shows accountability and learning. Avoid blaming others — focus on what you could have done better."
  },
  {
    question: "How do you manage stakeholders who have conflicting priorities?",
    category: "Managerial Round", difficulty: "hard", topic: "Stakeholder Management",
    suggestedAnswer: "Approach: Map stakeholders by influence and interest. Get all parties in the same room to surface the conflict openly. Tie decisions back to shared company goals (not individual preferences). Facilitate trade-off conversations with data. When consensus isn't possible, escalate to the right decision-maker. Document decisions and rationale."
  },
  {
    question: "How do you foster innovation within your team?",
    category: "Managerial Round", difficulty: "hard", topic: "Leadership",
    suggestedAnswer: "Create psychological safety — people innovate when they feel safe to fail. Dedicate time: 20% time, hackathons, innovation sprints. Celebrate experiments, not just successes. Bring in external perspectives. Ask 'what if' questions in retrospectives. Remove bureaucracy that slows ideas. Recognize and reward creative thinking."
  },

  // ════════════════════════════════════════════════
  //   GENERAL
  // ════════════════════════════════════════════════
  {
    question: "What do you know about our company and why do you want to work here specifically?",
    category: "General", difficulty: "easy", topic: "Company Research",
    suggestedAnswer: "Always research before the interview: company's products/services, mission, recent news, competitors, culture (Glassdoor), tech stack. In answer: mention specific things that genuinely interest you — not generic 'great company.' Connect their mission to your personal values. Shows preparation and genuine interest."
  },
  {
    question: "Do you prefer working alone or in a team? Why?",
    category: "General", difficulty: "easy", topic: "Work Style",
    suggestedAnswer: "Show you're adaptable — not 'I only like one.' 'I enjoy both — deep focus work is important for complex problems (alone), but collaboration brings better ideas and shared ownership (team). I've found the best results come from doing focused solo work then bringing it to the team for review and iteration.'"
  },
  {
    question: "What does good code mean to you?",
    category: "General", difficulty: "medium", topic: "Engineering Values",
    suggestedAnswer: "Good code is: readable (another developer can understand it without explanation), maintainable (easy to change later), testable (can be unit tested), efficient (appropriate performance for the use case), and documented where needed. It solves the right problem — the best code is sometimes code you don't have to write."
  },
  {
    question: "How do you approach learning a new technology or framework quickly?",
    category: "General", difficulty: "medium", topic: "Learning",
    suggestedAnswer: "My approach: (1) Read official docs, not blog posts — primary source is most accurate. (2) Build something small and real — project-based learning sticks. (3) Read source code of examples and open-source projects. (4) Teach someone else or write about it — solidifies understanding. (5) Don't try to learn everything — learn enough to be effective, go deeper as needed."
  },
  {
    question: "Do you have any questions for us?",
    category: "General", difficulty: "easy", topic: "Closing",
    suggestedAnswer: "ALWAYS ask questions — it shows engagement. Good questions: 'What does success look like in this role in the first 90 days?', 'What are the biggest technical challenges the team is facing?', 'How does the team handle technical debt?', 'What does the engineering culture look like?', 'What are the growth opportunities here?' Avoid asking about salary/vacation at this stage."
  }

];

// ─── Run seed ─────────────────────────────────────────────────────────────
async function seedQuestions() {
  try {
    console.log('\n🔗 MongoDB se connect ho raha hoon...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart_interview');
    console.log('✅ Connected!\n');

    const existing = await QuestionBank.countDocuments();
    console.log(`📊 Pehle se ${existing} questions database mein hain`);

    if (existing > 0) {
      const readline = require('readline').createInterface({ input: process.stdin, output: process.stdout });
      await new Promise(resolve => {
        readline.question(`⚠️  ${existing} questions already hain. Naye add karne hain? (y/n): `, ans => {
          readline.close();
          if (ans.toLowerCase() !== 'y') {
            console.log('❌ Cancelled.');
            process.exit(0);
          }
          resolve();
        });
      });
    }

    console.log(`\n⏳ ${questions.length} questions add ho rahe hain...`);
    const inserted = await QuestionBank.insertMany(questions);
    console.log(`\n✅ ${inserted.length} questions successfully add ho gaye!\n`);

    // Category breakdown
    const stats = await QuestionBank.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: { category: '$category', difficulty: '$difficulty' }, count: { $sum: 1 } } },
      { $sort: { '_id.category': 1, '_id.difficulty': 1 } }
    ]);

    console.log('📋 ─────── Category wise breakdown ───────');
    const grouped = {};
    stats.forEach(s => {
      if (!grouped[s._id.category]) grouped[s._id.category] = {};
      grouped[s._id.category][s._id.difficulty] = s.count;
    });
    Object.entries(grouped).forEach(([cat, diffs]) => {
      const easy = diffs.easy || 0;
      const medium = diffs.medium || 0;
      const hard = diffs.hard || 0;
      console.log(`  📁 ${cat}`);
      console.log(`     Easy: ${easy}  |  Medium: ${medium}  |  Hard: ${hard}  |  Total: ${easy+medium+hard}`);
    });

    const total = await QuestionBank.countDocuments({ isActive: true });
    console.log(`\n📦 Total questions in DB: ${total}`);
    console.log('🎉 Seed complete!\n');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
  }
}

seedQuestions();
