import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext(null);

// Default admin credentials (In production, use backend authentication)
const DEFAULT_ADMIN = {
  id: 'ADMIN001',
  username: 'admin',
  password: 'admin123', // Change this in production!
  name: 'Administrator',
  role: 'super_admin'
};

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if admin is already logged in
  useEffect(() => {
    const storedAdmin = localStorage.getItem('digitalSevaAdmin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  // Admin Login
  const adminLogin = (username, password) => {
    return new Promise((resolve, reject) => {
      // Check credentials
      if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
        const adminData = {
          id: DEFAULT_ADMIN.id,
          username: DEFAULT_ADMIN.username,
          name: DEFAULT_ADMIN.name,
          role: DEFAULT_ADMIN.role,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('digitalSevaAdmin', JSON.stringify(adminData));
        setAdmin(adminData);
        resolve(adminData);
      } else {
        reject({ message: 'Invalid admin credentials!' });
      }
    });
  };

  // Admin Logout
  const adminLogout = () => {
    localStorage.removeItem('digitalSevaAdmin');
    setAdmin(null);
  };

  // Get all applications
  const getAllApplications = () => {
    return JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
  };

  // Update application status
  const updateApplicationStatus = (applicationId, newStatus, adminNote = '') => {
    const applications = getAllApplications();
    const index = applications.findIndex(app => app.applicationId === applicationId);
    
    if (index !== -1) {
      applications[index].status = newStatus;
      applications[index].lastUpdated = new Date().toISOString();
      applications[index].updatedBy = admin?.name || 'Admin';
      
      // Add to status history
      if (!applications[index].statusHistory) {
        applications[index].statusHistory = [];
      }
      applications[index].statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        updatedBy: admin?.name || 'Admin',
        note: adminNote
      });

      localStorage.setItem('digitalSevaApplications', JSON.stringify(applications));
      return applications[index];
    }
    return null;
  };

  // Add admin note to application
  const addAdminNote = (applicationId, note) => {
    const applications = getAllApplications();
    const index = applications.findIndex(app => app.applicationId === applicationId);
    
    if (index !== -1) {
      if (!applications[index].adminNotes) {
        applications[index].adminNotes = [];
      }
      applications[index].adminNotes.push({
        note: note,
        timestamp: new Date().toISOString(),
        addedBy: admin?.name || 'Admin'
      });

      localStorage.setItem('digitalSevaApplications', JSON.stringify(applications));
      return applications[index];
    }
    return null;
  };

  // Delete application
  const deleteApplication = (applicationId) => {
    const applications = getAllApplications();
    const filtered = applications.filter(app => app.applicationId !== applicationId);
    localStorage.setItem('digitalSevaApplications', JSON.stringify(filtered));
    return true;
  };

  // Get application by ID
  const getApplicationById = (applicationId) => {
    const applications = getAllApplications();
    return applications.find(app => app.applicationId === applicationId) || null;
  };

  // Get statistics
  const getStats = () => {
    const applications = getAllApplications();
    return {
      total: applications.length,
      submitted: applications.filter(app => app.status === 'submitted').length,
      processing: applications.filter(app => app.status === 'processing').length,
      underReview: applications.filter(app => app.status === 'under-review').length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      completed: applications.filter(app => app.status === 'completed').length
    };
  };

  const value = {
    admin,
    loading,
    adminLogin,
    adminLogout,
    getAllApplications,
    updateApplicationStatus,
    addAdminNote,
    deleteApplication,
    getApplicationById,
    getStats,
    isAdminAuthenticated: !!admin
  };

  return (
    <AdminContext.Provider value={value}>
      {!loading && children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export default AdminContext;