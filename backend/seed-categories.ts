import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  { nom: 'Antalgiques / Analgésiques', description: 'Médicaments contre la douleur' },
  { nom: 'Antibiotiques', description: 'Pour lutter contre les infections bactériennes' },
  { nom: 'Anti-inflammatoires', description: 'Pour réduire les inflammations' },
  { nom: 'Antihistaminiques', description: 'Traitement des allergies' },
  { nom: 'Antispasmodiques', description: 'Contre les spasmes musculaires et douleurs digestives' },
  { nom: 'Antipyrétiques', description: 'Pour faire baisser la fièvre' },
  { nom: 'Antidépresseurs', description: 'Traitement de la dépression' },
  { nom: 'Antiseptiques', description: 'Désinfectants pour prévenir les infections' },
  { nom: 'Antiacides', description: 'Contre les brûlures d\'estomac et reflux' },
  { nom: 'Vitamines et Compléments', description: 'Compléments alimentaires et vitamines' },
  { nom: 'Antitussifs / Expectorants', description: 'Sirops et traitements contre la toux' },
  { nom: 'Vaccins', description: 'Produits de vaccination' },
  { nom: 'Dermatologie', description: 'Traitements pour la peau, crèmes, pommades' },
  { nom: 'Matériel Médical', description: 'Équipements et accessoires médicaux (seringues, pansements, etc.)' },
];

async function main() {
  console.log('Début de l\'insertion des catégories...');
  let count = 0;
  for (const cat of categories) {
    const existing = await prisma.categorie.findFirst({ where: { nom: cat.nom } });
    if (!existing) {
      await prisma.categorie.create({ data: cat });
      console.log(`✅ Catégorie ajoutée : ${cat.nom}`);
      count++;
    } else {
      console.log(`⚠️ La catégorie "${cat.nom}" existe déjà.`);
    }
  }
  console.log(`Terminé ! ${count} nouvelles catégories ont été ajoutées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
