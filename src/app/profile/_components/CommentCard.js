"use client";
import Link from "next/link";
import { useTransition } from "react";
import { deleteComment } from "@/db/comment/actions";

export default function CommentCard({ comment }) {
  const [isPending, startTransition] = useTransition();

  const onDeleteHandler = () => {
    startTransition(async () => {
      const deletedCommentId = await deleteComment(comment.id);
      startTransition(() => {
        if (deletedCommentId) {
          console.log(`Comment with ID ${deletedCommentId} deleted.`);
        } else {
          console.log("Failed to delete comment.");
        }
      });
    });
  };

  const originalComment = comment.comment.split(" ");
  const shortenedComment =
    originalComment.length > 15
      ? originalComment.slice(0, 15).join(" ") + " ..."
      : originalComment.join(" ");

  return (
    <div className="flex flex-col gap-1 bg-white text-black w-full py-[0.25em] px-[0.5em]">
      <div className="flex justify-between">
        <Link
          href={`/location/${comment.id}`}
          className="font-semibold capitalize"
        >
          {comment.locationname}
        </Link>
        <menu className="flex gap-2">
          <li>
            <button
              disabled={isPending}
              className="cursor-pointer py-0.5 px-1 bg-black text-white text-xs"
            >
              edit
            </button>
          </li>
          <li>
            <button
              disabled={isPending}
              className="cursor-pointer py-0.5 px-1 bg-black text-white text-xs"
              onClick={onDeleteHandler}
            >
              delete
            </button>
          </li>
        </menu>
      </div>
      <p>{shortenedComment}</p>
      <div className="flex gap-2">
        <span>Upvotes: {comment.upvotes}</span>
        <span>Downvotes: {comment.downvotes}</span>
      </div>
    </div>
  );
}
