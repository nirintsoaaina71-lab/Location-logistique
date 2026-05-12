import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Eye, Mail, Phone, MapPin, Calendar, ShoppingCart, DollarSign, User, Pill, FileText, Download, Filter, ChevronDown, TrendingUp, TrendingDown, Package } from 'lucide-react';

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
    totalSpent: '4 250,00 €',
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
    totalSpent: '2 680,50 €',
    lastOrder: '2024-01-14',
    registeredDate: '2023-05-22',
    avatar: '👨‍️',
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
    totalSpent: '8 150,75 €',
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
    totalSpent: '3 425,00 €',
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
    totalSpent: '1 980,25 €',
    lastOrder: '2024-01-08',
    registeredDate: '2023-01-20',
    avatar: '👩‍️',
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
    totalSpent: '12 560,00 €',
    lastOrder: '2024-01-05',
    registeredDate: '2022-09-12',
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
  pharmacy: 'bg-[#dbeafe] text-[#2563eb]',
  doctor: 'bg-[#dcfce7] text-[#16a34a]',
  clinic: 'bg-[#ffedd5] text-[#ea580c]',
  hospital: 'bg-[#f3e8ff] text-[#9333ea]',
};

interface OrderHistory {
  id: string;
  date: string;
  product: string;
  amount: string;
  status: string;
}

const orderHistory: OrderHistory[] = [
  { id: 'CMD-001', date: '2024-01-15', product: 'Paracétamol 1000mg', amount: '245,00 €', status: 'Livrée' },
  { id: 'CMD-002', date: '2024-01-10', product: 'Amoxicilline 500mg', amount: '189,99 €', status: 'Livrée' },
  { id: 'CMD-003', date: '2024-01-05', product: 'Ibuprofène 400mg', amount: '125,00 €', status: 'Livrée' },
  { id: 'CMD-004', date: '2023-12-28', product: 'Oméprazole 20mg', amount: '199,99 €', status: 'Livrée' },
  { id: 'CMD-005', date: '2023-12-15', product: 'Loratadine 10mg', amount: '135,00 €', status: 'Livrée' },
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
            <h1 className="text-2xl font-semibold text-[#1e3a5f]">Clients</h1>
            <p className="text-[#4b5563] text-sm mt-0.5">Gérez vos clients professionnels de santé</p>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#4b5563]">Total clients</p>
                <p className="text-xl font-semibold text-[#1e3a5f] mt-1">{clients.length}</p>
              </div>
              <div className="w-10 h-10 bg-[#4a6670]/10 rounded-lg flex items-center justify-center">
                <User size={18} className="text-[#4a6670]" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#4b5563]">Commandes totales</p>
                <p className="text-xl font-semibold text-[#1e3a5f] mt-1">
                  {clients.reduce((sum, c) => sum + c.totalOrders, 0)}
                </p>
              </div>
              <div className="w-10 h-10 bg-[#16a34a]/10 rounded-lg flex items-center justify-center">
                <ShoppingCart size={18} className="text-[#16a34a]" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#4b5563]">Revenu total</p>
                <p className="text-xl font-semibold text-[#1e3a5f] mt-1">40 887 €</p>
              </div>
              <div className="w-10 h-10 bg-[#ea580c]/10 rounded-lg flex items-center justify-center">
                <DollarSign size={18} className="text-[#ea580c]" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#4b5563]">Panier moyen</p>
                <p className="text-xl font-semibold text-[#1e3a5f] mt-1">285 €</p>
              </div>
              <div className="w-10 h-10 bg-[#2563eb]/10 rounded-lg flex items-center justify-center">
                <Pill size={18} className="text-[#2563eb]" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Rechercher un client par nom, email, ville..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded-lg text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
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
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    typeFilter === type.value
                      ? 'bg-[#4a6670] text-white'
                      : 'bg-[#f8f9fa] text-[#4b5563] hover:bg-[#e5e7eb] border border-[#d1d5db]'
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
          <div className="lg:col-span-2 bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
            <div className="p-5 border-b border-[#d1d5db]">
              <h2 className="text-base font-semibold text-[#1e3a5f]">Liste des clients</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-[#f8f9fa]">
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Client
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                      Type
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                      Ville
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Commandes
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Total dépensé
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                      Dernière commande
                    </th>
                    <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1d5db]">
                  {filteredClients.map((client) => (
                    <tr
                      key={client.id}
                      className={`hover:bg-[#f8f9fa]/50 transition-colors cursor-pointer ${
                        selectedClient?.id === client.id ? 'bg-[#4a6670]/5' : ''
                      }`}
                      onClick={() => setSelectedClient(client)}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#f8f9fa] rounded-full flex items-center justify-center text-xl">
                            {client.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1e3a5f]">{client.name}</p>
                            <p className="text-xs text-[#9ca3af]">{client.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeClasses[client.type]}`}>
                          {typeLabels[client.type]}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4b5563] hidden lg:table-cell">
                        {client.city}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#1e3a5f]">
                        {client.totalOrders}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#1e3a5f]">
                        {client.totalSpent}
                      </td>
                      <td className="px-5 py-4 text-sm text-[#4b5563] hidden xl:table-cell">
                        {client.lastOrder}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          className="p-1.5 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]"
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
                <User size={40} className="mx-auto text-[#9ca3af] mb-3" />
                <p className="text-[#4b5563] text-sm">Aucun client trouvé</p>
              </div>
            )}
          </div>

          {/* Client details */}
          <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
            {selectedClient ? (
              <div className="space-y-5">
                <div className="text-center pb-4 border-b border-[#d1d5db]">
                  <div className="w-16 h-16 bg-[#f8f9fa] rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                    {selectedClient.avatar}
                  </div>
                  <h3 className="text-base font-semibold text-[#1e3a5f]">{selectedClient.name}</h3>
                  <p className="text-xs text-[#9ca3af]">{selectedClient.id}</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${typeClasses[selectedClient.type]}`}>
                    {typeLabels[selectedClient.type]}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={14} className="text-[#9ca3af] flex-shrink-0" />
                    <span className="text-[#4b5563] truncate">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={14} className="text-[#9ca3af] flex-shrink-0" />
                    <span className="text-[#4b5563]">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin size={14} className="text-[#9ca3af] flex-shrink-0" />
                    <span className="text-[#4b5563]">
                      {selectedClient.address}, {selectedClient.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar size={14} className="text-[#9ca3af] flex-shrink-0" />
                    <span className="text-[#4b5563]">
                      Client depuis le {selectedClient.registeredDate}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#d1d5db]">
                  <h4 className="font-semibold text-[#1e3a5f] mb-3 flex items-center gap-2 text-sm">
                    <FileText size={14} />
                    Dernières commandes
                  </h4>
                  <div className="space-y-2">
                    {orderHistory.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-2.5 bg-[#f8f9fa] rounded-lg text-sm"
                      >
                        <div>
                          <p className="font-medium text-[#1e3a5f] text-xs">{order.id}</p>
                          <p className="text-xs text-[#9ca3af]">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#1e3a5f] text-xs">{order.amount}</p>
                          <p className="text-xs text-[#16a34a]">{order.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-14 h-14 bg-[#f8f9fa] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Eye size={20} className="text-[#9ca3af]" />
                </div>
                <p className="text-[#4b5563] text-sm">Sélectionnez un client pour voir ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
