import Link from "next/link";

export default function LocationCard({ location }) {
  const originalDescription = location.description.split(" ");
  const shortenedDescription =
    originalDescription.length > 15
      ? originalDescription.slice(0, 15).join(" ") + " ..."
      : originalDescription.join(" ");

  return (
    <div className="flex flex-col gap-1 bg-white text-black w-full py-[0.25em] px-[0.5em]">
      <div className="flex justify-between">
        <Link
          href={`/location/${location.id}`}
          className="font-semibold capitalize"
        >
          {location.name}
        </Link>
        <menu className="flex gap-4">
          <li>
            <button className="cursor-pointer py-0.5 px-1 bg-black text-white text-xs">
              edit
            </button>
          </li>
        </menu>
      </div>
      <div className="flex gap-1">
        <span className="py-[0.25em] px-[0.25em] bg-black text-white text-sm capitalize">
          {location.city}
        </span>
        <span className="py-[0.25em] px-[0.25em] bg-black text-white text-sm capitalize">
          {location.category}
        </span>
      </div>
      <p>{shortenedDescription}</p>
    </div>
  );
}

// location - actions // category // description
