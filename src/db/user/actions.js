"use server";
import sql from "../db.js";

// create operations
export async function createUser(username, bio) {
  const rows =
    await sql`INSERT INTO public.user(username, password, bio) VALUES ('new_user', '000', 'this is a test') RETURNING username`;
  return rows[0];
}

// read opeartions
export async function getUser(username) {
  const rows = await sql`SELECT username, bio 
                         FROM public.user 
                         WHERE username = ${username}`;
  return rows[0];
}

// update operations
export async function updateUserBio(username, updatedBio) {
  await sql`UPDATE public.user
            SET bio = ${updatedBio} 
            WHERE username = ${username}`;
}

// delete operations
export async function deleteUser(username) {
  await sql`DELETE FROM public.user WHERE username = ${username} RETURNING username`;
}
