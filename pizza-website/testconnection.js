/* eslint-disable @typescript-eslint/no-require-imports */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkConnection() {
  try {
    // Проста операція для перевірки з'єднання (отримання всіх користувачів)
    const users = await prisma.user.findMany();
    console.log('Connection is successful!', users);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
