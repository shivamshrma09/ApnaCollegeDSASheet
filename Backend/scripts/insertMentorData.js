const mongoose = require('mongoose');
const Mentorship = require('../models/Mentorship');

const sampleMentors = [
  {
    name: 'Faraz Hussain',
    email: 'faraz@oracle.com',
    title: 'Software Engineering @ Oracle Life Sciences & AI',
    company: 'Oracle',
    description: 'Mentored 500+ Students | Certification in Java & AWS | AWS GameDay Winner | Hackathon Winner Sponsored by Microsoft Azure',
    rating: 4.9,
    experience: '5+ years',
    price: 199,
    availability: 'Available',
    expertise: ['Java', 'AWS', 'System Design', 'DSA'],
    sessions: 500,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Faraz+Hussain&background=3b82f6&color=fff&size=100'
  },
  {
    name: 'Palak Gupta',
    email: 'palak@accenture.com',
    title: 'Consulting Analyst @Accenture',
    company: 'Accenture',
    description: 'Consulting Analyst @Accenture | MBA (Gold Medalist) @IIM Indore, Ex-IBM, Michael Page, ABG | Top Icons of India, 1000+ Mentored',
    rating: 4.9,
    experience: '5+ years',
    price: 189,
    availability: 'Available',
    expertise: ['Consulting', 'MBA', 'Strategy', 'Leadership'],
    sessions: 1000,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Palak+Gupta&background=8b5cf6&color=fff&size=100'
  },
  {
    name: 'Yash Patel',
    email: 'yash@parag.com',
    title: 'Strategy Manager @ Parag Milk Foods',
    company: 'Parag Milk Foods',
    description: 'Strategy Manager @ Parag Milk Foods (MD\'s Office) | 300k+ Impressions | 32x National Case Comp Podiums | Dual MBA – MDI Gurgaon & ESCP Europe',
    rating: 4.8,
    experience: '4+ years',
    price: 149,
    availability: 'Available',
    expertise: ['Strategy', 'MBA', 'Case Studies', 'Business'],
    sessions: 300,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Yash+Patel&background=10b981&color=fff&size=100'
  },
  {
    name: 'Dhananjay Sharma',
    email: 'dhananjay@somany.com',
    title: 'Corporate Finance Manager @ Somany Impresa Group',
    company: 'Somany Impresa Group',
    description: 'Corporate Finance Manager @ Somany Impresa Group | IIM Ranchi MBA\'24 (Director\'s Merit List) | Ex-J.P. Morgan Chase & Co. Intern',
    rating: 4.9,
    experience: '6+ years',
    price: 179,
    availability: 'Available',
    expertise: ['Finance', 'MBA', 'Investment Banking', 'Corporate Strategy'],
    sessions: 250,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Dhananjay+Sharma&background=f59e0b&color=fff&size=100'
  },
  {
    name: 'Riya Shrivastava',
    email: 'riya@sbilife.com',
    title: 'Strategy - CXO\'s Office @SBI Life',
    company: 'SBI Life',
    description: 'Strategy - CXO\'s Office @SBI Life | MBA @BITSOM, Ex-Bosch, HP Tech Ventures, Cervin | Founder - Careerlyweb',
    rating: 4.8,
    experience: '4+ years',
    price: 159,
    availability: 'Available',
    expertise: ['Strategy', 'Leadership', 'Entrepreneurship', 'MBA'],
    sessions: 200,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Riya+Shrivastava&background=ef4444&color=fff&size=100'
  },
  {
    name: 'Arjun Singh',
    email: 'arjun@google.com',
    title: 'Senior Software Engineer @ Google',
    company: 'Google',
    description: 'Senior SWE at Google | Ex-Microsoft, Amazon | Competitive Programming Expert | Helped 800+ students crack FAANG interviews',
    rating: 4.9,
    experience: '7+ years',
    price: 199,
    availability: 'Available',
    expertise: ['System Design', 'DSA', 'Competitive Programming', 'FAANG Prep'],
    sessions: 800,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Singh&background=ea4335&color=fff&size=100'
  },
  {
    name: 'Priya Sharma',
    email: 'priya@microsoft.com',
    title: 'Product Manager @ Microsoft',
    company: 'Microsoft',
    description: 'Product Manager at Microsoft Azure | MBA from ISB | Ex-Flipkart, Zomato | Product Strategy & Growth Expert',
    rating: 4.8,
    experience: '6+ years',
    price: 179,
    availability: 'Available',
    expertise: ['Product Management', 'Strategy', 'Growth', 'MBA'],
    sessions: 400,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=00a1f1&color=fff&size=100'
  },
  {
    name: 'Rohit Kumar',
    email: 'rohit@amazon.com',
    title: 'Data Scientist @ Amazon',
    company: 'Amazon',
    description: 'Senior Data Scientist at Amazon | ML/AI Expert | PhD in Computer Science | Published 15+ research papers',
    rating: 4.9,
    experience: '8+ years',
    price: 199,
    availability: 'Available',
    expertise: ['Machine Learning', 'Data Science', 'AI', 'Python'],
    sessions: 350,
    badge: 'Top Mentor',
    isActive: true,
    avatar: 'https://ui-avatars.com/api/?name=Rohit+Kumar&background=ff9900&color=fff&size=100'
  }
];

async function insertMentorData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dsa-sheet');
    
    // Clear existing mentors
    await Mentorship.deleteMany({});
    
    // Insert new mentors
    await Mentorship.insertMany(sampleMentors);
    
    console.log('Mentor data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting mentor data:', error);
    process.exit(1);
  }
}

insertMentorData();