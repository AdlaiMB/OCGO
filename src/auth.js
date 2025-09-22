import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import argon2 from "argon2";

import authConfig from "./auth.config";
import { signInFormSchema } from "./lib/definitions";
import { getUserForAuth } from "./lib/dal";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { username: {}, password: {} },
      authorize: async (credentials) => {
        let validatedFields = signInFormSchema.safeParse({
          username: credentials.username,
          password: credentials.password,
        });

        if (!validatedFields.success) {
          return null;
        }

        const { username, password } = validatedFields.data;

        const user = await getUserForAuth(username);

        if (!user) {
          return null;
        }

        try {
          if (await argon2.verify(user.password, password)) {
            return { user_id: user.user_id, name: user.name };
          }
          return null;
        } catch (error) {
          console.log("Hash Error: @NextAuth - Failed to hash the password.");
          return null;
        }
      },
    }),
  ],
});
