import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { searchServices } from '../data/serviceData';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length > 1) {
      const filtered = searchServices(query);
      setResults(filtered.slice(0, 6));
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleServiceClick = (serviceId) => {
    navigate(`/apply/${serviceId}`);
    setShowResults(false);
    setQuery('');
  };

  return (
    <section className="search-section">
      <div className="container">
        <div className="search-wrapper" ref={searchRef}>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for any service... (e.g., Aadhaar, PAN Card, Driving License)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim().length > 1 && setShowResults(true)}
              className="search-input"
            />
            <button className="search-btn">
              Search
              <FiArrowRight />
            </button>
          </div>

          {showResults && results.length > 0 && (
            <div className="search-results">
              {results.map((service) => (
                <div
                  key={service.id}
                  className="search-result-item"
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="result-info">
                    <span className="result-name">{service.name}</span>
                    <span className="result-category">{service.categoryName}</span>
                  </div>
                  <FiArrowRight className="result-arrow" />
                </div>
              ))}
            </div>
          )}

          {showResults && query.trim().length > 1 && results.length === 0 && (
            <div className="search-results">
              <div className="search-no-results">
                No services found for "{query}"
              </div>
            </div>
          )}
        </div>

        <div className="search-suggestions">
          <span className="suggestion-label">Popular:</span>
          {['Aadhaar Card', 'PAN Card', 'Driving License', 'Passport', 'Income Certificate'].map((item) => (
            <button
              key={item}
              className="suggestion-tag"
              onClick={() => setQuery(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchBar;