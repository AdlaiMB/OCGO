"use client";

import Link from "next/link";
import { useState } from "react";

export default function CommentCard({
  onDeleteClick,
  commentId,
  locationId,
  locationName,
  comment,
  upvotes,
  downvotes,
  isSessionUsersProfile,
}) {
  const [modalDisplay, setModalDisplay] = useState(false);
  const splitComment = comment.split(" ");
  const shortenedComment =
    splitComment.length > 15
      ? splitComment.slice(0, 15).join(" ") + " ..."
      : splitComment.join(" ");

  return (
    <div className="flex flex-col gap-2 p-2 border rounded-md bg-gray-900 border-gray-500">
      <div className="flex justify-between">
        <Link
          href={`/location/${locationId}#${commentId}`}
          className="text-base font-semibold"
        >
          {locationName}
        </Link>
        {isSessionUsersProfile && (
          <div className="flex gap-2 relative">
            <Link
              href={`/update/comment/${commentId}`}
              className="text-sm rounded-sm px-2 py-1 transition-colors bg-slate-600 hover:bg-slate-500 cursor-pointer"
            >
              edit
            </Link>
            <button
              onClick={() => setModalDisplay(!modalDisplay)}
              className="text-sm rounded-sm px-2 py-1 transition-colors bg-slate-600 hover:bg-slate-500 cursor-pointer"
            >
              delete
            </button>
            {modalDisplay && (
              <div className="w-[300px] p-0.5 z-10 absolute right-0 top-10 rounded-sm text-sm text-black bg-white">
                <p>are you sure you want to delete?</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => onDeleteClick(commentId)}
                    className="text-sm rounded-sm px-2 py-1 transition-colors bg-green-800 hover:bg-green-500 cursor-pointer"
                  >
                    yes
                  </button>
                  <button
                    onClick={() => setModalDisplay(false)}
                    className="text-sm rounded-sm px-2 py-1 transition-colors bg-red-800 hover:bg-red-500 cursor-pointer"
                  >
                    no
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <p className="text-base">{shortenedComment}</p>
      <div className="flex gap-4">
        <span className="text-base">Upvotes: {upvotes}</span>
        <span className="text-base">Downvotes: {downvotes}</span>
      </div>
    </div>
  );
}
