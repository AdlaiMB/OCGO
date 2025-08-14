"use server";
import sql from "../db.js";
import { redirect } from "next/navigation";

// create operations
export async function createLocation(prevState, formData) {
  const name = formData.get("name");
  const address = formData.get("address");
  const link = formData.get("link");
  const city = formData.get("city");
  const category = formData.get("category");
  const username = "admin";
  const description = formData.get("description");

  const [location] =
    await sql`INSERT INTO public.location(username, name, address, city, category, description)
              VALUES (${username}, ${name}, ${address}, ${city}, ${category}, ${description})
              RETURNING id`;

  const locationId = location.id;
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  await sql.transaction((txn) => {
    const queries = [];

    for (const day of days) {
      const [open, close] = formData.getAll(day);

      if (open == "" || close == " ") {
        continue;
      }

      queries.push(txn`INSERT INTO public.hour(location_id, day, open, close)
                       VALUES (${locationId}, ${day}, ${open}, ${close})`);
    }

    queries.push(txn`INSERT INTO public.url(location_id, url)
                     VALUES (${locationId}, ${link})`);

    return queries;
  });

  redirect(`/location/${locationId}`);
}

// read operations
export async function getLocationById(id) {
  const [location, hours, links] = await sql.transaction((txn) => [
    txn`SELECT id, name, city, category, username, address, description FROM public.location WHERE id = ${id}`,
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
export async function updateLocation(prevState, formData) {
  const exisitingHours = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const newHours = [
    "new-monday",
    "new-tuesday",
    "new-wednesday",
    "new-thursday",
    "new-friday",
    "new-saturday",
    "new-sunday",
  ];

  const id = formData.get("id");
  const name = formData.get("name");
  const city = formData.get("city");
  const category = formData.get("category");
  const address = formData.get("address");
  const description = formData.get("description");
  const url = formData.get("link");

  await sql.transaction((txn) => {
    const queries = [];

    for (const day of exisitingHours) {
      if (!formData.has(day)) {
        continue;
      }

      const [open, close] = formData.getAll(day);

      if (open == "" && close == "") {
        queries.push(
          txn`DELETE FROM public.hour 
              WHERE location_id = ${id} AND day = ${day}`
        );
      } else {
        queries.push(
          txn`UPDATE public.hour 
              SET open = ${open}, close = ${close}
              WHERE location_id = ${id} AND day = ${day}`
        );
      }
    }

    for (const day of newHours) {
      if (!formData.has(day)) {
        continue;
      }

      const [open, close] = formData.getAll(day);

      if (open == "" && close == "") {
        continue;
      }

      queries.push(
        txn`INSERT INTO public.hour (location_id, day, open, close) 
            VALUES (${id}, ${day}, ${open}, ${close})`
      );
    }

    queries.push(
      txn`UPDATE public.location 
          SET name = ${name}, city = ${city}, category = ${category}, address = ${address}, description = ${description} 
          WHERE id = ${id}`
    );

    return queries;
  });

  redirect(`/location/${id}`);
}

// delete operations
