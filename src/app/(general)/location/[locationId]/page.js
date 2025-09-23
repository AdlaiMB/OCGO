import { auth } from "@/auth";
import {
  getLocationByLocationId,
  getCommentsByLocationId,
  getCommentVote,
} from "@/lib/dal";

import LocationContent from "../_components/LocationContent";
import CommentSection from "../_components/CommentSection";

export default async function Page({ params }) {
  const { locationId } = await params;
  const {
    user_id,
    user_name,
    location_name,
    city,
    category,
    address,
    url,
    description,
    hours,
  } = await getLocationByLocationId(locationId);
  const comments = await getCommentsByLocationId(locationId);

  const session = await auth();
  const sessionUserID = session ? session.user.id : null;

  // security
  // check session user ownership of profile page
  const isLocationOwner =
    sessionUserID && sessionUserID === user_id ? true : false;

  // check session user ownership of comments (add two new fields isSessionUsersComment, sessionUserVote)
  for (const comment of comments) {
    comment["isSessionUsersComment"] = false;
    comment["sessionUsersVote"] = null;

    if (!sessionUserID) {
      continue;
    }

    if (sessionUserID === comment.user_id) {
      comment["isSessionUsersComment"] = true;
    }

    const { vote } = await getCommentVote(sessionUserID, comment.comment_id);
    comment["sessionUsersVote"] = vote ? vote : null;
  }

  return (
    <div
      id="Location"
      className="flex flex-col gap-10 max-w-[1700px] px-2 md:px-10 mt-14 mx-auto"
    >
      <LocationContent
        isSessionUsersLocation={isLocationOwner}
        owner={user_name}
        locationId={locationId}
        locationName={location_name}
        city={city}
        category={category}
        address={address}
        url={url}
        description={description}
        hours={hours}
      />
      <CommentSection locationId={locationId} comments={comments} />
    </div>
  );
}
