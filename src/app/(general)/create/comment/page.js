"use client";

import { useActionState, useEffect, use } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { serverActionCreateComment } from "@/lib/actions";

export default function Page({ searchParams }) {
  const { location_id } = use(searchParams);

  const [state, action, isPending] = useActionState(
    serverActionCreateComment,
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
    <div
      id="CommentFormPage"
      className="max-w-[1700px] px-2 md:px-10 mt-14 mx-auto"
    >
      {state && (
        <div
          className={`p-2 mb-4 rounded-md border text-sm md:text-base ${
            state.success
              ? "bg-green-800 border-green-600"
              : "bg-red-800 border-red-600"
          }`}
        >
          <p>
            {state.success
              ? "Comment post successful. You will be redirected to the location of the posted comment."
              : `Comment post unsuccessful. ${state.error}`}
          </p>
        </div>
      )}
      <div id="CommentForm" className="posts-container p-3 md:p-4 lg:p-6">
        <h1 className="text-2xl md:text-3xl font-semibold">post comment</h1>
        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="location_id" defaultValue={location_id} />
          <label
            htmlFor="comment"
            className="text-sm md:text-base font-normal capitalize"
          >
            comment
          </label>
          <textarea
            name="comment"
            id="comment"
            placeholder="enter comment ..."
            rows="7"
            required
            className="text-sm md:text-base border border-[#333333] p-2 rounded-md focus:border-blue-500 focus:outline-none focus:ring-0"
          />

          <button
            disabled={isPending}
            className="btn text-sm md:text-base py-4 px-7 rounded-md self-baseline transition-colors"
          >
            {isPending ? "posting ..." : "post"}
          </button>
        </form>
      </div>
    </div>
  );
}
