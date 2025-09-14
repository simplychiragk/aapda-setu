import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
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
import Entry from "./pages/Entry";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Leaderboard from "./pages/Leaderboard";
import SafeZones from "./pages/SafeZones";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                borderRadius: '12px',
                padding: '16px',
              },
            }}
          />
          <Layout>
            <Routes>
              <Route path="/" element={<Entry />} />
              <Route path="/entry" element={<Entry />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allow={["student", "staff"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/drills" element={<Drills />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/quizzes" element={<Quizzes />} />
              <Route path="/contacts" element={<EmergencyContacts />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/safe-zones" element={<SafeZones />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allow={["staff"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/game" element={<Game />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
