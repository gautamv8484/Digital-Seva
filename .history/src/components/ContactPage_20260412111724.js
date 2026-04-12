import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheck,
  FiAlertCircle,
  FiChevronRight,
  FiMessageSquare,
  FiHeadphones,
  FiCalendar
} from 'react-icons/fi';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const contactMethods = [
    {
      id: 1,
      icon: FiPhone,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      details: '+91 99748 37395',
      subtext: 'Monday - Friday, 9AM - 6PM EST',
      color: 'primary'
    },
    {
      id: 2,
      icon: FiMail,
      title: 'Email Support',
      description: 'Send us your queries anytime',
      details: 'support@dspportal.com',
      subtext: 'Response within 24 hours',
      color: 'success'
    },
    {
      id: 3,
      icon: FiMapPin,
      title: 'Visit Us',
      description: 'Come visit our office',
      details: '123 Government Plaza, City Center',
      subtext: 'New York, NY 10001',
      color: 'danger'
    },
    {
      id: 4,
      icon: FiClock,
      title: 'Live Chat',
      description: 'Chat with our support team',
      details: 'Available Now',
      subtext: '24/7 Support',
      color: 'warning'
    }
  ];

  const faqs = [
    {
      id: 1,
      question: 'How long does it take to process my application?',
      answer: 'Processing time varies by service type. Most applications are processed within 5-10 business days. You can check your application status using your Application ID.'
    },
    {
      id: 2,
      question: 'What documents do I need to submit?',
      answer: 'Required documents depend on the service you are applying for. Please check the specific service page for a complete list of required documents.'
    },
    {
      id: 3,
      question: 'Can I edit my application after submission?',
      answer: 'Once submitted, applications cannot be directly edited. However, you can contact our support team to request modifications within 24 hours of submission.'
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept credit cards (Visa, Mastercard, American Express), debit cards, and bank transfers for application fees.'
    },
    {
      id: 5,
      question: 'How can I track my application status?',
      answer: 'You can track your application status using your Application ID on our Track Application page. Updates are sent via email regularly.'
    },
    {
      id: 6,
      question: 'Is my personal information secure?',
      answer: 'Yes, we use 256-bit SSL encryption to protect all personal information. Your data is never shared with third parties without consent.'
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="contact-hero">
          <div className="contact-hero-content">
            <h1 className="contact-hero-title">Get in Touch</h1>
            <p className="contact-hero-desc">We're here to help and answer any question you might have</p>
          </div>
        </div>

        <div className="container">
          <div className="success-message-container">
            <div className="success-message-card">
              <div className="success-message-icon">
                <FiCheck />
              </div>
              <h2 className="success-message-title">Message Sent Successfully!</h2>
              <p className="success-message-text">
                Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
              </p>
              <p className="success-message-subtext">
                Our team typically responds within 24 business hours.
              </p>
              <div className="success-message-actions">
                <Link to="/" className="success-message-btn">
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
    <div className="contact-page" id="Contact-Us">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Get in Touch</h1>
          <p className="contact-hero-desc">We're here to help and answer any question you might have</p>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="container">
        <section className="contact-methods-section">
          <div className="section-header">
            <h2>Contact Methods</h2>
            <p>Choose the best way to reach us</p>
          </div>

          <div className="contact-methods-grid">
            {contactMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.id} className={`contact-method-card contact-method-${method.color}`}>
                  <div className="contact-method-icon">
                    <IconComponent />
                  </div>
                  <h3 className="contact-method-title">{method.title}</h3>
                  <p className="contact-method-desc">{method.description}</p>
                  <div className="contact-method-details">
                    <p className="contact-method-main">{method.details}</p>
                    <p className="contact-method-sub">{method.subtext}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-form-section">
          <div className="contact-form-wrapper">
            <div className="contact-form-header">
              <h2>Send us a Message</h2>
              <p>Fill out the form below and we'll get back to you shortly</p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="form-row">
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className={`form-input ${errors.name ? 'has-error' : ''}`}
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <span className="error-text">
                        <FiAlertCircle /> {errors.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${errors.email ? 'has-error' : ''}`}
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <span className="error-text">
                        <FiAlertCircle /> {errors.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className={`form-input ${errors.phone ? 'has-error' : ''}`}
                      placeholder="+1 (800) 123-4567"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && (
                      <span className="error-text">
                        <FiAlertCircle /> {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-col">
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className={`form-input ${errors.subject ? 'has-error' : ''}`}
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                    {errors.subject && (
                      <span className="error-text">
                        <FiAlertCircle /> {errors.subject}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  className={`form-textarea ${errors.message ? 'has-error' : ''}`}
                  placeholder="Tell us more about your inquiry..."
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                />
                {errors.message && (
                  <span className="error-text">
                    <FiAlertCircle /> {errors.message}
                  </span>
                )}
                <span className="char-count">
                  {formData.message.length} / 1000 characters
                </span>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Box */}
          <div className="contact-info-box">
            <div className="contact-info-item">
              <FiClock className="contact-info-icon" />
              <h4>Business Hours</h4>
              <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
              <p>Saturday - Sunday: Closed</p>
            </div>

            <div className="contact-info-item">
              <FiHeadphones className="contact-info-icon" />
              <h4>Support Available</h4>
              <p>Email support: 24/7</p>
              <p>Phone support: During business hours</p>
            </div>

            <div className="contact-info-item">
              <FiMessageSquare className="contact-info-icon" />
              <h4>Response Time</h4>
              <p>Average: 2-4 hours</p>
              <p>Maximum: 24 business hours</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Find answers to common questions about our services</p>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <details key={faq.id} className="faq-item">
                <summary className="faq-question">
                  <span>{faq.question}</span>
                  <FiChevronRight className="faq-icon" />
                </summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="contact-cta-section">
          <div className="cta-content">
            <FiCalendar className="cta-icon" />
            <h2>Need Immediate Assistance?</h2>
            <p>Schedule a consultation with our support team</p>
            <button className="cta-btn">
              Schedule a Call
              <FiChevronRight />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;