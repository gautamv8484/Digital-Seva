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
  FiShield,
  FiFile,
  FiX
} from 'react-icons/fi';
import { getServiceById } from '../data/serviceData';
import { useAuth } from '../context/AuthContext';
import '../styles/FormPage.css';

const FormPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const service = getServiceById(serviceId);
  
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Handle text/select input changes
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

  // Handle file upload - Convert to Base64
  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    const file = files[0];
    
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, [name]: 'File size must be less than 5MB' }));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, [name]: 'Only JPG, PNG, and PDF files are allowed' }));
      return;
    }

    try {
      // Convert file to Base64
      const base64 = await convertToBase64(file);
      
      setUploadedFiles((prev) => ({
        ...prev,
        [name]: {
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64,
          uploadedAt: new Date().toISOString()
        }
      }));

      // Mark as uploaded in formData
      setFormData((prev) => ({
        ...prev,
        [name]: file.name
      }));

      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: 'Failed to upload file. Please try again.' }));
    }
  };

  // Convert file to Base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Remove uploaded file
  const removeFile = (fieldName) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
    setFormData((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    service.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate Application ID
    const appId = 'DSP' + Date.now().toString().slice(-8);
    setApplicationId(appId);

    // Create application object with files
    const applicationData = {
      applicationId: appId,
      serviceId: service.id,
      serviceName: service.name,
      categoryId: service.categoryId,
      categoryName: service.categoryName,
      fee: service.fee,
      timeline: service.timeline,
      status: 'submitted',
      appliedDate: new Date().toISOString(),
      formData: formData,
      uploadedFiles: uploadedFiles, // 👈 Save files here!
      applicantName: formData.fullName || formData.applicantName || formData.studentName || formData.ownerName || formData.childName || formData.groomName || formData.headOfFamily || 'N/A',
      userId: isAuthenticated ? user?.id : null,
      userName: isAuthenticated ? user?.fullName : null,
      userMobile: isAuthenticated ? user?.mobile : (formData.mobile || null)
    };

    // Save to localStorage
    const existingApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
    existingApplications.push(applicationData);
    localStorage.setItem('digitalSevaApplications', JSON.stringify(existingApplications));

    setIsSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Success Screen
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
              
              {/* Show uploaded files count */}
              {Object.keys(uploadedFiles).length > 0 && (
                <div className="success-files-info">
                  <FiFile />
                  <span>{Object.keys(uploadedFiles).length} document(s) uploaded successfully</span>
                </div>
              )}

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
                          field.type === 'textarea' || field.type === 'file' ? 'form-group-full' : ''
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
                          <div className="file-upload-container">
                            {!uploadedFiles[field.name] ? (
                              <div className="file-upload-wrapper">
                                <input
                                  type="file"
                                  id={field.name}
                                  name={field.name}
                                  className="file-input"
                                  onChange={handleFileChange}
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label htmlFor={field.name} className="file-upload-label">
                                  <FiUpload className="upload-icon" />
                                  <span className="upload-text">Click to upload</span>
                                  <span className="upload-hint">PDF, JPG, PNG (Max 5MB)</span>
                                </label>
                              </div>
                            ) : (
                              <div className="file-uploaded">
                                <div className="file-info">
                                  <FiFile className="file-icon" />
                                  <div className="file-details">
                                    <span className="file-name">{uploadedFiles[field.name].name}</span>
                                    <span className="file-size">
                                      {formatFileSize(uploadedFiles[field.name].size)}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className="file-remove-btn"
                                  onClick={() => removeFile(field.name)}
                                >
                                  <FiX />
                                </button>
                              </div>
                            )}
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
                    <button 
                      type="submit" 
                      className="form-btn form-btn-submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="btn-spinner"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <FiCheck />
                        </>
                      )}
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