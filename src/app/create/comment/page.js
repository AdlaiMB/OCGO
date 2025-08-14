"use client";
import { useActionState } from "react";
import { createComment } from "@/db/comment/actions.js";

export default function Page() {
  const [state, action, isPending] = useActionState(createComment, null);

  return (
    <form action={action}>
      <label htmlFor="comment">enter comment: </label>
      <textarea name="comment" id="comment" />
      <button type="submit">Submit</button>
    </form>
  );
}
