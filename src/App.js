import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ContactPage from './components/ContactUs/ContactPage';
import ServicesPage from './pages/ServicesPage/ServicesPage';
import FormPage from './pages/FormPage/FormPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services/:categoryId" element={<ServicesPage />} />
            <Route path="/apply/:serviceId" element={<FormPage />} />
            <Route path="/Contact-Us" element={<ContactPage />} />
            {/* <Route path="/track" element={<TrackPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;