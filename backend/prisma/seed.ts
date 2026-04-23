import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const hash1 = await bcrypt.hash('MENTOR2025', 12);
  const mentor1 = await prisma.mentor.upsert({
    where: { email: 'temitope@mlops.dev' },
    update: {},
    create: {
      email: 'temitope@mlops.dev',
      passwordHash: hash1,
      name: 'Owolabi Temitope',
    },
  });
  console.log('Created mentor 1:', mentor1.email);

  const hash2 = await bcrypt.hash('MENTOR2025', 12);
  const mentor2 = await prisma.mentor.upsert({
    where: { email: 'profjim@mlops.dev' },
    update: {},
    create: {
      email: 'profjim@mlops.dev',
      passwordHash: hash2,
      name: 'Owolabi Shina',
    },
  });
  console.log('Created mentor 2:', mentor2.email);

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });