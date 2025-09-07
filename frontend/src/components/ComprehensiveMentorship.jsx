import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'https://plusdsa.onrender.com/api';

const ComprehensiveMentorship = () => {
  const { isDark } = useTheme();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    domain: '',
    mentorId: ''
  });
  const [mentorFormData, setMentorFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: '',
    college: '',
    company: '',
    position: '',
    experience: '',
    expertise: '',
    linkedin: ''
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [mentorSubmitLoading, setMentorSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showMentorSuccess, setShowMentorSuccess] = useState(false);

  const domains = [
    'Software Engineering', 'Data Science', 'Product Management', 'UI/UX Design',
    'DevOps', 'Machine Learning', 'Blockchain', 'Mobile Development',
    'System Design', 'Career Guidance', 'Interview Preparation'
  ];

  const filters = ['All', 'Software Engineering', 'Data Science', 'Product Management', 'Design', 'Career Guidance'];

  const companies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }
  ];

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/mentorship`);
      setMentors(response.data);
    } catch (error) {
      setMentors([
        {
          _id: '1',
          name: 'Faraz Hussain',
          title: 'Senior Software Engineer',
          company: 'Google',
          experience: '5+ years',
          description: 'Specialized in System Design & Backend Development. Helped 500+ engineers crack FAANG interviews.',
          rating: 4.9,
          sessions: 500,
          price: 299,
          availability: 'Available',
          badge: 'Top Mentor',
          category: 'Software Engineering',
          skills: ['System Design', 'Java', 'Python', 'AWS'],
          languages: ['English', 'Hindi']
        },
        {
          _id: '2',
          name: 'Priya Sharma',
          title: 'Senior Data Scientist',
          company: 'Microsoft',
          experience: '6+ years',
          description: 'ML Expert with focus on NLP & Computer Vision. Published researcher with 10+ papers.',
          rating: 4.8,
          sessions: 350,
          price: 249,
          availability: 'Available',
          badge: 'Top Mentor',
          category: 'Data Science',
          skills: ['Machine Learning', 'Python', 'TensorFlow', 'Azure'],
          languages: ['English', 'Hindi']
        },
        {
          _id: '3',
          name: 'Rahul Kumar',
          title: 'Product Manager',
          company: 'Amazon',
          experience: '4+ years',
          description: 'Led product teams for Alexa & AWS. Expert in product strategy and user research.',
          rating: 4.9,
          sessions: 280,
          price: 349,
          availability: 'Available',
          badge: 'Top Mentor',
          category: 'Product Management',
          skills: ['Product Strategy', 'Analytics', 'User Research', 'Agile'],
          languages: ['English']
        },
        {
          _id: '4',
          name: 'Sneha Patel',
          title: 'Senior UX Designer',
          company: 'Meta',
          experience: '5+ years',
          description: 'Design systems expert. Worked on Instagram & WhatsApp user experiences.',
          rating: 4.7,
          sessions: 220,
          price: 279,
          availability: 'Available',
          badge: 'Rising Star',
          category: 'Design',
          skills: ['UI/UX Design', 'Figma', 'Design Systems', 'User Research'],
          languages: ['English', 'Hindi']
        },
        {
          _id: '5',
          name: 'Arjun Singh',
          title: 'DevOps Engineer',
          company: 'Netflix',
          experience: '7+ years',
          description: 'Cloud infrastructure expert. Scaled systems handling millions of users.',
          rating: 4.8,
          sessions: 180,
          price: 229,
          availability: 'Available',
          badge: 'Expert',
          category: 'DevOps',
          skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
          languages: ['English']
        },
        {
          _id: '6',
          name: 'Kavya Reddy',
          title: 'Career Coach',
          company: 'Independent',
          experience: '8+ years',
          description: 'Helped 1000+ professionals transition to tech. Ex-recruiter at top companies.',
          rating: 4.9,
          sessions: 800,
          price: 199,
          availability: 'Available',
          badge: 'Top Mentor',
          category: 'Career Guidance',
          skills: ['Resume Review', 'Interview Prep', 'Career Planning', 'Salary Negotiation'],
          languages: ['English', 'Hindi', 'Telugu']
        },
        {
          _id: '7',
          name: 'Rohit Gupta',
          title: 'Senior SDE',
          company: 'Apple',
          experience: '6+ years',
          description: 'iOS development expert. Built apps used by millions. Specializes in Swift and system optimization.',
          rating: 4.8,
          sessions: 320,
          price: 299,
          availability: 'Available',
          badge: 'Expert',
          category: 'Software Engineering',
          skills: ['iOS', 'Swift', 'System Design', 'Performance'],
          languages: ['English', 'Hindi']
        },
        {
          _id: '8',
          name: 'Anita Verma',
          title: 'ML Engineer',
          company: 'Tesla',
          experience: '5+ years',
          description: 'AI/ML specialist working on autonomous driving. Expert in deep learning and computer vision.',
          rating: 4.9,
          sessions: 240,
          price: 329,
          availability: 'Available',
          badge: 'Rising Star',
          category: 'Data Science',
          skills: ['Deep Learning', 'Computer Vision', 'PyTorch', 'AI'],
          languages: ['English']
        },
        {
          _id: '9',
          name: 'Vikram Joshi',
          title: 'Staff Engineer',
          company: 'Uber',
          experience: '8+ years',
          description: 'Distributed systems architect. Built scalable platforms handling billions of requests.',
          rating: 4.9,
          sessions: 450,
          price: 399,
          availability: 'Available',
          badge: 'Top Mentor',
          category: 'Software Engineering',
          skills: ['Distributed Systems', 'Microservices', 'Go', 'Kafka'],
          languages: ['English', 'Hindi']
        },
        {
          _id: '10',
          name: 'Meera Shah',
          title: 'Security Engineer',
          company: 'Stripe',
          experience: '4+ years',
          description: 'Cybersecurity expert. Protects financial systems and builds secure payment infrastructure.',
          rating: 4.7,
          sessions: 180,
          price: 279,
          availability: 'Available',
          badge: 'Expert',
          category: 'Software Engineering',
          skills: ['Security', 'Cryptography', 'Python', 'Infrastructure'],
          languages: ['English', 'Hindi']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/mentorship/waiting-list`, formData);
      setShowSuccess(true);
      setFormData({ name: '', email: '', phone: '', domain: '', mentorId: '' });
      setTimeout(() => {
        setShowForm(false);
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const openForm = (mentorId = '') => {
    setFormData({ ...formData, mentorId });
    setShowForm(true);
  };

  const handleMentorFormSubmit = async (e) => {
    e.preventDefault();
    setMentorSubmitLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/mentor-application/apply`, mentorFormData);
      setShowMentorSuccess(true);
      setMentorFormData({
        name: '',
        email: '',
        phone: '',
        education: '',
        college: '',
        company: '',
        position: '',
        experience: '',
        expertise: '',
        linkedin: ''
      });
      setTimeout(() => {
        setShowMentorForm(false);
        setShowMentorSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setMentorSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: isDark ? '#1f2937' : '#f9fafb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  const filteredMentors = selectedFilter === 'All' 
    ? mentors 
    : mentors.filter(mentor => mentor.category === selectedFilter || 
        (selectedFilter === 'Design' && mentor.category === 'Design'));

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f172a' : '#ffffff'
    }}>
      {/* Header */}
      <div style={{
        background: isDark ? '#1e293b' : '#ffffff',
        borderBottom: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
                </svg>
              </div>
              <img 
                src={isDark ? '/dark.png' : '/light.png'} 
                alt="DSA Sheet" 
                style={{ height: '40px', width: 'auto' }} 
              />
            </div>
          </div>
          <button
            onClick={() => openForm()}
            style={{
              background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(30, 144, 255, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 16px rgba(30, 144, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(30, 144, 255, 0.3)';
            }}
          >
            Book a Session
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          background: isDark 
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
            : 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
          marginBottom: '80px'
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '60px'
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontSize: '56px',
                fontWeight: '800',
                color: isDark ? 'white' : '#0f172a',
                marginBottom: '24px',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}>
                Learn from the
                <span style={{
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block'
                }}>
                  Best in Tech
                </span>
              </h1>
              <p style={{
                fontSize: '20px',
                color: isDark ? '#94a3b8' : '#64748b',
                marginBottom: '40px',
                lineHeight: '1.6'
              }}>
                Get 1-on-1 mentorship from industry experts at top tech companies.
                Accelerate your career with personalized guidance.
              </p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <button
                onClick={() => openForm()}
                style={{
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(30, 144, 255, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(30, 144, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(30, 144, 255, 0.3)';
                }}
              >
                Find Your Mentor
              </button>
              <button
                onClick={() => setShowMentorForm(true)}
                style={{
                background: 'transparent',
                color: isDark ? '#e2e8f0' : '#475569',
                border: `2px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                borderRadius: '12px',
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#1E90FF';
                e.target.style.color = '#1E90FF';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = isDark ? '#475569' : '#cbd5e1';
                e.target.style.color = isDark ? '#e2e8f0' : '#475569';
              }}
              >
                Become a Mentor
              </button>
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <img src="/mentor.png" alt="DSA Mentorship" style={{ 
                width: '100%', 
                maxWidth: '400px', 
                height: 'auto', 
                objectFit: 'contain',
                filter: isDark ? 'brightness(0.9)' : 'none'
              }} />
            </div>
          </div>
        </div>

        {/* Trending Domains */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '24px'
          }}>
            Trending Domains
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {domains.map((domain, index) => (
              <div key={index} style={{
                padding: '16px',
                background: isDark ? '#374151' : 'white',
                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = isDark ? '#4b5563' : '#e5e7eb';
                e.target.style.transform = 'translateY(0px)';
              }}
              >
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDark ? '#d1d5db' : '#374151'
                }}>
                  {domain}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '24px'
          }}>
            Mentors from Top Companies
          </h2>
          <div style={{
            display: 'flex',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {companies.map((company, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px 24px',
                background: isDark ? '#374151' : 'white',
                border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <img src={company.logo} alt={company.name} style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                <span style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: isDark ? '#d1d5db' : '#374151'
                }}>
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            How It Works
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0px',
            flexWrap: 'wrap'
          }}>
            {[
              {
                step: '1',
                title: 'Choose Your Mentor',
                desc: 'Browse through our expert mentors and select based on your needs.'
              },
              {
                step: '2',
                title: 'Book a Session',
                desc: 'Schedule a convenient time for your 1-on-1 mentorship session.'
              },
              {
                step: '3',
                title: 'Get Guidance',
                desc: 'Receive personalized advice and actionable insights from industry experts.'
              },
              {
                step: '4',
                title: 'Grow Your Career',
                desc: 'Apply the learnings and accelerate your professional growth.'
              }
            ].map((step, index) => (
              <React.Fragment key={index}>
                <div style={{
                  padding: '24px',
                  background: isDark ? '#374151' : 'white',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  textAlign: 'center',
                  position: 'relative',
                  minWidth: '200px',
                  maxWidth: '250px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#3b82f6',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    margin: '0 auto 16px auto'
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {step.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.4'
                  }}>
                    {step.desc}
                  </p>
                </div>
                {index < 3 && (
                  <div style={{
                    width: '60px',
                    height: '2px',
                    background: `linear-gradient(90deg, transparent 0%, #3b82f6 50%, transparent 100%)`,
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '2px',
                      background: '#3b82f6',
                      position: 'absolute',
                      animation: 'flowLine 2s ease-in-out infinite'
                    }} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Filter Section */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '24px',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedFilter === filter 
                    ? 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)'
                    : isDark ? '#334155' : '#f1f5f9',
                  color: selectedFilter === filter 
                    ? 'white' 
                    : isDark ? '#e2e8f0' : '#475569'
                }}
                onMouseEnter={(e) => {
                  if (selectedFilter !== filter) {
                    e.target.style.background = isDark ? '#475569' : '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFilter !== filter) {
                    e.target.style.background = isDark ? '#334155' : '#f1f5f9';
                  }
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Mentors Section */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '700',
                color: isDark ? 'white' : '#0f172a',
                marginBottom: '8px'
              }}>
                Expert Mentors
              </h2>
              <p style={{
                fontSize: '16px',
                color: isDark ? '#94a3b8' : '#64748b'
              }}>
                Connect with industry professionals from top tech companies
              </p>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '24px'
          }}>
            {filteredMentors.map(mentor => (
              <div key={mentor._id} style={{
                padding: '20px',
                background: isDark 
                  ? 'linear-gradient(145deg, #1e293b 0%, #334155 100%)'
                  : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
                border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
                borderRadius: '20px',
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = isDark 
                  ? '0 25px 50px rgba(0,0,0,0.4)' 
                  : '0 25px 50px rgba(30, 144, 255, 0.15)';
                e.currentTarget.style.borderColor = '#1E90FF';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = isDark ? '#475569' : '#e2e8f0';
              }}
              >
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  opacity: 0.05
                }} />

                {/* Header with Avatar and Company */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '20px',
                      background: `linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '28px',
                      fontWeight: '800',
                      border: '3px solid #1E90FF'
                    }}>
                      {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      width: '24px',
                      height: '24px',
                      background: '#10b981',
                      borderRadius: '50%',
                      border: '3px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: 'white',
                        borderRadius: '50%'
                      }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '22px',
                      fontWeight: '800',
                      color: isDark ? 'white' : '#0f172a',
                      marginBottom: '6px',
                      letterSpacing: '-0.5px'
                    }}>
                      {mentor.name}
                    </h3>
                    <p style={{
                      fontSize: '15px',
                      color: isDark ? '#94a3b8' : '#64748b',
                      marginBottom: '8px',
                      background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: '600'
                    }}>
                      {mentor.title} @ {mentor.company}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ color: '#fbbf24', fontSize: '16px' }}>★</span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: isDark ? '#fbbf24' : '#f59e0b'
                        }}>
                          {mentor.rating}
                        </span>
                      </div>
                      <span style={{
                        padding: '4px 8px',
                        background: mentor.badge === 'Top Mentor' ? '#dbeafe' : '#fef3c7',
                        color: mentor.badge === 'Top Mentor' ? '#1e40af' : '#92400e',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {mentor.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Experience and Skills */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? '#e2e8f0' : '#374151',
                    lineHeight: '1.5',
                    marginBottom: '12px'
                  }}>
                    {mentor.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    marginBottom: '12px'
                  }}>
                    {mentor.skills?.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          padding: '4px 8px',
                          background: isDark ? '#334155' : '#f1f5f9',
                          color: isDark ? '#cbd5e1' : '#475569',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '12px',
                    color: isDark ? '#94a3b8' : '#64748b'
                  }}>
                    <span>📅 {mentor.experience}</span>
                    <span>💬 {mentor.languages?.join(', ')}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '12px',
                  marginBottom: '20px',
                  padding: '16px',
                  background: isDark 
                    ? 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  borderRadius: '16px',
                  border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: '#1E90FF',
                      marginBottom: '2px'
                    }}>
                      ₹{mentor.price}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontWeight: '600'
                    }}>
                      per session
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: isDark ? '#e2e8f0' : '#0f172a',
                      marginBottom: '2px'
                    }}>
                      {mentor.sessions}+
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontWeight: '600'
                    }}>
                      sessions
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '20px',
                      fontWeight: '800',
                      color: isDark ? '#e2e8f0' : '#0f172a',
                      marginBottom: '2px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}>
                      📅 {mentor.experience}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontWeight: '600'
                    }}>
                      experience
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openForm(mentor._id)}
                    style={{
                      flex: 1,
                      padding: '14px',
                      background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',

                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';

                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';

                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
                    </svg>
                    View Profile
                  </button>
                  <button
                    onClick={() => alert('Coming Soon! Chat feature under development.')}
                    style={{
                      padding: '14px',
                      background: 'transparent',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      border: `2px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#1E90FF';
                      e.target.style.color = '#1E90FF';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = isDark ? '#4b5563' : '#d1d5db';
                      e.target.style.color = isDark ? '#9ca3af' : '#6b7280';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How Mentorship Transforms Your Learning */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            marginBottom: '60px'
          }}>
            <div style={{ flex: 1 }}>
              <h2 style={{
                fontSize: '36px',
                fontWeight: '800',
                color: isDark ? 'white' : '#0f172a',
                marginBottom: '24px',
                lineHeight: '1.2'
              }}>
                Transform Your
                <span style={{
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'block'
                }}>
                  Learning Journey
                </span>
              </h2>
              <p style={{
                fontSize: '18px',
                color: isDark ? '#94a3b8' : '#64748b',
                lineHeight: '1.7',
                marginBottom: '32px'
              }}>
                Mentorship doesn't just teach you DSA - it revolutionizes how you approach problem-solving, 
                think algorithmically, and build the confidence to tackle any coding challenge.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px'
              }}>
                {[
                  { title: 'Structured Learning Path', desc: 'From basics to advanced concepts' },
                  { title: 'Real Interview Experience', desc: 'Practice with actual FAANG questions' },
                  { title: 'Personalized Feedback', desc: 'Get insights on your coding style' },
                  { title: 'Industry Best Practices', desc: 'Learn professional coding standards' }
                ].map((item, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    background: isDark ? '#374151' : '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: '4px solid #1E90FF'
                  }}>
                    <h4 style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: isDark ? 'white' : '#0f172a',
                      marginBottom: '4px'
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontSize: '12px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      margin: 0
                    }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{
                display: 'flex',
                gap: '40px',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Before */}
                <div style={{
                  padding: '24px',
                  background: isDark ? '#374151' : '#f8fafc',
                  borderRadius: '16px',
                  border: `2px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  textAlign: 'center',
                  width: '180px'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 16px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
                    </svg>
                  </div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: isDark ? 'white' : '#0f172a',
                    marginBottom: '8px'
                  }}>Before</h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    textAlign: 'left'
                  }}>
                    <li>• Random practice</li>
                    <li>• No clear direction</li>
                    <li>• Stuck on problems</li>
                    <li>• Interview anxiety</li>
                  </ul>
                </div>

                {/* Arrow */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="#1E90FF">
                    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
                  </svg>
                </div>

                {/* After */}
                <div style={{
                  padding: '24px',
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  borderRadius: '16px',
                  textAlign: 'center',
                  width: '180px',
                  color: 'white',
                  boxShadow: '0 8px 25px rgba(30, 144, 255, 0.3)'
                }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 16px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                    </svg>
                  </div>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>After</h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    fontSize: '12px',
                    textAlign: 'left',
                    opacity: 0.9
                  }}>
                    <li>• Structured roadmap</li>
                    <li>• Clear problem patterns</li>
                    <li>• Optimized solutions</li>
                    <li>• Interview confidence</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: isDark ? 'white' : '#1f2937',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Why Choose Our Mentorship?
          </h2>
          <p style={{
            fontSize: '18px',
            color: isDark ? '#94a3b8' : '#64748b',
            textAlign: 'center',
            marginBottom: '48px',
            maxWidth: '600px',
            margin: '0 auto 48px auto'
          }}>
            Experience personalized guidance that adapts to your learning style and career goals
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                icon: '🎯',
                title: 'Personalized Guidance',
                desc: 'Get tailored advice based on your career goals and current skill level.'
              },
              {
                icon: '💼',
                title: 'Industry Experts',
                desc: 'Learn from professionals working at top tech companies worldwide.'
              },
              {
                icon: '📈',
                title: 'Career Growth',
                desc: 'Accelerate your career with proven strategies and insider knowledge.'
              },
              {
                icon: '🤝',
                title: '1-on-1 Sessions',
                desc: 'Direct interaction with mentors for focused learning and networking.'
              }
            ].map((feature, index) => {
              const getIcon = (title) => {
                switch(title) {
                  case 'Personalized Guidance':
                    return <svg width="48" height="48" viewBox="0 0 24 24" fill="#1E90FF"><path d="M12,2A2,2 0 0,1 14,4C14,5.5 13.6,6.9 12.9,8.1L17.2,12.4C17.6,12.8 17.6,13.4 17.2,13.8L13.8,17.2C13.4,17.6 12.8,17.6 12.4,17.2L8.1,12.9C6.9,13.6 5.5,14 4,14A2,2 0 0,1 2,12A2,2 0 0,1 4,10C5.5,10 6.9,10.4 8.1,11.1L12.4,6.8C12.8,6.4 13.4,6.4 13.8,6.8L17.2,10.2C17.6,10.6 17.6,11.2 17.2,11.6L12.9,15.9C13.6,17.1 14,18.5 14,20A2,2 0 0,1 12,22A2,2 0 0,1 10,20C10,18.5 10.4,17.1 11.1,15.9L6.8,11.6C6.4,11.2 6.4,10.6 6.8,10.2L10.2,6.8C10.6,6.4 11.2,6.4 11.6,6.8L15.9,11.1C17.1,10.4 18.5,10 20,10A2,2 0 0,1 22,12A2,2 0 0,1 20,14C18.5,14 17.1,13.6 15.9,12.9L11.6,17.2C11.2,17.6 10.6,17.6 10.2,17.2L6.8,13.8C6.4,13.4 6.4,12.8 6.8,12.4L11.1,8.1C10.4,6.9 10,5.5 10,4A2,2 0 0,1 12,2Z"/></svg>;
                  case 'Industry Experts':
                    return <svg width="48" height="48" viewBox="0 0 24 24" fill="#1E90FF"><path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/></svg>;
                  case 'Career Growth':
                    return <svg width="48" height="48" viewBox="0 0 24 24" fill="#1E90FF"><path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z"/></svg>;
                  case '1-on-1 Sessions':
                    return <svg width="48" height="48" viewBox="0 0 24 24" fill="#1E90FF"><path d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/></svg>;
                  default:
                    return <div style={{ fontSize: '32px' }}>{feature.icon}</div>;
                }
              };
              
              return (
                <div key={index} style={{
                  padding: '24px',
                  background: isDark ? '#374151' : 'white',
                  border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 144, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                >
                  <div style={{ marginBottom: '16px' }}>{getIcon(feature.title)}</div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: isDark ? 'white' : '#1f2937',
                    marginBottom: '12px'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.6'
                  }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>










        {/* Footer */}
        <div style={{
          marginTop: '80px',
          padding: '40px 0',
          borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          background: isDark ? '#1e293b' : '#f8fafc'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
                  </svg>
                </div>
                <span style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: isDark ? 'white' : '#0f172a'
                }}>DSA Sheet - Apna College</span>
              </div>
              <p style={{
                fontSize: '16px',
                color: isDark ? '#94a3b8' : '#64748b',
                lineHeight: '1.6',
                marginBottom: '16px'
              }}>
                DSA Sheet - Apna College 373<br/>
                A comprehensive platform for mastering Data Structures and Algorithms with curated problems from top coding platforms.
              </p>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: isDark ? 'white' : '#0f172a',
                marginBottom: '16px'
              }}>
                Quick Links
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { icon: '▶', text: 'Practice Problems' },
                  { icon: '▶', text: 'Progress Tracker' },
                  { icon: '▶', text: 'Mentorship' }
                ].map((link, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#1E90FF'}
                  onMouseLeave={(e) => e.target.style.color = isDark ? '#94a3b8' : '#64748b'}
                  >
                    <span>{link.icon}</span>
                    <span>{link.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '700',
                color: isDark ? 'white' : '#0f172a',
                marginBottom: '16px'
              }}>
                Contact
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { icon: '📧', text: 'shivamsham.gami.com' },
                  { icon: '📞', text: '888-888-8888' },
                  { icon: '💼', text: 'LinkedIn Profile' }
                ].map((contact, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: isDark ? '#94a3b8' : '#64748b',
                    fontSize: '14px'
                  }}>
                    <span>{contact.icon}</span>
                    <span>{contact.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div style={{
            borderTop: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            paddingTop: '24px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              color: isDark ? '#94a3b8' : '#64748b',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              <strong>Legal Disclaimer & Attribution</strong><br/>
              © DSA Sheet - Apna College 373, 2025. All rights reserved. All problem statements, descriptions, and articles linked on this site are the property of their respective owners (e.g., LeetCode®, GeeksforGeeks®, HackerRank®). This site provides only hyperlinks to external content for educational and reference purposes. No copyrighted material is reproduced here without permission. If you believe any content on this site infringes your copyright, please contact us at shivamsham.gami.com to request removal (DMCA Policy).
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#ef4444'
            }}>
              <span>❤️</span>
              <span>Made with love for DSA learners</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mentor Application Form */}
      {showMentorForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: isDark ? '#374151' : 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowMentorForm(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}
            >
              ×
            </button>

            {showMentorSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: isDark ? 'white' : '#1f2937',
                  marginBottom: '12px'
                }}>
                  Application Submitted!
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: isDark ? '#9ca3af' : '#6b7280'
                }}>
                  Thank you for applying! Our team will review your application and contact you soon.
                </p>
              </div>
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img src={isDark ? '/dark.png' : '/light.png'} alt="DSA+" style={{ height: '40px', width: 'auto', marginBottom: '16px' }} />
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: isDark ? 'white' : '#1f2937',
                    margin: 0
                  }}>
                    Become a Mentor
                  </h3>
                </div>

                <form onSubmit={handleMentorFormSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={mentorFormData.name}
                        onChange={(e) => setMentorFormData({...mentorFormData, name: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={mentorFormData.email}
                        onChange={(e) => setMentorFormData({...mentorFormData, email: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={mentorFormData.phone}
                        onChange={(e) => setMentorFormData({...mentorFormData, phone: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        Education *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., B.Tech CSE"
                        value={mentorFormData.education}
                        onChange={(e) => setMentorFormData({...mentorFormData, education: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        College *
                      </label>
                      <input
                        type="text"
                        required
                        value={mentorFormData.college}
                        onChange={(e) => setMentorFormData({...mentorFormData, college: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        Current Company *
                      </label>
                      <input
                        type="text"
                        required
                        value={mentorFormData.company}
                        onChange={(e) => setMentorFormData({...mentorFormData, company: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        Position *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Senior Software Engineer"
                        value={mentorFormData.position}
                        onChange={(e) => setMentorFormData({...mentorFormData, position: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: isDark ? '#e5e7eb' : '#374151',
                        marginBottom: '6px'
                      }}>
                        Experience *
                      </label>
                      <select
                        required
                        value={mentorFormData.experience}
                        onChange={(e) => setMentorFormData({...mentorFormData, experience: e.target.value})}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '6px',
                          border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                          background: isDark ? '#1f2937' : 'white',
                          color: isDark ? 'white' : '#374151',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Select Experience</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-8 years">5-8 years</option>
                        <option value="8+ years">8+ years</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#374151',
                      marginBottom: '6px'
                    }}>
                      Expertise/Skills *
                    </label>
                    <textarea
                      required
                      placeholder="e.g., Data Structures, Algorithms, System Design, Java, Python"
                      value={mentorFormData.expertise}
                      onChange={(e) => setMentorFormData({...mentorFormData, expertise: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                        background: isDark ? '#1f2937' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '14px',
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#374151',
                      marginBottom: '6px'
                    }}>
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={mentorFormData.linkedin}
                      onChange={(e) => setMentorFormData({...mentorFormData, linkedin: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                        background: isDark ? '#1f2937' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={mentorSubmitLoading}
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: mentorSubmitLoading ? '#9ca3af' : 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: mentorSubmitLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {mentorSubmitLoading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: isDark ? '#374151' : 'white',
            borderRadius: '12px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: isDark ? '#9ca3af' : '#6b7280'
              }}
            >
              ×
            </button>

            {showSuccess ? (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px auto'
                }}>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z"/>
                  </svg>
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: isDark ? 'white' : '#1f2937',
                  marginBottom: '12px'
                }}>
                  You're in the Waiting List!
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: isDark ? '#9ca3af' : '#6b7280'
                }}>
                  Thank you for your interest! Our team will contact you soon.
                </p>
              </div>
            ) : (
              <>
                <div style={{
                  background: '#fef3c7',
                  border: '1px solid #fbbf24',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#92400e'
                  }}>
                    🎉 Fill the form for Early Bird Offer!
                  </span>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <img src={isDark ? '/dark.png' : '/light.png'} alt="DSA+" style={{ height: '40px', width: 'auto', marginBottom: '16px' }} />
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: isDark ? 'white' : '#1f2937',
                    margin: 0
                  }}>
                    Book Your Mentorship Session
                  </h3>
                </div>

                <form onSubmit={handleFormSubmit}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#374151',
                      marginBottom: '6px'
                    }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                        background: isDark ? '#1f2937' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#374151',
                      marginBottom: '6px'
                    }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                        background: isDark ? '#1f2937' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#374151',
                      marginBottom: '6px'
                    }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                        background: isDark ? '#1f2937' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isDark ? '#e5e7eb' : '#374151',
                      marginBottom: '6px'
                    }}>
                      Domain of Interest
                    </label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '6px',
                        border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                        background: isDark ? '#1f2937' : 'white',
                        color: isDark ? 'white' : '#374151',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select Domain</option>
                      {domains.map((domain, index) => (
                        <option key={index} value={domain}>{domain}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: submitLoading ? '#9ca3af' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: submitLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {submitLoading ? 'Submitting...' : 'Book Session'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes flowLine {
            0% { transform: translateX(-20px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(60px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default ComprehensiveMentorship;