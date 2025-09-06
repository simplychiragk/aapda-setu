// App.js
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Drills from "./pages/Drills";
import Videos from "./pages/Videos";
import Quizzes from "./pages/Quizzes";
import EmergencyContacts from "./pages/EmergencyContacts";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import Game from "./pages/Game";

function App() {
  const navStyle = {
    display: "flex",
    gap: 20,
    padding: "12px 24px",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
  };

  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <Link to="/" style={linkStyle}>Dashboard</Link>
        <Link to="/alerts" style={linkStyle}>Alerts</Link>
        <Link to="/drills" style={linkStyle}>Drills</Link>
        <Link to="/videos" style={linkStyle}>Videos</Link>
        <Link to="/quizzes" style={linkStyle}>Quizzes</Link>
        <Link to="/contacts" style={linkStyle}>Emergency Contacts</Link>
        <Link to="/profile" style={linkStyle}>Profile</Link>
        <Link to="/game" style={linkStyle}>Game</Link>
        <Link to="/settings" style={linkStyle}>Settings</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/drills" element={<Drills />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
