import DashboardLayout from '../components/DashboardLayout';
import { Download, Filter, ChevronDown, TrendingUp, TrendingDown, Package } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  time: string;
  category: string;
  description: string;
  status: 'completed' | 'pending';
  amount: string;
}

const transactions: Transaction[] = [
  { id: 'TXN-882941', date: '24 Oct 2023', time: '14:32', category: 'Ventes pharmaceutiques', description: 'Exécution d\'ordonnance (Commande #9921)', status: 'completed', amount: '245,50 €' },
  { id: 'TXN-882938', date: '24 Oct 2023', time: '11:15', category: 'Réapprovisionnement stock', description: 'Paiement fournisseur: Pfizer Global Inc.', status: 'pending', amount: '-12 400,00 €' },
  { id: 'TXN-882922', date: '23 Oct 2023', time: '16:45', category: 'Vente libre', description: 'Point de vente - Comptoir 02', status: 'completed', amount: '18,99 €' },
  { id: 'TXN-882910', date: '23 Oct 2023', time: '09:00', category: 'Charges fixes', description: 'Loyer local - Unité A-12', status: 'completed', amount: '-4 500,00 €' },
];

export default function Finance() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e3a5f]">Rapports financiers</h1>
            <p className="text-[#4b5563] text-sm mt-0.5">Période: 1 Oct 2023 - 31 Oct 2023</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#d1d5db] text-[#4b5563] rounded text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
              <Download size={16} />
              Exporter PDF
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#4a6670] text-white rounded text-sm font-medium hover:bg-[#3d5660] transition-colors">
              Générer rapport
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
            <p className="text-xs text-[#4b5563] uppercase tracking-wider">Revenu total</p>
            <p className="text-3xl font-semibold text-[#1e3a5f] mt-1">142 580,00 €</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className="text-[#16a34a]" />
              <span className="text-sm text-[#16a34a] font-medium">+12,4% vs mois dernier</span>
            </div>
          </div>
          <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
            <p className="text-xs text-[#4b5563] uppercase tracking-wider">Marge brute</p>
            <p className="text-3xl font-semibold text-[#1e3a5f] mt-1">38,2%</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className="text-[#16a34a]" />
              <span className="text-sm text-[#16a34a] font-medium">+1,2% gain d'efficacité</span>
            </div>
          </div>
          <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
            <p className="text-xs text-[#4b5563] uppercase tracking-wider">Charges d'exploitation</p>
            <p className="text-3xl font-semibold text-[#1e3a5f] mt-1">88 420,00 €</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingDown size={14} className="text-[#dc2626]" />
              <span className="text-sm text-[#dc2626] font-medium">-2,8% réduction</span>
            </div>
          </div>
          <div className="bg-white border border-[#d1d5db] rounded-lg p-5">
            <p className="text-xs text-[#4b5563] uppercase tracking-wider">Valeur stock actuel</p>
            <p className="text-3xl font-semibold text-[#1e3a5f] mt-1">512 000,00 €</p>
            <div className="flex items-center gap-1 mt-2">
              <Package size={14} className="text-[#4b5563]" />
              <span className="text-sm text-[#4b5563]">8 240 références en stock</span>
            </div>
          </div>
        </div>

        {/* Revenue Performance Chart */}
        <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
          <div className="p-5 border-b border-[#d1d5db] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1e3a5f]">Performance des revenus (CA)</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#34495e] rounded-full"></div>
                <span className="text-xs text-[#4b5563]">Ventes brutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#bdc3c7] rounded-full"></div>
                <span className="text-xs text-[#4b5563]">Bénéfice net</span>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="h-48 flex items-end justify-around gap-3 px-4">
              {[45, 55, 50, 65, 70, 60, 75, 50, 68, 55, 62].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-end">
                    <div 
                      className="w-full bg-[#e8e8e8] rounded-t-sm" 
                      style={{ height: `${height * 0.4}%` }}
                    ></div>
                    <div 
                      className="w-full bg-[#34495e] -mt-0.5" 
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-[#9ca3af] px-4">
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
            </div>
          </div>
        </div>

        {/* Recent Transaction Journal */}
        <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
          <div className="p-5 border-b border-[#d1d5db] flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#1e3a5f]">Journal des transactions récentes</h2>
            <div className="flex items-center gap-3">
              <button className="text-sm text-[#4a6670] hover:underline">Voir tout</button>
              <button className="p-1.5 rounded hover:bg-[#f8f9fa] text-[#4b5563]">
                <Filter size={16} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-[#f8f9fa]">
                  <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                    Date & Heure
                  </th>
                  <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                    N° transaction
                  </th>
                  <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                    Catégorie
                  </th>
                  <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                    Description
                  </th>
                  <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                    Statut
                  </th>
                  <th className="text-right text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                    Montant
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1d5db]">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f8f9fa]/50 transition-colors">
                    <td className="px-5 py-4 text-sm text-[#4b5563]">
                      {tx.date}, {tx.time}
                    </td>
                    <td className="px-5 py-4 text-sm font-mono text-[#4a6670]">
                      #{tx.id}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4b5563]">
                      {tx.category}
                    </td>
                    <td className="px-5 py-4 text-sm text-[#4b5563]">
                      {tx.description}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === 'completed' ? 'bg-[#dcfce7] text-[#16a34a]' : 'bg-[#ffedd5] text-[#ea580c]'
                        }`}
                      >
                        {tx.status === 'completed' ? 'TERMINÉE' : 'EN ATTENTE'}
                      </span>
                    </td>
                    <td className={`px-5 py-4 text-sm font-semibold text-right ${
                      tx.amount.startsWith('-') ? 'text-[#dc2626]' : 'text-[#1e3a5f]'
                    }`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="px-5 py-4 border-t border-[#d1d5db] flex items-center justify-center gap-2">
            <button className="p-1.5 rounded hover:bg-[#f8f9fa] text-[#4b5563]">
              <ChevronDown size={16} className="rotate-90" />
            </button>
            <button className="px-3 py-1.5 bg-[#4a6670] text-white rounded text-sm">1</button>
            <button className="px-3 py-1.5 text-[#4b5563] rounded text-sm hover:bg-[#f8f9fa]">2</button>
            <button className="px-3 py-1.5 text-[#4b5563] rounded text-sm hover:bg-[#f8f9fa]">3</button>
            <button className="p-1.5 rounded hover:bg-[#f8f9fa] text-[#4b5563]">
              <ChevronDown size={16} className="-rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
