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
    <div className="card-outside">
      <div className="card-inside flex flex-col gap-2">
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
              className="btn text-sm rounded-sm px-2 py-1 transition-colors hover:bg-[#111111]"
            >
              edit
            </Link>
          )}
        </div>
        <div className="flex gap-1 items-center text-sm">
          <span className="tag p-1 rounded-sm">{city}</span>
          <span className="tag p-1 rounded-sm">{category}</span>
        </div>
        <p>{shortenedDescription}</p>
      </div>
    </div>
  );
}
