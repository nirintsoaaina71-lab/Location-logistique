import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Plus, Edit, Trash2, Eye, Package, Pill, AlertTriangle, CheckCircle, Filter, X, ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  requiresPrescription: boolean;
  expirationDate: string;
  laboratory: string;
}

const products: Product[] = [
  {
    id: 'MED-001',
    name: 'Paracétamol 1000mg',
    category: 'Antalgique',
    price: '4.50 €',
    stock: 450,
    status: 'active',
    requiresPrescription: false,
    expirationDate: '2025-06-15',
    laboratory: 'Sanofi',
  },
  {
    id: 'MED-002',
    name: 'Amoxicilline 500mg',
    category: 'Antibiotique',
    price: '6.99 €',
    stock: 120,
    status: 'active',
    requiresPrescription: true,
    expirationDate: '2025-03-20',
    laboratory: 'GlaxoSmithKline',
  },
  {
    id: 'MED-003',
    name: 'Ibuprofène 400mg',
    category: 'Anti-inflammatoire',
    price: '5.00 €',
    stock: 0,
    status: 'out_of_stock',
    requiresPrescription: false,
    expirationDate: '2025-08-10',
    laboratory: 'Bayer',
  },
  {
    id: 'MED-004',
    name: 'Oméprazole 20mg',
    category: 'Gastro-entérologie',
    price: '8.99 €',
    stock: 300,
    status: 'active',
    requiresPrescription: true,
    expirationDate: '2025-12-01',
    laboratory: 'AstraZeneca',
  },
  {
    id: 'MED-005',
    name: 'Loratadine 10mg',
    category: 'Antihistaminique',
    price: '5.50 €',
    stock: 200,
    status: 'active',
    requiresPrescription: false,
    expirationDate: '2025-09-25',
    laboratory: 'Schering-Plough',
  },
  {
    id: 'MED-006',
    name: 'Metformine 850mg',
    category: 'Antidiabétique',
    price: '3.99 €',
    stock: 15,
    status: 'active',
    requiresPrescription: true,
    expirationDate: '2025-04-30',
    laboratory: 'Merck',
  },
  {
    id: 'MED-007',
    name: 'Amlodipine 5mg',
    category: 'Antihypertenseur',
    price: '7.50 €',
    stock: 180,
    status: 'active',
    requiresPrescription: true,
    expirationDate: '2025-11-15',
    laboratory: 'Pfizer',
  },
  {
    id: 'MED-008',
    name: 'Aspirine 500mg',
    category: 'Antalgique',
    price: '3.99 €',
    stock: 500,
    status: 'active',
    requiresPrescription: false,
    expirationDate: '2025-07-20',
    laboratory: 'Bayer',
  },
];

const statusLabels = {
  active: 'Disponible',
  inactive: 'Inactif',
  out_of_stock: 'Rupture',
};

const statusClasses = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-gray-500/10 text-gray-500',
  out_of_stock: 'bg-danger/10 text-danger',
};

const categories = ['Toutes catégories', 'Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Gastro-entérologie', 'Antihistaminique', 'Antidiabétique', 'Antihypertenseur'];
const laboratories = ['Tous les laboratoires', 'Sanofi', 'GlaxoSmithKline', 'Bayer', 'AstraZeneca', 'Schering-Plough', 'Merck', 'Pfizer'];
const stockFilters = [
  { value: 'all', label: 'Tout le stock' },
  { value: 'available', label: 'Disponible' },
  { value: 'low', label: 'Stock faible (< 20)' },
  { value: 'out', label: 'Rupture de stock' },
];

export default function Produits() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes catégories');
  const [laboratoryFilter, setLaboratoryFilter] = useState('Tous les laboratoires');
  const [stockFilter, setStockFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.laboratory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Toutes catégories' || product.category === categoryFilter;
    const matchesLaboratory = laboratoryFilter === 'Tous les laboratoires' || product.laboratory === laboratoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'available') matchesStock = product.stock > 0;
    else if (stockFilter === 'low') matchesStock = product.stock > 0 && product.stock < 20;
    else if (stockFilter === 'out') matchesStock = product.stock === 0;

    return matchesSearch && matchesCategory && matchesLaboratory && matchesStock;
  });

  const activeFiltersCount = [
    categoryFilter !== 'Toutes catégories',
    laboratoryFilter !== 'Tous les laboratoires',
    stockFilter !== 'all',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setCategoryFilter('Toutes catégories');
    setLaboratoryFilter('Tous les laboratoires');
    setStockFilter('all');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Médicaments</h1>
            <p className="text-text-secondary mt-1">Gérez votre catalogue de médicaments</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm">
            <Plus size={18} />
            Nouveau médicament
          </button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-text-primary mt-1">{products.length}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Pill size={20} className="text-primary sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Disponibles</p>
                <p className="text-xl sm:text-2xl font-bold text-success mt-1">
                  {products.filter((p) => p.status === 'active').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle size={20} className="text-success sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Stock faible</p>
                <p className="text-xl sm:text-2xl font-bold text-warning mt-1">
                  {products.filter((p) => p.stock > 0 && p.stock < 20).length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle size={20} className="text-warning sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Rupture</p>
                <p className="text-xl sm:text-2xl font-bold text-danger mt-1">
                  {products.filter((p) => p.status === 'out_of_stock').length}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                <Package size={20} className="text-danger sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Search bar - Separate section */}
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Rechercher par nom, référence ou laboratoire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface-hover border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Filters section - Separate section */}
        <div className="bg-surface border border-border rounded-xl">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-text-secondary" />
              <h3 className="text-sm font-medium text-text-secondary">Filtres</h3>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                >
                  Réinitialiser
                </button>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
              >
                <ChevronDown size={18} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {showFilters && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Category filter */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">Catégorie</label>
                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-10 py-2.5 bg-surface-hover border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Laboratory filter */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">Laboratoire</label>
                  <div className="relative">
                    <select
                      value={laboratoryFilter}
                      onChange={(e) => setLaboratoryFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-10 py-2.5 bg-surface-hover border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                    >
                      {laboratories.map((lab) => (
                        <option key={lab} value={lab}>{lab}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>

                {/* Stock filter */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">Stock</label>
                  <div className="relative">
                    <select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      className="w-full appearance-none pl-3 pr-10 py-2.5 bg-surface-hover border border-border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
                    >
                      {stockFilters.map((sf) => (
                        <option key={sf.value} value={sf.value}>{sf.label}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Active filters display */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                  <span className="text-xs text-text-muted">Filtres actifs:</span>
                  {categoryFilter !== 'Toutes catégories' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {categoryFilter}
                      <button onClick={() => setCategoryFilter('Toutes catégories')} className="hover:text-primary-hover">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {laboratoryFilter !== 'Tous les laboratoires' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {laboratoryFilter}
                      <button onClick={() => setLaboratoryFilter('Tous les laboratoires')} className="hover:text-primary-hover">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {stockFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                      {stockFilters.find(sf => sf.value === stockFilter)?.label}
                      <button onClick={() => setStockFilter('all')} className="hover:text-primary-hover">
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-text-primary">{filteredProducts.length}</span> médicament{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Products list - Different card design */}
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-surface border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      product.status === 'out_of_stock' ? 'bg-danger/10' : 
                      product.stock < 20 ? 'bg-warning/10' : 'bg-primary/10'
                    }`}>
                      <Pill size={20} className={
                        product.status === 'out_of_stock' ? 'text-danger' : 
                        product.stock < 20 ? 'text-warning' : 'text-primary'
                      } />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-text-primary truncate">{product.name}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusClasses[product.status]}`}>
                          {statusLabels[product.status]}
                        </span>
                        {product.requiresPrescription && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-info/10 text-info">
                            Ordonnance
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-text-secondary">
                        <span className="text-text-muted">{product.id}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span>{product.laboratory}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price and Stock */}
                <div className="flex items-center gap-6 sm:gap-8 pl-13 sm:pl-0">
                  <div className="text-right">
                    <p className="text-lg font-bold text-text-primary">{product.price}</p>
                    <p className="text-xs text-text-muted">Prix unitaire</p>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className={`text-lg font-bold ${
                      product.stock === 0 ? 'text-danger' : 
                      product.stock < 20 ? 'text-warning' : 'text-success'
                    }`}>
                      {product.stock}
                    </p>
                    <p className="text-xs text-text-muted">En stock</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-border sm:border-none">
                  <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary" title="Voir">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary" title="Modifier">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-danger/10 transition-colors text-danger" title="Supprimer">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-surface border border-border rounded-xl py-12 text-center">
            <Package size={48} className="mx-auto text-text-muted mb-4" />
            <p className="text-text-secondary">Aucun médicament trouvé</p>
            <button
              onClick={clearAllFilters}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
