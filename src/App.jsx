import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import Drills from "./pages/Drills";
import Videos from "./pages/Videos";
import Quizzes from "./pages/Quizzes";
import EmergencyContacts from "./pages/EmergencyContacts";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/drills" element={<Drills />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/emergency" element={<EmergencyContacts />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
