// services/api.ts
import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { errorResponseSchema } from '../schemas/auth.schemas';
import type { ErrorResponse } from '../schemas/auth.schemas';

// Configuration - Version adaptée pour Vercel (Preview + Production)
const getApiUrl = () => {
  // Variables d'environnement Vercel
  const vercelEnv = import.meta.env.VERCEL_ENV; // 'preview', 'production', ou undefined
  const mode = import.meta.env.MODE; // 'development', 'production'
  
  console.log(`[ENV] VERCEL_ENV: ${vercelEnv}, MODE: ${mode}`);
  
  // 🔥 CAS 1 : Preview (staging) sur Vercel
  if (vercelEnv === 'preview') {
    const url = import.meta.env.VITE_API_URL_STAGING;
    console.log(`✅ Preview (staging) détecté - Base URL: ${url}`);
    return url;
  }
  
  // 🔥 CAS 2 : Production sur Vercel
  if (vercelEnv === 'production') {
    const url = import.meta.env.VITE_API_URL_PROD;
    console.log(`✅ Production détectée - Base URL: ${url}`);
    return url;
  }
  
  // 🔥 CAS 3 : Environnement local (développement)
  if (mode === 'development') {
    const url = import.meta.env.VITE_API_URL_DEV || 'http://localhost:3000';
    console.log(`✅ Développement local - Base URL: ${url}`);
    return url;
  }
  
  // 🔥 CAS 4 : Production (fallback si VERCEL_ENV est undefined)
  // Sur Vercel, en production, VERCEL_ENV est souvent undefined
  // mais MODE === 'production'
  if (mode === 'production') {
    const url = import.meta.env.VITE_API_URL_PROD;
    console.log(`✅ Production (fallback) - Base URL: ${url}`);
    return url;
  }
  
  // Dernier fallback (normalement jamais atteint)
  console.warn('⚠️ Aucun environnement reconnu, utilisation du fallback');
  return import.meta.env.VITE_API_URL_PROD || 'https://location-logistique-backend-prod.onrender.com';
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
  (error) => {
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
      requestUrl.includes('/auth/signup') ||
      requestUrl.includes('/auth/me') ||
      requestUrl.includes('/auth/refresh');
    
    let errorMessage = 'Une erreur est survenue';
    let errorDetails = null;
    
    if (error.response?.data) {
      try {
        const parsedError = errorResponseSchema.parse(error.response.data);
        errorMessage = Array.isArray(parsedError.message)
          ? parsedError.message.join(', ')
          : parsedError.message;
        errorDetails = parsedError;
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
      details: errorDetails,
    });
  }
);

export default api;