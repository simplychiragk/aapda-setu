import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { Suspense, lazy } from 'react';
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./utils/ProtectedRoute";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Alerts = lazy(() => import("./pages/Alerts"));
const Drills = lazy(() => import("./pages/Drills"));
const Videos = lazy(() => import("./pages/Videos"));
const Quizzes = lazy(() => import("./pages/Quizzes"));
const EmergencyContacts = lazy(() => import("./pages/EmergencyContacts"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Logout = lazy(() => import("./pages/Logout"));
const Game = lazy(() => import("./pages/Game"));
const Entry = lazy(() => import("./pages/Entry"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotAuthorized = lazy(() => import("./pages/NotAuthorized"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const SafeZones = lazy(() => import("./pages/SafeZones"));

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
            <Suspense fallback={<LoadingSpinner />}>
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
            </Suspense>
          </Layout>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
