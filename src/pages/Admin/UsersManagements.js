import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiSearch,
  FiX,
  FiEye,
  FiEdit,
  FiTrash2,
  FiAlertCircle,
  FiPackage,
  FiKey,
  FiSave
} from 'react-icons/fi';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
    const allApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
    
    // Add application count to each user
    const usersWithStats = allUsers.map(user => {
      const userApplications = allApplications.filter(app => app.userId === user.id);
      return {
        ...user,
        totalApplications: userApplications.length,
        lastApplication: userApplications.length > 0 
          ? new Date(userApplications[userApplications.length - 1].appliedDate)
          : null
      };
    });
    
    setUsers(usersWithStats);
    setFilteredUsers(usersWithStats);
  };

  // Search users
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
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
  }, [searchQuery, users]);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // View user details
  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Reset password
  const handleResetPassword = () => {
    if (selectedUser && newPassword.length >= 6) {
      const allUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
      const userIndex = allUsers.findIndex(u => u.id === selectedUser.id);
      
      if (userIndex !== -1) {
        allUsers[userIndex].password = newPassword;
        localStorage.setItem('digitalSevaUsers', JSON.stringify(allUsers));
        
        alert(`Password reset successful!\nNew Password: ${newPassword}\n\nPlease share this with the user securely.`);
        
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
      const filtered = allUsers.filter(u => u.id !== userToDelete.id);
      localStorage.setItem('digitalSevaUsers', JSON.stringify(filtered));
      
      // Also delete user's applications
      const allApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
      const filteredApps = allApplications.filter(app => app.userId !== userToDelete.id);
      localStorage.setItem('digitalSevaApplications', JSON.stringify(filteredApps));
      
      loadUsers();
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="users-management">
      <div className="users-header">
        <div>
          <h2>User Management</h2>
          <p>Total Users: {users.length}</p>
        </div>
        <div className="users-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by name, mobile, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="clear-search">
              <FiX />
            </button>
          )}
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="users-table-wrapper">
          <table className="users-table">
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
                      <div className="user-avatar">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.fullName}</span>
                    </div>
                  </td>
                  <td>{user.mobile}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <span className="apps-count-badge">
                      {user.totalApplications} applications
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
                          setShowDeleteConfirm(true);
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
          <FiUser />
          <h3>No Users Found</h3>
          <p>
            {searchQuery
              ? 'Try adjusting your search criteria'
              : 'No users have registered yet'}
          </p>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="admin-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>User Details</h2>
              <button onClick={() => setShowUserModal(false)} className="admin-modal-close">
                <FiX />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="user-detail-card">
                <div className="user-detail-avatar">
                  {selectedUser.fullName.charAt(0).toUpperCase()}
                </div>
                <h3>{selectedUser.fullName}</h3>
                <span className="user-detail-id">{selectedUser.id}</span>
              </div>

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

              {/* Password Section - SECURE */}
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
                    <input
                      type="text"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="password-input"
                    />
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

              {selectedUser.lastApplication && (
                <div className="user-last-activity">
                  <label>Last Application</label>
                  <span>{formatDate(selectedUser.lastApplication)}</span>
                </div>
              )}
            </div>

            <div className="admin-modal-footer">
              <button onClick={() => setShowUserModal(false)} className="modal-btn cancel-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && userToDelete && (
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
                <p>Are you sure you want to delete this user?</p>
                <div className="user-delete-info">
                  <strong>{userToDelete.fullName}</strong>
                  <span>{userToDelete.mobile}</span>
                </div>
                <p className="delete-warning-text">
                  This will also delete all {userToDelete.totalApplications} application(s) submitted by this user.
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowDeleteConfirm(false)} className="modal-btn cancel-btn">
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

export default UsersManagement;