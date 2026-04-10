import React from 'react';
import {
  FiShield,
  FiClock,
  FiSmartphone,
  FiHeadphones,
  FiLock,
  FiGlobe
} from 'react-icons/fi';
import '.styles/WhyChooseUs.css';

const features = [
  {
    icon: <FiShield />,
    title: 'Government Authorized',
    description: 'Officially authorized platform connected directly with government departments.'
  },
  {
    icon: <FiClock />,
    title: 'Fast Processing',
    description: 'Average processing time 3x faster than traditional offline methods.'
  },
  {
    icon: <FiSmartphone />,
    title: 'Mobile Friendly',
    description: 'Apply from anywhere using your smartphone. Fully responsive and optimized.'
  },
  {
    icon: <FiHeadphones />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support via chat, email, and phone.'
  },
  {
    icon: <FiLock />,
    title: 'Bank-Grade Security',
    description: '256-bit encryption ensures your personal data is always protected.'
  },
  {
    icon: <FiGlobe />,
    title: 'Multi-Language',
    description: 'Available in 12+ regional languages for accessibility across India.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-section">
      <div className="container">
        <div className="why-choose-layout">
          <div className="why-choose-left">
            <h2 className="section-title">
              Why Citizens Trust
              <br />
              <span className="accent-text">Digital Seva</span>
            </h2>
            <p className="why-choose-desc">
              We're building the most trusted digital platform for government services.
              Our mission is to make every citizen's interaction with government
              seamless, transparent, and efficient.
            </p>
            <div className="why-choose-highlight">
              <div className="highlight-number">4.8★</div>
              <div className="highlight-text">
                <strong>Excellent Rating</strong>
                <span>Based on 50,000+ user reviews</span>
              </div>
            </div>
          </div>

          <div className="why-choose-right">
            <div className="features-grid">
              {features.map((feature, index) => (
                <div className="feature-card" key={index}>
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <div className="feature-content">
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-desc">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;