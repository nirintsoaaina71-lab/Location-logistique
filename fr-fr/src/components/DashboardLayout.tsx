import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Bell,
  Search,
  User,
  HelpCircle,
  BriefcaseMedical,
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventaire', path: '/dashboard/produits', icon: Package },
  { name: 'Ventes & PDV', path: '/dashboard/commandes', icon: ShoppingCart },
  { name: 'Clients', path: '/dashboard/historique', icon: Users },
  { name: 'Finances', path: '/dashboard/finance', icon: DollarSign },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  useTheme();
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
    <div className="min-h-screen bg-[#f5f7f8] flex overflow-x-hidden">
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-white border-r border-[#d1d5db] transition-all duration-300 ease-in-out flex flex-col
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'w-[72px]'}
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#d1d5db] shrink-0">
          {sidebarOpen && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <BriefcaseMedical size={22} className="text-[#4a6670]" />
                <h1 className="text-lg font-semibold text-[#1e3a5f]">PharmaSync Pro</h1>
              </div>
              <span className="text-[10px] text-[#4b5563] tracking-wider ml-7">Clinical Precision</span>
            </div>
          )}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileMenuOpen(false);
            }}
            className="p-1.5 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]"
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1 px-3">
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200
                      ${active
                        ? 'bg-[#d4e6f5] text-[#1e3a5f] font-medium'
                        : 'text-[#4b5563] hover:bg-[#f8f9fa] hover:text-[#1e3a5f]'
                      }
                      ${!sidebarOpen && 'justify-center'}
                    `}
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    {sidebarOpen && <span className="truncate text-sm">{item.name}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="p-3 border-t border-[#d1d5db] shrink-0">
          <button
            onClick={() => navigate('/dashboard/parametres')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              text-[#4b5563] hover:bg-[#f8f9fa] hover:text-[#1e3a5f]
              ${!sidebarOpen && 'justify-center'}
            `}
          >
            <Settings size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate text-sm">Settings</span>}
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              text-[#dc2626] hover:bg-[#dc2626]/10
              ${!sidebarOpen && 'justify-center'}
            `}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate text-sm">{isLoggingOut ? 'Déconnexion...' : 'Logout'}</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#d1d5db] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563] shrink-0"
            >
              <Menu size={18} />
            </button>
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search transactions, reports..."
                className="pl-9 pr-4 py-2 w-full bg-[#f5f7f8] border border-[#d1d5db] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all text-black placeholder-[#9ca3af]"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button className="sm:hidden p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]">
              <Search size={18} />
            </button>
            
            <button className="relative p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#dc2626] rounded-full"></span>
            </button>
            
            <button className="hidden md:block p-2 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]">
              <HelpCircle size={18} />
            </button>
            
            <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#d1d5db]">
              <div className="w-8 h-8 bg-[#4a6670] rounded-full flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden lg:block truncate max-w-[150px]">
                <p className="text-sm font-medium text-[#1e3a5f] truncate">
                  {user?.name ?? 'Dr. Aris Thorne'}
                </p>
                <p className="text-xs text-[#4b5563] truncate">
                  {user?.email ?? 'Pharmacien en chef'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
