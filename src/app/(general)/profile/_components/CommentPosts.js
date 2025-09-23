"use client";

import { serverActionDeleteComment } from "@/lib/actions";
import { startTransition, useOptimistic, useState } from "react";

import CommentCard from "./CommentCard";

export default function CommentPosts({
  view,
  comments: DBcomments,
  isSessionUsersProfile,
}) {
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
    <div id="CommentPosts" className={`basis-full ${view} lg:block`}>
      <h2 className="text-lg md:text-xl font-medium">comments</h2>
      <div
        id="Comments"
        className="posts-container p-3 md:p-4 lg:p-6 gap-2 mt-4"
      >
        {optimisticComments.map((comment) => (
          <CommentCard
            onDeleteClick={handleDeleteComment}
            key={comment.comment_id}
            commentId={comment.comment_id}
            locationId={comment.location_id}
            locationName={comment.location_name}
            comment={comment.comment}
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
            isSessionUsersProfile={isSessionUsersProfile}
          />
        ))}
      </div>
    </div>
  );
}
