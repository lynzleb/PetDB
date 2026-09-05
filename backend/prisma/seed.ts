import { PrismaClient, Species } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Idempotent: skip if the sample owner already exists so the seed can be
  // re-run (e.g. via scripts/bootstrap.sh) without hitting the unique email.
  const existing = await prisma.owner.findUnique({
    where: { email: 'ada@example.com' },
  });
  if (existing) {
    console.log(`Seed skipped — owner already exists (${existing.id})`);
    return;
  }

  const owner = await prisma.owner.create({
    data: {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      phone: '+1-555-0100',
      pets: {
        create: [
          {
            name: 'Byte',
            species: Species.DOG,
            breed: 'Border Collie',
            birthDate: new Date('2021-04-12'),
            bloodTests: {
              create: [
                {
                  testType: 'Hemoglobin',
                  value: 15.2,
                  unit: 'g/dL',
                  takenAt: new Date('2026-01-15'),
                },
              ],
            },
            vaccinations: {
              create: [
                {
                  vaccineName: 'Rabies',
                  administeredAt: new Date('2025-06-01'),
                  nextDueAt: new Date('2026-06-01'),
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Seeded owner ${owner.name} (${owner.id})`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
