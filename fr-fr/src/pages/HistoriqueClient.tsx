import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Eye, Mail, Phone, MapPin, Calendar, ShoppingCart, DollarSign, User, Pill, FileText } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  type: 'pharmacy' | 'doctor' | 'clinic' | 'hospital';
  email: string;
  phone: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  registeredDate: string;
  avatar: string;
}

const clients: Client[] = [
  {
    id: 'CLT-001',
    name: 'Pharmacie Centrale',
    type: 'pharmacy',
    email: 'contact@pharmacie-centrale.fr',
    phone: '+33 1 23 45 67 89',
    address: '12 Rue de la Paix',
    city: 'Paris',
    totalOrders: 45,
    totalSpent: '4 250.00 €',
    lastOrder: '2024-01-15',
    registeredDate: '2023-03-10',
    avatar: '🏥',
  },
  {
    id: 'CLT-002',
    name: 'Dr. Martin',
    type: 'doctor',
    email: 'dr.martin@medical.fr',
    phone: '+33 1 34 56 78 90',
    address: '45 Avenue des Champs',
    city: 'Lyon',
    totalOrders: 28,
    totalSpent: '2 680.50 €',
    lastOrder: '2024-01-14',
    registeredDate: '2023-05-22',
    avatar: '👨‍⚕️',
  },
  {
    id: 'CLT-003',
    name: 'Clinique du Parc',
    type: 'clinic',
    email: 'commande@clinique-parc.fr',
    phone: '+33 1 45 67 89 01',
    address: '78 Boulevard Victor Hugo',
    city: 'Marseille',
    totalOrders: 63,
    totalSpent: '8 150.75 €',
    lastOrder: '2024-01-13',
    registeredDate: '2022-11-05',
    avatar: '🏨',
  },
  {
    id: 'CLT-004',
    name: 'Pharmacie Moreau',
    type: 'pharmacy',
    email: 'pharmacie.moreau@email.fr',
    phone: '+33 1 56 78 90 12',
    address: '23 Rue du Commerce',
    city: 'Toulouse',
    totalOrders: 35,
    totalSpent: '3 425.00 €',
    lastOrder: '2024-01-10',
    registeredDate: '2023-08-15',
    avatar: '🏥',
  },
  {
    id: 'CLT-005',
    name: 'Cabinet Laurent',
    type: 'doctor',
    email: 'cabinet.laurent@medical.fr',
    phone: '+33 1 67 89 01 23',
    address: '56 Place Bellecour',
    city: 'Lyon',
    totalOrders: 22,
    totalSpent: '1 980.25 €',
    lastOrder: '2024-01-08',
    registeredDate: '2023-01-20',
    avatar: '👩‍⚕️',
  },
  {
    id: 'CLT-006',
    name: 'Hôpital Saint-Louis',
    type: 'hospital',
    email: 'pharmacie@hopital-stlouis.fr',
    phone: '+33 1 78 90 12 34',
    address: '89 Rue Nationale',
    city: 'Bordeaux',
    totalOrders: 78,
    totalSpent: '12 560.00 €',
    lastOrder: '2024-01-05',
    registeredDate: '2022-09-12',
    avatar: '🏥',
  },
  {
    id: 'CLT-007',
    name: 'Dr. Simon',
    type: 'doctor',
    email: 'dr.simon@medical.fr',
    phone: '+33 1 89 01 23 45',
    address: '34 Avenue Foch',
    city: 'Nice',
    totalOrders: 17,
    totalSpent: '1 590.00 €',
    lastOrder: '2024-01-03',
    registeredDate: '2023-06-30',
    avatar: '👨‍⚕️',
  },
  {
    id: 'CLT-008',
    name: 'Pharmacie du Soleil',
    type: 'pharmacy',
    email: 'contact@pharmacie-soleil.fr',
    phone: '+33 1 90 12 34 56',
    address: '67 Rue de la République',
    city: 'Strasbourg',
    totalOrders: 51,
    totalSpent: '5 250.50 €',
    lastOrder: '2024-01-01',
    registeredDate: '2022-04-18',
    avatar: '🏥',
  },
];

const typeLabels = {
  pharmacy: 'Pharmacie',
  doctor: 'Médecin',
  clinic: 'Clinique',
  hospital: 'Hôpital',
};

const typeClasses = {
  pharmacy: 'bg-primary/10 text-primary',
  doctor: 'bg-success/10 text-success',
  clinic: 'bg-warning/10 text-warning',
  hospital: 'bg-info/10 text-info',
};

interface OrderHistory {
  id: string;
  date: string;
  product: string;
  amount: string;
  status: string;
}

const orderHistory: OrderHistory[] = [
  { id: 'CMD-001', date: '2024-01-15', product: 'Paracétamol 1000mg', amount: '245.00 €', status: 'Livré' },
  { id: 'CMD-002', date: '2024-01-10', product: 'Amoxicilline 500mg', amount: '189.99 €', status: 'Livré' },
  { id: 'CMD-003', date: '2024-01-05', product: 'Ibuprofène 400mg', amount: '125.00 €', status: 'Livré' },
  { id: 'CMD-004', date: '2023-12-28', product: 'Oméprazole 20mg', amount: '199.99 €', status: 'Livré' },
  { id: 'CMD-005', date: '2023-12-15', product: 'Loratadine 10mg', amount: '135.00 €', status: 'Livré' },
];

export default function HistoriqueClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Clients</h1>
            <p className="text-text-secondary mt-1">Gérez vos clients professionnels de santé</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total clients</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{clients.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Commandes totales</p>
                <p className="text-2xl font-bold text-text-primary mt-1">
                  {clients.reduce((sum, c) => sum + c.totalOrders, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <ShoppingCart size={24} className="text-success" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Revenu total</p>
                <p className="text-2xl font-bold text-text-primary mt-1">40 887 €</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-warning" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Panier moyen</p>
                <p className="text-2xl font-bold text-text-primary mt-1">285 €</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Pill size={24} className="text-info" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Rechercher un client par nom, email, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'Tous' },
                { value: 'pharmacy', label: 'Pharmacies' },
                { value: 'doctor', label: 'Médecins' },
                { value: 'clinic', label: 'Cliniques' },
                { value: 'hospital', label: 'Hôpitaux' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setTypeFilter(type.value)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    typeFilter === type.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-hover text-text-secondary hover:bg-surface-hover/80 border border-border'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client list */}
          <div className="lg:col-span-2 bg-surface border border-border rounded-xl overflow-hidden">
            <div className="p-5 border-b border-border">
              <h2 className="text-lg font-semibold text-text-primary">Liste des clients</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-surface-hover">
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                      Client
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                      Type
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                      Ville
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                      Commandes
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                      Total dépensé
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                      Dernière commande
                    </th>
                    <th className="text-left text-xs font-medium text-text-secondary uppercase tracking-wider px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className={`hover:bg-surface-hover/50 transition-colors cursor-pointer ${
                        selectedClient?.id === client.id ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-surface-hover rounded-full flex items-center justify-center text-xl">
                            {client.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-text-primary">{client.name}</p>
                            <p className="text-xs text-text-muted">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[client.type]}`}>
                          {typeLabels[client.type]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary hidden lg:table-cell">
                        {client.city}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-text-primary">
                        {client.totalOrders}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-text-primary">
                        {client.totalSpent}
                      </td>
                      <td className="px-5 py-4 text-sm text-text-secondary hidden xl:table-cell">
                        {client.lastOrder}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
                          title="Voir détails"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredClients.length === 0 && (
              <div className="py-12 text-center">
                <User size={48} className="mx-auto text-text-muted mb-4" />
                <p className="text-text-secondary">Aucun client trouvé</p>
              </div>
            )}
          </div>

          {/* Client details */}
          <div className="bg-surface border border-border rounded-xl p-5">
            {selectedClient ? (
              <div className="space-y-5">
                <div className="text-center pb-4 border-b border-border">
                  <div className="w-20 h-20 bg-surface-hover rounded-full flex items-center justify-center text-4xl mx-auto mb-3">
                    {selectedClient.avatar}
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">{selectedClient.name}</h3>
                  <p className="text-sm text-text-muted">{selectedClient.id}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${typeClasses[selectedClient.type]}`}>
                    {typeLabels[selectedClient.type]}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-text-muted flex-shrink-0" />
                    <span className="text-text-secondary truncate">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-text-muted flex-shrink-0" />
                    <span className="text-text-secondary">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={16} className="text-text-muted flex-shrink-0" />
                    <span className="text-text-secondary">
                      {selectedClient.address}, {selectedClient.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={16} className="text-text-muted flex-shrink-0" />
                    <span className="text-text-secondary">
                      Client depuis le {selectedClient.registeredDate}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FileText size={16} />
                    Dernières commandes
                  </h4>
                  <div className="space-y-2">
                    {orderHistory.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-2 bg-surface-hover rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-medium text-text-primary">{order.id}</p>
                          <p className="text-xs text-text-muted">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-text-primary">{order.amount}</p>
                          <p className="text-xs text-success">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye size={24} className="text-text-muted" />
                </div>
                <p className="text-text-secondary">Sélectionnez un client pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
