import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FiShield, 
  FiUser, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight,
  FiAlertCircle,
  FiHome
} from 'react-icons/fi';
import { useAdmin } from 'contetexts/AdminContext';
import '../../styles/Admin.css';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await adminLogin(username, password);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <FiShield />
            </div>
            <h1>Admin Portal</h1>
            <p>Digital Seva Management System</p>
          </div>

          {error && (
            <div className="admin-error">
              <FiAlertCircle />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-input-group">
              <label htmlFor="username">Username</label>
              <div className="admin-input-wrapper">
                <FiUser className="admin-input-icon" />
                <input
                  type="text"
                  id="username"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label htmlFor="password">Password</label>
              <div className="admin-input-wrapper">
                <FiLock className="admin-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="admin-login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="admin-spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login to Dashboard
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <Link to="/" className="admin-back-link">
              <FiHome />
              Back to Main Site
            </Link>
          </div>

          <div className="admin-credentials-hint">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: <code>admin</code></p>
            <p>Password: <code>admin123</code></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;