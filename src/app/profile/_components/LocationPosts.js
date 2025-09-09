import LocationCard from "./LocationCard";
import Link from "next/link";

export default function LocationPosts({ locations, isSessionUsersProfile }) {
  return (
    <div id="LocationPosts" className="basis-full">
      <div className="flex justify-between">
        <h2 className="text-xl">Locations</h2>
        {isSessionUsersProfile && (
          <div>
            <Link
              href="/create/location"
              className="text-sm rounded-sm px-2 py-1 transition-colors bg-slate-600 hover:bg-slate-500 cursor-pointer"
            >
              Create
            </Link>
          </div>
        )}
      </div>
      <div id="Locations" className="flex flex-col gap-2 mt-4">
        {locations.map((location) => (
          <LocationCard
            key={location.location_id}
            locationId={location.location_id}
            locationName={location.name}
            city={location.city}
            category={location.category}
            description={location.description}
            isSessionUsersProfile={isSessionUsersProfile}
          />
        ))}
      </div>
    </div>
  );
}
