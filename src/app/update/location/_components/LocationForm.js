"use client";

import { useActionState } from "react";
import { updateLocation } from "@/db/location/actions";

export default function LocationForm({ location }) {
  const [state, action, isPending] = useActionState(updateLocation, null);
  const days = new Set([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]);

  return (
    <form action={action}>
      <h2>Update Location</h2>
      <input type="hidden" name="id" value={location.id} />
      <div>
        <label>name: </label>
        <input type="text" name="name" defaultValue={location.name} />
      </div>
      <div>
        <label>city: </label>
        <input type="text" name="city" defaultValue={location.city} />
      </div>
      <div>
        <label>category: </label>
        <input type="text" name="category" defaultValue={location.category} />
      </div>
      <div>
        <label>address: </label>
        <input type="text" name="address" defaultValue={location.address} />
      </div>
      <div>
        <label>description: </label>
        <textarea
          name="description"
          defaultValue={location.description}
        ></textarea>
      </div>
      <div>
        <label>link: </label>
        <input type="url" name="link" defaultValue={location.links[0].url} />
      </div>
      {location.hours.map((hour) => {
        days.delete(hour.day);
        return (
          <div key={hour.day}>
            <label>{hour.day}: </label>
            <input type="time" name={hour.day} defaultValue={hour.open} />
            <input type="time" name={hour.day} defaultValue={hour.close} />
          </div>
        );
      })}
      {Array.from(days).map((day) => (
        <div key={day}>
          <label>{day}: </label>
          <input type="time" name={`new-${day}`} />
          <input type="time" name={`new-${day}`} />
        </div>
      ))}
      <button>submit</button>
    </form>
  );
}
