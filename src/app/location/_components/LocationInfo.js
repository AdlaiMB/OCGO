import Image from "next/image";

function TopSection({ location }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        <h1 className="text-4xl font-bold">{location.name}</h1>
        <div className="ml-auto flex gap-1">
          <span className="py-[0.25em] px-[0.25em] bg-white text-black text-sm capitalize">
            {location.city}
          </span>
          <span className="py-[0.25em] px-[0.25em] bg-white text-black text-sm capitalize">
            {location.category}
          </span>
        </div>
      </div>
      <Image
        className="bg-gray-200"
        alt="profile"
        src="/vercel.svg"
        width={150}
        height={150}
      />
      <span className="font-medium text-sm text-gray-200">
        @{location.authorUsername}
      </span>
    </div>
  );
}

function BottomSection({ location }) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-2">
        <ul className="basis-full flex">
          <li>
            <span className="font-semibold capitalize">address: </span>
            {location.address}
          </li>
          <li className="ml-auto">
            <span className="font-semibold capitalize">links: </span>
            {location.url}
          </li>
        </ul>
        <li>
          <span className="font-semibold capitalize">hours: </span>Monday: 10 am
          - 8 pm
        </li>
      </ul>
      <p>
        <span className="font-semibold capitalize">description :</span>
        <br></br>
        {location.description}
      </p>
    </div>
  );
}

export default function LocationInfo({ location }) {
  return (
    <div id="location-info-section" className="flex flex-col gap-5">
      <TopSection location={location} />
      <BottomSection location={location} />
    </div>
  );
}
