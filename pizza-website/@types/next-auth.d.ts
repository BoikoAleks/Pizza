import { DefaultSession } from 'next-auth';
import type { UserRole } from '@prisma/client';


declare module 'next-auth' {
  interface User {
    id: number;
    role: UserRole;
  }


  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }
}


declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}