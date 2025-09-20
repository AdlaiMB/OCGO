import { auth } from "@/auth";
import { getUserByUserId } from "@/lib/dal";
import { SessionProvider } from "next-auth/react";

import ProfileForm from "./_components/ProfileForm";

export default async function Page() {
  const session = await auth();
  const { name, bio } = await getUserByUserId(session.user.id);
  console.log(name);

  return (
    <SessionProvider>
      <ProfileForm name={name} bio={bio} />
    </SessionProvider>
  );
}
