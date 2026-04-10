import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiPhone, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight,
  FiAlertCircle,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path if any
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for mobile
    if (name === 'mobile') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.mobile.trim()) {
      setError('Mobile number is required');
      return false;
    }
    if (formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      await login(formData.mobile, formData.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <Link to="/" className="auth-logo">
              <div className="auth-logo-icon">
                <FiZap />
              </div>
              <span className="auth-logo-text">
                Digital<span>Seva</span>
              </span>
            </Link>
            
            <h1 className="auth-branding-title">
              Government Services,<br />
              <span>At Your Fingertips</span>
            </h1>
            
            <p className="auth-branding-desc">
              Apply for documents, certificates, and licenses from the comfort of your home. 
              No queues, no hassle.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>100% Online Process</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Track Application Status</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Secure & Reliable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Welcome Back!</h2>
              <p>Login to your account to continue</p>
            </div>

            {error && (
              <div className="auth-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-input-group">
                <label htmlFor="mobile">Mobile Number <span>*</span></label>
                <div className="auth-input-wrapper">
                  <FiPhone className="auth-input-icon" />
                  <span className="auth-country-code">+91</span>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    placeholder="Enter 10-digit mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="password">Password <span>*</span></label>
                <div className="auth-input-wrapper">
                  <FiLock className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="auth-options">
                <label className="auth-remember">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link to="/forgot-password" className="auth-forgot">
                  Forgot Password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>New to Digital Seva?</span>
            </div>

            <Link to="/register" className="auth-switch-btn">
              Create an Account
              <FiArrowRight />
            </Link>

            <p className="auth-terms">
              By logging in, you agree to our{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;