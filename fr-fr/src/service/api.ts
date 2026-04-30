// services/api.ts
import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { errorResponseSchema } from '../schemas/auth.schemas';
import type { ErrorResponse } from '../schemas/auth.schemas';

// Configuration - Version corrigée pour Vercel
const getApiUrl = () => {
  // 🔥 Utiliser VERCEL_ENV pour détecter l'environnement (plus fiable)
  const vercelEnv = import.meta.env.VERCEL_ENV;
  const mode = import.meta.env.MODE;
  
  console.log(`[ENV DEBUG] VERCEL_ENV: ${vercelEnv}, MODE: ${mode}`);
  
  // Vercel Preview (staging)
  if (vercelEnv === 'preview') {
    console.log('✅ Environnement PREVIEW (staging) détecté');
    return import.meta.env.VITE_API_URL_STAGING;
  }
  
  // Vercel Production
  if (vercelEnv === 'production') {
    console.log('✅ Environnement PRODUCTION détecté');
    return import.meta.env.VITE_API_URL_PROD;
  }
  
  // Environnement local ou autre
  if (mode === 'development') {
    console.log('✅ Environnement DEVELOPMENT (local) détecté');
    return import.meta.env.VITE_API_URL_DEV || 'http://localhost:3000';
  }
  
  // Fallback sécurisé : si aucune variable n'est trouvée
  console.warn('⚠️ Aucun environnement reconnu, utilisation du fallback');
  return import.meta.env.VITE_API_URL_STAGING || 'https://location-logistique.onrender.com';
};

const API_BASE_URL = getApiUrl();

console.log(`[API] Base URL finale: ${API_BASE_URL}`);

// Créer l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Intercepteur de requête
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponse avec validation Zod
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const requestUrl = originalRequest?.url ?? '';
    const isAuthEndpoint =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/signup') ||
      requestUrl.includes('/auth/me') ||
      requestUrl.includes('/auth/refresh');
    
    // Formater l'erreur de manière cohérente
    let errorMessage = 'Une erreur est survenue';
    let errorDetails: ErrorResponse | null = null;
    
    if (error.response?.data) {
      try {
        // Essayer de valider avec Zod
        const parsedError = errorResponseSchema.parse(error.response.data);
        errorMessage = Array.isArray(parsedError.message)
          ? parsedError.message.join(', ')
          : parsedError.message;
        errorDetails = parsedError;
      } catch {
        // Si la validation échoue, utiliser le message brut
        const rawMessage = (error.response.data as Partial<ErrorResponse>)?.message;
        errorMessage = Array.isArray(rawMessage) ? rawMessage.join(', ') : rawMessage || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'Impossible de contacter le serveur';
    }
    
    // Gestion du refresh token (401)
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      
      try {
        await api.post('/auth/refresh');
        return api(originalRequest);
      } catch {
        return Promise.reject(new Error('Session expirée'));
      }
    }
    
    // Transformer l'erreur pour avoir un message cohérent
    return Promise.reject({
      ...error,
      message: errorMessage,
      details: errorDetails,
    });
  }
);

export default api;