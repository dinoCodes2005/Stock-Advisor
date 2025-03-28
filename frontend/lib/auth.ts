import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

// ✅ Configure NextAuth Options
export const authConfig: NextAuthOptions = {
  providers: [
    // ✅ Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    // ✅ Credentials Provider (Custom Auth)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // ✅ Custom logic to validate user
        const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        const user = await res.json();

        // If no user or invalid credentials
        if (res.ok && user) {
          return user; // Return user object if successful
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],

  // ✅ Callbacks for handling JWT and session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },

  // ✅ Set session and JWT settings
  session: {
    strategy: "jwt",
  },

  // ✅ Set custom pages for login/logout errors
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
