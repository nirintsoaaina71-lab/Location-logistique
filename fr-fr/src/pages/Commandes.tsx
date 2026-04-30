import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Filter, Plus, Eye, Edit, Trash2, ChevronDown, Pill, Calendar, ShoppingCart, DollarSign, Package } from 'lucide-react';

interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  category: string;
  quantity: number;
  amount: string;
  status: 'completed' | 'pending' | 'cancelled' | 'shipped';
  date: string;
  prescription: boolean;
}

const orders: Order[] = [
  {
    id: 'CMD-001',
    customer: 'Pharmacie Centrale',
    email: 'contact@pharmacie-centrale.fr',
    phone: '+33 1 23 45 67 89',
    product: 'Paracétamol 1000mg',
    category: 'Antalgique',
    quantity: 50,
    amount: '245.00 €',
    status: 'completed',
    date: '2024-01-15',
    prescription: false,
  },
  {
    id: 'CMD-002',
    customer: 'Dr. Martin',
    email: 'dr.martin@medical.fr',
    phone: '+33 1 34 56 78 90',
    product: 'Amoxicilline 500mg',
    category: 'Antibiotique',
    quantity: 30,
    amount: '189.99 €',
    status: 'pending',
    date: '2024-01-14',
    prescription: true,
  },
  {
    id: 'CMD-003',
    customer: 'Clinique du Parc',
    email: 'commande@clinique-parc.fr',
    phone: '+33 1 45 67 89 01',
    product: 'Ibuprofène 400mg',
    category: 'Anti-inflammatoire',
    quantity: 100,
    amount: '425.00 €',
    status: 'shipped',
    date: '2024-01-14',
    prescription: false,
  },
  {
    id: 'CMD-004',
    customer: 'Pharmacie Moreau',
    email: 'pharmacie.moreau@email.fr',
    phone: '+33 1 56 78 90 12',
    product: 'Aspirine 500mg',
    category: 'Antalgique',
    quantity: 25,
    amount: '89.00 €',
    status: 'cancelled',
    date: '2024-01-13',
    prescription: false,
  },
  {
    id: 'CMD-005',
    customer: 'Cabinet Laurent',
    email: 'cabinet.laurent@medical.fr',
    phone: '+33 1 67 89 01 23',
    product: 'Oméprazole 20mg',
    category: 'Gastro-entérologie',
    quantity: 40,
    amount: '156.50 €',
    status: 'completed',
    date: '2024-01-12',
    prescription: true,
  },
  {
    id: 'CMD-006',
    customer: 'Pharmacie du Soleil',
    email: 'contact@pharmacie-soleil.fr',
    phone: '+33 1 78 90 12 34',
    product: 'Loratadine 10mg',
    category: 'Antihistaminique',
    quantity: 60,
    amount: '312.00 €',
    status: 'pending',
    date: '2024-01-11',
    prescription: false,
  },
  {
    id: 'CMD-007',
    customer: 'Hôpital Saint-Louis',
    email: 'pharmacie@hopital-stlouis.fr',
    phone: '+33 1 89 01 23 45',
    product: 'Metformine 850mg',
    category: 'Antidiabétique',
    quantity: 200,
    amount: '890.00 €',
    status: 'shipped',
    date: '2024-01-10',
    prescription: true,
  },
  {
    id: 'CMD-008',
    customer: 'Dr. Bernard',
    email: 'dr.bernard@medical.fr',
    phone: '+33 1 90 12 34 56',
    product: 'Amlodipine 5mg',
    category: 'Antihypertenseur',
    quantity: 45,
    amount: '267.75 €',
    status: 'completed',
    date: '2024-01-09',
    prescription: true,
  },
];

const statusLabels = {
  completed: 'Livré',
  pending: 'En cours',
  cancelled: 'Annulé',
  shipped: 'Expédié',
};

const statusClasses = {
  completed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  cancelled: 'bg-danger/10 text-danger',
  shipped: 'bg-info/10 text-info',
};

const categories = ['Toutes catégories', 'Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Gastro-entérologie', 'Antihistaminique', 'Antidiabétique', 'Antihypertenseur'];

export default function Commandes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState('Toutes catégories');

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesCategory = categoryFilter === 'Toutes catégories' || order.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalAmount = filteredOrders.reduce((sum, order) => {
    return sum + parseFloat(order.amount.replace(' €', '').replace(',', '.'));
  }, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Commandes de médicaments</h1>
            <p className="text-text-secondary mt-1">Gérez les commandes de vos clients</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm">
            <Plus size={18} />
            Nouvelle commande
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total commandes</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{orders.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <ShoppingCart size={24} className="text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Montant total</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{totalAmount.toFixed(2)} €</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-success" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">En attente</p>
                <p className="text-2xl font-bold text-warning mt-1">
                  {orders.filter((o) => o.status === 'pending').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Calendar size={24} className="text-warning" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Avec ordonnance</p>
                <p className="text-2xl font-bold text-info mt-1">
                  {orders.filter((o) => o.prescription).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Pill size={24} className="text-info" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Rechercher une commande, client, médicament..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-surface-hover border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer whitespace-nowrap"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="completed">Livré</option>
                  <option value="pending">En cours</option>
                  <option value="shipped">Expédié</option>
                  <option value="cancelled">Annulé</option>
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 bg-surface-hover border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer whitespace-nowrap"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
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
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                    Médicament
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Catégorie
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Qté
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                    Montant
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                    Statut
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                    Ordonnance
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium text-text-primary">
                      {order.id}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-text-primary">{order.customer}</p>
                        <p className="text-xs text-text-muted">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary hidden xl:table-cell">
                      <div className="flex items-center gap-2">
                        <Pill size={14} className="text-text-muted flex-shrink-0" />
                        {order.product}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary hidden lg:table-cell">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        {order.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary hidden md:table-cell">
                      {order.quantity}
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
                    <td className="px-5 py-4 hidden xl:table-cell">
                      {order.prescription ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
                          <Pill size={12} />
                          Oui
                        </span>
                      ) : (
                        <span className="text-xs text-text-muted">Non</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-text-secondary hidden lg:table-cell">
                      {order.date}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary" title="Voir">
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary" title="Modifier">
                          <Edit size={16} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors text-danger" title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredOrders.length === 0 && (
            <div className="py-12 text-center">
              <Package size={48} className="mx-auto text-text-muted mb-4" />
              <p className="text-text-secondary">Aucune commande trouvée</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
