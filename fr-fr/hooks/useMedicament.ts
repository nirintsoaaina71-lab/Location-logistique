// hooks/useMedicament.ts
import { useState, useEffect, createContext, useContext, createElement } from 'react';
import type { ReactNode } from 'react';
import { z } from 'zod';
import {
  addMedicament,
  getMedicaments,
  getMedicamentById,
  updateMedicament,
  deleteMedicament,
  getCategories,
} from '../src/service/medicament.api';
import {
  addMedicineSchema,

  medicineResponseSchema,
  medicineArraySchema,
} from '../src/schemas/produit.schemas';
import type { AddMedicineFormData, MedicineResponse } from '../src/schemas/produit.schemas';

// Type pour les catégories
export interface CategorieType {
  id: string;
  nom: string;
  description: string | null;
}

// Type pour le contexte
interface MedicamentContextType {
  medicaments: MedicineResponse[];
  categories: CategorieType[];
  loading: boolean;
  error: string | null;
  fetchMedicaments: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addMedicament: (data: AddMedicineFormData, categorieId: string) => Promise<{ success: boolean; error?: string; data?: MedicineResponse }>;
  updateMedicament: (id: string, data: Partial<AddMedicineFormData>, categorieId?: string) => Promise<{ success: boolean; error?: string; data?: MedicineResponse }>;
  deleteMedicament: (id: string) => Promise<{ success: boolean; error?: string }>;
  getMedicamentById: (id: string) => Promise<MedicineResponse | null>;
}

// Props du provider
interface MedicamentProviderProps {
  children: ReactNode;
}

// Création du contexte
const MedicamentContext = createContext<MedicamentContextType | undefined>(undefined);

// Hook personnalisé
export const useMedicament = (): MedicamentContextType => {
  const context = useContext(MedicamentContext);
  if (!context) {
    throw new Error('useMedicament doit être utilisé dans un MedicamentProvider');
  }
  return context;
};

// Helper pour extraire les médicaments de la réponse (tableau direct ou objet)
const extractMedicines = (data: unknown): MedicineResponse[] => {
  // Essayer d'abord le tableau direct
  try {
    const parsed = medicineArraySchema.parse(data);
    console.log('[extractMedicines] Tableau direct validé:', parsed.length, 'médicaments');
    return parsed;
  } catch (e) {
    console.error('[extractMedicines] Échec tableau direct:', e);
  }
  
  // Essayer objet avec data ou medicines
  try {
    const parsed = data as Record<string, unknown>;
    if (parsed.data && Array.isArray(parsed.data)) {
      console.log('[extractMedicines] Tentant parsed.data:', parsed.data.length, 'éléments');
      return medicineArraySchema.parse(parsed.data);
    }
    if (parsed.medicines && Array.isArray(parsed.medicines)) {
      return medicineArraySchema.parse(parsed.medicines);
    }
    if (parsed.medicaments && Array.isArray(parsed.medicaments)) {
      return medicineArraySchema.parse(parsed.medicaments);
    }
  } catch (e) {
    console.error('[extractMedicines] Échec objet:', e);
  }
  
  console.error('[extractMedicines] Aucun format reconnu, retour tableau vide');
  return [];
};

// Helper pour extraire un seul médicament de la réponse
const extractMedicine = (data: unknown): MedicineResponse | null => {
  // Essayer direct
  try {
    const parsed = medicineResponseSchema.parse(data);
    return parsed;
  } catch {
    // Ignorer et essayer objet
  }
  
  // Essayer objet avec data ou medicine
  try {
    const parsed = data as Record<string, unknown>;
    if (parsed.data && typeof parsed.data === 'object') {
      return medicineResponseSchema.parse(parsed.data);
    }
    if (parsed.medicine && typeof parsed.medicine === 'object') {
      return medicineResponseSchema.parse(parsed.medicine);
    }
    if (parsed.medicament && typeof parsed.medicament === 'object') {
      return medicineResponseSchema.parse(parsed.medicament);
    }
  } catch {
    return null;
  }
  
  return null;
};

// Helper pour extraire les catégories
const extractCategories = (data: unknown): CategorieType[] => {
  if (Array.isArray(data)) {
    return data.map((item: Record<string, unknown>) => ({
      id: String(item.id || ''),
      nom: String(item.nom || ''),
      description: item.description as string | null,
    }));
  }
  
  try {
    const parsed = data as Record<string, unknown>;
    if (parsed.data && Array.isArray(parsed.data)) {
      return parsed.data.map((item: Record<string, unknown>) => ({
        id: String(item.id || ''),
        nom: String(item.nom || ''),
        description: item.description as string | null,
      }));
    }
    if (parsed.categories && Array.isArray(parsed.categories)) {
      return parsed.categories.map((item: Record<string, unknown>) => ({
        id: String(item.id || ''),
        nom: String(item.nom || ''),
        description: item.description as string | null,
      }));
    }
  } catch {
    // Ignorer
  }
  
  return [];
};

// Provider
export function MedicamentProvider({ children }: MedicamentProviderProps) {
  const [medicaments, setMedicaments] = useState<MedicineResponse[]>([]);
  const [categories, setCategories] = useState<CategorieType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all medicaments
  const fetchMedicaments = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMedicaments();
      console.log('[useMedicament] Réponse brute GET /medicament/listes:', JSON.stringify(response.data, null, 2));
      const extracted = extractMedicines(response.data);
      console.log('[useMedicament] Médicaments extraits:', extracted.length);
      setMedicaments(extracted);
    } catch (err) {
      console.error('[useMedicament] Erreur fetchMedicaments:', err);
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as any).message);
      } else {
        setError('Erreur lors de la récupération des médicaments');
      }
      setMedicaments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategoriesFn = async (): Promise<void> => {
    try {
      const response = await getCategories();
      console.log('[useMedicament] Réponse brute GET /categorie/listes:', JSON.stringify(response.data, null, 2));
      const extracted = extractCategories(response.data);
      console.log('[useMedicament] Catégories extraites:', extracted.length);
      setCategories(extracted);
    } catch (err) {
      console.error('[useMedicament] Erreur fetchCategories:', err);
    }
  };

  // Add a new medicament
  const addMedicamentFn = async (data: AddMedicineFormData, categorieId: string): Promise<{ success: boolean; error?: string; data?: MedicineResponse }> => {
    try {
      // 1. Valider avec Zod
      const validatedData = addMedicineSchema.parse(data);
      
      // 2. Préparer les données pour l'API (noms français)
      const apiData = {
        nom: validatedData.name,
        categorieId: categorieId,
        prixAchat: parseFloat(validatedData.purchasePrice),
        prixVente: parseFloat(validatedData.salePrice),
        quantiteEnStock: parseInt(validatedData.stock, 10),
        description: validatedData.description || '',
      };
      
      console.log('[useMedicament] Données envoyées à l\'API:', JSON.stringify(apiData, null, 2));
      
      // 3. Envoyer la requête
      const response = await addMedicament(apiData);
      console.log('[useMedicament] Réponse brute POST /medicament/add:', JSON.stringify(response.data, null, 2));
      
      // 4. Extraire le médicament de la réponse
      const extracted = extractMedicine(response.data);
      
      if (extracted) {
        // 5. Mettre à jour l'état
        setMedicaments((prev) => [...prev, extracted]);
        return { success: true, data: extracted };
      }
      
      return { success: true };
    } catch (err) {
      console.error('[useMedicament] Erreur addMedicament:', err);
      // Gestion des erreurs Zod (validation frontend)
      if (err instanceof z.ZodError) {
        const firstError = err.issues[0];
        return {
          success: false,
          error: `${firstError.path.join('.')} : ${firstError.message}`,
        };
      }
      
      // Gestion des erreurs Axios (backend)
      if (err && typeof err === 'object' && 'message' in err) {
        return { success: false, error: (err as any).message };
      }
      
      return { success: false, error: "Erreur lors de l'ajout du médicament" };
    }
  };

  // Update a medicament
  const updateMedicamentFn = async (id: string, data: Partial<AddMedicineFormData>, categorieId?: string): Promise<{ success: boolean; error?: string; data?: MedicineResponse }> => {
    try {
      // Préparer les données pour l'API (noms français)
      const apiData: Record<string, unknown> = {};
      if (data.name) apiData.nom = data.name;
      if (categorieId) apiData.categorieId = categorieId;
      if (data.purchasePrice) apiData.prixAchat = parseFloat(data.purchasePrice);
      if (data.salePrice) apiData.prixVente = parseFloat(data.salePrice);
      if (data.stock) apiData.quantiteEnStock = parseInt(data.stock, 10);
      if (data.description !== undefined) apiData.description = data.description;
      
      // Envoyer la requête
      const response = await updateMedicament(id, apiData);
      
      // Extraire le médicament de la réponse
      const extracted = extractMedicine(response.data);
      
      if (extracted) {
        // Mettre à jour l'état
        setMedicaments((prev) =>
          prev.map((med) => (med.id === id ? extracted : med))
        );
        return { success: true, data: extracted };
      }
      
      return { success: true };
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        return { success: false, error: (err as any).message };
      }
      
      return { success: false, error: 'Erreur lors de la modification du médicament' };
    }
  };

  // Delete a medicament
  const deleteMedicamentFn = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await deleteMedicament(id);
      setMedicaments((prev) => prev.filter((med) => med.id !== id));
      return { success: true };
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err) {
        return { success: false, error: (err as any).message };
      }
      
      return { success: false, error: 'Erreur lors de la suppression du médicament' };
    }
  };

  // Get a medicament by ID
  const getMedicamentByIdFn = async (id: string): Promise<MedicineResponse | null> => {
    try {
      const response = await getMedicamentById(id);
      const extracted = extractMedicine(response.data);
      return extracted;
    } catch (err) {
      console.error('Erreur lors de la récupération du médicament:', err);
      return null;
    }
  };

  // Fetch medicaments and categories on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchMedicaments(), fetchCategoriesFn()]);
      } catch (err) {
        console.error('[useMedicament] Erreur lors du chargement initial:', err);
      }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return createElement(
    MedicamentContext.Provider,
    { value: { medicaments, categories, loading, error, fetchMedicaments, fetchCategories: fetchCategoriesFn, addMedicament: addMedicamentFn, updateMedicament: updateMedicamentFn, deleteMedicament: deleteMedicamentFn, getMedicamentById: getMedicamentByIdFn } },
    children
  );
}
