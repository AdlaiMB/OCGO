import Link from "next/link";

export default function LocationContent({
  owner,
  locationId,
  locationName,
  city,
  category,
  address,
  url,
  description,
  hours,
}) {
  const days = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const currentDay = days[new Date().getDay()];

  return (
    <div
      id="LocationContent"
      className="posts-container p-3 md:p-4 lg:p-6 gap-2"
    >
      <div id="LocationHeader" className="flex flex-col gap-2">
        <div
          id="LocationName&Actions"
          className="flex items-start md:items-center justify-between"
        >
          <h1 className="text-2xl md:text-3xl">{locationName}</h1>
          <Link
            href={`/update/location/${locationId}`}
            className="btn text-xs md:text-sm rounded-sm px-4 py-2 transition-colors"
          >
            edit
          </Link>
        </div>
        <div
          id="LocationFilters"
          className="flex gap-1 items-center text-xs md:text-sm"
        >
          <span className="tag py-0.5 px-1 rounded-sm">{city}</span>
          <span className="tag py-0.5 px-1 rounded-sm">{category}</span>
        </div>
        <Link
          id="LocationOwner"
          href={`/profile/${owner}`}
          className="text-xs md:text-sm"
        >
          @{owner}
        </Link>
      </div>
      <div id="LocationImg"></div>
      <div
        id="LocationInfo"
        className="flex flex-col gap-2 text-sm md:text-base"
      >
        <div className="flex flex-col gap-2 lg:flex-row lg:gap-0 md:justify-between">
          <p id="LocationAddress">
            <span className="capitalize font-semibold">address: </span>
            {address}
          </p>
          <p>
            <span className="capitalize font-semibold">link: </span>
            <Link id="LocationLink" href={url}>
              {url}
            </Link>
          </p>
        </div>
        <p id="LocationHours">
          <span className="capitalize font-semibold">hours: </span>
          {`${currentDay} ${hours[currentDay][0]} - ${hours[currentDay][1]} `}
        </p>
        <p id="LocationDescription">
          <span className="capitalize font-semibold">description:</span>
          <br></br>
          {description}
        </p>
      </div>
    </div>
  );
}
