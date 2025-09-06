import React, { useState } from 'react';

const InterviewForm = ({ isDark, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: '',
    position: '',
    experience: '0-1',
    skills: '',
    interviewRound: 'Technical Round 1',
    additionalNotes: '',
    resume: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ submit: 'Failed to generate interview questions. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, resume: 'Please upload a PDF or DOC file' });
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, resume: 'File size should be less than 5MB' });
        return;
      }
      
      setFormData({ ...formData, resume: file });
      setErrors({ ...errors, resume: '' });
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        overflow: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        border: isDark ? '1px solid #1e293b' : '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
          <button onClick={onClose} style={{
            position: 'absolute',
            top: '-16px',
            right: '-16px',
            background: isDark ? '#374151' : '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#9ca3af' : '#6b7280',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = isDark ? '#4b5563' : '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = isDark ? '#374151' : '#f3f4f6';
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
            </svg>
          </button>
          
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 8px 25px rgba(30, 144, 255, 0.3)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M12,2A3,3 0 0,1 15,5A3,3 0 0,1 12,8A3,3 0 0,1 9,5A3,3 0 0,1 12,2M21,9V7H15L13.5,7.5C13.1,7.4 12.6,7.5 12.1,7.8L10.5,9H3V11H9L10.5,9.5C10.9,9.6 11.4,9.5 11.9,9.2L13.5,7.5H21M7.5,13A1.5,1.5 0 0,1 9,14.5A1.5,1.5 0 0,1 7.5,16A1.5,1.5 0 0,1 6,14.5A1.5,1.5 0 0,1 7.5,13M16.5,13A1.5,1.5 0 0,1 18,14.5A1.5,1.5 0 0,1 16.5,16A1.5,1.5 0 0,1 15,14.5A1.5,1.5 0 0,1 16.5,13Z"/>
            </svg>
          </div>
          
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: isDark ? 'white' : '#0f172a',
            marginBottom: '8px',
            letterSpacing: '-0.025em'
          }}>
            Interview Setup
          </h1>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#94a3b8' : '#64748b',
            margin: 0,
            fontWeight: '400'
          }}>
            Tell us about your interview to get personalized questions
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Name */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: isDark ? '#f1f5f9' : '#1f2937', 
                fontSize: '14px', 
                fontWeight: '600',
                letterSpacing: '0.025em'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.name ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0')}`,
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                placeholder="Enter your full name"
                onFocus={(e) => {
                  e.target.style.borderColor = '#1E90FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0');
                  e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
                }}
              />
              {errors.name && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
            </div>

            {/* Email */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: isDark ? '#f1f5f9' : '#1f2937', 
                fontSize: '14px', 
                fontWeight: '600',
                letterSpacing: '0.025em'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.email ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0')}`,
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                placeholder="your.email@example.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#1E90FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0');
                  e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
                }}
              />
              {errors.email && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
            </div>

            {/* Company Name */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: isDark ? '#f1f5f9' : '#1f2937', 
                fontSize: '14px', 
                fontWeight: '600',
                letterSpacing: '0.025em'
              }}>
                Target Company *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.companyName ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0')}`,
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                placeholder="e.g., Google, Amazon, Microsoft"
                onFocus={(e) => {
                  e.target.style.borderColor = '#1E90FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.companyName ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0');
                  e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
                }}
              />
              {errors.companyName && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.companyName}</span>}
            </div>

            {/* Position */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: isDark ? '#f1f5f9' : '#1f2937', 
                fontSize: '14px', 
                fontWeight: '600',
                letterSpacing: '0.025em'
              }}>
                Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${errors.position ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0')}`,
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
                }}
                placeholder="e.g., Software Engineer, Data Scientist"
                onFocus={(e) => {
                  e.target.style.borderColor = '#1E90FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.position ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0');
                  e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
                }}
              />
              {errors.position && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.position}</span>}
            </div>

            {/* Experience */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: isDark ? '#f1f5f9' : '#1f2937', 
                fontSize: '14px', 
                fontWeight: '600',
                letterSpacing: '0.025em'
              }}>
                Experience Level
              </label>
              <select
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1E90FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0';
                  e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <option value="0-1">0-1 years (Fresher)</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-8">5-8 years</option>
                <option value="8+">8+ years</option>
              </select>
            </div>

            {/* Interview Round */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                color: isDark ? '#f1f5f9' : '#1f2937', 
                fontSize: '14px', 
                fontWeight: '600',
                letterSpacing: '0.025em'
              }}>
                Interview Round
              </label>
              <select
                value={formData.interviewRound}
                onChange={(e) => setFormData({...formData, interviewRound: e.target.value})}
                style={{
                  width: '100%',
                  padding: '16px 18px',
                  borderRadius: '12px',
                  border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                  backgroundColor: isDark ? '#1e293b' : '#ffffff',
                  color: isDark ? 'white' : '#1f2937',
                  fontSize: '15px',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1E90FF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0';
                  e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <option value="Technical Round 1">Technical Round 1</option>
                <option value="Technical Round 2">Technical Round 2</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Final Round">Final Round</option>
              </select>
            </div>
          </div>

          {/* Skills */}
          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: isDark ? '#f1f5f9' : '#1f2937', 
              fontSize: '14px', 
              fontWeight: '600',
              letterSpacing: '0.025em'
            }}>
              Key Skills *
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
              style={{
                width: '100%',
                padding: '16px 18px',
                borderRadius: '12px',
                border: `2px solid ${errors.skills ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0')}`,
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? 'white' : '#1f2937',
                fontSize: '15px',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)'
              }}
              placeholder="e.g., JavaScript, React, Node.js, Python, AWS"
              onFocus={(e) => {
                e.target.style.borderColor = '#1E90FF';
                e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.skills ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0');
                e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
              }}
            />
            {errors.skills && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.skills}</span>}
            <p style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', margin: '6px 0 0 0', fontStyle: 'italic' }}>
              💡 Separate multiple skills with commas
            </p>
          </div>

          {/* Resume Upload */}
          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: isDark ? '#f1f5f9' : '#1f2937', 
              fontSize: '14px', 
              fontWeight: '600',
              letterSpacing: '0.025em'
            }}>
              📄 Resume (Optional)
            </label>
            <div style={{
              position: 'relative',
              border: `2px dashed ${errors.resume ? '#ef4444' : (isDark ? '#334155' : '#e2e8f0')}`,
              borderRadius: '12px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: isDark ? '#1e293b' : '#f8fafc',
              transition: 'all 0.2s ease'
            }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              <div style={{ pointerEvents: 'none' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill={isDark ? '#6b7280' : '#9ca3af'} style={{ marginBottom: '8px' }}>
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                <p style={{ color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', margin: '0 0 4px 0', fontWeight: '500' }}>
                  {formData.resume ? formData.resume.name : 'Click to upload or drag and drop'}
                </p>
                <p style={{ color: isDark ? '#6b7280' : '#9ca3af', fontSize: '12px', margin: 0 }}>
                  PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </div>
            {errors.resume && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.resume}</span>}
            <p style={{ fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280', margin: '6px 0 0 0', fontStyle: 'italic' }}>
              💡 Upload your resume for more personalized questions
            </p>
          </div>

          {/* Additional Notes */}
          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: isDark ? '#f1f5f9' : '#1f2937', 
              fontSize: '14px', 
              fontWeight: '600',
              letterSpacing: '0.025em'
            }}>
              📝 Additional Notes (Optional)
            </label>
            <textarea
              value={formData.additionalNotes}
              onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
              style={{
                width: '100%',
                height: '100px',
                padding: '16px 18px',
                borderRadius: '12px',
                border: `2px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? 'white' : '#1f2937',
                fontSize: '15px',
                resize: 'vertical',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
                fontFamily: 'inherit'
              }}
              placeholder="Any specific areas you want to focus on or additional context..."
              onFocus={(e) => {
                e.target.style.borderColor = '#1E90FF';
                e.target.style.boxShadow = '0 0 0 3px rgba(30, 144, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isDark ? '#334155' : '#e2e8f0';
                e.target.style.boxShadow = isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)';
              }}
            />
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', gridColumn: '1 / -1' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: isDark ? '#9ca3af' : '#6b7280',
                border: `2px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '120px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDark ? '#374151' : '#f8fafc';
                e.target.style.borderColor = '#1E90FF';
                e.target.style.color = '#1E90FF';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = isDark ? '#374151' : '#e2e8f0';
                e.target.style.color = isDark ? '#9ca3af' : '#6b7280';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '16px 40px',
                background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #1E90FF 0%, #0066CC 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: isSubmitting ? 'none' : '0 10px 30px rgba(30, 144, 255, 0.4)',
                transition: 'all 0.3s ease',
                opacity: isSubmitting ? 0.7 : 1,
                minWidth: '200px',
                letterSpacing: '0.025em'
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 15px 40px rgba(30, 144, 255, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 30px rgba(30, 144, 255, 0.4)';
                }
              }}
            >
              {isSubmitting ? (
                <>
                  <div style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '10px'
                  }}></div>
                  Generating Questions...
                </>
              ) : (
                <>
                  🚀 Generate Questions
                </>
              )}
            </button>
          </div>
          
          {/* Error Message */}
          {errors.submit && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              color: '#dc2626',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {errors.submit}
            </div>
          )}
        </form>
      </div>
      
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default InterviewForm;