import React from 'react';
import Hero from '../components/Hero/Hero';
import SearchBar from '../components/SearchBar/SearchBar';
import Categories from '../components/Categories/Categories';
import TrendingServices from '../components/TrendingServices/TrendingServices';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import Stats from '../components/Stats/Stats';

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