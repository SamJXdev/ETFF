import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login, Register } from './pages/Auth.tsx';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  return token ? <Layout><Outlet /></Layout> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
