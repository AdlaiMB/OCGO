"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { serverActionUpdateLocation } from "@/lib/actions";

export default function LocationForm({
  id,
  name,
  city,
  category,
  address,
  url,
  description,
  hours,
}) {
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
    "fast food",
    "restaurant",
    "aquarium",
    "zoo",
    "museum",
    "library",
    "park",
    "public",
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

  const [state, action, isPending] = useActionState(
    serverActionUpdateLocation,
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (!state || !state.success) {
      return;
    }
    setTimeout(() => {
      router.push(`/location/${state.location_id}`);
    }, 1500);
  }, [state]);

  return (
    <div
      id="LocationFormPage"
      className="max-w-[1700px] px-2 md:px-10 mt-14 mx-auto"
    >
      {state && (
        <div
          className={`p-2 mb-4 rounded-md border text-sm md:text-base ${
            state.success
              ? "bg-green-800 border-green-600"
              : "bg-red-800 border-red-600"
          }`}
        >
          <p>
            {state.success
              ? "Update location successful. You will be redirected to the location page."
              : `Update location unsuccessful. ${state.error}`}
          </p>
        </div>
      )}
      <div id="LocationForm" className="posts-container p-3 md:p-4 lg:p-6">
        <h1 className="text-2xl md:text-3xl font-semibold">update location</h1>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="id" defaultValue={id} />
          <label
            htmlFor="name"
            className="text-sm md:text-base font-normal capitalize"
          >
            name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="enter location name ..."
            defaultValue={name}
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <div>
            <label
              htmlFor="city"
              className="text-sm md:text-base font-normal capitalize"
            >
              city
            </label>
            <select id="city" name="city" required defaultValue={city}>
              {citys.map((city) => (
                <option
                  key={city}
                  value={city}
                  className="text-sm md:text-base text-black"
                >
                  {city}
                </option>
              ))}
            </select>
            <label
              htmlFor="category"
              className="text-sm md:text-base ml-4 font-normal capitalize"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={category}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="text-sm md:text-base text-black"
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
          <label
            htmlFor="address"
            className="text-sm md:text-base font-normal capitalize"
          >
            address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            required
            defaultValue={address}
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <label
            htmlFor="url"
            className="text-sm md:text-base font-normal capitalize"
          >
            link
          </label>
          <input
            type="url"
            id="url"
            name="url"
            defaultValue={url}
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <div className="flex flex-col gap-2">
            {days.map((day) => {
              if (day in hours) {
                return (
                  <div key={day} className="grid grid-cols-[10%_15%_15%]">
                    <label
                      htmlFor={day}
                      className="text-sm md:text-base font-normal capitalize"
                    >
                      {day}
                    </label>
                    <input
                      type="time"
                      id={day}
                      name={day}
                      defaultValue={hours[day][0]}
                      className="text-sm md:text-base"
                    />
                    <input
                      type="time"
                      name={day}
                      defaultValue={hours[day][1]}
                      className="text-sm md:text-base"
                    />
                  </div>
                );
              }
              return (
                <div key={day} className="grid grid-cols-[10%_15%_15%]">
                  <label
                    htmlFor={day}
                    className="text-sm md:text-base font-normal capitalize"
                  >
                    {day}
                  </label>
                  <input
                    type="time"
                    id={day}
                    name={`new-${day}`}
                    className="text-sm md:text-base"
                  />
                  <input
                    type="time"
                    name={`new-${day}`}
                    className="text-sm md:text-base"
                  />
                </div>
              );
            })}
          </div>
          <label
            htmlFor="description"
            className="text-sm md:text-base font-normal capitalize"
          >
            description
          </label>
          <textarea
            rows="5"
            id="description"
            name="description"
            placeholder="enter a description ..."
            defaultValue={description}
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />
          <button
            disabled={isPending}
            className="btn text-sm md:text-base py-4 px-7 rounded-md self-baseline transition-colors"
          >
            {isPending ? "updating ..." : "update"}
          </button>
        </form>
      </div>
    </div>
  );
}
