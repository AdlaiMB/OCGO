"use client";
import { useActionState } from "react";
import { updateUser } from "@/db/user/actions.js";

export default function ProfileForm({ user }) {
  const [state, formAction, isPending] = useActionState(updateUser, {});

  return (
    <form action={formAction}>
      <h1>Update Profile</h1>
      <input type="hidden" name="old_username" value={user.username} />
      <label className="capitalize" htmlFor="username">
        username:
      </label>
      <input
        type="text"
        name="username"
        id="username"
        defaultValue={user.username}
      />
      <label className="capitalize" htmlFor="bio">
        bio:
      </label>
      <textarea name="bio" id="bio" defaultValue={user.bio} />
      <button type="submit" disabled={isPending}>
        {isPending ? "Updating ..." : "Update"}
      </button>
    </form>
  );
}
