import CommentCard from "../_components/CommentCard";
import CommentSection from "../_components/CommentSection";
import LocationInfo from "../_components/LocationInfo";

import { getLocationById } from "@/db/location/actions";
import { getCommentsByLocation } from "@/db/comment/actions";

export default async function Page({ params }) {
  const { slug } = await params;
  const location = await getLocationById(slug);
  const comments = await getCommentsByLocation(slug);

  const list = {
    header: "comments",
    posts: comments,
    renderFunction: (post) => <CommentCard comment={post} />,
  };

  return (
    <div
      id="location-page"
      className="mx-[138px] min-h-screen flex flex-col py-[5%] gap-10"
    >
      <LocationInfo location={location} />
      <CommentSection
        header={list.header}
        posts={list.posts}
        renderFunction={list.renderFunction}
      />
    </div>
  );
}
