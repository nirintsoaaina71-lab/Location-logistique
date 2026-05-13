import DashboardLayout from '../components/DashboardLayout';
import {
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Users,
  Package,
  Eye,
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ElementType;
  color: string;
  alert?: boolean;
}

const stats: StatCard[] = [
  {
    title: 'REVENUS',
    value: '$12,840.00',
    subtitle: '+4,2% par rapport à hier',
    changeType: 'positive',
    icon: DollarSign,
    color: 'text-[#1e3a5f]',
  },
  {
    title: 'VENTES',
    value: '142',
    subtitle: 'Moy. 12 par heure',
    icon: ShoppingCart,
    color: 'text-[#1e3a5f]',
  },
  {
    title: 'ALERTE',
    value: '03',
    subtitle: 'Nécessite une action immédiate',
    changeType: 'negative',
    icon: AlertTriangle,
    color: 'text-[#dc2626]',
    alert: true,
  },
  {
    title: 'NOUVEAUX PATIENTS',
    value: '18',
    subtitle: '+12% par rapport au mois dernier',
    changeType: 'positive',
    icon: Users,
    color: 'text-[#1e3a5f]',
  },
];

interface RecentOrder {
  id: string;
  patient: string;
  medication: string;
  status: 'completed' | 'pending' | 'processing';
  amount: string;
}

const recentOrders: RecentOrder[] = [
  {
    id: '#ORD-9421',
    patient: 'Eleanor Shellstrop',
    medication: 'Atorvastatin 20mg',
    status: 'completed',
    amount: '$42.50',
  },
  {
    id: '#ORD-9420',
    patient: 'Tahani Al-Jamil',
    medication: 'Lisinopril 10mg',
    status: 'pending',
    amount: '$18.20',
  },
  {
    id: '#ORD-9419',
    patient: 'Chidi Anagonye',
    medication: 'Metformin 500mg',
    status: 'processing',
    amount: '$25.00',
  },
  {
    id: '#ORD-9418',
    patient: 'Jason Mendoza',
    medication: 'Amoxicilline 250mg',
    status: 'completed',
    amount: '$12.45',
  },
];

const statusLabels = {
  completed: 'TERMINÉE',
  pending: 'EN ATTENTE',
  processing: 'EN COURS',
};

const statusClasses = {
  completed: 'bg-[#dcfce7] text-[#16a34a]',
  pending: 'bg-[#ffedd5] text-[#ea580c]',
  processing: 'bg-[#dbeafe] text-[#2563eb]',
};

interface CriticalStockItem {
  name: string;
  stock: number;
  maxStock: number;
  color: string;
}

const criticalStockItems: CriticalStockItem[] = [
  { name: 'Amoxicilline 500mg', stock: 12, maxStock: 100, color: 'bg-[#dc2626]' },
  { name: 'Insuline Glargine', stock: 5, maxStock: 50, color: 'bg-[#dc2626]' },
  { name: 'Gabapentine 300mg', stock: 24, maxStock: 100, color: 'bg-[#4a6670]' },
  { name: 'Lévothyroxine 50mcg', stock: 42, maxStock: 100, color: 'bg-[#4a6670]' },
];

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e3a5f]">Vue d'ensemble quotidienne</h1>
            <p className="text-[#4b5563] text-sm mt-0.5">Résumé clinique et opérationnel en temps réel du 24 octobre 2023</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#d1d5db]">
            {stats.map((stat, index) => {
              return (
                <div
                  key={stat.title}
                  className={`px-4 ${index === 0 ? 'sm:pl-0' : ''} ${index === 3 ? 'sm:pr-0' : ''} py-3 sm:py-0`}
                >
                  <p className="text-xs text-[#4b5563] uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className={`text-3xl font-semibold ${stat.color}`}>{stat.value}</p>
                  {stat.subtitle && (
                    <div className="flex items-center gap-1 mt-1">
                      {stat.alert ? (
                        <AlertTriangle size={12} className="text-[#dc2626]" />
                      ) : stat.changeType === 'positive' ? (
                        <ArrowUpRight size={12} className="text-[#16a34a]" />
                      ) : null}
                      <span className={`text-xs ${stat.alert ? 'text-[#dc2626]' : stat.changeType === 'positive' ? 'text-[#16a34a]' : 'text-[#4b5563]'}`}>
                        {stat.subtitle}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
            <div className="p-5 border-b border-[#d1d5db] flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#1e3a5f]">Commandes récentes</h2>
              <button className="text-sm text-[#4a6670] hover:underline flex items-center gap-1">
                Voir tout <Eye size={14} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-[#f8f9fa]">
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      N° commande
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Patient
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Médicament
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Statut
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Montant
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1d5db]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#f8f9fa]/50 transition-colors">
                      <td className="px-5 py-4 text-sm font-medium text-[#1e3a5f]">
                        {order.id}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4b5563]">
                        {order.patient}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4b5563]">
                        {order.medication}
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
                      <td className="px-5 py-4 text-sm font-medium text-[#1e3a5f]">
                        {order.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Critical Stock */}
          <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
            <div className="p-5 border-b border-[#d1d5db] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={18} className="text-[#dc2626]" />
                <h2 className="text-base font-semibold text-[#dc2626]">Stock critique</h2>
              </div>
              <span className="bg-[#dc2626] text-white text-xs px-2 py-0.5 rounded-full">Faible</span>
            </div>
            <div className="p-5 space-y-4">
              {criticalStockItems.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#1e3a5f]">{item.name}</span>
                    <span className="text-xs text-[#dc2626] font-medium">{item.stock} unités restantes</span>
                  </div>
                  <div className="w-full bg-[#e5e7eb] rounded-full h-1.5">
                    <div
                      className={`${item.color} h-1.5 rounded-full`}
                      style={{ width: `${(item.stock / item.maxStock) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              <button className="w-full mt-4 py-2.5 bg-[#4a6670] text-white rounded text-sm font-medium hover:bg-[#3d5660] transition-colors">
                RECOMMANDER TOUT LE STOCK CRITIQUE
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pharmacist Availability */}
          <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
            <h2 className="text-base font-semibold text-[#1e3a5f] mb-4">Disponibilité des pharmaciens</h2>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-[#4a6670] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">👨‍⚕️</span>
                </div>
                <div className="w-10 h-10 bg-[#5a7d8a] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">👩‍⚕️</span>
                </div>
                <div className="w-10 h-10 bg-[#6b9aaa] rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">👨‍⚕️</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-[#4b5563]">3 en service • 2 en pause</p>
              </div>
            </div>
          </div>

          {/* System Efficiency */}
          <div className="bg-[#4a6670] rounded-lg p-5 text-white">
            <h2 className="text-base font-semibold mb-1">Efficacité du système</h2>
            <p className="text-sm text-white/80 mb-4">Le temps de traitement des ordonnances est actuellement 15% plus rapide que la moyenne.</p>
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-1 h-16">
                <div className="w-3 bg-white/30 rounded-t" style={{ height: '40%' }}></div>
                <div className="w-3 bg-white/30 rounded-t" style={{ height: '60%' }}></div>
                <div className="w-3 bg-white/30 rounded-t" style={{ height: '45%' }}></div>
                <div className="w-3 bg-white rounded-t" style={{ height: '85%' }}></div>
              </div>
              <span className="text-3xl font-semibold">98,2%</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
