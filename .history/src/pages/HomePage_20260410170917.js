import React from 'react';
import Hero from '../components/Hero/Hero';
import SearchBar from '../components/SearchBar/SearchBar';
import Categories from '../components/Categories';
import TrendingServices from '../components/TrendingServices';
import HowItWorks from '../components/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs';
import Stats from '../components/Stats';

const HomePage = () => {
  return (
    <>
      <Hero />
      <SearchBar />
      <Categories />
      <TrendingServices />
      <HowItWorks />
      <WhyChooseUs />
      <Stats />
    </>
  );
};

export default HomePage;