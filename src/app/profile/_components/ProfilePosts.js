import LocationPosts from "./LocationPosts";
import CommentPosts from "./CommentPosts";

export default function ProfilePosts({
  locations,
  comments,
  isSessionUsersProfile,
}) {
  return (
    <div id="ProfilePosts" className="flex gap-20">
      <LocationPosts
        locations={locations}
        isSessionUsersProfile={isSessionUsersProfile}
      />
      <CommentPosts
        comments={comments}
        isSessionUsersProfile={isSessionUsersProfile}
      />
    </div>
  );
}
