import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chrome, Apple, Twitter, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signupSchema, type SignupFormData, type PasswordStrength } from '../schemas/auth.schemas';
import { useAuth } from '../../hooks/useAuth';

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  // Fonction pour obtenir la force du mot de passe
  const getPasswordStrength = (password: string = ''): PasswordStrength | null => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengths = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-600'];
    
    return {
      level: strengths[strength],
      color: colors[strength],
      strength
    };
  };

  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const onSubmit = async (data: SignupFormData): Promise<void> => {
    setIsLoading(true);
    
    try {
      // ✅ Utiliser le hook useAuth au lieu de simulation
      const result = await signup(data);
      
      if (!result.success) {
        // Afficher l'erreur retournée par le hook
        setError('root', {
          type: 'manual',
          message: result.error || "Erreur lors de l'inscription",
        });
      }
      
    } catch (error) {
      console.error('Erreur inattendue:', error);
      setError('root', {
        type: 'manual',
        message: "Erreur lors de l'inscription. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Liste des icônes sociales
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
          Sign Up
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Champ Nom */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                {...register('name')}
                placeholder="Nom complet"
                className={`w-full bg-white pl-12 pr-4 py-4 rounded-2xl 
                         border-2 transition-all duration-200
                         focus:outline-none focus:border-[#12B1D1]
                         text-gray-900 placeholder-gray-400
                         shadow-[0_10px_10px_-5px_#cff0ff]
                         ${errors.name ? 'border-red-300' : 'border-transparent'}`}
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs ml-2">{errors.name.message}</p>
            )}
          </div>

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
                placeholder="Mot de passe"
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
            {password && !errors.password && passwordStrength && (
              <p className={`text-xs ml-2 ${passwordStrength.color}`}>
                Force du mot de passe : {passwordStrength.level}
              </p>
            )}
          </div>

          {/* Champ Confirmation mot de passe */}
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                placeholder="Confirmer le mot de passe"
                className={`w-full bg-white pl-12 pr-12 py-4 rounded-2xl 
                         border-2 transition-all duration-200
                         focus:outline-none focus:border-[#12B1D1]
                         text-gray-900 placeholder-gray-400
                         shadow-[0_10px_10px_-5px_#cff0ff]
                         ${errors.confirmPassword ? 'border-red-300' : 'border-transparent'}`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs ml-2">{errors.confirmPassword.message}</p>
            )}
            {password && confirmPassword && password === confirmPassword && !errors.confirmPassword && (
              <p className="text-green-500 text-xs ml-2">
                ✓ Mots de passe identiques
              </p>
            )}
          </div>

          {/* Message d'erreur global */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {errors.root.message}
            </div>
          )}

          {/* Bouton d'inscription */}
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
                <span>Inscription en cours...</span>
              </>
            ) : (
              "S'inscrire"
            )}
          </button>

          {/* Lien vers la connexion */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Déjà un compte ?{' '}
            <Link 
              to="/login" 
              className="text-[#0099ff] hover:underline font-medium"
            >
              Se connecter
            </Link>
          </p>
        </form>

        {/* Section des réseaux sociaux */}
        <div className="mt-8">
          <span className="block text-center text-xs text-gray-400 mb-3">
            Or Sign up with
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
                aria-label={`S'inscrire avec ${label}`}
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

export default SignUp;