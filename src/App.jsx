import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MeetingProvider } from './context/MeetingContext';
import { ToastProvider } from './components/common/Toast';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MeetingList from './pages/MeetingList';
import MeetingCreate from './pages/MeetingCreate';
import MeetingDetails from './pages/MeetingDetails';
import ActionTracker from './pages/ActionTracker';
import Profile from './pages/Profile';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="meetings" element={<MeetingList />} />
        <Route path="meetings/new" element={<MeetingCreate />} />
        <Route path="meetings/:id" element={<MeetingDetails />} />
        <Route path="action-tracker" element={<ActionTracker />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MeetingProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </MeetingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
