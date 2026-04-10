import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiZap } from "react-icons/fi";
import { useAuth } from '../context/AuthContext';
import "../styles/NavBar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isHomePage = location.pathname === "/";

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  // Handle home click - scroll to top
  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  // Handle hash link click (for sections on home page)
  const handleHashClick = (e, hash) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (isHomePage) {
      // Already on home page, just scroll
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page first, then scroll
      navigate('/' + hash);
    }
  };

  // Handle regular link click
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    setIsOpen(false);
    navigate(path);
  };

  return (
    <nav
      className={`navbar ${scrolled ? "navbar-scrolled" : ""} ${
        !isHomePage ? "navbar-solid" : ""
      }`}
    >
      <div className="navbar-container">
        
        {/* LOGO */}
        <a href="/" className="navbar-logo" onClick={handleHomeClick}>
          <div className="logo-icon">
            <FiZap />
          </div>
          <span className="logo-text">
            Digital<span className="logo-highlight">Seva</span>
          </span>
        </a>

        {/* NAV LINKS */}
        <div className={`navbar-links ${isOpen ? "navbar-links-active" : ""}`}>
          
          {/* Close button for mobile */}
          <button className="mobile-close-btn" onClick={() => setIsOpen(false)}>
            <FiX />
          </button>

          {/* HOME */}
          <a 
            href="/" 
            className="nav-link" 
            onClick={handleHomeClick}
          >
            Home
          </a>

          {/* SERVICES */}
          <a 
            href="/#categories" 
            className="nav-link"
            onClick={(e) => handleHashClick(e, '#categories')}
          >
            Services
          </a>

          {/* CONTACT */}
          <a 
            href="/Contact-Us" 
            className="nav-link"
            onClick={(e) => handleLinkClick(e, '/Contact-Us')}
          >
            Contact Us
          </a>

          {/* HOW IT WORKS */}
          <a 
            href="/#how-it-works" 
            className="nav-link"
            onClick={(e) => handleHashClick(e, '#how-it-works')}
          >
            How It Works
          </a>

          {/* MOBILE BUTTONS */}
          <div className="nav-actions-mobile">
            {isAuthenticated ? (
              <>
                <div className="nav-user-info-mobile">
                  <div className="nav-user-avatar-mobile">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="nav-user-details-mobile">
                    <span className="nav-user-name-mobile">{user?.fullName}</span>
                    <span className="nav-user-phone-mobile">{user?.mobile}</span>
                  </div>
                </div>
                <a 
                  href="/track" 
                  className="nav-btn nav-btn-outline"
                  onClick={(e) => handleLinkClick(e, '/track')}
                >
                  Track Status
                </a>
                <button onClick={handleLogout} className="nav-btn nav-btn-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <a 
                  href="/login" 
                  className="nav-btn nav-btn-outline"
                  onClick={(e) => handleLinkClick(e, '/login')}
                >
                  Login
                </a>
                <a 
                  href="/register" 
                  className="nav-btn nav-btn-primary"
                  onClick={(e) => handleLinkClick(e, '/register')}
                >
                  Register
                </a>
              </>
            )}
          </div>
        </div>

        {/* DESKTOP BUTTONS */}
        <div className="nav-actions">
          {isAuthenticated ? (
            <>
              <div className="nav-user-info">
                <span className="nav-user-name">Hi, {user?.fullName?.split(' ')[0]}</span>
              </div>
              <Link to="/track" className="nav-btn nav-btn-outline">
                Track Status
              </Link>
              <button onClick={handleLogout} className="nav-btn nav-btn-primary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn nav-btn-outline">
                Login
              </Link>
              <Link to="/register" className="nav-btn nav-btn-primary">
                Register
              </Link>
            </>
          )}
        </div>

        {/* TOGGLE BUTTON */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div className="navbar-backdrop" onClick={() => setIsOpen(false)} />
      )}
    </nav>
  );
};

export default Navbar;
