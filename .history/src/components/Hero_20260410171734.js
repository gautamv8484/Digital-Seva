import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiSearch, FiShield, FiClock } from 'react-icons/fi';
import '../styles/Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg-effects">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <div className="hero-orb hero-orb-3"></div>
        <div className="hero-grid-pattern"></div>
      </div>

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>Trusted by 2M+ Citizens Across India</span>
          </div>

          <h1 className="hero-title">
            Government Services,
            <br />
            <span className="hero-title-accent">Simplified.</span>
          </h1>

          <p className="hero-subtitle">
            Apply for documents, certificates, and licenses from the comfort of your home.
            Fast, secure, and hassle-free — the way public services should be.
          </p>

          <div className="hero-actions">
            <a href="#categories" className="hero-btn hero-btn-primary">
              Explore Services
              <FiArrowRight className="btn-icon" />
            </a>
            <Link to="/track" className="hero-btn hero-btn-secondary">
              <FiSearch className="btn-icon-left" />
              Track Application
            </Link>
          </div>

          <div className="hero-trust-indicators">
            <div className="trust-item">
              <FiShield className="trust-icon" />
              <span>100% Secure</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <FiClock className="trust-icon" />
              <span>Quick Processing</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <span className="trust-stars">★★★★★</span>
              <span>4.8/5 Rating</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card-stack">
            <div className="hero-float-card card-1">
              <div className="float-card-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>📄</div>
              <div>
                <div className="float-card-title">Aadhaar Card</div>
                <div className="float-card-status success">✓ Approved</div>
              </div>
            </div>
            <div className="hero-float-card card-2">
              <div className="float-card-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>🎓</div>
              <div>
                <div className="float-card-title">Scholarship</div>
                <div className="float-card-status pending">⏳ Processing</div>
              </div>
            </div>
            <div className="hero-float-card card-3">
              <div className="float-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>🚗</div>
              <div>
                <div className="float-card-title">Driving License</div>
                <div className="float-card-status success">✓ Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;