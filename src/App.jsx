import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Videos from './pages/Videos';
import Quizzes from './pages/Quizzes';
import Drills from './pages/Drills';
import EmergencyContacts from './pages/EmergencyContacts';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/drills" element={<Drills />} />
          <Route path="/contacts" element={<EmergencyContacts />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
