import api from './api';

// On utilise l'instance partagée pour bénéficier de la même URL de base et des mêmes intercepteurs
const medicamentApi = api;


// ===== FONCTIONS API POUR LES MÉDICAMENTS =====

// Ajouter un médicament (noms français)
export const addMedicament = async (data: {
  nom: string;
  categorieId: string;
  prixAchat: number;
  prixVente: number;
  quantiteEnStock: number;
  description?: string;
}) => {
  console.log('[API] addMedicament - Données envoyées:', JSON.stringify(data, null, 2));
  return medicamentApi.post('/medicament/add', data);
};

// Obtenir la liste des médicaments
export const getMedicaments = async () => {
  console.log('[API] getMedicaments - Récupération de la liste');
  return medicamentApi.get('/medicament/listes');
};

// Obtenir la liste des catégories
export const getCategories = async () => {
  console.log('[API] getCategories - Récupération de la liste');
  return medicamentApi.get('/medicament/categories');
};

// Obtenir un médicament spécifique
export const getMedicamentById = async (id: string) => {
  console.log(`[API] getMedicamentById - ID: ${id}`);
  return medicamentApi.get(`/medicament/${id}`);
};

// Modifier un médicament (noms français)
export const updateMedicament = async (id: string, data: {
   nom?: string;
   categorieId?: string;
   prixAchat?: number;
   prixVente?: number;
   quantiteEnStock?: number;
   description?: string;
}) => {
   console.log(`[API] updateMedicament - ID: ${id}, Données:`, JSON.stringify(data, null, 2));
   return medicamentApi.put(`/medicament/updat/${id}`, data);
};

// Supprimer un médicament
export const deleteMedicament = async (id: string) => {
  console.log(`[API] deleteMedicament - ID: ${id}`);
  return medicamentApi.delete(`/medicament/delet/${id}`);
};

export default medicamentApi;
