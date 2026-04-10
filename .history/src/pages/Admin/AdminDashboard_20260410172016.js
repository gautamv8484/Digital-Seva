import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiFileText,
  FiUsers,
  FiLogOut,
  FiFilter,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiXCircle,
  FiPackage,
  FiTrendingUp,
  FiChevronDown,
  FiX,
  FiSave,
  FiMessageSquare,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiKey,
  FiEyeOff,
  FiFile,
  FiDownload
} from 'react-icons/fi';

import { useAdmin } from '../../contexts/AdminContext';
import '../styles/Admin.css';

const AdminDashboard = () => {
  const { 
    admin, 
    adminLogout, 
    getAllApplications, 
    updateApplicationStatus,
    deleteApplication,
    getStats 
  } = useAdmin();
  
  const navigate = useNavigate();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Applications state
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

  // Users state
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDeleteConfirm, setShowUserDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
    loadUsers();
  }, []);

  // Load applications data
  const loadData = () => {
    const apps = getAllApplications();
    setApplications(apps);
    setFilteredApplications(apps);
    setStats(getStats());
  };

  // Load users data
  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
    const allApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
    
    const usersWithStats = allUsers.map(user => {
      const userApplications = allApplications.filter(app => app.userId === user.id);
      return {
        ...user,
        totalApplications: userApplications.length,
        applications: userApplications
      };
    });
    
    setUsers(usersWithStats);
    setFilteredUsers(usersWithStats);
  };

  // Filter applications
  useEffect(() => {
    let filtered = [...applications];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.applicationId.toLowerCase().includes(query) ||
        app.serviceName.toLowerCase().includes(query) ||
        app.applicantName?.toLowerCase().includes(query) ||
        app.userMobile?.includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    filtered.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    setFilteredApplications(filtered);
  }, [searchQuery, statusFilter, applications]);

  // Filter users
  useEffect(() => {
    if (userSearchQuery.trim()) {
      const query = userSearchQuery.toLowerCase();
      const filtered = users.filter(user =>
        user.fullName.toLowerCase().includes(query) ||
        user.mobile.includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [userSearchQuery, users]);

  // Handle logout
  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
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

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'submitted': { label: 'Submitted', color: '#3b82f6', bg: '#eff6ff', icon: FiFileText },
      'processing': { label: 'Processing', color: '#f59e0b', bg: '#fffbeb', icon: FiRefreshCw },
      'under-review': { label: 'Under Review', color: '#8b5cf6', bg: '#f5f3ff', icon: FiClock },
      'approved': { label: 'Approved', color: '#22c55e', bg: '#f0fdf4', icon: FiCheckCircle },
      'rejected': { label: 'Rejected', color: '#ef4444', bg: '#fef2f2', icon: FiXCircle },
      'completed': { label: 'Completed', color: '#10b981', bg: '#ecfdf5', icon: FiCheckCircle }
    };
    return statusConfig[status] || statusConfig['submitted'];
  };

  // Open status update modal
  const openStatusModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status);
    setAdminNote('');
    setShowModal(true);
  };

  // Update application status
  const handleStatusUpdate = () => {
    if (selectedApp && newStatus) {
      updateApplicationStatus(selectedApp.applicationId, newStatus, adminNote);
      loadData();
      setShowModal(false);
      setSelectedApp(null);
      setAdminNote('');
    }
  };

  // Delete application
  const handleDeleteApp = () => {
    if (appToDelete) {
      deleteApplication(appToDelete.applicationId);
      loadData();
      setShowDeleteConfirm(false);
      setAppToDelete(null);
    }
  };

  // View user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
    setShowResetPassword(false);
    setNewPassword('');
  };

  // Reset user password
  const handleResetPassword = () => {
    if (selectedUser && newPassword.length >= 6) {
      const allUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
      const userIndex = allUsers.findIndex(u => u.id === selectedUser.id);
      
      if (userIndex !== -1) {
        allUsers[userIndex].password = newPassword;
        localStorage.setItem('digitalSevaUsers', JSON.stringify(allUsers));
        
        alert(`Password reset successful!\n\nNew Password: ${newPassword}\n\nPlease share this with the user securely.`);
        
        setShowResetPassword(false);
        setNewPassword('');
        loadUsers();
      }
    } else {
      alert('Password must be at least 6 characters');
    }
  };

  // Delete user
  const handleDeleteUser = () => {
    if (userToDelete) {
      const allUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
      const filteredUsersList = allUsers.filter(u => u.id !== userToDelete.id);
      localStorage.setItem('digitalSevaUsers', JSON.stringify(filteredUsersList));
      
      const allApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
      const filteredApps = allApplications.filter(app => app.userId !== userToDelete.id);
      localStorage.setItem('digitalSevaApplications', JSON.stringify(filteredApps));
      
      loadUsers();
      loadData();
      setShowUserDeleteConfirm(false);
      setUserToDelete(null);
      setShowUserModal(false);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Stats cards
  const statsCards = [
    { label: 'Total Applications', value: stats.total || 0, icon: FiPackage, color: '#3b82f6' },
    { label: 'Total Users', value: users.length, icon: FiUsers, color: '#8b5cf6' },
    { label: 'New/Submitted', value: stats.submitted || 0, icon: FiFileText, color: '#f59e0b' },
    { label: 'Completed', value: stats.completed || 0, icon: FiTrendingUp, color: '#10b981' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <FiPackage />
            <span>Digital Seva</span>
          </div>
          <span className="admin-badge">Admin</span>
        </div>

        <nav className="admin-nav">
          <button 
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiHome />
            <span>Dashboard</span>
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <FiFileText />
            <span>Applications</span>
          </button>
          <button 
            className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers />
            <span>Users</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="admin-user-details">
              <span className="admin-user-name">{admin?.name || 'Admin'}</span>
              <span className="admin-user-role">{admin?.role || 'Administrator'}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-header-left">
            <h1>
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'applications' && 'Applications'}
              {activeTab === 'users' && 'User Management'}
            </h1>
            <p>
              {activeTab === 'dashboard' && 'Overview of all activities'}
              {activeTab === 'applications' && 'Manage all service applications'}
              {activeTab === 'users' && 'Manage registered users'}
            </p>
          </div>
          <div className="admin-header-right">
            <Link to="/" className="admin-view-site-btn" target="_blank">
              <FiHome />
              View Site
            </Link>
          </div>
        </header>

        {/* ==================== DASHBOARD TAB ==================== */}
        {activeTab === 'dashboard' && (
          <>
            <section className="admin-stats-section">
              <div className="admin-stats-grid-dashboard">
                {statsCards.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="admin-stat-card">
                      <div className="admin-stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                        <IconComponent />
                      </div>
                      <div className="admin-stat-info">
                        <span className="admin-stat-value">{stat.value}</span>
                        <span className="admin-stat-label">{stat.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <div className="dashboard-quick-links">
              <div className="quick-link-card" onClick={() => setActiveTab('applications')}>
                <FiFileText />
                <h3>Manage Applications</h3>
                <p>View and update application statuses</p>
              </div>
              <div className="quick-link-card" onClick={() => setActiveTab('users')}>
                <FiUsers />
                <h3>Manage Users</h3>
                <p>View user details and manage accounts</p>
              </div>
            </div>

            {/* Recent Applications Preview */}
            <section className="admin-recent-section">
              <div className="recent-header">
                <h2>Recent Applications</h2>
                <button onClick={() => setActiveTab('applications')} className="view-all-btn">
                  View All
                </button>
              </div>
              <div className="recent-list">
                {applications.slice(0, 5).map((app) => {
                  const statusInfo = getStatusBadge(app.status);
                  return (
                    <div key={app.applicationId} className="recent-item">
                      <div className="recent-item-left">
                        <span className="recent-app-id">{app.applicationId}</span>
                        <span className="recent-service">{app.serviceName}</span>
                      </div>
                      <div className="recent-item-right">
                        <span 
                          className="recent-status"
                          style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                        >
                          {statusInfo.label}
                        </span>
                        <span className="recent-date">{formatDate(app.appliedDate)}</span>
                      </div>
                    </div>
                  );
                })}
                {applications.length === 0 && (
                  <div className="recent-empty">
                    <p>No applications yet</p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ==================== APPLICATIONS TAB ==================== */}
        {activeTab === 'applications' && (
          <section className="admin-table-section">
            <div className="admin-table-header">
              <h2>All Applications ({filteredApplications.length})</h2>
              <div className="admin-table-actions">
                <div className="admin-search-box">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="Search by ID, name, mobile..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="admin-clear-search">
                      <FiX />
                    </button>
                  )}
                </div>

                <div className="admin-filter-box">
                  <FiFilter />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="processing">Processing</option>
                    <option value="under-review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <button onClick={loadData} className="admin-refresh-btn">
                  <FiRefreshCw />
                </button>
              </div>
            </div>

            {filteredApplications.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Application ID</th>
                      <th>Service</th>
                      <th>Applicant</th>
                      <th>Mobile</th>
                      <th>Applied On</th>
                      <th>Fee</th>
                      <th>Documents</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => {
                      const statusInfo = getStatusBadge(app.status);
                      const StatusIcon = statusInfo.icon;
                      const docsCount = app.uploadedFiles ? Object.keys(app.uploadedFiles).length : 0;
                      return (
                        <tr key={app.applicationId}>
                          <td>
                            <span className="app-id-cell">{app.applicationId}</span>
                          </td>
                          <td>
                            <div className="service-cell">
                              <span className="service-name">{app.serviceName}</span>
                              <span className="service-category">{app.categoryName}</span>
                            </div>
                          </td>
                          <td>{app.applicantName || 'N/A'}</td>
                          <td>{app.userMobile || 'N/A'}</td>
                          <td>{formatDate(app.appliedDate)}</td>
                          <td>{app.fee}</td>
                          <td>
                            <span className={`docs-badge ${docsCount > 0 ? 'has-docs' : 'no-docs'}`}>
                              <FiFile />
                              {docsCount} file{docsCount !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                            >
                              <StatusIcon />
                              {statusInfo.label}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="action-btn view-btn"
                                title="View & Edit"
                                onClick={() => openStatusModal(app)}
                              >
                                <FiEye />
                              </button>
                              <button 
                                className="action-btn delete-btn"
                                title="Delete"
                                onClick={() => {
                                  setAppToDelete(app);
                                  setShowDeleteConfirm(true);
                                }}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-no-data">
                <FiPackage />
                <h3>No Applications Found</h3>
                <p>
                  {searchQuery || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'No applications have been submitted yet'
                  }
                </p>
              </div>
            )}
          </section>
        )}

        {/* ==================== USERS TAB ==================== */}
        {activeTab === 'users' && (
          <section className="admin-table-section">
            <div className="admin-table-header">
              <h2>All Users ({filteredUsers.length})</h2>
              <div className="admin-table-actions">
                <div className="admin-search-box">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="Search by name, mobile, email..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                  />
                  {userSearchQuery && (
                    <button onClick={() => setUserSearchQuery('')} className="admin-clear-search">
                      <FiX />
                    </button>
                  )}
                </div>

                <button onClick={loadUsers} className="admin-refresh-btn">
                  <FiRefreshCw />
                </button>
              </div>
            </div>

            {filteredUsers.length > 0 ? (
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Full Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Registered On</th>
                      <th>Applications</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <span className="user-id-cell">{user.id}</span>
                        </td>
                        <td>
                          <div className="user-name-cell">
                            <div className="user-avatar-small">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span>{user.fullName}</span>
                          </div>
                        </td>
                        <td>
                          <span className="mobile-cell">{user.mobile}</span>
                        </td>
                        <td>{user.email || 'Not provided'}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <span className="apps-count-badge">
                            {user.totalApplications} apps
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="action-btn view-btn"
                              title="View Details"
                              onClick={() => viewUserDetails(user)}
                            >
                              <FiEye />
                            </button>
                            <button
                              className="action-btn delete-btn"
                              title="Delete User"
                              onClick={() => {
                                setUserToDelete(user);
                                setShowUserDeleteConfirm(true);
                              }}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-no-data">
                <FiUsers />
                <h3>No Users Found</h3>
                <p>
                  {userSearchQuery
                    ? 'Try adjusting your search criteria'
                    : 'No users have registered yet'}
                </p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* ==================== APPLICATION MODAL WITH DOCUMENTS ==================== */}
      {showModal && selectedApp && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Application Details</h2>
              <button onClick={() => setShowModal(false)} className="admin-modal-close">
                <FiX />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* Basic Info */}
              <div className="modal-info-grid">
                <div className="modal-info-item">
                  <label>Application ID</label>
                  <span>{selectedApp.applicationId}</span>
                </div>
                <div className="modal-info-item">
                  <label>Service</label>
                  <span>{selectedApp.serviceName}</span>
                </div>
                <div className="modal-info-item">
                  <label>Applicant Name</label>
                  <span>{selectedApp.applicantName || 'N/A'}</span>
                </div>
                <div className="modal-info-item">
                  <label>Mobile</label>
                  <span>{selectedApp.userMobile || 'N/A'}</span>
                </div>
                <div className="modal-info-item">
                  <label>Applied On</label>
                  <span>{formatDate(selectedApp.appliedDate)}</span>
                </div>
                <div className="modal-info-item">
                  <label>Fee</label>
                  <span>{selectedApp.fee}</span>
                </div>
              </div>

              {/* Form Data */}
              {selectedApp.formData && (
                <div className="modal-form-data">
                  <h3>Submitted Information</h3>
                  <div className="form-data-grid">
                    {Object.entries(selectedApp.formData).map(([key, value]) => {
                      if (typeof value === 'object' && value !== null) return null;
                      return (
                        <div key={key} className="form-data-item">
                          <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                          <span>{value || 'N/A'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ========== UPLOADED DOCUMENTS SECTION ========== */}
              {selectedApp.uploadedFiles && Object.keys(selectedApp.uploadedFiles).length > 0 && (
                <div className="modal-documents-section">
                  <h3>
                    <FiFile />
                    Uploaded Documents ({Object.keys(selectedApp.uploadedFiles).length})
                  </h3>
                  <div className="documents-grid">
                    {Object.entries(selectedApp.uploadedFiles).map(([fieldName, file]) => (
                      <div key={fieldName} className="document-card">
                        <div className="document-preview">
                          {file.type && file.type.startsWith('image/') ? (
                            <img src={file.data} alt={file.name} />
                          ) : (
                            <div className="document-pdf-icon">
                              <FiFile />
                              <span>PDF</span>
                            </div>
                          )}
                        </div>
                        <div className="document-info">
                          <span className="document-field-name">
                            {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <span className="document-file-name">{file.name}</span>
                          <span className="document-file-size">
                            {formatFileSize(file.size)}
                          </span>
                        </div>
                        <div className="document-actions">
                          <a 
                            href={file.data} 
                            download={file.name}
                            className="document-download-btn"
                            title="Download"
                          >
                            <FiDownload />
                          </a>
                          <button
                            className="document-view-btn"
                            onClick={() => window.open(file.data, '_blank')}
                            title="View Full"
                          >
                            <FiEye />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Documents Message */}
              {(!selectedApp.uploadedFiles || Object.keys(selectedApp.uploadedFiles).length === 0) && (
                <div className="modal-no-documents">
                  <FiFile />
                  <p>No documents uploaded with this application</p>
                </div>
              )}

              {/* Update Status */}
              <div className="modal-status-update">
                <h3>Update Status</h3>
                <div className="status-select-wrapper">
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="status-select"
                  >
                    <option value="submitted">Submitted</option>
                    <option value="processing">Processing</option>
                    <option value="under-review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                  <FiChevronDown className="select-arrow" />
                </div>

                <div className="admin-note-input">
                  <label>
                    <FiMessageSquare />
                    Add Note (Optional)
                  </label>
                  <textarea
                    placeholder="Add a note about this status update..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Status History */}
              {selectedApp.statusHistory && selectedApp.statusHistory.length > 0 && (
                <div className="modal-status-history">
                  <h3>Status History</h3>
                  <div className="status-history-list">
                    {selectedApp.statusHistory.map((history, index) => (
                      <div key={index} className="status-history-item">
                        <div className="history-dot"></div>
                        <div className="history-content">
                          <span className="history-status">{getStatusBadge(history.status).label}</span>
                          <span className="history-date">{formatDate(history.timestamp)}</span>
                          {history.note && <p className="history-note">{history.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button onClick={() => setShowModal(false)} className="modal-btn cancel-btn">
                Cancel
              </button>
              <button onClick={handleStatusUpdate} className="modal-btn save-btn">
                <FiSave />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== USER DETAILS MODAL ==================== */}
      {showUserModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="admin-modal admin-modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>User Details</h2>
              <button onClick={() => setShowUserModal(false)} className="admin-modal-close">
                <FiX />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* User Profile Card */}
              <div className="user-detail-card">
                <div className="user-detail-avatar">
                  {selectedUser.fullName.charAt(0).toUpperCase()}
                </div>
                <h3>{selectedUser.fullName}</h3>
                <span className="user-detail-id">{selectedUser.id}</span>
              </div>

              {/* User Info Grid */}
              <div className="user-info-grid">
                <div className="user-info-item">
                  <FiPhone className="info-icon" />
                  <div>
                    <label>Mobile Number</label>
                    <span>{selectedUser.mobile}</span>
                  </div>
                </div>
                <div className="user-info-item">
                  <FiMail className="info-icon" />
                  <div>
                    <label>Email Address</label>
                    <span>{selectedUser.email || 'Not provided'}</span>
                  </div>
                </div>
                <div className="user-info-item">
                  <FiCalendar className="info-icon" />
                  <div>
                    <label>Registered On</label>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                </div>
                <div className="user-info-item">
                  <FiPackage className="info-icon" />
                  <div>
                    <label>Total Applications</label>
                    <span>{selectedUser.totalApplications}</span>
                  </div>
                </div>
              </div>

              {/* Password Reset Section */}
              <div className="user-password-section">
                <div className="password-warning">
                  <FiAlertCircle />
                  <div>
                    <strong>Security Notice</strong>
                    <p>Passwords are encrypted and cannot be viewed. You can only reset passwords.</p>
                  </div>
                </div>

                {!showResetPassword ? (
                  <button 
                    className="reset-password-btn"
                    onClick={() => setShowResetPassword(true)}
                  >
                    <FiKey />
                    Reset User Password
                  </button>
                ) : (
                  <div className="reset-password-form">
                    <label>New Password (min 6 characters)</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                      />
                      <button 
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    <div className="reset-password-actions">
                      <button 
                        onClick={() => {
                          setShowResetPassword(false);
                          setNewPassword('');
                        }}
                        className="cancel-btn-small"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleResetPassword}
                        className="save-btn-small"
                        disabled={newPassword.length < 6}
                      >
                        <FiSave />
                        Reset Password
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* User's Applications */}
              {selectedUser.applications && selectedUser.applications.length > 0 && (
                <div className="user-applications-section">
                  <h3>User's Applications ({selectedUser.applications.length})</h3>
                  <div className="user-applications-list">
                    {selectedUser.applications.map((app) => {
                      const statusInfo = getStatusBadge(app.status);
                      return (
                        <div key={app.applicationId} className="user-app-item">
                          <div className="user-app-left">
                            <span className="user-app-id">{app.applicationId}</span>
                            <span className="user-app-service">{app.serviceName}</span>
                          </div>
                          <div className="user-app-right">
                            <span 
                              className="user-app-status"
                              style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}
                            >
                              {statusInfo.label}
                            </span>
                            <span className="user-app-date">{formatDate(app.appliedDate)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button 
                onClick={() => {
                  setUserToDelete(selectedUser);
                  setShowUserDeleteConfirm(true);
                }} 
                className="modal-btn delete-btn"
              >
                <FiTrash2 />
                Delete User
              </button>
              <button onClick={() => setShowUserModal(false)} className="modal-btn cancel-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE APPLICATION CONFIRM ==================== */}
      {showDeleteConfirm && appToDelete && (
        <div className="admin-modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="admin-modal admin-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Confirm Delete</h2>
              <button onClick={() => setShowDeleteConfirm(false)} className="admin-modal-close">
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="delete-confirm-content">
                <FiAlertCircle className="delete-warning-icon" />
                <p>Are you sure you want to delete this application?</p>
                <span className="delete-app-id">{appToDelete.applicationId}</span>
                <p className="delete-warning-text">This action cannot be undone.</p>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowDeleteConfirm(false)} className="modal-btn cancel-btn">
                Cancel
              </button>
              <button onClick={handleDeleteApp} className="modal-btn delete-btn">
                <FiTrash2 />
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== DELETE USER CONFIRM ==================== */}
      {showUserDeleteConfirm && userToDelete && (
        <div className="admin-modal-overlay" onClick={() => setShowUserDeleteConfirm(false)}>
          <div className="admin-modal admin-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Confirm Delete User</h2>
              <button onClick={() => setShowUserDeleteConfirm(false)} className="admin-modal-close">
                <FiX />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="delete-confirm-content">
                <FiAlertCircle className="delete-warning-icon" />
                <p>Are you sure you want to delete this user?</p>
                <div className="user-delete-info">
                  <strong>{userToDelete.fullName}</strong>
                  <span>{userToDelete.mobile}</span>
                </div>
                <p className="delete-warning-text">
                  ⚠️ This will also delete all {userToDelete.totalApplications} application(s) by this user.
                  <br />This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowUserDeleteConfirm(false)} className="modal-btn cancel-btn">
                Cancel
              </button>
              <button onClick={handleDeleteUser} className="modal-btn delete-btn">
                <FiTrash2 />
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;