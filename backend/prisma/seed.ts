import { PrismaClient, Species, Sex } from '@prisma/client';
import { DEFAULT_OWNER } from '../src/defaultOwner.js';

const prisma = new PrismaClient();

async function main() {
  // Idempotent per-owner: each owner is keyed by its unique email and skipped if
  // it already exists, so the seed can be re-run (e.g. via scripts/bootstrap.sh)
  // without hitting the unique-email constraint.

  const ada = await prisma.owner.findUnique({
    where: { email: 'ada@example.com' },
  });
  if (ada) {
    console.log(`Seed skipped for Ada Lovelace — already exists (${ada.id})`);
  } else {
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

  // Lynzle's cats — all Domestic Shorthair (DSH). Lynzle is the canonical
  // default owner for personal mode (PET-4); the frontend resolves this owner
  // via GET /api/owners/default and requests GET /api/pets?ownerId=<id>, so
  // only these pets are shown in personal mode.
  const lynzle = await prisma.owner.findUnique({
    where: { email: DEFAULT_OWNER.email },
  });
  if (lynzle) {
    console.log(`Seed skipped for Lynzle (default owner) — already exists (${lynzle.id})`);
  } else {
    const catOwner = await prisma.owner.create({
      data: {
        name: DEFAULT_OWNER.name,
        email: DEFAULT_OWNER.email,
        pets: {
          create: [
            { name: 'assy', species: Species.CAT, breed: 'DSH', sex: Sex.FEMALE, color: 'creamsicle', birthDate: null },
            { name: 'sassy-o', species: Species.CAT, breed: 'DSH', sex: Sex.MALE, color: 'creamsicle', birthDate: new Date('2020-08-01') },
            { name: 'soya', species: Species.CAT, breed: 'DSH', sex: Sex.FEMALE, color: 'calico', birthDate: new Date('2021-06-01') },
            { name: 'paotsin', species: Species.CAT, breed: 'DSH', sex: Sex.MALE, color: 'creamsicle', birthDate: new Date('2021-06-01') },
            { name: 'bonito', species: Species.CAT, breed: 'DSH', sex: Sex.MALE, color: 'ginger', birthDate: new Date('2021-06-01') },
            { name: 'carly', species: Species.CAT, breed: 'DSH', sex: Sex.FEMALE, color: 'calico', birthDate: new Date('2021-06-01') },
          ],
        },
      },
    });
    console.log(`Seeded owner ${catOwner.name} (${catOwner.id}) with 6 cats`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
