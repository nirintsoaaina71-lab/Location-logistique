import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeProvider } from '../hooks/useTheme';
import { MedicamentProvider } from '../hooks/useMedicament';
import Menu from './pages/Menu';
import { useAuth } from '../hooks/useAuth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Commandes from './pages/Commandes';
import Produits from './pages/Produits';
import HistoriqueClient from './pages/HistoriqueClient';
import Parametres from './pages/Parametres';
import Finance from './pages/Finance';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
      <Route path="/singup" element={<Navigate to="/signup" replace />} />
      <Route
        path="/forgot-password"
        element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
      />
      <Route
        path="/reset-password"
        element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
      />
      <Route
        path="/reset-password/:token"
        element={user ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
      />
      <Route path="/menu" element={user ? <Menu /> : <Navigate to="/login" replace />} />
      
      {/* Dashboard routes */}
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard/commandes" element={user ? <Commandes /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard/produits" element={user ? <Produits /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard/historique" element={user ? <HistoriqueClient /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard/parametres" element={user ? <Parametres /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard/finance" element={user ? <Finance /> : <Navigate to="/login" replace />} />
      
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <MedicamentProvider>
            <AppRoutes />
          </MedicamentProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
