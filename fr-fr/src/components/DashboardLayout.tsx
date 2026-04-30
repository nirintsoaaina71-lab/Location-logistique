import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Bell,
  Search,
  User,
  Sun,
  Moon,
  Pill,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Commandes', path: '/dashboard/commandes', icon: ShoppingCart },
  { name: 'Médicaments', path: '/dashboard/produits', icon: Package },
  { name: 'Clients', path: '/dashboard/historique', icon: Users },
  { name: 'Paramètres', path: '/dashboard/parametres', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-surface border-r border-border transition-all duration-300 ease-in-out flex flex-col
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Pill size={20} className="text-primary" />
              </div>
              <h1 className="text-lg font-bold text-text-primary truncate">PharmaGest</h1>
            </div>
          )}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileMenuOpen(false);
            }}
            className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
          >
            {sidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                      ${active
                        ? 'bg-primary text-white shadow-md'
                        : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                      }
                      ${!sidebarOpen && 'justify-center'}
                    `}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {sidebarOpen && <span className="truncate">{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              text-danger hover:bg-danger/10
              ${!sidebarOpen && 'justify-center'}
            `}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Rechercher un médicament, client..."
                className="pl-10 pr-4 py-2 w-48 md:w-64 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
              aria-label={resolvedTheme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
            >
              {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <button className="relative p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary hidden sm:block">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-2 md:gap-3 pl-2 md:pl-3 border-l border-border">
              <div className="w-8 h-8 md:w-9 md:h-9 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={16} className="text-primary md:w-[18px] md:h-[18px]" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary truncate max-w-[120px]">
                  {user?.name ?? 'Utilisateur'}
                </p>
                <p className="text-xs text-text-muted truncate max-w-[120px]">
                  {user?.email ?? 'email@example.com'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
