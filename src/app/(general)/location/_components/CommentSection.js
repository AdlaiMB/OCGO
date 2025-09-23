"use client";

import Link from "next/link";
import { serverActionDeleteComment } from "@/lib/actions";
import { startTransition, useOptimistic, useState } from "react";

import CommentCard from "./CommentCard";

export default function CommentSection({ locationId, comments: DBcomments }) {
  const [comments, setComments] = useState(DBcomments);
  const [optimisticComments, removeOptimisticComment] = useOptimistic(
    comments,
    (comments, deletedCommentId) =>
      [...comments].filter((comment) => comment.comment_id !== deletedCommentId)
  );

  const handleDeleteComment = (commentId) => {
    startTransition(() => {
      removeOptimisticComment(commentId);

      startTransition(async () => {
        const response = await serverActionDeleteComment(commentId);

        if (!response.success) {
          console.log(response.error);
          return;
        }

        const { comment_id } = response;

        startTransition(() => {
          if (commentId === comment_id) {
            setComments((comments) =>
              [...comments].filter(
                (comment) => comment.comment_id !== commentId
              )
            );
          }
        });
      });
    });
  };

  return (
    <div id="CommentSection">
      <div className="flex items-center justify-between">
        <h2 className="text-lg md:text-xl font-medium">comments</h2>
        <Link
          href={`/create/comment?location_id=${locationId}`}
          className="btn text-xs md:text-sm rounded-sm px-4 py-3 transition-colors"
        >
          leave a comment
        </Link>
      </div>
      <div
        id="Comments"
        className="posts-container p-3 md:p-4 lg:p-6 gap-2 mt-4"
      >
        {optimisticComments.map((comment) => (
          <CommentCard
            onDeleteClick={handleDeleteComment}
            key={comment.comment_id}
            isSessionUsersComment={comment.isSessionUsersComment}
            sessionUsersVote={comment.sessionUsersVote}
            owner={comment.user_name}
            commentId={comment.comment_id}
            comment={comment.comment}
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
          />
        ))}
      </div>
    </div>
  );
}
