import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiPhone, 
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiZap,
  FiHome,
  FiKey
} from 'react-icons/fi';
import '../../styles/Auth.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter mobile, 2: Verify & Reset
  const [mobile, setMobile] = useState('');
  const [userFound, setUserFound] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Step 1: Find user by mobile
  const handleFindUser = (e) => {
    e.preventDefault();
    
    if (!mobile.trim()) {
      setError('Mobile number is required');
      return;
    }
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
      const user = users.find(u => u.mobile === mobile);

      if (user) {
        setUserFound(user);
        setStep(2);
      } else {
        setError('No account found with this mobile number');
      }
      setLoading(false);
    }, 1000);
  };

  // Step 2: Reset password
  const handleResetPassword = (e) => {
    e.preventDefault();

    if (!newPassword) {
      setError('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    // Update password
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
      const userIndex = users.findIndex(u => u.mobile === mobile);

      if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('digitalSevaUsers', JSON.stringify(users));
        setSuccess(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setLoading(false);
    }, 1000);
  };

  // Success Screen
  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ gridTemplateColumns: '1fr' }}>
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="forgot-password-success">
                <div className="success-icon-large">
                  <FiCheckCircle />
                </div>
                <h2>Password Reset Successful!</h2>
                <p>Your password has been changed successfully.</p>
                <p className="success-subtitle">You can now login with your new password.</p>
                
                <Link to="/login" className="auth-submit-btn" style={{ marginTop: '1.5rem' }}>
                  Go to Login
                  <FiArrowRight />
                </Link>

                <Link to="/" className="forgot-back-home" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                  <FiHome />
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              Forgot Your<br />
              <span>Password?</span>
            </h1>
            
            <p className="auth-branding-desc">
              Don't worry! Enter your registered mobile number and we'll help you reset your password.
            </p>

            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Secure Password Reset</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>No OTP Required</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">✓</span>
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>{step === 1 ? 'Reset Password' : 'Create New Password'}</h2>
              <p>
                {step === 1 
                  ? 'Enter your registered mobile number'
                  : `Reset password for ${userFound?.fullName}`
                }
              </p>
            </div>

            {/* Step Indicator */}
            <div className="reset-steps">
              <div className={`reset-step ${step >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Enter Mobile</span>
              </div>
              <div className="step-line"></div>
              <div className={`reset-step ${step >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Reset Password</span>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            {/* Step 1: Enter Mobile */}
            {step === 1 && (
              <form onSubmit={handleFindUser} className="auth-form">
                <div className="auth-input-group">
                  <label htmlFor="mobile">Registered Mobile Number</label>
                  <div className="auth-input-wrapper">
                    <FiPhone className="auth-input-icon" />
                    <span className="auth-country-code">+91</span>
                    <input
                      type="tel"
                      id="mobile"
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={(e) => {
                        const numericValue = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setMobile(numericValue);
                        setError('');
                      }}
                      maxLength={10}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="auth-spinner"></span>
                      Searching...
                    </>
                  ) : (
                    <>
                      Continue
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: Reset Password */}
            {step === 2 && (
              <form onSubmit={handleResetPassword} className="auth-form">
                <div className="user-info-box">
                  <FiCheckCircle className="user-found-icon" />
                  <div>
                    <strong>{userFound?.fullName}</strong>
                    <span>{userFound?.mobile}</span>
                  </div>
                </div>

                <div className="auth-input-group">
                  <label htmlFor="newPassword">New Password</label>
                  <div className="auth-input-wrapper">
                    <FiKey className="auth-input-icon" />
                    <input
                      type="password"
                      id="newPassword"
                      placeholder="Enter new password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError('');
                      }}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <div className="auth-input-wrapper">
                    <FiKey className="auth-input-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="auth-spinner"></span>
                      Resetting...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <FiCheckCircle />
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={() => {
                    setStep(1);
                    setUserFound(null);
                    setNewPassword('');
                    setConfirmPassword('');
                    setError('');
                  }}
                  className="auth-switch-btn"
                  style={{ marginTop: '0.5rem' }}
                >
                  Use Different Mobile Number
                </button>
              </form>
            )}

            <div className="auth-divider">
              <span>Remember your password?</span>
            </div>

            <Link to="/login" className="auth-switch-btn">
              Back to Login
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;