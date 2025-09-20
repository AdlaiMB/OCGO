"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { serverActionUpdateComment } from "@/lib/actions";

export default function CommentForm({ commentId, comment }) {
  const [state, action, isPending] = useActionState(
    serverActionUpdateComment,
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (!state || !state.success) {
      return;
    }
    setTimeout(() => {
      router.push(`/location/${state.location_id}#${state.comment_id}`);
    }, 1500);
  }, [state]);

  return (
    <div id="CommentFormPage" className="max-w-[1700px] px-10 mt-14 mx-auto">
      {state && (
        <div
          className={`p-2 mb-4 rounded-md border ${
            state.success
              ? "bg-green-800 border-green-600"
              : "bg-red-800 border-red-600"
          }`}
        >
          <p>
            {state.success
              ? "Update comment successful. You will be redirected to the location of the posted comment."
              : `Update comment unsuccessful. ${state.error}`}
          </p>
        </div>
      )}
      <div id="CommentForm" className="posts-container">
        <h1 className="text-3xl font-semibold">update comment</h1>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="id" defaultValue={commentId} />
          <label htmlFor="comment" className="font-normal capitalize">
            comment
          </label>
          <textarea
            name="comment"
            id="comment"
            placeholder="enter comment ..."
            rows="7"
            defaultValue={comment}
            required
            className="border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          ></textarea>
          <button
            disabled={isPending}
            className="btn py-4 px-7 rounded-md self-baseline transition-colors"
          >
            {isPending ? "updating ..." : "update"}
          </button>
        </form>
      </div>
    </div>
  );
}
