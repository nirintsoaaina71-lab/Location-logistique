import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, User, BriefcaseMedical } from 'lucide-react';
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

  const getPasswordStrength = (password: string = ''): PasswordStrength | null => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const strengths = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'];
    const colors = ['text-[#dc2626]', 'text-[#ea580c]', 'text-[#f59e0b]', 'text-[#16a34a]', 'text-[#15803d]'];
    
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
      const result = await signup(data);
      
      if (!result.success) {
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

        {/* Signup Card */}
        <div className="bg-white rounded-lg border border-[#d1d5db] shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Champ Nom */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1e3a5f]">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-[#9ca3af]" />
                </div>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Votre nom"
                  className={`w-full bg-[#f8f9fa] pl-11 pr-4 py-2.5 rounded border 
                           transition-all duration-200
                           focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670]
                           text-[#1e3a5f] placeholder-[#9ca3af] text-sm
                           ${errors.name ? 'border-[#dc2626]' : 'border-[#d1d5db]'}`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-[#dc2626] text-xs ml-1">{errors.name.message}</p>
              )}
            </div>

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
              {password && !errors.password && passwordStrength && (
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#f8f9fa] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        passwordStrength.strength <= 1 ? 'bg-[#dc2626]' : 
                        passwordStrength.strength === 2 ? 'bg-[#f59e0b]' : 
                        passwordStrength.strength === 3 ? 'bg-[#16a34a]' : 'bg-[#15803d]'
                      }`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${passwordStrength.color}`}>
                    {passwordStrength.level}
                  </span>
                </div>
              )}
            </div>

            {/* Champ Confirmation mot de passe */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1e3a5f]">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#9ca3af]" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className={`w-full bg-[#f8f9fa] pl-11 pr-11 py-2.5 rounded border 
                           transition-all duration-200
                           focus:outline-none focus:ring-1 focus:ring-[#4a6670]/30 focus:border-[#4a6670]
                           text-[#1e3a5f] placeholder-[#9ca3af] text-sm
                           ${errors.confirmPassword ? 'border-[#dc2626]' : 'border-[#d1d5db]'}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4.5 w-4.5 text-[#9ca3af] hover:text-[#4b5563]" />
                  ) : (
                    <Eye className="h-4.5 w-4.5 text-[#9ca3af] hover:text-[#4b5563]" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#dc2626] text-xs ml-1">{errors.confirmPassword.message}</p>
              )}
              {password && confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                <p className="text-[#16a34a] text-xs ml-1">
                  ✓ Mots de passe identiques
                </p>
              )}
            </div>

            {/* Message d'erreur global */}
            {errors.root && (
              <div className="bg-[#dc2626]/10 border border-[#dc2626]/20 text-[#dc2626] px-4 py-3 rounded text-sm">
                {errors.root.message}
              </div>
            )}

            {/* Bouton d'inscription */}
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
                  <span>Inscription en cours...</span>
                </>
              ) : (
                "S'inscrire"
              )}
            </button>

            {/* Lien vers la connexion */}
            <p className="text-center text-sm text-[#4b5563]">
              Déjà un compte ?{' '}
              <Link 
                to="/login" 
                className="text-[#4a6670] hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </form>
        </div>

        {/* Copyright */}
        <p className="text-center text-xs text-[#9ca3af] mt-6">
          © 2024 PharmaSync Pro. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default SignUp;
