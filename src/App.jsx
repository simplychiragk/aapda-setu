import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Layout from "./components/Layout";
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
  return (
    <BrowserRouter>
      <Layout>
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
      </Layout>
    </BrowserRouter>
  );
}

export default App;
