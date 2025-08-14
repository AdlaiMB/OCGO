import { getLocationById } from "@/db/location/actions";
import LocationForm from "../_components/LocationForm";

export default async function Page({ params }) {
  const { locationId } = await params;
  const location = await getLocationById(locationId);

  return <LocationForm location={location} />;
}
