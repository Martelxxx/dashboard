import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FullPicture from './components/full-picture.jsx';
import Staff from './components/staff.jsx';
import Tasks from './components/tasks.jsx';
import './App.css';

const Sidebar = () => (
  <div className="sidebar">
    <ul>
      <li><Link to="/full-picture">Full Picture</Link></li>
      <li><Link to="/staff">Staff</Link></li>
      <li><Link to="/clients">Clients</Link></li>
      <li><Link to="/leads">Leads</Link></li>
      <li><Link to="/tasks">Tasks</Link></li>
      <li><Link to="/email">Email</Link></li>
      <li><Link to="/calendar">Calendar</Link></li>
    </ul>
  </div>
);

const MainDisplay = () => (
  <div className="main-display">
    <Routes>
      <Route path="/full-picture" element={<FullPicture />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/clients" element={<div>Clients Content</div>} />
      <Route path="/leads" element={<div>Leads Content</div>} />
      <Route path="/email" element={<div>Email Content</div>} />
      <Route path="/calendar" element={<div>Calendar Content</div>} />
      <Route path="/tasks" element={<Tasks />} />
    </Routes>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="dashboard">
        <Sidebar />
        <MainDisplay />
      </div>
    </Router>
  );
};

export default App;