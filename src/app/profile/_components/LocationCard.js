import Link from "next/link";

export default function LocationCard({
  locationId,
  locationName,
  city,
  category,
  description,
  isSessionUsersProfile,
}) {
  const splitDescription = description.split(" ");
  const shortenedDescription =
    splitDescription.length > 15
      ? splitDescription.slice(0, 15).join(" ") + " ..."
      : splitDescription.join(" ");

  return (
    <div className="flex flex-col gap-2 p-2 border rounded-md bg-gray-900 border-gray-500">
      <div className="flex justify-between">
        <Link
          href={`/location/${locationId}`}
          className="text-base font-semibold"
        >
          {locationName}
        </Link>
        {isSessionUsersProfile && (
          <Link
            href={`/update/location/${locationId}`}
            className="text-sm rounded-sm px-2 py-1 transition-colors bg-slate-600 hover:bg-slate-500 cursor-pointer"
          >
            Edit
          </Link>
        )}
      </div>
      <div className="flex gap-1">
        <span className="py-0.5 px-1 rounded-sm bg-slate-700">{city}</span>
        <span className="py-0.5 px-1 rounded-sm bg-slate-700">{category}</span>
      </div>
      <p>{shortenedDescription}</p>
    </div>
  );
}
