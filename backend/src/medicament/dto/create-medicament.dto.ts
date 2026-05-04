import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';

export class CreateMedicamentDto {
  @IsString()
  @IsNotEmpty({ message: 'Le nom du médicament est obligatoire' })
  nom!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Le prix d\'achat est obligatoire' })
  prixAchat!: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Le prix de vente est obligatoire' })
  prixVente!: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty({ message: 'La quantité en stock est obligatoire' })
  quantiteEnStock!: number;

  @IsString()
  @IsOptional()
  categorieId?: string;

  @IsOptional()
  @IsString()
  categorieNom?: string;
}
