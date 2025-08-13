"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteComment } from "@/db/comment/actions";

export default function CommentCard({ comment }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEditClick = () => {
    startTransition(() => {
      router.push(`/update/comment/${comment.id}`);
    });
  };

  const handleDeleteClick = () => {
    startTransition(async () => {
      const deletedCommentId = await deleteComment(comment.id);
      startTransition(() => {
        // update UI for deleted comment
        console.log(`Comment with ID ${deletedCommentId} deleted.`);
      });
    });
  };

  return (
    <div
      id={comment.id}
      className="flex flex-col bg-white text-black w-full gap-1 py-[0.25em] px-[0.5em]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image alt="profile" src="/globe.svg" width={40} height={40} />
          <h4 className="text-lg">@{comment.username}</h4>
        </div>
        <menu className="flex gap-4">
          <menu className="flex gap-4">
            <li>
              <button
                disabled={isPending}
                onClick={handleEditClick}
                className="cursor-pointer"
              >
                {isPending ? "redirecting ..." : "edit"}
              </button>
            </li>
            <li>
              <button
                disabled={isPending}
                onClick={handleDeleteClick}
                className="cursor-pointer"
              >
                {isPending ? "deleting ..." : "delete"}
              </button>
            </li>
          </menu>
        </menu>
      </div>
      <p className="text-pretty">{comment.comment}</p>
      <div className="flex gap-2">
        <span>Upvotes: {comment.upvotes}</span>
        <span>Downvotes: {comment.downvotes}</span>
      </div>
    </div>
  );
}
