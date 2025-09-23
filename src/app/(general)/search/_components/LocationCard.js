import Link from "next/link";

export default function LocationCard({
  owner,
  isSessionUsersLocation,
  locationId,
  locationName,
  city,
  category,
  address,
}) {
  return (
    <div className="card-outside">
      <div className="card-inside flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Link
            href={`/location/${locationId}`}
            className="text-base md:text-lg font-bold"
          >
            {locationName}
          </Link>
          {isSessionUsersLocation && (
            <Link
              href={`/update/location/${locationId}`}
              className="btn text-xs md:text-sm rounded-sm px-2 py-1 transition-colors hover:bg-[#111111]"
            >
              edit
            </Link>
          )}
        </div>
        <div className="flex gap-2 items-center text-xs md:text-sm">
          <span className="tag p-1 rounded-sm">{city}</span>
          <span className="tag p-1 rounded-sm">{category}</span>
          {owner ? (
            <Link href={`/profile/${owner}`}>@{owner}</Link>
          ) : (
            <span>deleted</span>
          )}
        </div>
        <p className="text-sm md:text-base">
          <span className="capitalize font-semibold">address: </span>
          {address}
        </p>
      </div>
    </div>
  );
}
