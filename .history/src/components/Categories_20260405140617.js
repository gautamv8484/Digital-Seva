import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import {
  FaIdCard,
  FaCar,
  FaGraduationCap,
  FaFileAlt,
  FaBriefcase,
  FaHeartbeat
} from 'react-icons/fa';
import { categories } from '../data/serviceData';
import './Categories.css';

const iconMap = {
  FaIdCard: FaIdCard,
  FaCar: FaCar,
  FaGraduationCap: FaGraduationCap,
  FaFileAlt: FaFileAlt,
  FaBriefcase: FaBriefcase,
  FaHeartbeat: FaHeartbeat
};

const Categories = () => {
  return (
    <section className="categories-section" id="categories">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">
            Find the right service across six major categories covering all your essential needs.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon];
            return (
              <Link
                to={`/services/${category.id}`}
                key={category.id}
                className="category-card"
              >
                <div
                  className="category-icon-wrapper"
                  style={{ background: category.gradient }}
                >
                  {IconComponent && <IconComponent className="category-icon" />}
                </div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-desc">{category.description}</p>
                  <div className="category-meta">
                    <span className="service-count">
                      {category.services.length} Services
                    </span>
                    <span className="category-arrow">
                      <FiArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;