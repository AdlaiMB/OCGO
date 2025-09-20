import { auth } from "@/auth";
import { getLocationOwnerId, getLocationByLocationId } from "@/lib/dal";

import { redirect } from "next/navigation";

import LocationForm from "../_components/LocationForm";

export default async function Page({ params }) {
  const { locationId } = await params;

  // 1-tier security
  // 1st check: check is user owns the location
  const session = await auth();
  const { user_id } = await getLocationOwnerId(locationId);

  if (session.user.id !== user_id) {
    redirect(`/profile/${session.user.name}`); // TODO : Fix the redirect link for all redirects
  }

  // fetch the location data
  const { location_name, city, category, address, url, description, hours } =
    await getLocationByLocationId(locationId);

  return (
    <LocationForm
      id={locationId}
      name={location_name}
      city={city}
      category={category}
      address={address}
      url={url}
      description={description}
      hours={hours}
    />
  );
}
