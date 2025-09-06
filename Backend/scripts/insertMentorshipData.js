const mongoose = require('mongoose');
const Mentorship = require('../models/Mentorship');

const mentorData = [
  // Software Engineering
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@google.com',
    title: 'Senior Software Engineer',
    company: 'Google',
    expertise: ['System Design', 'Java', 'Python', 'Microservices'],
    experience: '6+ years',
    rating: 4.9,
    price: 299,
    availability: 'Available',
    description: 'Expert in distributed systems and scalable architecture. Helped 200+ engineers crack FAANG interviews.',
    sessions: 450,
    badge: 'Top Mentor',
    category: 'Software Engineering'
  },
  {
    name: 'Priya Gupta',
    email: 'priya.gupta@microsoft.com',
    title: 'Staff Software Engineer',
    company: 'Microsoft',
    expertise: ['React', 'Node.js', 'AWS', 'Docker'],
    experience: '8+ years',
    rating: 4.8,
    price: 349,
    availability: 'Available',
    description: 'Full-stack expert specializing in cloud-native applications and modern web technologies.',
    sessions: 380,
    badge: 'Expert',
    category: 'Software Engineering'
  },
  {
    name: 'Amit Kumar',
    email: 'amit.kumar@amazon.com',
    title: 'Principal Engineer',
    company: 'Amazon',
    expertise: ['System Design', 'Golang', 'Kubernetes', 'DevOps'],
    experience: '10+ years',
    rating: 4.9,
    price: 399,
    availability: 'Available',
    description: 'Led engineering teams at Amazon. Expert in large-scale system design and cloud architecture.',
    sessions: 520,
    badge: 'Top Mentor',
    category: 'Software Engineering'
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@netflix.com',
    title: 'Senior SDE',
    company: 'Netflix',
    expertise: ['JavaScript', 'React', 'GraphQL', 'Performance'],
    experience: '5+ years',
    rating: 4.7,
    price: 279,
    availability: 'Available',
    description: 'Frontend specialist with expertise in building high-performance streaming applications.',
    sessions: 290,
    badge: 'Rising Star',
    category: 'Software Engineering'
  },

  // Data Science
  {
    name: 'Dr. Ananya Singh',
    email: 'ananya.singh@meta.com',
    title: 'Senior Data Scientist',
    company: 'Meta',
    expertise: ['Machine Learning', 'Python', 'TensorFlow', 'NLP'],
    experience: '7+ years',
    rating: 4.9,
    price: 329,
    availability: 'Available',
    description: 'PhD in ML. Built recommendation systems used by billions. Expert in deep learning and AI.',
    sessions: 410,
    badge: 'Top Mentor',
    category: 'Data Science'
  },
  {
    name: 'Vikram Reddy',
    email: 'vikram.reddy@uber.com',
    title: 'Principal Data Scientist',
    company: 'Uber',
    expertise: ['Data Engineering', 'Spark', 'SQL', 'Analytics'],
    experience: '9+ years',
    rating: 4.8,
    price: 359,
    availability: 'Available',
    description: 'Built data pipelines processing billions of rides. Expert in big data and real-time analytics.',
    sessions: 340,
    badge: 'Expert',
    category: 'Data Science'
  },
  {
    name: 'Kavya Nair',
    email: 'kavya.nair@airbnb.com',
    title: 'ML Engineer',
    company: 'Airbnb',
    expertise: ['Computer Vision', 'PyTorch', 'MLOps', 'AI'],
    experience: '5+ years',
    rating: 4.7,
    price: 299,
    availability: 'Available',
    description: 'Computer vision expert working on image recognition and search algorithms.',
    sessions: 260,
    badge: 'Rising Star',
    category: 'Data Science'
  },
  {
    name: 'Rohan Joshi',
    email: 'rohan.joshi@spotify.com',
    title: 'Senior Data Scientist',
    company: 'Spotify',
    expertise: ['Recommendation Systems', 'Statistics', 'A/B Testing', 'Python'],
    experience: '6+ years',
    rating: 4.8,
    price: 309,
    availability: 'Available',
    description: 'Built music recommendation algorithms. Expert in statistical modeling and experimentation.',
    sessions: 320,
    badge: 'Expert',
    category: 'Data Science'
  },

  // Product Management
  {
    name: 'Arjun Mehta',
    email: 'arjun.mehta@google.com',
    title: 'Senior Product Manager',
    company: 'Google',
    expertise: ['Product Strategy', 'Analytics', 'User Research', 'Roadmapping'],
    experience: '8+ years',
    rating: 4.9,
    price: 379,
    availability: 'Available',
    description: 'Led product teams for Google Search and Ads. Expert in 0-to-1 product development.',
    sessions: 450,
    badge: 'Top Mentor',
    category: 'Product Management'
  },
  {
    name: 'Meera Shah',
    email: 'meera.shah@apple.com',
    title: 'Principal PM',
    company: 'Apple',
    expertise: ['Mobile Products', 'Design Thinking', 'Market Research', 'Strategy'],
    experience: '10+ years',
    rating: 4.8,
    price: 399,
    availability: 'Available',
    description: 'Launched multiple iPhone features. Expert in consumer product strategy and design.',
    sessions: 380,
    badge: 'Expert',
    category: 'Product Management'
  },
  {
    name: 'Karan Agarwal',
    email: 'karan.agarwal@linkedin.com',
    title: 'Senior PM',
    company: 'LinkedIn',
    expertise: ['B2B Products', 'Growth', 'Metrics', 'Experimentation'],
    experience: '6+ years',
    rating: 4.7,
    price: 329,
    availability: 'Available',
    description: 'Grew LinkedIn premium subscriptions by 300%. Expert in growth product management.',
    sessions: 290,
    badge: 'Rising Star',
    category: 'Product Management'
  },
  {
    name: 'Divya Kapoor',
    email: 'divya.kapoor@slack.com',
    title: 'Product Manager',
    company: 'Slack',
    expertise: ['Enterprise Products', 'SaaS', 'Customer Success', 'Agile'],
    experience: '5+ years',
    rating: 4.8,
    price: 299,
    availability: 'Available',
    description: 'Built enterprise collaboration tools. Expert in B2B SaaS product development.',
    sessions: 240,
    badge: 'Expert',
    category: 'Product Management'
  },

  // Design
  {
    name: 'Aarti Desai',
    email: 'aarti.desai@figma.com',
    title: 'Senior UX Designer',
    company: 'Figma',
    expertise: ['UI/UX Design', 'Figma', 'Design Systems', 'Prototyping'],
    experience: '7+ years',
    rating: 4.9,
    price: 319,
    availability: 'Available',
    description: 'Built design systems used by millions. Expert in collaborative design and user experience.',
    sessions: 360,
    badge: 'Top Mentor',
    category: 'Design'
  },
  {
    name: 'Ravi Malhotra',
    email: 'ravi.malhotra@adobe.com',
    title: 'Principal Designer',
    company: 'Adobe',
    expertise: ['Visual Design', 'Branding', 'Creative Suite', 'Typography'],
    experience: '9+ years',
    rating: 4.8,
    price: 349,
    availability: 'Available',
    description: 'Led design for Adobe Creative Cloud. Expert in visual design and brand identity.',
    sessions: 320,
    badge: 'Expert',
    category: 'Design'
  },
  {
    name: 'Pooja Sharma',
    email: 'pooja.sharma@airbnb.com',
    title: 'UX Researcher',
    company: 'Airbnb',
    expertise: ['User Research', 'Usability Testing', 'Design Thinking', 'Analytics'],
    experience: '5+ years',
    rating: 4.7,
    price: 279,
    availability: 'Available',
    description: 'Conducted user research for global products. Expert in user-centered design methodology.',
    sessions: 250,
    badge: 'Rising Star',
    category: 'Design'
  },
  {
    name: 'Nikhil Gupta',
    email: 'nikhil.gupta@spotify.com',
    title: 'Product Designer',
    company: 'Spotify',
    expertise: ['Mobile Design', 'Interaction Design', 'Animation', 'Sketch'],
    experience: '6+ years',
    rating: 4.8,
    price: 299,
    availability: 'Available',
    description: 'Designed mobile experiences for music streaming. Expert in mobile-first design.',
    sessions: 280,
    badge: 'Expert',
    category: 'Design'
  },

  // Career Guidance
  {
    name: 'Sanjay Kumar',
    email: 'sanjay.kumar@consultant.com',
    title: 'Career Coach & Ex-FAANG',
    company: 'Independent',
    expertise: ['Career Planning', 'Interview Prep', 'Resume Review', 'Salary Negotiation'],
    experience: '12+ years',
    rating: 4.9,
    price: 249,
    availability: 'Available',
    description: 'Ex-Google engineering manager. Helped 1000+ professionals land FAANG jobs.',
    sessions: 800,
    badge: 'Top Mentor',
    category: 'Career Guidance'
  },
  {
    name: 'Rashmi Agarwal',
    email: 'rashmi.agarwal@coach.com',
    title: 'Tech Career Advisor',
    company: 'Independent',
    expertise: ['Career Transition', 'Skill Development', 'Personal Branding', 'Networking'],
    experience: '10+ years',
    rating: 4.8,
    price: 199,
    availability: 'Available',
    description: 'Former tech recruiter at Microsoft. Expert in career transitions and skill development.',
    sessions: 650,
    badge: 'Expert',
    category: 'Career Guidance'
  },
  {
    name: 'Manish Verma',
    email: 'manish.verma@mentor.com',
    title: 'Leadership Coach',
    company: 'Independent',
    expertise: ['Leadership', 'Team Management', 'Communication', 'Growth Strategy'],
    experience: '15+ years',
    rating: 4.9,
    price: 299,
    availability: 'Available',
    description: 'Ex-VP Engineering at Flipkart. Helps engineers transition to leadership roles.',
    sessions: 520,
    badge: 'Top Mentor',
    category: 'Career Guidance'
  },
  {
    name: 'Neha Jain',
    email: 'neha.jain@guidance.com',
    title: 'Career Strategist',
    company: 'Independent',
    expertise: ['Job Search', 'LinkedIn Optimization', 'Mock Interviews', 'Offer Negotiation'],
    experience: '8+ years',
    rating: 4.7,
    price: 179,
    availability: 'Available',
    description: 'Placement consultant with 90% success rate. Expert in job search strategies.',
    sessions: 420,
    badge: 'Rising Star',
    category: 'Career Guidance'
  }
];

async function insertMentorData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-sheet');
    console.log('Connected to MongoDB');

    // Clear existing mentor data
    await Mentorship.deleteMany({});
    console.log('Cleared existing mentor data');

    // Insert new mentor data
    const result = await Mentorship.insertMany(mentorData);
    console.log(`Inserted ${result.length} mentors successfully`);

    // Display summary by category
    const categories = ['Software Engineering', 'Data Science', 'Product Management', 'Design', 'Career Guidance'];
    for (const category of categories) {
      const count = await Mentorship.countDocuments({ category });
      console.log(`${category}: ${count} mentors`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error inserting mentor data:', error);
    process.exit(1);
  }
}

// Run the script
insertMentorData();