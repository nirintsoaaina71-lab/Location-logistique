// hooks/useAuth.ts
import { useState, useEffect, createContext, useContext, createElement } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import api from '../src/service/api';
import {
  loginSchema,
  signupSchema,
  loginResponseSchema,
  signupResponseSchema,
  successResponseSchema,
} from '../src/schemas/auth.schemas';
import type { LoginFormData, SignupFormData, UserResponse } from '../src/schemas/auth.schemas';

// Type pour le contexte
interface AuthContextType {
  user: UserResponse | null;
  loading: boolean;
  login: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignupFormData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

// Props du provider
interface AuthProviderProps {
  children: ReactNode;
}

// Création du contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

// Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Vérifier la session
  const checkSession = async (): Promise<void> => {
    try {
      const response = await api.get('/auth/me');
      // Valider la réponse avec Zod
      const validated = loginResponseSchema.parse(response.data);
      setUser(validated.user);
    } catch (error) {
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // Connexion
  const login = async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Valider avec Zod
      const validatedData = loginSchema.parse(data);
      
      // 2. Envoyer la requête
      const response = await api.post('/auth/login', validatedData);
      
      // 3. Valider la réponse
      const validatedResponse = loginResponseSchema.parse(response.data);
      
      // 4. Mettre à jour l'état
      setUser(validatedResponse.user);
      
      // 5. Rediriger
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      // Gestion des erreurs Zod (validation frontend)
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return {
          success: false,
          error: `${firstError.path.join('.')} : ${firstError.message}`,
        };
      }
      
      // Gestion des erreurs Axios (backend)
      if (error && typeof error === 'object' && 'message' in error) {
        return { success: false, error: (error as any).message };
      }
      
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  // Inscription
  const signup = async (data: SignupFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      // 1. Valider avec Zod (inclut la vérification des mots de passe)
      const validatedData = signupSchema.parse(data);
      
      // 2. Enlever confirmPassword avant envoi
      const { confirmPassword, ...signupData } = validatedData;
      
      // 3. Envoyer la requête
      const response = await api.post('/auth/register', signupData);
      
      // 4. Valider la réponse
      const validatedResponse = signupResponseSchema.parse(response.data);
      
      // 5. Mettre à jour l'état (connecter automatiquement)
      setUser(validatedResponse.user);
      
      // 6. Rediriger
      navigate('/dashboard');
      
      return { success: true };
    } catch (error) {
      // Gestion des erreurs Zod
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        return {
          success: false,
          error: `${firstError.path.join('.')} : ${firstError.message}`,
        };
      }
      
      // Gestion des erreurs Axios
      if (error && typeof error === 'object' && 'message' in error) {
        return { success: false, error: (error as any).message };
      }
      
      return { success: false, error: "Erreur lors de l'inscription" };
    }
  };

  // Déconnexion
  const logout = async (): Promise<void> => {
    try {
      const response = await api.post('/auth/logout');
      // Optionnel: valider la réponse
      successResponseSchema.parse(response.data);
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  // Vérifier la session au montage
  useEffect(() => {
    checkSession();
  }, []);

  return createElement(
    AuthContext.Provider,
    { value: { user, loading, login, signup, logout, checkSession } },
    children
  );
}