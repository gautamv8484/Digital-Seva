import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiFileText,
  FiCalendar,
  FiDollarSign,
  FiRefreshCw,
  FiChevronRight,
  FiPackage,
  FiUser,
  FiPhone
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import '../styles/TrackPage.css';

const TrackPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userApplications, setUserApplications] = useState([]);

  // Load user's applications on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserApplications();
    }
  }, [isAuthenticated, user]);

  const loadUserApplications = () => {
    const allApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
    const myApplications = allApplications.filter(app => app.userId === user?.id);
    setUserApplications(myApplications);
  };

  // Get status details
  const getStatusDetails = (status) => {
    switch (status) {
      case 'submitted':
        return {
          label: 'Submitted',
          color: '#3b82f6',
          bgColor: '#eff6ff',
          icon: FiFileText,
          description: 'Your application has been received'
        };
      case 'processing':
        return {
          label: 'Processing',
          color: '#f59e0b',
          bgColor: '#fffbeb',
          icon: FiRefreshCw,
          description: 'Your application is being processed'
        };
      case 'under-review':
        return {
          label: 'Under Review',
          color: '#8b5cf6',
          bgColor: '#f5f3ff',
          icon: FiClock,
          description: 'Your application is under review'
        };
      case 'approved':
        return {
          label: 'Approved',
          color: '#22c55e',
          bgColor: '#f0fdf4',
          icon: FiCheckCircle,
          description: 'Your application has been approved'
        };
      case 'rejected':
        return {
          label: 'Rejected',
          color: '#ef4444',
          bgColor: '#fef2f2',
          icon: FiAlertCircle,
          description: 'Your application was rejected'
        };
      case 'completed':
        return {
          label: 'Completed',
          color: '#10b981',
          bgColor: '#ecfdf5',
          icon: FiCheckCircle,
          description: 'Your document is ready'
        };
      default:
        return {
          label: 'Pending',
          color: '#6b7280',
          bgColor: '#f3f4f6',
          icon: FiClock,
          description: 'Status pending'
        };
    }
  };

  // Search for application
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (!searchId.trim()) {
      setSearchError('Please enter an Application ID');
      return;
    }

    setLoading(true);
    setSearchError('');
    setSearchResult(null);

    // Simulate API call
    setTimeout(() => {
      const allApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
      const found = allApplications.find(
        app => app.applicationId.toLowerCase() === searchId.trim().toLowerCase()
      );

      if (found) {
        setSearchResult(found);
      } else {
        setSearchError('No application found with this ID. Please check and try again.');
      }
      setLoading(false);
    }, 1000);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="track-page">
      {/* Hero Section */}
      <div className="track-hero">
        <div className="container">
          <h1 className="track-hero-title">Track Your Application</h1>
          <p className="track-hero-desc">
            Enter your Application ID to check the current status of your application
          </p>
        </div>
      </div>

      <div className="container">
        {/* Search Section */}
        <section className="track-search-section">
          <div className="track-search-card">
            <form onSubmit={handleSearch} className="track-search-form">
              <div className="track-search-input-wrapper">
                <FiSearch className="track-search-icon" />
                <input
                  type="text"
                  placeholder="Enter Application ID (e.g., DSP12345678)"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value.toUpperCase());
                    setSearchError('');
                  }}
                  className="track-search-input"
                />
              </div>
              <button type="submit" className="track-search-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="track-spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>
                    <FiSearch />
                    Track Status
                  </>
                )}
              </button>
            </form>

            {searchError && (
              <div className="track-error">
                <FiAlertCircle />
                <span>{searchError}</span>
              </div>
            )}
          </div>
        </section>

        {/* Search Result */}
        {searchResult && (
          <section className="track-result-section">
            <div className="track-result-card">
              <div className="track-result-header">
                <div className="track-result-title">
                  <FiPackage className="track-result-icon" />
                  <div>
                    <h2>{searchResult.serviceName}</h2>
                    <span className="track-app-id">ID: {searchResult.applicationId}</span>
                  </div>
                </div>
                <div 
                  className="track-status-badge"
                  style={{ 
                    backgroundColor: getStatusDetails(searchResult.status).bgColor,
                    color: getStatusDetails(searchResult.status).color
                  }}
                >
                  {React.createElement(getStatusDetails(searchResult.status).icon)}
                  {getStatusDetails(searchResult.status).label}
                </div>
              </div>

              <div className="track-result-body">
                <div className="track-info-grid">
                  <div className="track-info-item">
                    <FiUser className="track-info-icon" />
                    <div>
                      <span className="track-info-label">Applicant Name</span>
                      <span className="track-info-value">{searchResult.applicantName || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="track-info-item">
                    <FiPhone className="track-info-icon" />
                    <div>
                      <span className="track-info-label">Mobile Number</span>
                      <span className="track-info-value">{searchResult.userMobile || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="track-info-item">
                    <FiCalendar className="track-info-icon" />
                    <div>
                      <span className="track-info-label">Applied On</span>
                      <span className="track-info-value">{formatDate(searchResult.appliedDate)}</span>
                    </div>
                  </div>
                  <div className="track-info-item">
                    <FiDollarSign className="track-info-icon" />
                    <div>
                      <span className="track-info-label">Fee Paid</span>
                      <span className="track-info-value">{searchResult.fee || '₹0'}</span>
                    </div>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="track-timeline">
                  <h3>Application Progress</h3>
                  <div className="timeline-steps">
                    <div className={`timeline-step ${['submitted', 'processing', 'under-review', 'approved', 'completed'].includes(searchResult.status) ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Application Submitted</span>
                        <span className="timeline-date">{formatDate(searchResult.appliedDate)}</span>
                      </div>
                    </div>
                    <div className={`timeline-step ${['processing', 'under-review', 'approved', 'completed'].includes(searchResult.status) ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Processing</span>
                        <span className="timeline-date">{searchResult.status === 'submitted' ? 'Pending' : 'In Progress'}</span>
                      </div>
                    </div>
                    <div className={`timeline-step ${['under-review', 'approved', 'completed'].includes(searchResult.status) ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Under Review</span>
                        <span className="timeline-date">{['under-review', 'approved', 'completed'].includes(searchResult.status) ? 'Reviewed' : 'Pending'}</span>
                      </div>
                    </div>
                    <div className={`timeline-step ${['approved', 'completed'].includes(searchResult.status) ? 'completed' : ''} ${searchResult.status === 'rejected' ? 'rejected' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">{searchResult.status === 'rejected' ? 'Rejected' : 'Approved'}</span>
                        <span className="timeline-date">{['approved', 'completed', 'rejected'].includes(searchResult.status) ? 'Done' : 'Pending'}</span>
                      </div>
                    </div>
                    <div className={`timeline-step ${searchResult.status === 'completed' ? 'completed' : ''}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <span className="timeline-title">Document Ready</span>
                        <span className="timeline-date">{searchResult.status === 'completed' ? 'Ready for download' : 'Pending'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div 
                  className="track-status-message"
                  style={{ 
                    backgroundColor: getStatusDetails(searchResult.status).bgColor,
                    borderColor: getStatusDetails(searchResult.status).color
                  }}
                >
                  {React.createElement(getStatusDetails(searchResult.status).icon, {
                    style: { color: getStatusDetails(searchResult.status).color }
                  })}
                  <p>{getStatusDetails(searchResult.status).description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* User's Applications (if logged in) */}
        {isAuthenticated && (
          <section className="track-my-applications">
            <div className="section-header">
              <h2>My Applications</h2>
              <p>All your submitted applications</p>
            </div>

            {userApplications.length > 0 ? (
              <div className="applications-grid">
                {userApplications.map((app) => {
                  const statusInfo = getStatusDetails(app.status);
                  return (
                    <div key={app.applicationId} className="application-card">
                      <div className="application-card-header">
                        <h3>{app.serviceName}</h3>
                        <span 
                          className="application-status"
                          style={{ 
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="application-card-body">
                        <div className="application-detail">
                          <span className="detail-label">Application ID</span>
                          <span className="detail-value">{app.applicationId}</span>
                        </div>
                        <div className="application-detail">
                          <span className="detail-label">Applied On</span>
                          <span className="detail-value">{formatDate(app.appliedDate)}</span>
                        </div>
                        <div className="application-detail">
                          <span className="detail-label">Fee</span>
                          <span className="detail-value">{app.fee}</span>
                        </div>
                      </div>
                      <button 
                        className="application-track-btn"
                        onClick={() => {
                          setSearchId(app.applicationId);
                          setSearchResult(app);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        View Details
                        <FiChevronRight />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no-applications">
                <FiPackage className="no-app-icon" />
                <h3>No Applications Yet</h3>
                <p>You haven't submitted any applications yet.</p>
                <Link to="/#categories" className="browse-services-btn">
                  Browse Services
                  <FiChevronRight />
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Not Logged In Message */}
        {!isAuthenticated && (
          <section className="track-login-prompt">
            <div className="login-prompt-card">
              <FiUser className="login-prompt-icon" />
              <h3>Login to View All Applications</h3>
              <p>Create an account or login to track all your applications in one place</p>
              <div className="login-prompt-actions">
                <Link to="/login" className="login-prompt-btn primary">
                  Login
                </Link>
                <Link to="/register" className="login-prompt-btn secondary">
                  Register
                </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default TrackPage;