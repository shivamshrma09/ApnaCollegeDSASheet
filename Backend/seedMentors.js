const mongoose = require('mongoose');
const Mentor = require('./models/Mentor');
require('dotenv').config();

const mentors = [
  {
    name: 'Rahul Sharma',
    title: 'Senior Software Engineer at Google',
    description: 'Experienced full-stack developer with 8+ years at Google. Specialized in scalable web applications and mentoring junior developers.',
    rating: 4.9,
    sessions: 150,
    availability: 'Available',
    badge: 'Top Mentor',
    expertise: ['React', 'Node.js', 'System Design', 'JavaScript'],
    experience: '8+ years',
    isActive: true
  },
  {
    name: 'Priya Patel',
    title: 'Data Scientist at Microsoft',
    description: 'ML expert with 6 years at Microsoft. Helps professionals transition into data science and AI roles.',
    rating: 4.8,
    sessions: 120,
    availability: 'Available',
    badge: 'AI Expert',
    expertise: ['Python', 'Machine Learning', 'AI', 'Data Analysis'],
    experience: '6+ years',
    isActive: true
  },
  {
    name: 'Amit Kumar',
    title: 'Product Manager at Amazon',
    description: 'Senior PM at Amazon with 10+ years experience. Expert in product strategy and team leadership.',
    rating: 4.9,
    sessions: 200,
    availability: 'Available',
    badge: 'Product Expert',
    expertise: ['Product Strategy', 'Analytics', 'Leadership', 'Agile'],
    experience: '10+ years',
    isActive: true
  },
  {
    name: 'Sneha Gupta',
    title: 'UX Designer at Meta',
    description: 'Lead designer at Meta with expertise in user experience and design systems for mobile apps.',
    rating: 4.7,
    sessions: 90,
    availability: 'Available',
    badge: 'Design Expert',
    expertise: ['UI/UX', 'Figma', 'Design Systems', 'Mobile Design'],
    experience: '7+ years',
    isActive: true
  },
  {
    name: 'Vikash Singh',
    title: 'DevOps Engineer at Netflix',
    description: 'DevOps expert at Netflix specializing in cloud infrastructure and container orchestration.',
    rating: 4.8,
    sessions: 110,
    availability: 'Available',
    badge: 'Cloud Expert',
    expertise: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    experience: '9+ years',
    isActive: true
  },
  {
    name: 'Ananya Reddy',
    title: 'iOS Developer at Apple',
    description: 'Senior iOS developer at Apple with expertise in Swift and mobile app architecture.',
    rating: 4.9,
    sessions: 80,
    availability: 'Available',
    badge: 'Mobile Expert',
    expertise: ['Swift', 'iOS', 'Mobile Development', 'App Store'],
    experience: '8+ years',
    isActive: true
  }
];

async function seedMentors() {
  try {
    await mongoose.connect('mongodb+srv://shivamsharma27107:simplepass123@cluster0.ll4gdko.mongodb.net/neorecruiter?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');
    
    // Clear existing mentors
    await Mentor.deleteMany({});
    console.log('Cleared existing mentors');
    
    // Insert new mentors
    await Mentor.insertMany(mentors);
    console.log('✅ Mentors seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding mentors:', error);
    process.exit(1);
  }
}

seedMentors();