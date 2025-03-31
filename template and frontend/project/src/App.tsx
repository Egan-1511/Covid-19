import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Predict from './pages/Predict';
import Learn from './pages/Learn';
import Results from './pages/Results';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <Login onLoginSuccess={() => setIsAuthenticated(true)} />
        } />
        <Route path="/register" element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <Register />
        } />
        <Route path="/forgot-password" element={
          isAuthenticated ? 
          <Navigate to="/" replace /> : 
          <ForgotPassword />
        } />
        <Route path="/" element={
          isAuthenticated ? 
          <Layout /> : 
          <Navigate to="/login" replace />
        }>
          <Route index element={<Home />} />
          <Route path="predict" element={<Predict />} />
          <Route path="learn" element={<Learn />} />
          <Route path="results" element={<Results />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;