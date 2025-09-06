const nodemailer = require('nodemailer');
const User = require('../models/User');

// Ensure environment variables are loaded
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Email credentials missing in environment variables');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner. Keep coding!",
  "Every problem you solve makes you stronger. Today is your day!",
  "Consistency beats perfection. One problem at a time!",
  "Your future self will thank you for the effort you put in today!",
  "Code today, conquer tomorrow. You've got this!",
  "Progress, not perfection. Every step counts!",
  "The best time to solve problems was yesterday. The second best time is now!",
  "Data structures are the building blocks of efficient algorithms.",
  "Master the fundamentals, and complex problems become simple.",
  "Every algorithm you learn is a tool in your problem-solving arsenal.",
  "Think in terms of time and space complexity - efficiency matters.",
  "Recursion is just a function calling itself with a smaller problem.",
  "Dynamic programming: solve once, remember forever.",
  "Trees and graphs model real-world relationships beautifully.",
  "Sorting and searching are the foundation of computer science.",
  "Hash tables: O(1) access time is a programmer's best friend.",
  "Linked lists teach you the power of pointers and references.",
  "Stacks and queues: LIFO and FIFO in perfect harmony.",
  "Binary search: divide and conquer your way to the solution.",
  "Greedy algorithms: sometimes the obvious choice is the right one.",
  "Graph traversal: BFS for shortest path, DFS for exploration.",
  "Heaps: priority queues that keep your data organized.",
  "Tries: efficient string processing made simple.",
  "Segment trees: range queries in logarithmic time.",
  "Union-Find: connecting components with elegant simplicity.",
  "Sliding window: optimize your array processing.",
  "Two pointers: meet in the middle for efficient solutions.",
  "Backtracking: explore all possibilities systematically.",
  "Bit manipulation: think in binary for optimal solutions.",
  "String algorithms: pattern matching and text processing mastery.",
  "Mathematical algorithms: number theory meets programming.",
  "Geometry algorithms: computational solutions to spatial problems.",
  "Network flow: model capacity and optimization problems.",
  "Advanced data structures: persistent, functional, and concurrent.",
  "Algorithm analysis: prove correctness and measure efficiency.",
  "Competitive programming: speed and accuracy under pressure.",
  "System design: scale your algorithms to handle millions.",
  "Code optimization: make every cycle count.",
  "Debugging skills: find the needle in the haystack.",
  "Clean code: write for humans, optimize for machines.",
  "Test-driven development: verify your algorithms work correctly.",
  "Version control: track your algorithmic journey.",
  "Documentation: explain your thought process clearly.",
  "Code reviews: learn from others' algorithmic approaches.",
  "Continuous learning: algorithms evolve, so should you.",
  "Problem decomposition: break complex problems into simple parts.",
  "Pattern recognition: see the algorithm behind the problem.",
  "Edge case handling: robust algorithms handle all inputs.",
  "Memory management: efficient use of space is crucial.",
  "Parallel algorithms: harness the power of multiple cores.",
  "Cache-friendly algorithms: work with hardware, not against it.",
  "Real-world applications: algorithms solve actual problems.",
  "Interview preparation: practice makes perfect.",
  "Open source contribution: share your algorithmic knowledge.",
  "Teaching others: the best way to solidify your understanding.",
  "Algorithmic thinking: approach problems systematically.",
  "Complexity theory: understand the limits of computation.",
  "Approximation algorithms: sometimes good enough is perfect.",
  "Randomized algorithms: embrace controlled chaos.",
  "Quantum algorithms: prepare for the future of computing.",
  "Machine learning algorithms: data-driven decision making.",
  "Cryptographic algorithms: secure communication through math.",
  "Compression algorithms: store more with less space.",
  "Search algorithms: find what you're looking for efficiently.",
  "Optimization algorithms: find the best solution possible.",
  "Simulation algorithms: model complex systems digitally.",
  "Parsing algorithms: understand structured data.",
  "Scheduling algorithms: manage resources effectively.",
  "Routing algorithms: find the best path through networks.",
  "Load balancing algorithms: distribute work evenly.",
  "Caching algorithms: speed up repeated operations.",
  "Synchronization algorithms: coordinate concurrent processes.",
  "Consensus algorithms: agree in distributed systems.",
  "Fault tolerance algorithms: handle failures gracefully.",
  "Security algorithms: protect against malicious attacks.",
  "Performance algorithms: measure and improve efficiency.",
  "Scalability algorithms: grow with increasing demands.",
  "Maintainability algorithms: write code that lasts.",
  "Portability algorithms: work across different platforms.",
  "Usability algorithms: create intuitive user experiences.",
  "Accessibility algorithms: include everyone in technology.",
  "Sustainability algorithms: compute responsibly.",
  "Innovation algorithms: create something new and valuable.",
  "Collaboration algorithms: work effectively in teams.",
  "Communication algorithms: explain technical concepts clearly.",
  "Leadership algorithms: guide others in technical decisions.",
  "Mentorship algorithms: help others grow their skills.",
  "Career algorithms: plan your professional development.",
  "Life algorithms: apply systematic thinking everywhere.",
  "Wisdom algorithms: learn from experience and mistakes.",
  "Growth algorithms: continuously improve your abilities.",
  "Impact algorithms: use technology to make a difference.",
  "Legacy algorithms: build something that outlasts you.",
  "Excellence algorithms: strive for quality in everything.",
  "Passion algorithms: love what you do and do what you love.",
  "Purpose algorithms: find meaning in your technical work.",
  "Balance algorithms: maintain harmony between work and life.",
  "Resilience algorithms: bounce back from setbacks stronger.",
  "Adaptability algorithms: thrive in changing environments.",
  "Curiosity algorithms: never stop asking why and how.",
  "Creativity algorithms: think outside the conventional box.",
  "Persistence algorithms: keep going when others give up.",
  "Humility algorithms: stay humble despite your achievements.",
  "Gratitude algorithms: appreciate the journey and the destination.",
  "Mindfulness algorithms: be present in your coding practice.",
  "Empathy algorithms: understand users' needs and pain points.",
  "Integrity algorithms: do the right thing even when no one's watching.",
  "Courage algorithms: take calculated risks for greater rewards."
];

const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

const getDueSpacedRepetitionProblems = (user, sheetType = 'apnaCollege') => {
  const sheetData = user.sheetProgress?.[sheetType] || {};
  const spacedRepetition = sheetData.spacedRepetition || [];
  const now = new Date();
  
  return spacedRepetition.filter(sr => new Date(sr.nextReviewDate) <= now);
};

const getCustomSpacedRepetitionDue = (user, sheetType = 'apnaCollege') => {
  const sheetData = user.sheetProgress?.[sheetType] || {};
  const customSR = sheetData.customSpacedRepetition || {};
  
  let dueProblems = [];
  
  // Today's problems are always due
  if (customSR.today) {
    dueProblems = [...dueProblems, ...customSR.today.map(p => ({...p, dueType: 'today'}))]; 
  }
  
  // Tomorrow problems (need review)
  if (customSR.tomorrow) {
    dueProblems = [...dueProblems, ...customSR.tomorrow.map(p => ({...p, dueType: 'tomorrow'}))];
  }
  
  // Day3 problems (need review)
  if (customSR.day3) {
    dueProblems = [...dueProblems, ...customSR.day3.map(p => ({...p, dueType: 'day3'}))];
  }
  
  // Week1 problems (need review)
  if (customSR.week1) {
    dueProblems = [...dueProblems, ...customSR.week1.map(p => ({...p, dueType: 'week1'}))];
  }
  
  // Week2 problems (need review)
  if (customSR.week2) {
    dueProblems = [...dueProblems, ...customSR.week2.map(p => ({...p, dueType: 'week2'}))];
  }
  
  // Month1 problems (need review)
  if (customSR.month1) {
    dueProblems = [...dueProblems, ...customSR.month1.map(p => ({...p, dueType: 'month1'}))];
  }
  
  return dueProblems;
};

const getForgettingCurveDueProblems = (user, sheetType = 'apnaCollege') => {
  const sheetData = user.sheetProgress?.[sheetType] || {};
  const forgettingCurve = sheetData.forgettingCurve || {};
  
  let dueProblems = [];
  const now = new Date();
  
  // Today's problems
  dueProblems = [...dueProblems, ...(forgettingCurve.today || [])];
  
  // Day1 problems (due after 1 day)
  (forgettingCurve.day1 || []).forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 1) dueProblems.push(item);
  });
  
  // Day3 problems (due after 3 days)
  (forgettingCurve.day3 || []).forEach(item => {
    const daysPassed = (now - new Date(item.addedDate)) / (1000 * 60 * 60 * 24);
    if (daysPassed >= 3) dueProblems.push(item);
  });
  
  return dueProblems;
};

const getWeeklyProgress = (user, sheetType = 'apnaCollege') => {
  const sheetData = user.sheetProgress?.[sheetType] || {};
  const completedProblems = sheetData.completedProblems || [];
  
  // Calculate problems solved this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  // For simplicity, we'll use total completed as weekly progress
  // In real implementation, you'd track completion dates
  return {
    weeklyTarget: user.goals?.weekly?.target || 20,
    weeklySolved: Math.min(completedProblems.length, user.goals?.weekly?.target || 20),
    totalSolved: completedProblems.length
  };
};

const generateDailyEmailHTML = (user, sheetType = 'apnaCollege') => {
  const sheetData = user.sheetProgress?.[sheetType] || {};
  const dailyGoal = user.goals?.daily?.target || 3;
  const dailyProgress = user.goals?.daily?.current || 0;
  const weeklyProgress = getWeeklyProgress(user, sheetType);
  const spacedRepDue = getDueSpacedRepetitionProblems(user, sheetType);
  const customSpacedRepDue = getCustomSpacedRepetitionDue(user, sheetType);
  const forgettingCurveDue = getForgettingCurveDueProblems(user, sheetType);
  const quote = getRandomQuote();
  
  const progressPercentage = Math.round((dailyProgress / dailyGoal) * 100);
  const weeklyPercentage = Math.round((weeklyProgress.weeklySolved / weeklyProgress.weeklyTarget) * 100);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; line-height: 1.6; }
        .container { max-width: 700px; margin: 0 auto; padding: 20px; }
        h1 { color: #2563eb; text-align: center; margin-bottom: 10px; }
        h2 { color: #1f2937; border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-top: 25px; }
        .header-info { text-align: center; color: #666; margin-bottom: 20px; }
        .score { font-size: 28px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
        .param { margin: 8px 0; }
        .param-name { color: #333; font-size: 14px; }
        .param-score { color: #2563eb; font-weight: bold; }
        .strength { color: #059669; margin: 5px 0; }
        .improvement { color: #dc2626; margin: 5px 0; }
        .section { margin: 15px 0; padding: 15px; border-left: 3px solid #2563eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://raw.githubusercontent.com/shivamshrma09/ApnaCollegeDSASheet/main/frontend/public/light.png" alt="+DSA Logo" style="width: 120px; height: auto; margin-bottom: 10px;" />
        </div>
        <h1>Good Morning, ${user.name}!</h1>
        <div class="header-info">
          <strong>Your Daily DSA Progress Roundup</strong><br>
          <small>Generated on ${new Date().toLocaleDateString()}</small>
        </div>
        
        <div class="section">
          <h2>Motivational Quote</h2>
          <p style="color: #555; font-style: italic; text-align: center; font-size: 16px;">${quote}</p>
        </div>

        <div class="section">
          <h2>Today's Progress</h2>
          <div class="param">
            <span class="param-name">Daily Goal:</span> 
            <span class="param-score">${dailyGoal} problems</span>
          </div>
          <div class="param">
            <span class="param-name">Completed:</span> 
            <span class="param-score">${dailyProgress}/${dailyGoal} (${progressPercentage}%)</span>
          </div>
        </div>

        <div class="section">
          <h2>Weekly Progress</h2>
          <div class="param">
            <span class="param-name">Weekly Target:</span> 
            <span class="param-score">${weeklyProgress.weeklyTarget} problems</span>
          </div>
          <div class="param">
            <span class="param-name">Solved:</span> 
            <span class="param-score">${weeklyProgress.weeklySolved}/${weeklyProgress.weeklyTarget} (${weeklyPercentage}%)</span>
          </div>
        </div>

        ${spacedRepDue.length > 0 ? `
        <div class="section">
          <h2>Spaced Repetition Due (SM-2 Algorithm)</h2>
          <p style="color: #555;">Time to review these problems:</p>
          ${spacedRepDue.slice(0, 10).map(sr => `<div class="strength">• Problem ${sr.problemId}</div>`).join('')}
          ${spacedRepDue.length > 10 ? `<p style="color: #666;">+${spacedRepDue.length - 10} more problems due for review</p>` : ''}
        </div>
        ` : ''}

        ${customSpacedRepDue.length > 0 ? `
        <div class="section">
          <h2>Custom Spaced Repetition Due</h2>
          <p style="color: #555;">Problems in your custom spaced repetition system:</p>
          ${customSpacedRepDue.slice(0, 15).map(csr => `<div class="improvement">• Problem ${csr.problemId} (${csr.dueType.toUpperCase()})</div>`).join('')}
          ${customSpacedRepDue.length > 15 ? `<p style="color: #666;">+${customSpacedRepDue.length - 15} more problems in custom system</p>` : ''}
        </div>
        ` : ''}

        ${forgettingCurveDue.length > 0 ? `
        <div class="section">
          <h2>Memory Review Due</h2>
          <p style="color: #555;">Don't let these slip from memory:</p>
          ${forgettingCurveDue.slice(0, 10).map(fc => `<div class="improvement">• Problem ${fc.problemId}</div>`).join('')}
          ${forgettingCurveDue.length > 10 ? `<p style="color: #666;">+${forgettingCurveDue.length - 10} more problems need memory review</p>` : ''}
        </div>
        ` : ''}

        <p style="text-align: center; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 15px;">+DSA</p>
      </div>
    </body>
    </html>
  `;
};

const sendDailyMorningEmail = async (user, sheetType = 'apnaCollege') => {
  try {
    const emailHTML = generateDailyEmailHTML(user, sheetType);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `🌅 Good Morning ${user.name}! Your Daily DSA Roundup`,
      html: emailHTML
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Daily morning email sent to ${user.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send daily email to ${user.email}:`, error);
    return false;
  }
};

const sendDailyMorningEmailsToAllUsers = async () => {
  try {
    const users = await User.find({});

    console.log(`📧 Sending daily morning emails to ${users.length} users...`);
    
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      const success = await sendDailyMorningEmail(user);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log(`🎉 Daily morning emails completed: ${successCount} sent, ${failCount} failed`);
    return { successCount, failCount };
  } catch (error) {
    console.error('❌ Daily morning email service failed:', error);
    return { successCount: 0, failCount: 0 };
  }
};

module.exports = {
  sendDailyMorningEmail,
  sendDailyMorningEmailsToAllUsers,
  generateDailyEmailHTML
};