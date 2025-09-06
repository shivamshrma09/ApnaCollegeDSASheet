const mongoose = require('mongoose');
const Mentorship = require('../models/Mentorship');

const additionalMentors = [
  // Software Engineering - 3 more
  {
    name: 'Aditya Verma',
    email: 'aditya.verma@tesla.com',
    title: 'Staff Software Engineer',
    company: 'Tesla',
    expertise: ['Embedded Systems', 'C++', 'Real-time Systems', 'Automotive'],
    experience: '9+ years',
    rating: 4.8,
    price: 379,
    availability: 'Available',
    description: 'Autonomous vehicle software expert. Built critical safety systems for Tesla autopilot.',
    sessions: 290,
    badge: 'Expert',
    category: 'Software Engineering'
  },
  {
    name: 'Shreya Kapoor',
    email: 'shreya.kapoor@stripe.com',
    title: 'Senior Backend Engineer',
    company: 'Stripe',
    expertise: ['Payment Systems', 'Ruby', 'PostgreSQL', 'Security'],
    experience: '7+ years',
    rating: 4.9,
    price: 349,
    availability: 'Available',
    description: 'Payment infrastructure specialist. Handles billions in transactions daily.',
    sessions: 340,
    badge: 'Top Mentor',
    category: 'Software Engineering'
  },
  {
    name: 'Harsh Agarwal',
    email: 'harsh.agarwal@twitch.com',
    title: 'Principal Engineer',
    company: 'Twitch',
    expertise: ['Live Streaming', 'WebRTC', 'Video Processing', 'Scala'],
    experience: '11+ years',
    rating: 4.7,
    price: 399,
    availability: 'Available',
    description: 'Live streaming technology expert. Built systems serving millions of concurrent users.',
    sessions: 420,
    badge: 'Expert',
    category: 'Software Engineering'
  },

  // Data Science - 3 more
  {
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@openai.com',
    title: 'Research Scientist',
    company: 'OpenAI',
    expertise: ['Large Language Models', 'Transformers', 'PyTorch', 'Research'],
    experience: '8+ years',
    rating: 4.9,
    price: 449,
    availability: 'Available',
    description: 'AI researcher working on GPT models. Published 20+ papers in top ML conferences.',
    sessions: 180,
    badge: 'Top Mentor',
    category: 'Data Science'
  },
  {
    name: 'Nisha Reddy',
    email: 'nisha.reddy@nvidia.com',
    title: 'Senior ML Engineer',
    company: 'NVIDIA',
    expertise: ['Computer Vision', 'CUDA', 'Deep Learning', 'GPU Computing'],
    experience: '6+ years',
    rating: 4.8,
    price: 369,
    availability: 'Available',
    description: 'GPU computing specialist. Optimized ML models for real-time inference.',
    sessions: 250,
    badge: 'Expert',
    category: 'Data Science'
  },
  {
    name: 'Abhishek Jain',
    email: 'abhishek.jain@databricks.com',
    title: 'Principal Data Scientist',
    company: 'Databricks',
    expertise: ['MLOps', 'Apache Spark', 'Data Engineering', 'Scala'],
    experience: '10+ years',
    rating: 4.8,
    price: 389,
    availability: 'Available',
    description: 'Big data and MLOps expert. Built ML platforms used by Fortune 500 companies.',
    sessions: 380,
    badge: 'Expert',
    category: 'Data Science'
  },

  // Product Management - 3 more
  {
    name: 'Priyanka Singh',
    email: 'priyanka.singh@zoom.com',
    title: 'Senior Product Manager',
    company: 'Zoom',
    expertise: ['Video Conferencing', 'B2B SaaS', 'User Experience', 'Growth'],
    experience: '7+ years',
    rating: 4.8,
    price: 339,
    availability: 'Available',
    description: 'Led Zoom\'s growth during pandemic. Expert in scaling B2B products globally.',
    sessions: 310,
    badge: 'Expert',
    category: 'Product Management'
  },
  {
    name: 'Rohit Sharma',
    email: 'rohit.sharma@shopify.com',
    title: 'Principal PM',
    company: 'Shopify',
    expertise: ['E-commerce', 'Marketplace', 'Payments', 'International'],
    experience: '9+ years',
    rating: 4.9,
    price: 369,
    availability: 'Available',
    description: 'E-commerce platform expert. Launched Shopify in 15+ countries.',
    sessions: 290,
    badge: 'Top Mentor',
    category: 'Product Management'
  },
  {
    name: 'Anita Gupta',
    email: 'anita.gupta@notion.com',
    title: 'VP Product',
    company: 'Notion',
    expertise: ['Productivity Tools', 'Collaboration', 'Product Strategy', 'Design'],
    experience: '12+ years',
    rating: 4.9,
    price: 449,
    availability: 'Available',
    description: 'Product leadership expert. Scaled Notion from startup to unicorn.',
    sessions: 180,
    badge: 'Top Mentor',
    category: 'Product Management'
  },

  // Design - 3 more
  {
    name: 'Kavita Patel',
    email: 'kavita.patel@canva.com',
    title: 'Design Director',
    company: 'Canva',
    expertise: ['Design Tools', 'Creative Software', 'User Interface', 'Design Systems'],
    experience: '8+ years',
    rating: 4.8,
    price: 359,
    availability: 'Available',
    description: 'Design tools expert. Built interfaces used by 100M+ creators worldwide.',
    sessions: 270,
    badge: 'Expert',
    category: 'Design'
  },
  {
    name: 'Arjun Malhotra',
    email: 'arjun.malhotra@pinterest.com',
    title: 'Senior UX Designer',
    company: 'Pinterest',
    expertise: ['Visual Discovery', 'Mobile Design', 'User Research', 'Prototyping'],
    experience: '6+ years',
    rating: 4.7,
    price: 309,
    availability: 'Available',
    description: 'Visual design specialist. Designed discovery experiences for billions of pins.',
    sessions: 230,
    badge: 'Rising Star',
    category: 'Design'
  },
  {
    name: 'Deepika Sharma',
    email: 'deepika.sharma@discord.com',
    title: 'Product Designer',
    company: 'Discord',
    expertise: ['Gaming UX', 'Community Design', 'Voice/Video UI', 'Accessibility'],
    experience: '5+ years',
    rating: 4.8,
    price: 289,
    availability: 'Available',
    description: 'Gaming and community design expert. Designed features for 150M+ gamers.',
    sessions: 200,
    badge: 'Rising Star',
    category: 'Design'
  },

  // Career Guidance - 3 more
  {
    name: 'Vikash Kumar',
    email: 'vikash.kumar@career.com',
    title: 'Tech Recruiter & Coach',
    company: 'Independent',
    expertise: ['Technical Interviews', 'System Design', 'Coding Prep', 'FAANG Prep'],
    experience: '9+ years',
    rating: 4.9,
    price: 229,
    availability: 'Available',
    description: 'Ex-Google recruiter. Conducted 2000+ technical interviews. 95% success rate.',
    sessions: 750,
    badge: 'Top Mentor',
    category: 'Career Guidance'
  },
  {
    name: 'Sunita Agarwal',
    email: 'sunita.agarwal@coach.com',
    title: 'Career Transition Coach',
    company: 'Independent',
    expertise: ['Career Change', 'Upskilling', 'Remote Work', 'Freelancing'],
    experience: '11+ years',
    rating: 4.8,
    price: 199,
    availability: 'Available',
    description: 'Career transition specialist. Helped 500+ professionals switch to tech.',
    sessions: 680,
    badge: 'Expert',
    category: 'Career Guidance'
  },
  {
    name: 'Rajat Khanna',
    email: 'rajat.khanna@startup.com',
    title: 'Startup Advisor',
    company: 'Independent',
    expertise: ['Entrepreneurship', 'Startup Strategy', 'Fundraising', 'Product-Market Fit'],
    experience: '14+ years',
    rating: 4.9,
    price: 399,
    availability: 'Available',
    description: 'Serial entrepreneur. Founded 3 startups, 2 successful exits. Angel investor.',
    sessions: 320,
    badge: 'Top Mentor',
    category: 'Career Guidance'
  }
];

async function addMoreMentors() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dsa-sheet');
    console.log('Connected to MongoDB');

    const result = await Mentorship.insertMany(additionalMentors);
    console.log(`✅ Added ${result.length} more mentors successfully`);

    // Show updated counts
    const categories = ['Software Engineering', 'Data Science', 'Product Management', 'Design', 'Career Guidance'];
    console.log('\n📊 Updated mentor counts:');
    for (const category of categories) {
      const count = await Mentorship.countDocuments({ category });
      console.log(`${category}: ${count} mentors`);
    }

    const totalMentors = await Mentorship.countDocuments();
    console.log(`\n🎉 Total mentors: ${totalMentors}`);

    process.exit(0);
  } catch (error) {
    console.error('Error adding mentors:', error);
    process.exit(1);
  }
}

addMoreMentors();