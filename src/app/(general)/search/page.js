import { auth } from "@/auth";
import { getSearchAbstractLocations } from "@/lib/dal";

import FilterableLocationPosts from "./_components/FilterableLocationPosts";

export default async function Page() {
  const locations = await getSearchAbstractLocations();

  const session = await auth();
  const sessionUserID = session ? session.user.id : null;

  // security
  // check session ownership of locations (add one new field isSessionUsersLocations)
  for (const location of locations) {
    location["isSessionUsersLocation"] = false;

    if (sessionUserID && sessionUserID === location.user_id) {
      location["isSessionUsersLocation"] = true;
    }
  }

  return (
    <div
      id="search-page"
      className="flex flex-col gap-4 max-w-[1700px] px-10 mt-14 mx-auto"
    >
      <FilterableLocationPosts locations={locations} />
    </div>
  );
}
