import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser,
  FiPhone, 
  FiMail,
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight,
  FiAlertCircle,
  FiCheck,
  FiZap
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import 'styles/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

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

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, text: 'Weak', color: '#ef4444' };
    if (strength <= 3) return { strength: 66, text: 'Medium', color: '#f59e0b' };
    return { strength: 100, text: 'Strong', color: '#22c55e' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (formData.fullName.trim().length < 3) {
      setError('Name must be at least 3 characters');
      return false;
    }
    if (!formData.mobile.trim()) {
      setError('Mobile number is required');
      return false;
    }
    if (formData.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms & Conditions');
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
      await register({
        fullName: formData.fullName.trim(),
        mobile: formData.mobile,
        email: formData.email.trim(),
        password: formData.password
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
              Join Digital Seva<br />
              <span>Today!</span>
            </h1>
            
            <p className="auth-branding-desc">
              Create your account and get access to 350+ government services. 
              Apply from anywhere, anytime.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Free Registration</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Track All Applications</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Get Document Updates via SMS</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
            </div>

            {error && (
              <div className="auth-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {/* Full Name */}
              <div className="auth-input-group">
                <label htmlFor="fullName">Full Name <span>*</span></label>
                <div className="auth-input-wrapper">
                  <FiUser className="auth-input-icon" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="auth-input-group">
                <label htmlFor="mobile">
                  Mobile Number <span>*</span>
                  <small>(You'll login with this)</small>
                </label>
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
                  {formData.mobile.length === 10 && (
                    <FiCheck className="auth-input-valid" />
                  )}
                </div>
              </div>

              {/* Email (Optional) */}
              <div className="auth-input-group">
                <label htmlFor="email">
                  Email Address <small>(Optional)</small>
                </label>
                <div className="auth-input-wrapper">
                  <FiMail className="auth-input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email (optional)"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="auth-input-group">
                <label htmlFor="password">Password <span>*</span></label>
                <div className="auth-input-wrapper">
                  <FiLock className="auth-input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="Create a password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {formData.password && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      <div 
                        className="password-strength-fill"
                        style={{ 
                          width: `${passwordStrength.strength}%`,
                          backgroundColor: passwordStrength.color 
                        }}
                      ></div>
                    </div>
                    <span style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="auth-input-group">
                <label htmlFor="confirmPassword">Confirm Password <span>*</span></label>
                <div className="auth-input-wrapper">
                  <FiLock className="auth-input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <FiCheck className="auth-input-valid" />
                  )}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="auth-terms-checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                  <span>
                    I agree to the{' '}
                    <Link to="/terms">Terms & Conditions</Link> and{' '}
                    <Link to="/privacy">Privacy Policy</Link>
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="auth-spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <FiArrowRight />
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>

            <Link to="/login" className="auth-switch-btn">
              Login to Your Account
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;