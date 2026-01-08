import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Homepage from './views/homepage';
import AdminDashboard from './views/adminDashboard';
import CreateSurveyPage from './views/addSurvey';

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <Homepage 
              onLoginSuccess={() => setIsAdminLoggedIn(true)}
              isAdminLoggedIn={isAdminLoggedIn}
              onLogout={() => setIsAdminLoggedIn(false)}
            />
          } 
        />

        <Route 
          path="/admin" 
          element={
            isAdminLoggedIn ? (
              <AdminDashboard 
                onLogout={() => setIsAdminLoggedIn(false)} 
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route 
          path="/admin/create-survey" 
          element={
            isAdminLoggedIn ? (
              <CreateSurveyPage />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;