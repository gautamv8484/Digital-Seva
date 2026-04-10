import React from 'react';
import { FiSearch, FiFileText, FiSend, FiCheckCircle } from 'react-icons/fi';
import '../styles/HowItWorks.css';

const steps = [
  {
    icon: <FiSearch />,
    number: '01',
    title: 'Search Service',
    description: 'Find the service you need from our comprehensive catalog of government services.'
  },
  {
    icon: <FiFileText />,
    number: '02',
    title: 'Fill Application',
    description: 'Complete the simple online form with your details and upload required documents.'
  },
  {
    icon: <FiSend />,
    number: '03',
    title: 'Submit & Pay',
    description: 'Review your application, pay the nominal fee, and submit with one click.'
  },
  {
    icon: <FiCheckCircle />,
    number: '04',
    title: 'Track & Receive',
    description: 'Track your application in real-time and receive your document digitally.'
  }
];

const HowItWorks = () => {
  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get your documents and certificates in just four simple steps. No queues, no hassle.
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={index}>
              <div className="step-number">{step.number}</div>
              <div className="step-icon-wrapper">
                {step.icon}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="step-connector">
                  <div className="connector-line"></div>
                  <div className="connector-dot"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;