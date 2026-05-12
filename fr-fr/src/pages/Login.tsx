import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, Shield, Headphones, BriefcaseMedical } from 'lucide-react';
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
      const result = await login(data);

      if (!result.success) {
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

  return (
    <div className="min-h-screen bg-[#f5f7f8] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-[420px]">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <BriefcaseMedical size={28} className="text-[#4a6670]" />
            <h1 className="text-2xl font-semibold text-[#1e3a5f]">
              PharmaSync Pro
            </h1>
          </div>
          <p className="text-[#4b5563] text-xs tracking-widest uppercase">
            Précision clinique
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg border border-[#d1d5db] shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Champ Email */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1e3a5f]">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-[#9ca3af]" />
                </div>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="pharmacien@pharmasync.pro"
                  className={`w-full bg-[#f8f9fa] pl-11 pr-4 py-2.5 rounded border 
                           transition-all duration-200
                           focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670]
                           text-[#1e3a5f] placeholder-[#9ca3af] text-sm
                           ${errors.email ? 'border-[#dc2626]' : 'border-[#d1d5db]'}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-[#dc2626] text-xs ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1e3a5f]">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#9ca3af]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className={`w-full bg-[#f8f9fa] pl-11 pr-11 py-2.5 rounded border 
                           transition-all duration-200
                           focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670]
                           text-[#1e3a5f] placeholder-[#9ca3af] text-sm
                           ${errors.password ? 'border-[#dc2626]' : 'border-[#d1d5db]'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  disabled={isLoading}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5 text-[#9ca3af] hover:text-[#4b5563]" />
                  ) : (
                    <Eye className="h-4.5 w-4.5 text-[#9ca3af] hover:text-[#4b5563]" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#dc2626] text-xs ml-1">{errors.password.message}</p>
              )}
            </div>

            {/* Message d'erreur global */}
            {errors.root && (
              <div className="bg-[#dc2626]/10 border border-[#dc2626]/20 text-[#dc2626] px-4 py-3 rounded text-sm">
                {errors.root.message}
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full font-medium bg-[#4a6670] 
                       text-white py-2.5 rounded shadow-sm
                       hover:bg-[#3d5660] hover:shadow active:scale-[0.99] 
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       disabled:hover:scale-100 disabled:active:scale-100
                       flex items-center justify-center space-x-2 text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4.5 w-4.5 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Connexion...</span>
                </>
              ) : (
                'Se connecter'
              )}
            </button>

            {/* Mot de passe oublié */}
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-[#4a6670] hover:underline font-medium"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Lien d'inscription */}
            <p className="text-center text-sm text-[#4b5563]">
              Pas encore de compte ?{' '}
              <Link
                to="/signup"
                className="text-[#4a6670] hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </p>
          </form>
        </div>

        {/* Info boxes */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-[#f0f0f0] border border-[#d1d5db] rounded p-4">
            <Shield size={18} className="text-[#4a6670] mb-2" />
            <h3 className="text-sm font-medium text-[#1e3a5f] mb-1">Accès sécurisé</h3>
            <p className="text-xs text-[#4b5563]">Interface pharmacie conforme HIPAA et chiffrée.</p>
          </div>
          <div className="bg-[#f0f0f0] border border-[#d1d5db] rounded p-4">
            <Headphones size={18} className="text-[#4a6670] mb-2" />
            <h3 className="text-sm font-medium text-[#1e3a5f] mb-1">Support IT</h3>
            <p className="text-xs text-[#4b5563]">Assistance technique 24/7 pour le personnel clinique.</p>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-[#9ca3af] mt-6">
          © 2024 PharmaSync Pro. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default Login;
