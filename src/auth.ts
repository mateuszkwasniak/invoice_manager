import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Provider } from "next-auth/providers";
import { SignInFormSchema } from "@/schemas/SignIn";
import { PrismaClient } from "@prisma/client";
import { comparePasswordAndHash } from "@/lib/utils/bcrypt";

const prisma = new PrismaClient();

const providers: Provider[] = [
  Credentials({
    credentials: {
      name: {},
      password: {},
    },
    authorize: async (credentials) => {
      try {
        const validFormInput = SignInFormSchema.safeParse(credentials);
        if (validFormInput) {
          const user = await prisma.user.findUnique({
            where: {
              name: credentials.name as string,
            },
            select: {
              id: true,
              name: true,
              email: true,
              password: true,
            },
          });

          if (user) {
            await comparePasswordAndHash(
              credentials.password as string,
              user.password as string
            );

            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          } else {
            throw new Error("401");
          }
        } else throw new Error("Formularz nie został wypełniony prawidłowo");
      } catch (error: any) {
        if (error?.message === "401") {
          throw new Error("Nieprawidlowy login lub hasło");
        }
        throw new Error("Nie udało się zalogować, proszę spróbować później");
      }
    },
  }),
];

export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
  }
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
});
