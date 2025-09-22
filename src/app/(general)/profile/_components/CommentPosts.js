"use client";

import CommentCard from "./CommentCard";
import { useState } from "react";

export default function CommentPosts({
  view,
  comments: DBcomments,
  isSessionUsersProfile,
}) {
  const [comments, setComments] = useState(DBcomments);

  const handleDeleteComment = (commentId) => {
    const newComments = [];

    for (const comment of comments) {
      if (comment.comment_id === commentId) {
        continue;
      }

      newComments.push(comment);
    }

    setComments(newComments);
  };

  return (
    <div id="CommentPosts" className={`basis-full ${view} lg:block`}>
      <h2 className="text-lg md:text-xl font-medium">comments</h2>
      <div
        id="Comments"
        className="posts-container p-3 md:p-4 lg:p-6 gap-2 mt-4"
      >
        {comments.map((comment) => (
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
