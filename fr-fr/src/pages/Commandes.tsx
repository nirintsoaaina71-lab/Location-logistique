import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { 
  Search, Plus, 
  ShoppingCart, Package, Minus, Link2, 
  Loader2, X, User, Phone, Filter as FilterIcon, ChevronLeft, ChevronRight,
  ArrowUpDown, ChevronDown
} from 'lucide-react';
import { useMedicament } from '../../hooks/useMedicament';
import type { MedicineResponse } from '../schemas/produit.schemas';

interface BasketItem {
  id: string;
  name: string;
  dosage: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function Commandes() {
  const { medicaments, categories, loading: medicamentsLoading } = useMedicament();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Toutes');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy] = useState<'nom' | 'prix'>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination state
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [basket, setBasket] = useState<BasketItem[]>([]);
  
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [formErrors, setFormErrors] = useState<{name?: string, phone?: string}>({});

  const filteredMedicaments = medicaments.filter((med) => {
    const matchesSearch = med.nom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Toutes' || med.categorie === categoryFilter;
    const matchesMinPrice = minPrice === '' || med.prixVente >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === '' || med.prixVente <= parseFloat(maxPrice);
    const matchesLetter = !selectedLetter || med.nom.toUpperCase().startsWith(selectedLetter);
    
    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesLetter;
  }).sort((a, b) => {
    if (sortBy === 'nom') {
      return sortOrder === 'asc' 
        ? a.nom.localeCompare(b.nom) 
        : b.nom.localeCompare(a.nom);
    } else {
      return sortOrder === 'asc'
        ? a.prixVente - b.prixVente
        : b.prixVente - a.prixVente;
    }
  });

  // Calculate pagination
  const totalItems = filteredMedicaments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedMedicaments = filteredMedicaments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, minPrice, maxPrice, sortOrder, selectedLetter]);

  const subtotal = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal;

  const addToBasket = (med: MedicineResponse) => {
    if (med.quantiteEnStock <= 0) return;
    
    setBasket(prev => {
      const existing = prev.find(item => item.id === med.id);
      if (existing) {
        if (existing.quantity >= med.quantiteEnStock) return prev;
        return prev.map(item => 
          item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: med.id,
        name: med.nom,
        dosage: med.description || 'N/A',
        price: med.prixVente,
        quantity: 1,
        stock: med.quantiteEnStock
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.min(item.stock, Math.max(0, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    setBasket(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    const errors: {name?: string, phone?: string} = {};
    if (!customerName.trim()) errors.name = 'Le nom est requis';
    if (!customerPhone.trim()) errors.phone = 'Le numéro est requis';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    if (basket.length === 0) {
      alert('Le panier est vide');
      return;
    }

    alert(`Vente enregistrée pour ${customerName} !`);
    setBasket([]);
    setCustomerName('');
    setCustomerPhone('');
    setFormErrors({});
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-20">
        
        {/* TOP SECTION: MEDICINE LIST */}
        <div className="flex flex-col bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-[#f1f5f9] flex flex-col md:flex-row items-start md:items-center justify-between bg-white gap-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-[#64748b]" />
              <h2 className="text-[11px] font-bold text-[#1e293b] uppercase tracking-wider">Liste des Médicaments</h2>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative">
                <FilterIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-8 pr-8 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[10px] font-bold text-[#475569] outline-none appearance-none cursor-pointer"
                >
                  <option value="Toutes">Catégories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.nom}>{cat.nom}</option>
                  ))}
                </select>
                <ChevronDown size={10} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-16 px-2 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[10px] font-bold text-[#475569] outline-none"
                />
                <span className="text-[#94a3b8]">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-16 px-2 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[10px] font-bold text-[#475569] outline-none"
                />
              </div>

              {/* Sort Order */}
              <button
                onClick={() => {
                  setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                  setCurrentPage(1);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-[10px] font-bold text-[#475569] hover:bg-white transition-all"
              >
                <ArrowUpDown size={12} className="text-[#94a3b8]" />
                {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
              </button>

              <div className="relative w-full md:w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs outline-none focus:border-[#475569] text-[#1e293b] font-medium transition-colors"
                  style={{ color: '#1e293b' }}
                />
              </div>
            </div>

            {/* Alphabet Filter */}
            <div className="flex flex-wrap items-center gap-1.5 px-5 pb-3">
              <button
                onClick={() => setSelectedLetter(null)}
                className={`px-3 py-1 rounded-md text-[10px] font-black uppercase transition-all ${
                  !selectedLetter ? 'bg-[#1e293b] text-white shadow-md' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                }`}
              >
                Tout
              </button>
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
                <button
                  key={letter}
                  onClick={() => setSelectedLetter(selectedLetter === letter ? null : letter)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-black transition-all ${
                    selectedLetter === letter ? 'bg-[#1e293b] text-white shadow-md' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <div className="min-w-[600px] h-full overflow-y-auto">
              {medicamentsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 size={24} className="text-[#64748b] animate-spin" />
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-[#f8fafc] sticky top-0 z-10">
                    <tr className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                      <th className="py-2.5 px-5">Médicament</th>
                      <th className="py-2.5 px-5">Catégorie</th>
                      <th className="py-2.5 px-5">Prix</th>
                      <th className="py-2.5 px-5">Stock</th>
                      <th className="py-2.5 px-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {paginatedMedicaments.map((med) => (
                      <tr key={med.id} className="hover:bg-[#fbfcfd] transition-colors">
                        <td className="py-3.5 px-5 text-[13px] font-medium text-[#475569]">
                          <div className="flex items-center gap-2.5">
                            <Link2 size={13} className="text-[#94a3b8] rotate-45" />
                            <span className="truncate">{med.nom}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-[12px] text-[#64748b]">{med.categorie}</td>
                        <td className="py-3.5 px-5 text-[13px] font-bold text-[#1e293b] whitespace-nowrap">
                          {med.prixVente.toLocaleString('fr-FR')} <span className="text-[11px] font-black">AR</span>
                        </td>
                        <td className="py-3.5 px-5 text-[13px] font-bold text-[#22c55e]">
                          {med.quantiteEnStock}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <button 
                            onClick={() => addToBasket(med)}
                            disabled={med.quantiteEnStock <= 0}
                            className="px-4 py-1.5 bg-[#f1f5f9] text-[#64748b] rounded-lg text-[10px] font-black uppercase tracking-tight hover:bg-[#e2e8f0] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            Ajouter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Pagination Footer for Medicine List */}
          <div className="px-5 py-3 border-t border-[#f1f5f9] bg-[#f8fafc] flex items-center justify-between">
            <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
              {totalItems} produits trouvés
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-md border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded-md text-[10px] font-black transition-all ${
                      currentPage === i + 1 
                        ? 'bg-[#1e293b] text-white' 
                        : 'bg-white border border-[#e2e8f0] text-[#64748b] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-1.5 rounded-md border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f1f5f9] disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: BASKET */}
        <div className="flex flex-col bg-white border border-[#e2e8f0] rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingCart size={22} className="text-[#1e293b]" />
              <h2 className="text-base font-black text-[#1e293b]">Panier</h2>
              <span className="px-2.5 py-0.5 bg-[#f1f5f9] text-[#64748b] text-[10px] font-black rounded-full uppercase tracking-tighter">
                {basket.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>
            {basket.length > 0 && (
              <button onClick={() => setBasket([])} className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">
                Vider
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar flex flex-col gap-6">
            <div className="flex-1">
              {basket.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#cbd5e1] py-20">
                  <ShoppingCart size={72} strokeWidth={1} />
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] mt-2">Vide</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.15em] border-b border-[#f1f5f9]">
                        <th className="pb-3 px-2">Item</th>
                        <th className="pb-3 px-2">Prix</th>
                        <th className="pb-3 px-2 text-center">Qté</th>
                        <th className="pb-3 px-2 text-right">Total</th>
                        <th className="pb-3 px-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {basket.map((item) => (
                        <tr key={item.id} className="group hover:bg-[#fbfcfd]">
                          <td className="py-4 px-2">
                            <div>
                              <p className="text-[13px] font-bold text-[#1e293b] leading-tight">{item.name}</p>
                              <p className="text-[10px] text-[#94a3b8] truncate max-w-[150px]">{item.dosage}</p>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-[12px] text-[#475569] font-medium">
                            {item.price.toLocaleString('fr-FR')} AR
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center justify-center gap-1">
                              <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 border border-[#e2e8f0] rounded-md flex items-center justify-center text-[#64748b] hover:bg-white hover:border-[#94a3b8] transition-all"><Minus size={12} /></button>
                              <span className="w-8 text-center text-[12px] font-bold text-[#1e293b]">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.stock} className="w-6 h-6 border border-[#e2e8f0] rounded-md flex items-center justify-center text-[#64748b] hover:bg-white hover:border-[#94a3b8] transition-all"><Plus size={12} /></button>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right font-black text-[#1e293b] text-[13px]">
                            {(item.price * item.quantity).toLocaleString('fr-FR')} AR
                          </td>
                          <td className="py-4 px-2 text-right">
                            <button onClick={() => removeItem(item.id)} className="p-1 px-2 text-[#cbd5e1] hover:text-red-500 hover:bg-red-50 rounded-md transition-all"><X size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CUSTOMER INFOS SECTION - INSIDE BASKET AS IN IMAGE */}
            <div className="w-full bg-[#f8fafc] p-5 rounded-2xl border border-[#e2e8f0] space-y-4">
              <h3 className="text-[10px] font-black text-[#1e293b] uppercase tracking-[0.2em] border-b border-[#e2e8f0] pb-3">Infos Client</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-wider">Nom *</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Nom..."
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.name) setFormErrors({...formErrors, name: undefined});
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-white border ${formErrors.name ? 'border-red-400' : 'border-[#e2e8f0]'} rounded-xl text-xs outline-none text-[#1e293b] font-bold shadow-sm focus:border-[#1e293b] transition-all`}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-black text-[#64748b] uppercase tracking-wider">Téléphone *</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Contact..."
                      value={customerPhone}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (formErrors.phone) setFormErrors({...formErrors, phone: undefined});
                      }}
                      className={`w-full pl-10 pr-4 py-3 bg-white border ${formErrors.phone ? 'border-red-400' : 'border-[#e2e8f0]'} rounded-xl text-xs outline-none text-[#1e293b] font-bold shadow-sm focus:border-[#1e293b] transition-all`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-5 bg-[#f8fafc] border-t border-[#f1f5f9] flex flex-col md:flex-row items-center justify-between shrink-0 gap-5">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[10px] font-black text-[#94a3b8] uppercase tracking-[0.2em]">Total à payer</span>
              <span className="text-2xl font-black text-[#1e293b] tracking-tighter flex items-baseline gap-1">
                {total.toLocaleString('fr-FR')} <span className="text-sm font-black">AR</span>
              </span>
            </div>
            <button 
              onClick={handleCheckout} 
              disabled={basket.length === 0} 
              className="w-full md:w-auto px-12 py-4 bg-[#cbd5e1] text-[#64748b] rounded-xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-[#1e293b] hover:text-white transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#cbd5e1] disabled:hover:text-[#64748b]"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
