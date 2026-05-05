// schemas/produit.schemas.ts
import { z } from 'zod';

// Schéma pour le nom du médicament
const medicineNameSchema = z
  .string()
  .min(1, "Le nom du médicament est requis")
  .min(3, "Le nom doit contenir au moins 3 caractères")
  .max(100, "Le nom ne peut pas dépasser 100 caractères");

// Schéma pour la catégorie (peut être un ID ou un nom)
const categorySchema = z
  .string()
  .min(1, "La catégorie est requise");



// Schéma pour le prix d'achat (en Ariary)
const purchasePriceSchema = z
  .string()
  .min(1, "Le prix d'achat est requis")
  .refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Le prix d'achat doit être un nombre positif valide");

// Schéma pour le prix de vente (en Ariary)
const salePriceSchema = z
  .string()
  .min(1, "Le prix de vente est requis")
  .refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Le prix de vente doit être un nombre positif valide");

// Schéma pour le stock (nombre de boîtes)
const stockSchema = z
  .string()
  .min(1, "Le nombre de boîtes en stock est requis")
  .refine((val) => {
    const num = parseInt(val, 10);
    return !isNaN(num) && num >= 0 && Number.isInteger(parseFloat(val));
  }, "Le stock doit être un nombre entier positif ou nul");

// Schéma pour la description (optionnelle)
const descriptionSchema = z
  .string()
  .max(500, "La description ne peut pas dépasser 500 caractères")
  .optional()
  .or(z.literal(''));

// Schéma principal pour le formulaire d'ajout de médicament
export const addMedicineSchema = z.object({
  name: medicineNameSchema,
  category: categorySchema,
  purchasePrice: purchasePriceSchema,
  salePrice: salePriceSchema,
  stock: stockSchema,
  description: descriptionSchema,
}).refine((data) => {
  const purchasePrice = parseFloat(data.purchasePrice);
  const salePrice = parseFloat(data.salePrice);
  if (!isNaN(purchasePrice) && !isNaN(salePrice) && salePrice < purchasePrice) {
    return false;
  }
  return true;
}, {
  message: "Le prix de vente doit être supérieur ou égal au prix d'achat",
  path: ["salePrice"],
});

// Type inféré du schéma
export type AddMedicineFormData = z.infer<typeof addMedicineSchema>;

// Schéma pour un médicament (réponse du backend) - utilise les noms français
// Le backend peut retourner categorie comme string ou comme objet { id, nom, ... } ou null
export const medicineResponseSchema = z.object({
  id: z.string().or(z.number()).transform(String),
  nom: z.string(),
  categorie: z.preprocess((val) => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && 'nom' in val) return (val as { nom: string }).nom;
    return 'Non catégorisé';
  }, z.string()),
  prixAchat: z.number().or(z.string()).transform(Number),
  prixVente: z.number().or(z.string()).transform(Number),
  quantiteEnStock: z.number().or(z.string()).transform(Number),
  description: z.preprocess((val) => {
    if (typeof val === 'string') return val;
    return '';
  }, z.string()),
  createdAt: z.string().datetime().optional().nullable(),
  updatedAt: z.string().datetime().optional().nullable(),
}).passthrough();

export type MedicineResponse = z.infer<typeof medicineResponseSchema>;

// Schéma pour la réponse d'ajout de médicament
export const addMedicineResponseSchema = z.object({
  medicine: medicineResponseSchema.optional(),
  message: z.string().optional(),
  data: medicineResponseSchema.optional(),
}).passthrough();

export type AddMedicineResponse = z.infer<typeof addMedicineResponseSchema>;

// Schéma pour la liste des médicaments - tableau direct
export const medicineArraySchema = z.array(medicineResponseSchema);

export type MedicineArray = z.infer<typeof medicineArraySchema>;
