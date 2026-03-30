import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiChevronRight,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiClock,
  FiDollarSign,
  FiArrowLeft,
  FiShield
} from 'react-icons/fi';
import { getServiceById } from '../../data/serviceData';
import './FormPage.css';

const FormPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = getServiceById(serviceId);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  if (!service) {
    return (
      <div className="form-page">
        <div className="form-hero">
          <div className="container">
            <h1>Service Not Found</h1>
            <Link to="/" className="back-home-btn">Go Back Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    service.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const appId = 'DSP' + Date.now().toString().slice(-8);
    setApplicationId(appId);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="form-page">
        <div className="form-hero">
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <FiChevronRight />
              <Link to={`/services/${service.categoryId}`}>{service.categoryName}</Link>
              <FiChevronRight />
              <span>{service.name}</span>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="success-container">
            <div className="success-card">
              <div className="success-icon-wrapper">
                <FiCheck />
              </div>
              <h2 className="success-title">Application Submitted Successfully!</h2>
              <p className="success-desc">
                Your application for <strong>{service.name}</strong> has been received and is being processed.
              </p>
              <div className="success-app-id">
                <span className="app-id-label">Your Application ID</span>
                <span className="app-id-value">{applicationId}</span>
              </div>
              <p className="success-note">
                Please save this Application ID. You can use it to track your application status.
              </p>
              <div className="success-actions">
                <Link to="/track" className="success-btn success-btn-primary">
                  Track Application
                </Link>
                <Link to="/" className="success-btn success-btn-secondary">
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
    <div className="form-page">
      <div className="form-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <FiChevronRight />
            <Link to={`/services/${service.categoryId}`}>{service.categoryName}</Link>
            <FiChevronRight />
            <span>{service.name}</span>
          </div>
          <h1 className="form-hero-title">{service.name}</h1>
          <p className="form-hero-desc">{service.description}</p>
        </div>
      </div>

      <div className="form-content">
        <div className="container">
          <div className="form-layout">
            <main className="form-main">
              <form onSubmit={handleSubmit} className="application-form" noValidate>
                <div className="form-card">
                  <div className="form-card-header">
                    <h2 className="form-card-title">Application Details</h2>
                    <p className="form-card-desc">
                      Fill in all required fields marked with <span className="required-star">*</span>
                    </p>
                  </div>

                  <div className="form-fields">
                    {service.fields.map((field) => (
                      <div
                        className={`form-group ${
                          field.type === 'textarea' ? 'form-group-full' : ''
                        } ${errors[field.name] ? 'has-error' : ''}`}
                        key={field.name}
                      >
                        <label className="form-label" htmlFor={field.name}>
                          {field.label}
                          {field.required && <span className="required-star">*</span>}
                        </label>

                        {field.type === 'select' ? (
                          <select
                            id={field.name}
                            name={field.name}
                            className="form-input form-select"
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={field.required}
                          >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === 'textarea' ? (
                          <textarea
                            id={field.name}
                            name={field.name}
                            className="form-input form-textarea"
                            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={field.required}
                            rows={3}
                          />
                        ) : field.type === 'file' ? (
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              id={field.name}
                              name={field.name}
                              className="file-input"
                              onChange={handleChange}
                              accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <label htmlFor={field.name} className="file-upload-label">
                              <FiUpload className="upload-icon" />
                              <span>
                                {formData[field.name]
                                  ? formData[field.name].name
                                  : 'Click to upload (PDF, JPG, PNG)'}
                              </span>
                            </label>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            id={field.name}
                            name={field.name}
                            className="form-input"
                            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                            value={formData[field.name] || ''}
                            onChange={handleChange}
                            required={field.required}
                          />
                        )}

                        {errors[field.name] && (
                          <span className="error-message">
                            <FiAlertCircle />
                            {errors[field.name]}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-submit-section">
                  <div className="form-agreement">
                    <input type="checkbox" id="agree" required />
                    <label htmlFor="agree">
                      I confirm that all the information provided is accurate and I agree to the
                      <a href="#terms"> Terms & Conditions</a>.
                    </label>
                  </div>

                  <div className="form-buttons">
                    <button
                      type="button"
                      className="form-btn form-btn-back"
                      onClick={() => navigate(-1)}
                    >
                      <FiArrowLeft />
                      Go Back
                    </button>
                    <button type="submit" className="form-btn form-btn-submit">
                      Submit Application
                      <FiCheck />
                    </button>
                  </div>
                </div>
              </form>
            </main>

            <aside className="form-sidebar">
              <div className="sidebar-card form-info-card">
                <h3 className="sidebar-title">Service Details</h3>
                <div className="info-item">
                  <FiDollarSign className="info-icon" />
                  <div>
                    <span className="info-label">Application Fee</span>
                    <span className="info-value">{service.fee}</span>
                  </div>
                </div>
                <div className="info-item">
                  <FiClock className="info-icon" />
                  <div>
                    <span className="info-label">Processing Time</span>
                    <span className="info-value">{service.timeline}</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-card form-docs-card">
                <h3 className="sidebar-title">Required Documents</h3>
                <ul className="docs-list">
                  <li><FiCheck className="doc-check" /> Government issued ID proof</li>
                  <li><FiCheck className="doc-check" /> Address proof</li>
                  <li><FiCheck className="doc-check" /> Recent passport size photo</li>
                  <li><FiCheck className="doc-check" /> Supporting documents</li>
                </ul>
              </div>

              <div className="sidebar-card form-secure-card">
                <div className="secure-header">
                  <FiShield className="secure-icon" />
                  <h3 className="sidebar-title">Secure Submission</h3>
                </div>
                <p className="secure-text">
                  Your data is encrypted with 256-bit SSL encryption. We never share your personal information.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;