import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './components/ContactPage';
import ServicesPage from './pages/ServicesPage';
import FormPage from './pages/FormPage';
import TrackPage from './pages/TrackPage';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword'; // 👈 ADD THIS
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* User Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} /> {/* 👈 ADD THIS */}
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
              
              {/* Main Routes - With Navbar/Footer */}
              <Route path="/*" element={<MainLayout />} />
            </Routes>
          </div>
        </Router>
      </AdminProvider>
    </AuthProvider>
  );
}

// Separate layout for main pages
function MainLayout() {
  return (
    <>
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services/:categoryId" element={<ServicesPage />} />
          
          {/* Protected Routes - Login Required */}
          <Route 
            path="/apply/:serviceId" 
            element={
              <ProtectedRoute>
                <FormPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/track" 
            element={
              <ProtectedRoute>
                <TrackPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/Contact-Us" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;