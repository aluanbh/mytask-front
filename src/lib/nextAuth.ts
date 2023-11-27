import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthService } from "@/lib/services/auth.service";
import { decode } from 'next-auth/jwt'

export type User = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    password: string;
};

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any) {
                try {
                    const res = await AuthService.signinAlternative(credentials.email, credentials.password);
                    console.log(res);

                    if (res && res.token && isJWT(res.token)) {
                        return res;
                    }
                    return null;
                } catch (err: any) {
                    throw new Error("Erro ao buscar usuário");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {

            return { ...token, ...user };
        },

        async session({ session, token, user }) {
            session.user = token;
            return session;
        },
    }

};

function isJWT(token: string): boolean {
    const parts = token.split(".");
    return Array.isArray(parts) && parts.length === 3;
}