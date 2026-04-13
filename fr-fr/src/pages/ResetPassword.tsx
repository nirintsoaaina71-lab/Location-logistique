import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Eye, EyeOff } from 'lucide-react';
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
      // Payload générique (tu peux adapter si ton backend attend un autre nom)
      await api.post('/auth/reset-password', {
        token,
        password: data.password,
      });

      setSuccessMessage('Mot de passe mis à jour. Tu peux maintenant te connecter.');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-[0_30px_30px_-20px_rgba(16,137,211,0.5)] border-4 border-white">
        <h1 className="text-center font-black text-3xl text-[#1089d3] mb-8">
          Nouveau mot de passe
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password')}
                placeholder="Nouveau mot de passe"
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
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={isLoading}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
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
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                disabled={isLoading}
                aria-label={
                  showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                }
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
          </div>

          {errors.root && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
              {errors.root.message}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full font-bold bg-gradient-to-r from-[#1089d3] to-[#12B1D1] 
                     text-white py-4 rounded-2xl shadow-[0_20px_10px_-15px_rgba(16,137,211,0.5)]
                     hover:shadow-[0_23px_10px_-20px_rgba(16,137,211,0.5)] 
                     hover:scale-[1.02] active:scale-[0.98] 
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed 
                     disabled:hover:scale-100 disabled:active:scale-100"
          >
            {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            <Link to="/login" className="text-[#0099ff] hover:underline font-medium">
              Retour à la connexion
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

