import { Injectable } from '@nestjs/common';
import { CreateMedicamentDto } from './dto/create-medicament.dto';
import { UpdateMedicamentDto } from './dto/update-medicament.dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class MedicamentService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllMedicament(){
     const medicaments = await this.prisma.medicament.findMany({
      orderBy: { nom: 'asc' },
      include: {
        categorie: true
      }
     });
     return medicaments;
  }


  async AddMedicament(medicament:CreateMedicamentDto){
      const existing = await this.prisma.medicament.findFirst({
      where: { nom: medicament.nom }
    });

    if (existing) {
      throw new Error(`Un médicament "${medicament.nom}" existe déjà`);
    }

     let categorieId = medicament.categorieId;
    if (medicament.categorieNom && !medicament.categorieId) {
      // Chercher la catégorie par son nom
      let categorie = await this.prisma.categorie.findFirst({
        where: { nom: medicament.categorieNom }
      });
      
      // Si la catégorie n'existe pas, la créer automatiquement
      if (!categorie) {
        categorie = await this.prisma.categorie.create({
          data: { nom: medicament.categorieNom }
        });
      }
      
      categorieId = categorie.id;
    }

    // Vérifier si la catégorie existe (si un ID a été fourni)
    if (categorieId) {
      const categorie = await this.prisma.categorie.findUnique({
        where: { id: categorieId }
      });
      
      if (!categorie) {
        throw new Error(`Catégorie avec l'ID ${categorieId} non trouvée.`);
      }
    }
     const creatMedicament = await this.prisma.medicament.create({
       data:{
         nom:medicament.nom,
         description:medicament.description,
         prixAchat:medicament.prixAchat,
         prixVente:medicament.prixVente,
         quantiteEnStock:medicament.quantiteEnStock,
         categorieId: categorieId
       },
       include: {
         categorie: true
       }
     })
     return creatMedicament;
  }

  async UpdateMedicament(id: string, medicament: UpdateMedicamentDto) {
    // Vérifier si le médicament existe
    const existingMedicament = await this.prisma.medicament.findUnique({
      where: { id }
    });

    if (!existingMedicament) {
      throw new Error(`Médicament avec l'ID ${id} non trouvé`);
    }

    let categorieId = medicament.categorieId !== undefined ? medicament.categorieId : existingMedicament.categorieId;

    if (medicament.categorieNom && !medicament.categorieId) {
      // Chercher la catégorie par son nom
      let categorie = await this.prisma.categorie.findFirst({
        where: { nom: medicament.categorieNom }
      });
      
      // Si la catégorie n'existe pas, la créer automatiquement
      if (!categorie) {
        categorie = await this.prisma.categorie.create({
          data: { nom: medicament.categorieNom }
        });
      }
      
      categorieId = categorie.id;
    }

    if (categorieId) {
      const categorie = await this.prisma.categorie.findUnique({
        where: { id: categorieId }
      });
      
      if (!categorie) {
        throw new Error(`Catégorie avec l'ID ${categorieId} non trouvée.`);
      }
    }

    const updatedMedicament = await this.prisma.medicament.update({
      where: { id },
      data: {
        nom: medicament.nom,
        description: medicament.description,
        prixAchat: medicament.prixAchat,
        prixVente: medicament.prixVente,
        quantiteEnStock: medicament.quantiteEnStock,
        categorieId: categorieId
      }
    });

    return updatedMedicament;
  }

  async seedCategories() {
    const categoriesDefault = [
      { nom: 'Antalgiques / Analgésiques', description: 'Contre la douleur (ex: Paracétamol)' },
      { nom: 'Antibiotiques', description: 'Pour lutter contre les infections bactériennes' },
      { nom: 'Anti-inflammatoires', description: 'Pour réduire les inflammations' },
      { nom: 'Antihistaminiques', description: 'Traitement des allergies' },
      { nom: 'Antispasmodiques', description: 'Contre les contractures ou spasmes' },
      { nom: 'Antipyrétiques', description: 'Pour faire baisser la fièvre' },
      { nom: 'Antidépresseurs', description: 'Traitement de la dépression' },
      { nom: 'Antiseptiques', description: 'Désinfectants, alcool' },
      { nom: 'Antiacides', description: 'Contre les brûlures d\'estomac' },
      { nom: 'Vitamines et Compléments', description: 'Vitamines B, C, D, Fer, Magnésium...' },
      { nom: 'Sirops et Antitussifs', description: 'Contre la toux sèche ou grasse' },
      { nom: 'Vaccins', description: 'Produits de vaccination' },
      { nom: 'Dermatologie', description: 'Crèmes, pommades pour la peau' },
      { nom: 'Matériel Médical', description: 'Seringues, pansements, gants' }
    ];

    let count = 0;
    for (const cat of categoriesDefault) {
      const exists = await this.prisma.categorie.findFirst({ where: { nom: cat.nom } });
      if (!exists) {
        await this.prisma.categorie.create({ data: cat });
        count++;
      }
    }
    return { message: `${count} nouvelles catégories ont été ajoutées avec succès.` };
  }

  async getAllCategories() {
    return this.prisma.categorie.findMany({
      orderBy: { nom: 'asc' }
    });
  }
  async getMedicamentById(id: string) {
    const medicament = await this.prisma.medicament.findUnique({
      where: {id: id },
        include: {
        categorie: true
      }
    });

    if (!medicament) {
      throw new Error(`Médicament introuvable`);
    }
    return medicament;
  } 
  async deletMedicament(id :string){
    const existingMedicament = await this.prisma.medicament.findUnique({
    where: { id }
    })
    if (!existingMedicament) {
      throw new Error(`Médicament avec l'ID ${id} non trouvé`);
    }
    const deletedMedicament = await this.prisma.medicament.delete({
      where: { id }
    });
    return deletedMedicament;
  }
}