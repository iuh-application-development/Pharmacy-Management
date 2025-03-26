import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import Features from '../components/Features';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <Banner />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;