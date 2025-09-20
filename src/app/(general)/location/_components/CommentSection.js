"use client";

import Link from "next/link";
import { useState } from "react";

import CommentCard from "./CommentCard";

export default function CommentSection({ locationId, comments: DBcomments }) {
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
    <div id="CommentSection">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">comments</h2>
        <Link
          href={`/create/comment?location_id=${locationId}`}
          className="btn text-sm rounded-sm px-4 py-3 transition-colors"
        >
          leave a comment
        </Link>
      </div>
      <div id="Comments" className="posts-container gap-2 mt-4">
        {comments.map((comment) => (
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
