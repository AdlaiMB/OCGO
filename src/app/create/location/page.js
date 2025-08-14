"use client";

import { Fragment, useActionState } from "react";
import { createLocation } from "@/db/location/actions";

export default function Page() {
  const [state, action, isPending] = useActionState(createLocation, null);

  const citys = [
    "aliso viejo",
    "anaheim",
    "brea",
    "buena park",
    "costa mesa",
    "cypress",
    "dana point",
    "fountain valley",
    "fullerton",
    "garden grove",
    "huntington beach",
    "irvine",
    "la habra",
    "la palma",
    "laguna beach",
    "laguna hills",
    "laguna niguel",
    "laguna woods",
    "lake forest",
    "los alamitos",
    "mission viejo",
    "newport beach",
    "orange",
    "placentia",
    "rancho santa margarita",
    "san clemente",
    "san juan capistrano",
    "santa ana",
    "seal beach",
    "stanton",
    "tustin",
    "villa park",
    "westminster",
    "yorba linda",
  ];

  const categories = [
    "food",
    "entertainment",
    "shopping",
    "library",
    "park",
    "government",
  ];

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <form action={action}>
      <h1>Create Location</h1>
      <label>name:</label>
      <input type="text" name="name" required />
      <label>address:</label>
      <input type="text" name="address" required />
      <label htmlFor="link">link:</label>
      <input type="url" name="link" id="link" required />
      <label htmlFor="city">city:</label>
      <select name="city" id="city" required>
        {citys.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      <label htmlFor="category">category:</label>
      <select name="category" id="category" required>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {days.map((day) => (
        <Fragment key={day}>
          <label htmlFor={day}>{day}</label>
          <input type="time" name={day} />
          <input type="time" name={day} />
        </Fragment>
      ))}
      <label>description:</label>
      <textarea name="description" required></textarea>
      <button disabled={isPending} type="submit">
        {isPending ? "Creating" : "Create"}
      </button>
    </form>
  );
}
