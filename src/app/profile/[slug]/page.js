import ProfileInfo from "../_components/ProfileInfo";
import ProfilePosts from "../_components/ProfilePosts";
import CommentCard from "../_components/CommentCard";
import LocationCard from "../_components/LocationCard";
import { getUser } from "@/db/user/actions";
import { getLocationByUser } from "@/db/location/actions";
import { getCommentsByUser } from "@/db/comment/actions";

export default async function Page({ params }) {
  const { slug } = await params;

  const user = await getUser(slug);
  const usersLocations = await getLocationByUser(slug);
  const usersComments = await getCommentsByUser(slug);

  const postLists = [
    {
      header: "locations",
      posts: usersLocations,
      renderFunction: (post) => <LocationCard location={post} />,
    },
    {
      header: "comments",
      posts: usersComments,
      renderFunction: (post) => <CommentCard comment={post} />,
    },
  ];

  return (
    <div
      id="profile-page"
      className="mx-[138px] h-screen flex flex-col py-[5%] gap-[15%]"
    >
      <ProfileInfo user={user} />
      <ProfilePosts postLists={postLists} />
    </div>
  );
}
