// services/api.ts
import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import { errorResponseSchema } from '../schemas/auth.schemas';

/**
 * Détecte l'environnement en fonction de l'URL actuelle du navigateur
 * C'est la méthode la plus fiable car elle ne dépend pas de Vercel
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
      const devUrl = import.meta.env.VITE_API_URL_DEV || 'http://localhost:3000';
      console.log(`✅ Développement - Backend: ${devUrl}`);
      return devUrl;
  }
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
api.interceptors.response.use(
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
        await api.post('/auth/refresh');
        return api(originalRequest);
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

export default api;