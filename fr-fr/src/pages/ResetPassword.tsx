import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff, ArrowLeft, BriefcaseMedical } from 'lucide-react';
import { z } from 'zod';
import api from '../service/api';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer votre mot de passe'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const params = useParams<{ token?: string }>();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => {
    return (
      params.token ??
      searchParams.get('token') ??
      searchParams.get('access_token') ??
      ''
    );
  }, [params.token, searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('root', { type: 'manual', message: 'Lien invalide ou expiré (token manquant).' });
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });

      setSuccessMessage('Mot de passe mis à jour. Vous pouvez maintenant vous connecter.');
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as any).message)
          : 'Impossible de réinitialiser le mot de passe.';
      setError('root', { type: 'manual', message });
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

        {/* Card */}
        <div className="bg-white rounded-lg border border-[#d1d5db] shadow-sm p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#4a6670]/10 rounded-xl mb-4">
              <Lock size={28} className="text-[#4a6670]" />
            </div>
            <h2 className="text-xl font-semibold text-[#1e3a5f] mb-1">
              Nouveau mot de passe
            </h2>
            <p className="text-[#4b5563] text-sm">
              Choisissez un nouveau mot de passe sécurisé
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#1e3a5f]">
                Nouveau mot de passe
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
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  disabled={isLoading}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
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
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                  disabled={isLoading}
                  aria-label={
                    showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                  }
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
            </div>

            {errors.root && (
              <div className="bg-[#dc2626]/10 border border-[#dc2626]/20 text-[#dc2626] px-4 py-3 rounded text-sm">
                {errors.root.message}
              </div>
            )}

            {successMessage && (
              <div className="bg-[#dcfce7] border border-[#16a34a]/20 text-[#16a34a] px-4 py-3 rounded text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full font-medium bg-[#4a6670] 
                       text-white py-2.5 rounded shadow-sm
                       hover:bg-[#3d5660] hover:shadow active:scale-[0.99] 
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       disabled:hover:scale-100 disabled:active:scale-100
                       text-sm"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>

            <p className="text-center text-sm text-[#4b5563]">
              <Link to="/login" className="text-[#4a6670] hover:underline font-medium inline-flex items-center gap-1">
                <ArrowLeft size={14} />
                Retour à la connexion
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
}
