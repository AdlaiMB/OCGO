"use server";
import sql from "../db.js";

// create operations
// read operations
export async function getLocationByUser(username) {
  const rows = await sql`SELECT id, name, city, category, description 
                         FROM public.location 
                         WHERE username = ${username}`;
  return rows;
}
// update operations
// delete operations
