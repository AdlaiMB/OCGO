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
    <div className="card-outside">
      <div className="card-inside flex flex-col gap-2">
        <div
          className={`grid ${
            isSessionUsersProfile ? "grid-cols-[65%_auto]" : "grid-cols-1"
          } items-center w-full`}
        >
          <Link
            href={`/location/${locationId}#${commentId}`}
            className="truncate text-sm md:text-base font-semibold"
          >
            {locationName}
          </Link>
          {isSessionUsersProfile && (
            <div className="flex gap-2 justify-self-end relative">
              <Link
                href={`/update/comment/${commentId}`}
                className="btn text-xs md:text-sm flex items-center rounded-sm px-2 py-1 transition-colors hover:bg-[#111111]"
              >
                edit
              </Link>
              <button
                onClick={() => setModalDisplay(!modalDisplay)}
                className="btn text-xs md:text-sm rounded-sm px-2 py-1 transition-colors hover:bg-[#111111]"
              >
                delete
              </button>
              {modalDisplay && (
                <div className="w-[300px] dropdown-menu flex-col gap-2 absolute right-0 top-8 rounded-sm text-sm">
                  <p>are you sure you want to delete?</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDeleteClick(commentId)}
                      className="text-sm rounded-sm px-3 py-1 transition-colors border bg-green-800 border-green-600 hover:bg-green-700 cursor-pointer"
                    >
                      yes
                    </button>
                    <button
                      onClick={() => setModalDisplay(false)}
                      className="text-sm rounded-sm px-3 py-1 transition-colors border bg-red-800 border-red-600 hover:bg-red-700 cursor-pointer"
                    >
                      no
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-sm md:text-base">{shortenedComment}</p>
        <div className="flex gap-4">
          <span className="text-sm md:text-base">upvotes: {upvotes}</span>
          <span className="text-sm md:text-base">downvotes: {downvotes}</span>
        </div>
      </div>
    </div>
  );
}
