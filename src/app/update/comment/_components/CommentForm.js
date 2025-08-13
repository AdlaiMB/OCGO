"use client";
import { updateComment } from "@/db/comment/actions";
import { useActionState } from "react";

export default function CommentForm({ comment }) {
  const [state, action, isPending] = useActionState(updateComment, null);

  return (
    <form action={action}>
      <h2>Edit Comment {`@${comment.locationname}`}</h2>
      <input type="hidden" name="commentId" value={comment.id} />
      <div>
        <label htmlFor="comment">Comment:</label>
        <textarea
          id="comment"
          name="comment"
          defaultValue={comment.comment}
        ></textarea>
      </div>
      <button type="submit" disabled={isPending}>
        {isPending ? "Updaing ..." : "Update"}
      </button>
    </form>
  );
}
