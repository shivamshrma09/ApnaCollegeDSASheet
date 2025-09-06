import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

const AdminFeedbackDashboard = ({ isDark }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    priority: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchFeedbacks();
  }, [filters, currentPage]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });

      const response = await axios.get(`${API_BASE_URL}/feedback?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setFeedbacks(response.data.feedbacks);
      setStats(response.data.stats);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
    setLoading(false);
  };

  const updateFeedbackStatus = async (id, status, priority, adminNotes) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/feedback/${id}`, {
        status,
        priority,
        adminNotes
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      fetchFeedbacks(); // Refresh the list
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: '💭',
      bug: '🐛',
      feature: '✨',
      improvement: '🚀'
    };
    return icons[category] || '💭';
  };

  const getStatusColor = (status) => {
    const colors = {
      new: '#ef4444',
      reviewed: '#f59e0b',
      resolved: '#10b981',
      closed: '#6b7280'
    };
    return colors[status] || '#6b7280';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626'
    };
    return colors[priority] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        color: isDark ? '#e5e7eb' : '#374151'
      }}>
        <div>Loading feedback...</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: isDark ? '#e5e7eb' : '#1f2937',
            marginBottom: '8px'
          }}>
            Feedback Dashboard
          </h1>
          <p style={{
            color: isDark ? '#9ca3af' : '#6b7280',
            fontSize: '16px'
          }}>
            Manage and respond to user feedback
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: isDark ? '#374151' : 'white',
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: isDark ? '#e5e7eb' : '#1f2937'
            }}>
              {stats.totalFeedbacks || 0}
            </div>
            <div style={{
              fontSize: '14px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Total Feedbacks
            </div>
          </div>

          <div style={{
            backgroundColor: isDark ? '#374151' : 'white',
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🐛</div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ef4444'
            }}>
              {feedbacks.filter(f => f.category === 'bug').length}
            </div>
            <div style={{
              fontSize: '14px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Bug Reports
            </div>
          </div>

          <div style={{
            backgroundColor: isDark ? '#374151' : 'white',
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>✨</div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#3b82f6'
            }}>
              {feedbacks.filter(f => f.category === 'feature').length}
            </div>
            <div style={{
              fontSize: '14px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Feature Requests
            </div>
          </div>

          <div style={{
            backgroundColor: isDark ? '#374151' : 'white',
            padding: '20px',
            borderRadius: '12px',
            border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#f59e0b'
            }}>
              {feedbacks.filter(f => f.status === 'new').length}
            </div>
            <div style={{
              fontSize: '14px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Pending Review
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: isDark ? '#374151' : 'white',
          padding: '20px',
          borderRadius: '12px',
          border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: isDark ? '#e5e7eb' : '#374151'
              }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  color: isDark ? '#e5e7eb' : '#374151'
                }}
              >
                <option value="all">All Categories</option>
                <option value="general">General</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: isDark ? '#e5e7eb' : '#374151'
              }}>
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  color: isDark ? '#e5e7eb' : '#374151'
                }}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="reviewed">Reviewed</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: isDark ? '#e5e7eb' : '#374151'
              }}>
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({...filters, priority: e.target.value})}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  color: isDark ? '#e5e7eb' : '#374151'
                }}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {feedbacks.map((feedback) => (
            <div key={feedback._id} style={{
              backgroundColor: isDark ? '#374151' : 'white',
              border: `1px solid ${isDark ? '#4b5563' : '#e5e7eb'}`,
              borderRadius: '12px',
              padding: '24px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontSize: '20px' }}>
                      {getCategoryIcon(feedback.category)}
                    </span>
                    <span style={{
                      backgroundColor: getStatusColor(feedback.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {feedback.status.toUpperCase()}
                    </span>
                    <span style={{
                      backgroundColor: getPriorityColor(feedback.priority),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {feedback.priority.toUpperCase()}
                    </span>
                    <span style={{
                      color: isDark ? '#9ca3af' : '#6b7280',
                      fontSize: '12px'
                    }}>
                      {feedback.category} • {feedback.sheetType}
                    </span>
                  </div>
                  
                  <div style={{
                    color: isDark ? '#9ca3af' : '#6b7280',
                    fontSize: '14px',
                    marginBottom: '8px'
                  }}>
                    From: {feedback.userName} ({feedback.userEmail})
                  </div>
                  
                  <div style={{
                    color: isDark ? '#e5e7eb' : '#1f2937',
                    fontSize: '16px',
                    lineHeight: '1.5',
                    marginBottom: '12px'
                  }}>
                    {feedback.feedback}
                  </div>
                  
                  <div style={{
                    color: isDark ? '#9ca3af' : '#6b7280',
                    fontSize: '12px'
                  }}>
                    Submitted: {new Date(feedback.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  minWidth: '120px'
                }}>
                  <select
                    value={feedback.status}
                    onChange={(e) => updateFeedbackStatus(feedback._id, e.target.value, feedback.priority, feedback.adminNotes)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                      backgroundColor: isDark ? '#1f2937' : 'white',
                      color: isDark ? '#e5e7eb' : '#374151',
                      fontSize: '12px'
                    }}
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <select
                    value={feedback.priority}
                    onChange={(e) => updateFeedbackStatus(feedback._id, feedback.status, e.target.value, feedback.adminNotes)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${isDark ? '#4b5563' : '#d1d5db'}`,
                      backgroundColor: isDark ? '#1f2937' : 'white',
                      color: isDark ? '#e5e7eb' : '#374151',
                      fontSize: '12px'
                    }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              {feedback.adminNotes && (
                <div style={{
                  backgroundColor: isDark ? '#1f2937' : '#f3f4f6',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '12px'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    marginBottom: '4px'
                  }}>
                    Admin Notes:
                  </div>
                  <div style={{
                    color: isDark ? '#e5e7eb' : '#374151',
                    fontSize: '14px'
                  }}>
                    {feedback.adminNotes}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '32px'
          }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === 1 ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            
            <span style={{
              color: isDark ? '#e5e7eb' : '#374151',
              fontSize: '14px'
            }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 16px',
                backgroundColor: currentPage === totalPages ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedbackDashboard;