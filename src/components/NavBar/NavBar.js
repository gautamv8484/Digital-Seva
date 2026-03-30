import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiZap } from 'react-icons/fi';
import "./NavBar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${!isHomePage ? 'navbar-solid' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <FiZap />
          </div>
          <span className="logo-text">
            Digital<span className="logo-highlight">Seva</span>
          </span>
        </Link>

        <div className={`navbar-links ${isOpen ? 'navbar-links-active' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <a href="/#categories" className="nav-link">
            Services
          </a>
          <a href="/Contact-Us" className="nav-link">
            Contact Us
          </a>

          <a href="/#how-it-works" className="nav-link">
            How It Works
          </a>
          <div className="nav-actions-mobile">
            <Link to="/track" className="nav-btn nav-btn-outline">
              Track Status
            </Link>
            <Link to="/" className="nav-btn nav-btn-primary">
              Get Started
            </Link>
          </div>
        </div>

        <div className="nav-actions">
          <Link to="/track" className="nav-btn nav-btn-outline">
            Track Status
          </Link>
          <Link to="/" className="nav-btn nav-btn-primary">
            Get Started
          </Link>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isOpen && <div className="navbar-backdrop" onClick={() => setIsOpen(false)} />}
    </nav>
  );
};

export default Navbar;