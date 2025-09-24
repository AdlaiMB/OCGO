import { auth } from "@/auth";
import {
  getUserByUsername,
  getAbstractLocationsByUserId,
  getAbstractCommentsByUserId,
} from "@/lib/dal";

import ProfileHeader from "../_components/ProfileHeader";
import ProfilePosts from "../_components/ProfilePosts";

export default async function Page({ params }) {
  const { username } = await params;
  const { user_id, name, bio } = await getUserByUsername(username);

  if (!user_id) {
    return (
      <div
        id="Location"
        className="flex flex-col gap-10 max-w-[1700px] px-2 md:px-10 mt-14 mx-auto"
      >
        <div className="posts-container p-3 md:p-4 lg:p-6 gap-2">
          <h1 className="text-2xl md:text-3xl">User not found!</h1>
        </div>
      </div>
    );
  }

  const locations = await getAbstractLocationsByUserId(user_id);
  const comments = await getAbstractCommentsByUserId(user_id);

  const session = await auth();
  const sessionUserID = session ? session.user.id : null;

  // security
  // check session user ownership of profile page
  const isProfileOwner = sessionUserID === user_id;

  return (
    <div
      id="Profile"
      className="flex flex-col gap-10 max-w-[1700px] px-2 md:px-10 mt-14 mx-auto"
    >
      <ProfileHeader
        name={name}
        bio={bio}
        isSessionUsersProfile={isProfileOwner}
      />
      <ProfilePosts
        locations={locations}
        comments={comments}
        isSessionUsersProfile={isProfileOwner}
      />
    </div>
  );
}
