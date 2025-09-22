import LocationCard from "./LocationCard";

export default function LocationPosts({
  locations: DBlocations,
  filterSearch,
  filterCitys,
  filterCategories,
}) {
  const locations = [];

  DBlocations.forEach((location) => {
    if (
      !location.location_name
        .toLowerCase()
        .startsWith(filterSearch.toLowerCase())
    ) {
      return;
    }

    if (filterCitys.size !== 0 && !filterCitys.has(location.city)) {
      return;
    }

    if (
      filterCategories.size !== 0 &&
      !filterCategories.has(location.category)
    ) {
      return;
    }

    locations.push(
      <LocationCard
        key={location.location_id}
        owner={location.user_name}
        isSessionUsersLocation={location.isSessionUsersLocation}
        locationId={location.location_id}
        locationName={location.location_name}
        city={location.city}
        category={location.category}
        address={location.address}
      />
    );
  });

  return (
    <div id="LocationPosts" className="basis-full">
      <div id="Comments" className="posts-container p-3 md:p-4 lg:p-6">
        {locations}
      </div>
    </div>
  );
}
