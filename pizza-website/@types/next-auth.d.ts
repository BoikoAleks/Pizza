import { DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';
import type { UserRole } from '@prisma/client';

declare module 'next-auth' {
    interface Session {
        user: {
            email: any;
            user: any;
            id: string;
            role: UserRole;
            name: string;
            image: string;
        };
    }

    interface User extends DefaultUser {
        id: number;
        role: UserRole;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        id: string;
        role: UserRole;
    }
}