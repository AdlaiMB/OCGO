import Link from "next/link";

export default function CommentCard({ comment }) {
  const originalComment = comment.comment.split(" ");
  const shortenedComment =
    originalComment.length > 15
      ? originalComment.slice(0, 15).join(" ") + " ..."
      : originalComment.join(" ");

  return (
    <div className="flex flex-col gap-1 bg-white text-black w-full py-[0.25em] px-[0.5em]">
      <div>
        <Link
          href={`/location/${comment.location_id}#${comment.id}`}
          className="font-semibold capitalize"
        >
          {comment.locationname}
        </Link>
      </div>
      <p>{shortenedComment}</p>
      <div className="flex gap-2">
        <span>Upvotes: {comment.upvotes}</span>
        <span>Downvotes: {comment.downvotes}</span>
      </div>
    </div>
  );
}
