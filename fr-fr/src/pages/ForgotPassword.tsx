import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { z } from 'zod';
import api from '../service/api';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setSuccessMessage(null);
    try {
      await api.post('/auth/forgot-password', { email: data.email });
      setSuccessMessage(
        "Si un compte existe pour cet email, un lien de réinitialisation a été envoyé."
      );
    } catch (error) {
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as any).message)
          : "Impossible d'envoyer l'email. Réessaie.";
      setError('root', { type: 'manual', message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-[0_30px_30px_-20px_rgba(16,137,211,0.5)] border-4 border-white">
        <h1 className="text-center font-black text-3xl text-[#1089d3] mb-8">
          Mot de passe oublié
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
            {isLoading ? 'Envoi...' : 'Envoyer le lien'}
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

