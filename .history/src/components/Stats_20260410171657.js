import React, { useState, useEffect, useRef } from 'react';
import '../styles/Stats.css';

const statsData = [
  { value: 2500000, suffix: '+', label: 'Applications Processed', prefix: '' },
  { value: 350, suffix: '+', label: 'Services Available', prefix: '' },
  { value: 99.9, suffix: '%', label: 'Uptime Guaranteed', prefix: '' },
  { value: 28, suffix: '', label: 'States Covered', prefix: '' }
];

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
};

const Stats = () => {
  const [counters, setCounters] = useState(statsData.map(() => 0));
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters(statsData.map((stat) => stat.value * eased));

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [isVisible]);

  return (
    <section className="stats-section" ref={sectionRef}>
      <div className="container">
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <div className="stat-item" key={index}>
              <div className="stat-value">
                {stat.prefix}
                {stat.value >= 1000
                  ? formatNumber(Math.round(counters[index]))
                  : Number.isInteger(stat.value)
                    ? Math.round(counters[index])
                    : counters[index].toFixed(1)
                }
                {stat.suffix}
              </div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;