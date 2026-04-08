import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { AuthOptions, Session } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

const prisma = new PrismaClient();

// Extend the Session type to include the 'id' and 'role' properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    role?: string;
  }
}

declare module "next-auth" {
  interface User {
    role?: string;
  }
}

const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role,
        };
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.image = user.image ?? undefined;
        token.role = user.role;
      }
      // Handle session update() calls
      if (trigger === 'update' && session?.user) {
        if (session.user.image) token.image = session.user.image;
        if (session.user.name) token.name = session.user.name;
        if (session.user.email) token.email = session.user.email;
      }
      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: {
        id: string;
        email?: string;
        name?: string;
        image?: string;
        role?: string;
      };
    }) {
      if (token) {
        if (session.user) {
          session.user.id = token.id;
          session.user.email = token.email;
          session.user.name = token.name;
          session.user.image = token.image;
          session.user.role = token.role;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "",
    error: "",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
