import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Tasks from './components/Tasks';
import Settings from './components/Settings';
import ResetSuperAdmin from './components/ResetSuperAdmin';
import Navbar from './components/Navbar';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public route component (accessible only when not logged in)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app">
          <Routes>
            {/* Public routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            <Route 
              path="/reset-superadmin" 
              element={
                <PublicRoute>
                  <ResetSuperAdmin />
                </PublicRoute>
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Users />
                  </>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Tasks />
                  </>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <>
                    <Navbar />
                    <Settings />
                  </>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to dashboard if authenticated, otherwise to login */}
            <Route 
              path="/" 
              element={
                localStorage.getItem('adminToken') ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
            
            {/* Catch all - redirect to dashboard if authenticated, otherwise to login */}
            <Route 
              path="*" 
              element={
                localStorage.getItem('adminToken') ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 