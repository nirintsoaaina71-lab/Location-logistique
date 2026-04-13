// schemas/auth.schemas.ts
import { z } from 'zod';

// Schéma pour l'email
const emailSchema = z
  .string()
  .min(1, "L'email est requis")
  .email("Format d'email invalide");

// Schéma pour le mot de passe
const passwordSchema = z
  .string()
  .min(1, "Le mot de passe est requis")
  .min(6, "Le mot de passe doit contenir au moins 6 caractères")
  .max(50, "Le mot de passe ne peut pas dépasser 50 caractères");

// Schéma pour le nom
const nameSchema = z
  .string()
  .min(1, "Le nom est requis")
  .min(2, "Le nom doit contenir au moins 2 caractères")
  .max(50, "Le nom ne peut pas dépasser 50 caractères")
  .regex(
    /^[a-zA-ZÀ-ÿ\s]+$/, 
    "Le nom ne peut contenir que des lettres et des espaces"
  );

// Schéma pour la connexion
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Schéma pour l'inscription
export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Veuillez confirmer votre mot de passe"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

// Types inférés des schémas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Type pour la force du mot de passe
export interface PasswordStrength {
  level: string;
  color: string;
  strength: number;
}
// ===== SCHÉMAS POUR LES RÉPONSES API =====

// Réponse utilisateur (ce que le backend renvoie)
export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.string().optional(),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

// Réponse de connexion
export const loginResponseSchema = z.object({
  user: userResponseSchema,
  // Note: le token est dans le cookie, pas dans la réponse
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// Réponse d'inscription
export const signupResponseSchema = z.object({
  user: userResponseSchema,
  message: z.string().optional(),
});

export type SignupResponse = z.infer<typeof signupResponseSchema>;

// Réponse d'erreur générique
export const errorResponseSchema = z.object({
  message: z.string(),
  statusCode: z.number(),
  error: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;

// Réponse de succès simple
export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export type SuccessResponse = z.infer<typeof successResponseSchema>;
