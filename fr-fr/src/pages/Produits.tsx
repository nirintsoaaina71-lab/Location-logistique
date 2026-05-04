import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Plus, Edit, Trash2, Eye, Package, Pill, AlertTriangle, CheckCircle, Filter, X, ChevronDown, Loader2 } from 'lucide-react';
import { addMedicineSchema } from '../schemas/produit.schemas';
import type { AddMedicineFormData, MedicineResponse } from '../schemas/produit.schemas';
import { useMedicament } from '../../hooks/useMedicament';
import { getCategories } from '../service/medicament.api';

// Type pour les catégories
interface CategorieType {
  id: string;
  nom: string;
  description: string | null;
}

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

interface NewMedicineForm {
  name: string;
  category: string;
  purchasePrice: string;
  salePrice: string;
  stock: string;
  description: string;
}

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

const filterCategories = ['Toutes catégories', 'Antalgique', 'Antibiotique', 'Anti-inflammatoire', 'Gastro-entérologie', 'Antihistaminique', 'Antidiabétique', 'Antihypertenseur'];
const laboratories = ['Tous les laboratoires', 'Sanofi', 'GlaxoSmithKline', 'Bayer', 'AstraZeneca', 'Schering-Plough', 'Merck', 'Pfizer'];
const stockFilters = [
  { value: 'all', label: 'Tout le stock' },
  { value: 'available', label: 'Disponible' },
  { value: 'low', label: 'Stock faible (< 20)' },
  { value: 'out', label: 'Rupture de stock' },
];

export default function Produits() {
  const { medicaments, loading, error, fetchMedicaments, addMedicament: addMedicamentApi, updateMedicament: updateMedicamentApi, deleteMedicament: deleteMedicamentApi } = useMedicament();
  const [categories, setCategories] = useState<CategorieType[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes catégories');
  const [laboratoryFilter, setLaboratoryFilter] = useState('Tous les laboratoires');
  const [stockFilter, setStockFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Charger les catégories depuis le backend
  useEffect(() => {
    const loadCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await getCategories();
        const data = response.data;
        if (Array.isArray(data)) {
          setCategories(data.map((item: Record<string, unknown>) => ({
            id: String(item.id || ''),
            nom: String(item.nom || ''),
            description: item.description as string | null,
          })));
        } else if (data && typeof data === 'object' && 'data' in data && Array.isArray((data as Record<string, unknown>).data)) {
          const arr = (data as Record<string, unknown>).data as Record<string, unknown>[];
          setCategories(arr.map((item) => ({
            id: String(item.id || ''),
            nom: String(item.nom || ''),
            description: item.description as string | null,
          })));
        } else if (data && typeof data === 'object' && 'categories' in data && Array.isArray((data as Record<string, unknown>).categories)) {
          const arr = (data as Record<string, unknown>).categories as Record<string, unknown>[];
          setCategories(arr.map((item) => ({
            id: String(item.id || ''),
            nom: String(item.nom || ''),
            description: item.description as string | null,
          })));
        }
      } catch (err) {
        console.error('[Produits] Erreur lors du chargement des catégories:', err);
      } finally {
        setCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);
  
  // Add modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState<NewMedicineForm>({
    name: '',
    category: '',
    purchasePrice: '',
    salePrice: '',
    stock: '',
    description: '',
  });
  const [selectedCategorieId, setSelectedCategorieId] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // View modal state
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewMedicine, setViewMedicine] = useState<MedicineResponse | null>(null);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editMedicineId, setEditMedicineId] = useState('');
  const [editMedicine, setEditMedicine] = useState<NewMedicineForm>({
    name: '',
    category: '',
    purchasePrice: '',
    salePrice: '',
    stock: '',
    description: '',
  });
  const [editCategorieId, setEditCategorieId] = useState('');
  const [editFormErrors, setEditFormErrors] = useState<Record<string, string>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState(false);
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMedicineId, setDeleteMedicineId] = useState('');
  const [deleteMedicineName, setDeleteMedicineName] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Map API data to Product interface for display
  const products: Product[] = medicaments.map((med: MedicineResponse) => ({
    id: med.id,
    name: med.nom,
    category: med.categorie,
    price: `${med.prixVente.toLocaleString('fr-FR')} AR`,
    stock: med.quantiteEnStock,
    status: med.quantiteEnStock === 0 ? 'out_of_stock' : med.quantiteEnStock < 20 ? 'inactive' : 'active',
    requiresPrescription: false,
    expirationDate: '',
    laboratory: med.categorie,
  }));

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

  const handleOpenAddModal = () => {
    setNewMedicine({
      name: '',
      category: '',
      purchasePrice: '',
      salePrice: '',
      stock: '',
      description: '',
    });
    setSelectedCategorieId('');
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Validate form data using Zod schema
    const result = addMedicineSchema.safeParse(newMedicine);
    
    if (!result.success) {
      // Extract errors from Zod validation
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (!errors[path]) {
          errors[path] = err.message;
        }
      });
      setFormErrors(errors);
      setSubmitLoading(false);
      return;
    }
    
    // Form is valid, proceed with submission
    const validatedData: AddMedicineFormData = result.data;
    
    // Check if category is selected
    if (!selectedCategorieId) {
      setFormErrors({ category: 'Veuillez sélectionner une catégorie' });
      setSubmitLoading(false);
      return;
    }
    
    try {
      const response = await addMedicamentApi(validatedData, selectedCategorieId);
      
      if (response.success) {
        setSubmitSuccess(true);
        setNewMedicine({
          name: '',
          category: '',
          purchasePrice: '',
          salePrice: '',
          stock: '',
          description: '',
        });
        setSelectedCategorieId('');
        setFormErrors({});
        // Close modal after a short delay
        setTimeout(() => {
          setShowAddModal(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        setSubmitError(response.error || "Erreur lors de l'ajout du médicament");
      }
    } catch (err) {
      setSubmitError("Erreur lors de l'ajout du médicament");
    } finally {
      setSubmitLoading(false);
    }
  };

  // View medicine handler
  const handleViewMedicine = (medicine: MedicineResponse) => {
    setViewMedicine(medicine);
    setShowViewModal(true);
  };

  // Edit medicine handlers
  const handleOpenEditModal = (medicine: MedicineResponse) => {
    setEditMedicineId(medicine.id);
    setEditMedicine({
      name: medicine.nom,
      category: medicine.categorie,
      purchasePrice: String(medicine.prixAchat),
      salePrice: String(medicine.prixVente),
      stock: String(medicine.quantiteEnStock),
      description: medicine.description || '',
    });
    // Find the category ID from the medicine using local categories
    const cat = categories.find(c => c.nom === medicine.categorie);
    setEditCategorieId(cat?.id || '');
    setEditFormErrors({});
    setEditError(null);
    setEditSuccess(false);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditMedicine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitEditMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    setEditSuccess(false);

    // Validate form data
    const result = addMedicineSchema.safeParse(editMedicine);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path[0] as string;
        if (!errors[path]) {
          errors[path] = err.message;
        }
      });
      setEditFormErrors(errors);
      setEditLoading(false);
      return;
    }

    if (!editCategorieId) {
      setEditFormErrors({ category: 'Veuillez sélectionner une catégorie' });
      setEditLoading(false);
      return;
    }

    try {
      const response = await updateMedicamentApi(editMedicineId, result.data, editCategorieId);

      if (response.success) {
        setEditSuccess(true);
        setTimeout(() => {
          setShowEditModal(false);
          setEditSuccess(false);
        }, 1500);
      } else {
        setEditError(response.error || "Erreur lors de la modification du médicament");
      }
    } catch (err) {
      setEditError("Erreur lors de la modification du médicament");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete medicine handlers
  const handleOpenDeleteModal = (id: string, name: string) => {
    setDeleteMedicineId(id);
    setDeleteMedicineName(name);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteMedicine = async () => {
    console.log('[Produits] Suppression du médicament:', deleteMedicineId, deleteMedicineName);
    setDeleteLoading(true);
    try {
      console.log('[Produits] Appel de deleteMedicamentApi...');
      const response = await deleteMedicamentApi(deleteMedicineId);
      console.log('[Produits] Réponse:', response);
      if (response.success) {
        setShowDeleteModal(false);
      } else {
        console.error('Erreur lors de la suppression:', response.error);
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    } finally {
      setDeleteLoading(false);
    }
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
          <button 
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-medium text-sm"
          >
            <Plus size={18} />
            Nouveau médicament
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={40} className="text-primary animate-spin mb-4" />
            <p className="text-text-secondary">Chargement des médicaments...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 text-center">
            <p className="text-danger">{error}</p>
            <button
              onClick={fetchMedicaments}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
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
                          {filterCategories.map((cat) => (
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
                      <button
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
                        title="Voir"
                        onClick={() => handleViewMedicine(medicaments.find(m => m.id === product.id)!)}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
                        title="Modifier"
                        onClick={() => handleOpenEditModal(medicaments.find(m => m.id === product.id)!)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-danger/10 transition-colors text-danger"
                        title="Supprimer"
                        onClick={() => handleOpenDeleteModal(product.id, product.name)}
                      >
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
          </>
        )}

        {/* Add New Medicine Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Pill size={20} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">Nouveau médicament</h2>
                </div>
                <button
                  onClick={handleCloseAddModal}
                  className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
                  disabled={submitLoading}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Success/Error Messages */}
              {submitSuccess && (
                <div className="mx-6 mt-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                  ✓ Médicament ajouté avec succès!
                </div>
              )}
              {submitError && (
                <div className="mx-6 mt-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                  {submitError}
                </div>
              )}

              {/* Modal Body - Form */}
              <form onSubmit={handleSubmitNewMedicine} className="p-6 space-y-5">
                {/* Loading Overlay */}
                {submitLoading && (
                  <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="text-primary animate-spin" />
                      <p className="text-sm text-text-secondary">Ajout en cours...</p>
                    </div>
                  </div>
                )}

                {/* Medicament Name */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nom du médicament <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newMedicine.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Paracétamol 1000mg"
                    className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      formErrors.name ? 'border-danger' : 'border-border'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-danger text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Catégorie <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategorieId}
                      onChange={(e) => {
                        const catId = e.target.value;
                        setSelectedCategorieId(catId);
                        // Also update newMedicine.category with the category name for Zod validation
                        const cat = categories.find(c => c.id === catId);
                        setNewMedicine((prev) => ({ ...prev, category: cat?.nom || '' }));
                        setFormErrors((prev) => ({ ...prev, category: '' }));
                      }}
                      disabled={categoriesLoading}
                      className={`w-full appearance-none px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer ${
                        formErrors.category ? 'border-danger' : 'border-border'
                      }`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categoriesLoading && <option value="" disabled>Chargement...</option>}
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                      ))}
                    </select>
                    {categoriesLoading ? (
                      <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin pointer-events-none" />
                    ) : (
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    )}
                  </div>
                  {formErrors.category && (
                    <p className="text-danger text-xs mt-1">{formErrors.category}</p>
                  )}
                </div>

                {/* Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Purchase Price */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Prix d'achat (AR) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={newMedicine.purchasePrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                        formErrors.purchasePrice ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {formErrors.purchasePrice && (
                      <p className="text-danger text-xs mt-1">{formErrors.purchasePrice}</p>
                    )}
                  </div>

                  {/* Sale Price */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Prix de vente (AR) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="salePrice"
                      value={newMedicine.salePrice}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                        formErrors.salePrice ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {formErrors.salePrice && (
                      <p className="text-danger text-xs mt-1">{formErrors.salePrice}</p>
                    )}
                  </div>
                </div>

                {/* Stock (Number of boxes) */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nombre de boîtes en stock <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newMedicine.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    step="1"
                    min="0"
                    className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      formErrors.stock ? 'border-danger' : 'border-border'
                    }`}
                  />
                  {formErrors.stock && (
                    <p className="text-danger text-xs mt-1">{formErrors.stock}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newMedicine.description}
                    onChange={handleInputChange}
                    placeholder="Description du médicament..."
                    rows={4}
                    className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none ${
                      formErrors.description ? 'border-danger' : 'border-border'
                    }`}
                  />
                  {formErrors.description && (
                    <p className="text-danger text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="flex-1 px-4 py-3 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                    disabled={submitLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      'Ajouter le médicament'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Medicine Modal */}
        {showViewModal && viewMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Pill size={20} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">Détails du médicament</h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm text-text-secondary">Nom</p>
                  <p className="text-lg font-semibold text-text-primary">{viewMedicine.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Catégorie</p>
                  <p className="text-lg font-semibold text-text-primary">{viewMedicine.categorie}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">Prix d'achat</p>
                    <p className="text-lg font-semibold text-text-primary">{viewMedicine.prixAchat.toLocaleString('fr-FR')} AR</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Prix de vente</p>
                    <p className="text-lg font-semibold text-text-primary">{viewMedicine.prixVente.toLocaleString('fr-FR')} AR</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Quantité en stock</p>
                  <p className="text-lg font-semibold text-text-primary">{viewMedicine.quantiteEnStock} boîtes</p>
                </div>
                {viewMedicine.description && (
                  <div>
                    <p className="text-sm text-text-secondary">Description</p>
                    <p className="text-text-primary mt-1">{viewMedicine.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary">Créé le</p>
                    <p className="text-sm text-text-primary">{viewMedicine.createdAt ? new Date(viewMedicine.createdAt).toLocaleDateString('fr-FR') : '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Modifié le</p>
                    <p className="text-sm text-text-primary">{viewMedicine.updatedAt ? new Date(viewMedicine.updatedAt).toLocaleDateString('fr-FR') : '-'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Medicine Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Edit size={20} className="text-warning" />
                  </div>
                  <h2 className="text-xl font-bold text-text-primary">Modifier le médicament</h2>
                </div>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 rounded-lg hover:bg-surface-hover transition-colors text-text-secondary"
                  disabled={editLoading}
                >
                  <X size={20} />
                </button>
              </div>

              {editSuccess && (
                <div className="mx-6 mt-4 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
                  ✓ Médicament modifié avec succès!
                </div>
              )}
              {editError && (
                <div className="mx-6 mt-4 p-3 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSubmitEditMedicine} className="p-6 space-y-5 relative">
                {editLoading && (
                  <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={32} className="text-primary animate-spin" />
                      <p className="text-sm text-text-secondary">Modification en cours...</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nom du médicament <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editMedicine.name}
                    onChange={handleEditInputChange}
                    placeholder="Ex: Paracétamol 1000mg"
                    className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      editFormErrors.name ? 'border-danger' : 'border-border'
                    }`}
                  />
                  {editFormErrors.name && (
                    <p className="text-danger text-xs mt-1">{editFormErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Catégorie <span className="text-danger">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={editCategorieId}
                      onChange={(e) => {
                        const catId = e.target.value;
                        setEditCategorieId(catId);
                        // Also update editMedicine.category with the category name for Zod validation
                        const cat = categories.find(c => c.id === catId);
                        setEditMedicine((prev) => ({ ...prev, category: cat?.nom || '' }));
                        setEditFormErrors((prev) => ({ ...prev, category: '' }));
                      }}
                      disabled={categoriesLoading}
                      className={`w-full appearance-none px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer ${
                        editFormErrors.category ? 'border-danger' : 'border-border'
                      }`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categoriesLoading && <option value="" disabled>Chargement...</option>}
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                      ))}
                    </select>
                    {categoriesLoading ? (
                      <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin pointer-events-none" />
                    ) : (
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    )}
                  </div>
                  {editFormErrors.category && (
                    <p className="text-danger text-xs mt-1">{editFormErrors.category}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Prix d'achat (AR) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={editMedicine.purchasePrice}
                      onChange={handleEditInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                        editFormErrors.purchasePrice ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {editFormErrors.purchasePrice && (
                      <p className="text-danger text-xs mt-1">{editFormErrors.purchasePrice}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Prix de vente (AR) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      name="salePrice"
                      value={editMedicine.salePrice}
                      onChange={handleEditInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                        editFormErrors.salePrice ? 'border-danger' : 'border-border'
                      }`}
                    />
                    {editFormErrors.salePrice && (
                      <p className="text-danger text-xs mt-1">{editFormErrors.salePrice}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Nombre de boîtes en stock <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editMedicine.stock}
                    onChange={handleEditInputChange}
                    placeholder="0"
                    step="1"
                    min="0"
                    className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all ${
                      editFormErrors.stock ? 'border-danger' : 'border-border'
                    }`}
                  />
                  {editFormErrors.stock && (
                    <p className="text-danger text-xs mt-1">{editFormErrors.stock}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editMedicine.description}
                    onChange={handleEditInputChange}
                    placeholder="Description du médicament..."
                    rows={4}
                    className={`w-full px-4 py-3 bg-surface-hover border rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none ${
                      editFormErrors.description ? 'border-danger' : 'border-border'
                    }`}
                  />
                  {editFormErrors.description && (
                    <p className="text-danger text-xs mt-1">{editFormErrors.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="flex-1 px-4 py-3 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                    disabled={editLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Modification en cours...
                      </>
                    ) : (
                      'Enregistrer les modifications'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-danger/10 rounded-full mb-4">
                  <Trash2 size={24} className="text-danger" />
                </div>
                <h3 className="text-lg font-bold text-text-primary text-center mb-2">Supprimer le médicament</h3>
                <p className="text-text-secondary text-center">
                  Êtes-vous sûr de vouloir supprimer <span className="font-semibold text-text-primary">{deleteMedicineName}</span> ? Cette action est irréversible.
                </p>
              </div>
              <div className="flex items-center gap-3 p-6 border-t border-border">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 px-4 py-3 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-hover transition-colors"
                  disabled={deleteLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteMedicine}
                  disabled={deleteLoading}
                  className="flex-1 px-4 py-3 bg-danger text-white rounded-lg text-sm font-medium hover:bg-danger-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    'Supprimer'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
