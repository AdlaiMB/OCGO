import Link from "next/link";
import DropDownHours from "./DropDownHours";

export default function LocationContent({
  isSessionUsersLocation,
  owner,
  locationId,
  locationName,
  city,
  category,
  address,
  url,
  description,
  hours: DBhours,
}) {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const currentDay = days[new Date().getDay()];
  const hours = {};

  const convertToSTDTime = (time) => {
    const [h, minutes] = time.split(":");
    const hours = Number(h);

    if (hours <= 11) {
      return `${hours === 0 ? 12 : hours}:${minutes} AM`;
    } else {
      return `${hours === 12 ? hours : hours - 12}:${minutes} PM`;
    }
  };

  for (const hour of days) {
    if (!DBhours[hour]) {
      hours[hour] = ["closed", null];
      continue;
    }

    const [open, close] = DBhours[hour];
    hours[hour] = [convertToSTDTime(open), convertToSTDTime(close)];
  }

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
          {isSessionUsersLocation && (
            <Link
              href={`/update/location/${locationId}`}
              className="btn text-xs md:text-sm rounded-sm px-4 py-2 transition-colors"
            >
              edit
            </Link>
          )}
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
        <DropDownHours hours={hours} currentDay={currentDay} />
        <p id="LocationDescription">
          <span className="capitalize font-semibold">description:</span>
          <br></br>
          {description}
        </p>
      </div>
    </div>
  );
}
