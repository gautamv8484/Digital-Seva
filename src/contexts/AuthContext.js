import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const storedUser = localStorage.getItem('digitalSevaUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Register new user
  const register = (userData) => {
    return new Promise((resolve, reject) => {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
      
      // Check if mobile number already exists
      const userExists = existingUsers.find(u => u.mobile === userData.mobile);
      if (userExists) {
        reject({ message: 'Mobile number already registered!' });
        return;
      }

      // Create new user
      const newUser = {
        id: 'USER' + Date.now(),
        fullName: userData.fullName,
        mobile: userData.mobile,
        email: userData.email || '',
        password: userData.password, // In production, hash this!
        createdAt: new Date().toISOString(),
        applications: []
      };

      // Save to users list
      existingUsers.push(newUser);
      localStorage.setItem('digitalSevaUsers', JSON.stringify(existingUsers));

      // Auto login after register
      const userForSession = { ...newUser };
      delete userForSession.password;
      localStorage.setItem('digitalSevaUser', JSON.stringify(userForSession));
      setUser(userForSession);

      resolve(userForSession);
    });
  };

  // Login user
  const login = (mobile, password) => {
    return new Promise((resolve, reject) => {
      const existingUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
      
      const user = existingUsers.find(
        u => u.mobile === mobile && u.password === password
      );

      if (!user) {
        reject({ message: 'Invalid mobile number or password!' });
        return;
      }

      const userForSession = { ...user };
      delete userForSession.password;
      localStorage.setItem('digitalSevaUser', JSON.stringify(userForSession));
      setUser(userForSession);

      resolve(userForSession);
    });
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('digitalSevaUser');
    setUser(null);
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const existingUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
    const userIndex = existingUsers.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      existingUsers[userIndex] = { ...existingUsers[userIndex], ...updatedData };
      localStorage.setItem('digitalSevaUsers', JSON.stringify(existingUsers));
      
      const userForSession = { ...existingUsers[userIndex] };
      delete userForSession.password;
      localStorage.setItem('digitalSevaUser', JSON.stringify(userForSession));
      setUser(userForSession);
    }
  };

  // Add application to user's history
  const addApplication = (applicationData) => {
    const existingUsers = JSON.parse(localStorage.getItem('digitalSevaUsers') || '[]');
    const userIndex = existingUsers.findIndex(u => u.id === user.id);
    
    if (userIndex !== -1) {
      if (!existingUsers[userIndex].applications) {
        existingUsers[userIndex].applications = [];
      }
      existingUsers[userIndex].applications.push(applicationData);
      localStorage.setItem('digitalSevaUsers', JSON.stringify(existingUsers));
      
      const userForSession = { ...existingUsers[userIndex] };
      delete userForSession.password;
      localStorage.setItem('digitalSevaUser', JSON.stringify(userForSession));
      setUser(userForSession);
    }
    
    // Also save to global applications list (for admin)
    const allApplications = JSON.parse(localStorage.getItem('digitalSevaApplications') || '[]');
    allApplications.push({
      ...applicationData,
      oderId: user.id,
      userName: user.fullName,
      userMobile: user.mobile
    });
    localStorage.setItem('digitalSevaApplications', JSON.stringify(allApplications));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
    updateProfile,
    addApplication,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;