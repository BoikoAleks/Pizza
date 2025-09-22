// ФАЙЛ: next-auth.d.ts (ЗАМІНІТЬ ПОВНІСТЮ)

import { DefaultSession } from 'next-auth';
import type { UserRole } from '@prisma/client';

// Розширюємо стандартний тип User з next-auth, 
// щоб він відповідав вашій моделі Prisma
declare module 'next-auth' {
  interface User {
    id: number; // ID з бази даних є числом
    role: UserRole;
  }

  // Розширюємо сесію, додаючи наші кастомні поля
  interface Session {
    user: {
      id: string; // ID в сесії буде рядком
      role: UserRole;
    } & DefaultSession['user']; // Об'єднуємо з стандартними полями (name, email, image)
  }
}

// Розширюємо JWT токен
declare module 'next-auth/jwt' {
  interface JWT {
    id: string; // ID в токені буде рядком
    role: UserRole;
  }
}