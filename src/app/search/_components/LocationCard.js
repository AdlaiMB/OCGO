import Link from "next/link";

export default function LocationCard({ location }) {
  return (
    <div className="flex flex-col gap-1 bg-white text-black w-full py-[0.25em] px-[0.5em]">
      <div className="flex gap-4 items-center">
        <Link href="/" className="font-semibold capitalize">
          {location.name}
        </Link>
        <div className="flex gap-1">
          <span className="py-[0.25em] px-[0.25em] bg-black text-white text-sm capitalize">
            {location.city}
          </span>
          <span className="py-[0.25em] px-[0.25em] bg-black text-white text-sm capitalize">
            {location.category}
          </span>
        </div>
        <span className="ml-auto font-medium text-black">
          @{location.authorUsername}
        </span>
      </div>
      <address className="not-italic">
        <ul>
          <li>
            <span className="font-semibold capitalize">address: </span>
            {location.address}
          </li>
        </ul>
      </address>
    </div>
  );
}
