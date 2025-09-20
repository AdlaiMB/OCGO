import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInFormSchema, UsernameSchema } from "@/lib/definitions";
import { getUserByUsernameAndPassword } from "@/lib/dal";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      authorize: async (credentials) => {
        let user = null;

        let validatedFields = signInFormSchema.safeParse({
          username: credentials.username,
          password: credentials.password,
        });

        if (!validatedFields.success) {
          return null;
        }

        const { username, password } = validatedFields.data;

        user = await getUserByUsernameAndPassword(username, password);

        if (!user) {
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.user_id;
      }
      if (trigger === "update" && session.name) {
        const validatedUsername = UsernameSchema.safeParse({
          name: session.name,
        });

        if (!validatedUsername) {
          return null;
        }
        const { name } = validatedUsername.data;
        token.name = name;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
    authorized({ auth }) {
      return auth ? true : false;
    },
  },
  pages: {
    signIn: "/signin",
  },
});
