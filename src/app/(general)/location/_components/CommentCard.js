"use client";

import Link from "next/link";
import { useState, useOptimistic, startTransition } from "react";

import {
  serverActionCreateVote,
  serverActionDeleteVote,
  serverActionUpdateVote,
} from "@/lib/actions";

export default function CommentCard({
  onDeleteClick,
  owner,
  isSessionUsersComment,
  sessionUsersVote,
  commentId,
  comment,
  upvotes: DBupvotes,
  downvotes: DBdownvotes,
}) {
  const [modalDisplay, setModalDisplay] = useState(false);
  const [vote, setVote] = useState(sessionUsersVote);
  const [upvotes, setUpvotes] = useState(parseInt(DBupvotes));
  const [downvotes, setDownvotes] = useState(parseInt(DBdownvotes));

  const [optimisticVote, setOptimisticVote] = useOptimistic(
    vote,
    (currVote, newVote) => newVote
  );
  const [optimisticUpvotes, setOptimisticUpvotes] = useOptimistic(
    upvotes,
    (currUpvotes, upvoteIncrement) => currUpvotes + upvoteIncrement
  );
  const [optimisticDownvotes, setOptimisticDownvotes] = useOptimistic(
    downvotes,
    (currDownvotes, downvoteIncrement) => currDownvotes + downvoteIncrement
  );

  const handleVoteClick = (commentId, newVote) => {
    startTransition(() => {
      // create a new vote
      if (vote === null) {
        setOptimisticVote(newVote);

        if (newVote === "upvote") {
          setOptimisticUpvotes(1);
        }

        if (newVote === "downvote") {
          setOptimisticDownvotes(1);
        }

        // make server action call
        startTransition(async () => {
          const response = await serverActionCreateVote(commentId, newVote);

          if (!response.success) {
            console.log(response.error);
            return;
          }

          const { comment_id, vote: DBvote } = response;

          startTransition(() => {
            if (commentId === comment_id && newVote === DBvote) {
              setVote(newVote);

              if (newVote === "upvote") {
                setUpvotes(upvotes + 1);
              }

              if (newVote === "downvote") {
                setDownvotes(downvotes + 1);
              }
            }
          });
        });
      }

      // update vote
      else if (vote !== newVote) {
        setOptimisticVote(newVote);

        if (newVote === "upvote") {
          setOptimisticDownvotes(-1);
          setOptimisticUpvotes(1);
        }

        if (newVote === "downvote") {
          setOptimisticDownvotes(1);
          setOptimisticUpvotes(-1);
        }

        // make server action call
        startTransition(async () => {
          const response = await serverActionUpdateVote(commentId, newVote);

          if (!response.success) {
            console.log(response.error);
          }

          const { comment_id, vote: DBvote } = response;

          startTransition(() => {
            if (commentId === comment_id && newVote === DBvote) {
              setVote(newVote);

              if (newVote === "upvote") {
                setDownvotes(downvotes - 1);
                setUpvotes(upvotes + 1);
              }

              if (newVote === "downvote") {
                setDownvotes(downvotes + 1);
                setUpvotes(upvotes - 1);
              }
            }
          });
        });
      }

      // delete vote
      else if (vote === newVote) {
        setOptimisticVote(null);

        if (newVote === "upvote") {
          setOptimisticUpvotes(-1);
        }

        if (newVote === "downvote") {
          setOptimisticDownvotes(-1);
        }

        // make server action call
        startTransition(async () => {
          const response = await serverActionDeleteVote(commentId);

          if (!response.success) {
            console.log(response.error);
            return;
          }

          const { comment_id } = response;

          startTransition(() => {
            if (commentId === comment_id) {
              setVote(null);

              if (newVote === "upvote") {
                setUpvotes(upvotes - 1);
              }

              if (newVote === "downvote") {
                setDownvotes(downvotes - 1);
              }
            }
          });
        });
      }
    });
  };

  return (
    <div id={commentId} className="card-outside">
      <div className="card-inside flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full w-[35px] h-[35px] border text-black bg-white">
              {owner ? owner[0] : "d"}
            </div>
            {owner ? (
              <Link
                id="LocationOwner"
                href={`/profile/${owner}`}
                className="text-sm md:text-base"
              >
                @{owner}
              </Link>
            ) : (
              <span className="text-sm md:text-base">deleted</span>
            )}
          </div>
          {isSessionUsersComment && (
            <div className="flex gap-2 relative">
              <Link
                href={`/update/comment/${commentId}`}
                className="btn text-xs md:text-sm rounded-sm px-2 py-1 transition-colors hover:bg-[#111111]"
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
        <p className="text-sm md:text-base">{comment}</p>
        <div className="flex gap-4">
          <div className="flex gap-1 items-center">
            <button
              onClick={() => handleVoteClick(commentId, "upvote")}
              className={`${
                optimisticVote === "upvote" ? "border-green-700" : ""
              } btn text-xs md:text-sm rounded-sm p-2 transition-colors hover:bg-[#111111]`}
            >
              upvote
            </button>
            <span className="text-base md:text-lg">{optimisticUpvotes}</span>
          </div>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => handleVoteClick(commentId, "downvote")}
              className={`${
                optimisticVote === "downvote" ? "border-red-700" : ""
              } btn text-xs md:text-sm rounded-sm p-2 transition-colors hover:bg-[#111111]`}
            >
              downvote
            </button>
            <span className="text-base md:text-lg">{optimisticDownvotes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
