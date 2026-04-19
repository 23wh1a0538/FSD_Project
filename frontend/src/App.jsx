import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Favorites from './pages/Favorites';
import MarkAttendance from './pages/MarkAttendance';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('ae_token') ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 20px' }}>
      {children}
    </div>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/records" element={<PrivateRoute><Layout><Records /></Layout></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><Layout><Favorites /></Layout></PrivateRoute>} />
        <Route path="/mark" element={<PrivateRoute><Layout><MarkAttendance /></Layout></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><Layout><MarkAttendance /></Layout></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
