import LocationCard from "./LocationCard";
import Link from "next/link";

export default function LocationPosts({ locations, isSessionUsersProfile }) {
  return (
    <div id="LocationPosts" className="basis-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">locations</h2>
        {isSessionUsersProfile && (
          <div>
            <Link
              href="/create/location"
              className="btn text-sm rounded-sm p-2 transition-colors"
            >
              create
            </Link>
          </div>
        )}
      </div>
      <div id="Locations" className="posts-container gap-2 mt-4">
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
