// services/api.ts
import axios from 'axios';
import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { errorResponseSchema } from '../schemas/auth.schemas';
import type { ErrorResponse } from '../schemas/auth.schemas';

// Configuration
const getApiUrl = () => {
  const env = import.meta.env.MODE; // 'development', 'production', 'staging'
  
  switch (env) {
    case 'production':
      return import.meta.env.VITE_API_URL_PROD;
    case 'staging':
      return import.meta.env.VITE_API_URL_STAGING;
    default:
      return import.meta.env.VITE_API_URL_DEV;
  }
};

const API_BASE_URL = getApiUrl() || '/api';

console.log(`[API] Mode: ${import.meta.env.MODE}, Base URL: ${API_BASE_URL}`);

// Créer l'instance Axios
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Intercepteur de requête
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
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