"use client";
import { useActionState } from "react";
import { createUser } from "@/db/user/actions.js";

export default function Page() {
  const [state, action, isPending] = useActionState(createUser, null);

  return (
    <form action={action}>
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <textarea name="bio" placeholder="Bio" required></textarea>
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating" : "Create User"}
      </button>
    </form>
  );
}
