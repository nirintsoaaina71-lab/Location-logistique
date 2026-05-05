// services/medicament.api.ts
import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import { errorResponseSchema } from '../schemas/auth.schemas';

/**
 * Détecte l'environnement en fonction de l'URL actuelle du navigateur
 */
const getEnvironment = (): 'preview' | 'production' | 'development' => {
  const hostname = window.location.hostname;
  
  // Preview Vercel : contient toujours 'git-' ou 'vercel.app' avec sous-domaine
  if (hostname.includes('git-') || (hostname.includes('vercel.app') && hostname !== 'location-logistique.vercel.app')) {
    return 'preview';
  }
  
  // Production (domaine personnalisé ou vercel.app principal)
  if (hostname === 'location-logistique.vercel.app' || hostname === 'location-logistique.com') {
    return 'production';
  }
  
  // Développement local
  return 'development';
};

const getApiUrl = () => {
  const env = getEnvironment();
  
  console.log(`[ENV] Environnement détecté: ${env}`);
  
  switch (env) {
    case 'preview':
      const stagingUrl = import.meta.env.VITE_API_URL_STAGING;
      console.log(`✅ Preview - Backend: ${stagingUrl}`);
      return stagingUrl;
    case 'production':
      const prodUrl = import.meta.env.VITE_API_URL_PROD;
      console.log(`✅ Production - Backend: ${prodUrl}`);
      return prodUrl;
    case 'development':
      const devUrl = import.meta.env.VITE_API_URL_DEV || 'http://localhost:3001';
      console.log(`✅ Développement - Backend: ${devUrl}`);
      return devUrl;
  }
};

const API_BASE_URL = getApiUrl();

console.log(`[API] Base URL medicament: ${API_BASE_URL}`);

// Créer l'instance Axios pour les médicaments
const medicamentApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Intercepteur de requête
medicamentApi.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
medicamentApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const requestUrl = originalRequest?.url ?? '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/me') ||
      requestUrl.includes('/auth/refresh');
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.response?.data) {
      try {
        const parsedError = errorResponseSchema.parse(error.response.data);
        errorMessage = Array.isArray(parsedError.message)
          ? parsedError.message.join(', ')
          : parsedError.message;
      } catch {
        const rawMessage = (error.response.data as any)?.message;
        errorMessage = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'Impossible de contacter le serveur';
    }
    
    // Refresh token automatique
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        await medicamentApi.post('/auth/refresh');
        return medicamentApi(originalRequest);
      } catch {
        return Promise.reject(new Error('Session expirée'));
      }
    }
    
    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);

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
