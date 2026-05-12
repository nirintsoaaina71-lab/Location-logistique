import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Search, Plus, Edit, Trash2, Eye, Package, X, ChevronDown, Loader2, Download, Pill } from 'lucide-react';
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
  dosage?: string;
  lotNumber?: string;
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
  active: 'En stock',
  inactive: 'Stock faible',
  out_of_stock: 'Expiré',
};

const statusClasses = {
  active: 'bg-[#dcfce7] text-[#16a34a]',
  inactive: 'bg-[#ffedd5] text-[#ea580c]',
  out_of_stock: 'bg-[#fee2e2] text-[#dc2626]',
};

const stockFilters = [
  { value: 'all', label: 'Tout afficher' },
  { value: 'available', label: 'En stock' },
  { value: 'low', label: 'Stock faible (< 20)' },
  { value: 'out', label: 'Expiré' },
];

export default function Produits() {
  const { medicaments, loading, error, fetchMedicaments, addMedicament: addMedicamentApi, updateMedicament: updateMedicamentApi, deleteMedicament: deleteMedicamentApi } = useMedicament();
  const [categories, setCategories] = useState<CategorieType[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes catégories');
  const [stockFilter, setStockFilter] = useState('all');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    dosage: med.nom.split(' ').slice(1).join(' '),
    lotNumber: `LOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  }));

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.laboratory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Toutes catégories' || product.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'available') matchesStock = product.stock > 0 && product.status !== 'out_of_stock';
    else if (stockFilter === 'low') matchesStock = product.stock > 0 && product.stock < 20;
    else if (stockFilter === 'out') matchesStock = product.status === 'out_of_stock';

    const matchesLetter = !selectedLetter || product.name.toUpperCase().startsWith(selectedLetter);

    return matchesSearch && matchesCategory && matchesStock && matchesLetter;
  });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, stockFilter, selectedLetter]);

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
    
    const result = addMedicineSchema.safeParse(newMedicine);
    
    if (!result.success) {
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
    
    const validatedData: AddMedicineFormData = result.data;
    
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
        setTimeout(() => {
          setShowAddModal(false);
          setSubmitSuccess(false);
        }, 1500);
      } else {
        setSubmitError(response.error || "Erreur lors de l'ajout du médicament");
      }
    } catch {
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
    } catch {
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
    setDeleteLoading(true);
    try {
      const response = await deleteMedicamentApi(deleteMedicineId);
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

  // Calculate stats
  const totalSkus = products.length;
  const lowStockAlerts = products.filter((p) => p.stock > 0 && p.stock < 20).length;
  const expiredCount = products.filter((p) => p.status === 'out_of_stock').length;
  const inventoryValue = products.reduce((sum, p) => sum + p.stock * parseFloat(p.price.replace(' AR', '').replace(/\s/g, '')), 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#1e3a5f]">Gestion des médicaments</h1>
            <p className="text-[#4b5563] text-sm mt-0.5">Suivi des stocks et contrôles de distribution en temps réel</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#d1d5db] text-[#4b5563] rounded text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
              <Download size={16} />
              Exporter CSV
            </button>
            <button 
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#4a6670] text-white rounded text-sm font-medium hover:bg-[#3d5660] transition-colors"
            >
              <Plus size={16} />
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Category Filter */}
              <div className="flex-1">
                <label className="block text-xs text-[#4b5563] mb-1">Filtrer par catégorie</label>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-10 py-2 bg-white border border-[#d1d5db] rounded text-sm text-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all cursor-pointer"
                  >
                    <option value="Toutes catégories">Toutes catégories</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex-1">
                <label className="block text-xs text-[#4b5563] mb-1">Statut du stock</label>
                <div className="relative">
                  <select
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full appearance-none pl-3 pr-10 py-2 bg-white border border-[#d1d5db] rounded text-sm text-[#4b5563] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all cursor-pointer"
                  >
                    {stockFilters.map((sf) => (
                      <option key={sf.value} value={sf.value}>{sf.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Quick Search */}
            <div className="flex-1 lg:max-w-xs">
              <label className="block text-xs text-[#4b5563] mb-1">Recherche rapide</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
                <input
                  type="text"
                  placeholder="Filtrer par nom ou lot..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all"
                />
              </div>
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-4 border-t border-[#f1f5f9]">
            <button
              onClick={() => setSelectedLetter(null)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                !selectedLetter ? 'bg-[#1e3a5f] text-white' : 'bg-[#f1f5f9] text-[#4b5563] hover:bg-[#e2e8f0]'
              }`}
            >
              Tout
            </button>
            {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                className={`w-7 h-7 flex items-center justify-center rounded text-[10px] font-bold transition-all ${
                  selectedLetter === letter ? 'bg-[#1e3a5f] text-white' : 'bg-[#f1f5f9] text-[#4b5563] hover:bg-[#e2e8f0]'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={32} className="text-[#4a6670] animate-spin mb-3" />
            <p className="text-[#4b5563] text-sm">Chargement des médicaments...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-lg p-4 text-center">
            <p className="text-[#dc2626] text-sm">{error}</p>
            <button
              onClick={fetchMedicaments}
              className="mt-2 text-sm text-[#4a6670] hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Products table */}
            <div className="bg-white border border-[#d1d5db] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="bg-[#f8f9fa]">
                      <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                        Nom du médicament
                      </th>
                      <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                        Catégorie
                      </th>
                      <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                        Quantité
                      </th>
                      <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                        Numéro de lot
                      </th>
                      <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                        Expiration
                      </th>
                      <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                        Statut
                      </th>
                      <th className="text-left text-xs font-medium text-[#4b5563] uppercase tracking-wider px-5 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d1d5db]">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#f8f9fa]/50 transition-colors">
                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm font-medium text-[#1e3a5f]">{product.name}</p>
                            <p className="text-xs text-[#4b5563]">{product.dosage || 'Tablets'}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4b5563]">
                          {product.category}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-sm font-semibold ${
                            product.stock === 0 ? 'text-[#dc2626]' : 
                            product.stock < 20 ? 'text-[#ea580c]' : 'text-[#1e3a5f]'
                          }`}>
                            {product.stock.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4b5563] font-mono">
                          {product.lotNumber}
                        </td>
                        <td className="px-5 py-4 text-sm text-[#4b5563]">
                          {product.expirationDate || '12 Oct 2025'}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              statusClasses[product.status]
                            }`}
                          >
                            {statusLabels[product.status]}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1.5 rounded hover:bg-[#f8f9fa] transition-colors text-[#4b5563]"
                              title="Voir"
                              onClick={() => handleViewMedicine(medicaments.find(m => m.id === product.id)!)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-[#4a6670]/10 transition-colors text-[#4a6670]"
                              title="Modifier"
                              onClick={() => handleOpenEditModal(medicaments.find(m => m.id === product.id)!)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="p-1.5 rounded hover:bg-[#dc2626]/10 transition-colors text-[#dc2626]"
                              title="Supprimer"
                              onClick={() => handleOpenDeleteModal(product.id, product.name)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredProducts.length === 0 && (
                <div className="py-12 text-center">
                  <Package size={40} className="mx-auto text-[#9ca3af] mb-3" />
                  <p className="text-[#4b5563] text-sm">Aucun médicament trouvé</p>
                </div>
              )}
              {/* Pagination */}
              <div className="px-5 py-4 border-t border-[#d1d5db] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-[#4b5563]">
                  Affichage de {Math.min(filteredProducts.length, (currentPage - 1) * itemsPerPage + 1)} à {Math.min(filteredProducts.length, currentPage * itemsPerPage)} sur {filteredProducts.length} entrées
                </p>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded border border-[#d1d5db] hover:bg-[#f8f9fa] text-[#4b5563] disabled:opacity-30"
                  >
                    <ChevronDown size={16} className="rotate-90" />
                  </button>
                  
                  <div className="flex items-center gap-1 mx-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          currentPage === i + 1 
                            ? 'bg-[#4a6670] text-white' 
                            : 'text-[#4b5563] hover:bg-[#f8f9fa]'
                        }`}
                      >
                        {i + 1}
                      </button>
                    )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="p-1.5 rounded border border-[#d1d5db] hover:bg-[#f8f9fa] text-[#4b5563] disabled:opacity-30"
                  >
                    <ChevronDown size={16} className="-rotate-90" />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
                <p className="text-xs text-[#4b5563] uppercase tracking-wider">Total références</p>
                <p className="text-2xl font-semibold text-[#1e3a5f] mt-1">{totalSkus.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
                <p className="text-xs text-[#4b5563] uppercase tracking-wider">Alertes stock faible</p>
                <p className="text-2xl font-semibold text-[#ea580c] mt-1">{lowStockAlerts}</p>
              </div>
              <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
                <p className="text-xs text-[#4b5563] uppercase tracking-wider">Expirés (30j)</p>
                <p className="text-2xl font-semibold text-[#dc2626] mt-1">{expiredCount}</p>
              </div>
              <div className="bg-white border border-[#d1d5db] rounded-lg p-4">
                <p className="text-xs text-[#4b5563] uppercase tracking-wider">Valeur du stock</p>
                <p className="text-2xl font-semibold text-[#1e3a5f] mt-1">{inventoryValue.toLocaleString('fr-FR')} AR</p>
              </div>
            </div>
          </>
        )}

        {/* Add New Medicine Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white border border-[#d1d5db] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl relative">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-5 border-b border-[#d1d5db]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-[#4a6670]/10 rounded-lg flex items-center justify-center">
                    <Pill size={18} className="text-[#4a6670]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[#1e3a5f]">Ajouter un médicament</h2>
                </div>
                <button
                  onClick={handleCloseAddModal}
                  className="p-1.5 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]"
                  disabled={submitLoading}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Success/Error Messages */}
              {submitSuccess && (
                <div className="mx-5 mt-4 p-3 bg-[#dcfce7] border border-[#16a34a]/20 rounded text-[#16a34a] text-sm">
                  ✓ Médicament ajouté avec succès !
                </div>
              )}
              {submitError && (
                <div className="mx-5 mt-4 p-3 bg-[#fee2e2] border border-[#dc2626]/20 rounded text-[#dc2626] text-sm">
                  {submitError}
                </div>
              )}

              {/* Modal Body - Form */}
              <form onSubmit={handleSubmitNewMedicine} className="p-5 space-y-4">
                {/* Loading Overlay */}
                {submitLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={28} className="text-[#4a6670] animate-spin" />
                      <p className="text-sm text-[#4b5563]">Ajout en cours...</p>
                    </div>
                  </div>
                )}

                {/* Medicament Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Nom du médicament <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newMedicine.name}
                    onChange={handleInputChange}
                    placeholder="Ex: Amoxicilline 500mg"
                    className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                      formErrors.name ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="text-[#dc2626] text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Catégorie <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedCategorieId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedCategorieId(val);
                        setNewMedicine(prev => ({ ...prev, category: val }));
                        // Clear error when value is selected
                        if (val && formErrors.category) {
                          setFormErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.category;
                            return newErrors;
                          });
                        }
                      }}
                      className={`w-full appearance-none pl-3 pr-10 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                        formErrors.category ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      }`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                  </div>
                  {formErrors.category && (
                    <p className="text-[#dc2626] text-xs mt-1">{formErrors.category}</p>
                  )}
                </div>

                {/* Purchase Price */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Prix d'achat <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    name="purchasePrice"
                    value={newMedicine.purchasePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                      formErrors.purchasePrice ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {formErrors.purchasePrice && (
                    <p className="text-[#dc2626] text-xs mt-1">{formErrors.purchasePrice}</p>
                  )}
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Prix de vente <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={newMedicine.salePrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                      formErrors.salePrice ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {formErrors.salePrice && (
                    <p className="text-[#dc2626] text-xs mt-1">{formErrors.salePrice}</p>
                  )}
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Quantité en stock <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={newMedicine.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                      formErrors.stock ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {formErrors.stock && (
                    <p className="text-[#dc2626] text-xs mt-1">{formErrors.stock}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newMedicine.description}
                    onChange={handleInputChange}
                    placeholder="Description du médicament..."
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] placeholder-[#9ca3af] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[#d1d5db]">
                  <button
                    type="button"
                    onClick={handleCloseAddModal}
                    className="px-4 py-2.5 border border-[#d1d5db] text-[#4b5563] rounded text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
                    disabled={submitLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="px-4 py-2.5 bg-[#4a6670] text-white rounded text-sm font-medium hover:bg-[#3d5660] transition-colors disabled:opacity-50"
                  >
                    Ajouter le médicament
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && viewMedicine && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white border border-[#d1d5db] rounded-lg w-full max-w-lg shadow-xl">
              <div className="flex items-center justify-between p-5 border-b border-[#d1d5db]">
                <h2 className="text-lg font-semibold text-[#1e3a5f]">Détails du médicament</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-1.5 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-[#4b5563] uppercase tracking-wider">Nom</p>
                  <p className="text-sm font-medium text-[#1e3a5f]">{viewMedicine.nom}</p>
                </div>
                <div>
                  <p className="text-xs text-[#4b5563] uppercase tracking-wider">Catégorie</p>
                  <p className="text-sm text-[#4b5563]">{viewMedicine.categorie}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#4b5563] uppercase tracking-wider">Prix d'achat</p>
                    <p className="text-sm text-[#1e3a5f]">{viewMedicine.prixAchat.toLocaleString('fr-FR')} AR</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#4b5563] uppercase tracking-wider">Prix de vente</p>
                    <p className="text-sm text-[#1e3a5f]">{viewMedicine.prixVente.toLocaleString('fr-FR')} AR</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#4b5563] uppercase tracking-wider">Stock</p>
                  <p className="text-sm text-[#1e3a5f]">{viewMedicine.quantiteEnStock} unités</p>
                </div>
                {viewMedicine.description && (
                  <div>
                    <p className="text-xs text-[#4b5563] uppercase tracking-wider">Description</p>
                    <p className="text-sm text-[#4b5563]">{viewMedicine.description}</p>
                  </div>
                )}
              </div>
              <div className="p-5 border-t border-[#d1d5db] flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2.5 bg-[#4a6670] text-white rounded text-sm font-medium hover:bg-[#3d5660] transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white border border-[#d1d5db] rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl relative">
              <div className="flex items-center justify-between p-5 border-b border-[#d1d5db]">
                <h2 className="text-lg font-semibold text-[#1e3a5f]">Modifier le médicament</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="p-1.5 rounded-lg hover:bg-[#f8f9fa] transition-colors text-[#4b5563]"
                  disabled={editLoading}
                >
                  <X size={18} />
                </button>
              </div>

              {editSuccess && (
                <div className="mx-5 mt-4 p-3 bg-[#dcfce7] border border-[#16a34a]/20 rounded text-[#16a34a] text-sm">
                  ✓ Médicament modifié avec succès !
                </div>
              )}
              {editError && (
                <div className="mx-5 mt-4 p-3 bg-[#fee2e2] border border-[#dc2626]/20 rounded text-[#dc2626] text-sm">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSubmitEditMedicine} className="p-5 space-y-4">
                {editLoading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 size={28} className="text-[#4a6670] animate-spin" />
                      <p className="text-sm text-[#4b5563]">Modification en cours...</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Nom du médicament <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editMedicine.name}
                    onChange={handleEditInputChange}
                    className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                      editFormErrors.name ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {editFormErrors.name && (
                    <p className="text-[#dc2626] text-xs mt-1">{editFormErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Catégorie <span className="text-[#dc2626]">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={editCategorieId}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditCategorieId(val);
                        setEditMedicine(prev => ({ ...prev, category: val }));
                        // Clear error when value is selected
                        if (val && editFormErrors.category) {
                          setEditFormErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.category;
                            return newErrors;
                          });
                        }
                      }}
                      className={`w-full appearance-none pl-3 pr-10 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                        editFormErrors.category ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      }`}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.nom}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] pointer-events-none" />
                  </div>
                  {editFormErrors.category && (
                    <p className="text-[#dc2626] text-xs mt-1">{editFormErrors.category}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                      Prix d'achat <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="number"
                      name="purchasePrice"
                      value={editMedicine.purchasePrice}
                      onChange={handleEditInputChange}
                      className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                        editFormErrors.purchasePrice ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      }`}
                    />
                    {editFormErrors.purchasePrice && (
                      <p className="text-[#dc2626] text-xs mt-1">{editFormErrors.purchasePrice}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                      Prix de vente <span className="text-[#dc2626]">*</span>
                    </label>
                    <input
                      type="number"
                      name="salePrice"
                      value={editMedicine.salePrice}
                      onChange={handleEditInputChange}
                      className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                        editFormErrors.salePrice ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                      }`}
                    />
                    {editFormErrors.salePrice && (
                      <p className="text-[#dc2626] text-xs mt-1">{editFormErrors.salePrice}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Quantité en stock <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editMedicine.stock}
                    onChange={handleEditInputChange}
                    className={`w-full px-3.5 py-2.5 bg-[#f8f9fa] border rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all ${
                      editFormErrors.stock ? 'border-[#dc2626]' : 'border-[#d1d5db]'
                    }`}
                  />
                  {editFormErrors.stock && (
                    <p className="text-[#dc2626] text-xs mt-1">{editFormErrors.stock}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1e3a5f] mb-1.5">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editMedicine.description}
                    onChange={handleEditInputChange}
                    rows={3}
                    className="w-full px-3.5 py-2.5 bg-[#f8f9fa] border border-[#d1d5db] rounded text-sm text-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670] transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#d1d5db]">
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="px-4 py-2.5 border border-[#d1d5db] text-[#4b5563] rounded text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
                    disabled={editLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-4 py-2.5 bg-[#4a6670] text-white rounded text-sm font-medium hover:bg-[#3d5660] transition-colors disabled:opacity-50"
                  >
                    Modifier le médicament
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <div className="bg-white border border-[#d1d5db] rounded-lg w-full max-w-sm shadow-xl">
              <div className="p-5 text-center">
                <div className="w-12 h-12 bg-[#dc2626]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} className="text-[#dc2626]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1e3a5f] mb-2">Supprimer le médicament</h3>
                <p className="text-sm text-[#4b5563]">
                  Êtes-vous sûr de vouloir supprimer <span className="font-medium text-[#1e3a5f]">{deleteMedicineName}</span> ? Cette action est irréversible.
                </p>
              </div>
              <div className="p-5 border-t border-[#d1d5db] flex gap-3">
                <button
                  onClick={handleCloseDeleteModal}
                  className="flex-1 px-4 py-2.5 border border-[#d1d5db] text-[#4b5563] rounded text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
                  disabled={deleteLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteMedicine}
                  className="flex-1 px-4 py-2.5 bg-[#dc2626] text-white rounded text-sm font-medium hover:bg-[#b91c1c] transition-colors disabled:opacity-50"
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
