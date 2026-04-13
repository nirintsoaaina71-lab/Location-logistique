import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chrome, Apple, Twitter, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas/auth.schemas';
import { useAuth } from '../../hooks/useAuth';  

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { login } = useAuth();             

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-[0_30px_30px_-20px_rgba(16,137,211,0.5)] border-4 border-white">
        {/* Titre */}
        <h1 className="text-center font-black text-3xl text-[#1089d3] mb-8">
          Sign In
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Champ Email */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                {...register('email')}
                placeholder="E-mail"
                className={`w-full bg-white pl-12 pr-4 py-4 rounded-2xl 
                         border-2 transition-all duration-200
                         focus:outline-none focus:border-[#12B1D1]
                         text-gray-900 placeholder-gray-400
                         shadow-[0_10px_10px_-5px_#cff0ff]
                         ${errors.email ? 'border-red-300' : 'border-transparent'}`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs ml-2">{errors.email.message}</p>
            )}
          </div>

          {/* Champ Mot de passe */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Password"
                className={`w-full bg-white pl-12 pr-12 py-4 rounded-2xl 
                         border-2 transition-all duration-200
                         focus:outline-none focus:border-[#12B1D1]
                         text-gray-900 placeholder-gray-400
                         shadow-[0_10px_10px_-5px_#cff0ff]
                         ${errors.password ? 'border-red-300' : 'border-transparent'}`}
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
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs ml-2">{errors.password.message}</p>
            )}
          </div>

          {/* Mot de passe oublié */}
          <div className="text-left">
            <Link
              to="/forgot-password"
              className="text-xs text-[#0099ff] hover:underline"
            >
              Forgot Password ?
            </Link>
          </div>

          {/* Message d'erreur global */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {errors.root.message}
            </div>
          )}

          {/* Bouton de connexion */}
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12B1D1] 
                     text-white py-4 rounded-2xl shadow-[0_20px_10px_-15px_rgba(16,137,211,0.5)]
                     hover:shadow-[0_23px_10px_-20px_rgba(16,137,211,0.5)] 
                     hover:scale-[1.02] active:scale-[0.98] 
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
              'Sign In'
            )}
          </button>

          {/* Lien vers l'inscription */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Pas encore de compte ?{' '}
            <Link 
              to="/signup" 
              className="text-[#0099ff] hover:underline font-medium"
            >
              Créer un compte
            </Link>
          </p>
        </form>

        {/* Section des réseaux sociaux */}
        <div className="mt-8">
          <span className="block text-center text-xs text-gray-400 mb-3">
            Or Sign in with
          </span>
          
          <div className="flex justify-center gap-4">
            {socialIcons.map(({ Icon, label }) => (
              <button 
                key={label}
                className="bg-gradient-to-r from-gray-900 to-gray-600 p-3 rounded-full 
                         border-4 border-white shadow-[0_12px_10px_-8px_rgba(16,137,211,0.5)]
                         hover:scale-110 active:scale-90 transition-transform duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-label={`Se connecter avec ${label}`}
              >
                <Icon className="h-5 w-5 text-white" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;