import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chrome, Apple, Twitter, Mail, Lock, Eye, EyeOff, Pill, Sun, Moon } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas/auth.schemas';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { login } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();             

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    
    try {
      //  Utiliser le hook useAuth au lieu d'axios directement
      const result = await login(data);

      if (!result.success) {
        // Afficher l'erreur retournée par le hook
        setError('root', {
          type: 'manual',
          message: result.error || 'Erreur de connexion',
        });
      }
      
    } catch (error) {
      console.error('Erreur inattendue:', error);
      setError('root', {
        type: 'manual',
        message: 'Erreur de connexion. Veuillez réessayer.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Liste des icônes sociales pour éviter la répétition
  const socialIcons = [
    { Icon: Chrome, label: 'Google' },
    { Icon: Apple, label: 'Apple' },
    { Icon: Twitter, label: 'Twitter' },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4 transition-colors duration-300">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-full bg-surface border border-border shadow-lg hover:shadow-xl transition-all duration-200 text-text-secondary hover:text-text-primary"
        aria-label={resolvedTheme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
      >
        {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-md w-full bg-surface rounded-2xl p-8 shadow-2xl border border-border">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Pill size={32} className="text-primary" />
          </div>
          <h1 className="font-black text-3xl text-text-primary mb-2">
            PharmaGest
          </h1>
          <p className="text-text-secondary text-sm">
            Gestion de pharmacie simplifiée
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Champ Email */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Adresse email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="votre@email.fr"
                className={`w-full bg-surface-hover pl-12 pr-4 py-3 rounded-xl 
                         border-2 transition-all duration-200
                         focus:outline-none focus:border-primary
                         text-text-primary placeholder-text-muted
                         ${errors.email ? 'border-danger' : 'border-border'}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-danger text-xs ml-2">{errors.email.message}</p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-text-muted" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="••••••••"
                className={`w-full bg-surface-hover pl-12 pr-12 py-3 rounded-xl 
                         border-2 transition-all duration-200
                         focus:outline-none focus:border-primary
                         text-text-primary placeholder-text-muted
                         ${errors.password ? 'border-danger' : 'border-border'}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={isLoading}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-text-muted hover:text-text-secondary" />
                ) : (
                  <Eye className="h-5 w-5 text-text-muted hover:text-text-secondary" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-danger text-xs ml-2">{errors.password.message}</p>
            )}
          </div>

          {/* Mot de passe oublié */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Message d'erreur global */}
          {errors.root && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl text-sm">
              {errors.root.message}
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full font-bold bg-gradient-to-r from-primary to-primary-hover 
                     text-white py-3 rounded-xl shadow-lg
                     hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] 
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     disabled:hover:scale-100 disabled:active:scale-100
                     flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Connexion...</span>
              </>
            ) : (
              'Se connecter'
            )}
          </button>

          {/* Lien vers l'inscription */}
          <p className="text-center text-sm text-text-secondary mt-4">
            Pas encore de compte ?{' '}
            <Link 
              to="/signup" 
              className="text-primary hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </form>

        {/* Section des réseaux sociaux */}
        <div className="mt-8 pt-6 border-t border-border">
          <span className="block text-center text-xs text-text-muted mb-4">
            Ou connectez-vous avec
          </span>
          
          <div className="flex justify-center gap-4">
            {socialIcons.map(({ Icon, label }) => (
              <button 
                key={label}
                className="p-3 rounded-full bg-surface-hover border border-border
                         hover:bg-surface-hover/80 hover:scale-110 active:scale-90 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed text-text-secondary"
                disabled={isLoading}
                aria-label={`Se connecter avec ${label}`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;