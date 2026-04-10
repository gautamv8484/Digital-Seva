import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiDollarSign, FiTrendingUp, FiArrowRight } from 'react-icons/fi';
import { getTrendingServices } from '../data/serviceData';
import './TrendingServices.css';

const TrendingServices = () => {
  const trending = getTrendingServices();

  return (
    <section className="trending-section">
      <div className="container">
        <div className="section-header">
          <div className="trending-label">
            <FiTrendingUp />
            <span>Most Popular</span>
          </div>
          <h2 className="section-title">Trending Services</h2>
          <p className="section-subtitle">
            Most applied services by citizens this month. Quick access to what you need.
          </p>
        </div>

        <div className="trending-grid">
          {trending.map((service) => (
            <Link
              to={`/apply/${service.id}`}
              key={service.id}
              className="trending-card"
            >
              <div className="trending-card-top">
                <span
                  className="trending-category-badge"
                  style={{ background: `${service.categoryColor}15`, color: service.categoryColor }}
                >
                  {service.categoryName.split(' ')[0]}
                </span>
                <div className="trending-popularity">
                  <div className="popularity-bar">
                    <div
                      className="popularity-fill"
                      style={{ width: `${service.popularity}%`, background: service.categoryColor }}
                    ></div>
                  </div>
                  <span className="popularity-text">{service.popularity}%</span>
                </div>
              </div>

              <h3 className="trending-name">{service.name}</h3>
              <p className="trending-desc">{service.description}</p>

              <div className="trending-meta">
                <div className="meta-item">
                  <FiDollarSign />
                  <span>{service.fee}</span>
                </div>
                <div className="meta-item">
                  <FiClock />
                  <span>{service.timeline}</span>
                </div>
              </div>

              <div className="trending-action">
                <span>Apply Now</span>
                <FiArrowRight className="action-arrow" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingServices;