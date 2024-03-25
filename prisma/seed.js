// seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Seed roles
    await prisma.role.createMany({
      data: [
        { name: 'ADMIN' },
        { name: 'USER' },
        { name: 'MODERATOR' },
      ],
    });

    // Seed users
    await prisma.user.createMany({
      data: [
        {
          name: 'admin',
          email: 'admin@example.com',
          password: 'adminpassword',
          roleId: 1, 
        },
        {
          name: 'user1',
          email: 'user1@example.com',
          password: 'user1password',
          roleId: 2
        },
      ],
    });

    console.log('Seed data successfully inserted.');
  } 
  catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  } 
  finally {
    await prisma.$disconnect();
  }
}

main();
