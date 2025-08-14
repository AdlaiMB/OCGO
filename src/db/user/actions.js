"use server";
import { redirect } from "next/navigation";
import sql from "../db.js";

// create operations
export async function createUser(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const bio = formData.get("bio");

  const [user] =
    await sql`INSERT INTO public.user(username, password, bio) VALUES (${username}, ${password}, ${bio}) RETURNING username`;

  redirect(`/profile/${user.username}`);
}

// read opeartions
export async function getUser(username) {
  const rows = await sql`SELECT username, bio 
                         FROM public.user 
                         WHERE username = ${username}`;
  return rows[0];
}

// update operations
export async function updateUser(prevState, formData) {
  const oldUsername = formData.get("old_username");
  const updatedUsername = formData.get("username");
  const updatedBio = formData.get("bio");

  await sql`UPDATE public.user
            SET bio = ${updatedBio}, username = ${updatedUsername} 
            WHERE username = ${oldUsername}`;

  redirect(`/profile/${updatedUsername}`);
}

// delete operations
export async function deleteUser(username) {
  await sql`DELETE FROM public.user WHERE username = ${username} RETURNING username`;
}
