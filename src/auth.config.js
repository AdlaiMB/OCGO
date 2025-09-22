import { UsernameSchema } from "@/lib/definitions";

export default {
  providers: [],
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
};
