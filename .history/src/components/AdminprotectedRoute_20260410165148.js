import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';

const AdminProtectedRoute = ({ children }) => {
  const { isAdminAuthenticated, loading } = useAdmin();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <div className="admin-loading-spinner"></div>
        <p>Loading Admin Panel...</p>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;