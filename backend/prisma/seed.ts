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

  const mentee = await prisma.mentee.upsert({
    where: { email: 'amara@test.com' },
    update: {},
    create: {
      name: 'Amara Johnson',
      email: 'amara@test.com',
      accessCode: 'AMARA-1234',
      domainTrack: 'AI & Machine Learning',
      topMatch: 'AI & Machine Learning',
      secondMatch: 'Data',
      isActive: true,
      mentorId: mentor1.id,
    },
  });
  console.log('Test mentee created:');
  console.log('  Name:        ' + mentee.name);
  console.log('  Access Code: ' + mentee.accessCode);
  console.log('  Domain:      ' + mentee.domainTrack)
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