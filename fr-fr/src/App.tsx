import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from '../hooks/useAuth';
import Menu from './pages/Menu';
import { useAuth } from '../hooks/useAuth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/menu" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/menu" replace /> : <Signup />} />
      <Route path="/singup" element={<Navigate to="/signup" replace />} />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/menu" replace /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={user ? <Navigate to="/menu" replace /> : <ResetPassword />}
      />
      <Route
        path="/reset-password/:token"
        element={user ? <Navigate to="/menu" replace /> : <ResetPassword />}
      />
      <Route path="/menu" element={user ? <Menu /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={user ? '/menu' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={user ? '/menu' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
