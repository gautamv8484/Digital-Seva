import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiZap,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';
import {
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaInstagram
} from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
                <FiZap />
              </div>
              <span className="footer-logo-text">
                Digital<span>Seva</span>
              </span>
            </Link>
            <p className="footer-brand-desc">
              India's most trusted digital platform for government services.
              Making public services accessible, efficient, and transparent for every citizen.
            </p>
            <div className="footer-socials">
              <a href="#twitter" className="social-link" aria-label="Twitter"><FaTwitter /></a>
              <a href="#linkedin" className="social-link" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#instagram" className="social-link" aria-label="Instagram"><FaInstagram /></a>
              <a href="#github" className="social-link" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Services</h4>
            <ul className="footer-links">
              <li><Link to="/services/identity">Identity Documents</Link></li>
              <li><Link to="/services/transport">Transport Services</Link></li>
              <li><Link to="/services/education">Education Services</Link></li>
              <li><Link to="/services/legal">Legal Certificates</Link></li>
              <li><Link to="/services/business">Business Services</Link></li>
              <li><Link to="/services/health">Health & Welfare</Link></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/track">Track Application</Link></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-links-group">
            <h4 className="footer-links-title">Contact Us</h4>
            <ul className="footer-contact">
              <li>
                <FiMail className="contact-icon" />
                <span>support@digitalseva.in</span>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <span>919974837395</span>
              </li>
              <li>
                <FiMapPin className="contact-icon" />
                <span>New Delhi, India 110001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Digital Seva Platform. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;