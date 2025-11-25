import { prisma } from '@/prisma/prisma-client';
import { compare, hashSync } from 'bcrypt';
import { AuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { UserRole } from '@prisma/client';
import { cookies } from 'next/headers';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || '',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
            profile(profile) {
                return {
                    id: profile.id,
                    email: profile.email,
                    name: profile.name || profile.login,
                    image: profile.avatar_url,
                    role: 'USER' as UserRole,
                };
            }
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }

                const findUser = await prisma.user.findFirst({
                    where: { email: credentials.email },
                });

                if (!findUser) return null;

                const isValidPassword = await compare(credentials.password, findUser.password);
                if (!isValidPassword) return null;
                if (!findUser.verified) return null;


                return {
                    id: findUser.id,
                    email: findUser.email,
                    name: findUser.fullName,
                    role: findUser.role,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user, account }) {
            try {

                const cookieStore = cookies();
                if ((await cookieStore).get('cartToken')) {
                    (await cookieStore).delete('cartToken');
                }

                if (account?.provider === 'credentials') {
                    return true;
                }

                if (!user?.email) {
                    return false;
                }

                const findUser = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { provider: account?.provider, providerId: account?.providerAccountId },
                            { email: user.email }
                        ]
                    }
                });

                if (findUser) {
                    await prisma.user.update({
                        where: { id: findUser.id },
                        data: { provider: account?.provider, providerId: account?.providerAccountId }
                    });
                    return true;
                }

                await prisma.user.create({
                    data: {
                        email: user.email,
                        fullName: user.name || 'User #' + user.id,
                        password: hashSync(String(user.id), 10),
                        verified: new Date(),
                        provider: account?.provider,
                        providerId: account?.providerAccountId,
                    }
                });
                return true;
            } catch (error) {
                console.error('Error [SIGNIN]', error);
                return false;
            }
        },

        async jwt({ token }) {

            const dbUser = await prisma.user.findUnique({
                where: {
                    email: token.email!,
                },
            });

            if (dbUser) {
                return {
                    ...token,
                    id: String(dbUser.id),
                    role: dbUser.role,
                    name: dbUser.fullName,
                };
            }


            return token;
        },

        session({ session, token }) {
            if (session?.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.name = token.name!;
            }
            return session;
        }
    },
};