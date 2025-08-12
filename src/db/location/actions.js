"use server";
import sql from "../db.js";

// create operations
// read operations
export async function getLocationById(id) {
  const [location, hours, links] = await sql.transaction((txn) => [
    txn`SELECT name, city, category, username, address, description FROM public.location WHERE id = ${id}`,
    txn`SELECT day, open, close FROM public.hour WHERE location_id = ${id}`,
    txn`SELECT url FROM public.url WHERE location_id = ${id}`,
  ]);

  return { ...location[0], hours, links };
}

export async function getLocationByUser(username) {
  const rows = await sql`SELECT id, name, city, category, description 
                         FROM public.location 
                         WHERE username = ${username}`;
  return rows;
}
// update operations
// delete operations
