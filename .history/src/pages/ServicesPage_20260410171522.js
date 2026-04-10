import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiDollarSign, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import {
  FaIdCard,
  FaCar,
  FaGraduationCap,
  FaFileAlt,
  FaBriefcase,
  FaHeartbeat
} from 'react-icons/fa';
import { getCategoryById, categories } from '../data/serviceData';
import '../ServicesPage.css';

const iconMap = {
  FaIdCard: FaIdCard,
  FaCar: FaCar,
  FaGraduationCap: FaGraduationCap,
  FaFileAlt: FaFileAlt,
  FaBriefcase: FaBriefcase,
  FaHeartbeat: FaHeartbeat
};

const ServicesPage = () => {
  const { categoryId } = useParams();
  const category = getCategoryById(categoryId);

  if (!category) {
    return (
      <div className="services-page">
        <div className="services-hero" style={{ background: 'var(--gradient-hero)' }}>
          <div className="container">
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <FiChevronRight />
              <span>Category Not Found</span>
            </div>
            <h1 className="services-hero-title">Category Not Found</h1>
            <p className="services-hero-desc">
              The category you're looking for doesn't exist.
            </p>
            <Link to="/" className="back-home-btn">
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[category.icon];

  return (
    <div className="services-page">
      <div
        className="services-hero"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <FiChevronRight />
            <span>{category.name}</span>
          </div>

          <div className="services-hero-content">
            <div
              className="services-hero-icon"
              style={{ background: category.gradient }}
            >
              {IconComponent && <IconComponent />}
            </div>
            <div>
              <h1 className="services-hero-title">{category.name}</h1>
              <p className="services-hero-desc">{category.description}</p>
              <p className="services-count">{category.services.length} services available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="services-content">
        <div className="container">
          <div className="services-layout">
            <aside className="services-sidebar">
              <div className="sidebar-card">
                <h3 className="sidebar-title">All Categories</h3>
                <ul className="sidebar-links">
                  {categories.map((cat) => {
                    const CatIcon = iconMap[cat.icon];
                    return (
                      <li key={cat.id}>
                        <Link
                          to={`/services/${cat.id}`}
                          className={`sidebar-link ${cat.id === categoryId ? 'active' : ''}`}
                        >
                          <span className="sidebar-link-icon" style={{ color: cat.color }}>
                            {CatIcon && <CatIcon />}
                          </span>
                          <span className="sidebar-link-text">{cat.shortName}</span>
                          <span className="sidebar-link-count">{cat.services.length}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="sidebar-card sidebar-help">
                <h3 className="sidebar-title">Need Help?</h3>
                <p className="sidebar-help-text">
                  Can't find the service you're looking for? Contact our support team.
                </p>
                <a href="tel:1800-XXX-XXXX" className="sidebar-help-btn">
                  Call 1800-XXX-XXXX
                </a>
              </div>
            </aside>

            <main className="services-main">
              <div className="services-grid">
                {category.services.map((service) => (
                  <Link
                    to={`/apply/${service.id}`}
                    key={service.id}
                    className="service-card"
                  >
                    <div className="service-card-header">
                      <h3 className="service-card-name">{service.name}</h3>
                      <div
                        className="service-popularity-badge"
                        style={{ background: `${category.color}15`, color: category.color }}
                      >
                        {service.popularity}% popular
                      </div>
                    </div>

                    <p className="service-card-desc">{service.description}</p>

                    <div className="service-card-details">
                      <div className="detail-item">
                        <FiDollarSign />
                        <span><strong>Fee:</strong> {service.fee}</span>
                      </div>
                      <div className="detail-item">
                        <FiClock />
                        <span><strong>Timeline:</strong> {service.timeline}</span>
                      </div>
                    </div>

                    <div className="service-card-footer">
                      <span className="apply-text">Apply Now</span>
                      <FiArrowRight className="apply-arrow" />
                    </div>
                  </Link>
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;