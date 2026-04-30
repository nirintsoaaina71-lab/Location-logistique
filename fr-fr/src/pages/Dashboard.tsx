import DashboardLayout from '../components/DashboardLayout';
import {
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Pill,
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ElementType;
  color: string;
}

const stats: StatCard[] = [
  {
    title: 'Ventes du jour',
    value: '1 245 €',
    change: '+12.5%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'bg-success/10 text-success',
  },
  {
    title: 'Commandes',
    value: '48',
    change: '+8.2%',
    changeType: 'positive',
    icon: ShoppingCart,
    color: 'bg-primary/10 text-primary',
  },
  {
    title: 'Médicaments en stock',
    value: '356',
    change: '-2.4%',
    changeType: 'negative',
    icon: Package,
    color: 'bg-info/10 text-info',
  },
  {
    title: 'Clients actifs',
    value: '189',
    change: '+5.1%',
    changeType: 'positive',
    icon: Users,
    color: 'bg-warning/10 text-warning',
  },
];

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled';
  date: string;
}

const recentOrders: RecentOrder[] = [
  {
    id: 'CMD-001',
    customer: 'Pharmacie Centrale',
    product: 'Paracétamol 1000mg',
    amount: '245.00 €',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: 'CMD-002',
    customer: 'Dr. Martin',
    product: 'Amoxicilline 500mg',
    amount: '189.99 €',
    status: 'pending',
    date: '2024-01-14',
  },
  {
    id: 'CMD-003',
    customer: 'Clinique du Parc',
    product: 'Ibuprofène 400mg',
    amount: '125.00 €',
    status: 'completed',
    date: '2024-01-14',
  },
  {
    id: 'CMD-004',
    customer: 'Pharmacie Moreau',
    product: 'Aspirine 500mg',
    amount: '89.00 €',
    status: 'cancelled',
    date: '2024-01-13',
  },
  {
    id: 'CMD-005',
    customer: 'Cabinet Laurent',
    product: 'Oméprazole 20mg',
    amount: '156.50 €',
    status: 'completed',
    date: '2024-01-12',
  },
];

const statusLabels = {
  completed: 'Livré',
  pending: 'En cours',
  cancelled: 'Annulé',
};

const statusClasses = {
  completed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  cancelled: 'bg-danger/10 text-danger',
};

interface LowStockItem {
  name: string;
  stock: number;
  minStock: number;
}

const lowStockItems: LowStockItem[] = [
  { name: 'Paracétamol 1000mg', stock: 12, minStock: 50 },
  { name: 'Amoxicilline 500mg', stock: 8, minStock: 30 },
  { name: 'Ibuprofène 400mg', stock: 15, minStock: 40 },
  { name: 'Aspirine 500mg', stock: 5, minStock: 25 },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Tableau de bord</h1>
            <p className="text-text-secondary mt-1">Bienvenue sur votre gestion de pharmacie</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Clock size={16} />
            <span>Dernière mise à jour: il y a 5 min</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-surface border border-border rounded-xl p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-success' : 'text-danger'
                    }`}
                  >
                    {stat.changeType === 'positive' ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-sm text-text-secondary mt-1">{stat.title}</p>
              </div>
            );
          })}
        </div>

        {/* Charts and alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue chart */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Revenus mensuels</h2>
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <TrendingUp size={16} />
                <span>Ce mois</span>
              </div>
            </div>
            <div className="h-64 flex items-end justify-around gap-2 px-4">
              {[65, 45, 75, 55, 80, 60, 70, 85, 50, 90, 75, 95].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`Mois ${i + 1}: ${height}%`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-text-muted px-4">
              <span>Jan</span>
              <span>Fév</span>
              <span>Mar</span>
              <span>Avr</span>
              <span>Mai</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aoû</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Déc</span>
            </div>
          </div>

          {/* Low stock alerts */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle size={20} className="text-danger" />
              <h2 className="text-lg font-semibold text-text-primary">Stock faible</h2>
            </div>
            <div className="space-y-3">
              {lowStockItems.map((item, index) => (
                <div key={index} className="p-3 bg-surface-hover rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary truncate">{item.name}</span>
                    <span className="text-xs text-danger font-bold">{item.stock} restants</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className="bg-danger h-1.5 rounded-full"
                      style={{ width: `${(item.stock / item.minStock) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-text-muted mt-1">Minimum: {item.minStock}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-success" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Commandes livrées</p>
                <p className="text-xl font-bold text-text-primary">156</p>
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock size={20} className="text-warning" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">En attente</p>
                <p className="text-xl font-bold text-text-primary">23</p>
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Pill size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-text-secondary">Nouveaux médicaments</p>
                <p className="text-xl font-bold text-text-primary">8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent orders table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text-primary">Commandes récentes</h2>
            <button className="text-sm text-primary hover:underline">Voir tout</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-hover">
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                    Commande
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Médicament
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                    Montant
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                    Statut
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-text-primary">
                      {order.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary">
                      {order.customer}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary hidden md:table-cell">
                      {order.product}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium text-text-primary">
                      {order.amount}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          statusClasses[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary hidden lg:table-cell">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
